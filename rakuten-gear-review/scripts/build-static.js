const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { midArticleSlot, footArticleSlot, sidebarSlot } = require("./a8-ad-slots");

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

const { categories, products, articles, placeholderImage, rakutenAffiliateUrl, rakutenSearchAffiliateUrl, getCategory } =
  sandbox.__DATA__;

const AUTHOR_PEN_NAME = "だるい装備レビュー編集部";
const CONTACT_X_URL = "https://x.com/darui_tsubushi";
const CONTACT_X_HANDLE = "@darui_tsubushi";
const ARTICLE_DISCLOSURE_TEXT =
  "本ページには広告・アフィリエイトリンクが含まれます。紹介内容は、読者が比較しやすいように整理しています。";

function resolveRelatedArticleIds(article, maxRelated = 3) {
  const out = [];
  const seen = new Set();
  const pushId = (id) => {
    if (out.length >= maxRelated) return;
    if (id === article.id) return;
    const a = articles.find((x) => x.id === id);
    if (!a || seen.has(id)) return;
    seen.add(id);
    out.push(id);
  };
  for (const id of article.relatedArticleIds || []) pushId(id);
  if (out.length < maxRelated) {
    const sameCat = [...articles]
      .filter((x) => x.id !== article.id && x.category === article.category)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    for (const a of sameCat) pushId(a.id);
  }
  if (out.length === 0) {
    const anyOther = articles.find((a) => a.id !== article.id);
    if (anyOther) pushId(anyOther.id);
  }
  if (out.length < maxRelated) {
    const rest = [...articles]
      .filter((x) => x.id !== article.id && !seen.has(x.id))
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    for (const a of rest) {
      pushId(a.id);
      if (out.length >= maxRelated) break;
    }
  }
  return out;
}

function buildArticleTocItems(article) {
  const items = [];
  (article.body || []).forEach((section, i) => {
    if (section.heading) items.push({ label: section.heading, id: `section-${i}` });
  });
  const picks = article.picks || [];
  if (picks.length) {
    const label = picks.length === 7 ? "今回ピックアップする7つ" : `今回ピックアップする${picks.length}つ`;
    items.push({ label, id: "picks-intro" });
    picks.forEach((pick, i) => items.push({ label: pick.name, id: `pick-${i + 1}` }));
  }
  return items;
}

function renderArticleToc(article) {
  const items = buildArticleTocItems(article);
  if (items.length < 2) return "";
  const lis = items.map((item) => `<li><a href="#${esc(item.id)}">${esc(item.label)}</a></li>`).join("");
  return `<nav class="article-toc" aria-label="この記事の目次"><p class="article-toc__title">目次</p><ul class="article-toc__list">${lis}</ul></nav>`;
}

function renderStaticProfileBox() {
  return `<section class="profile-box">
      <div class="profile-head">
        <div class="avatar">元</div>
        <div>
          <h3>運営者・${esc(AUTHOR_PEN_NAME)}</h3>
          <div class="article-meta">元自衛官の経験を、装備選びの基準にしています</div>
        </div>
      </div>
      <p>このサイトは、元自衛官の運営者が、生活・防災・車内・デスク周りで「実際に使いやすそうか」を重視して商品を整理するレビューサイトです。高すぎる物や見た目だけの商品ではなく、日常でラクになるか、備えとして役立つかを基準に紹介しています。</p>
      <p><strong>このサイトの目的：</strong>楽天市場で迷いやすいカテゴリを、用途・置き場所・頻度で分けて、比較しやすい形にまとめることです。</p>
      <p><strong>読者への約束：</strong>価格・在庫・レビューは必ず商品ページで確かめてくださいとお伝えします。PRやアフィリエイトの利用も、記事冒頭・広告枠で明示します。</p>
      <p class="profile-contact">更新情報・誤記のご指摘：<a href="${esc(CONTACT_X_URL)}" target="_blank" rel="me noopener noreferrer">${esc(CONTACT_X_HANDLE)}</a>（X）</p>
    </section>`;
}

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

const CATEGORY_THUMB_FILES = {
  life: "images/thumb-life.png",
  "pc-ai": "images/thumb-desk.png",
  training: "images/thumb-training.png",
  bike: "images/thumb-bike.png",
  disaster: "images/thumb-disaster.png",
  solo: "images/thumb-living-alone.png",
  car: "images/thumb-car.png"
};

const ARTICLE_THUMB_ONERROR =
  "this.onerror=null;var p=this.closest('.article-thumb');this.remove();if(p)p.classList.remove('article-thumb--photo');";

function articlePickCountForCard(article) {
  if (Array.isArray(article.picks) && article.picks.length) return article.picks.length;
  return (article.productIds && article.productIds.length) || 0;
}

