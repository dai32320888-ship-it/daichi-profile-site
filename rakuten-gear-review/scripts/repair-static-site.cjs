const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const articleRoot = path.join(root, "article");
const indexPath = path.join(root, "index.html");
const textExtensions = new Set([".html", ".js", ".json", ".xml", ".md"]);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (textExtensions.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function writeIfChanged(file, content) {
  const current = read(file);
  if (current === content) return false;
  fs.writeFileSync(file, content, "utf8");
  return true;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function firstMatch(source, re, fallback = "") {
  return source.match(re)?.[1]?.trim() || fallback;
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function fixJapaneseCounters() {
  const changed = [];
  for (const file of walk(root)) {
    const current = read(file);
    const next = current.replaceAll("10つ", "10個");
    if (writeIfChanged(file, next)) changed.push(path.relative(root, file));
  }
  return changed;
}

function parseArticle(dirName) {
  const file = path.join(articleRoot, dirName, "index.html");
  const html = read(file);
  const title = stripTags(firstMatch(html, /<h1>([\s\S]*?)<\/h1>/));
  const summary = stripTags(firstMatch(html, /<p class="lead">([\s\S]*?)<\/p>/));
  const category = stripTags(firstMatch(html, /<p class="eyebrow">([\s\S]*?)<\/p>/, "装備レビュー"));
  const meta = stripTags(firstMatch(html, /<p class="article-meta">([\s\S]*?)<\/p>/));
  const date = meta.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "1970-01-01";
  const readTime = meta.split("・")[1]?.trim() || "読了目安 9分";
  const ogImage = firstMatch(html, /<meta property="og:image" content="([^"]+)"/);
  const pickCount = (html.match(/class="pick-block article-section"/g) || []).length;
  return { id: dirName, title, summary, category, date, readTime, ogImage, pickCount };
}

function renderArticleCard(article) {
  const href = `./article/${article.id}/`;
  const pickLabel = article.pickCount > 0 ? `${article.pickCount}ピック` : "レビュー";
  return `<article class="article-card">
      <a class="article-thumb article-thumb--photo" href="${escapeHtml(href)}">
        <img src="${escapeHtml(article.ogImage)}" alt="${escapeHtml(`${article.title}（${article.category}）`)}" width="640" height="360" loading="lazy" decoding="async" onerror="this.onerror=null;var p=this.closest('.article-thumb');this.remove();if(p)p.classList.remove('article-thumb--photo');" />
        <span class="article-thumb__meta">
          <span>${escapeHtml(article.category)}</span>
          <strong>${escapeHtml(pickLabel)}</strong>
        </span>
      </a>
      <div class="article-body">
        <div class="article-meta">${escapeHtml(article.date)} ・ ${escapeHtml(article.readTime)}</div>
        <h3><a class="article-title-link" href="${escapeHtml(href)}">${escapeHtml(article.title)}</a></h3>
        <p>${escapeHtml(article.summary)}</p>
        <a class="button secondary button--inline-sm" href="${escapeHtml(href)}">記事を読む</a>
      </div>
    </article>`;
}

function repairHomeLatestSection() {
  const articles = fs
    .readdirSync(articleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(articleRoot, entry.name, "index.html")))
    .map((entry) => parseArticle(entry.name))
    .filter((article) => article.title && article.summary && article.ogImage);

  articles.sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    return byDate || a.title.localeCompare(b.title, "ja");
  });

  let html = read(indexPath);
  html = html.replace(/<div class="stat"><b>\d+<\/b><small>レビュー記事<\/small><\/div>/, `<div class="stat"><b>${articles.length}</b><small>レビュー記事</small></div>`);
  html = html.replace(/全\d+記事から最新。/, `全${articles.length}記事から最新。`);

  const h2Pos = html.indexOf("<h2>新着記事</h2>");
  if (h2Pos === -1) throw new Error("Could not find latest section heading in index.html");
  const sectionStart = html.lastIndexOf("    <section", h2Pos);
  const sectionEndMarker = "\n    </section>";
  const sectionEnd = html.indexOf(sectionEndMarker, h2Pos);
  if (sectionStart === -1 || sectionEnd === -1) throw new Error("Could not locate latest section bounds");

  const latestSection = `    <section class="section">
      <div class="section-head">
        <h2>新着記事</h2>
        <p>全${articles.length}記事から最新。カテゴリ一覧にもすべて掲載しています。</p>
      </div>
      <div class="article-grid">${articles.slice(0, 12).map(renderArticleCard).join("")}</div>
    </section>`;

  const next = html.slice(0, sectionStart) + latestSection + html.slice(sectionEnd + sectionEndMarker.length);
  const changed = writeIfChanged(indexPath, next);
  return { changed, articleCount: articles.length, latest: articles.slice(0, 12).map((a) => `${a.date} ${a.id}`) };
}

const counterFiles = fixJapaneseCounters();
const latest = repairHomeLatestSection();

console.log(JSON.stringify({ counterFiles, latest }, null, 2));
