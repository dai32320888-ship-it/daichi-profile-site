const fs = require("fs");
const path = require("path");

const siteRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(siteRoot, "..");
const baseUrl = "https://dai32320888-ship-it.github.io/daichi-profile-site/gift-for-you/";
const rakutenAffiliateId = "53663d8f.6b4c8828.53663d90.626681b4";

function rakutenSearchUrl(keyword) {
  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  return `https://hb.afl.rakuten.co.jp/ichiba/${rakutenAffiliateId}/?pc=${encodeURIComponent(searchUrl)}&link_type=hybrid_url`;
}

function articlePath(slug) {
  return `article/${slug}/`;
}

const products = [
  ["individual-sweets", "個包装のお菓子", "人数が読みにくい職場や取引先でも配りやすく、相手に負担をかけにくい定番です。", "取引先、同僚、上司、帰省先", "1,000円から5,000円", "個包装 お菓子 ギフト", ["取引先", "同僚", "上司", "親", "無難", "消えもの", "取引先への手土産", "帰省土産", "お礼", "謝罪"]],
  ["baked-sweets", "焼き菓子ギフト", "好みが分かれにくく、見た目もきちんとしているため、手土産やお礼に使いやすい候補です。", "友達、親、取引先、上司", "2,000円から5,000円", "焼き菓子 ギフト おしゃれ", ["取引先", "友達", "親", "上司", "無難", "センス良く見える", "消えもの", "取引先への手土産", "お礼", "帰省土産"]],
  ["coffee-tea", "コーヒー・紅茶ギフト", "消えもので保管しやすく、甘いものが苦手な相手にも選びやすい贈り物です。", "上司、取引先、親、同僚", "1,500円から6,000円", "コーヒー 紅茶 ギフト", ["取引先", "上司", "親", "同僚", "実用的", "消えもの", "無難", "取引先への手土産", "退職祝い", "お礼"]],
  ["quality-towel", "上質タオルギフト", "実用的で相手の生活に残りすぎず、退職祝いや引っ越し祝いにも合わせやすいです。", "上司、親、祖父母、同僚", "3,000円から10,000円", "今治タオル ギフト", ["上司", "親", "祖父母", "同僚", "高級感", "実用的", "退職祝い", "引っ越し祝い", "結婚祝い"]],
  ["tumbler", "タンブラー", "職場でも自宅でも使いやすく、男性向け・女性向けどちらにも寄せやすい万能候補です。", "彼氏、上司、同僚、30代男性", "2,000円から8,000円", "タンブラー プレゼント", ["彼氏", "上司", "同僚", "男性", "30代", "40代", "実用的", "高級感", "退職祝い", "誕生日"]],
  ["name-pen", "名入れボールペン", "ビジネス感があり、節目の贈り物としてきちんと見えやすいアイテムです。", "上司、取引先、同僚、後輩", "3,000円から10,000円", "名入れ ボールペン ギフト", ["上司", "取引先", "同僚", "後輩", "男性", "女性", "高級感", "実用的", "退職祝い", "お礼"]],
  ["cosme-goods", "コスメ雑貨", "リップケアやハンドケアなど軽めの雑貨なら、特別感を出しつつ重くなりにくいです。", "彼女、女友達、20代女性", "1,500円から6,000円", "コスメ 雑貨 プレゼント", ["彼女", "友達", "女性", "20代", "30代", "おしゃれ", "センス良く見える", "誕生日", "お礼"]],
  ["accessory", "アクセサリー小物", "小ぶりで普段使いしやすいものを選ぶと、誕生日らしい華やかさを出せます。", "彼女、20代女性", "3,000円から10,000円以上", "アクセサリー プレゼント 女性", ["彼女", "女性", "20代", "30代", "おしゃれ", "高級感", "センス良く見える", "誕生日"]],
  ["flower", "フラワーギフト", "写真映えしやすく、誕生日やお祝いの気持ちをまっすぐ伝えられます。", "彼女、親、友達、祖父母", "3,000円から10,000円", "フラワーギフト プレゼント", ["彼女", "親", "友達", "祖父母", "女性", "おしゃれ", "高級感", "誕生日", "退職祝い", "結婚祝い", "お礼"]],
  ["gadget", "ガジェット小物", "実用性が高く、好みを外しても使い道が残りやすい男性向けの定番です。", "彼氏、30代男性、同僚、後輩", "2,000円から8,000円", "ガジェット 小物 プレゼント", ["彼氏", "同僚", "後輩", "男性", "20代", "30代", "40代", "実用的", "面白い", "誕生日", "お礼"]],
  ["leather-goods", "キーケース・革小物", "毎日使いやすく、価格帯を調整すればカジュアルにもきちんとした贈り物にもできます。", "彼氏、男性、上司、同僚", "3,000円から15,000円", "キーケース 革小物 プレゼント", ["彼氏", "上司", "同僚", "男性", "30代", "40代", "実用的", "高級感", "誕生日", "退職祝い"]],
  ["bath-gift", "入浴剤・バスギフト", "相手に気を遣わせにくく、女友達や同僚への軽い誕生日ギフトに向いています。", "友達、同僚、後輩", "1,000円から3,000円", "入浴剤 ギフト おしゃれ", ["友達", "同僚", "後輩", "女性", "20代", "30代", "おしゃれ", "消えもの", "センス良く見える", "誕生日", "お礼"]],
  ["baby-gift", "出産祝いギフト", "実用性と見た目のかわいさを両立しやすく、相手の家庭に合わせて選びやすいです。", "友達、同僚、親戚", "3,000円から10,000円", "出産祝い ギフト", ["友達", "同僚", "女性", "30代", "出産祝い", "実用的", "無難", "センス良く見える"]],
  ["kitchen-goods", "キッチン雑貨", "引っ越し祝いや結婚祝いで使いやすく、日常で役立つ印象を残せます。", "友達、親、同僚", "2,000円から8,000円", "キッチン雑貨 ギフト", ["友達", "親", "同僚", "引っ越し祝い", "結婚祝い", "実用的", "おしゃれ"]],
  ["catalog-gift", "カタログギフト", "相手の好みが分からない場面でも選んでもらえるため、外しにくい贈り物です。", "上司、親、取引先、結婚祝い", "3,000円から10,000円以上", "カタログギフト プレゼント", ["上司", "親", "取引先", "結婚祝い", "退職祝い", "高級感", "無難"]],
  ["fruit-gift", "フルーツギフト", "季節感と上品さがあり、年配の方や家族向けの贈り物にも向いています。", "親、祖父母、取引先", "3,000円から10,000円", "フルーツ ギフト", ["親", "祖父母", "取引先", "帰省土産", "お礼", "高級感", "消えもの"]],
  ["hand-care", "ハンドケアギフト", "小さくても見栄えがよく、軽いお礼や女友達への誕生日に選びやすいです。", "友達、彼女、同僚、後輩", "1,000円から5,000円", "ハンドクリーム ギフト", ["友達", "彼女", "同僚", "後輩", "女性", "おしゃれ", "センス良く見える", "お礼", "誕生日"]],
  ["room-fragrance", "ルームフレグランス", "香りの好みが合う相手なら、部屋を整えるおしゃれなギフトになります。", "友達、彼女、同僚", "2,000円から8,000円", "ルームフレグランス ギフト", ["友達", "彼女", "女性", "おしゃれ", "引っ越し祝い", "誕生日"]],
  ["stationery", "文房具・デスク小物", "仕事や勉強で使いやすく、後輩や同僚にも重すぎず渡せます。", "同僚、後輩、上司", "1,000円から5,000円", "文房具 ギフト おしゃれ", ["同僚", "後輩", "上司", "実用的", "お礼", "退職祝い", "無難"]],
  ["sleep-goods", "リラックス・睡眠グッズ", "忙しい相手への気遣いが伝わりやすく、実用的な癒やしギフトになります。", "彼氏、彼女、親、友達", "2,000円から8,000円", "睡眠 グッズ プレゼント", ["彼氏", "彼女", "親", "友達", "実用的", "おしゃれ", "誕生日", "お礼"]]
].map(([id, name, reason, target, budget, keyword, tags]) => ({
  id,
  name,
  reason,
  target,
  budget,
  keyword,
  tags,
  avoid: name.includes("お菓子") || name.includes("フルーツ") || name.includes("コーヒー") ? ["食べ物NG"] : [],
  rakutenUrl: rakutenSearchUrl(keyword),
  amazonUrl: "#",
  a8Url: "#",
  detailUrl: "article/gift-under-3000/"
}));

