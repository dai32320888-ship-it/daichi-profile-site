#!/usr/bin/env node
/**
 * picks.name が「獲得予定ポイント」等の誤取得になっているものを楽天商品ページから再取得する。
 * 用法: node scripts/fix-bad-pick-names.js [--dry-run]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { fetchProductDetails, displayProductName, isBadProductName } = require("./lib/rakuten-search");

const root = path.resolve(__dirname, "..");
const appPath = path.join(root, "app.js");
const extraPath = path.join(root, "data", "extra-articles.json");
const dryRun = process.argv.includes("--dry-run");

function loadAppArticles() {
  const appSource = fs.readFileSync(appPath, "utf8");
  const sandbox = {
    console,
    window: { addEventListener() {}, location: { hash: "", search: "" }, scrollTo() {} },
    document: {
      querySelector() {
        return { addEventListener() {}, focus() {}, classList: { toggle() {}, remove() {} } };
      }
    },
    URLSearchParams,
    encodeURIComponent,
    String
  };
  vm.createContext(sandbox);
  vm.runInContext(`${appSource}\nthis.__D__ = { articles };`, sandbox);
  return sandbox.__D__.articles;
}

async function refreshPick(pick, fallback, index) {
  const url = pick.rakutenProductUrl;
  if (!url) return false;
  const details = await fetchProductDetails(url, fallback);
  const name = displayProductName(details.name, fallback, index);
  pick.name = name.slice(0, 80);
  if (details.imageUrl) pick.imageUrl = details.imageUrl;
  if (details.affiliateUrl) pick.affiliateUrl = details.affiliateUrl;
  if (details.price) pick.priceHint = details.price;
  return true;
}

async function fixArticlePicks(article) {
  const fallback =
    article.title.match(/「([^」]+)」/)?.[1] ||
    (article.picks?.[0]?.rakutenSearchKeyword || "装備");
  let changed = 0;
  for (let i = 0; i < (article.picks || []).length; i++) {
    const pick = article.picks[i];
    if (!isBadProductName(pick.name)) continue;
    const fb = pick.rakutenSearchKeyword || fallback;
    console.log(`  [${article.id}] pick ${i + 1}: ${pick.name} → refetch ${pick.rakutenProductUrl}`);
    try {
      await refreshPick(pick, fb, i);
      console.log(`    → ${pick.name}`);
      changed++;
      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
    }
  }
  return changed;
}

async function main() {
  let total = 0;

  const appArticles = loadAppArticles();
  for (const article of appArticles) {
    total += await fixArticlePicks(article);
  }

  let extra = [];
  let extraDirty = false;
  if (fs.existsSync(extraPath)) {
    extra = JSON.parse(fs.readFileSync(extraPath, "utf8"));
    for (const article of extra) {
      const n = await fixArticlePicks(article);
      if (n) extraDirty = true;
      total += n;
    }
  }

  if (!dryRun && extraDirty) {
    fs.writeFileSync(extraPath, JSON.stringify(extra, null, 2), "utf8");
    console.log("\nUpdated extra-articles.json");
  }

  console.log(`\nFixed ${total} pick name(s)${dryRun ? " (dry run)" : ""}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
