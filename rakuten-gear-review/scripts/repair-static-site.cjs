const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..");
const articleRoot = path.join(root, "article");
const indexPath = path.join(root, "index.html");
const fallbackImagePath = path.join(root, "images", "og-default.png");
const textExtensions = new Set([".html", ".js", ".json", ".xml", ".md"]);
const IMAGE_FALLBACK_ONERROR =
  "this.onerror=null;this.src=this.dataset.fallback||'./images/og-default.png';this.classList.add('image-fallback');";

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
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const REDIRECT_ARTICLE_IDS = new Set([
  "auto-p004-防災-リュック-コンパクト",
  "nintendo-switch-2-rakuten",
]);

function applyCopyFixes(text) {
  return text
    .replaceAll("10つ", "10個")
    .replace(
      /元自衛官目線で選ぶ「([^」]+)」：楽天で失敗しにくい選び方/g,
      "「$1」楽天で失敗しにくい選び方｜元自衛官の確認メモ",
    )
    .replaceAll(
      "この記事では楽天市場の候補3つを、価格帯・口コミ・使用例つきで比較しました。気になったものはリンク先で最新価格と在庫を確認してください。",
      "楽天市場で候補3件を、価格帯・口コミ・使いどころ付きで比較しました。気になるものはリンク先で最新価格と在庫を確認してください。",
    )
    .replace(
      /([^。\n]+?)は3つ全部いらない。コスパ重視→バランス型→こだわり派の順で、自分の使用頻度に合う1つを選ぶのが続きやすいです。/g,
      "$1は3候補すべて必要なわけではありません。コスパ重視・バランス型・こだわり派の順で、いちばん困っている場面に効く1つから選ぶと続きやすいです。",
    )
    .replaceAll("を買う前に決める3つのこと", "を選ぶ前に押さえる3点")
    .replaceAll("今回ピックアップする3つ", "今回ピックアップする3点")
    .replaceAll("コスパ重視→バランス型→こだわり派", "コスパ重視・バランス型・こだわり派")
    .replaceAll("最初の7つから整える", "最初の7選から整える")
    .replaceAll("7つに絞", "7選に絞")
    .replaceAll("7つにし", "7点にし")
    .replaceAll("効く7つ", "効く7選")
    .replaceAll("回る7つ", "回る7選")
    .replaceAll("土台を7つ", "土台を7点")
    .replaceAll("户外用品", "アウトドア用品")
    .replaceAll("戶外用品", "アウトドア用品");
}

function fixSiteCopy() {
  const changed = [];
  for (const file of walk(root)) {
    const current = read(file);
    const next = applyCopyFixes(current);
    if (writeIfChanged(file, next)) changed.push(path.relative(root, file));
  }
  return changed;
}

function relativeFallbackFor(file) {
  return path.relative(path.dirname(file), fallbackImagePath).replace(/\\/g, "/");
}

function withImageFallbackAttributes(tag, fallbackUrl) {
  let next = tag;
  const escapedFallback = escapeHtml(fallbackUrl);
  if (!/\sdata-fallback=/.test(next)) {
    next = next.replace(/\s*\/?>$/, ` data-fallback="${escapedFallback}"$&`);
  }
  if (/\sonerror=/.test(next)) {
    next = next.replace(/\sonerror="[^"]*"/, ` onerror="${IMAGE_FALLBACK_ONERROR}"`);
  } else {
    next = next.replace(/\s*\/?>$/, ` onerror="${IMAGE_FALLBACK_ONERROR}"$&`);
  }
  return next;
}

function fixImageFallbacks() {
  const changed = [];
  const files = walk(root).filter((file) => path.extname(file) === ".html");
  for (const file of files) {
    const fallbackUrl = relativeFallbackFor(file);
    const html = read(file);
    const next = html.replace(/<img\b[^>]*>/g, (tag, offset) => {
      const context = html.slice(Math.max(0, offset - 700), offset);
      const isContentImage =
        /class="[^"]*\barticle-thumb\b[^"]*"/.test(context) ||
        /class="[^"]*\bproduct-media\b[^"]*"/.test(context);
      return isContentImage ? withImageFallbackAttributes(tag, fallbackUrl) : tag;
    });
    if (writeIfChanged(file, next)) changed.push(path.relative(root, file));
  }
  return changed;
}