const articleSeeds = [
  ["birthday-gift-woman-20s", "20代女性への誕生日プレゼントおすすめ", "20代女性", "誕生日", ["cosme-goods", "accessory", "flower", "hand-care", "bath-gift"]],
  ["practical-gift-man-30s", "30代男性への実用的なプレゼントおすすめ", "30代男性", "実用的", ["gadget", "tumbler", "leather-goods", "stationery", "coffee-tea"]],
  ["business-gift-client", "取引先に失礼にならない手土産おすすめ", "取引先", "手土産", ["individual-sweets", "baked-sweets", "coffee-tea", "fruit-gift", "catalog-gift"]],
  ["retirement-gift-boss", "上司への退職祝いおすすめ", "上司", "退職祝い", ["quality-towel", "tumbler", "name-pen", "catalog-gift", "flower"]],
  ["gift-under-3000", "3,000円以内でセンスよく見えるプレゼントおすすめ", "相手を問わず", "3,000円以内", ["baked-sweets", "bath-gift", "hand-care", "stationery", "coffee-tea"]],
  ["birthday-gift-female-friend", "女友達に重すぎない誕生日プレゼントおすすめ", "女友達", "誕生日", ["bath-gift", "cosme-goods", "baked-sweets", "hand-care", "coffee-tea"]],
  ["girlfriend-birthday-stylish", "彼女の誕生日におしゃれなプレゼントおすすめ", "彼女", "誕生日", ["accessory", "cosme-goods", "flower", "hand-care", "room-fragrance"]],
  ["boyfriend-birthday-practical", "彼氏の誕生日に実用的なプレゼントおすすめ", "彼氏", "誕生日", ["gadget", "tumbler", "leather-goods", "sleep-goods", "stationery"]],
  ["parents-thank-you-gift", "親への感謝が伝わるプレゼントおすすめ", "親", "お礼", ["quality-towel", "fruit-gift", "coffee-tea", "catalog-gift", "sleep-goods"]],
  ["grandparents-gift", "祖父母に喜ばれやすいプレゼントおすすめ", "祖父母", "お祝い", ["fruit-gift", "quality-towel", "coffee-tea", "flower", "catalog-gift"]],
  ["coworker-small-thanks", "同僚に渡しやすいちょっとしたお礼おすすめ", "同僚", "お礼", ["individual-sweets", "coffee-tea", "stationery", "bath-gift", "hand-care"]],
  ["junior-gift", "後輩に気を遣わせないプレゼントおすすめ", "後輩", "お礼", ["stationery", "gadget", "baked-sweets", "tumbler", "bath-gift"]],
  ["moving-gift-friend", "友達の引っ越し祝いおすすめ", "友達", "引っ越し祝い", ["kitchen-goods", "quality-towel", "room-fragrance", "coffee-tea", "catalog-gift"]],
  ["wedding-gift-friend", "友達への結婚祝いおすすめ", "友達", "結婚祝い", ["catalog-gift", "kitchen-goods", "quality-towel", "flower", "coffee-tea"]],
  ["baby-gift-friend", "友達への出産祝いおすすめ", "友達", "出産祝い", ["baby-gift", "quality-towel", "catalog-gift", "hand-care", "baked-sweets"]],
  ["apology-gift-business", "謝罪時に失礼になりにくい菓子折りおすすめ", "取引先", "謝罪", ["individual-sweets", "baked-sweets", "coffee-tea", "fruit-gift", "catalog-gift"]],
  ["homecoming-souvenir", "帰省土産に選びやすいプレゼントおすすめ", "家族", "帰省土産", ["individual-sweets", "baked-sweets", "fruit-gift", "coffee-tea", "quality-towel"]],
  ["luxury-gift-under-10000", "1万円以内で高級感があるプレゼントおすすめ", "大切な相手", "高級感", ["catalog-gift", "quality-towel", "tumbler", "accessory", "fruit-gift"]],
  ["safe-gift-for-boss", "上司に無難で失礼にならないプレゼントおすすめ", "上司", "無難", ["coffee-tea", "quality-towel", "name-pen", "individual-sweets", "catalog-gift"]],
  ["client-coffee-gift", "取引先に渡しやすいコーヒーギフトおすすめ", "取引先", "手土産", ["coffee-tea", "individual-sweets", "baked-sweets", "catalog-gift", "fruit-gift"]],
  ["male-boss-retirement", "男性上司への退職祝いおすすめ", "男性上司", "退職祝い", ["name-pen", "tumbler", "quality-towel", "catalog-gift", "coffee-tea"]],
  ["female-boss-retirement", "女性上司への退職祝いおすすめ", "女性上司", "退職祝い", ["quality-towel", "flower", "hand-care", "catalog-gift", "coffee-tea"]],
  ["budget-1000-gift", "1,000円以内のちょっとしたプレゼントおすすめ", "相手を問わず", "1,000円以内", ["individual-sweets", "stationery", "bath-gift", "hand-care", "coffee-tea"]],
  ["budget-5000-gift", "5,000円以内で外しにくいプレゼントおすすめ", "相手を問わず", "5,000円以内", ["tumbler", "quality-towel", "baked-sweets", "cosme-goods", "leather-goods"]],
  ["budget-10000-gift", "10,000円以内で特別感があるプレゼントおすすめ", "大切な相手", "10,000円以内", ["catalog-gift", "accessory", "quality-towel", "flower", "leather-goods"]],
  ["stylish-consumable-gift", "おしゃれな消えものプレゼントおすすめ", "友達や同僚", "消えもの", ["baked-sweets", "coffee-tea", "bath-gift", "fruit-gift", "hand-care"]],
  ["no-food-gift", "食べ物NGの相手に選びやすいプレゼントおすすめ", "食べ物NGの相手", "実用的", ["quality-towel", "tumbler", "stationery", "kitchen-goods", "sleep-goods"]],
  ["no-fragrance-gift", "香りものNGでも贈りやすいプレゼントおすすめ", "香りものNGの相手", "無難", ["baked-sweets", "quality-towel", "tumbler", "stationery", "catalog-gift"]],
  ["funny-but-safe-gift", "面白いけど失礼になりにくいプレゼントおすすめ", "友達や同僚", "面白い", ["gadget", "stationery", "tumbler", "baked-sweets", "bath-gift"]],
  ["sense-good-gift", "センス良く見えるプレゼントおすすめ", "相手を問わず", "センス良く見える", ["hand-care", "baked-sweets", "coffee-tea", "quality-towel", "room-fragrance"]],
  ["teen-gift", "10代に贈りやすいプレゼントおすすめ", "10代", "誕生日", ["stationery", "gadget", "cosme-goods", "bath-gift", "baked-sweets"]],
  ["woman-30s-gift", "30代女性に喜ばれやすいプレゼントおすすめ", "30代女性", "誕生日", ["cosme-goods", "hand-care", "quality-towel", "coffee-tea", "room-fragrance"]],
  ["man-40s-gift", "40代男性に贈りやすいプレゼントおすすめ", "40代男性", "実用的", ["tumbler", "leather-goods", "coffee-tea", "name-pen", "sleep-goods"]],
  ["woman-40s-gift", "40代女性に上品なプレゼントおすすめ", "40代女性", "高級感", ["quality-towel", "flower", "hand-care", "fruit-gift", "catalog-gift"]],
  ["man-50s-gift", "50代男性に失礼になりにくいプレゼントおすすめ", "50代男性", "無難", ["coffee-tea", "name-pen", "tumbler", "quality-towel", "catalog-gift"]],
  ["woman-50s-gift", "50代女性に喜ばれやすいプレゼントおすすめ", "50代女性", "高級感", ["fruit-gift", "quality-towel", "flower", "coffee-tea", "catalog-gift"]],
  ["senior-60s-gift", "60代以上に贈りやすいプレゼントおすすめ", "60代以上", "お祝い", ["fruit-gift", "quality-towel", "coffee-tea", "catalog-gift", "flower"]],
  ["business-card-gift", "ビジネス相手に選びやすい小物プレゼントおすすめ", "ビジネス相手", "実用的", ["name-pen", "stationery", "tumbler", "coffee-tea", "quality-towel"]],
  ["remote-work-gift", "在宅ワークの人に実用的なプレゼントおすすめ", "在宅ワークの人", "実用的", ["gadget", "tumbler", "coffee-tea", "sleep-goods", "stationery"]],
  ["housewarming-no-fail", "引っ越し祝いで失敗しにくいプレゼントおすすめ", "友達や同僚", "引っ越し祝い", ["quality-towel", "kitchen-goods", "coffee-tea", "catalog-gift", "room-fragrance"]],
  ["couple-wedding-safe", "結婚祝いで無難に喜ばれるプレゼントおすすめ", "夫婦", "結婚祝い", ["catalog-gift", "quality-towel", "kitchen-goods", "coffee-tea", "flower"]],
  ["small-office-gift", "職場で配りやすいプレゼントおすすめ", "職場", "お礼", ["individual-sweets", "coffee-tea", "stationery", "baked-sweets", "hand-care"]],
  ["school-friend-gift", "学生の友達に重すぎないプレゼントおすすめ", "学生の友達", "誕生日", ["stationery", "bath-gift", "baked-sweets", "cosme-goods", "gadget"]],
  ["long-distance-gift", "遠方の相手に送りやすいプレゼントおすすめ", "遠方の相手", "配送", ["catalog-gift", "baked-sweets", "coffee-tea", "quality-towel", "flower"]],
  ["seasonal-winter-gift", "冬に贈りたいあったかプレゼントおすすめ", "相手を問わず", "季節の贈り物", ["coffee-tea", "sleep-goods", "quality-towel", "bath-gift", "tumbler"]],
  ["seasonal-summer-gift", "夏に贈りたい爽やかなプレゼントおすすめ", "相手を問わず", "季節の贈り物", ["fruit-gift", "tumbler", "coffee-tea", "quality-towel", "bath-gift"]],
  ["thank-you-teacher", "先生やお世話になった人へのお礼プレゼントおすすめ", "先生や恩人", "お礼", ["coffee-tea", "baked-sweets", "quality-towel", "name-pen", "flower"]],
  ["neighbor-thanks", "ご近所へのちょっとしたお礼おすすめ", "ご近所", "お礼", ["individual-sweets", "baked-sweets", "coffee-tea", "quality-towel", "fruit-gift"]],
  ["partner-anniversary", "記念日に贈りやすいプレゼントおすすめ", "パートナー", "記念日", ["accessory", "flower", "tumbler", "sleep-goods", "room-fragrance"]],
  ["last-minute-gift", "急ぎで用意しやすいプレゼントおすすめ", "急ぎの相手", "すぐ渡す", ["baked-sweets", "coffee-tea", "bath-gift", "hand-care", "stationery"]]
];

