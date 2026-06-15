const path = require("path");
const { RAKUTEN } = require(path.join(__dirname, "..", "..", "..", "affiliate", "central-config"));

const RAKUTEN_AFFILIATE_PATH = RAKUTEN.affiliatePath;

function rakutenAffiliateUrl(rakutenProductUrl) {
  return RAKUTEN.productUrl(rakutenProductUrl);
}

function rakutenSearchAffiliateUrl(keyword) {
  return RAKUTEN.searchUrl(keyword);
}

function decodeBuffer(buf, charsetHint) {
  const hint = String(charsetHint || "utf-8")
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/"/g, "");
  const map = {
    "utf-8": "utf-8",
    "euc-jp": "euc-jp",
    "shift-jis": "shift_jis",
    "shiftjis": "shift_jis",
    "windows-31j": "shift_jis",
    sjis: "shift_jis"
  };
  const enc = map[hint] || "utf-8";
  try {
    return new TextDecoder(enc).decode(buf);
  } catch {
    return buf.toString("utf8");
  }
}

function hasMojibake(text) {
  const s = String(text || "");
  if (!s) return false;
  if (s.includes("\uFFFD")) return true;
  return /ʡ|ޥ|Ǻ|֥|̾|¥|Ê|Ë|Ì|Î|Ï|å|¤|¼|½|¾/.test(s);
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept-Language": "ja,en;q=0.9"
    },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  let charset = "";
  const ct = res.headers.get("content-type") || "";
  const ctm = ct.match(/charset=([^;\s]+)/i);
  if (ctm) charset = ctm[1].replace(/"/g, "");
  if (!charset) {
    const head = buf.slice(0, 5000).toString("ascii");
    const meta = head.match(/charset\s*=\s*["']?([^"'\s>]+)/i);
    if (meta) charset = meta[1];
  }
  return decodeBuffer(buf, charset);
}

function firstMatch(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return "";
}

function decodeHtml(text) {
  return String(text || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function isBadProductName(name) {
  if (!name || name === "商品" || name.length < 3) return true;
  if (/獲得予定|javascript|�|^\?+$/.test(name)) return true;
  if (/元自衛官目線|楽天で失敗|：楽天/.test(name)) return true;
  if (hasMojibake(name)) return true;
  if (/^[\x00-\x08\x0e-\x1f]+$/.test(name)) return true;
  return false;
}

function displayProductName(raw, fallback, index = 0) {
  const cleaned = cleanProductName(raw);
  if (!isBadProductName(cleaned)) return cleaned;
  const base = cleanProductName(fallback) || "候補商品";
  if (base.length > 40) return index > 0 ? `${base.slice(0, 28)}…（候補${index + 1}）` : base.slice(0, 36);
  return index > 0 ? `${base}（候補${index + 1}）` : base;
}

function cleanProductName(name) {
  return decodeHtml(name)
    .replace(/\s*[|｜\-–—].*$/, "")
    .replace(/【[^】]{0,40}】/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function collectProductNameCandidates(html) {
  const out = [];
  const push = (raw) => {
    const c = cleanProductName(raw);
    if (c && !out.includes(c)) out.push(c);
  };
  for (const m of html.matchAll(/"@type"\s*:\s*"Product"[^}]*"name"\s*:\s*"([^"]{4,200})"/gi)) {
    push(m[1]);
  }
  push(
    firstMatch(html, [
      /<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i,
      /<meta[^>]+content="([^"]+)"[^>]+property="og:title"/i,
      /itemprop="name"[^>]+content="([^"]+)"/i,
      /<h1[^>]*>([^<]{4,200})<\/h1>/i,
      /<span[^>]+class="[^"]*item-name[^"]*"[^>]*>([^<]{4,200})</i,
      /<title>([^<]{4,200})<\/title>/i
    ])
  );
  return out;
}

function extractProductName(html, fallback = "商品") {
  for (const candidate of collectProductNameCandidates(html)) {
    if (!isBadProductName(candidate)) return candidate;
  }
  return displayProductName("", fallback);
}

