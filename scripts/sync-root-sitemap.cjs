const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const PROFILE_HOME = "https://dai32320888-ship-it.github.io/daichi-profile-site/";
const RAKUTEN_SITEMAP = path.join(repoRoot, "rakuten-gear-review", "sitemap.xml");
const GIFT_SITEMAP = path.join(repoRoot, "gift-for-you", "sitemap.xml");
const ROOT_SITEMAP = path.join(repoRoot, "sitemap.xml");

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function parseEntries(xml) {
  const entries = [];
  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = match[1];
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) continue;
    entries.push({
      loc,
      lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || "",
      changefreq: block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] || "weekly",
      priority: block.match(/<priority>([^<]+)<\/priority>/)?.[1] || "0.8",
    });
  }
  return entries;
}

function mergeRootSitemap() {
  const rakuten = parseEntries(read(RAKUTEN_SITEMAP));
  const gift = parseEntries(read(GIFT_SITEMAP));
  const byLoc = new Map();

  byLoc.set(PROFILE_HOME, {
    loc: PROFILE_HOME,
    lastmod: rakuten[0]?.lastmod || gift[0]?.lastmod || new Date().toISOString().slice(0, 10),
    changefreq: "weekly",
    priority: "1.0",
  });

  for (const entry of [...rakuten, ...gift]) {
    byLoc.set(entry.loc, entry);
  }

  const urls = [...byLoc.values()];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

  fs.writeFileSync(ROOT_SITEMAP, xml, "utf8");
  return { urlCount: urls.length, rakutenCount: rakuten.length, giftCount: gift.length };
}

if (require.main === module) {
  console.log(JSON.stringify(mergeRootSitemap(), null, 2));
}

module.exports = { mergeRootSitemap, parseEntries };