const productById = Object.fromEntries(products.map((product) => [product.id, product]));

const articles = articleSeeds.map(([slug, title, recipient, scene, productIds]) => {
  const categories = productIds.map((id) => productById[id].name);
  return {
    slug,
    title,
    description: `${recipient}への${scene}に使いやすいプレゼントを、失敗しにくい選び方とおすすめカテゴリで紹介します。`,
    intro: `${recipient}への${scene}は、相手との距離感、予算、渡す場面をそろえて考えると選びやすくなります。迷ったときは、実用的なもの、消えもの、見た目が上品なものから候補を絞ると失敗しにくいです。`,
    points: [
      "相手の好みが分からないときは、使い切れるものや日常で使えるものを優先する",
      "高すぎるものは相手に気を遣わせやすいため、関係性に合う価格帯にする",
      "職場や取引先では、個性的すぎるものや香りが強いものを避ける"
    ],
    categories,
    mistakes: [
      "サイズ選びが必要な服や靴",
      "香りや味の好みが強く分かれるもの",
      "相手との距離感に対して高価すぎるもの"
    ],
    products: productIds
  };
});

for (const article of articles) {
  for (const productId of article.products) {
    const product = productById[productId];
    if (product.detailUrl === "article/gift-under-3000/") {
      product.detailUrl = articlePath(article.slug);
    }
  }
}

