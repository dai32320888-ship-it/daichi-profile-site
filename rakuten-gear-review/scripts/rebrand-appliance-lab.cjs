const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..");
const articleRoot = path.join(root, "article");
const SITE_BASE = "https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review";

const SITE_NAME = "置くだけ家電ラボ";
const SITE_TAGLINE = "工事不要・省スペース家電の比較";
const SITE_DESCRIPTION =
  "賃貸やワンルームでも導入しやすい家電を、サイズ・騒音・消費電力・手入れのしやすさで比較。ロボット掃除機・空気清浄機・加湿器・衣類スチーマー・足元ヒーター・車載家電など。";
const OPERATOR = "置くだけ家電ラボ編集部";
const SOURCE_NOTICE =
  "公式情報・販売ページ・提供画像をもとに、仕様と購入前の確認点を整理しています。実際に購入・使用したレビューではありません。";
const DISCLOSURE =
  "本ページには広告・アフィリエイトリンクが含まれます。紹介内容は、読者が比較しやすいように整理しています。";

const APPLIANCE_SLUG_RE =
  /掃除機|ロボット掃除|ハンディクリーナー|空気清浄|加湿器|スチーマー|ヒーター|電気毛布|毛布|電子レンジ|炊飯器|冷却|ハンディファン|扇風機|車載|インバーター|クーラーボックス|冷風機|暖房機|保冷剤|冷感タオル|cooling-plate|summer-heat-ranking/;
const APPLIANCE_SLUG_ALLOW_RE =
  /^(?:car-seat-cooler|car-bike-electric-air-pump|peltier-cooling-fan-vest)$/;
const OFF_THEME_SLUG_RE = /^gap-(?:game|pc-ai)-/;

const FEATURED_SLUGS = [
  "auto-p018-ロボット掃除機-一人暮らし",
  "auto-p008-ロボット掃除機-一人暮らし",
  "gap-solo-一人暮らし-空気清浄機-小型",
  "auto-p088-加湿器-小型-卓上",
  "auto-p048-衣類スチーマー",
  "auto-p024-足元ヒーター-デスク",
  "auto-p023-電気毛布",
  "gap-car-車載-インバーター-100V",
  "gap-car-車載-クーラーボックス-12V",
  "gap-car-車-寒さ対策-ヒーター",
  "cooling-plate-handheld-fan",
  "gap-solo-一人暮らし-電子レンジ-小型",
  "gap-solo-一人暮らし-炊飯器-1合",
  "auto-p017-ハンディクリーナー-小型",
];

const NOINDEX_STATIC = new Set([
  "hub/disaster.html",
  "hub/pc-ai.html",
  "category/disaster.html",
  "category/training.html",
  "category/game.html",
  "category/bike.html",
  "category/pc-ai.html",
]);

const textExtensions = new Set([
  ".html",
  ".js",
  ".json",
  ".xml",
  ".md",
  ".css",
  ".txt",
  ".tsv",
  ".svg",
]);

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

function writeIfChanged(file, content) {
  const current = read(file);
  if (current === content) return false;
  fs.writeFileSync(file, content, "utf8");
  return true;
}

function listArticleIds() {
  return fs
    .readdirSync(articleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(articleRoot, id, "index.html")));
}

function isIndexableArticle(id) {
  if (OFF_THEME_SLUG_RE.test(id)) return false;
  return APPLIANCE_SLUG_RE.test(id) || APPLIANCE_SLUG_ALLOW_RE.test(id);
}

