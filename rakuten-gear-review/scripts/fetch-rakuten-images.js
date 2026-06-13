/**
 * picks の rakutenSearchKeyword から先頭商品の画像・URLを取得して app.js を更新する。
 * 用法: node scripts/fetch-rakuten-images.js [--dry-run]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAKUTEN_AFFILIATE_PATH = "53663d8f.6b4c8828.53663d90.626681b4";
const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "app.js");
const dryRun = process.argv.includes("--dry-run");

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

async function searchFirstProduct(keyword) {
  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  const html = await fetchText(searchUrl);

  const productUrl = firstMatch(html, [
    /href="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"[^>]*class="[^"]*title/,
    /href="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"/,
    /data-item-url="(https:\/\/item\.rakuten\.co\.jp\/[^"?#]+\/)"/
  ]);
  if (!productUrl) return null;

  const imageFromSearch = firstMatch(html, [
    new RegExp(`src="(https://thumbnail\\.image\\.rakuten\\.co\\.jp/[^"]+)"[^>]*alt="[^"]*"[^>]*href="${productUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "i"),
    /src="(https:\/\/thumbnail\.image\.rakuten\.co\.jp\/[^"]+\?_ex=240x240)"/,
    /src="(https:\/\/tshop\.r10s\.jp\/[^"]+)"/
  ]);

  let imageUrl = imageFromSearch;
  if (!imageUrl) {
    const itemHtml = await fetchText(productUrl);
    imageUrl = firstMatch(itemHtml, [
      /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i,
      /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i,
      /"image":"(https:\\\/\\\/[^"]+)"/
    ]).replace(/\\u002F/g, "/").replace(/\\\//g, "/");
  }

  if (imageUrl && !imageUrl.includes("_ex=")) {
    imageUrl = imageUrl.includes("?") ? `${imageUrl}&_ex=240x240` : `${imageUrl}?_ex=240x240`;
  }

  return { productUrl, imageUrl, affiliateUrl: rakutenAffiliateUrl(productUrl) };
}

function loadArticles() {
  const appSource = fs.readFileSync(appPath, "utf8");
  const sandbox = {
    console,
    window: { addEventListener() {}, location: { hash: "", search: "" }, scrollTo() {} },
    document: { querySelector() { return { addEventListener() {}, focus() {}, classList: { toggle() {}, remove() {} } }; } },
    URLSearchParams,
    encodeURIComponent,
    String
  };
  vm.createContext(sandbox);
  vm.runInContext(`${appSource}\nthis.__D__ = { articles };`, sandbox);
  return { appSource, articles: sandbox.__D__.articles };
}

function patchPickInSource(source, articleId, pickIndex, fields) {
  const articleRe = new RegExp(
    `(\\{\\s*"id":\\s*"${articleId}"[\\s\\S]*?"picks":\\s*\\[)([\\s\\S]*?)(\\]\\s*,\\s*"conclusionParagraphs")`
  );
  const m = source.match(articleRe);
  if (!m) throw new Error(`article not found: ${articleId}`);

  const picksBody = m[2];
  const pickBlocks = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < picksBody.length; i++) {
    if (picksBody[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (picksBody[i] === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        pickBlocks.push({ start, end: i + 1, text: picksBody.slice(start, i + 1) });
        start = -1;
      }
    }
  }
  if (!pickBlocks[pickIndex]) throw new Error(`pick ${pickIndex} not found in ${articleId}`);

  let block = pickBlocks[pickIndex].text;
  for (const [key, value] of Object.entries(fields)) {
    const fieldRe = new RegExp(`("${key}":\\s*")([^"]*)(")`);
    if (fieldRe.test(block)) {
      block = block.replace(fieldRe, `$1${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}$3`);
    } else {
      block = block.replace(/\n\s*\}$/, `,\n        "${key}": "${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"\n      }`);
    }
  }

  const newPicksBody =
    picksBody.slice(0, pickBlocks[pickIndex].start) + block + picksBody.slice(pickBlocks[pickIndex].end);
  return source.slice(0, m.index) + m[1] + newPicksBody + m[3] + source.slice(m.index + m[0].length);
}

/** 概念チェック記事向け：検索キーワードを実商品寄りに差し替え */
const KEYWORD_OVERRIDES = {
  "楽天 レビュー 見方": "掃除機 コードレス 人気"
};

async function main() {
  const { appSource, articles } = loadArticles();
  let source = appSource;
  const targets = [];

  articles.forEach((a) => {
    (a.picks || []).forEach((p, i) => {
      if (!p.imageUrl && p.rakutenSearchKeyword) {
        const keyword = KEYWORD_OVERRIDES[p.rakutenSearchKeyword] || p.rakutenSearchKeyword;
        targets.push({ articleId: a.id, pickIndex: i, name: p.name, keyword });
      }
    });
  });

  console.log(`Targets: ${targets.length}`);
  for (const t of targets) {
    console.log(`\n[${t.articleId}] pick ${t.pickIndex}: ${t.name}`);
    console.log(`  keyword: ${t.keyword}`);
    try {
      const result = await searchFirstProduct(t.keyword);
      if (!result?.imageUrl) {
        console.log("  SKIP: no image found");
        continue;
      }
      console.log(`  product: ${result.productUrl}`);
      console.log(`  image: ${result.imageUrl}`);
      if (!dryRun) {
        source = patchPickInSource(source, t.articleId, t.pickIndex, {
          rakutenProductUrl: result.productUrl,
          imageUrl: result.imageUrl,
          affiliateUrl: result.affiliateUrl
        });
      }
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
    }
  }

  if (!dryRun && source !== appSource) {
    fs.writeFileSync(appPath, source, "utf8");
    console.log("\nUpdated app.js");
  } else if (dryRun) {
    console.log("\nDry run — no file written");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