const pillarContentPath = path.join(siteRoot, "data", "gift-pillar-content.json");
const giftStrategy = fs.existsSync(pillarContentPath)
  ? JSON.parse(fs.readFileSync(pillarContentPath, "utf8"))
  : {};
const PILLAR_SLUGS = new Set(giftStrategy.pillarSlugs || []);
const PILLAR_DETAILS = giftStrategy.pillars || {};

for (const article of articles) {
  const extra = PILLAR_DETAILS[article.slug];
  if (!extra) continue;
  if (extra.intro) article.intro = extra.intro;
  if (extra.points) article.points = extra.points;
  if (extra.mistakes) article.mistakes = extra.mistakes;
  article.experience = extra.experience || "";
  article.comparisonNote = extra.comparisonNote || "";
  article.faq = extra.faq || [];
  article.isPillar = true;
}

function isGiftPillar(slug) {
  return PILLAR_SLUGS.has(slug);
}

function giftSitemapPriority(slug) {
  return isGiftPillar(slug) ? "0.9" : "0.6";
}

const gearBlogUrl = "https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review/";

function todayInJapan() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const v = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return `${v.year}-${v.month}-${v.day}`;
}

const lastMod = todayInJapan();

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function seoHead({ title, description, url, type = "website", iconHref = "./", robots, feedHref }) {
  const robotsMeta = robots ? `<meta name="robots" content="${esc(robots)}" />` : "";
  const feedLink = feedHref
    ? `<link rel="alternate" type="application/rss+xml" title="プレゼントふぉーゆー" href="${esc(feedHref)}" />`
    : "";
  return `${robotsMeta}${feedLink}
  <link rel="icon" href="${iconHref}favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="${iconHref}favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="${iconHref}favicon-16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="${iconHref}apple-touch-icon.png" />
  <link rel="icon" href="${iconHref}favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href="${esc(url)}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:site_name" content="プレゼントふぉーゆー" />
  <meta name="twitter:card" content="summary" />
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebSite",
    name: title,
    description,
    url
  })}</script>`;
}

