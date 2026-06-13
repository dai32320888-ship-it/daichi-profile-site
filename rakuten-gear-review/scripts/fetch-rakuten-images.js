/**
 * picks の rakutenSearchKeyword から先頭商品の画像・URLを取得して app.js / extra-articles.json を更新する。
 * 用法: node scripts/fetch-rakuten-images.js [--dry-run]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { searchFirstProduct } = require("./lib/rakuten-search");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "app.js");
const extraPath = path.join(root, "data", "extra-articles.json");
const dryRun = process.argv.includes("--dry-run");

const KEYWORD_OVERRIDES = {
  "楽天 レビュー 見方": "掃除機 コードレス 人気"
};

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

function collectTargets(articles) {
  const targets = [];
  articles.forEach((a) => {
    (a.picks || []).forEach((p, i) => {
      if (!p.imageUrl && p.rakutenSearchKeyword) {
        const keyword = KEYWORD_OVERRIDES[p.rakutenSearchKeyword] || p.rakutenSearchKeyword;
        targets.push({ store: "app", articleId: a.id, pickIndex: i, name: p.name, keyword });
      }
    });
  });
  return targets;
}

async function fillPick(pick, keyword) {
  const result = await searchFirstProduct(keyword);
  if (!result?.imageUrl && !result?.productUrl) return null;
  return {
    rakutenProductUrl: result.productUrl,
    imageUrl: result.imageUrl,
    affiliateUrl: result.affiliateUrl,
    name: result.name
  };
}

async function main() {
  const { appSource, articles } = loadArticles();
  let source = appSource;
  const targets = collectTargets(articles);

  let extra = [];
  let extraChanged = false;
  if (fs.existsSync(extraPath)) {
    extra = JSON.parse(fs.readFileSync(extraPath, "utf8"));
    extra.forEach((a) => {
      (a.picks || []).forEach((p, i) => {
        if (!p.imageUrl && p.rakutenSearchKeyword) {
          const keyword = KEYWORD_OVERRIDES[p.rakutenSearchKeyword] || p.rakutenSearchKeyword;
          targets.push({ store: "extra", articleId: a.id, pickIndex: i, name: p.name, keyword, article: a });
        }
      });
    });
  }

  console.log(`Targets: ${targets.length}`);
  for (const t of targets) {
    console.log(`\n[${t.articleId}] pick ${t.pickIndex}: ${t.name}`);
    console.log(`  keyword: ${t.keyword}`);
    try {
      const fields = await fillPick(null, t.keyword);
      if (!fields?.imageUrl) {
        console.log("  SKIP: no image found");
        continue;
      }
      console.log(`  product: ${fields.rakutenProductUrl}`);
      console.log(`  image: ${fields.imageUrl}`);
      if (!dryRun) {
        if (t.store === "app") {
          source = patchPickInSource(source, t.articleId, t.pickIndex, fields);
        } else {
          const pick = t.article.picks[t.pickIndex];
          Object.assign(pick, fields);
          if (fields.name) pick.name = fields.name.slice(0, 80);
          extraChanged = true;
        }
      }
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
    }
  }

  if (!dryRun) {
    if (source !== appSource) {
      fs.writeFileSync(appPath, source, "utf8");
      console.log("\nUpdated app.js");
    }
    if (extraChanged) {
      fs.writeFileSync(extraPath, JSON.stringify(extra, null, 2), "utf8");
      console.log("Updated extra-articles.json");
    }
  } else {
    console.log("\nDry run — no file written");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
