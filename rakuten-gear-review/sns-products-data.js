/**
 * SNS（Instagram / TikTok / YouTube Shorts）で紹介した商品の正本。
 * 商品を追加するときはこのファイルを編集してください。
 */
const SNS_PRODUCT_CATEGORIES = [
  { id: "summer-goods", name: "夏用品" },
  { id: "sleep-health", name: "睡眠・健康" },
  { id: "solo-living", name: "一人暮らし" },
  { id: "pc-gadget", name: "PC・ガジェット" },
  { id: "training", name: "筋トレ" },
  { id: "bike-outdoor", name: "バイク・アウトドア" },
];

const SNS_PRODUCTS = [
  {
    id: "affiliate-002-cooling-handfan",
    name: "冷却プレート付きハンディファン",
    category: "summer-goods",
    intro:
      "最大120段階の風量調整と冷却プレートを搭載した、夏の外出向けハンディファン。",
    snsSource: "Instagram・TikTok・YouTube Shorts（冷却プレート付きハンディファン紹介動画）",
    imageUrl: "../images/sns/cooling-plate-handheld-fan.png",
    imageAlt: "冷却プレート付きハンディファンの商品画像",
    affiliateUrl: "https://a.r10.to/hYGsti",
    articleUrl: "../article/cooling-plate-handheld-fan/",
    isLatest: true,
    sortOrder: 1,
  },
  {
    id: "mouth-breathing-tape",
    name: "鼻呼吸テープ／口閉じテープ（X型・I型 120枚入）",
    category: "sleep-health",
    intro:
      "就寝前に口元へ貼り、鼻呼吸をサポートするテープです。朝の口や喉の乾燥、いびきが気になる人向けの補助アイテムとして使われています。",
    snsSource: "Instagram・YouTube Shorts（鼻呼吸テープ紹介動画）",
    imageUrl: "../images/sns/mouth-breathing-tape.png",
    imageAlt: "鼻呼吸テープ／口閉じテープの商品画像",
    affiliateUrl: "https://a.r10.to/hP4tQy",
    articleUrl: "../article/mouth-tape-sleep/",
    isLatest: false,
    sortOrder: 2,
  },
];

if (typeof window !== "undefined") {
  window.SNS_PRODUCT_CATEGORIES = SNS_PRODUCT_CATEGORIES;
  window.SNS_PRODUCTS = SNS_PRODUCTS;
}

if (typeof module !== "undefined") {
  module.exports = { SNS_PRODUCT_CATEGORIES, SNS_PRODUCTS };
}