function staticProductCards(productIds) {
  const items = productIds.map((id) => productById[id]).filter(Boolean);
  const list = items.length ? items : products.slice(0, 5);
  return list
    .map(
      (item) => `<article class="product-card">
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.reason)}</p>
      <div class="meta">
        <span><strong>向いている相手:</strong> ${esc(item.target)}</span>
        <span><strong>予算目安:</strong> ${esc(item.budget)}</span>
      </div>
      <div class="card-actions">
        <a class="button shop" href="${esc(item.rakutenUrl)}" rel="nofollow sponsored noopener noreferrer" target="_blank">楽天で見る</a>
        <a class="button detail" href="${esc(item.detailUrl)}">詳しく見る</a>
      </div>
    </article>`
    )
    .join("");
}

function staticArticleBody(article) {
  const experienceBlock = article.experience
    ? `<div class="summary-box experience-box"><h2>選び方の実体験</h2><p>${esc(article.experience)}</p></div>`
    : "";
  const comparisonBlock = article.comparisonNote
    ? `<div class="summary-box"><h2>カテゴリの使い分け</h2><p>${esc(article.comparisonNote)}</p></div>`
    : "";
  const faqBlock =
    article.faq?.length
      ? `<div class="summary-box faq-box"><h2>よくある質問</h2>${article.faq
          .map(
            (item) =>
              `<details class="faq-item"><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`
          )
          .join("")}</div>`
      : "";
  const categoryDetails = article.products
    .map((id) => productById[id])
    .filter(Boolean)
    .map(
      (item) =>
        `<li><strong>${esc(item.name)}</strong> — ${esc(item.reason)}（${esc(item.budget)}）</li>`
    )
    .join("");
  return `<p class="breadcrumb"><a href="../../">ホーム</a> &gt; 記事 &gt; ${esc(article.title)}</p>
    <p class="eyebrow">広告を含みます</p>
    <h1>${esc(article.title)}</h1>
    <p class="lead">${esc(article.intro)}</p>
    ${experienceBlock}
    <h2>選び方のポイント</h2>
    <ul>${article.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>
    ${comparisonBlock}
    <h2>おすすめカテゴリ5つ（詳細）</h2>
    <ul class="category-detail-list">${categoryDetails}</ul>
    <h2>失敗しやすいプレゼント</h2>
    <ul>${article.mistakes.map((mistake) => `<li>${esc(mistake)}</li>`).join("")}</ul>
    <h2>楽天で探す（商品カード）</h2>
    <div class="product-grid">${staticProductCards(article.products)}</div>
    ${faqBlock}
    <h2>まとめ</h2>
    <p>${esc(article.title.replace("おすすめ", ""))}は、相手との距離感・予算・渡す場面をそろえて考えると選びやすくなります。迷ったら上のカテゴリから1つに絞り、楽天リンクで最新価格を確認してください。</p>
    <p>生活装備のプレゼント候補は <a href="${gearBlogUrl}">元自衛官の楽天装備レビュー</a> も参考にできます。</p>`;
}

