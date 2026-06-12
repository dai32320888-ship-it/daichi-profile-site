/**
 * A8.net 用の共通広告枠（静的ビルド用）。
 * クリエイティブ本文は scripts/a8-creatives.js 。
 */
const a8 = require("./a8-creatives");

const TAG_PLACEHOLDER = "<!-- A8広告タグここに貼る -->";

function embedCell() {
  return `<div class="a8-ad-slot__embed-inner">
        ${TAG_PLACEHOLDER}
        <p class="a8-ad-placeholder">A8の管理画面からコピーした<strong>広告タグ一式</strong>を貼ってください。</p>
      </div>`;
}

function clampFragmentIndex(i) {
  const mod = Math.max(1, a8.RAW_COUNT);
  let v = Math.floor(Number(i));
  while (v < 0) v += mod;
  return v % mod;
}

function fragmentHtml(index) {
  const idx = clampFragmentIndex(index);
  return String(a8.RAW_FRAGMENTS[idx] || "").trim();
}

function embedLive(fragmentIndex) {
  const html = fragmentHtml(fragmentIndex);
  return `<div class="a8-ad-slot__embed-inner a8-ad-slot__embed-inner--live">${html}</div>`;
}

function midLeadText(articleId) {
  const base =
    "この記事の商品と相性がよさそうなものを、あとで見返せるようにまとめています。";
  return a8.midUsesMatsukiyo(articleId)
    ? `${base}かさばる日用品は、オンライン条件も一度見ておくと手間が分散しやすいです。`
    : base;
}

function midArticleSlot(article) {
  const fragmentIndex = a8.midCreativeIndex(article.id);
  return `
    <aside class="a8-ad-slot a8-ad-slot--inline" aria-label="関連する広告リンク">
      <div class="a8-ad-slot__head">
        <span class="a8-ad-slot__badge" aria-hidden="true">PR</span>
        <h2 class="a8-ad-slot__title">ついでにチェックしたい便利アイテム</h2>
      </div>
      <p class="a8-ad-slot__lead">${midLeadText(article.id)}</p>
      <div class="a8-ad-slot__embed">
        ${embedLive(fragmentIndex)}
      </div>
    </aside>
  `.trim();
}

function footArticleSlot(article) {
  const fragmentIndex = a8.footCreativeIndex(article.id);
  return `
    <aside class="a8-ad-slot a8-ad-slot--inline" aria-label="比較用の広告リンク">
      <div class="a8-ad-slot__head">
        <span class="a8-ad-slot__badge" aria-hidden="true">PR</span>
        <h2 class="a8-ad-slot__title">買う前に比較しておきたいもの</h2>
      </div>
      <p class="a8-ad-slot__lead">同じジャンルの商品でも、価格・送料・レビューでかなり差が出ます。買う前に一度チェックしておくと失敗しにくいです。</p>
      <div class="a8-ad-slot__embed">
        ${embedLive(fragmentIndex)}
      </div>
    </aside>
  `.trim();
}

function topRecommendSlot() {
  const ix = a8.pickCreativeIndexFromPool(a8.homeTopCreativeIndexes, "home:A8:billboard");
  const leaderClass = ix === 15 ? " a8-ad-slot--leader" : "";
  return `
    <section class="section a8-ad-section">
      <div class="section-head">
        <div>
          <h2>だるい生活を少しラクにするおすすめ</h2>
          <p>元自衛官目線で、日常・寮生活・デスク周り・車内で使いやすそうなものを中心に紹介します。</p>
        </div>
        <span class="a8-ad-slot__badge a8-ad-slot__badge--section" aria-hidden="true">PR</span>
      </div>
      <aside class="a8-ad-slot a8-ad-slot--wide${leaderClass}" aria-label="トップのおすすめ広告">
        <div class="a8-ad-slot__embed a8-ad-slot__embed--top">
          ${embedLive(ix)}
        </div>
      </aside>
    </section>
  `.trim();
}

function sidebarSlot(article) {
  const fragmentIndex = a8.sidebarCreativeIndex(article.id);
  return `
    <div class="a8-ad-slot a8-ad-slot--sidebar" role="region" aria-label="関連広告">
      <div class="a8-ad-slot__head">
        <span class="a8-ad-slot__badge" aria-hidden="true">広告</span>
        <h3 class="a8-ad-slot__title a8-ad-slot__title--sm">チェックリスト用のリンク置き場</h3>
      </div>
      <p class="a8-ad-slot__lead a8-ad-slot__lead--sm">読み終えたあとで、価格や条件だけまとめて見たいとき向けです。</p>
      <div class="a8-ad-slot__embed">
        ${embedLive(fragmentIndex)}
      </div>
    </div>
  `.trim();
}

function sidebarListSlot(seed) {
  const fragmentIndex = a8.sidebarCreativeIndexForList(seed);
  return `
    <div class="a8-ad-slot a8-ad-slot--sidebar" role="region" aria-label="関連広告">
      <div class="a8-ad-slot__head">
        <span class="a8-ad-slot__badge" aria-hidden="true">広告</span>
        <h3 class="a8-ad-slot__title a8-ad-slot__title--sm">記事を見終えたあとの参考枠</h3>
      </div>
      <p class="a8-ad-slot__lead a8-ad-slot__lead--sm">同じ一覧から探している人が、あと一息でチェックすることがある程度の広告リンクです。</p>
      <div class="a8-ad-slot__embed">
        ${embedLive(fragmentIndex)}
      </div>
    </div>
  `.trim();
}

module.exports = {
  TAG_PLACEHOLDER,
  midArticleSlot,
  footArticleSlot,
  topRecommendSlot,
  sidebarSlot,
  sidebarListSlot,
  embedCell
};
