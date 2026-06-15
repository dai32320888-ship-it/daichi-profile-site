/**
 * A8.net 広告フラグメント（サイトが発行されたHTMLのまま保持）。
 * 差し替え時はフラグメント全文を置換してください。
 */
const fs = require("fs");
const path = require("path");

const RAW_FRAGMENTS = [
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+53DJ3M+4X1W+5ZMCH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www28.a8.net/svt/bgt?aid=260509489308&wid=001&eno=01&mid=s00000022946001006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B3MEP+53DJ3M+4X1W+5ZMCH" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+4ZSXGY+14CS+64RJ5" rel="nofollow">
<img border="0" width="125" height="125" alt="" src="https://www24.a8.net/svt/bgt?aid=260509489302&wid=001&eno=01&mid=s00000005230001030000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=4B3MEP+4ZSXGY+14CS+64RJ5" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+57JKC2+5UFU+5Z6WX" rel="nofollow">
<img border="0" width="120" height="60" alt="" src="https://www21.a8.net/svt/bgt?aid=260509489315&wid=001&eno=01&mid=s00000027273001004000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B3MEP+57JKC2+5UFU+5Z6WX" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+584ZXU+5V8G+5Z6WX" rel="nofollow">
<img border="0" width="100" height="100" alt="" src="https://www26.a8.net/svt/bgt?aid=260509489316&wid=001&eno=01&mid=s00000027376001004000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=4B3MEP+584ZXU+5V8G+5Z6WX" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+50ED2Q+3RK+2TWC6P" rel="nofollow">
<img border="0" width="468" height="60" alt="" src="https://www22.a8.net/svt/bgt?aid=260509489303&wid=001&eno=01&mid=s00000000488017115000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4B3MEP+50ED2Q+3RK+2TWC6P" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5EORLE+5QFO+5YJRM" rel="nofollow">クーポン使用可能！かさばる・重たいなど、お店で買いづらいものをオンラインストアでお得に。【マツキヨココカラオンラインストア】</a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4B3MEP+5EORLE+5QFO+5YJRM" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+59XAR6+5TB0+5ZMCH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=260509489319&wid=001&eno=01&mid=s00000027126001006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=4B3MEP+59XAR6+5TB0+5ZMCH" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5GH2EQ+4EKC+631SX" rel="nofollow">
<img border="0" width="600" height="100" alt="" src="https://www27.a8.net/svt/bgt?aid=260509489330&wid=001&eno=01&mid=s00000020550001022000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4B3MEP+5GH2EQ+4EKC+631SX" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5BPLKI+2PEO+BXIYP" rel="nofollow">
<img border="0" width="320" height="50" alt="" src="https://www21.a8.net/svt/bgt?aid=260509489322&wid=001&eno=01&mid=s00000012624002004000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=4B3MEP+5BPLKI+2PEO+BXIYP" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5CB16A+2C9M+631SX" rel="nofollow">
<img border="0" width="468" height="60" alt="" src="https://www21.a8.net/svt/bgt?aid=260509489323&wid=001&eno=01&mid=s00000010921001022000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B3MEP+5CB16A+2C9M+631SX" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5CWGS2+4GZK+609HT" rel="nofollow">
<img border="0" width="320" height="50" alt="" src="https://www29.a8.net/svt/bgt?aid=260509489324&wid=001&eno=01&mid=s00000020864001009000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=4B3MEP+5CWGS2+4GZK+609HT" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5DHWDU+5HQC+BXB8X" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www21.a8.net/svt/bgt?aid=260509489325&wid=001&eno=01&mid=s00000025626002003000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=4B3MEP+5DHWDU+5HQC+BXB8X" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5Q0036+45DI+5ZU29" rel="nofollow">
<img border="0" width="120" height="60" alt="" src="https://www23.a8.net/svt/bgt?aid=260509489346&wid=001&eno=01&mid=s00000019359001007000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=4B3MEP+5Q0036+45DI+5ZU29" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+5QLFOY+4H72+6BEQ9" rel="nofollow">
<img border="0" width="300" height="200" alt="" src="https://www27.a8.net/svt/bgt?aid=260509489347&wid=001&eno=01&mid=s00000020891001061000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4B3MEP+5QLFOY+4H72+6BEQ9" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+61WO6Q+3W82+BY641" rel="nofollow">
<img border="0" width="468" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=260509489366&wid=001&eno=01&mid=s00000018173002007000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=4B3MEP+61WO6Q+3W82+BY641" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B3MEP+62I3SI+2UOE+2BH6Q9" rel="nofollow">
<img border="0" width="728" height="90" alt="" src="https://www20.a8.net/svt/bgt?aid=260509489367&wid=001&eno=01&mid=s00000013307014021000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4B3MEP+62I3SI+2UOE+2BH6Q9" alt="">
`,

  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+BRB7W2+50FK+5ZEMP" rel="nofollow">
<img border="0" width="468" height="60" alt="" src="https://www23.a8.net/svt/bgt?aid=260615823711&wid=001&eno=01&mid=s00000023384001005000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4B5WGF+BRB7W2+50FK+5ZEMP" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+BNQM9E+CO4+355UY9" rel="nofollow">
<img border="0" width="468" height="60" alt="" src="https://www22.a8.net/svt/bgt?aid=260615823705&wid=001&eno=01&mid=s00000001642019007000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4B5WGF+BNQM9E+CO4+355UY9" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+BLCVUA+3TA8+64RJ5" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www23.a8.net/svt/bgt?aid=260615823701&wid=001&eno=01&mid=s00000017792001030000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4B5WGF+BLCVUA+3TA8+64RJ5" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+B5A6IA+4XX0+5YJRM" rel="nofollow">懸垂器具なら★★TEDDYWORKS★★</a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4B5WGF+B5A6IA+4XX0+5YJRM" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+A65LTE+44RK+NU729" rel="nofollow">
<img border="0" width="100" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=260615823615&wid=001&eno=01&mid=s00000019280004004000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=4B5WGF+A65LTE+44RK+NU729" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+B0IPO2+1EQO+TV3PD" rel="nofollow">
<img border="0" width="234" height="60" alt="" src="https://www21.a8.net/svt/bgt?aid=260615823666&wid=001&eno=01&mid=s00000006576005016000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www18.a8.net/0.gif?a8mat=4B5WGF+B0IPO2+1EQO+TV3PD" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+AWCOFM+55CI+BXYE9" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www21.a8.net/svt/bgt?aid=260615823659&wid=001&eno=01&mid=s00000024021002006000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4B5WGF+AWCOFM+55CI+BXYE9" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+A0SPDE+50BY+60WN5" rel="nofollow">
<img border="0" width="125" height="125" alt="" src="https://www28.a8.net/svt/bgt?aid=260615823606&wid=001&eno=01&mid=s00000023371001012000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www16.a8.net/0.gif?a8mat=4B5WGF+A0SPDE+50BY+60WN5" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+9ZLU5U+4TLQ+699KH" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www20.a8.net/svt/bgt?aid=260615823604&wid=001&eno=01&mid=s00000022499001051000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4B5WGF+9ZLU5U+4TLQ+699KH" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+9YEYYA+4NJ4+6GRMP" rel="nofollow">
<img border="0" width="336" height="280" alt="" src="https://www26.a8.net/svt/bgt?aid=260615823602&wid=001&eno=01&mid=s00000021712001086000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=4B5WGF+9YEYYA+4NJ4+6GRMP" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+9XTJCI+328C+1HNSR5" rel="nofollow">
<img border="0" width="468" height="60" alt="" src="https://www23.a8.net/svt/bgt?aid=260615823601&wid=001&eno=01&mid=s00000014286009013000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4B5WGF+9XTJCI+328C+1HNSR5" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+9JJ4TU+5VK4+5YZ75" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www24.a8.net/svt/bgt?aid=260615823577&wid=001&eno=01&mid=s00000027418001003000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=4B5WGF+9JJ4TU+5VK4+5YZ75" alt="">`,
  `<a href="https://px.a8.net/svt/ejp?a8mat=4B5WGF+9Q2WHE+5HQC+5YZ75" rel="nofollow">
<img border="0" width="300" height="250" alt="" src="https://www20.a8.net/svt/bgt?aid=260615823588&wid=001&eno=01&mid=s00000025626001003000&mc=1"></a>
<img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=4B5WGF+9Q2WHE+5HQC+5YZ75" alt="">`,
];

