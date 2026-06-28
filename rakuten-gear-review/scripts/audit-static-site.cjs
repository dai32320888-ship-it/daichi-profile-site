const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const articleRoot = path.join(root, "article");

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (!predicate || predicate(full)) out.push(full);
  }
  return out;
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function extractLatestDates() {
  const index = read(path.join(root, "index.html"));
  const start = index.indexOf("<h2>新着記事</h2>");
  if (start === -1) return [];
  const section = index.slice(start, index.indexOf("</section>", start));
  return [...section.matchAll(/<div class="article-meta">(\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]);
}

function auditMetadata() {
  const issues = [];
  const files = walk(root, (file) => file.endsWith(".html"));
  for (const file of files) {
    const html = read(file);
    const rel = path.relative(root, file);
    const isUtilityHtml =
      rel === "google0b4e48fe988ed60e.html" ||
      rel === "Nuucaヌーカスリープ_HP用_強め_HTMLブロック.html" ||
      html.includes('http-equiv="refresh"');
    if (isUtilityHtml) continue;
    if (!html.includes('<link rel="canonical"')) issues.push(`missing canonical: ${rel}`);
    if (!html.includes('<meta property="og:title"')) issues.push(`missing og:title: ${rel}`);
    if (/noindex/i.test(html)) issues.push(`contains noindex: ${rel}`);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        JSON.parse(match[1]);
      } catch {
        issues.push(`invalid json-ld: ${rel}`);
      }
    }
  }
  return { files: files.length, issues };
}

function auditLocalLinks() {
  const bad = [];
  const files = walk(root, (file) => file.endsWith(".html"));
  for (const file of files) {
    const html = read(file);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = match[1];
      if (/^(https?:|mailto:|data:|#|javascript:)/.test(url)) continue;
      const clean = url.split("#")[0];
      if (!clean) continue;
      const target = path.resolve(path.dirname(file), clean);
      if (!fs.existsSync(target)) bad.push(`${path.relative(root, file)} -> ${url}`);
    }
  }
  return { files: files.length, bad };
}

const latestDates = extractLatestDates();
const sitemap = read(path.join(root, "sitemap.xml"));
const feed = read(path.join(root, "feed.xml"));
const articleDirs = fs.readdirSync(articleRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).length;
const metadata = auditMetadata();
const links = auditLocalLinks();

const report = {
  articleDirs,
  latestDates,
  latestDatesNewestFirst: latestDates.every((date, index) => index === 0 || latestDates[index - 1] >= date),
  sitemapUrls: [...sitemap.matchAll(/<loc>/g)].length,
  sitemapUniqueUrls: new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).size,
  feedItems: [...feed.matchAll(/<item>/g)].length,
  metadata,
  links
};

console.log(JSON.stringify(report, null, 2));

if (!report.latestDatesNewestFirst || metadata.issues.length || links.bad.length) {
  process.exitCode = 1;
}