function applyBrandingText(text) {
  let next = text;
  const pairs = [
    ["元自衛官の楽天装備レビュー", SITE_NAME],
    ["｜元自衛官の確認メモ", "｜購入前チェック"],
    ["元自衛官の確認メモ", "購入前チェック"],
    ["元自衛官目線で選ぶ、疲れを残さないリカバリーグッズ", "疲れを残さないリカバリーグッズの選び方"],
    ["元自衛官目線のローリングストック食品", "ローリングストック食品の選び方"],
    ["元自衛官の寝袋論", "来客・防災向け寝袋の選び方"],
    ["元自衛官目線で選ぶ「", "「"],
    ["元自衛官目線では", "購入前の確認では"],
    ["元自衛官目線で", "購入前の観点で"],
    ["元自衛官が選ぶ、", "編集部おすすめの"],
    ["元自衛官が選ぶ", "編集部おすすめ"],
    ["元自衛官・だいちが、", `${OPERATOR}が、`],
    ["元自衛官・だいち", OPERATOR],
    ["運営者・だいち（元自衛官）", OPERATOR],
    ["だいち（元自衛官）", OPERATOR],
    ["（元自衛官）", ""],
    ["自衛官時代に学んだのは、大きな装備より「毎日触る小さな道具」が生活の安定度を決める、という感覚です。", ""],
    ["自衛官時代", ""],
    ["自衛官経験", ""],
    ["軍装備", "防災用品"],
    ["実体験ベース", "公式情報ベース"],
    ["実使用ベース", "公式情報ベース"],
    ["実体験", "公式情報"],
    ["実使用レビュー", "購入前比較"],
    ["実使用", "公式情報"],
    ["実際の使用イメージ", "想定される使用イメージ"],
    ["実際に使った", "公式情報をもとに整理した"],
    ["実際に探し、", "公式情報をもとに"],
    ["体験談", "比較表"],
    ["暮らしをラクにする装備品レビュー", SITE_TAGLINE],
    ["暮らしをラクにする装備レビュー", "置くだけで暮らしをラクにする家電比較"],
    ["装備レビューの概要", "家電比較の概要"],
    ["レビュー記事", "比較記事"],
    ["FIELD NOTES", "SIZE CHECK"],
    ['"name":"だいち（元自衛官）"', `"name":"${OPERATOR}"`],
    ['"name":"だいち"', `"name":"${OPERATOR}"`],
    ["だいちが、", `${OPERATOR}が、`],
    [">装</span>", ">家</span>"],
    [
      "元自衛官の視点で、寮生活・一人暮らし・車・バイク・デスク周り・防災・日用品に役立つ楽天商品を紹介する装備レビューブログです。",
      SITE_DESCRIPTION,
    ],
    [
      "元自衛官・だいちが、一人暮らし・防災・デスク周りの装備を実体験ベースで整理。楽天市場で失敗しにくい選び方と柱記事10本。",
      SITE_DESCRIPTION,
    ],
    [
      "元自衛官・だいちが、一人暮らし・防災・デスク周りの装備を公式情報ベースで整理。楽天市場で失敗しにくい選び方と柱記事10本。",
      SITE_DESCRIPTION,
    ],
    [
      "商品はすべて楽天市場で実際に探し、比較しやすい形に整理しています。",
      "商品は楽天市場の公式情報・販売ページをもとに、比較しやすい形に整理しています。",
    ],
    [
      "一人暮らし・防災・デスク周りの装備を公式情報ベースで整理しています。",
      "工事不要・省スペースで使える家電の比較情報を整理しています。",
    ],
    [
      'class="avatar">だ</div>',
      'class="avatar">家</div>',
    ],
  ];
  for (const [from, to] of pairs) {
    next = next.split(from).join(to);
  }
  next = next.replace(/元自衛官/g, "");
  next = next.replace(/装備レビュー/g, "家電比較");
  return next;
}

function upsertRobotsMeta(html, noindex) {
  const robotsRe = /<meta\s+name=["']robots["'][^>]*>/i;
  if (noindex) {
    const tag = '<meta name="robots" content="noindex, follow" />';
    if (robotsRe.test(html)) {
      return html.replace(robotsRe, tag);
    }
    const withViewport = html.replace(
      /<meta\s+name=["']viewport["'][^>]*>/i,
      (m) => `${m}\n    ${tag}`,
    );
    if (withViewport !== html) return withViewport;
    return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
  }
  if (robotsRe.test(html)) {
    return html.replace(robotsRe, "");
  }
  return html;
}

function upsertArticleDisclosure(html) {
  const notice = `<p class="article-source-notice">${SOURCE_NOTICE}</p>`;
  if (html.includes("article-source-notice")) return html;
  if (html.includes('class="article-disclosure"')) {
    return html.replace(
      /<p class="article-disclosure">[\s\S]*?<\/p>/,
      `<p class="article-disclosure">${DISCLOSURE}</p>\n        ${notice}`,
    );
  }
  return html;
}

function fixJsonLdAuthor(html) {
  return html.replace(
    /"author":\s*\{\s*"@type":\s*"Person"[^}]*\}/g,
    `"author":{"@type":"Organization","name":"${OPERATOR}","url":"${SITE_BASE}/"}`,
  );
}

function extractArticleMeta(id) {
  const html = read(path.join(articleRoot, id, "index.html"));
  const title =
    html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "").trim() || id;
  const description = html.match(/name="description" content="([^"]*)"/)?.[1] || "";
  const date =
    html.match(/<p class="article-meta">(\d{4}-\d{2}-\d{2})/)?.[1] || "2026-07-01";
  const image =
    html.match(/property="og:image" content="([^"]+)"/)?.[1] ||
    `${SITE_BASE}/images/og-default.png`;
  const lead = html.match(/<p class="lead">([\s\S]*?)<\/p>/)?.[1]?.replace(/<[^>]+>/g, "").trim() || description;
  return { id, title, description, date, image, lead };
}

function formatRssDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toUTCString().replace("GMT", "GMT");
}

function buildFeed(indexableIds, articleMeta) {
  const sorted = [...indexableIds]
    .map((id) => articleMeta[id])
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 30);

  const items = sorted
    .map(
      (m) => `    <item>
      <title><![CDATA[${m.title.replace(/\|.*$/, "").trim()}]]></title>
      <link>${SITE_BASE}/article/${m.id}/</link>
      <guid isPermaLink="true">${SITE_BASE}/article/${m.id}/</guid>
      <pubDate>${formatRssDate(m.date)}</pubDate>
      <description><![CDATA[<img src="${m.image}" alt="" />
${m.lead}]]></description>
      <media:thumbnail url="${m.image}" />
      <enclosure url="${m.image}" type="image/jpeg" length="0" />
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_BASE}/</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>ja</language>
    <lastBuildDate>${formatRssDate("2026-08-30")}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

function buildSitemap(indexableIds, articleMeta) {
  const staticUrls = [
    { loc: `${SITE_BASE}/`, priority: "1.0", lastmod: "2026-08-30" },
    { loc: `${SITE_BASE}/category/life.html`, priority: "0.7", lastmod: "2026-08-30" },
    { loc: `${SITE_BASE}/category/car.html`, priority: "0.7", lastmod: "2026-08-30" },
    { loc: `${SITE_BASE}/category/solo.html`, priority: "0.7", lastmod: "2026-08-30" },
    { loc: `${SITE_BASE}/hub/solo.html`, priority: "0.6", lastmod: "2026-08-30" },
  ];

  const articleUrls = [...indexableIds]
    .map((id) => articleMeta[id])
    .filter(Boolean)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((m) => ({
      loc: `${SITE_BASE}/article/${m.id}/`,
      priority: "0.8",
      lastmod: m.date,
    }));

  const all = [...staticUrls, ...articleUrls];
  const body = all
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function updateRootSitemap(siteSitemapXml) {
  const rootSitemapPath = path.join(repoRoot, "sitemap.xml");
  if (!fs.existsSync(rootSitemapPath)) return false;
  const rootXml = read(rootSitemapPath);
  const rakutenUrls = [...siteSitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const nonRakuten = [...rootXml.matchAll(/<url>[\s\S]*?<\/url>/g)]
    .map((match) => {
      const block = match[0];
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1] || "";
      return loc.includes("/rakuten-gear-review/") ? null : block;
    })
    .filter(Boolean);

  const rakutenBlocks = rakutenUrls.map((loc) => {
    const lastmod = loc.endsWith("/rakuten-gear-review/")
      ? "2026-08-30"
      : siteSitemapXml.match(new RegExp(`<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>[\\s\\S]*?<lastmod>([^<]+)</lastmod>`))?.[1] || "2026-08-30";
    const priority = loc.endsWith("/rakuten-gear-review/") ? "1.0" : "0.8";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const next = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${nonRakuten.join("\n")}
${rakutenBlocks.join("\n")}
</urlset>
`;
  return writeIfChanged(rootSitemapPath, next);
}

