const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { midArticleSlot, footArticleSlot, sidebarSlot } = require("./a8-ad-slots");
const {
  loadConfig: loadRakutenWidgetsConfig,
  renderPlacement: renderRakutenPlacement,
  renderHomeCampaignSection,
  renderHomeMotionSection
} = require("./rakuten-widgets");

const root = path.resolve(__dirname, "..");
const rakutenWidgetsConfig = loadRakutenWidgetsConfig(root);
const DEFAULT_SITE_URL = "https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review";
const SITE_URL = (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
const CANONICAL_BASE_URL = (process.env.CANONICAL_BASE_URL || SITE_URL).replace(/\/+$/, "");
const SITEMAP_BASE_URL = (process.env.SITEMAP_BASE_URL || SITE_URL).replace(/\/+$/, "");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");

const sandbox = {
  console,
  window: { addEventListener() {}, location: { hash: "", search: "" }, scrollTo() {} },
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
  `${appSource}\nthis.__DATA__ = { categories, products, articles, placeholderImage, rakutenAffiliateUrl, rakutenSearchAffiliateUrl, getCategory, getArticleCardImageUrl };`,
  sandbox
);

const {
  categories,
  products,
  articles: baseArticles,
  placeholderImage,
  rakutenAffiliateUrl,
  rakutenSearchAffiliateUrl,
  getCategory,
  getArticleCardImageUrl
} = sandbox.__DATA__;

const extraPath = path.join(root, "data", "extra-articles.json");
const extraArticles = fs.existsSync(extraPath) ? JSON.parse(fs.readFileSync(extraPath, "utf8")) : [];
const seenIds = new Set(baseArticles.map((a) => a.id));
const articles = [...baseArticles];
for (const extra of extraArticles) {
  if (!seenIds.has(extra.id)) {
    articles.push(extra);
    seenIds.add(extra.id);
  }
}

const REDIRECT_ARTICLES = {
  "nintendo-switch-2-rakuten": "nintendo-switch-2-rakuten-jp-model",
  "auto-p004-防災-リュック-コンパクト": "auto-p014-防災-リュック-コンパクト"
};

const AUTHOR_PEN_NAME = "だるい装備レビュー編集部";
const CONTACT_X_URL = "https://x.com/darui_tsubushi";
const CONTACT_X_HANDLE = "@darui_tsubushi";
const ARTICLE_DISCLOSURE_TEXT =
  "本ページには広告・アフィリエイトリンクが含まれます。紹介内容は、読者が比較しやすいように整理しています。";

function articleTopicKey(article) {
  const fromTitle = article.title?.match(/「([^」]+)」/)?.[1]?.trim();
  if (fromTitle) return fromTitle;
  return String(article.id)
    .replace(/^auto-p\d+-/, "")
    .replace(/-/g, " ");
}

function dedupeArticlesByTopic(articleList) {
  const seen = new Set();
  const out = [];
  for (const article of articleList) {
    const key = articleTopicKey(article);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(article);
  }
  return out;
}

function resolveRelatedArticleIds(article, maxRelated = 3) {
  const out = [];
  const seen = new Set();
  const topicSeen = new Set([articleTopicKey(article)]);
  const pushId = (id) => {
    if (out.length >= maxRelated) return;
    if (id === article.id) return;
    const a = articles.find((x) => x.id === id);
    if (!a || seen.has(id)) return;
    const topic = articleTopicKey(a);
    if (topicSeen.has(topic)) return;
    seen.add(id);
    topicSeen.add(topic);
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

function loadPromotionConfig() {
  const promoPath = path.join(root, "data", "promotion.json");
  if (!fs.existsSync(promoPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(promoPath, "utf8"));
  } catch {
    return {};
  }
}

function rssHeadLink(feedHref) {
  return `<link rel="alternate" type="application/rss+xml" title="元自衛官の楽天装備レビュー" href="${esc(feedHref)}" />`;
}

function renderPromotionFooter(topHref) {
  const promo = loadPromotionConfig();
  const badges = [];
  if (promo.blogmura?.cid) {
    badges.push(
      `<a href="https://blogmura.com/ranking/in?p_cid=${esc(promo.blogmura.cid)}" target="_blank" rel="noopener noreferrer"><img src="https://blogmura.com/img/blogmura_ranking_banner_01.gif" width="117" height="31" alt="にほんブログ村 ブログランキング"></a>`
    );
  } else {
    badges.push(
      `<a class="promo-badge" href="https://mypage.blogmura.com/signup" target="_blank" rel="noopener noreferrer">にほんブログ村</a>`
    );
  }
  if (promo.with2?.hash) {
    badges.push(
      `<a href="https://blog.with2.net/link/?hash=${esc(promo.with2.hash)}" target="_blank" rel="noopener noreferrer"><img src="https://blog.with2.net/img/banner/banner_80.gif" width="80" height="15" alt="人気ブログランキング"></a>`
    );
  } else {
    badges.push(
      `<a class="promo-badge" href="https://blog.with2.net/join" target="_blank" rel="noopener noreferrer">人気ブログランキング</a>`
    );
  }
  const badgeHtml = `<div class="promo-badges" aria-label="ブログランキング">${badges.join("")}</div>`;
  const blogParts = promo.blogmura?.blogParts;
  const blogPartsHtml =
    promo.blogmura?.cid && blogParts
      ? `<div class="promo-blogparts" aria-label="にほんブログ村">
        <div class="blogmura-blogparts" data-chid="${esc(promo.blogmura.cid)}" data-category="${esc(blogParts.category || "0")}" data-type="${esc(blogParts.type || "pv")}"></div>
        <script src="https://blogparts.blogmura.com/js/parts_view.js" defer></script>
      </div>`
      : "";
  const feedHref = `${topHref}feed.xml`;
  return `<footer class="site-footer">
      <div class="site-footer__main">
        <strong>元自衛官の楽天装備レビュー</strong>
        <p>当サイトはアフィリエイト広告を利用しています。価格・在庫・レビューはリンク先の楽天市場で最新情報をご確認ください。</p>
        ${badgeHtml}
        ${blogPartsHtml}
        <p class="promo-feed"><a href="${esc(feedHref)}">RSS</a></p>
      </div>
      <a href="${esc(topHref)}">トップへ戻る</a>
    </footer>`;
}

function categoryName(id) {
  return categories.find((category) => category.id === id)?.name || "";
}

const ARTICLE_THUMB_ONERROR =
  "this.onerror=null;var p=this.closest('.article-thumb');this.remove();if(p)p.classList.remove('article-thumb--photo');";

function articlePickCountForCard(article) {
  if (Array.isArray(article.picks) && article.picks.length) return article.picks.length;
  return (article.productIds && article.productIds.length) || 0;
}

function renderArticleCardHtml(article, articleHref) {
  const cat = getCategory(article.category);
  const catName = cat?.name || "装備";
  const pickTotal = articlePickCountForCard(article);
  const thumbUrl = getArticleCardImageUrl(article);
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
        <h3><a class="article-title-link" href="${esc(articleHref)}">${esc(article.title)}</a></h3>
        <p>${esc(article.summary || "")}</p>
        <a class="button secondary button--inline-sm" href="${esc(articleHref)}">記事を読む</a>
      </div>
    </article>`;
}

function productUrl(product) {
  return product.affiliateUrl || product.rakutenProductUrl || "";
}

function layout({ title, description, canonical, body, structuredData, ogType = "article" }) {
  const ogImageAbs = `${CANONICAL_BASE_URL}/images/og-default.png`;
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
    ${rssHeadLink("../../feed.xml")}
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
        <a href="../../index.html#articles">記事一覧</a>
        <a href="../../category/training.html">筋トレ装備</a>
        <a href="../../category/disaster.html">防災装備</a>
        <a href="../../index.html#profile">プロフィール</a>
      </nav>
    </header>
    <main>${body}</main>
    ${renderPromotionFooter("../../")}
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

function layoutHome({ title, description, canonical, body, structuredData }) {
  const ogImageAbs = `${CANONICAL_BASE_URL}/images/og-default.png`;
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="元自衛官の楽天装備レビュー" />
    <meta property="og:image" content="${ogImageAbs}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${ogImageAbs}" />
    ${rssHeadLink("./feed.xml")}
    <link rel="stylesheet" href="./styles.css" />
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="./">
        <span class="brand-mark">装</span>
        <span>
          <strong>元自衛官の楽天装備レビュー</strong>
          <small>暮らしをラクにする装備品レビュー</small>
        </span>
      </a>
      <button class="menu-button" id="menuButton" type="button" aria-label="メニューを開く">☰</button>
      <nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        <a href="./">トップ</a>
        <a href="#articles">記事一覧</a>
        <a href="#categories">カテゴリ</a>
        <a href="#profile">プロフィール</a>
      </nav>
    </header>
    <main>${body}</main>
    ${renderPromotionFooter("./")}
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
    <script src="./rakuten-widgets-browser.js" defer></script>
    <script src="./a8-browser-data.js" defer></script>
  </body>
</html>
`;
}

function layoutCategory({ title, description, canonical, body, structuredData }) {
  const ogImageAbs = `${CANONICAL_BASE_URL}/images/og-default.png`;
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="元自衛官の楽天装備レビュー" />
    <meta property="og:image" content="${ogImageAbs}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${rssHeadLink("../feed.xml")}
    <link rel="stylesheet" href="../styles.css" />
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
  </head>
  <body>
    <header class="site-header">
      <a class="brand" href="../index.html">
        <span class="brand-mark">装</span>
        <span>
          <strong>元自衛官の楽天装備レビュー</strong>
          <small>暮らしをラクにする装備品レビュー</small>
        </span>
      </a>
      <button class="menu-button" id="menuButton" type="button" aria-label="メニューを開く">☰</button>
      <nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        <a href="../index.html">トップ</a>
        <a href="../index.html#articles">記事一覧</a>
        <a href="../index.html#categories">カテゴリ</a>
        <a href="../index.html#profile">プロフィール</a>
      </nav>
    </header>
    <main>${body}</main>
    ${renderPromotionFooter("../")}
    <script>
      (function () {
        var btn = document.getElementById("menuButton");
        var nav = document.getElementById("siteNav");
        if (btn && nav) {
          btn.addEventListener("click", function () { nav.classList.toggle("open"); });
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
  const specs = pick.specs?.length
    ? `<h3 class="pick-subheading">スペック・商品情報</h3><ul class="pick-specs">${pick.specs.map((s) => `<li>${esc(typeof s === "string" ? s : `${s.label}：${s.value}`)}</li>`).join("")}</ul>`
    : "";
  const usage = pick.usageExamples?.length
    ? `<h3 class="pick-subheading">使用例</h3><ul class="pick-usage">${pick.usageExamples.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`
    : "";
  const comparison = pick.comparisonNote
    ? `<p class="pick-comparison"><strong>他候補との違い：</strong>${esc(pick.comparisonNote)}</p>`
    : "";
  const verdict = pick.verdict
    ? `<p class="pick-verdict"><strong>こんな人向け：</strong>${esc(pick.verdict)}</p>`
    : "";
  const roleBadge = pick.role ? `<span class="pick-role-badge">${esc(pick.role)}</span>` : "";
  const title = url
    ? `<h2><a class="pick-title-link" href="${esc(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">${esc(pick.name)}</a></h2>`
    : `<h2>${esc(pick.name)}</h2>`;

  return `
    <section class="pick-block article-section" id="pick-${index}">
      <div class="pick-kicker">ピック ${index}${roleBadge ? ` ${roleBadge}` : ""}</div>
      ${title}
      <div class="pick-layout">
        ${mediaOpen}<img src="${esc(imgSrc)}" alt="${esc(pick.name)}" loading="lazy" decoding="async" />${mediaClose}
        <div class="pick-body">
          <div class="product-category">${esc(catName)}</div>
          ${intros}
          ${specs}
          ${usage}
          ${comparison}
          ${verdict}
          ${scenes}
          ${caution}
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
      const paras = section.paragraphs || [];
      const raw =
        typeof section.rawHtml === "string"
          ? section.rawHtml
          : typeof section.embedHtml === "string"
            ? section.embedHtml
            : "";
      const chunk = `<section class="article-section" id="section-${idx}">${section.heading ? `<h2>${esc(section.heading)}</h2>` : ""}${paras.map((p) => `<p>${esc(p)}</p>`).join("")}${section.bullets?.length ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}${raw ? `<div class="article-embed">${raw}</div>` : ""}</section>`;
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
  const canonical = `${CANONICAL_BASE_URL}/article/${article.id}/`;
  const metaDesc = article.metaDescription || article.summary;
  const bodySections = renderArticleBodySectionsWithMidAd(article);
  const picksSection = hasPicks ? renderPicksSectionWithMidAd(article) : "";
  const catalogSummary =
    hasPicks || article.hideProductCatalog
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
        ${renderRakutenPlacement(rakutenWidgetsConfig, "articleFoot")}
        ${footArticleSlot(article)}
        ${renderConclusionRelated(article)}
      </div>
    </article>
    <aside class="sidebar">
      ${renderStaticProfileBox()}
      ${renderRakutenPlacement(rakutenWidgetsConfig, "articleSidebar")}
      ${sidebarSlot(article)}
      <div class="profile-box">
        <h3>同じカテゴリの記事</h3>
        <p>${esc(catDesc)}</p>
        <div class="section-actions">
          <a class="button secondary button--inline-sm" href="../../category/${esc(article.category)}.html">${esc(catLabel)}を見る</a>
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
        author: { "@type": "Person", name: AUTHOR_PEN_NAME, url: `${CANONICAL_BASE_URL}/` },
        mainEntityOfPage: canonical
      }
    }),
    "utf8"
  );
}

articles.forEach((article) => {
  if (REDIRECT_ARTICLES[article.id]) return;
  renderArticle(article);
});

function writeArticleRedirects() {
  for (const [fromId, toId] of Object.entries(REDIRECT_ARTICLES)) {
    const dir = path.join(root, "article", fromId);
    fs.mkdirSync(dir, { recursive: true });
    const canonical = `${CANONICAL_BASE_URL}/article/${toId}/`;
    const target = `../${toId}/`;
    fs.writeFileSync(
      path.join(dir, "index.html"),
      `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <link rel="canonical" href="${canonical}" />
    <title>リダイレクト中…</title>
    <script>location.replace("${target}");</script>
  </head>
  <body><p><a href="${target}">記事へ移動</a></p></body>
</html>`,
      "utf8"
    );
  }
}

writeArticleRedirects();

function writeCategoryPages() {
  const catDir = path.join(root, "category");
  fs.mkdirSync(catDir, { recursive: true });
  for (const cat of categories) {
    const catArticles = [...articles]
      .filter((a) => a.category === cat.id && !REDIRECT_ARTICLES[a.id])
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    const cards = catArticles.map((a) => renderArticleCardHtml(a, `../article/${a.id}/`)).join("");
    const canonical = `${CANONICAL_BASE_URL}/category/${cat.id}.html`;
    const body = `
      <section class="page-hero">
        <p class="eyebrow">${esc(cat.name)}</p>
        <h1>${esc(cat.name)}の記事一覧</h1>
        <p class="lead">${esc(cat.description || "")}</p>
        <p class="article-meta">${catArticles.length}記事</p>
      </section>
      <section class="section">
        <div class="article-grid">${cards || "<p>記事を準備中です。</p>"}</div>
      </section>`;
    fs.writeFileSync(
      path.join(catDir, `${cat.id}.html`),
      layoutCategory({
        title: `${cat.name} | 元自衛官の楽天装備レビュー`,
        description: cat.description || `${cat.name}カテゴリの装備レビュー記事一覧`,
        canonical,
        body,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${cat.name}の記事一覧`,
          description: cat.description,
          url: canonical
        }
      }),
      "utf8"
    );
  }
}

writeCategoryPages();

function writeHomeIndex() {
  const canonical = `${CANONICAL_BASE_URL}/`;
  const title = "元自衛官の楽天装備レビュー";
  const description =
    "元自衛官の視点で、寮生活・一人暮らし・車・バイク・デスク周り・防災・日用品に役立つ楽天商品を紹介する装備レビューブログです。";

  const sorted = dedupeArticlesByTopic(
    [...articles]
      .filter((a) => !REDIRECT_ARTICLES[a.id])
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
  );
  const featured = sorted.slice(0, 12);
  const articleCards = featured
    .map((a) => renderArticleCardHtml(a, `./article/${a.id}/`))
    .join("");

  const categoryCards = categories
    .map((cat) => {
      const count = articles.filter((a) => a.category === cat.id && !REDIRECT_ARTICLES[a.id]).length;
      return `<a class="category-card category-button" href="./category/${esc(cat.id)}.html">
        <span>${esc(cat.name)}</span>
        <small>${esc(cat.description || "")}</small>
        <div class="article-meta">${esc(count)}記事</div>
      </a>`;
    })
    .join("");

  const allArticleLinks = sorted
    .map((a) => `<li><a href="./article/${esc(a.id)}/">${esc(a.title)}</a> <span class="article-meta">${esc(a.date || "")}</span></li>`)
    .join("");

  const body = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">元自衛官目線の装備レビュー</p>
        <h1>暮らしをラクにする装備レビュー</h1>
        <p class="lead">元自衛官の目線で、楽天市場で探しやすい生活用品・防災グッズ・車載アイテム・デスク周り用品を整理して紹介します。</p>
        <div class="hero-site-summary" aria-label="このサイトの案内">
          <p><strong>テーマ</strong>　日用品・防災・車内・デスク周りなど、生活導線に効く装備の整理とレビューです。</p>
          <p><strong>向いている人</strong>　一人暮らし・寮生活、防災の備え、車・バイク利用、在宅で作業環境を整えたい人。</p>
        </div>
        <ul class="trust-badges" aria-label="主なテーマ">
          <li>防災</li><li>整頓</li><li>車内</li><li>一人暮らし</li><li>生活改善</li>
        </ul>
        <p class="ad-notice">当サイトはアフィリエイト広告を利用しています。</p>
        <div class="hero-actions">
          <a class="button" href="#articles">記事を読む</a>
          <a class="button secondary" href="./category/disaster.html">防災装備を見る</a>
        </div>
      </div>
      <div class="hero-panel" aria-label="装備レビューの概要">
        <div class="hero-panel-inner">
          <span class="panel-label">FIELD NOTES</span>
          <strong>買う前に、用途・置き場所・使う頻度を見る。</strong>
          <p>生活導線に入るものだけが、本当に使える装備になります。</p>
          <div class="stats">
            <div class="stat"><b>${sorted.length}</b><small>レビュー記事</small></div>
            <div class="stat"><b>${products.length}</b><small>商品カード</small></div>
            <div class="stat"><b>${categories.length}</b><small>カテゴリ</small></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="categories">
      <div class="section-head">
        <h2>カテゴリから探す</h2>
        <p>生活、PC作業、筋トレ、旅、防災。一人暮らしの装備選びを迷いにくくします。</p>
      </div>
      <div class="category-grid">${categoryCards}</div>
    </section>

    ${renderHomeCampaignSection(rakutenWidgetsConfig)}
    ${renderHomeMotionSection(rakutenWidgetsConfig)}

    <section class="section" id="articles">
      <div class="section-head">
        <h2>新着記事</h2>
        <p>装備選びの考え方と、記事内で紹介している商品をまとめています。</p>
      </div>
      <div class="article-grid">${articleCards}</div>
    </section>

    <section class="section" aria-label="記事一覧（HTML）">
      <div class="section-head">
        <h2>記事一覧</h2>
        <p>GoogleがJavaScriptを実行できない場合でもクロールできるよう、HTMLのリンク一覧を併設しています。</p>
      </div>
      <ul class="plain-link-list">${allArticleLinks}</ul>
    </section>

    <section class="section" id="profile">
      <div class="section-head">
        <h2>運営者</h2>
      </div>
      ${renderStaticProfileBox()}
    </section>
  `;

  fs.writeFileSync(
    path.join(root, "index.html"),
    layoutHome({
      title,
      description,
      canonical,
      body,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: title,
        description,
        url: canonical
      }
    }),
    "utf8"
  );
}

writeHomeIndex();

const sitemapArticles = articles.filter((a) => !REDIRECT_ARTICLES[a.id]);
const categoryUrls = categories.map((cat) => `${SITEMAP_BASE_URL}/category/${cat.id}.html`);
const urls = [
  `${SITEMAP_BASE_URL}/`,
  ...categoryUrls,
  ...sitemapArticles.map((article) => `${SITEMAP_BASE_URL}/article/${article.id}/`)
];
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${url.endsWith("/rakuten-gear-review/") ? "1.0" : "0.8"}</priority>\n  </url>`)
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap, "utf8");

function cdataFeedText(value) {
  return `<![CDATA[${String(value || "").replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

const feedItems = [...sitemapArticles]
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
  .slice(0, 30)
  .map((article) => {
    const link = `${CANONICAL_BASE_URL}/article/${article.id}/`;
    const pubDate = article.date ? new Date(`${article.date}T09:00:00+09:00`).toUTCString() : new Date().toUTCString();
    return `    <item>
      <title>${cdataFeedText(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${cdataFeedText(article.summary || article.title)}</description>
    </item>`;
  })
  .join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>元自衛官の楽天装備レビュー</title>
    <link>${CANONICAL_BASE_URL}/</link>
    <description>元自衛官の視点で、寮生活・一人暮らし・車・バイク・デスク周り・防災・日用品に役立つ楽天商品を紹介する装備レビューブログです。</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(root, "feed.xml"), feed, "utf8");

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITEMAP_BASE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(root, "robots.txt"), robots, "utf8");

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
console.log(`Generated ${sitemapArticles.length} article pages, ${categories.length} category pages, and sitemap.xml`);

