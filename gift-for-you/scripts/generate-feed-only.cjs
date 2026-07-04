const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const baseUrl = "https://dai32320888-ship-it.github.io/daichi-profile-site/gift-for-you/";
const lastMod = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function cdataFeedText(value) {
  return `<![CDATA[${String(value || "").replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

function parseArticle(slug) {
  const file = path.join(siteRoot, "article", slug, "index.html");
  const html = read(file);
  const title = stripTags(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || slug);
  const description =
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ||
    `${title}の選び方を紹介します。`;
  return { slug, title, description };
}

const index = read(path.join(siteRoot, "index.html"));
const slugs = [];
for (const match of index.matchAll(/href="article\/([^"/]+)\//g)) {
  if (!slugs.includes(match[1])) slugs.push(match[1]);
}

const items = slugs
  .reverse()
  .slice(0, 30)
  .map((slug) => {
    const article = parseArticle(slug);
    const link = `${baseUrl}article/${article.slug}/`;
    const pubDate = new Date(`${lastMod}T09:00:00+09:00`).toUTCString();
    return `    <item>
      <title>${cdataFeedText(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdataFeedText(article.description)}</description>
    </item>`;
  })
  .join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>プレゼントふぉーゆー</title>
    <link>${baseUrl}</link>
    <description>相手・予算・シーンから失敗しにくいプレゼント候補を探せる診断風サイトです。</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(siteRoot, "feed.xml"), feed, "utf8");

let indexHtml = index;
if (!indexHtml.includes('type="application/rss+xml"')) {
  indexHtml = indexHtml.replace(
    '<link rel="stylesheet" href="styles.css">',
    '<link rel="alternate" type="application/rss+xml" title="プレゼントふぉーゆー" href="./feed.xml" />\n  <link rel="stylesheet" href="styles.css">',
  );
  fs.writeFileSync(path.join(siteRoot, "index.html"), indexHtml, "utf8");
}

console.log(`Generated gift feed with ${Math.min(slugs.length, 30)} items.`);
