const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..");
const articleRoot = path.join(root, "article");
const giftRoot = path.join(repoRoot, "gift-for-you");
const SITE_BASE = "https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review";
const REDIRECT_ARTICLE_IDS = new Set([
  "auto-p004-防災-リュック-コンパクト",
  "nintendo-switch-2-rakuten",
]);
const UTILITY_HTML = new Set([
  "google0b4e48fe988ed60e.html",
  "Nuucaヌーカスリープ_HP用_強め_HTMLブロック.html",
]);

const BROKEN_SLUG_RE =
  /(?:^gap-(?:solo|car|disaster|training)-$)|(?:^gap-pc-ai-PC$)|(?:^gap-game-Sw-EL$)|(?:-$)/;

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

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function listArticleIds() {
  return fs
    .readdirSync(articleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(articleRoot, id, "index.html")));
}

function extractLatestDates() {
  const index = read(path.join(root, "index.html"));
  const start = index.indexOf("<h2>新着記事</h2>");
  if (start === -1) return [];
  const section = index.slice(start, index.indexOf("</section>", start));
  return [...section.matchAll(/<div class="article-meta">(\d{4}-\d{2}-\d{2})/g)].map((m) => m[1]);
}

function extractFeedLinks(feedXml) {
  return [...feedXml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]).slice(1);
}