/** フラグメント5はマツキヨ／日用品寄りテキスト。記事との相性づけに利用 */
const MID_BY_ARTICLE_ID = {
  // 寮・家事・衛生テーマ
  "dorm-life-useful-7": 28,
  "messy-room-cleanup-7": 28,
  "solo-man-first-kit": 28,
  "life-useful-goods-10": 28,
  "heavy-household-online-stock": 28,
  "dorm-solo-storage": 28,
  "solo-first-room-gear": 28,
  "toilet-light-disaster": 18,

  // 車・ツーリング
  "car-useful-gear-7": 21,
  "bike-small-comfort-7": 23,
  "bike-trip-gear": 23,
  "touring-rain-gear": 23,

  // デスク・PC
  "desk-messy-man-organize-7": 17,
  "pc-desk-cable-cleanup": 17,

  // 防災・非常・持ち出し
  "disaster-helpful-gear-7": 18,
  "home-disaster-kit": 18,
  "recovery-gear-ex-sdf": 18,

  // メンズ・総合レビュー
  "travel-light-packing-7": 18,
  "rakuten-shopping-mistakes-less": 28,
  "rakuten-gear-how-to-choose": 17,

  // ホーム／筋トレ
  "home-training-gear": 19,
  "entry-home-training": 19,

  // 休眠・来客（防災×日常）
  "nuuca-nuucasleep-guest-disaster": 18
};

