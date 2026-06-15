#!/usr/bin/env node
/**
 * A8「素材をコピー」HTML を data/a8-inbox/*.json から取り込む。
 *
 * inbox JSON 例:
 * {
 *   "label": "防災備蓄（プログラム名）",
 *   "categories": ["disaster"],
 *   "slots": { "mid": true, "foot": true, "sidebar": false },
 *   "html": "<a href=\"https://px.a8.net/...\">...</a>\n<img ...>"
 * }
 *
 * 用法: node scripts/import-a8-inbox.js [--dry-run]
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const inboxDir = path.join(root, "data", "a8-inbox");
const creativesPath = path.join(__dirname, "a8-creatives.js");
const dryRun = process.argv.includes("--dry-run");

function normalizeHtml(html) {
  return String(html || "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function validateA8Html(html) {
  if (!html.includes("px.a8.net") && !html.includes("a8.net/0.gif")) {
    throw new Error("A8のトラッキングURLが見つかりません（素材をコピーした全文か確認）");
  }
  if (!html.includes("<a ") && !html.includes("<A ")) {
    throw new Error("<a> タグがありません");
  }
}

function parseCreativesSource(src) {
  const start = src.indexOf("const RAW_FRAGMENTS = [");
  const end = src.indexOf("\n];", start);
  if (start < 0 || end < 0) throw new Error("RAW_FRAGMENTS block not found");
  const block = src.slice(start, end + 3);
  const fragments = [];
  const re = /`([\s\S]*?)`/g;
  let m;
  while ((m = re.exec(block))) fragments.push(m[1]);
  return { start, end: end + 3, fragments, src };
}

function patchCategoryMaps(src, entries, startIndex) {
  let out = src;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const idx = startIndex + i;
    const cats = entry.categories || [];
    const slots = entry.slots || {};
    for (const cat of cats) {
      if (slots.mid) out = upsertMapKey(out, "CATEGORY_MID", cat, idx);
      if (slots.foot) out = upsertMapKey(out, "CATEGORY_FOOT", cat, idx);
      if (slots.sidebar) out = upsertMapKey(out, "CATEGORY_SIDEBAR", cat, idx);
    }
  }
  return out;
}

function mapKeyLiteral(key) {
  return /^[A-Za-z_][\w]*$/.test(key) ? key : `"${key}"`;
}

function upsertMapKey(src, mapName, key, value) {
  const re = new RegExp(`(const ${mapName} = \\{[\\s\\S]*?)(\\n\\};)`);
  const m = src.match(re);
  if (!m) throw new Error(`${mapName} not found`);
  const body = m[1];
  const lit = mapKeyLiteral(key);
  const keyRe = new RegExp(`\\n  ${lit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}: \\d+,?`);
  const line = `\n  ${lit}: ${value},`;
  const nextBody = keyRe.test(body) ? body.replace(keyRe, line) : `${body}${line}`;
  return src.replace(re, `${nextBody}${m[2]}`);
}

function appendFragments(src, newFragments) {
  const parsed = parseCreativesSource(src);
  const escaped = newFragments.map((f) => `\n  \`${f.replace(/\\/g, "\\\\").replace(/`/g, "\\`")}\`,`);
  const before = parsed.src.slice(0, parsed.end - 3).replace(/`,\s*$/, "`,");
  const after = parsed.src.slice(parsed.end - 3);
  return before + escaped.join("") + after;
}

function a8matKey(html) {
  const m = html.match(/a8mat=([^"&\s]+)/);
  return m ? m[1] : "";
}

function main() {
  if (!fs.existsSync(inboxDir)) {
    fs.mkdirSync(inboxDir, { recursive: true });
    console.log(`Created ${inboxDir}`);
    console.log("JSON を置いてから再実行してください。");
    return;
  }

  const files = fs
    .readdirSync(inboxDir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort();
  if (!files.length) {
    console.log("inbox に .json がありません。");
    return;
  }

  const creativesSrc = fs.readFileSync(creativesPath, "utf8");
  const existing = parseCreativesSource(creativesSrc);
  const existingKeys = new Set(existing.fragments.map(a8matKey).filter(Boolean));

  const entries = [];
  const skipped = [];
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(inboxDir, file), "utf8"));
    const html = normalizeHtml(raw.html);
    validateA8Html(html);
    const key = a8matKey(html);
    if (key && existingKeys.has(key)) {
      skipped.push({ file, label: raw.label || file, key });
      console.log(`  SKIP ${file}（取込済み: ${key.slice(0, 20)}…）`);
      continue;
    }
    if (key) existingKeys.add(key);
    entries.push({ file, label: raw.label || file, categories: raw.categories || [], slots: raw.slots || {}, html });
    console.log(`  OK ${file} → ${raw.label || file} [${(raw.categories || []).join(",")}]`);
  }

  const processedDir = path.join(inboxDir, "processed");
  fs.mkdirSync(processedDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  for (const entry of skipped) {
    if (!dryRun) {
      fs.renameSync(path.join(inboxDir, entry.file), path.join(processedDir, `${stamp}-skip-${entry.file}`));
    }
  }

  if (!entries.length) {
    console.log(skipped.length ? `\n新規0件（${skipped.length}件は既存と同じため processed へ移動）` : "\ninbox に新規 .json がありません。");
    return;
  }

  if (dryRun) {
    console.log(`\nDry run: ${entries.length} 件を追加予定（skip ${skipped.length}）`);
    return;
  }

  let src = creativesSrc;
  const startIndex = existing.fragments.length;
  src = appendFragments(src, entries.map((e) => e.html));
  src = patchCategoryMaps(src, entries, startIndex);
  fs.writeFileSync(creativesPath, src, "utf8");

  for (const entry of entries) {
    fs.renameSync(path.join(inboxDir, entry.file), path.join(processedDir, `${stamp}-${entry.file}`));
  }

  console.log(`\nAdded ${entries.length} creative(s) at index ${startIndex}–${startIndex + entries.length - 1}`);
  console.log("次: npm run build && npm run deploy:gear（01_アフィリエイト から）");
}

main();