function buildFeaturedSection(articleMeta) {
  const cards = FEATURED_SLUGS.filter((id) => articleMeta[id])
    .slice(0, 8)
    .map((id) => {
      const m = articleMeta[id];
      return `<article class="article-card">
      <a class="article-thumb article-thumb--photo" href="./article/${id}/">
        <img src="${m.image}" alt="${m.title.replace(/"/g, "&quot;")}" width="640" height="360" loading="lazy" decoding="async" data-fallback="./images/og-default.png" onerror="this.onerror=null;this.src=this.dataset.fallback||'./images/og-default.png';this.classList.add('image-fallback');" />
        <span class="article-thumb__meta">
          <span>厳選</span>
          <strong>比較</strong>
        </span>
      </a>
      <div class="article-body">
        <div class="article-meta">${m.date} ・ 読了目安 8分</div>
        <h3><a class="article-title-link" href="./article/${id}/">${m.title.replace(/\|.*$/, "").trim()}</a></h3>
        <p>${m.lead}</p>
        <a class="button secondary button--inline-sm" href="./article/${id}/">記事を読む</a>
      </div>
    </article>`;
    })
    .join("");

  return `<section class="section" id="featured">
      <div class="section-head">
        <h2>厳選記事</h2>
        <p>ロボット掃除機・空気清浄機・加湿器・衣類スチーマー・足元ヒーター・車載家電など、テーマに沿った比較記事です。</p>
      </div>
      <div class="article-grid">${cards}</div>
    </section>`;
}

function buildThemeSection() {
  return `<section class="section pillar-section" id="themes">
      <div class="section-head">
        <h2>主なテーマ</h2>
        <p>工事不要・省スペースで導入しやすい家電を、用途別に比較しています。</p>
      </div>
      <div class="pillar-grid"><article class="pillar-card">
      <p class="eyebrow">掃除</p>
      <h3><a href="./article/auto-p018-ロボット掃除機-一人暮らし/">ロボット掃除機・ハンディクリーナー</a></h3>
      <p>床面のサイズ・騒音・ゴミ捨ての手間を、賃貸ワンルーム向けに整理。</p>
      <ul class="pillar-card-links"><li><a href="./article/auto-p018-ロボット掃除機-一人暮らし/">ロボット掃除機の選び方</a></li><li><a href="./article/auto-p017-ハンディクリーナー-小型/">ハンディクリーナー小型</a></li></ul>
    </article><article class="pillar-card">
      <p class="eyebrow">空調・季節家電</p>
      <h3><a href="./article/gap-solo-一人暮らし-空気清浄機-小型/">空気清浄機・加湿器・冷却グッズ</a></h3>
      <p>置き場所・消費電力・フィルター手入れを購入前に確認。</p>
      <ul class="pillar-card-links"><li><a href="./article/gap-solo-一人暮らし-空気清浄機-小型/">小型空気清浄機</a></li><li><a href="./article/auto-p088-加湿器-小型-卓上/">卓上加湿器</a></li><li><a href="./article/cooling-plate-handheld-fan/">冷却プレート付きファン</a></li></ul>
    </article><article class="pillar-card">
      <p class="eyebrow">衣類ケア</p>
      <h3><a href="./article/auto-p048-衣類スチーマー/">衣類スチーマー・保温家電</a></h3>
      <p>アイロン代わりの手入れと、冬の足元・就寝時の暖房家電。</p>
      <ul class="pillar-card-links"><li><a href="./article/auto-p048-衣類スチーマー/">衣類スチーマー</a></li><li><a href="./article/auto-p024-足元ヒーター-デスク/">足元ヒーター</a></li><li><a href="./article/auto-p023-電気毛布/">電気毛布</a></li></ul>
    </article><article class="pillar-card">
      <p class="eyebrow">車載・持ち運び</p>
      <h3><a href="./article/gap-car-車載-インバーター-100V/">車載家電・調理家電</a></h3>
      <p>車内電源・保冷と、一人暮らし向けの小型調理家電。</p>
      <ul class="pillar-card-links"><li><a href="./article/gap-car-車載-インバーター-100V/">車載インバーター</a></li><li><a href="./article/gap-car-車載-クーラーボックス-12V/">車載クーラーボックス</a></li><li><a href="./article/gap-solo-一人暮らし-電子レンジ-小型/">小型電子レンジ</a></li></ul>
    </article></div>
    </section>`;
}

