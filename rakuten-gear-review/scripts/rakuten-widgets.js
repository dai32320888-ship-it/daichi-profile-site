/**
 * 楽天モーションウィジェット・自動更新バナー（静的ビルド / SPA 共通）
 */
const fs = require("fs");
const path = require("path");
const { RAKUTEN } = require("../../affiliate/central-config");

const WIDGET_SCRIPT = "https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106";

const SLOT_META = {
  "banners.point": { title: "楽天ポイント企画", lead: "実施中のポイントキャンペーン（楽天側で自動更新）", variant: "banner" },
  "banners.season": { title: "楽天季節特集", lead: "旬の特集バナー（楽天側で自動更新）", variant: "banner" },
  "motion.homeWide": { title: "楽天の売れ筋", lead: "楽天市場ランキング（自動更新）", variant: "wide" },
  "motion.sidebar": { title: "あなたへのおすすめ", lead: "閲覧履歴に合わせた商品（自動更新）", variant: "sidebar" }
};

function defaultConfig() {
  return {
    enabled: true,
    affiliatePath: RAKUTEN.affiliatePath,
    banners: { point: { html: "" }, season: { html: "" } },
    motion: {},
    placements: {}
  };
}

function loadConfig(root) {
  const configPath = path.join(root, "data", "rakuten-widgets.json");
  if (!fs.existsSync(configPath)) return defaultConfig();
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return { ...defaultConfig(), ...raw };
  } catch {
    return defaultConfig();
  }
}

function affiliateId(config) {
  return String(config.affiliatePath || RAKUTEN.affiliatePath).trim();
}

function motionVars(opts) {
  const id = opts.affiliateId;
  const parts = [
    `rakuten_design="slide"`,
    `rakuten_affiliateId="${id}"`,
    `rakuten_items="${opts.items || "ctsmatch"}"`,
    `rakuten_genreId="0"`,
    `rakuten_size="${opts.size}"`,
    `rakuten_target="_blank"`,
    `rakuten_theme="gray"`,
    `rakuten_border="off"`,
    `rakuten_auto_mode="${opts.autoMode || "on"}"`,
    `rakuten_genre_title="off"`,
    `rakuten_recommend="${opts.recommend || "on"}"`,
    `rakuten_ts="${Date.now()}"`
  ];
  return parts.join(";");
}

function buildMotionWidget(opts) {
  const html = `<script type="text/javascript">${motionVars(opts)};</script><script type="text/javascript" src="${WIDGET_SCRIPT}"></script>`;
  return `<div class="rakuten-widget-embed">${html}</div>`;
}

function buildResponsiveMotionWidget(opts) {
  const id = opts.affiliateId;
  const desktop = motionVars({
    affiliateId: id,
    items: opts.items,
    size: opts.desktopSize,
    autoMode: opts.autoMode,
    recommend: opts.recommend
  });
  const mobile = motionVars({
    affiliateId: id,
    items: opts.items,
    size: opts.mobileSize,
    autoMode: opts.autoMode,
    recommend: opts.recommend
  });
  const script = `<script>(function(){var w=window.innerWidth||document.documentElement.clientWidth;var cfg=w>728?${JSON.stringify(desktop)}:${JSON.stringify(mobile)};document.write('<script type="text/javascript">'+cfg+';<\\/script>');document.write('<script type="text/javascript" src="${WIDGET_SCRIPT}"><\\/script>');})();</script>`;
  return `<div class="rakuten-widget-embed rakuten-widget-embed--responsive">${script}</div>`;
}

function resolveWidgetHtml(config, key) {
  const id = affiliateId(config);
  if (key === "banners.point") {
    const html = String(config.banners?.point?.html || "").trim();
    return html ? `<div class="rakuten-widget-embed">${html}</div>` : "";
  }
  if (key === "banners.season") {
    const html = String(config.banners?.season?.html || "").trim();
    return html ? `<div class="rakuten-widget-embed">${html}</div>` : "";
  }
  if (key === "motion.homeWide") {
    const m = config.motion?.homeWide || {};
    return buildResponsiveMotionWidget({
      affiliateId: id,
      items: m.items || "ranking",
      desktopSize: m.desktopSize || "728x200",
      mobileSize: m.mobileSize || "320x48",
      autoMode: m.autoMode || "on",
      recommend: m.recommend || "on"
    });
  }
  if (key === "motion.sidebar") {
    const m = config.motion?.sidebar || {};
    return buildMotionWidget({
      affiliateId: id,
      items: m.items || "ctsmatch",
      size: m.size || "300x160",
      autoMode: m.autoMode || "on",
      recommend: m.recommend || "on"
    });
  }
  return "";
}

function renderSlot(key, embedHtml) {
  if (!embedHtml) return "";
  const meta = SLOT_META[key] || { title: "楽天広告", lead: "", variant: "inline" };
  const isSidebar = meta.variant === "sidebar";
  const headTag = isSidebar ? "h3" : "h2";
  const titleClass = isSidebar ? "rakuten-widget-slot__title rakuten-widget-slot__title--sm" : "rakuten-widget-slot__title";
  return `
    <aside class="rakuten-widget-slot rakuten-widget-slot--${meta.variant}" aria-label="${meta.title}">
      <div class="rakuten-widget-slot__head">
        <span class="rakuten-widget-slot__badge" aria-hidden="true">PR</span>
        <${headTag} class="${titleClass}">${meta.title}</${headTag}>
      </div>
      ${meta.lead ? `<p class="rakuten-widget-slot__lead">${meta.lead}</p>` : ""}
      <div class="rakuten-widget-slot__embed">${embedHtml}</div>
    </aside>
  `.trim();
}

function renderPlacement(config, placementName) {
  if (!config.enabled) return "";
  const keys = config.placements?.[placementName] || [];
  const chunks = [];
  for (const key of keys) {
    const embed = resolveWidgetHtml(config, key);
    if (embed) chunks.push(renderSlot(key, embed));
  }
  return chunks.join("\n");
}

function renderHomeCampaignSection(config) {
  const inner = renderPlacement(config, "homeCampaignRow");
  if (!inner) return "";
  return `
    <section class="section rakuten-widget-section" aria-label="楽天キャンペーン">
      <div class="rakuten-widget-banner-row">${inner}</div>
    </section>
  `.trim();
}

function renderHomeMotionSection(config) {
  const inner = renderPlacement(config, "homeAfterCategories");
  if (!inner) return "";
  return `
    <section class="section rakuten-widget-section" aria-label="楽天おすすめ商品">
      ${inner}
    </section>
  `.trim();
}

function buildBrowserFragments(root) {
  const config = loadConfig(root);
  const placements = config.placements || {};
  const out = {};
  for (const name of Object.keys(placements)) {
    out[name] = renderPlacement(config, name);
  }
  out.homeCampaignSection = renderHomeCampaignSection(config);
  out.homeMotionSection = renderHomeMotionSection(config);
  out.enabled = Boolean(config.enabled);
  return out;
}

module.exports = {
  WIDGET_SCRIPT,
  loadConfig,
  buildMotionWidget,
  buildResponsiveMotionWidget,
  resolveWidgetHtml,
  renderSlot,
  renderPlacement,
  renderHomeCampaignSection,
  renderHomeMotionSection,
  buildBrowserFragments
};