/** カテゴリ別デフォルト（auto-p 等の未個別マップ記事向け） */
const CATEGORY_MID = {
  life: 28,
  solo: 28,
  disaster: 18,
  car: 21,
  bike: 23,
  "pc-ai": 17,
  training: 19,
  game: 27
};
const CATEGORY_FOOT = {
  life: 16,
  solo: 16,
  disaster: 24,
  car: 26,
  bike: 10,
  "pc-ai": 16,
  training: 22,
  game: 27
};
const CATEGORY_SIDEBAR = {
  life: 2,
  solo: 2,
  disaster: 25,
  car: 12,
  bike: 20,
  "pc-ai": 10,
  training: 3,
  game: 0
};

const FOOT_BY_ARTICLE_ID = {
  "heavy-household-online-stock": 16,
  "dorm-life-useful-7": 16,
  "car-useful-gear-7": 26,
  "bike-small-comfort-7": 26,
  "desk-messy-man-organize-7": 16,
  "messy-room-cleanup-7": 16,
  "disaster-helpful-gear-7": 24,
  "rakuten-shopping-mistakes-less": 16,
  "solo-man-first-kit": 16,
  "recovery-gear-ex-sdf": 24,
  "travel-light-packing-7": 24,
  "nuuca-nuucasleep-guest-disaster": 24,

  "life-useful-goods-10": 16,
  "dorm-solo-storage": 16,
  "bike-trip-gear": 26,
  "home-training-gear": 22,
  "home-disaster-kit": 24,
  "pc-desk-cable-cleanup": 16,
  "entry-home-training": 22,
  "solo-first-room-gear": 16,
  "touring-rain-gear": 26,
  "toilet-light-disaster": 24,
  "rakuten-gear-how-to-choose": 16
};

const SIDEBAR_BY_ARTICLE_ID = {
  "heavy-household-online-stock": 20,
  "dorm-life-useful-7": 20,
  "car-useful-gear-7": 20,
  "bike-small-comfort-7": 20,
  "desk-messy-man-organize-7": 20,
  "messy-room-cleanup-7": 25,
  "disaster-helpful-gear-7": 25,
  "rakuten-shopping-mistakes-less": 20,
  "solo-man-first-kit": 25,
  "recovery-gear-ex-sdf": 20,
  "travel-light-packing-7": 25,
  "nuuca-nuucasleep-guest-disaster": 25,

  "life-useful-goods-10": 25,
  "dorm-solo-storage": 20,
  "bike-trip-gear": 20,
  "home-training-gear": 20,
  "home-disaster-kit": 25,
  "pc-desk-cable-cleanup": 20,
  "entry-home-training": 20,
  "solo-first-room-gear": 20,
  "touring-rain-gear": 20,
  "toilet-light-disaster": 25,
  "rakuten-gear-how-to-choose": 20
};

function clampIndex(index) {
  const n = RAW_FRAGMENTS.length;
  const i = Math.floor(Number(index));
  return ((i % n) + n) % n;
}

function fallbackIndex(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % RAW_FRAGMENTS.length;
}

function categoryMidIndex(categoryId) {
  if (categoryId && CATEGORY_MID[categoryId] !== undefined) return clampIndex(CATEGORY_MID[categoryId]);
  return null;
}

function categoryFootIndex(categoryId) {
  if (categoryId && CATEGORY_FOOT[categoryId] !== undefined) return clampIndex(CATEGORY_FOOT[categoryId]);
  return null;
}

function categorySidebarIndex(categoryId) {
  if (categoryId && CATEGORY_SIDEBAR[categoryId] !== undefined) return clampIndex(CATEGORY_SIDEBAR[categoryId]);
  return null;
}

