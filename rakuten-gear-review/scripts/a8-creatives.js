/**
 * A8.net 広告フラグメント（サイトが発行されたHTMLのまま保持）。
 * 差し替え時はフラグメント全文を置換してください。
 */
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
`
];

/** フラグメント5はマツキヨ／日用品寄りテキスト。記事との相性づけに利用 */
const MID_BY_ARTICLE_ID = {
  // 寮・家事・衛生テーマ
  "dorm-life-useful-7": 5,
  "messy-room-cleanup-7": 5,
  "solo-man-first-kit": 5,
  "life-useful-goods-10": 5,
  "heavy-household-online-stock": 5,
  "dorm-solo-storage": 0,
  "solo-first-room-gear": 5,
  "toilet-light-disaster": 12,

  // 車・ツーリング
  "car-useful-gear-7": 14,
  "bike-small-comfort-7": 8,
  "bike-trip-gear": 3,
  "touring-rain-gear": 8,

  // デスク・PC
  "desk-messy-man-organize-7": 7,
  "pc-desk-cable-cleanup": 10,

  // 防災・非常・持ち出し
  "disaster-helpful-gear-7": 6,
  "home-disaster-kit": 11,
  "recovery-gear-ex-sdf": 6,

  // メンズ・総合レビュー
  "travel-light-packing-7": 11,
  "rakuten-shopping-mistakes-less": 13,
  "rakuten-gear-how-to-choose": 13,

  // ホーム／筋トレ
  "home-training-gear": 13,
  "entry-home-training": 13,

  // 休眠・来客（防災×日常）
  "nuuca-nuucasleep-guest-disaster": 6
};

const FOOT_BY_ARTICLE_ID = {
  "heavy-household-online-stock": 6,
  "dorm-life-useful-7": 6,
  "car-useful-gear-7": 15,
  "bike-small-comfort-7": 10,
  "desk-messy-man-organize-7": 8,
  "messy-room-cleanup-7": 0,
  "disaster-helpful-gear-7": 11,
  "rakuten-shopping-mistakes-less": 4,
  "solo-man-first-kit": 0,
  "recovery-gear-ex-sdf": 11,
  "travel-light-packing-7": 1,
  "nuuca-nuucasleep-guest-disaster": 6,

  "life-useful-goods-10": 6,
  "dorm-solo-storage": 2,
  "bike-trip-gear": 10,
  "home-training-gear": 9,
  "home-disaster-kit": 11,
  "pc-desk-cable-cleanup": 9,
  "entry-home-training": 4,
  "solo-first-room-gear": 0,
  "touring-rain-gear": 10,
  "toilet-light-disaster": 6,
  "rakuten-gear-how-to-choose": 9
};

const SIDEBAR_BY_ARTICLE_ID = {
  "heavy-household-online-stock": 12,
  "dorm-life-useful-7": 2,
  "car-useful-gear-7": 12,
  "bike-small-comfort-7": 3,
  "desk-messy-man-organize-7": 10,
  "messy-room-cleanup-7": 13,
  "disaster-helpful-gear-7": 1,
  "rakuten-shopping-mistakes-less": 2,
  "solo-man-first-kit": 1,
  "recovery-gear-ex-sdf": 3,
  "travel-light-packing-7": 1,
  "nuuca-nuucasleep-guest-disaster": 2,

  "life-useful-goods-10": 1,
  "dorm-solo-storage": 2,
  "bike-trip-gear": 1,
  "home-training-gear": 3,
  "home-disaster-kit": 13,
  "pc-desk-cable-cleanup": 10,
  "entry-home-training": 12,
  "solo-first-room-gear": 2,
  "touring-rain-gear": 3,
  "toilet-light-disaster": 1,
  "rakuten-gear-how-to-choose": 13
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

function midCreativeIndex(articleId) {
  if (MID_BY_ARTICLE_ID[articleId] !== undefined) return clampIndex(MID_BY_ARTICLE_ID[articleId]);
  return fallbackIndex(`${articleId}:mid`);
}

function footCreativeIndex(articleId) {
  const mid = midCreativeIndex(articleId);
  let v;
  if (FOOT_BY_ARTICLE_ID[articleId] !== undefined) {
    v = clampIndex(FOOT_BY_ARTICLE_ID[articleId]);
  } else {
    v = fallbackIndex(`${articleId}:foot`);
  }
  let guard = 0;
  while (v === mid && guard < RAW_FRAGMENTS.length + 2) {
    v = clampIndex(v + 1);
    guard += 1;
  }
  return v;
}

function sidebarCreativeIndex(articleId) {
  if (SIDEBAR_BY_ARTICLE_ID[articleId] !== undefined) return clampIndex(SIDEBAR_BY_ARTICLE_ID[articleId]);
  return fallbackIndex(`${articleId}:sidebar`);
}

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
      homePool: HOME_TOP_CREATIVES,
      listPool: ARTICLE_LIST_ROTATION
    };
  },
  /** クリエイティブ5利用時のみリードをひと言足す */
  midUsesMatsukiyo(articleId) {
    return midCreativeIndex(articleId) === 5;
  }
};
