#!/usr/bin/env node
/** 投稿ネタ庫CSV → article-queue.json（未執筆分のみ） */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const queuePath = path.join(root, "data", "article-queue.json");
const csvPath = path.join(root, "..", "notion_x_template", "投稿ネタ庫_100.csv");
const appPath = path.join(root, "app.js");
const extraPath = path.join(root, "data", "extra-articles.json");

const GENRE_CATEGORY = {
  防災: "disaster",
  車: "car",
  掃除: "life",
  収納: "solo",
  一人暮らし改善: "solo",
  デスク周り: "pc-ai",
  キッチン: "life",
  睡眠: "life",
  通勤: "life",
  買ってよかった: "life",
  自衛官目線グッズ: "life",
  "共感・あるある": "life",
  ガジェット: "pc-ai"
};

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

function slugFromPostId(postId, keyword) {
  const kw = keyword.replace(/[^\w\u3040-\u30ff\u4e00-\u9fff]+/g, "-").slice(0, 24);
  return `auto-${postId.toLowerCase()}-${kw || "gear"}`.replace(/-+/g, "-").replace(/-$/, "");
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",");
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    return {
      postId: cols[idx["投稿ID"]]?.trim(),
      genre: cols[idx["ジャンル"]]?.trim(),
      keyword: cols[idx["楽天で探す商品キーワード"]]?.trim(),
      memo: cols[idx["メモ"]]?.trim()
    };
  });
}

function titleFrom(keyword, genre) {
  return `元自衛官目線で選ぶ「${keyword}」：楽天で失敗しにくい選び方`;
}

function summaryFrom(keyword, category) {
  const catLabel = { disaster: "防災", car: "車載", solo: "一人暮らし", "pc-ai": "デスク", life: "生活", training: "筋トレ", bike: "バイク" }[category] || "生活";
  return `${catLabel}シーンで使える「${keyword}」を、用途・置き場所・続けやすさの観点で整理します。`;
}

function main() {
  if (!fs.existsSync(csvPath)) {
    console.error("CSV not found:", csvPath);
    process.exit(1);
  }
  const existing = loadExistingIds();
  const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, "utf8")) : { items: [] };
  const queuedIds = new Set(queue.items.map((i) => i.id));
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  let added = 0;

  for (const row of rows) {
    if (!row.postId || !row.keyword) continue;
    const id = slugFromPostId(row.postId, row.keyword);
    if (existing.has(id) || queuedIds.has(id)) continue;
    const category = GENRE_CATEGORY[row.genre] || "life";
    const kw = row.keyword;
    queue.items.push({
      id,
      sourcePostId: row.postId,
      status: "pending",
      title: titleFrom(kw, row.genre),
      category,
      keywords: [kw, `${kw} 人気`, `${kw} おすすめ`],
      angle: kw,
      summary: summaryFrom(kw, category)
    });
    queuedIds.add(id);
    added++;
  }

  fs.mkdirSync(path.dirname(queuePath), { recursive: true });
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), "utf8");
  console.log(`queue: ${queue.items.length} items (+${added} new, ${queue.items.filter((i) => i.status === "pending").length} pending)`);
}

main();