function midCreativeIndex(articleId, categoryId) {
  const id = String(articleId);
  if (MID_BY_ARTICLE_ID[id] !== undefined) return clampIndex(MID_BY_ARTICLE_ID[id]);
  const byCat = categoryMidIndex(categoryId);
  if (byCat !== null) return byCat;
  return fallbackIndex(`${id}:mid`);
}

function footCreativeIndex(articleId, categoryId) {
  const id = String(articleId);
  const mid = midCreativeIndex(id, categoryId);
  let v;
  if (FOOT_BY_ARTICLE_ID[id] !== undefined) {
    v = clampIndex(FOOT_BY_ARTICLE_ID[id]);
  } else {
    const byCat = categoryFootIndex(categoryId);
    v = byCat !== null ? byCat : fallbackIndex(`${id}:foot`);
  }
  let guard = 0;
  while (v === mid && guard < RAW_FRAGMENTS.length + 2) {
    v = clampIndex(v + 1);
    guard += 1;
  }
  return v;
}

function sidebarCreativeIndex(articleId, categoryId) {
  const id = String(articleId);
  if (SIDEBAR_BY_ARTICLE_ID[id] !== undefined) return clampIndex(SIDEBAR_BY_ARTICLE_ID[id]);
  const byCat = categorySidebarIndex(categoryId);
  if (byCat !== null) return byCat;
  return fallbackIndex(`${id}:sidebar`);
}

function applyAutoArticleCategoryMaps() {
  const extraPath = path.join(__dirname, "..", "data", "extra-articles.json");
  if (!fs.existsSync(extraPath)) return;
  const extras = JSON.parse(fs.readFileSync(extraPath, "utf8"));
  for (const article of extras) {
    if (!article.id?.startsWith("auto-p") || !article.category) continue;
    const cat = article.category;
    if (MID_BY_ARTICLE_ID[article.id] === undefined && CATEGORY_MID[cat] !== undefined) {
      MID_BY_ARTICLE_ID[article.id] = CATEGORY_MID[cat];
    }
    if (FOOT_BY_ARTICLE_ID[article.id] === undefined && CATEGORY_FOOT[cat] !== undefined) {
      FOOT_BY_ARTICLE_ID[article.id] = CATEGORY_FOOT[cat];
    }
    if (SIDEBAR_BY_ARTICLE_ID[article.id] === undefined && CATEGORY_SIDEBAR[cat] !== undefined) {
      SIDEBAR_BY_ARTICLE_ID[article.id] = CATEGORY_SIDEBAR[cat];
    }
  }
}

applyAutoArticleCategoryMaps();

/** ホーム画面上部のおすすめ枠 */
const HOME_TOP_CREATIVES = [15, 7, 4];

/** 記事一覧ページ末尾の枠にローテーション */
const ARTICLE_LIST_ROTATION = [14, 6, 0];

/** 複数広告サイズがあるときプールから安定して1つ選ぶ */
function pickCreativeIndexFromPool(pool, seed) {
  if (!pool || pool.length === 0) return 0;
  const idx = fallbackIndex(seed) % pool.length;
  return clampIndex(pool[idx]);
}

module.exports = {
  RAW_FRAGMENTS,
  RAW_COUNT: RAW_FRAGMENTS.length,
  midCreativeIndex,
  footCreativeIndex,
  sidebarCreativeIndex,
  homeTopCreativeIndexes: HOME_TOP_CREATIVES,
  pickCreativeIndexFromPool,
  articleListCreativePool: ARTICLE_LIST_ROTATION,
  sidebarCreativeIndexForList(seed) {
    return pickCreativeIndexFromPool(ARTICLE_LIST_ROTATION, `listSidebar:${seed}`);
  },
  /** ブラウザ用にマップのみJSON化するときに使う */
  exportBrowserRegistry() {
    return {
      fragments: RAW_FRAGMENTS,
      midMap: MID_BY_ARTICLE_ID,
      footMap: FOOT_BY_ARTICLE_ID,
      sidebarMap: SIDEBAR_BY_ARTICLE_ID,
      categoryMid: CATEGORY_MID,
      categoryFoot: CATEGORY_FOOT,
      categorySidebar: CATEGORY_SIDEBAR,
      homePool: HOME_TOP_CREATIVES,
      listPool: ARTICLE_LIST_ROTATION
    };
  },
  /** クリエイティブ5利用時のみリードをひと言足す */
  midUsesMatsukiyo(articleId, categoryId) {
    return midCreativeIndex(articleId, categoryId) === 5;
  },
  CATEGORY_MID,
  CATEGORY_FOOT,
  CATEGORY_SIDEBAR
};
