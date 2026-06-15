#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { hasMojibake, isBadProductName } = require("./lib/rakuten-search");

const root = path.resolve(__dirname, "..");
const issues = [];

function add(level, where, msg) {
  issues.push({ level, where, msg });
}

function walkHtml(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

function checkMojibakeInText(rel, text) {
  if (hasMojibake(text)) add("error", rel, "文字化けの疑い");
  if (text.includes("\uFFFD")) add("error", rel, "置換文字 U+FFFD");
}

function checkHtmlFile(file) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  checkMojibakeInText(rel, html);

  const badAlt = html.match(/alt="[^"]*「[^"]*$/m);
  if (badAlt) add("error", rel, "alt属性の引用符が壊れている可能性");

  if (/href="[^"]*<[^"]*"/.test(html)) add("warn", rel, "href内に不正な文字");

  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  for (const m of imgs) {
    const tag = m[0];
    if (!/\balt=/.test(tag)) add("warn", rel, `imgにaltなし: ${tag.slice(0, 80)}`);
    if (/\balt="[^"]*"[^>]*"[^>]*>/.test(tag) === false && /alt="[^"]*[^\\]"[^>]*width=/.test(tag)) {
      // rough broken alt before width without closing quote
      if (/alt="[^"]* width=/.test(tag)) add("error", rel, "壊れたimg alt属性");
    }
  }
}

function loadArticles() {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const sb = {
    console,
    window: { addEventListener() {}, location: { hash: "", search: "" }, scrollTo() {} },
    document: {
      querySelector() {
        return { addEventListener() {}, focus() {}, classList: { toggle() {}, remove() {} } };
      }
    },
    String,
    URLSearchParams: global.URLSearchParams,
    encodeURIComponent
  };
  vm.createContext(sb);
  vm.runInContext(`${app}\nthis.out = { articles, products, categories };`, sb);
  return sb.out;
}

function main() {
  const extraPath = path.join(root, "data", "extra-articles.json");
  if (fs.existsSync(extraPath)) {
    const extra = JSON.parse(fs.readFileSync(extraPath, "utf8"));
    for (const a of extra) {
      const blob = JSON.stringify(a);
      if (hasMojibake(blob)) add("error", `extra:${a.id}`, "extra-articles.json 内に文字化け");
      for (const [i, p] of (a.picks || []).entries()) {
        if (isBadProductName(p.name)) add("error", `extra:${a.id}:pick${i + 1}`, `不正な商品名: ${p.name}`);
      }
    }
  }

  const { articles, products } = loadArticles();
  for (const a of articles) {
    const blob = JSON.stringify([a.title, a.summary, a.body, a.picks]);
    if (hasMojibake(blob)) add("error", `app:${a.id}`, a.title);
    for (const [i, p] of (a.picks || []).entries()) {
      if (isBadProductName(p.name)) add("error", `app:${a.id}:pick${i + 1}`, `不正な商品名: ${p.name}`);
    }
  }
  for (const p of products) {
    const blob = JSON.stringify(p);
    if (hasMojibake(blob)) add("error", `product:${p.id}`, p.name);
  }

  for (const file of walkHtml(root)) {
    if (file.includes("node_modules")) continue;
    checkHtmlFile(file);
  }

  const feed = path.join(root, "feed.xml");
  if (fs.existsSync(feed)) {
    const xml = fs.readFileSync(feed, "utf8");
    checkMojibakeInText("feed.xml", xml);
    if (!xml.includes("<![CDATA[")) add("warn", "feed.xml", "CDATAなし（特殊文字で壊れる可能性）");
  }

  const errors = issues.filter((i) => i.level === "error");
  const warns = issues.filter((i) => i.level === "warn");
  console.log(`=== site-health-check ===`);
  console.log(`errors: ${errors.length}, warns: ${warns.length}`);
  for (const i of [...errors, ...warns]) {
    console.log(`${i.level.toUpperCase()} [${i.where}] ${i.msg}`);
  }
  process.exit(errors.length ? 1 : 0);
}

main();