function updateIndexHtml(articleIds, indexableCount) {
  const indexPath = path.join(root, "index.html");
  let html = applyBrandingText(read(indexPath));
  const articleMeta = {};
  for (const id of articleIds) articleMeta[id] = extractArticleMeta(id);

  const heroBlock = `<section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">${SITE_NAME}</p>
        <h1>置くだけで暮らしをラクにする家電比較</h1>
        <p class="lead">${SITE_DESCRIPTION}</p>
        <div class="hero-site-summary" aria-label="このサイトの案内">
          <p><strong>向いている人</strong>　賃貸・ワンルームで工事不要の家電を探している人、サイズと手入れを重視する人。</p>
          <p><strong>読み方</strong>　「厳選記事」→ 主なテーマ → カテゴリ一覧の順がおすすめです。</p>
          <p><strong>過去記事について</strong>　防災・筋トレ・ゲームなど旧テーマの記事はURLを残したまま順次見直し中です。家電テーマに合う記事を優先して更新していきます。</p>
        </div>
        <ul class="trust-badges" aria-label="主なテーマ">
          <li>掃除</li><li>空調・季節家電</li><li>衣類ケア</li><li>車載・持ち運び</li><li>比較表</li>
        </ul>
        <p class="ad-notice">当サイトはアフィリエイト広告（楽天アフィリエイト等）を利用しています。</p>
        <div class="hero-actions">
          <a class="button" href="#featured">厳選記事を見る</a>
          <a class="button secondary" href="#themes">テーマから読む</a>
          <a class="button secondary" href="#latest">新着記事</a>
        </div>
      </div>
      <div class="hero-panel" aria-label="家電比較の概要">
        <div class="hero-panel-inner">
          <span class="panel-label">SIZE CHECK</span>
          <strong>買う前に、サイズ・騒音・消費電力・手入れを見る。</strong>
          <p>置き場所に収まるものだけが、本当に使える家電になります。</p>
          <div class="stats">
            <div class="stat"><b>${articleIds.length}</b><small>掲載記事（全件保持）</small></div>
            <div class="stat"><b>${indexableCount}</b><small>検索対象記事</small></div>
            <div class="stat"><b>4</b><small>主なテーマ</small></div>
          </div>
        </div>
      </div>
    </section>`;

  html = html.replace(/<section class="hero">[\s\S]*?<\/section>/, heroBlock);

  const navBlock = `<nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        <a href="./">トップ</a>
        <a href="#featured">厳選記事</a>
        <a href="#themes">テーマ</a>
        <a href="./category/life.html">生活家電</a>
        <a href="./category/car.html">車載家電</a>
        <a href="#latest">新着</a>
        <a href="#articles">記事一覧</a>
        <a href="#profile">運営者</a>
      </nav>`;
  html = html.replace(/<nav class="site-nav" id="siteNav"[\s\S]*?<\/nav>/, navBlock);

  html = html.replace(
    /<section class="section pillar-section" id="pillars">[\s\S]*?<\/section>/,
    buildThemeSection(),
  );

  if (!html.includes('id="featured"')) {
    html = html.replace(
      /<section class="section" id="latest">/,
      `${buildFeaturedSection(articleMeta)}\n\n        <section class="section" id="latest">`,
    );
  }

  html = html.replace(
    /<p>全\d+記事から最新[^<]*<\/p>/,
    `<p>全${articleIds.length}記事から最新（家電テーマの記事を優先掲載）。カテゴリ一覧にもすべて掲載しています。</p>`,
  );

  const profileBlock = `<section class="profile-box">
      <div class="profile-head">
        <div class="avatar">家</div>
        <div>
          <h3>${OPERATOR}</h3>
          <div class="article-meta">工事不要・省スペースで使える家電の比較サイト。${SOURCE_NOTICE}</div>
        </div>
      </div>
      <p>賃貸やワンルームでも導入しやすい家電を、サイズ・騒音・消費電力・手入れのしやすさで比較しています。商品は楽天市場の公式情報・販売ページをもとに整理し、価格・在庫・口コミは必ずリンク先で最新を確認してください。</p>
      <p class="profile-contact">更新情報・誤記のご指摘：<a href="https://x.com/darui_tsubushi" target="_blank" rel="me noopener noreferrer">@darui_tsubushi</a>（X）</p>
      <p class="profile-contact">関連：<a href="https://dai32320888-ship-it.github.io/daichi-profile-site/gift-for-you/">プレゼントふぉーゆー</a></p>
    </section>`;
  html = html.replace(/<section class="profile-box">[\s\S]*?<\/section>/, profileBlock);

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${SITE_NAME}</title>`,
  );
  html = html.replace(
    /name="description" content="[^"]*"/,
    `name="description" content="${SITE_DESCRIPTION}"`,
  );
  html = html.replace(
    /<script type="application\/ld\+json">\{[\s\S]*?\}<\/script>/,
    `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Blog","name":"${SITE_NAME}","description":"${SITE_DESCRIPTION}","url":"${SITE_BASE}/","publisher":{"@type":"Organization","name":"${OPERATOR}"}}</script>`,
  );

  return writeIfChanged(indexPath, html);
}

