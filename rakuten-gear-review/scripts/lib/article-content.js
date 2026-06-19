const { cleanProductName, displayProductName, isBadProductName, hasMojibake, isValidRating } = require("./rakuten-search");

const CATEGORY_LABELS = {
  life: "生活装備",
  "pc-ai": "PC・AI作業環境",
  training: "筋トレ装備",
  bike: "バイク旅装備",
  disaster: "防災装備",
  solo: "一人暮らし準備",
  car: "車・移動装備",
  game: "ゲーム機・周辺"
};

const ROLE_LABELS = ["コスパ重視", "バランス型", "こだわり派"];

function angleFromArticle(article) {
  const m = article.title.match(/「([^」]+)」/);
  if (m) return m[1];
  return article.summary?.slice(0, 20) || article.title.slice(0, 20);
}

function formatPrice(price) {
  if (!price || Number.isNaN(price)) return "要確認（商品ページ）";
  return `約${price.toLocaleString("ja-JP")}円`;
}

function formatReview(product) {
  if (!product.reviewCount) return "レビュー件数は商品ページで確認";
  const rating = isValidRating(product.rating) ? ` / 評価${product.rating}` : "";
  return `レビュー${product.reviewCount.toLocaleString("ja-JP")}件${rating}`;
}

function pickSpecsList(product, angle) {
  const fromPage = (product.specs || [])
    .slice(0, 5)
    .map((s) => `${s.label}：${s.value}`)
    .filter((line) => !hasMojibake(line));
  const fallback = [
    `用途：${angle}向けの候補`,
    `価格帯：${formatPrice(product.price)}`,
    `口コミ：${formatReview(product)}`
  ];
  return fromPage.length ? fromPage : fallback;
}

function buildUsageExamples(angle, product, role) {
  const name = cleanProductName(product.name || angle);
  return [
    `平日夜：帰宅後すぐ${angle}の準備に使う定位置として置く。${role}向けの候補。`,
    `週末：掃除・片付けのタイミングで一度だけ点検。${name}が導線に入っているか確認する。`,
    `買い替え前：今の道具とサイズ・重量を比較してからカートに入れる（${formatPrice(product.price)}）。`
  ];
}

function buildComparisonNote(product, siblings, role, index) {
  const others = siblings.filter((_, i) => i !== index);
  const price = product.price || 0;
  const cheaper = others.filter((p) => (p.price || 0) > 0 && p.price < price);
  const pricier = others.filter((p) => (p.price || 0) > price);
  if (role === "コスパ重視") {
    return pricier.length
      ? `高価格帯より手頃。まず1つ試すなら${role}の${cleanProductName(product.name)}が選びやすい。`
      : `${angleHint(product)}初めて買うなら失敗しにくい入口。`;
  }
  if (role === "こだわり派") {
    return cheaper.length
      ? `安価な候補より仕様・レビュー件数で差が出やすい。長く使う前提なら${role}を検討。`
      : `スペック重視で比較したい人向け。`;
  }
  return `価格と使いやすさの中間。${formatReview(product)}を見ながら決めるのがおすすめ。`;
}

function angleHint(product) {
  const desc = product.description ? product.description.slice(0, 40) : "";
  return desc && !hasMojibake(desc) ? `${desc}… ` : "";
}

function buildVerdict(product, role, angle) {
  const name = cleanProductName(product.name || angle);
  if (role === "コスパ重視") return `${angle}を試す第一候補。${name}は${formatPrice(product.price)}帯で始めやすい。`;
  if (role === "こだわり派") return `毎日使う前提なら${name}。スペック表と低評価コメントを先に読む。`;
  return `迷ったら${name}から比較。合わなければ同記事の他候補を見る。`;
}

