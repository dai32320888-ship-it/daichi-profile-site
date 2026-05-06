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
vm.runInContext(
  `${appSource}\nthis.__DATA__ = { categories, products, articles, placeholderImage, rakutenAffiliateUrl, rakutenSearchAffiliateUrl, getCategory };`,
  sandbox
);

const { categories, products, articles, placeholderImage, rakutenAffiliateUrl, rakutenSearchAffiliateUrl, getCategory } = sandbox.__DATA__;

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
      <a class="brand" href="../../index.html">
        <span class="brand-mark">装</span>
        <span>
          <strong>元自衛官の楽天装備レビュー</strong>
          <small>暮らしをラクにする装備品レビュー</small>
        </span>
      </a>
      <nav class="site-nav" aria-label="メインナビゲーション">
        <a href="../../index.html">トップ</a>
        <a href="../../index.html#/articles">記事一覧</a>
        <a href="../../index.html#/category/disaster">防災装備</a>
      </nav>
    </header>
    <main>${body}</main>
    <footer class="site-footer">
      <div>
        <strong>元自衛官の楽天装備レビュー</strong>
        <p>当サイトはアフィリエイト広告を利用しています。価格・在庫・レビューはリンク先の楽天市場で最新情報をご確認ください。</p>
      </div>
      <a href="../../index.html">トップへ戻る</a>
    </footer>
  </body>
</html>
`;
}

function normalizeParagraphs(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function pickResolveUrl(pick) {
  if (pick.affiliateUrl) return pick.affiliateUrl;
  if (pick.rakutenProductUrl) return rakutenAffiliateUrl(pick.rakutenProductUrl);
  if (pick.rakutenSearchKeyword) return rakutenSearchAffiliateUrl(pick.rakutenSearchKeyword);
  return "";
}

function renderArticleIntroAudience(article) {
  const intro = normalizeParagraphs(article.introParagraphs)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");
  const audience = article.forAudience?.length
    ? `<div class="summary-box audience-box"><h2>この記事はこんな人向け</h2><ul>${article.forAudience.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`
    : "";
  const introBlock = intro ? `<div class="article-intro">${intro}</div>` : "";
  return `${introBlock}${audience}`;
}

function renderPickBlock(pick, index) {
  const url = pickResolveUrl(pick);
  const cat = getCategory(pick.category);
  const catName = cat?.name || "装備";
  const imgSrc = pick.imageUrl || placeholderImage(pick.imageLabel || pick.name, pick.category);
  const btn = url
    ? `<a class="button rakuten" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">楽天で見る</a>`
    : `<button class="button disabled" type="button" disabled>リンク準備中</button>`;
  const mediaOpen = url
    ? `<a class="product-media" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="${esc(pick.name)}">`
    : `<div class="product-media" role="img" aria-label="${esc(pick.name)}">`;
  const mediaClose = url ? "</a>" : "</div>";
  const intros = normalizeParagraphs(pick.intro)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("");
  const scenes = pick.scenes?.length
    ? `<h3 class="pick-subheading">こんな場面で使える</h3><ul>${pick.scenes.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
    : "";
  const caution = pick.caution?.length
    ? `<h3 class="pick-subheading">注意点</h3><ul>${pick.caution.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
    : "";
  const pickIndex0 = Math.max(0, index - 1);

  return `
    <section class="pick-block article-section" id="pick-${index}">
      <div class="pick-kicker">ピック ${index}</div>
      <h2>${esc(pick.name)}</h2>
      <div class="pick-layout">
        ${mediaOpen}<img src="${esc(imgSrc)}" alt="${esc(pick.name)}" loading="lazy" />${mediaClose}
        <div class="pick-body">
          <div class="product-category">${esc(catName)}</div>
          ${intros}
          ${scenes}
          ${caution}
          <p class="editor-link-hint">楽天リンク差し替え：<code>app.js</code> の該当記事の <code>picks[${pickIndex0}]</code> に、<code>rakutenProductUrl</code> か <code>affiliateUrl</code> を入れてください。仮のときは <code>rakutenSearchKeyword</code>。画像は <code>imageUrl</code>。</p>
          ${btn}
        </div>
      </div>
    </section>
  `;
}

function renderConclusionRelated(article) {
  const conclusionParas = normalizeParagraphs(article.conclusionParagraphs);
  const conclusion = conclusionParas.length
    ? `<div class="summary-box"><h2>まとめ</h2>${conclusionParas.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`
    : "";
  const relatedIds = article.relatedArticleIds || [];
  const relatedItems = relatedIds
    .map((id) => articles.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => `<li><a href="../${esc(a.id)}/index.html">${esc(a.title)}</a></li>`)
    .join("");
  const related = relatedItems
    ? `<div class="related-articles"><h2>関連記事</h2><ul class="related-list">${relatedItems}</ul></div>`
    : "";
  return `${conclusion}${related}`;
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
      <a class="button rakuten" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">楽天で見る</a>
    </div>
  </article>`;
}

function renderArticle(article) {
  const dir = path.join(root, "article", article.id);
  fs.mkdirSync(dir, { recursive: true });
  const hasPicks = Array.isArray(article.picks) && article.picks.length;
  const productIds = article.productIds || [];
  const articleProducts = hasPicks ? [] : productIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);
  const sameCategoryProducts = hasPicks
    ? []
    : products.filter((product) => product.category === article.category && !productIds.includes(product.id));
  const canonical = `${siteUrl}/article/${article.id}/`;
  const bodySections = (article.body || [])
    .map(
      (section) =>
        `<section class="article-section"><h2>${esc(section.heading)}</h2>${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</section>`
    )
    .join("");
  const picksSection = hasPicks
    ? `<h2 class="picks-section-title">今回ピックアップする7つ</h2>${article.picks.map((pick, i) => renderPickBlock(pick, i + 1)).join("")}`
    : "";
  const catalogSummary = hasPicks
    ? ""
    : `
        <div class="summary-box">
          <h2>この記事で紹介した商品まとめ</h2>
          <p>気になる装備は、価格・レビュー・在庫を楽天で確認してから選んでください。</p>
        </div>
        <div class="product-grid compact">${articleProducts.map(renderProduct).join("")}</div>
        ${
          sameCategoryProducts.length
            ? `
              <div class="summary-box">
                <h2>同カテゴリの商品</h2>
                <p>${esc(categoryName(article.category))}でほかにチェックしたい装備です。</p>
              </div>
              <div class="product-grid compact">${sameCategoryProducts.map(renderProduct).join("")}</div>
            `
            : ""
        }
      `;
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
        ${renderArticleIntroAudience(article)}
        ${bodySections}
        ${picksSection}
        ${catalogSummary}
        ${renderConclusionRelated(article)}
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
  .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>2026-05-04</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url.endsWith("/rakuten-gear-review/") ? "1.0" : "0.8"}</priority>\n  </url>`)
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

