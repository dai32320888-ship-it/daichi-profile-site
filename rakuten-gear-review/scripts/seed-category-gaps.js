#!/usr/bin/env node
/**
 * 各カテゴリ20記事以上になるよう、不足分のキーワードを article-queue.json に追加
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const queuePath = path.join(root, "data", "article-queue.json");
const appPath = path.join(root, "app.js");
const extraPath = path.join(root, "data", "extra-articles.json");
const TARGET_PER_CATEGORY = 20;

const CATEGORY_KEYWORDS = {
  life: [
    "粘着フック 強力 壁",
    "玄関 靴べら マグネット",
    "キッチン シンク 水切り",
    "浴室 ラック ステンレス",
    "洗濯 物干し 室内"
  ],
  "pc-ai": [
    "モニターアーム VESA",
    "デスクマット 大判",
    "キーボード 静音 ワイヤレス",
    "Webカメラ 会議用",
    "USBハブ 電源付き",
    "ノートPCスタンド 折りたたみ",
    "腰当てクッション オフィス",
    "フットレスト デスク",
    "ケーブルボックス 配線隠し",
    "デスクライト LED 調光",
    "マウスパッド リストレスト",
    "ブルーライトカットメガネ PC",
    "ヘッドセット テレワーク",
    "卓上収納 引き出し",
    "モニター台 2段",
    "昇降デスク 電動 小型",
    "タブレットスタンド 角度調整",
    "イヤホン ノイズキャンセリング 在宅",
    "スタンディングデスク 高さ調整",
    "マウス 静音 ワイヤレス",
    "モバイルモニター 15.6",
    "プリンター 小型 A4",
    "ノイズキャンセリングイヤホン 在宅"
  ],
  training: [
    "ダンベル 可変式 軽量",
    "懸垂棒 ドア 設置",
    "腹筋ローラー 初心者",
    "ヨガマット 厚手 10mm",
    "トレーニングチューブ セット",
    "プッシュアップバー 家",
    "エクササイズバイク 折りたたみ",
    "プロテイン シェイカー",
    "腹筋ベンチ 折りたたみ",
    "リストラップ 筋トレ",
    "ランニングポーチ ウエスト",
    "フォームローラー 筋膜リリース",
    "プルアップバー 壁",
    "ケトルベル 8kg",
    "ストレッチバンド セット",
    "グリップ強化 器具"
  ],
  bike: [
    "バイク用 レインウェア 上下",
    "バイク インナーグローブ",
    "ツーリングバッグ 容量",
    "バイクナビ スマホホルダー",
    "バイク チェーンケース",
    "バイク ウインドシールド",
    "バイク ハンドルカバー 冬",
    "バイク ヘルメット シールド",
    "バイク タンクバッグ マグネット",
    "バイク ギアバッグ",
    "バイク用 膝当て",
    "バイク ウォーマーグローブ",
    "バイク 冷却ベスト 夏",
    "バイク スマホ充電 USB",
    "バイク 盗難防止 ロック",
    "バイク インナー 防水",
    "ツーリングマット 車中泊"
  ],
  disaster: [
    "防災ラジオ 手回し 充電",
    "救急セット 家庭用",
    "防災ヘルメット 折りたたみ",
    "防災ズボン 敷布",
    "長期保存水 2L",
    "加熱式 非常食",
    "防災トイレ 凝固剤",
    "防災フェイスカバー",
    "耐火袋 書類",
    "防災 懐中電灯 LED",
    "防災 ブルーシート",
    "防災 軍手 セット",
    "防災 ホイッスル",
    "防災 ヘッドライト",
    "防災 マスク セット",
    "防災 乾パン",
    "防災 キャスター付きリュック",
    "防災 アルミブランケット"
  ],
  solo: [
    "ワンルーム 間仕切り カーテン",
    "一人暮らし 炊飯器 1合",
    "一人暮らし 電子レンジ 小型",
    "一人暮らし 布団 セット",
    "一人暮らし カーテン 遮光",
    "一人暮らし ゴミ箱 分別",
    "一人暮らし 延長コード タップ",
    "一人暮らし ハンガーラック",
    "一人暮らし 冷蔵庫 小型",
    "一人暮らし 掃除機 コードレス",
    "一人暮らし 体重計 体組成",
    "一人暮らし 加湿器 小型",
    "一人暮らし 全身鏡 スタンド",
    "一人暮らし 空気清浄機 小型",
    "一人暮らし シューズラック",
    "一人暮らし アイロン スチーマー",
    "一人暮らし カーテンレール"
  ],
  car: [
    "車 シートカバー 防水",
    "車載 クーラーボックス 12V",
    "車 タイヤ空気圧 ゲージ",
    "車中泊 マット 厚手",
    "車 コンソール 収納",
    "車 ダッシュボード マット",
    "車 サンシェード フロント",
    "車 芳香剤 消臭",
    "車載 インバーター 100V",
    "車 傾斜防止 ブロック",
    "車 スマホ ワイヤレス充電",
    "車 寒さ対策 ヒーター",
    "車 ドリンクホルダー 拡張",
    "車 トランク 収納ボックス",
    "車 バックカメラ ワイヤレス",
    "車 シガーソケット 分配",
    "車 エアコンフィルター",
    "車 ドライブレコーダー 360度",
    "車 シートクッション 腰痛",
    "車 タイヤチェーン 軽自動車",
    "車 ルームミラー 広角"
  ],
  game: [
    "Nintendo Switch ケース 有機EL",
    "PS5 縦置き スタンド",
    "ゲームコントローラー 充電ドック",
    "ゲーミングヘッドセット 有線",
    "HDMI ケーブル 2m 4K",
    "Switch プロコン",
    "ゲーム用 サムグリップ",
    "ゲーミングモニター 27インチ",
    "ゲーム機 収納 ラック",
    "コントローラー スティックキャップ",
    "携帯ゲーム機 液晶保護",
    "Steam Deck ケース",
    "ゲームソフト 収納ケース",
    "ゲーミングチェア コンパクト",
    "Switch ドック 純正",
    "ゲーム用 LANアダプター",
    "プレイステーション 充電スタンド",
    "レトロゲーム 本体",
    "ゲーム 冷却ファン ノートPC"
  ]
};

const CATEGORY_LABELS = {
  life: "生活",
  "pc-ai": "デスク",
  training: "筋トレ",
  bike: "バイク",
  disaster: "防災",
  solo: "一人暮らし",
  car: "車載",
  game: "ゲーム"
};

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

function articleTopicKey(article) {
  const fromTitle = article.title?.match(/「([^」]+)」/)?.[1]?.trim();
  if (fromTitle) return fromTitle;
  return String(article.id)
    .replace(/^auto-p\d+-/, "")
    .replace(/^gap-[^-]+-/, "")
    .replace(/-/g, " ");
}

function countByCategory() {
  const counts = Object.fromEntries(Object.keys(CATEGORY_KEYWORDS).map((c) => [c, 0]));
  const appSource = fs.readFileSync(appPath, "utf8");
  const sandbox = { console, window: {}, document: { querySelector() {} }, URLSearchParams, encodeURIComponent, String };
  vm.createContext(sandbox);
  vm.runInContext(`${appSource}\nthis.__D__ = { articles };`, sandbox);
  const all = [...sandbox.__D__.articles];
  if (fs.existsSync(extraPath)) all.push(...JSON.parse(fs.readFileSync(extraPath, "utf8")));
  const seen = new Set();
  for (const article of all) {
    const key = `${article.category}::${articleTopicKey(article)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (counts[article.category] !== undefined) counts[article.category]++;
  }
  return counts;
}

function slugFromKeyword(keyword, category) {
  const kw = keyword
    .replace(/[^\w\u3040-\u30ff\u4e00-\u9fff]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `gap-${category}-${kw}`;
}

function titleFrom(keyword) {
  return `元自衛官目線で選ぶ「${keyword}」：楽天で失敗しにくい選び方`;
}

function summaryFrom(keyword, category) {
  const catLabel = CATEGORY_LABELS[category] || "生活";
  return `${catLabel}シーンで使える「${keyword}」を、用途・置き場所・続けやすさの観点で整理します。`;
}

function main() {
  const existing = loadExistingIds();
  const counts = countByCategory();
  const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath, "utf8")) : { items: [] };
  const queuedIds = new Set(queue.items.map((i) => i.id));
  const pendingByCat = {};
  queue.items
    .filter((i) => i.status === "pending")
    .forEach((i) => {
      pendingByCat[i.category] = (pendingByCat[i.category] || 0) + 1;
    });

  const queuedTopics = new Set(
    queue.items
      .filter((i) => i.status === "pending")
      .map((i) => `${i.category}::${i.angle || i.keywords?.[0] || ""}`)
  );

  let added = 0;
  const report = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const current = counts[category] || 0;
    const pending = pendingByCat[category] || 0;
    const need = Math.max(0, TARGET_PER_CATEGORY - current - pending);
    if (need <= 0) {
      report.push(`${category}: ${current}記事 + ${pending}待ち → OK`);
      continue;
    }

    let addedForCat = 0;
    for (const keyword of keywords) {
      if (addedForCat >= need) break;
      const topicKey = `${category}::${keyword}`;
      if (queuedTopics.has(topicKey)) continue;
      const id = slugFromKeyword(keyword, category);
      if (existing.has(id) || queuedIds.has(id)) continue;
      queue.items.push({
        id,
        sourcePostId: `GAP-${category.toUpperCase()}-${String(addedForCat + 1).padStart(2, "0")}`,
        status: "pending",
        title: titleFrom(keyword),
        category,
        keywords: [keyword, `${keyword} 人気`, `${keyword} おすすめ`],
        angle: keyword,
        summary: summaryFrom(keyword, category)
      });
      queuedIds.add(id);
      queuedTopics.add(topicKey);
      addedForCat++;
      added++;
    }
    report.push(`${category}: ${current}記事 + ${pending}待ち → +${addedForCat}追加 (目標${TARGET_PER_CATEGORY})`);
  }

  fs.mkdirSync(path.dirname(queuePath), { recursive: true });
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2), "utf8");
  console.log(report.join("\n"));
  console.log(`\n+${added} items → queue total ${queue.items.length} (${queue.items.filter((i) => i.status === "pending").length} pending)`);
}

main();