function buildRichPick(product, index, angle, siblings, category) {
  const role = ROLE_LABELS[index] || ROLE_LABELS[1];
  const name = displayProductName(product.name, product.keyword || angle, index);
  const desc =
    product.description && !isBadProductName(product.description) ? product.description.slice(0, 100) : "";

  const pick = {
    name,
    category,
    role,
    intro: [
      `【${role}】${name}。${desc || `${angle}で探している人向けの候補${index + 1}。`}`,
      `商品ページの${formatReview(product)}・${formatPrice(product.price)}を基準に、自分の使用頻度と置き場所に合うか見てください。`
    ],
    specs: pickSpecsList(product, angle),
    usageExamples: buildUsageExamples(angle, product, role),
    comparisonNote: buildComparisonNote(product, siblings, role, index),
    verdict: buildVerdict(product, role, angle),
    scenes: [
      `${angle}を整えたい平日`,
      "初めて買う・買い替えの比較時",
      role === "コスパ重視" ? "とにかく失敗したくないとき" : "長く使う前提で選びたいとき"
    ],
    caution: [
      "サイズ・素材・付属品は必ず商品ページで再確認",
      "レビューの低評価（1〜2星）だけ先に読むと失敗が減る",
      "送料・クーポン込みの総額で比較する"
    ]
  };

  if (product.productUrl) {
    pick.rakutenProductUrl = product.productUrl;
    pick.affiliateUrl = product.affiliateUrl;
  } else {
    pick.rakutenSearchKeyword = product.keyword || angle;
  }
  if (product.imageUrl) pick.imageUrl = product.imageUrl;
  pick.price = product.price || null;
  pick.reviewCount = product.reviewCount || 0;
  pick.rating = product.rating || "";
  return pick;
}