function updateSharedNav(html) {
  const navBlock = `<nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        <a href="../../">トップ</a>
        <a href="../../#featured">厳選記事</a>
        <a href="../../#themes">テーマ</a>
        <a href="../../category/life.html">生活家電</a>
        <a href="../../category/car.html">車載家電</a>
        <a href="../../#latest">新着</a>
        <a href="../../#articles">記事一覧</a>
        <a href="../../#profile">運営者</a>
      </nav>`;
  if (html.includes("../../index.html")) {
    return html.replace(/<nav class="site-nav" id="siteNav"[\s\S]*?<\/nav>/, navBlock);
  }
  const navBlockCat = `<nav class="site-nav" id="siteNav" aria-label="メインナビゲーション">
        <a href="../">トップ</a>
        <a href="../#featured">厳選記事</a>
        <a href="../#themes">テーマ</a>
        <a href="../category/life.html">生活家電</a>
        <a href="../category/car.html">車載家電</a>
        <a href="../#latest">新着</a>
        <a href="../#articles">記事一覧</a>
        <a href="../#profile">運営者</a>
      </nav>`;
  if (html.includes("../index.html") || html.includes('href="../"')) {
    return html.replace(/<nav class="site-nav" id="siteNav"[\s\S]*?<\/nav>/, navBlockCat);
  }
  return html;
}

const articleIds = listArticleIds();
const indexableIds = articleIds.filter(isIndexableArticle);
const noindexIds = articleIds.filter((id) => !isIndexableArticle(id));
const articleMeta = {};
for (const id of articleIds) articleMeta[id] = extractArticleMeta(id);

let brandingFiles = 0;
for (const file of walk(root, (f) => textExtensions.has(path.extname(f)))) {
  let content = applyBrandingText(read(file));
  if (file.endsWith(".html")) {
    content = fixJsonLdAuthor(content);
    content = updateSharedNav(content);
    const rel = path.relative(root, file).replace(/\\/g, "/");
    if (rel.startsWith("article/") && rel.endsWith("/index.html")) {
      const id = rel.split("/")[1];
      content = upsertRobotsMeta(content, !isIndexableArticle(id));
      content = upsertArticleDisclosure(content);
    } else if (NOINDEX_STATIC.has(rel)) {
      content = upsertRobotsMeta(content, true);
    }
  }
  if (writeIfChanged(file, content)) brandingFiles += 1;
}

const feedXml = buildFeed(indexableIds, articleMeta);
const sitemapXml = buildSitemap(indexableIds, articleMeta);
writeIfChanged(path.join(root, "feed.xml"), feedXml);
writeIfChanged(path.join(root, "sitemap.xml"), sitemapXml);
const rootSitemapUpdated = updateRootSitemap(sitemapXml);
updateIndexHtml(articleIds, indexableIds.length);

console.log(
  JSON.stringify(
    {
      siteName: SITE_NAME,
      totalArticles: articleIds.length,
      indexableArticles: indexableIds.length,
      noindexArticles: noindexIds.length,
      brandingFilesChanged: brandingFiles,
      rootSitemapUpdated,
      indexableSlugs: indexableIds,
    },
    null,
    2,
  ),
);