function renderGiftFooter(topHref = "./") {
  const promo = giftStrategy.promotion?.blogmura || {};
  const blogmura =
    promo.cid
      ? `<a href="https://blogmura.com/ranking/in?p_cid=${esc(promo.cid)}" target="_blank" rel="noopener noreferrer"><img src="https://blogmura.com/img/blogmura_ranking_banner_01.gif" width="117" height="31" alt="にほんブログ村 ブログランキング"></a>`
      : `<a class="promo-badge" href="https://mypage.blogmura.com/signup" target="_blank" rel="noopener noreferrer">にほんブログ村（登録はこちら）</a>`;
  const blogParts =
    promo.cid && promo.blogParts
      ? `<div class="promo-blogparts"><div class="blogmura-blogparts" data-chid="${esc(promo.cid)}" data-category="${esc(promo.blogParts.category || "0")}" data-type="${esc(promo.blogParts.type || "pv")}"></div><script src="https://blogparts.blogmura.com/js/parts_view.js" defer></script></div>`
      : "";
  return `<footer class="footer site-footer-gift">
    <div class="footer-main">
      <p><a href="${topHref}#about">このサイトについて</a> · <a href="${gearBlogUrl}">元自衛官の楽天装備レビュー</a></p>
      <div class="promo-badges">${blogmura}</div>
      ${blogParts}
    </div>
  </footer>`;
}

function staticPillarLinksHtml() {
  return articles
    .filter((a) => isGiftPillar(a.slug))
    .map(
      (article) => `<a class="article-link article-link--pillar" href="article/${article.slug}/">
      <h3>${esc(article.title)}</h3>
      <p>${esc(article.description)}</p>
      <span>柱記事を読む</span>
    </a>`
    )
    .join("");
}

function staticArticleLinksHtml() {
  const sorted = [...articles].sort((a, b) => {
    const aP = isGiftPillar(a.slug) ? 0 : 1;
    const bP = isGiftPillar(b.slug) ? 0 : 1;
    return aP - bP;
  });
  return sorted
    .map(
      (article) => `<a class="article-link${isGiftPillar(article.slug) ? " article-link--pillar" : ""}" href="article/${article.slug}/">
      <h3>${esc(article.title)}</h3>
      <p>${esc(article.description)}</p>
      <span>${isGiftPillar(article.slug) ? "柱記事" : "記事を読む"}</span>
    </a>`
    )
    .join("");
}

function jsString(value) {
  return JSON.stringify(value, null, 2);
}

function appJs() {
  return `const productCards = ${jsString(products)};

const articles = ${jsString(articles)};

const productById = Object.fromEntries(productCards.map((product) => [product.id, product]));

function scoreProduct(product, answers) {
  const terms = [answers.recipient, answers.gender, answers.age, answers.budget, answers.scene, answers.mood].filter(Boolean);
  let score = terms.reduce((sum, term) => sum + (product.tags.includes(term) ? 3 : 0), 0);
  if (answers.avoid.some((avoid) => product.avoid.includes(avoid))) score -= 8;
  if (answers.mood === "無難" && product.tags.includes("無難")) score += 2;
  if (answers.scene === "謝罪" && product.tags.includes("高級感")) score -= 1;
  return score;
}

function renderProducts(items, container) {
  const basePrefix = document.body.dataset.article ? "../../" : "";
  const detailHref = (url) => url === "#" || url.startsWith("http") ? url : \`\${basePrefix}\${url}\`;
  container.innerHTML = items.map((item) => \`
    <article class="product-card">
      <h3>\${item.name}</h3>
      <p>\${item.reason}</p>
      <div class="meta">
        <span><strong>向いている相手:</strong> \${item.target}</span>
        <span><strong>予算目安:</strong> \${item.budget}</span>
      </div>
      <div class="card-actions">
        <a class="button shop" href="\${item.rakutenUrl}" rel="nofollow sponsored">楽天で見る</a>
        \${item.a8Url && item.a8Url !== "#" ? \`<a class="button shop" href="\${item.a8Url}" rel="nofollow sponsored">A8で見る</a>\` : ""}
        <a class="button detail" href="\${detailHref(item.detailUrl)}">詳しく見る</a>
      </div>
    </article>
  \`).join("");
}

function setupDiagnosis() {
  const form = document.querySelector("#giftForm");
  const results = document.querySelector("#results");
  if (!form || !results) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const answers = {
      recipient: data.get("recipient"),
      gender: data.get("gender"),
      age: data.get("age"),
      budget: data.get("budget"),
      scene: data.get("scene"),
      mood: data.get("mood"),
      avoid: data.getAll("avoid")
    };
    const ranked = productCards
      .map((product) => ({ ...product, score: scoreProduct(product, answers) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    results.innerHTML = \`
      <div class="section-heading">
        <p class="breadcrumb">ホーム &gt; 診断結果</p>
        <h2>おすすめ候補</h2>
        <p class="result-summary">\${answers.recipient}・\${answers.scene}・\${answers.mood}に合わせて、扱いやすい候補を選びました。リンク先は広告を含みます。</p>
      </div>
      <div class="product-grid"></div>
    \`;
    renderProducts(ranked, results.querySelector(".product-grid"));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderArticleList() {
  const list = document.querySelector("#articleList");
  if (!list || list.dataset.static === "1") return;
  list.innerHTML = articles.map((article) => \`
    <a class="article-link" href="article/\${article.slug}/">
      <h3>\${article.title}</h3>
      <p>\${article.description}</p>
      <span>記事を読む</span>
    </a>
  \`).join("");
}

function renderArticlePage() {
  const body = document.body;
  const slug = body.dataset.article;
  if (!slug) return;
  const article = articles.find((item) => item.slug === slug);
  const container = document.querySelector("#articleContent");
  const side = document.querySelector("#sideLinks");
  if (!article || !container || container.dataset.static === "1") return;
  const relatedProducts = article.products.map((id) => productById[id]).filter(Boolean);
  const fallbackProducts = relatedProducts.length ? relatedProducts : productCards.slice(0, 5);

  container.innerHTML = \`
    <p class="breadcrumb"><a href="../../">ホーム</a> &gt; 記事 &gt; \${article.title}</p>
    <p class="eyebrow">広告を含みます</p>
    <h1>\${article.title}</h1>
    <p>\${article.intro}</p>
    <h2>選び方のポイント</h2>
    <ul>\${article.points.map((point) => \`<li>\${point}</li>\`).join("")}</ul>
    <h2>おすすめカテゴリ5つ</h2>
    <ul>\${article.categories.map((category) => \`<li>\${category}</li>\`).join("")}</ul>
    <h2>失敗しやすいプレゼント</h2>
    <ul>\${article.mistakes.map((mistake) => \`<li>\${mistake}</li>\`).join("")}</ul>
    <h2>商品リンク用カード</h2>
    <div class="product-grid" id="articleProducts"></div>
    <h2>まとめ</h2>
    <p>\${article.title.replace("おすすめ", "")}は、相手との距離感、予算、持ち帰りやすさをそろえて考えると選びやすくなります。迷ったときは、実用的なものや消えものから候補を絞るのがおすすめです。</p>
  \`;
  renderProducts(fallbackProducts, document.querySelector("#articleProducts"));

  if (side) {
    side.innerHTML = \`<strong>関連記事</strong>\` + articles
      .filter((item) => item.slug !== slug)
      .slice(0, 8)
      .map((item) => \`<a href="../\${item.slug}/">\${item.title}</a>\`)
      .join("");
  }
}

setupDiagnosis();
renderArticleList();
renderArticlePage();
`;
}