function auditMetadata() {
  const issues = [];
  const files = walk(root, (file) => file.endsWith(".html"));
  for (const file of files) {
    const html = read(file);
    const rel = path.relative(root, file);
    if (UTILITY_HTML.has(rel) || html.includes('http-equiv="refresh"')) continue;
    if (!html.includes("<title")) issues.push(`missing title: ${rel}`);
    if (!html.includes('<meta name="description"')) issues.push(`missing description: ${rel}`);
    if (!html.includes("<h1")) issues.push(`missing h1: ${rel}`);
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

function auditAffiliateDisclosure() {
  const missing = [];
  const files = walk(articleRoot, (file) => file.endsWith("index.html"));
  for (const file of files) {
    const html = read(file);
    if (html.includes('http-equiv="refresh"')) continue;
    const rel = path.relative(root, file);
    if (!html.includes('class="ad-notice"') || !html.includes('class="article-disclosure"')) {
      missing.push(rel);
    }
  }
  return { checked: files.length, missing };
}

function auditBrokenSlugs(articleIds) {
  return articleIds.filter((id) => BROKEN_SLUG_RE.test(id));
}

function extractLatestSlugs() {
  const index = read(path.join(root, "index.html"));
  const start = index.indexOf("<h2>新着記事</h2>");
  if (start === -1) return [];
  const section = index.slice(start, index.indexOf("</section>", start));
  const slugs = [];
  for (const match of section.matchAll(/href="\.\/article\/([^"/]+)\//g)) {
    if (!slugs.includes(match[1])) slugs.push(match[1]);
  }
  return slugs;
}

function auditCanonical(articleIds) {
  const issues = [];
  for (const id of articleIds) {
    if (REDIRECT_ARTICLE_IDS.has(id)) continue;
    const html = read(path.join(articleRoot, id, "index.html"));
    if (/http-equiv="refresh"/i.test(html)) continue;
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "";
    const expected = `${SITE_BASE}/article/${id}/`;
    if (canonical !== expected) issues.push(`${id}: ${canonical}`);
  }
  return issues;
}

function auditSitemap(articleIds) {
  const sitemap = read(path.join(root, "sitemap.xml"));
  const siteUrls = new Set(parseSitemapUrls(sitemap));
  const rootSitemap = read(path.join(repoRoot, "sitemap.xml"));
  const rootUrls = parseSitemapUrls(rootSitemap);
  const rakutenRootUrls = rootUrls.filter((url) => url.includes("/rakuten-gear-review/"));
  const articleUrls = articleIds.map((id) => `${SITE_BASE}/article/${id}/`);
  const missingInSite = articleUrls.filter((url) => !siteUrls.has(url));
  const missingInRoot = articleUrls.filter((url) => !rootUrls.includes(url));
  const staleRoot = rakutenRootUrls.filter((url) => !siteUrls.has(url));
  return {
    siteUrlCount: siteUrls.size,
    rootRakutenUrlCount: rakutenRootUrls.length,
    missingInSite: missingInSite.slice(0, 10),
    missingInSiteCount: missingInSite.length,
    missingInRoot: missingInRoot.slice(0, 10),
    missingInRootCount: missingInRoot.length,
    staleRootCount: staleRoot.length,
    duplicateRootUrls: rootUrls.length - new Set(rootUrls).size,
  };
}

function auditFeed(feedXml) {
  const feedLinks = extractFeedLinks(feedXml);
  const feedSlugs = feedLinks.map((url) => url.split("/article/")[1]?.replace(/\/$/, "") || "");
  const indexSlugs = extractLatestSlugs();
  const feedTop5 = feedSlugs.slice(0, 5);
  const indexTop5 = indexSlugs.slice(0, 5);
  return {
    feedItems: (feedXml.match(/<item>/g) || []).length,
    feedTop5,
    indexTop5,
    feedMatchesIndexTop5: feedTop5.join("|") === indexTop5.join("|"),
  };
}

function auditArticleCountDisplay(articleIds) {
  const index = read(path.join(root, "index.html"));
  const statMatch = index.match(/<div class="stat"><b>(\d+)<\/b><small>レビュー記事<\/small><\/div>/);
  const textMatch = index.match(/全(\d+)記事から最新/);
  const articleCount = articleIds.length;
  return {
    articleDirCount: articleCount,
    publishedCount: articleCount,
    displayedStat: statMatch ? Number(statMatch[1]) : null,
    displayedText: textMatch ? Number(textMatch[1]) : null,
    statMatches: statMatch ? Number(statMatch[1]) === articleCount : false,
    textMatches: textMatch ? Number(textMatch[1]) === articleCount : false,
  };
}

function auditLegacySlugReferences() {
  const legacy = Object.keys({
    "gap-solo-": 1,
    "gap-car-": 1,
    "gap-disaster-": 1,
    "gap-training-": 1,
    "gap-pc-ai-PC": 1,
    "gap-game-Sw-EL": 1,
  });
  const hits = [];
  for (const file of walk(repoRoot, (f) => [".html", ".xml", ".js", ".json"].includes(path.extname(f)))) {
    const content = read(file);
    for (const slug of legacy) {
      if (content.includes(`/article/${slug}/`) || content.includes(`article/${slug}/`)) {
        hits.push(`${path.relative(repoRoot, file)} -> ${slug}`);
      }
    }
  }
  return hits;
}

function auditGiftFeed() {
  const feedPath = path.join(giftRoot, "feed.xml");
  if (!fs.existsSync(feedPath)) return { exists: false, items: 0 };
  const feed = read(feedPath);
  return { exists: true, items: (feed.match(/<item>/g) || []).length };
}

const articleIds = listArticleIds();
const latestDates = extractLatestDates();
const sitemapAudit = auditSitemap(articleIds);
const feedAudit = auditFeed(read(path.join(root, "feed.xml")));
const metadata = auditMetadata();
const links = auditLocalLinks();
const affiliateDisclosure = auditAffiliateDisclosure();
const brokenSlugs = auditBrokenSlugs(articleIds);
const canonicalIssues = auditCanonical(articleIds);
const articleCount = auditArticleCountDisplay(articleIds);
const legacySlugRefs = auditLegacySlugReferences();
const giftFeed = auditGiftFeed();

const warnings = [];
const errors = [];

if (!articleCount.statMatches || !articleCount.textMatches) {
  errors.push("article count display mismatch");
}
if (brokenSlugs.length) errors.push(`broken slugs: ${brokenSlugs.join(", ")}`);
if (legacySlugRefs.length) errors.push(`legacy slug references remain: ${legacySlugRefs.length}`);
if (sitemapAudit.missingInSiteCount) errors.push(`missing in site sitemap: ${sitemapAudit.missingInSiteCount}`);
if (sitemapAudit.missingInRootCount) errors.push(`missing in root sitemap: ${sitemapAudit.missingInRootCount}`);
if (sitemapAudit.staleRootCount) warnings.push(`stale root rakuten urls: ${sitemapAudit.staleRootCount}`);
if (sitemapAudit.duplicateRootUrls) errors.push(`duplicate root sitemap urls: ${sitemapAudit.duplicateRootUrls}`);
if (!feedAudit.feedMatchesIndexTop5) warnings.push("feed top5 does not match index top5");
if (metadata.issues.length) errors.push(...metadata.issues.slice(0, 20));
if (links.bad.length) errors.push(...links.bad.slice(0, 20));
if (affiliateDisclosure.missing.length) errors.push(`missing disclosure: ${affiliateDisclosure.missing.length}`);
if (canonicalIssues.length) errors.push(...canonicalIssues.slice(0, 10));
if (!latestDates.length) errors.push("latest section missing");
if (latestDates.length && !latestDates.every((date, index) => index === 0 || latestDates[index - 1] >= date)) {
  errors.push("latest dates not newest-first");
}
if (!giftFeed.exists) warnings.push("gift-for-you feed.xml missing");

const report = {
  articleDirs: articleIds.length,
  articleCount,
  latestDates,
  latestDatesNewestFirst: latestDates.every((date, index) => index === 0 || latestDates[index - 1] >= date),
  brokenSlugs,
  legacySlugRefCount: legacySlugRefs.length,
  sitemap: sitemapAudit,
  feed: feedAudit,
  giftFeed,
  affiliateDisclosure,
  metadata: { files: metadata.files, issueCount: metadata.issues.length },
  links: { files: links.files, badCount: links.bad.length },
  warnings,
  errors,
};

console.log(JSON.stringify(report, null, 2));

if (errors.length) process.exitCode = 1;