function parseProductPage(html, keywordFallback = "商品") {
  const name = extractProductName(html, keywordFallback);

  const priceRaw = firstMatch(html, [
    /"price"\s*:\s*"?(\d+)"/,
    /itemprop="price"\s+content="(\d+)"/,
    /(?:通常価格|販売価格|価格)[^0-9]{0,20}(\d{1,3}(?:,\d{3})*)/
  ]).replace(/,/g, "");
  const price = priceRaw ? Number(priceRaw) : null;

  const reviewCount = Number(
    firstMatch(html, [/reviewCount["\s:]+(\d+)/i, /(\d+)\s*件のレビュー/, /レビュー\s*[（(](\d+)[)）]/]) || 0
  );

  const rating = firstMatch(html, [/ratingValue["\s:]+([\d.]+)/i, /([1-5]\.\d)\s*(?:点|\/)/]);

  const description = decodeHtml(
    firstMatch(html, [
      /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i,
      /<meta[^>]+name="description"[^>]+content="([^"]+)"/i
    ])
  ).slice(0, 220);

  const specs = [];
  for (const m of html.matchAll(/<th[^>]*>([^<]{1,30})<\/th>\s*<td[^>]*>([^<]{1,100})<\/td>/gi)) {
    const label = decodeHtml(m[1]);
    const value = decodeHtml(m[2]);
    if (label && value && !/javascript|script/i.test(label)) specs.push({ label, value });
    if (specs.length >= 6) break;
  }

  if (specs.length < 3) {
    const bullets = [...html.matchAll(/<li[^>]*>([^<]{10,90})<\/li>/gi)]
      .map((x) => decodeHtml(x[1]))
      .filter((t) => !/cookie|ログイン|カート|送料無料ライン/i.test(t))
      .slice(0, 4);
    bullets.forEach((b, i) => specs.push({ label: `商品の特徴${i + 1}`, value: b }));
  }

  let imageUrl = firstMatch(html, [
    /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
    /"image":"(https:\\\/\\\/[^"]+)"/
  ])
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/");

  if (imageUrl && !imageUrl.includes("_ex=")) {
    imageUrl = imageUrl.includes("?") ? `${imageUrl}&_ex=240x240` : `${imageUrl}?_ex=240x240`;
  }

  return { name, price, reviewCount, rating, description, specs, imageUrl };
}

function extractProductUrls(html, limit = 1) {
  const urls = [];
  const seen = new Set();
  for (const m of html.matchAll(/href="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"/g)) {
    const url = m[1];
    if (seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
    if (urls.length >= limit) break;
  }
  return urls;
}

async function searchFirstProduct(keyword) {
  const hits = await searchTopProducts(keyword, 1);
  return hits[0] || null;
}

async function searchTopProducts(keyword, limit = 3) {
  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  const html = await fetchText(searchUrl);
  const productUrls = extractProductUrls(html, limit);
  if (!productUrls.length) return [];

  const hits = [];
  for (const productUrl of productUrls) {
    try {
      const itemHtml = await fetchText(productUrl);
      const details = parseProductPage(itemHtml);
      let imageUrl = details.imageUrl;
      if (imageUrl && !imageUrl.includes("_ex=")) {
        imageUrl = imageUrl.includes("?") ? `${imageUrl}&_ex=240x240` : `${imageUrl}?_ex=240x240`;
      }
      hits.push({
        keyword,
        name: displayProductName(details.name, keyword, hits.length),
        productUrl,
        imageUrl: imageUrl || "",
        affiliateUrl: rakutenAffiliateUrl(productUrl),
        searchAffiliateUrl: rakutenSearchAffiliateUrl(keyword),
        price: details.price,
        reviewCount: details.reviewCount,
        rating: details.rating,
        description: details.description,
        specs: details.specs
      });
      await new Promise((r) => setTimeout(r, 600));
    } catch {
      /* skip failed item */
    }
  }
  return hits;
}

async function fetchProductDetails(productUrl, keywordFallback = "商品") {
  const itemHtml = await fetchText(productUrl);
  const details = parseProductPage(itemHtml, keywordFallback);
  return {
    productUrl,
    affiliateUrl: rakutenAffiliateUrl(productUrl),
    ...details,
    imageUrl: details.imageUrl || ""
  };
}

async function searchProducts(keywords, delayMs = 900) {
  const out = [];
  const seen = new Set();
  for (const keyword of keywords) {
    if (seen.has(keyword)) continue;
    seen.add(keyword);
    try {
      const hit = await searchFirstProduct(keyword);
      if (hit) out.push(hit);
    } catch (err) {
      out.push({ keyword, error: err.message });
    }
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
  }
  return out;
}

async function searchProductsForArticle(keyword, delayMs = 900) {
  try {
    const hits = await searchTopProducts(keyword, 3);
    if (hits.length >= 2) return hits;
  } catch {
    /* fall through */
  }
  return searchProducts([keyword, `${keyword} 人気`, `${keyword} おすすめ`], delayMs);
}

module.exports = {
  RAKUTEN_AFFILIATE_PATH,
  rakutenAffiliateUrl,
  rakutenSearchAffiliateUrl,
  searchFirstProduct,
  searchTopProducts,
  searchProducts,
  searchProductsForArticle,
  fetchProductDetails,
  parseProductPage,
  collectProductNameCandidates,
  extractProductName,
  cleanProductName,
  displayProductName,
  isBadProductName,
  hasMojibake
};