function articleHtml(article) {
  const pageUrl = `${baseUrl}${articlePath(article.slug)}`;
  const related = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 8)
    .map((item) => `<a href="../${item.slug}/">${esc(item.title)}</a>`)
    .join("");
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(article.title)}｜プレゼントふぉーゆー</title>
  <meta name="description" content="${esc(article.description)}">
  ${seoHead({ title: article.title, description: article.description, url: pageUrl, type: "article", iconHref: "../../" })}
  <link rel="stylesheet" href="../../styles.css">
</head>
<body class="article-page" data-article="${article.slug}">
  <header class="site-header"><a class="brand" href="../../">プレゼントふぉーゆー</a><nav class="nav"><a href="../../#diagnosis">診断する</a><a href="../../#articles">記事</a><a href="../../#about">このサイトについて</a></nav></header>
  <main class="section article-layout"><article class="article-body" id="articleContent" data-static="1">${staticArticleBody(article)}</article><aside class="side-links" id="sideLinks"><strong>関連記事</strong>${articles.filter((a) => a.slug !== article.slug).slice(0, 10).map((a) => `<a href="../${a.slug}/">${esc(a.title)}</a>`).join("")}</aside></main>
  ${renderGiftFooter("../../")}
  <script src="../../app.js"></script>
</body>
</html>
`;
}

function indexHtml() {
  const title = "プレゼントふぉーゆー｜相手・予算・シーンで選ぶプレゼント診断";
  const description = "相手・予算・シーンを選ぶだけで、誕生日、退職祝い、手土産、お礼などに合う失敗しにくいプレゼントカテゴリを提案する診断風サイトです。";
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${esc(description)}">
  ${seoHead({ title: "プレゼントふぉーゆー", description, url: baseUrl, feedHref: "./feed.xml" })}
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="./" aria-label="プレゼントふぉーゆー トップ">プレゼントふぉーゆー</a>
    <nav class="nav" aria-label="主要ナビゲーション">
      <a href="#diagnosis">診断する</a>
      <a href="#articles">記事</a>
      <a href="#about">このサイトについて</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-copy">
        <p class="breadcrumb">ホーム</p>
        <p class="eyebrow">広告を含みます</p>
        <h1>プレゼントふぉーゆー</h1>
        <p class="lead">相手・予算・シーンを選ぶだけ。失敗しにくいプレゼントを提案します。</p>
        <p class="description">誕生日、退職祝い、取引先への手土産、ちょっとしたお礼まで。柱記事5本に体験談・FAQを追加し、上位サイト並みの深さで読めます。</p>
        <div class="hero-actions">
          <a class="button primary" href="#diagnosis">プレゼント診断を始める</a>
          <a class="button ghost" href="#pillars">柱記事5本</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="gift-stack">
          <span class="gift-card card-one"></span>
          <span class="gift-card card-two"></span>
          <span class="gift-card card-three"></span>
        </div>
      </div>
    </section>

    <section id="diagnosis" class="section">
      <div class="section-heading">
        <p class="breadcrumb">ホーム &gt; プレゼント診断</p>
        <h2>条件を選んでおすすめを見る</h2>
        <p>迷いやすい条件だけを選ぶ、かんたんな診断フォームです。</p>
      </div>

      <form class="diagnosis-card" id="giftForm">
        <div class="form-grid">
          <label>贈る相手
            <select name="recipient" required>
              <option value="">選択してください</option>
              <option>彼女</option><option>彼氏</option><option>友達</option><option>親</option><option>祖父母</option><option>上司</option><option>取引先</option><option>同僚</option><option>後輩</option>
            </select>
          </label>
          <label>性別
            <select name="gender" required>
              <option value="">選択してください</option>
              <option>男性</option><option>女性</option><option>どちらでも</option><option>不明</option>
            </select>
          </label>
          <label>年齢
            <select name="age" required>
              <option value="">選択してください</option>
              <option>10代</option><option>20代</option><option>30代</option><option>40代</option><option>50代</option><option>60代以上</option>
            </select>
          </label>
          <label>予算
            <select name="budget" required>
              <option value="">選択してください</option>
              <option>1,000円以内</option><option>3,000円以内</option><option>5,000円以内</option><option>10,000円以内</option><option>それ以上</option>
            </select>
          </label>
          <label>シーン
            <select name="scene" required>
              <option value="">選択してください</option>
              <option>誕生日</option><option>退職祝い</option><option>引っ越し祝い</option><option>結婚祝い</option><option>出産祝い</option><option>お礼</option><option>謝罪</option><option>取引先への手土産</option><option>帰省土産</option>
            </select>
          </label>
          <label>雰囲気
            <select name="mood" required>
              <option value="">選択してください</option>
              <option>おしゃれ</option><option>無難</option><option>高級感</option><option>面白い</option><option>実用的</option><option>消えもの</option><option>センス良く見える</option>
            </select>
          </label>
        </div>
        <fieldset>
          <legend>避けたいもの</legend>
          <div class="check-grid">
            <label><input type="checkbox" name="avoid" value="食べ物NG"> 食べ物NG</label>
            <label><input type="checkbox" name="avoid" value="香りものNG"> 香りものNG</label>
            <label><input type="checkbox" name="avoid" value="高すぎるものNG"> 高すぎるものNG</label>
            <label><input type="checkbox" name="avoid" value="個性的すぎるものNG"> 個性的すぎるものNG</label>
          </div>
        </fieldset>
        <button class="button primary wide" type="submit">おすすめを表示する</button>
      </form>

      <div id="results" class="results" aria-live="polite"></div>
    </section>

    <section id="pillars" class="section">
      <div class="section-heading">
        <p class="breadcrumb">ホーム &gt; 柱記事</p>
        <h2>まず読む柱記事5本</h2>
        <p>体験談・FAQ・カテゴリ詳細付き。検索流入の受け皿になる記事です。</p>
      </div>
      <div class="article-grid">${staticPillarLinksHtml()}</div>
    </section>

    <section id="articles" class="section soft">
      <div class="section-heading">
        <p class="breadcrumb">ホーム &gt; 記事一覧</p>
        <h2>プレゼント選びの記事（全${articles.length}本）</h2>
        <p>柱記事5本を厚く書いています。ピンク枠がおすすめの入口です。</p>
      </div>
      <div class="article-grid" id="articleList" data-static="1">${staticArticleLinksHtml()}</div>
    </section>

    <section id="about" class="section about">
      <div>
        <p class="breadcrumb">ホーム &gt; このサイトについて</p>
        <h2>このサイトについて</h2>
        <p>プレゼントふぉーゆーは、贈る相手やシーンに合わせて「外しにくい候補」を探すためのプレゼント相談サイトです。掲載リンクには広告が含まれる場合があります。</p>
        <p>関連サイト: <a href="${gearBlogUrl}">元自衛官の楽天装備レビュー</a></p>
      </div>
      <div class="notice">
        <strong>広告表記</strong>
        <p>当サイトはアフィリエイト広告を利用しています。商品購入前には、販売ページで価格・在庫・送料・レビュー・返品条件をご確認ください。</p>
      </div>
    </section>
  </main>

  ${renderGiftFooter("./")}

  <script src="app.js"></script>
</body>
</html>
`;
}

