const RAKUTEN_AFFILIATE_PATH = "53663d8f.6b4c8828.53663d90.626681b4";

function rakutenAffiliateUrl(rakutenProductUrl) {
  return `https://hb.afl.rakuten.co.jp/ichiba/${RAKUTEN_AFFILIATE_PATH}/?pc=${encodeURIComponent(rakutenProductUrl)}&link_type=hybrid_url`;
}

function rakutenSearchAffiliateUrl(keyword) {
  const url = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  return rakutenAffiliateUrl(url);
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
  return res.text();
}

function firstMatch(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return "";
}

function decodeHtml(text) {
  return String(text)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

async function searchFirstProduct(keyword) {
  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  const html = await fetchText(searchUrl);

  const productUrl = firstMatch(html, [
    /href="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"[^>]*class="[^"]*title/,
    /href="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"/,
    /data-item-url="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"/
  ]);
  if (!productUrl) return null;

  const nameFromSearch = decodeHtml(
    firstMatch(html, [
      new RegExp(`href="${productUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>([^<]{4,120})<`, "i"),
      /class="[^"]*title[^"]*"[^>]*>([^<]{4,120})</
    ]) || keyword
  );

  let imageUrl = firstMatch(html, [
    /src="(https:\/\/thumbnail\.image\.rakuten\.co\.jp\/[^"]+\?_ex=240x240)"/,
    /src="(https:\/\/tshop\.r10s\.jp\/[^"]+)"/
  ]);

  let name = nameFromSearch || keyword;

  if (!imageUrl) {
    const itemHtml = await fetchText(productUrl);
    imageUrl = firstMatch(itemHtml, [
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
      /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i,
      /"image":"(https:\\\/\\\/[^"]+)"/
    ])
      .replace(/\\u002F/g, "/")
      .replace(/\\\//g, "/");
    const nameFromItem = decodeHtml(
      firstMatch(itemHtml, [/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i, /<title>([^<]{4,120})<\/title>/])
    );
    if (nameFromItem) name = nameFromItem;
  }

  if (imageUrl && !imageUrl.includes("_ex=")) {
    imageUrl = imageUrl.includes("?") ? `${imageUrl}&_ex=240x240` : `${imageUrl}?_ex=240x240`;
  }

  return {
    keyword,
    name: name || keyword,
    productUrl,
    imageUrl: imageUrl || "",
    affiliateUrl: rakutenAffiliateUrl(productUrl),
    searchAffiliateUrl: rakutenSearchAffiliateUrl(keyword)
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

module.exports = {
  RAKUTEN_AFFILIATE_PATH,
  rakutenAffiliateUrl,
  rakutenSearchAffiliateUrl,
  searchFirstProduct,
  searchProducts
};
