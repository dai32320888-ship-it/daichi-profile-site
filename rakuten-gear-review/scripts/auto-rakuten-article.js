#!/usr/bin/env node
/**
 * キューから1件（既定）取り出し → 楽天検索で商品URL取得 → extra-articles.json に追記
 * 用法: node scripts/auto-rakuten-article.js [--max=1] [--dry-run] [--seed]
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { searchProducts } = require("./lib/rakuten-search");

const root = path.resolve(__dirname, "..");
const queuePath = path.join(root, "data", "article-queue.json");
const extraPath = path.join(root, "data", "extra-articles.json");
const appPath = path.join(root, "app.js");
const logPath = path.join(root, "data", "auto-article-log.json");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const maxCount = Number((args.find((a) => a.startsWith("--max=")) || "--max=1").split("=")[1]) || 1;

function todayInJapan() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const v = Object.fromEntries(p.map((x) => [x.type, x.value]));
  return `${v.year}-${v.month}-${v.day}`;
}

function loadExistingIds() {
  const ids = new Set();
  const appSource = fs.readFileSync(appPath, "utf8");
  const sandbox = { console, window: {}, document: { querySelector() {} }, URLSearchParams, encodeURIComponent, String };
  vm.createContext(sandbox);
  vm.runInContext(`${appSource}\nthis.__D__ = { articles };`, sandbox);
  sandbox.__D__.articles.forEach((a) => ids.add(a.id));
  if (fs.existsSync(extraPath)) {
    JSON.parse(fs.readFileSync(extraPath, "utf8")).forEach((a) => ids.add(a.id));
  }
  return ids;
}

function categoryName(id) {
  const names = { life: "生活装備", "pc-ai": "PC・AI作業環境", training: "筋トレ装備", bike: "バイク旅装備", disaster: "防災装備", solo: "一人暮らし準備", car: "車・移動装備", game: "ゲーム機・周辺" };
  return names[id] || "装備";
}

function buildArticle(queueItem, products) {
  const date = todayInJapan();
  const ym = date.slice(0, 7);
  const picks = products
    .filter((p) => p.productUrl && !p.error)
    .slice(0, 3)
    .map((p, i) => ({
      name: p.name.slice(0, 80),
      category: queueItem.category,
      intro: [`${queueItem.angle}の候補${i + 1}。楽天の商品ページで価格・レビュー・在庫を確認してから選んでください。`],
      scenes: [`${queueItem.angle}を整えたいとき`, "比較検討のたたき台", "定位置づけの候補"],
      caution: ["サイズ・素材・レビュー件数は必ず商品ページで確認", "体感には個人差があります"],
      rakutenProductUrl: p.productUrl,
      affiliateUrl: p.affiliateUrl,
      imageUrl: p.imageUrl || undefined
    }));

  while (picks.length < 3) {
    const kw = queueItem.keywords[picks.length] || queueItem.keywords[0];
    picks.push({
      name: kw,
      category: queueItem.category,
      intro: [`「${kw}」で楽天を検索したときの候補です。商品によって仕様が違うので、ページで絞り込んでください。`],
      scenes: [queueItem.angle, "候補を広く見たいとき"],
      caution: ["検索結果の上位から自分の条件に合うか確認"],
      rakutenSearchKeyword: kw
    });
  }

  return {
    id: queueItem.id,
    title: queueItem.title,
    category: queueItem.category,
    date,
    readTime: `${6 + picks.length}分`,
    summary: queueItem.summary,
    introParagraphs: [
      `${queueItem.angle}は、買う前に「どの場面で使うか」を決めておくと失敗しにくいです。元自衛官目線では、派手さより毎日の導線に入るかを優先します。`,
      `この記事では楽天市場で探しやすい候補を${picks.length}つに整理しました。価格・在庫・レビューはリンク先で最新情報を確認してください。`
    ],
    forAudience: [`${queueItem.angle}を整えたい人`, `${categoryName(queueItem.category)}に関心がある人`, "楽天で比較しながら選びたい人"],
    body: [
      {
        heading: `${queueItem.angle}を選ぶときの基準`,
        paragraphs: [
          "まず置き場所と使用頻度を決めます。毎日使わないものは、たとえ評価が高くても優先度は下がります。",
          "次に、サイズ・重量・お手入れのしやすさを商品ページで確認します。写真だけで決めないのが鉄則です。"
        ],
        bullets: ["用途を1行で言えるか", "毎日の導線に入るか", "レビューで失敗例がないか"]
      },
      {
        heading: "楽天で比較するときのチェックリスト",
        paragraphs: [
          "送料・クーポン・ポイントはタイミングで変わります。気になった商品は一度カートに入れて、総額を比較するのが確実です。",
          "似た商品が複数あるときは、レビュー件数と星の内訳（特に低評価の理由）を読むと見極めやすくなります。"
        ]
      }
    ],
    picks,
    conclusionParagraphs: [
      `${queueItem.angle}は全部一度に揃えなくて大丈夫です。候補の中で一番つらい場面に効きそうなものから1つ入れるのが続きやすいです。`
    ],
    relatedArticleIds: [],
    _auto: { sourcePostId: queueItem.sourcePostId, generatedAt: new Date().toISOString(), month: ym }
  };
}

function appendLog(entry) {
  const log = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, "utf8")) : [];
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log.slice(-200), null, 2), "utf8");
}

async function main() {
  if (args.includes("--seed")) {
    require("./seed-article-queue.js");
  }

  if (!fs.existsSync(queuePath)) {
    require("./seed-article-queue.js");
  }

  const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));
  const existing = loadExistingIds();
  const pending = queue.items.filter((i) => i.status === "pending" && !existing.has(i.id));
  if (!pending.length) {
    console.log("No pending queue items");
    return;
  }

  const extra = fs.existsSync(extraPath) ? JSON.parse(fs.readFileSync(extraPath, "utf8")) : [];
  let created = 0;

  for (const item of pending.slice(0, maxCount)) {
    console.log(`\n→ ${item.id}: ${item.title}`);
    const products = await searchProducts(item.keywords.slice(0, 3));
    const okProducts = products.filter((p) => p.productUrl);
    console.log(`  Rakuten hits: ${okProducts.length}/${item.keywords.length}`);

    const article = buildArticle(item, products);
    const { _auto, ...clean } = article;

    if (dryRun) {
      console.log("  [dry-run]", clean.id, clean.picks.map((p) => p.rakutenProductUrl || p.rakutenSearchKeyword).join(", "));
      continue;
    }

    extra.push(clean);
    item.status = "done";
    item.publishedAt = todayInJapan();
    item.articleUrl = `/article/${clean.id}/`;
    appendLog({ id: clean.id, title: clean.title, date: clean.date, products: okProducts.length, ..._auto });
    created++;
  }

  if (!dryRun && created > 0) {
    fs.writeFileSync(extraPath, JSON.stringify(extra, null, 2), "utf8");
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), "utf8");
    const fetch = require("child_process").spawnSync(process.execPath, [path.join(__dirname, "fetch-rakuten-images.js")], {
      cwd: root,
      encoding: "utf8"
    });
    console.log(fetch.status === 0 ? "  fetch-rakuten-images: OK" : "  fetch-rakuten-images: partial");
    console.log(`Created ${created} article(s) → extra-articles.json`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
