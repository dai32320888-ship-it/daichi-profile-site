#!/usr/bin/env node
/**
 * キューから記事生成 → 楽天3商品取得 → 比較・スペック・使用例つき本文
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { searchProductsForArticle } = require("./lib/rakuten-search");
const { buildArticleFromQueue } = require("./lib/article-content");

const root = path.resolve(__dirname, "..");
const queuePath = path.join(root, "data", "article-queue.json");
const extraPath = path.join(root, "data", "extra-articles.json");
const appPath = path.join(root, "app.js");
const logPath = path.join(root, "data", "auto-article-log.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const maxCount = Number((args.find((a) => a.startsWith("--max=")) || "--max=1").split("=")[1]) || 1;

function todayInJapan() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const v = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return `${v.year}-${v.month}-${v.day}`;
}

function loadExistingIds() {
  const ids = new Set();
  const appSource = fs.readFileSync(appPath, "utf8");
  const sandbox = { console, window: {}, document: { querySelector() {} }, URLSearchParams, encodeURIComponent, String };
  vm.createContext(sandbox);
  vm.runInContext(`${appSource}\nthis.__D__ = { articles };`, sandbox);
  sandbox.__D__.articles.forEach((a) => ids.add(a.id));
  if (fs.existsSync(extraPath)) {
    JSON.parse(fs.readFileSync(extraPath, "utf8")).forEach((a) => ids.add(a.id));
  }
  return ids;
}

function appendLog(entry) {
  const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : [];
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log.slice(-200), null, 2), "utf8");
}

async function main() {
  if (args.includes("--seed")) require("./seed-article-queue.js");
  if (!fs.existsSync(queuePath)) require("./seed-article-queue.js");

  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  const existing = loadExistingIds();
  const pending = queue.items.filter((i) => i.status === "pending" && !existing.has(i.id));
  if (!pending.length) {
    console.log("No pending queue items");
    return;
  }

  const extra = fs.existsSync(extraPath) ? JSON.parse(fs.readFileSync(extraPath, "utf8")) : [];
  let created = 0;

  for (const item of pending.slice(0, maxCount)) {
    const keyword = item.keywords?.[0] || item.angle;
    console.log(`\n→ ${item.id}: ${item.title}`);
    const products = await searchProductsForArticle(keyword);
    const okProducts = products.filter((p) => p.productUrl && !p.error);
    console.log(`  Rakuten hits: ${okProducts.length} products`);

    const article = buildArticleFromQueue({ ...item, date: todayInJapan() }, products);
    const meta = { sourcePostId: item.sourcePostId, generatedAt: new Date().toISOString(), version: 2 };

    if (dryRun) {
      console.log(`  [dry-run] picks: ${article.picks.length}, body sections: ${article.body.length}, read: ${article.readTime}`);
      continue;
    }

    extra.push(article);
    item.status = "done";
    item.publishedAt = todayInJapan();
    item.articleUrl = `/article/${article.id}/`;
    appendLog({ id: article.id, title: article.title, date: article.date, products: okProducts.length, ...meta });
    created++;
  }

  if (!dryRun && created > 0) {
    fs.writeFileSync(extraPath, JSON.stringify(extra, null, 2), "utf8");
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), "utf8");
    console.log(`Created ${created} rich article(s) → extra-articles.json`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