function resolveCardThumbUrl(article) {
  const direct = article.thumbnailImage || article.heroImage;
  if (direct) {
    const s = String(direct).trim();
    if (/^https?:\/\//i.test(s)) return s;
    return `${siteUrl}/${s.replace(/^\.\//, "")}`;
  }
  const cf = CATEGORY_THUMB_FILES[article.category];
  if (cf) return `${siteUrl}/${cf}`;
  const pid = (article.productIds || [])[0];
  if (pid) {
    const p = products.find((x) => x.id === pid);
    if (p?.imageUrl) return p.imageUrl;
  }
  if (article.picks?.[0]?.imageUrl) return article.picks[0].imageUrl;
  return "";
}

function renderArticleCardHtml(article, articleHref) {
  const cat = getCategory(article.category);
  const catName = cat?.name || "装備";
  const pickTotal = articlePickCountForCard(article);
  const thumbUrl = resolveCardThumbUrl(article);
  const thumbClass = thumbUrl ? "article-thumb article-thumb--photo" : "article-thumb";
  const altText = `${article.title}（${catName}）`;
  const thumbImg = thumbUrl
    ? `<img src="${esc(thumbUrl)}" alt="${esc(altText)}" width="640" height="360" loading="lazy" decoding="async" onerror="${ARTICLE_THUMB_ONERROR}" />`
    : "";
  const date = article.date != null ? String(article.date) : "";
  const readTime = article.readTime != null ? String(article.readTime) : "";

  return `<article class="article-card">
      <a class="${thumbClass}" href="${esc(articleHref)}">
        ${thumbImg}
        <span class="article-thumb__meta">
          <span>${esc(catName)}</span>
          <strong>${pickTotal}ピック</strong>
        </span>
      </a>
      <div class="article-body">
        <div class="article-meta">${esc(date)} ・ 読了目安 ${esc(readTime)}</div>
        <h3>${esc(article.title)}</h3>
        <p>${esc(article.summary || "")}</p>
        <a class="button secondary button--inline-sm" href="${esc(articleHref)}">記事を読む</a>
      </div>
    </article>`;
}

function productUrl(product) {
  return product.affiliateUrl || product.rakutenProductUrl || "";
}

function layout({ title, description, canonical, body, structuredData, ogType = "article" }) {
  const ogImageAbs = `${siteUrl}/images/og-default.png`;
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${esc(ogType)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="元自衛官の楽天装備レビュー" />
    <meta property="og:image" content="${ogImageAbs}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${ogImageAbs}" />
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
      <button class="menu-button" id="menuButton" type="button" aria-label="メニューを開く">☰</button>
      <nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        <a href="../../index.html">トップ</a>
        <a href="../../index.html#/articles">記事一覧</a>
        <a href="../../index.html#/category/training">筋トレ装備</a>
        <a href="../../index.html#/category/disaster">防災装備</a>
        <a href="../../index.html#/profile">プロフィール</a>
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
    <script>
      (function () {
        var btn = document.getElementById("menuButton");
        var nav = document.getElementById("siteNav");
        if (btn && nav) {
          btn.addEventListener("click", function () {
            nav.classList.toggle("open");
          });
          nav.addEventListener("click", function (e) {
            if (e.target.tagName === "A") nav.classList.remove("open");
          });
        }
      })();
    </script>
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

function renderArticleBodySectionsWithMidAd(article) {
  const sections = article.body || [];
  if (!sections.length) return "";
  const midAfter = Math.max(1, Math.ceil(sections.length / 2));
  return sections
    .map((section, idx) => {
      const chunk = `<section class="article-section" id="section-${idx}"><h2>${esc(section.heading)}</h2>${section.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</section>`;
      const bridge = idx + 1 === midAfter ? midArticleSlot(article) : "";
      return chunk + bridge;
    })
    .join("");
}

function renderPicksSectionWithMidAd(article) {
  const picks = article.picks || [];
  if (!picks.length) return "";
  const label = picks.length === 7 ? "7つ" : `${picks.length}つ`;
  const midAfter = Math.max(1, Math.ceil(picks.length / 2));
  const blocks = picks
    .map((pick, i) => {
      const block = renderPickBlock(pick, i + 1);
      return i + 1 === midAfter ? `${block}${midArticleSlot(article)}` : block;
    })
    .join("");
  return `<h2 class="picks-section-title" id="picks-intro">今回ピックアップする${label}</h2>${blocks}`;
}

function renderConclusionRelated(article) {
  const conclusionParas = normalizeParagraphs(article.conclusionParagraphs);
  const conclusion = conclusionParas.length
    ? `<div class="summary-box"><h2>まとめ</h2>${conclusionParas.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`
    : "";
  const relatedIds = resolveRelatedArticleIds(article);
  const relatedCards = relatedIds
    .map((id) => articles.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => renderArticleCardHtml(a, `../${a.id}/index.html`))
    .join("");
  const related = relatedCards
    ? `<div class="related-articles"><h2>関連記事</h2><div class="article-grid related-article-grid">${relatedCards}</div></div>`
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
  const metaDesc = article.metaDescription || article.summary;
  const bodySections = renderArticleBodySectionsWithMidAd(article);
  const picksSection = hasPicks ? renderPicksSectionWithMidAd(article) : "";
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
  const cat = getCategory(article.category);
  const catDesc = cat?.description || "";
  const catLabel = cat?.name || "";
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
        <p class="article-disclosure">${esc(ARTICLE_DISCLOSURE_TEXT)}</p>
        ${renderArticleIntroAudience(article)}
        ${renderArticleToc(article)}
        ${bodySections}
        ${picksSection}
        ${catalogSummary}
        ${footArticleSlot(article)}
        ${renderConclusionRelated(article)}
      </div>
    </article>
    <aside class="sidebar">
      ${renderStaticProfileBox()}
      ${sidebarSlot(article)}
      <div class="profile-box">
        <h3>同じカテゴリの記事</h3>
        <p>${esc(catDesc)}</p>
        <div class="section-actions">
          <a class="button secondary button--inline-sm" href="../../index.html#/category/${esc(article.category)}">${esc(catLabel)}を見る</a>
        </div>
      </div>
    </aside>
  </div>`;

  fs.writeFileSync(
    path.join(dir, "index.html"),
    layout({
      title: `${article.title} | 元自衛官の楽天装備レビュー`,
      description: metaDesc,
      canonical,
      body,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: article.title,
        description: metaDesc,
        datePublished: article.date,
        dateModified: article.date,
        author: { "@type": "Person", name: AUTHOR_PEN_NAME, url: `${siteUrl}/` },
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