function parseArticle(dirName) {
  const file = path.join(articleRoot, dirName, "index.html");
  const html = read(file);
  const title = stripTags(firstMatch(html, /<h1>([\s\S]*?)<\/h1>/));
  const summary = stripTags(firstMatch(html, /<p class="lead">([\s\S]*?)<\/p>/));
  const category = stripTags(
    firstMatch(html, /<p class="eyebrow">([\s\S]*?)<\/p>/, "装備レビュー"),
  );
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
        <img src="${escapeHtml(article.ogImage)}" alt="${escapeHtml(`${article.title}（${article.category}）`)}" width="640" height="360" loading="lazy" decoding="async" data-fallback="./images/og-default.png" onerror="${IMAGE_FALLBACK_ONERROR}" />
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

function feedSlugRank() {
  const feed = read(path.join(root, "feed.xml"));
  const slugs = [...feed.matchAll(/\/article\/([^/]+)\//g)].map((m) => m[1]);
  return new Map(slugs.map((slug, index) => [slug, index]));
}

function repairHomeLatestSection() {
  const rank = feedSlugRank();
  const articles = fs
    .readdirSync(articleRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(articleRoot, entry.name, "index.html")),
    )
    .map((entry) => parseArticle(entry.name))
    .filter(
      (article) =>
        article.title &&
        article.summary &&
        article.ogImage &&
        !REDIRECT_ARTICLE_IDS.has(article.id) &&
        !/http-equiv="refresh"/i.test(read(path.join(articleRoot, article.id, "index.html"))),
    );

  articles.sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    const aRank = rank.has(a.id) ? rank.get(a.id) : 9999;
    const bRank = rank.has(b.id) ? rank.get(b.id) : 9999;
    return aRank - bRank;
  });

  const articleCount = fs
    .readdirSync(articleRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(articleRoot, entry.name, "index.html")),
    ).length;

  let html = read(indexPath);
  html = html.replace(
    /<div class="stat"><b>\d+<\/b><small>レビュー記事<\/small><\/div>/,
    `<div class="stat"><b>${articleCount}</b><small>レビュー記事</small></div>`,
  );
  html = html.replace(/全\d+記事から最新。/, `全${articleCount}記事から最新。`);

  const h2Pos = html.indexOf("<h2>新着記事</h2>");
  if (h2Pos === -1) throw new Error("Could not find latest section heading in index.html");
  const sectionStart = html.lastIndexOf("    <section", h2Pos);
  const sectionEndMarker = "\n    </section>";
  const sectionEnd = html.indexOf(sectionEndMarker, h2Pos);
  if (sectionStart === -1 || sectionEnd === -1)
    throw new Error("Could not locate latest section bounds");

  const latestSection = `    <section class="section">
      <div class="section-head">
        <h2>新着記事</h2>
        <p>全${articleCount}記事から最新。カテゴリ一覧にもすべて掲載しています。</p>
      </div>
      <div class="article-grid">${articles.slice(0, 12).map(renderArticleCard).join("")}</div>
    </section>`;

  const next =
    html.slice(0, sectionStart) + latestSection + html.slice(sectionEnd + sectionEndMarker.length);
  const changed = writeIfChanged(indexPath, next);
  return {
    changed,
    articleCount,
    latest: articles.slice(0, 12).map((a) => `${a.date} ${a.id}`),
  };
}

const { mergeRootSitemap } = require(path.join(repoRoot, "scripts", "sync-root-sitemap.cjs"));

const copyFiles = fixSiteCopy();
const imageFallbackFiles = fixImageFallbacks();
const latest = repairHomeLatestSection();
const rootSitemap = mergeRootSitemap();

console.log(JSON.stringify({ copyFiles, imageFallbackFiles, latest, rootSitemap }, null, 2));