function buildComparisonTableHtml(picks, angle) {
  const rows = picks
    .map(
      (p, i) => `<tr>
        <th scope="row">${ROLE_LABELS[i] || `候補${i + 1}`}</th>
        <td>${escapeHtml(displayProductName(p.name, angle, i))}</td>
        <td>${escapeHtml(formatPrice(p.price))}</td>
        <td>${escapeHtml(formatReview(p))}</td>
        <td>${escapeHtml(p.role || ROLE_LABELS[i] || "比較候補")}</td>
      </tr>`
    )
    .join("");
  return `<div class="comparison-table-wrap">
<table class="comparison-table">
<caption>${escapeHtml(angle)}：3候補の比較（価格・口コミは執筆時点。最新は商品ページ）</caption>
<thead><tr><th>タイプ</th><th>商品名</th><th>価格目安</th><th>口コミ</th><th>向いている人</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</div>`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildRichBody(angle, category, products, picks) {
  const catLabel = CATEGORY_LABELS[category] || "装備";
  const productList = products.filter((p) => p.productUrl || p.name);
  const comparisonHtml = productList.length >= 2 ? buildComparisonTableHtml(picks, angle) : "";

  return [
    {
      heading: `${angle}を買う前に決める3つのこと`,
      paragraphs: [
        `${angle}は「安いから」「評価が高いから」だけで選ぶと、使わない定位置になりがちです。元自衛官目線では、置き場所・使用頻度・お手入れの3点を先に決めます。`,
        `${catLabel}として使うなら、毎日の導線に入るかどうかが最優先。週1回しか触らないものは、どれだけ高機能でも優先度は下がります。`
      ],
      bullets: [
        "どの場面で使うか（平日夜／週末／外出前など）",
        "置き場所のサイズ上限",
        "買い替え周期（1年未満ならコスパ重視）"
      ]
    },
    {
      heading: "安いもの・高いもの、どう使い分けるか",
      paragraphs: [
        `同じ「${angle}」でも、1000円台と5000円台では素材・サイズ・付属品が変わります。安いものは「試し買い・予備」、高いものは「毎日使う本命」に向きます。`,
        "3候補はコスパ・バランス・こだわりの順で並べています。全部揃える必要はなく、一番つらい場面に効く1つからで十分です。"
      ]
    },
    {
      heading: "3商品の比較表",
      paragraphs: ["下表は執筆時点の目安です。セール・クーポンで変動するため、リンク先で総額を確認してください。"],
      rawHtml: comparisonHtml
    },
    {
      heading: "実際の使用イメージ（1日の流れ）",
      paragraphs: [
        `朝：${angle}が定位置にあるかだけ確認（30秒）。探す時間が消えると、出かける前のストレスが減ります。`,
        `夜：帰宅後の片付け・充電・準備のどこかで1回触る。毎日触らないものは、導線から外すか買い替えを検討。`,
        "週末：一度だけお手入れ・サイズ感をチェック。合わないと感じたら、同じ記事内の別候補と比較。"
      ]
    },
    {
      heading: "よくある失敗と回避策",
      paragraphs: [
        "失敗①：レビュー星だけ見てサイズを確認しない → 商品ページの寸法・重量をメモする。",
        "失敗②：送料を見ずに最安値を選ぶ → カートで総額比較する。",
        "失敗③：一度使わず放置 → 届いた週に必ず1回試す。"
      ],
      bullets: ["低評価コメントを3件読む", "返品条件を確認", "似た商品を2つまでに絞る"]
    }
  ].filter((s) => s.rawHtml || s.paragraphs?.length);
}

function buildFaq(angle) {
  return [
    {
      q: `${angle}はいつ買うのがよい？`,
      a: "生活のどこかで毎週イラッとしている場面があるなら、その週に買うのが早いです。セール待ちより、ストレスが続く期間を短くする方が得です。"
    },
    {
      q: "1個だけならどれ？",
      a: "迷ったらコスパ重視の候補から。合わなければ返品・買い替えを前提に、バランス型へ。"
    },
    {
      q: "楽天以外と比較すべき？",
      a: "ポイント・送料・届く日数で差が出ます。同じ型番なら総額で比較し、違う型番ならスペック表の数値で比べてください。"
    }
  ];
}

function estimateReadTime(article) {
  const text = JSON.stringify(article);
  const chars = [...text.replace(/[^\u3040-\u30ff\u4e00-\u9fff]/g, "")].length;
  return `${Math.max(8, Math.min(15, Math.ceil(chars / 450)))}分`;
}

function buildArticleFromQueue(queueItem, products) {
  const angle = queueItem.angle || queueItem.keywords?.[0] || "装備";
  const okProducts = products.filter((p) => p.productUrl && !p.error);

  const sorted = [...okProducts].sort((a, b) => (a.price || 999999) - (b.price || 999999));
  let picks = sorted.slice(0, 3).map((p, i) => buildRichPick(p, i, angle, sorted, queueItem.category));

  while (picks.length < 3) {
    const kw = queueItem.keywords[picks.length] || angle;
    picks.push(
      buildRichPick(
        { keyword: kw, name: kw, productUrl: "", specs: [], reviewCount: 0 },
        picks.length,
        angle,
        sorted,
        queueItem.category
      )
    );
  }

  const body = buildRichBody(angle, queueItem.category, sorted.length ? sorted : products, picks);
  const faq = buildFaq(angle);
  body.push({
    heading: "よくある質問",
    paragraphs: faq.map((f) => `Q. ${f.q} A. ${f.a}`)
  });

  const article = {
    id: queueItem.id,
    title: queueItem.title,
    category: queueItem.category,
    date: queueItem.date || new Date().toISOString().slice(0, 10),
    summary: queueItem.summary,
    introParagraphs: [
      `「${angle}」を探していると、似た商品が多すぎて決めきれないことがあります。元自衛官目線では、スペックの多さより、毎日の導線に入るかどうかで選びます。`,
      `この記事では楽天市場の候補3つを、価格帯・口コミ・使用例つきで比較しました。気になったものはリンク先で最新価格と在庫を確認してください。`
    ],
    forAudience: [
      `${angle}をそろそろ買いたい人`,
      `${CATEGORY_LABELS[queueItem.category] || "装備"}を比較検討している人`,
      "失敗したくないが、候補を絞りたい人"
    ],
    body,
    picks,
    conclusionParagraphs: [
      `${angle}は3つ全部いらない。コスパ重視→バランス型→こだわり派の順で、自分の使用頻度に合う1つを選ぶのが続きやすいです。`,
      "購入前に比較表と使用例をもう一度見て、低評価レビューだけチェックしてからカートへ進んでください。"
    ],
    relatedArticleIds: queueItem.relatedArticleIds || []
  };
  article.readTime = estimateReadTime(article);
  return article;
}

function enrichExistingArticle(article, products) {
  const angle = angleFromArticle(article);
  const queueLike = {
    id: article.id,
    title: article.title,
    category: article.category,
    angle,
    keywords: [angle, `${angle} おすすめ`, `${angle} 人気`],
    summary: article.summary,
    date: article.date,
    relatedArticleIds: article.relatedArticleIds || []
  };
  const merged = buildArticleFromQueue(queueLike, products);
  return {
    ...article,
    ...merged,
    date: article.date,
    id: article.id,
    dateModified: new Date().toISOString().slice(0, 10)
  };
}

module.exports = {
  buildArticleFromQueue,
  enrichExistingArticle,
  buildRichPick,
  CATEGORY_LABELS
};
