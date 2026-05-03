const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review";
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");

const sandbox = {
  console,
  window: { addEventListener() {}, location: { hash: "" }, scrollTo() {} },
  document: {
    querySelector() {
      return {
        addEventListener() {},
        focus() {},
        classList: { toggle() {}, remove() {} }
      };
    }
  },
  URLSearchParams,
  encodeURIComponent,
  String
};

vm.createContext(sandbox);
vm.runInContext(`${appSource}\nthis.__DATA__ = { categories, products, articles };`, sandbox);

const { categories, products, articles } = sandbox.__DATA__;

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function categoryName(id) {
  return categories.find((category) => category.id === id)?.name || "";
}

function productUrl(product) {
  return product.affiliateUrl || product.rakutenProductUrl || "";
}

function layout({ title, description, canonical, body, structuredData }) {
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="元自衛官の楽天装備レビュー" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="../../styles.css" />
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="../../">
        <span class="brand-mark">装</span>
        <span>
          <strong>元自衛官の楽天装備レビュー</strong>
          <small>暮らしをラクにする装備品レビュー</small>
        </span>
      </a>
      <nav class="site-nav" aria-label="メインナビゲーション">
        <a href="../../">トップ</a>
        <a href="../../#/articles">記事一覧</a>
        <a href="../../#/category/disaster">防災装備</a>
      </nav>
    </header>
    <main>${body}</main>
    <footer class="site-footer">
      <div>
        <strong>元自衛官の楽天装備レビュー</strong>
        <p>当サイトはアフィリエイト広告を利用しています。価格・在庫・レビューはリンク先の楽天市場で最新情報をご確認ください。</p>
      </div>
      <a href="../../">トップへ戻る</a>
    </footer>
  </body>
</html>
`;
}

function renderProduct(product) {
  const url = productUrl(product);
  return `<article class="product-card">
    <a class="product-media" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">
      <img src="${product.imageUrl}" alt="${esc(product.name)}" loading="lazy" />
    </a>
    <div class="product-content">
      <div class="product-category">${esc(categoryName(product.category))}</div>
      <h3>${esc(product.name)}</h3>
      <dl>
        <div><dt>おすすめポイント</dt><dd>${esc(product.description)}</dd></div>
        <div><dt>向いている人</dt><dd>${esc(product.recommendedFor)}</dd></div>
      </dl>
      <a class="button rakuten" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">楽天で価格を見る</a>
    </div>
  </article>`;
}

function renderArticle(article) {
  const dir = path.join(root, "article", article.id);
  fs.mkdirSync(dir, { recursive: true });
  const articleProducts = article.productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const canonical = `${siteUrl}/article/${article.id}/`;
  const body = `<div class="article-layout">
    <article class="article-main">
      <header class="article-hero">
        <p class="eyebrow">${esc(categoryName(article.category))}</p>
        <h1>${esc(article.title)}</h1>
        <p class="lead">${esc(article.summary)}</p>
        <p class="article-meta">${esc(article.date)} ・ 読了目安 ${esc(article.readTime)}</p>
        <p class="ad-notice">当サイトはアフィリエイト広告を利用しています。</p>
      </header>
      <div class="article-content">
        ${article.body
          .map((section) => `<section class="article-section"><h2>${esc(section.heading)}</h2>${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</section>`)
          .join("")}
        <div class="summary-box">
          <h2>この記事で紹介した商品まとめ</h2>
          <p>気になる装備は、価格・レビュー・在庫を楽天で確認してから選んでください。</p>
        </div>
        <div class="product-grid compact">${articleProducts.map(renderProduct).join("")}</div>
      </div>
    </article>
  </div>`;

  fs.writeFileSync(
    path.join(dir, "index.html"),
    layout({
      title: `${article.title} | 元自衛官の楽天装備レビュー`,
      description: article.summary,
      canonical,
      body,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: article.summary,
        datePublished: article.date,
        dateModified: article.date,
        author: { "@type": "Person", name: "元自衛官の楽天装備レビュー" },
        mainEntityOfPage: canonical
      }
    }),
    "utf8"
  );
}

articles.forEach(renderArticle);

const urls = [`${siteUrl}/`, ...articles.map((article) => `${siteUrl}/article/${article.id}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>2026-05-03</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url.endsWith("/rakuten-gear-review/") ? "1.0" : "0.8"}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: product.name,
    url: product.rakutenProductUrl
  }))
};

fs.writeFileSync(path.join(root, "structured-data.json"), JSON.stringify(itemList, null, 2), "utf8");
console.log(`Generated ${articles.length} article pages and sitemap.xml`);
