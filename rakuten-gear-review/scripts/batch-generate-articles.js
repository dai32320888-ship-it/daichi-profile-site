#!/usr/bin/env node
/**
 * キューから記事を連続生成（楽天商品URL取得付き）
 * 使い方: node scripts/batch-generate-articles.js [--max=50] [--delay=1200]
 */
const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const maxTotal = Number((args.find((a) => a.startsWith("--max=")) || "--max=120").split("=")[1]) || 120;
const perBatch = 1;

let created = 0;
while (created < maxTotal) {
  const batch = Math.min(perBatch, maxTotal - created);
  const r = spawnSync(process.execPath, ["scripts/auto-rakuten-article.js", `--max=${batch}`], {
    cwd: root,
    encoding: "utf8",
    timeout: 120000
  });
  const out = (r.stdout || "") + (r.stderr || "");
  process.stdout.write(out);
  if (/Created \d+ rich article/.test(out)) {
    created++;
    continue;
  }
  if (/No pending queue items/.test(out)) {
    console.log(`\nQueue empty after ${created} articles.`);
    break;
  }
  if (r.status !== 0) {
    console.error(`Batch failed (status ${r.status}), stopping.`);
    break;
  }
  created++;
}

console.log(`\nBatch done: ${created} article(s) generated.`);