function sitemapXml() {
  const urls = [
    { loc: baseUrl, priority: "1.0", changefreq: "weekly" },
    ...articles.map((article) => ({
      loc: `${baseUrl}${articlePath(article.slug)}`,
      priority: giftSitemapPriority(article.slug),
      changefreq: "monthly"
    }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

function cdataFeedText(value) {
  return `<![CDATA[${String(value || "").replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

function feedXml() {
  const items = [...articles]
    .reverse()
    .slice(0, 30)
    .map((article) => {
      const link = `${baseUrl}${articlePath(article.slug)}`;
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

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

const { mergeRootSitemap } = require(path.join(repoRoot, "scripts", "sync-root-sitemap.cjs"));

fs.writeFileSync(path.join(siteRoot, "index.html"), indexHtml(), "utf8");
fs.writeFileSync(path.join(siteRoot, "app.js"), appJs(), "utf8");
for (const article of articles) {
  const dir = path.join(siteRoot, "article", article.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), articleHtml(article), "utf8");
}
fs.writeFileSync(path.join(siteRoot, "sitemap.xml"), sitemapXml(), "utf8");
fs.writeFileSync(path.join(siteRoot, "feed.xml"), feedXml(), "utf8");
mergeRootSitemap();

console.log(`Generated ${articles.length} articles and ${products.length} product cards.`);
