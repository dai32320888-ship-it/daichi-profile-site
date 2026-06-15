#!/usr/bin/env node
/**
 * 既存 auto-* 記事をリッチ化（比較表・スペック・使用例・FAQ）
 * 用法: node scripts/enrich-auto-articles.js [--dry-run] [--id=auto-p003-...]
 */
const fs = require("fs");
const path = require("path");
const { fetchProductDetails, displayProductName } = require("./lib/rakuten-search");
const { enrichExistingArticle } = require("./lib/article-content");

const root = path.resolve(__dirname, "..");
const extraPath = path.join(root, "data", "extra-articles.json");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyId = (args.find((a) => a.startsWith("--id=")) || "").split("=")[1];

async function productsFromArticle(article) {
  const angle = article.title.match(/「([^」]+)」/)?.[1] || article.summary?.slice(0, 20) || "装備";
  const picks = article.picks || [];
  const products = [];
  const seen = new Set();

  for (const pick of picks) {
    const url = pick.rakutenProductUrl;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    try {
      const details = await fetchProductDetails(url);
      products.push({
        keyword: angle,
        name: displayProductName(details.name, angle, products.length),
        productUrl: url,
        imageUrl: details.imageUrl || pick.imageUrl,
        affiliateUrl: details.affiliateUrl || pick.affiliateUrl,
        price: details.price,
        reviewCount: details.reviewCount,
        rating: details.rating,
        description: details.description,
        specs: details.specs
      });
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      products.push({
        keyword: angle,
        name: displayProductName(pick.name, angle, products.length),
        productUrl: url,
        imageUrl: pick.imageUrl,
        affiliateUrl: pick.affiliateUrl,
        specs: pick.specs || []
      });
    }
  }

  if (products.length < 3) {
    while (products.length < 3) {
      products.push({ keyword: angle, name: `${angle}（候補${products.length + 1}）`, productUrl: "", specs: [] });
    }
  }
  return products;
}

async function main() {
  if (!fs.existsSync(extraPath)) {
    console.error("extra-articles.json not found");
    process.exit(1);
  }

  const articles = JSON.parse(fs.readFileSync(extraPath, "utf8"));
  let updated = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (!article.id.startsWith("auto-")) continue;
    if (onlyId && article.id !== onlyId) continue;

    console.log(`\nEnriching: ${article.id}`);
    const products = await productsFromArticle(article);
    const enriched = enrichExistingArticle(article, products);
    enriched.dateModified = new Date().toISOString().slice(0, 10);

    if (dryRun) {
      console.log(`  sections: ${enriched.body.length}, read: ${enriched.readTime}`);
      continue;
    }

    articles[i] = enriched;
    updated++;
  }

  if (!dryRun && updated > 0) {
    fs.writeFileSync(extraPath, JSON.stringify(articles, null, 2), "utf8");
    console.log(`\nUpdated ${updated} auto article(s)`);
  } else if (dryRun) {
    console.log("\nDry run — no file written");
  } else {
    console.log("No auto articles updated");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
