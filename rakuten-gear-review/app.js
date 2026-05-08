const categories = [
  { id: "life", name: "生活装備", description: "鍵、収納、家事など、毎日の小さな手間を減らす装備。" },
  { id: "pc-ai", name: "PC・AI作業環境", description: "デスク周りを整えて、長時間作業をラクにする装備。" },
  { id: "training", name: "筋トレ装備", description: "自宅でも続けやすい、省スペースな家トレ装備。" },
  { id: "bike", name: "バイク旅装備", description: "雨、積載、ナビの不安を減らすツーリング装備。" },
  { id: "disaster", name: "防災装備", description: "普段使いしながら、災害時にも役立つ備え。" },
  { id: "solo", name: "一人暮らし準備", description: "寮生活やワンルームで生活導線を整える初期装備。" },
  { id: "car", name: "車・移動装備", description: "車載、車中泊、移動中の小さな不便を減らす装備。" }
];

const RAKUTEN_AFFILIATE_PATH = "53663d8f.6b4c8828.53663d90.626681b4";

function rakutenAffiliateUrl(rakutenProductUrl) {
  return `https://hb.afl.rakuten.co.jp/ichiba/${RAKUTEN_AFFILIATE_PATH}/?pc=${encodeURIComponent(rakutenProductUrl)}&link_type=hybrid_url`;
}

function rakutenSearchAffiliateUrl(keyword) {
  const url = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  return rakutenAffiliateUrl(url);
}

function placeholderImage(label, categoryId) {
  const category = getCategory(categoryId)?.name || "装備レビュー";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
      <rect width="640" height="420" fill="#f4f4f2"/>
      <rect x="34" y="34" width="572" height="352" rx="22" fill="#ffffff" stroke="#d9dbd8" stroke-width="2"/>
      <path d="M34 116h572" stroke="#d9dbd8" stroke-width="2"/>
      <rect x="74" y="72" width="88" height="16" fill="#596246"/>
      <rect x="74" y="156" width="492" height="126" rx="18" fill="#e5e6df"/>
      <rect x="112" y="190" width="130" height="58" rx="10" fill="#596246" opacity=".85"/>
      <rect x="270" y="190" width="258" height="16" rx="8" fill="#858b78"/>
      <rect x="270" y="224" width="204" height="16" rx="8" fill="#a8ad9c"/>
      <text x="74" y="324" fill="#17191b" font-family="Arial, sans-serif" font-size="28" font-weight="700">${escapeSvg(label)}</text>
      <text x="74" y="356" fill="#656b70" font-family="Arial, sans-serif" font-size="18">${escapeSvg(category)}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

const products = [
  {
    id: "tower-key-hook",
    name: "tower マグネットキーフック",
    category: "life",
    description: "玄関に鍵の定位置を作れて、朝の鍵探しを減らせる。",
    recommendedFor: "鍵・印鑑・小物をよく探す人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/53663d8f.6b4c8828.53663d90.626681b4/?me_id=1227333&item_id=10014772&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Froomy%2Fcabinet%2F500cart_all%2F500cart_11g%2Fp5-4%2Fymz1082-mv01c-0_gt01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/53663d8f.6b4c8828.53663d90.626681b4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Froomy%2Fymz19aug12h28%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/roomy/ymz19aug12h28/",
    searchKeyword: "tower キーフック"
  },
  {
    id: "cable-tray",
    name: "ケーブルトレー デスク下",
    category: "pc-ai",
    description: "デスク下の配線をまとめて、作業場をスッキリさせられる。",
    recommendedFor: "PC周りのコードがごちゃついている人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/53664af0.0b5b44f4.53664af1.1d2db78c/?me_id=1245016&item_id=10019233&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fapricot-r%2Fcabinet%2Fyjtn%2F3605-a260.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/53664af0.0b5b44f4.53664af1.1d2db78c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fapricot-r%2F3605-a260%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/apricot-r/3605-a260/",
    searchKeyword: "ケーブルトレー デスク下"
  },
  {
    id: "folding-storage",
    name: "折りたたみ収納ボックス",
    category: "solo",
    description: "使わない時はたためて、衣類や小物をまとめやすい。",
    recommendedFor: "寮生活・一人暮らしで収納が少ない人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/53664e39.cb170390.53664e3a.664bed07/?me_id=1313357&item_id=10002010&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frisu-proshop%2Fcabinet%2Fimages%2Fgifu-pla%2F63567-5_01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/53664e39.cb170390.53664e3a.664bed07/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frisu-proshop%2F63567-5%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/risu-proshop/63567-5/",
    searchKeyword: "収納ボックス 折りたたみ"
  },
  {
    id: "adjustable-dumbbell",
    name: "可変式ダンベル20kg",
    category: "training",
    description: "重量を変えられるので、自宅トレの幅が広がる。",
    recommendedFor: "家で胸・肩・腕・背中を鍛えたい人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/536650bf.d2b24514.536650c0.dc25f41b/?me_id=1389930&item_id=10000112&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fsportsmonster%2Fcabinet%2Ffitness%2Fflex32-2_sl.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/536650bf.d2b24514.536650c0.dc25f41b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsportsmonster%2Fflex32-2%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/sportsmonster/flex32-2/",
    searchKeyword: "可変式ダンベル 20kg"
  },
  {
    id: "door-gym",
    name: "ドアジム・懸垂バー",
    category: "training",
    description: "省スペースで懸垂やぶら下がり運動ができる。",
    recommendedFor: "背中を鍛えたい人、ジムに行けない日も鍛えたい人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/53665236.0e717855.53665237.9e92ea9b/?me_id=1385432&item_id=10000026&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fdanimo%2Fcabinet%2F07640797%2Fs1009648.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/53665236.0e717855.53665237.9e92ea9b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fdanimo%2F8265139%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/danimo/8265139/",
    searchKeyword: "懸垂 ドアジム"
  },
  {
    id: "waterproof-touring-bag",
    name: "防水ツーリングバッグ",
    category: "bike",
    description: "雨の日でも着替えや荷物を濡らしにくい。",
    recommendedFor: "バイク旅・キャンプツーリングをする人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/536653dc.8d0dc42e.536653dd.95aafa2e/?me_id=1375910&item_id=10000121&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fflyingfish%2Fcabinet%2F06875362%2F60018-12.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/536653dc.8d0dc42e.536653dd.95aafa2e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fflyingfish%2F60018%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/flyingfish/60018/",
    searchKeyword: "バイク ツーリング 防水バッグ"
  },
  {
    id: "bike-phone-holder",
    name: "バイク用スマホホルダー",
    category: "bike",
    description: "スマホナビを確認しやすくなり、長距離移動のストレスを減らせる。",
    recommendedFor: "スマホナビを使ってツーリングする人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/536b130d.7e477911.536b130e.5632e1c6/?me_id=1386879&item_id=10000019&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fkaedear%2Fcabinet%2F09011477%2F09054788%2F09900870%2Fimgrc0115547176.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/536b130d.7e477911.536b130e.5632e1c6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkaedear%2Fkdr-m8s%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/kaedear/kdr-m8s/",
    searchKeyword: "バイク スマホホルダー 防水"
  },
  {
    id: "disaster-kit",
    name: "防災セット1人用",
    category: "disaster",
    description: "非常食・ライト・衛生用品などをまとめて準備できる。",
    recommendedFor: "一人暮らしで防災グッズをまだ揃えていない人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/53665544.a5447b14.53665545.f2faf1e1/?me_id=1346140&item_id=10000003&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_gold%2Frelieved-life%2Fbousai%2Fs-set%2F01%2FS01TOP.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/53665544.a5447b14.53665545.f2faf1e1/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frelieved-life%2Fre-l-bousai%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/relieved-life/re-l-bousai/",
    searchKeyword: "防災セット 1人用"
  },
  {
    id: "emergency-toilet",
    name: "簡易トイレ 防災用",
    category: "disaster",
    description: "災害時に一番困りやすいトイレ問題の備えになる。",
    recommendedFor: "最低限の防災備蓄を整えたい人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/536656ee.601828c8.536656ef.1bca0db8/?me_id=1322774&item_id=10000079&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Ftorreya-shop%2Fcabinet%2Ftoilet%2Fimgrc0104456288.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/536656ee.601828c8.536656ef.1bca0db8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftorreya-shop%2F100000041%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/torreya-shop/100000041/",
    searchKeyword: "簡易トイレ 防災 50回"
  },
  {
    id: "led-lantern",
    name: "LEDランタン 充電式",
    category: "disaster",
    description: "停電時やキャンプ、車中泊でも使いやすい明かり装備。",
    recommendedFor: "防災・アウトドア兼用で使えるライトがほしい人",
    imageUrl: "https://hbb.afl.rakuten.co.jp/hgb/53665820.0d3cdb8e.53665821.397363c3/?me_id=1317105&item_id=10000072&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fk-power%2Fcabinet%2F06552196%2F07119538%2Fimgrc0116175250.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
    affiliateUrl: "https://hb.afl.rakuten.co.jp/ichiba/53665820.0d3cdb8e.53665821.397363c3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fk-power%2Fur002%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D",
    rakutenProductUrl: "https://item.rakuten.co.jp/k-power/ur002/",
    searchKeyword: "LEDランタン 充電式 防災"
  }
];

const articles = [
  {
    id: "life-useful-goods-10",
    title: "元自衛官が選ぶ、生活がラクになる楽天便利グッズ10選",
    category: "life",
    date: "2026-05-03",
    readTime: "6分",
    summary: "玄関、デスク、収納を整えて、毎日の小さなストレスを減らす装備を紹介します。",
    productIds: ["tower-key-hook", "cable-tray", "folding-storage"],
    body: [
      {
        heading: "生活装備は、派手さより継続力",
        paragraphs: [
          "便利グッズは、買った瞬間のテンションよりも一週間後に効いてくるかが大事です。これは地味だけど、毎日の小さなストレスを消してくれる装備です。",
          "元自衛官目線で見ると、良い道具の条件は単純です。すぐ使える、場所を取らない、壊れにくい。この三つが揃うと、生活の段取りが一気に整います。"
        ],
        bullets: ["鍵の定位置を作る", "配線を床から浮かせる", "収納は出し入れのしやすさを優先する"]
      },
      {
        heading: "まずは玄関・机・収納を整える",
        paragraphs: [
          "鍵、ケーブル、日用品の置き場が決まると、部屋の散らかり方が変わります。毎日使う物ほど、定位置を決める効果は大きいです。",
          "収納は増やすより、出し入れしやすい形を選ぶのが大事です。使いにくい収納は、結局ただの障害物になります。"
        ]
      }
    ]
  },
  {
    id: "dorm-solo-storage",
    title: "寮生活・一人暮らしで本当に役立つ収納グッズ",
    category: "solo",
    date: "2026-05-03",
    readTime: "5分",
    summary: "狭い部屋でも散らかりにくくする、収納の考え方とおすすめ装備。",
    productIds: ["folding-storage", "tower-key-hook"],
    body: [
      {
        heading: "狭い部屋では、床を守る",
        paragraphs: [
          "寮生活やワンルームでは、床に物を置き始めた瞬間から崩れます。まずは床を空ける。これは部屋作りの基本動作です。",
          "折りたたみ収納や玄関収納は、必要な時だけ使えて、不要な時に圧迫感を減らせるのが強みです。"
        ],
        bullets: ["床に物を置かない", "分類はざっくりで続ける", "使わない収納は畳めるものを選ぶ"]
      },
      {
        heading: "分類はざっくりでいい",
        paragraphs: [
          "収納は細かく分けすぎると続きません。衣類、ケーブル、掃除用品くらいの大きな区分で十分です。",
          "片付けのハードルを下げると、疲れて帰ってきた日でも部屋が荒れにくくなります。毎日勝てる仕組みにしておくのが大事です。"
        ]
      }
    ]
  },
  {
    id: "bike-trip-gear",
    title: "バイク旅で持っていきたい便利装備まとめ",
    category: "bike",
    date: "2026-05-03",
    readTime: "7分",
    summary: "雨・積載・スマホナビの不安を減らす、バイク旅向けの装備を紹介します。",
    productIds: ["waterproof-touring-bag", "bike-phone-holder", "led-lantern"],
    body: [
      {
        heading: "旅の装備は、不安を一つずつ潰すもの",
        paragraphs: [
          "バイク旅は自由ですが、雨と電池切れと積載不足が来ると急に忙しくなります。先に潰せる不安は、出発前に潰しておくのが鉄則です。",
          "防水バッグは、荷物を守るだけでなく休憩中の気持ちにも効きます。濡れていない着替えがある。それだけでかなり落ち着きます。"
        ],
        bullets: ["荷物は防水を優先する", "スマホナビは固定力を確認する", "ライト類は防災と兼用できる"]
      },
      {
        heading: "軽く、兼用できるものを選ぶ",
        paragraphs: [
          "スマホホルダーやLEDランタンは、旅でも防災でも使えます。用途が重なる装備は、買った後に眠りにくいです。",
          "荷物は増やすほど疲れます。持っていく理由がはっきりしているものだけを選ぶと、走っている時間が気持ちよくなります。"
        ]
      }
    ]
  },
  {
    id: "home-training-gear",
    title: "筋トレ民が買ってよかった家トレ用品",
    category: "training",
    date: "2026-05-03",
    readTime: "6分",
    summary: "自宅でも鍛えたい人向けに、省スペースで続けやすい筋トレ装備をまとめました。",
    productIds: ["adjustable-dumbbell", "door-gym"],
    body: [
      {
        heading: "家トレは準備の速さが勝負",
        paragraphs: [
          "家トレが続くかどうかは、気合いよりも準備の速さで決まります。出して、すぐ始められて、すぐ片付く。これが強い装備です。",
          "ダンベルと懸垂バーは、狭い部屋でも強度を上げやすい組み合わせです。置き場所と設置場所だけは、購入前に必ず確認しておきます。"
        ],
        bullets: ["重量を変えられる道具を選ぶ", "床面積を取りすぎない", "ドア枠や壁の強度を確認する"]
      },
      {
        heading: "重量は伸ばせる余地を残す",
        paragraphs: [
          "可変式ダンベルは、最初は軽めから始めて少しずつ負荷を上げられます。部屋に何個もダンベルを置かなくていいのも助かります。",
          "懸垂バーは設置先の確認が必須です。装備は強いですが、取り付け先が弱いと意味がありません。"
        ]
      }
    ]
  },
  {
    id: "home-disaster-kit",
    title: "災害時に家に置いておきたい防災グッズ",
    category: "disaster",
    date: "2026-05-03",
    readTime: "7分",
    summary: "停電・断水・夜間行動に備えるための、最初に揃えたい防災装備。",
    productIds: ["disaster-kit", "emergency-toilet", "led-lantern"],
    body: [
      {
        heading: "防災は、普段使いできるものから",
        paragraphs: [
          "防災グッズは、押し入れにしまいっぱなしだと本番で使い方を忘れます。普段から少し使っておける装備を選ぶと、いざという時に手が動きます。",
          "まずは一人用セット、トイレ、明かりです。スマホが使える、部屋が照らせる、トイレに困らない。この三つがあるだけで判断力を保ちやすくなります。"
        ],
        bullets: ["一人用セットで最低限をまとめる", "簡易トイレは水や食料と同じくらい重要", "ランタンは停電時の不安を減らす"]
      },
      {
        heading: "置き場所を決めるまでが準備",
        paragraphs: [
          "買って終わりではなく、玄関近くやベッド横など、迷わず取れる場所に置きます。夜中に停電しても、手探りで届く場所が理想です。",
          "防災セットは中身を一度出して確認します。装備は管理できて初めて戦力です。"
        ]
      }
    ]
  },
  {
    id: "pc-desk-cable-cleanup",
    title: "PC作業机の配線を片付けるデスク下装備",
    category: "pc-ai",
    date: "2026-05-03",
    readTime: "5分",
    summary: "ケーブルトレーを使って、足元のコード地帯をすっきりさせる考え方をまとめます。",
    productIds: ["cable-tray"],
    body: [
      {
        heading: "配線は床に置かないだけで変わる",
        paragraphs: [
          "PC周りのコードは、床に落ちているだけで掃除も作業も面倒になります。デスク下に逃がすだけで、作業場の印象はかなり変わります。",
          "ケーブルトレーは派手な装備ではありませんが、毎日見る場所のストレスを減らしてくれます。これは地味だけど、作業効率に効く装備です。"
        ],
        bullets: ["電源タップを床から浮かせる", "余ったケーブルをまとめる", "掃除しやすい足元を作る"]
      }
    ]
  },
  {
    id: "entry-home-training",
    title: "家トレを始めるなら最初に揃えたい筋トレ装備",
    category: "training",
    date: "2026-05-03",
    readTime: "6分",
    summary: "可変式ダンベルと懸垂バーを中心に、省スペースで鍛える装備を紹介します。",
    productIds: ["adjustable-dumbbell", "door-gym"],
    body: [
      {
        heading: "家トレ装備は少数精鋭でいい",
        paragraphs: [
          "家トレは道具を増やしすぎると部屋が狭くなり、続ける気力も削られます。最初は可変式ダンベルと懸垂バーのように、できる種目が多い装備から選ぶのが堅いです。",
          "元自衛官目線でも、継続できる訓練環境を作ることが一番大事です。出すのが面倒な装備は、強くても出番が減ります。"
        ],
        bullets: ["置き場所を先に決める", "重量を伸ばせる道具を選ぶ", "設置先の強度を確認する"]
      }
    ]
  },
  {
    id: "solo-first-room-gear",
    title: "一人暮らし初日にあると助かる生活装備",
    category: "solo",
    date: "2026-05-03",
    readTime: "5分",
    summary: "鍵置き場と収納ボックスから、部屋を散らかしにくくする初期装備を考えます。",
    productIds: ["tower-key-hook", "folding-storage"],
    body: [
      {
        heading: "最初に決めるのは物の住所",
        paragraphs: [
          "一人暮らしは、物の置き場所が決まっていないとすぐ散らかります。鍵、印鑑、衣類、日用品の住所を先に作ると、生活がかなり安定します。",
          "収納ボックスは大きさより、使わない時に邪魔にならないかが大事です。狭い部屋では、畳める装備が強いです。"
        ],
        bullets: ["玄関に鍵の定位置を作る", "衣類と日用品をざっくり分ける", "床に物を置かない仕組みを作る"]
      }
    ]
  },
  {
    id: "touring-rain-gear",
    title: "雨の日のバイク旅で荷物を守る装備",
    category: "bike",
    date: "2026-05-03",
    readTime: "6分",
    summary: "防水ツーリングバッグとスマホホルダーで、雨天時の不安を減らす装備選び。",
    productIds: ["waterproof-touring-bag", "bike-phone-holder"],
    body: [
      {
        heading: "雨対策は出発前に終わらせる",
        paragraphs: [
          "バイク旅で雨に降られてから対策すると、どうしても余裕がなくなります。荷物とスマホを守る装備は、出発前から整えておくのが基本です。",
          "防水バッグは着替えを守り、スマホホルダーはナビ確認の負担を減らします。どちらも走行中の不安を一つ消してくれる装備です。"
        ],
        bullets: ["バッグの容量と固定方法を見る", "スマホホルダーは固定力を優先", "雨具と荷物の取り出しやすさを確認"]
      }
    ]
  },
  {
    id: "toilet-light-disaster",
    title: "防災で先に用意したいトイレと明かり",
    category: "disaster",
    date: "2026-05-03",
    readTime: "6分",
    summary: "簡易トイレとLEDランタンを中心に、災害時の生活ストレスを減らす備えをまとめます。",
    productIds: ["emergency-toilet", "led-lantern"],
    body: [
      {
        heading: "水と食料の次に、トイレと明かり",
        paragraphs: [
          "防災というと水や食料が先に浮かびますが、断水時のトイレと停電時の明かりもかなり重要です。ここが弱いと、家の中でも一気に不安が増えます。",
          "簡易トイレは回数分を多めに、ランタンは普段から一度使っておくのがおすすめです。本番で初めて開ける装備は、意外と手間取ります。"
        ],
        bullets: ["簡易トイレは家族人数と日数で考える", "ランタンは充電状態を定期確認", "置き場所は暗くても取れる場所にする"]
      }
    ]
  },
  {
    id: "rakuten-gear-how-to-choose",
    title: "楽天で便利グッズを選ぶときに見るポイント",
    category: "life",
    date: "2026-05-03",
    readTime: "5分",
    summary: "レビュー数、評価、サイズ、置き場所を見て、失敗しにくい装備選びをする方法。",
    productIds: ["tower-key-hook", "cable-tray", "led-lantern"],
    body: [
      {
        heading: "買う前に、レビューより先に置き場所を見る",
        paragraphs: [
          "楽天で便利グッズを探すと、レビューやランキングに目が行きます。ただ、最初に見るべきは自分の部屋で使えるかです。置けない装備は、どれだけ人気でも使えません。",
          "サイズ、設置方法、使う頻度。この三つを確認してからレビューを見ると、失敗が減ります。装備選びは勢いより段取りです。"
        ],
        bullets: ["サイズと設置方法を確認", "レビュー件数と低評価も見る", "毎日使う導線に入るか考える"]
      }
    ]
  },
  {
    "id": "dorm-life-useful-7",
    "title": "元自衛官が選ぶ、寮生活で本当に助かる便利グッズ7選",
    "category": "solo",
    "date": "2026-05-04",
    "readTime": "9分",
    "summary": "狭い部屋でも「探す・散らかす・眠れない」を減らす、地味に効く装備を7つに絞って紹介します。",
    "productIds": [],
    "introParagraphs": [
      "寮生活は、派手なインテリアより先に「生活導線」が崩れます。床に物が落ちる、鍵が見つからない、充電が足りない。こういう小さな詰まりが積み上がると、気分まで荒れます。",
      "元自衛官目線だと、装備選びはシンプルです。置けるか、続けられるか、壊れにくいか。今回はその三つが揃いやすいものだけを7つにしました。"
    ],
    "forAudience": [
      "単身赴任・入隊・学生寮など、狭い部屋で生活している男向け",
      "片付けは苦手だけど、生活の不便は減らしたい人",
      "楽天で「何を買えばいいか」迷っている初心者向け"
    ],
    "body": [],
    "picks": [
      {
        "name": "折りたたみ収納ボックス（衣類・日用品）",
        "category": "solo",
        "imageLabel": "折りたたみ収納ボックス（衣類・日用品）",
        "intro": [
          "衣類と日用品が混ざると、部屋が一気に荒れます。箱が二つあるだけで「とりあえず入れる場所」ができて、床が空きやすくなります。",
          "使わない時に畳めるのがポイント。寮の押入れやベッド下に逃がせるタイプを選ぶと続きます。"
        ],
        "scenes": [
          "衣替えのとき",
          "来客前に急いで片付けるとき",
          "引っ越しの段取りが多いとき"
        ],
        "caution": [
          "サイズは置き場を測ってから。高さがギリギリだと出し入れが面倒になります"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/auc-kaei-trading/zk-snb02-all/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db246.ec31c6b1.536db247.84c3708d/?me_id=1281364&item_id=10000740&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fauc-kaei-trading%2Fcabinet%2Fzk-snb02%2Fsnb02-2026.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db246.ec31c6b1.536db247.84c3708d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fauc-kaei-trading%2Fzk-snb02-all%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "マグネット式の小物フック（鍵・工具）",
        "category": "life",
        "imageLabel": "マグネット式の小物フック（鍵・工具）",
        "intro": [
          "鍵と印鑑は、定位置がないと毎朝探します。ドアや冷蔵横など、出発導線にフックを置けると地味に強いです。",
          "接着式よりマグネットは移動できるので、生活が変わっても付き合いやすいです。"
        ],
        "scenes": [
          "出勤・外出前のルーティン",
          "部屋のレイアウト変更が多いとき",
          "穴を開けたくない賃貸"
        ],
        "caution": [
          "磁石が弱い扉だと落ちます。取り付け面の材質は商品説明で確認してください"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/cozytime/ysgg/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db416.7a67d6db.536db417.b9e70075/?me_id=1411649&item_id=10000261&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fcozytime%2Fcabinet%2Fimgrc0097051541.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db416.7a67d6db.536db417.b9e70075/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcozytime%2Fysgg%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "一括スイッチ付きの電源タップ",
        "category": "life",
        "imageLabel": "一括スイッチ付きの電源タップ",
        "intro": [
          "充電器が増えると、コンセント周りが戦場になります。まずはタコ足で物理的に確保し、寝る前に切れるのが続きやすいです。",
          "雷サージ付きは保険みたいなもの。過信は禁物ですが、不安が減る分だけ生活がラクになります。"
        ],
        "scenes": [
          "スマホ・モバイルバッテリー・扇風機を同時に使うとき",
          "寝る前に電源を落としたいとき",
          "配線をまとめたいとき"
        ],
        "caution": [
          "定格を超えないように。ヒーター類と同系統に詰め込みすぎないのが安全側です"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/kzsuccsess/k00xxoze0g/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db568.24acaef3.536db569.ac811fa8/?me_id=1437896&item_id=10016188&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fkzsuccsess%2Fcabinet%2Fsyouhingazoupic%2Fsystempic197%2Fk00xxoze0g1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db568.24acaef3.536db569.ac811fa8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkzsuccsess%2Fk00xxoze0g%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "詰め替えボトル（シャンプー・洗剤）",
        "category": "life",
        "imageLabel": "詰め替えボトル（シャンプー・洗剤）",
        "intro": [
          "シャワールームが狭いと、ボトルが床や段差に落ちてストレスになります。見た目より、転倒と掃除の負担が減るのが効きます。",
          "ラベルを付けておくと、後輩に部屋を見せる時も恥ずかしくないです。"
        ],
        "scenes": [
          "共同シャワー・狭い洗面所",
          "ボトル底のヌルつき掃除が嫌なとき",
          "荷物を減らしたいとき"
        ],
        "caution": [
          "材質によっては滑るので、置き方は商品の注意書きを優先してください"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/yamayuu/yj-1538-set/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db601.986d8c19.536db602.941205ae/?me_id=1243032&item_id=10021211&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fyamayuu%2Fcabinet%2F01023319%2Fbathgoods%2F10648094%2Fyj-1538-set_sam01y.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db601.986d8c19.536db602.941205ae/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fyamayuu%2Fyj-1538-set%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "遮光カーテン（睡眠の土台）",
        "category": "solo",
        "imageLabel": "遮光カーテン（睡眠の土台）",
        "intro": [
          "寝不足は判断力を落とします。遮光は贅沢品じゃなくて、回復の装備です。",
          "安すぎるとサイズ感だけ見て失敗しがちなので、幅・丈の測り方は一度ちゃんとやるのがおすすめです。"
        ],
        "scenes": [
          "明るい廊下側の部屋",
          "早番明けで昼寝したいとき",
          "PC作業と寝室が同居のワンルーム"
        ],
        "caution": [
          "洗濯表示とアイロン可否は要確認。縮みで短くなると地味に悔しいです"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/riverpaddy/4jr7ziczqawt4ep77bbbobrrge-alb/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db6fb.8cb5d236.536db6fc.521715ab/?me_id=1430732&item_id=11011359&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Friverpaddy%2Fcabinet%2F12844855%2Falb12257303_1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db6fb.8cb5d236.536db6fc.521715ab/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Friverpaddy%2F4jr7ziczqawt4ep77bbbobrrge-alb%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "スリムなゴミ箱（フタ付き）",
        "category": "life",
        "imageLabel": "スリムなゴミ箱（フタ付き）",
        "intro": [
          "ゴミ箱がない部屋は、袋が床に置かれます。そこから崩れます。細くてもフタがあると臭いと見た目がマシになります。",
          "容量は小さめでいいです。逆に小さいと「捨てる習慣」が付きやすいです。"
        ],
        "scenes": [
          "ワンルームでキッチンと居室が近いとき",
          "コンビニ袋が増える前に止めたいとき",
          "虫が出やすい季節"
        ],
        "caution": [
          "フタの開き方が狭いと捨てにくいので、手の大きさと相性も見てください"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/semi-style/mt-db-f170/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db81d.b3134ff2.536db81e.008ab3b9/?me_id=1276634&item_id=10024183&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fsemi-style%2Fcabinet%2Fmt-main%2Fmt05%2Fdb-f170.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db81d.b3134ff2.536db81e.008ab3b9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsemi-style%2Fmt-db-f170%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "充電式の小型ヘッドライト",
        "category": "disaster",
        "imageLabel": "充電式の小型ヘッドライト",
        "intro": [
          "停電・夜間の作業・部屋の奥の配線確認に使えます。防災と日常の両方に刺さるのが強いです。",
          "ランタンより指向性があるので、手が塞がる作業に向きます。"
        ],
        "scenes": [
          "停電時",
          "ベッド下の物探し",
          "夜間の防災確認（玄関・窓）"
        ],
        "caution": [
          "高温所に置かない、子どもが触れる場所は避けるなど、リチウム系の取り扱いは説明書ベースで"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/aspla/49/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536db94e.bee63e1d.536db94f.67a46868/?me_id=1426111&item_id=10000047&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Faspla%2Fcabinet%2F10635244%2F11209931%2Fsum0114.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536db94e.bee63e1d.536db94f.67a46868/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Faspla%2F49%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "寮生活は「整備」じゃなくて「運用」です。床を空けて、鍵の定位置を作って、睡眠の土台を固める。この順で小物を足していくと失敗しにくいです。",
      "価格・在庫・仕様はリンク先の商品ページで最新を確認してください。"
    ],
    "relatedArticleIds": [
      "dorm-solo-storage",
      "solo-man-first-kit",
      "messy-room-cleanup-7"
    ]
  },
  {
    "id": "car-useful-gear-7",
    "title": "車に積んでおくと地味に助かる便利グッズ7選",
    "category": "car",
    "date": "2026-05-04",
    "readTime": "9分",
    "summary": "日常ドライブからちょい遠出まで、車内の「困った」を減らす小物を7つにまとめました。",
    "productIds": [],
    "introParagraphs": [
      "車は移動の箱ですが、中が荒れると運転の集中も落ちます。ガサツでも続くのは、取り出しが速い・置き場所が決まっている・汚れても許容できる装備です。",
      "派手なカスタムより、雨・汚れ・小さな怪我・臭いの四点を先に潰すのが堅いです。"
    ],
    "forAudience": [
      "通勤が長い、週末にドライブやキャンプ行きがちな人",
      "車内をあまり綺麗にできないが、最低限は整えたい人",
      "積載の段取りをシンプルにしたい元自衛官系の思考が好きな人"
    ],
    "body": [],
    "picks": [
      {
        "name": "車載ゴミ箱（クリップ式）",
        "category": "car",
        "imageLabel": "車載ゴミ箱（クリップ式）",
        "intro": [
          "袋が増える前に止められます。ドアポケットに入るサイズが扱いやすいです。"
        ],
        "scenes": [
          "ファストフード後",
          "タバコを吸わない人でも小ゴミは出る",
          "子ども同乗"
        ],
        "caution": [
          "運転中の操作はしない。止まってから捨てる"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/ssn/10037938/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dba5c.69727981.536dba5d.430a9a06/?me_id=1225177&item_id=10038352&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fssn%2Fcabinet%2Fseikatsu%2F10283065%2Fimgrc0120900053.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dba5c.69727981.536dba5d.430a9a06/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fssn%2F10037938%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "マイクロファイバークロス（多枚セット）",
        "category": "car",
        "imageLabel": "マイクロファイバークロス（多枚セット）",
        "intro": [
          "内窓の曇り、ダッシュのホコリ、雨後の水滴に使い分けできます。高級品じゃなくて枚数勝負でいいです。"
        ],
        "scenes": [
          "ガソスタ後の窓拭き",
          "スマホ画面の脂",
          "サングラスの曇り"
        ],
        "caution": [
          "砂が付いたまま拭くと傷の原因。先にホコリを落とす"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/masatoyo-hamono/10005126/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc00b.b4921fab.536dc00c.60ca3504/?me_id=1240748&item_id=10005126&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmasatoyo-hamono%2Fcabinet%2F02212472%2Fimgrc0090032506.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc00b.b4921fab.536dc00c.60ca3504/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmasatoyo-hamono%2F10005126%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "USB充電器（急速・二口以上）",
        "category": "car",
        "imageLabel": "USB充電器（急速・二口以上）",
        "intro": [
          "ナビ代わりのスマホが一番電気を食います。口が一つだと争奪戦になります。"
        ],
        "scenes": [
          "長距離",
          "渋滞",
          "冬のバッテリー消耗が気になるとき"
        ],
        "caution": [
          "車の取り扱い説明書でUSB/シガーの容量を確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/jism/4549550199032-45-46781-n/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc0d8.5787db23.536dc0d9.4aee24dc/?me_id=1206032&item_id=13071860&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fjism%2Fcabinet%2F1585%2F4549550199032.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc0d8.5787db23.536dc0d9.4aee24dc/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fjism%2F4549550199032-45-46781-n%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "折りたたみショベル（小）",
        "category": "car",
        "imageLabel": "折りたたみショベル（小）",
        "intro": [
          "雪道・砂利・キャンプの小作業に使えます。毎日使わなくていいので、薄いのが車に残りやすいです。"
        ],
        "scenes": [
          "スタック気味の砂利",
          "テント設営の下準備",
          "雪かきの補助"
        ],
        "caution": [
          "道路工事の禁止区域など法令は守る。用途はあくまで応急寄り"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/e-finds-ada/d03-10a/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc1c8.74171d91.536dc1c9.8d0f5acd/?me_id=1389161&item_id=10006205&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fe-finds-ada%2Fcabinet%2Fd03-10a-10.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc1c8.74171d91.536dc1c9.8d0f5acd/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fe-finds-ada%2Fd03-10a%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "救急セット（絆創膏・消毒液・包帯）",
        "category": "car",
        "imageLabel": "救急セット（絆創膏・消毒液・包帯）",
        "intro": [
          "小さな切り傷が一番うっとしい。家と車に分散しておくと安心感が上がります。"
        ],
        "scenes": [
          "アウトドアの小傷",
          "釣り・BBQ",
          "子どもの擦り傷"
        ],
        "caution": [
          "内容物の期限は年一回チェック"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/firstaid/010010a/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc284.c3bb3c83.536dc285.1cefe65e/?me_id=1321256&item_id=10001149&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ffirstaid%2Fcabinet%2F04802522%2Fcont-14-01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc284.c3bb3c83.536dc285.1cefe65e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffirstaid%2F010010a%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "消臭スプレー or ゲル（弱めの香り）",
        "category": "car",
        "imageLabel": "消臭スプレー or ゲル（弱めの香り）",
        "intro": [
          "雨の靴、汗、飲食の残り香。臭いは運転のストレスになります。香り強すぎは逆効果なので弱めから。"
        ],
        "scenes": [
          "同乗者あり",
          "荷物に匂い移りした後",
          "ペット同乗"
        ],
        "caution": [
          "素材によってはシミになるので、吹きかけは説明書通りに"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/cocomakai/coc762fae7a96/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc3ba.adc323b2.536dc3bb.369ef311/?me_id=1377367&item_id=10083660&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fcocomakai%2Fcabinet%2Fonesell343%2Fcoc762fae7a96.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc3ba.adc323b2.536dc3bb.369ef311/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcocomakai%2Fcoc762fae7a96%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "防水ドライバッグ（小）",
        "category": "car",
        "imageLabel": "防水ドライバッグ（小）",
        "intro": [
          "雨の日の買い物袋、濡れたタオル、海・川後の小物入れに使えます。車内が水で終わるのを防げます。"
        ],
        "scenes": [
          "突然の雨",
          "洗車後の濡れ物",
          "小さい荷物の分離"
        ],
        "caution": [
          "完全防水を過信しない。口の閉め方は商品ごとに確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/horiku/2bu6oyw51t/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc519.445162bc.536dc51a.f2f02e1c/?me_id=1426399&item_id=10282982&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fhoriku%2Fcabinet%2F0815%2F2bu6oyw51t_0.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc519.445162bc.536dc51a.f2f02e1c/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fhoriku%2F2bu6oyw51t%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "車は「持ちすぎない」ほど扱いやすいです。ただ、臭い・電源・小傷・水濡れは先に潰す価値があります。まず7つから積んで、運用に合わせて入れ替えていくのが現実的です。"
    ],
    "relatedArticleIds": [
      "travel-light-packing-7",
      "bike-small-comfort-7",
      "touring-rain-gear"
    ]
  },
  {
    "id": "bike-small-comfort-7",
    "title": "バイク乗りが持っておくと安心な小物7選",
    "category": "bike",
    "date": "2026-05-04",
    "readTime": "9分",
    "summary": "大型装備より先に効く、携帯しやすい安心小物を7つに絞りました。",
    "productIds": [],
    "introParagraphs": [
      "バイクは荷重制限がきついので、持ち歩くほど「軽くて効く」ものが強いです。ツーリング中に困るのは、だいたい雨・冷え・電源・小さな故障のどれかです。",
      "ここは押し売りじゃなくて、保険みたいなもの。使わない日が続いても、一回で元が取れるタイプだけ揃えました。"
    ],
    "forAudience": [
      "通勤ツーリングが多い人",
      "荷物を増やしたくないが、最低限は持ちたい人",
      "初心者〜中級者で、装備の優先順位を整理したい人"
    ],
    "body": [],
    "picks": [
      {
        "name": "防水スマホホルダー（ハンドル固定）",
        "category": "bike",
        "imageLabel": "防水スマホホルダー（ハンドル固定）",
        "intro": [
          "ナビ・決済・連絡はスマホ任せになりがちです。雨に濡れたり振動で落ちると、ツーリングが一気に面倒になります。",
          "ハンドルに固定する防水ホルダーは、ポーチより「見える位置」が取りやすいのが利点です。タッチ操作のしやすさは商品次第なので、画面サイズと相性はリンク先で確認してください。"
        ],
        "scenes": [
          "雨予報が不安な通勤",
          "道なれないロングツーリング",
          "原付・スクーターで荷物が少ないとき"
        ],
        "caution": [
          "取り付けトルクと干渉は毎回確認。走行中の長時間操作は避ける"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/umineko-shoji/um-smhld-001-np/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc6fa.3497862e.536dc6fb.340aa3d8/?me_id=1317070&item_id=10009150&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_gold%2Fumineko-shoji%2Fumineko%2Fimg%2FUM-SMHLD-001-BK-XL_0.gif%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc6fa.3497862e.536dc6fb.340aa3d8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fumineko-shoji%2Fum-smhld-001-np%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "使い捨てレインウェア（薄手）",
        "category": "bike",
        "imageLabel": "使い捨てレインウェア（薄手）",
        "intro": [
          "本格雨具が無い日の保険。寒さよりまず濡れないを優先できます。"
        ],
        "scenes": [
          "帰路だけ雨予報",
          "急なゲリラ豪雨",
          "荷物が増えたくない日"
        ],
        "caution": [
          "長時間は蒸れやすい。あくまで応急枠と割り切る"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/heart-max/cqn-raincoat09/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc843.9cc597aa.536dc845.477db1eb/?me_id=1398559&item_id=10003758&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fheart-max%2Fcabinet%2F10667341%2F10852528%2Fcqn-raincoat09-01-3.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc843.9cc597aa.536dc845.477db1eb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fheart-max%2Fcqn-raincoat09%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ディグリーザー（チェーン洗浄）小容量",
        "category": "bike",
        "imageLabel": "ディグリーザー（チェーン洗浄）小容量",
        "intro": [
          "砂が入ると消耗が早い。現場でいう整備の土台です。"
        ],
        "scenes": [
          "雨走行後",
          "砂利道の後",
          "長距離前の気休め"
        ],
        "caution": [
          "環境注意。流す場所・廃棄は商品と地域ルールに従う"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/novolstore/fxuxtqx4ovxjtq35y42i4qadc4/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc970.cf1c1ee4.536dc971.d83025c8/?me_id=1429226&item_id=10356620&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fnovolstore%2Fcabinet%2F10988775%2F32905961_1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc970.cf1c1ee4.536dc971.d83025c8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnovolstore%2Ffxuxtqx4ovxjtq35y42i4qadc4%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ジップタイ（長め・耐候）",
        "category": "bike",
        "imageLabel": "ジップタイ（長め・耐候）",
        "intro": [
          "荷物の仮固定、バッグの破れ応急、コード類のまとめに使えます。細いのがいくつもあると強いです。"
        ],
        "scenes": [
          "積載の微調整",
          "テント痕の補助",
          "バイク旅の現地対応"
        ],
        "caution": [
          "締めすぎで樹脂破損。力加減は様子見"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/marumono/1903652768309059585/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dcad9.24de84ce.536dcada.33fa5b6d/?me_id=1435568&item_id=10088436&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmarumono%2Fcabinet%2F12640229%2F12640292%2Fimgrc0134285502.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dcad9.24de84ce.536dcada.33fa5b6d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmarumono%2F1903652768309059585%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "使い捨て手袋（ニトリル）",
        "category": "bike",
        "imageLabel": "使い捨て手袋（ニトリル）",
        "intro": [
          "チェーン触り、ガソリン臭、虫除去。手が汚れないだけで気分が全然違います。"
        ],
        "scenes": [
          "給油後",
          "チェーン確認",
          "雨の日の整備"
        ],
        "caution": [
          "アレルギー表示を確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/trinity-cosme/san350532x1/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dcb78.070903eb.536dcb79.eb92262f/?me_id=1398715&item_id=10000431&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ftrinity-cosme%2Fcabinet%2F09165139%2F09165140%2Fimgrc0106437735.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dcb78.070903eb.536dcb79.eb92262f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftrinity-cosme%2Fsan350532x1%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "小型モバイルバッテリー",
        "category": "bike",
        "imageLabel": "小型モバイルバッテリー",
        "intro": [
          "ナビと通信が一番食う。薄いものをジャケットに入れておくと精神的に楽です。"
        ],
        "scenes": [
          "長距離",
          "撮影多めの日",
          "停車中の連絡"
        ],
        "caution": [
          "高温の車内放置は避ける"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/anker/a1645/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dcc1e.78374282.536dcc1f.829f0eec/?me_id=1294713&item_id=10001561&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fanker%2Fcabinet%2Fimages%2F09779934%2F11413859%2Fimgrc0089705577.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dcc1e.78374282.536dcc1f.829f0eec/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fanker%2Fa1645%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "緊急連絡カード（防水ケース）",
        "category": "bike",
        "imageLabel": "緊急連絡カード（防水ケース）",
        "intro": [
          "事故・体調不良のとき、言葉が出ないと困る。血型・常用薬・連絡先は紙で十分です。"
        ],
        "scenes": [
          "ソロツーリング",
          "初めてのルート",
          "山間部"
        ],
        "caution": [
          "個人情報の書き方は自己責任で。見せ方は工夫してください"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/thrsparkle/b09hkcl5y9/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dccbd.ccee0747.536dccbe.7f5e8503/?me_id=1425351&item_id=10058532&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fthrsparkle%2Fcabinet%2Fhiro_0210%2Fb09hkcl5y900.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dccbd.ccee0747.536dccbe.7f5e8503/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fthrsparkle%2Fb09hkcl5y9%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "バイク装備は増やすほど重くなります。まずは雨・汚れ・電源・連絡の保険を薄く入れて、走る回数に合わせて本格化するのが続きやすいです。"
    ],
    "relatedArticleIds": [
      "bike-trip-gear",
      "touring-rain-gear",
      "car-useful-gear-7"
    ]
  },
  {
    "id": "desk-messy-man-organize-7",
    "title": "デスク周りが散らかる男向けの整理グッズ7選",
    "category": "pc-ai",
    "date": "2026-05-04",
    "readTime": "9分",
    "summary": "ケーブルと小物と紙。男のデスクはここから崩れるので、先に止める道具を7つにしました。",
    "productIds": [],
    "introParagraphs": [
      "デスクは作業の拠点です。散らかる原因はだいたい同じで、配線、文房具、紙、充電、飲み物です。",
      "収納オタクにならなくていいです。まずは床に物が落ちない・机の上に定位置ができる、ここまでが勝負です。"
    ],
    "forAudience": [
      "在宅・夜勤明けの副業・学習でPC前が長い人",
      "細かい整理は苦手だが、作業はしたい人",
      "ケーブル地獄から抜け出したい人"
    ],
    "body": [],
    "picks": [
      {
        "name": "ケーブルトレー（デスク下）",
        "category": "pc-ai",
        "imageLabel": "ケーブルトレー（デスク下）",
        "intro": [
          "足元の配線が床に落ちると、掃除もストレスも増えます。浮かせるだけで生活が変わります。"
        ],
        "scenes": [
          "リモートワーク",
          "ゲーム配線",
          "電源タップが多い机"
        ],
        "caution": [
          "ネジ留めの机は説明書の耐荷重を確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/lifecorner/rs-dxsn-1/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dd522.8b6a3078.536dd523.65dd3c11/?me_id=1333373&item_id=10002561&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Flifecorner%2Fcabinet%2Fsh%2Fdxsn%2Fc-dxsn-b.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dd522.8b6a3078.536dd523.65dd3c11/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flifecorner%2Frs-dxsn-1%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "マグネットケーブルホルダー",
        "category": "pc-ai",
        "imageLabel": "マグネットケーブルホルダー",
        "intro": [
          "床に落ちたケーブルは踏みます。磁石で側面に貼れるタイプは移動もラクです。"
        ],
        "scenes": [
          "スマホ充電",
          "有線マウス",
          "ヘッドセット"
        ],
        "caution": [
          "磁力が弱い机材だとダメ。金属面か要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/maveek/mvo02115-wt5/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dd66e.89ac82e0.536dd66f.434280a1/?me_id=1405865&item_id=10000231&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmaveek%2Fcabinet%2F08692947%2Fimgrc0116951374.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dd66e.89ac82e0.536dd66f.434280a1/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmaveek%2Fmvo02115-wt5%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "デスク上ラック（二段）",
        "category": "pc-ai",
        "imageLabel": "デスク上ラック（二段）",
        "intro": [
          "上に逃がすと机の可動域が増えます。本棚いらずの薄型が続きやすいです。"
        ],
        "scenes": [
          "ノートPC＋外付けモニタ",
          "文房具の定位置化",
          "ルーター隠し"
        ],
        "caution": [
          "転倒防止。設置面が狭いと危ない"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/look-it/nf-kr2-120/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dd83f.54d9a69c.536dd840.4177ad8b/?me_id=1236499&item_id=10648707&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Flook-it%2Fcabinet%2Fnf-001%2Fnf-009%2Fnf-kr2-120_r_thum.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dd83f.54d9a69c.536dd840.4177ad8b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flook-it%2Fnf-kr2-120%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "引き出し付きデスクワゴン",
        "category": "pc-ai",
        "imageLabel": "引き出し付きデスクワゴン",
        "intro": [
          "机上の小物は、引き出しに入ると一気にマシに見えます。ラベルは貼りすぎない方が続く。"
        ],
        "scenes": [
          "工具・文房具",
          "ゲーム周辺機器",
          "薬・絆創膏"
        ],
        "caution": [
          "キャスターはロックできるものを"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/myhome/mhn504p475311/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dd95c.dbd69619.536dd95d.c28d7794/?me_id=1295366&item_id=10004306&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmyhome%2Fcabinet%2F09386803%2F13097042%2Fn504p475311-2.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dd95c.dbd69619.536dd95d.c28d7794/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmyhome%2Fmhn504p475311%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "クリップボード＋クリアファイル",
        "category": "pc-ai",
        "imageLabel": "クリップボード＋クリアファイル",
        "intro": [
          "紙は立てられないと死ぬ。期限ものは表に出すと忘れにくいです。"
        ],
        "scenes": [
          "確定申告の準備",
          "車検・保険書類",
          "印刷資料の仮置き"
        ],
        "caution": [
          "厚紙は曲がる。クリップ強度は要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/loupe-studio/akh-ltl-0124/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536ddab2.b1d10708.536ddab3.640526e8/?me_id=1201987&item_id=11444209&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Floupe-studio%2Fcabinet%2Fi-akh03%2Fakh-ltl-0124.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536ddab2.b1d10708.536ddab3.640526e8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Floupe-studio%2Fakh-ltl-0124%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "卓上ゴミ箱（ミニ）",
        "category": "pc-ai",
        "imageLabel": "卓上ゴミ箱（ミニ）",
        "intro": [
          "剥がし屑・タグ・ホコリテープ。小さいゴミが机に残ると気が散ります。"
        ],
        "scenes": [
          "梱包開封",
          "シール類",
          "細かい作業"
        ],
        "caution": [
          "臭いゴミは床の大ゴミ箱へ。役割分担が大事"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/chuwacorp0618/r22006148ee7c/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536ddcec.bd5167a0.536ddced.60013c2b/?me_id=1439917&item_id=10003145&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fchuwacorp0618%2Fcabinet%2F042503%2Fr22006148ee7c_1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536ddcec.bd5167a0.536ddced.60013c2b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fchuwacorp0618%2Fr22006148ee7c%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "モニタライトバー（調光）",
        "category": "pc-ai",
        "imageLabel": "モニタライトバー（調光）",
        "intro": [
          "部屋の主照明だけだと画面が眩しく感じることがあります。目の負担は地味に効きます。"
        ],
        "scenes": [
          "夜間作業",
          "寝室同居のワンルーム",
          "紙と画面の切替"
        ],
        "caution": [
          "反射が気になるなら角度調整。外付けは置き場所が要る"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/benq-directshop/moniterlight_01/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536ddde4.99e2b7e0.536ddde5.ae15cc42/?me_id=1379427&item_id=10000009&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fbenq-directshop%2Fcabinet%2F07271353%2Fscreenbar-1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536ddde4.99e2b7e0.536ddde5.ae15cc42/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbenq-directshop%2Fmoniterlight_01%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "デスク整理は完璧を狙うと死にます。配線を床から上げる、小物に引き出しを作る、紙の仮置き場を作る。この三つができれば、あとは好みで足していけばいいです。"
    ],
    "relatedArticleIds": [
      "pc-desk-cable-cleanup",
      "messy-room-cleanup-7",
      "life-useful-goods-10"
    ]
  },
  {
    "id": "messy-room-cleanup-7",
    "title": "ガサツな男でも続く、部屋を片付ける便利グッズ7選",
    "category": "life",
    "date": "2026-05-04",
    "readTime": "9分",
    "summary": "気合いより仕組み。続く人はハードルを下げています。地味に効く7つです。",
    "productIds": [],
    "introParagraphs": [
      "片付けが続かないのは性格じゃなくて設計の問題であることが多いです。面倒な工程が一つでもあると、疲れた日に破綻します。",
      "元自衛官っぽく言うと、整備は「毎回同じ手順で短く終わる」ことが大事です。今回はその手順を短くする道具側です。"
    ],
    "forAudience": [
      "片付けは嫌いだが、部屋はそれなりに見せたい人",
      "一人暮らし・ワンルームで床に物が落ちやすい人",
      "完璧主義を捨てて、運用で勝ちたい人"
    ],
    "body": [],
    "picks": [
      {
        "name": "タイマー付きの掃除機（コードレス）",
        "category": "life",
        "imageLabel": "タイマー付きの掃除機（コードレス）",
        "intro": [
          "重いと出さない。軽いと床のホコリが減り、散らかりの見え方がマシになります。"
        ],
        "scenes": [
          "週一回のルーティン",
          "食べこぼし後",
          "玄関の砂"
        ],
        "caution": [
          "吸引力と稼働時間のバランスはレビューで要確認"
        ],
        "rakutenSearchKeyword": "掃除機 コードレス 軽量"
      },
      {
        "name": "ランドリーバスケット（通気穴あり）",
        "category": "life",
        "imageLabel": "ランドリーバスケット（通気穴あり）",
        "intro": [
          "脱衣所に「仮置き」があるだけで床が救われます。通気があると臭いが育ちにくいです。"
        ],
        "scenes": [
          "訓練後・運動後",
          "洗濯の回数が少ない週",
          "部屋干し前の仮置き"
        ],
        "caution": [
          "湿ったまま放置はカビ。乾燥の段取りは別途"
        ],
        "rakutenSearchKeyword": "ランドリーバスケット スリム"
      },
      {
        "name": "粘着クリーナー（スペア多め）",
        "category": "life",
        "imageLabel": "粘着クリーナー（スペア多め）",
        "intro": [
          "服のホコリが減ると印象が変わります。スペアがあると続きます。"
        ],
        "scenes": [
          "出勤前",
          "黒服が多い人",
          "ペット同棲"
        ],
        "caution": [
          "粘着が強すぎる素材は注意"
        ],
        "rakutenSearchKeyword": "コロコロ スペア 10巻"
      },
      {
        "name": "フック付きのS字フック",
        "category": "life",
        "imageLabel": "フック付きのS字フック",
        "intro": [
          "かけるだけ文化に移行すると、片付けが速いです。ドア、タオル掛け、クローゼット棒に使えるのが強いです。"
        ],
        "scenes": [
          "バッグ仮置き",
          "帽子",
          "工具ポーチ"
        ],
        "caution": [
          "耐荷重は超えない。金属疲労もある"
        ],
        "rakutenSearchKeyword": "S字フック ゴム付き"
      },
      {
        "name": "ラベルシール（大きめ・少なめ）",
        "category": "life",
        "imageLabel": "ラベルシール（大きめ・少なめ）",
        "intro": [
          "分類はざっくりでいい。細かすぎるラベルは続きません。"
        ],
        "scenes": [
          "段ボール収納",
          "備蓄棚",
          "文房具引き出し"
        ],
        "caution": [
          "剥がし跡が気になる素材はテスト"
        ],
        "rakutenSearchKeyword": "ラベルシール 無地 大"
      },
      {
        "name": "ゴミ袋ストッカー",
        "category": "life",
        "imageLabel": "ゴミ袋ストッカー",
        "intro": [
          "袋が見えると生活が雑に見える。定位置があると交換が速いです。"
        ],
        "scenes": [
          "キッチン",
          "洗面所",
          "車用と家用の分離"
        ],
        "caution": [
          "サイズ互換は要確認"
        ],
        "rakutenSearchKeyword": "ゴミ袋 収納 マグネット"
      },
      {
        "name": "床用ウェットシート（除菌）",
        "category": "life",
        "imageLabel": "床用ウェットシート（除菌）",
        "intro": [
          "水拭きのハードルを下げる。ガサツでも一枚で終われるのが強いです。"
        ],
        "scenes": [
          "食後のキッチン周り",
          "靴跡",
          "小さな汚れのついで掃除"
        ],
        "caution": [
          "ワックス床は説明書確認"
        ],
        "rakutenSearchKeyword": "フローリング ウェットシート"
      }
    ],
    "conclusionParagraphs": [
      "片付けは気合いじゃなくて摩擦の問題です。出す・戻す・捨てるが速い道具から入れると、生活が荒れにくくなります。"
    ],
    "relatedArticleIds": [
      "dorm-life-useful-7",
      "dorm-solo-storage",
      "solo-man-first-kit"
    ]
  },
  {
    "id": "disaster-helpful-gear-7",
    "title": "災害時にあると助かる防災グッズ7選",
    "category": "disaster",
    "date": "2026-05-04",
    "readTime": "10分",
    "summary": "派手な備蓄より先に、生活が止まらないための土台を7つに絞りました。",
    "productIds": [],
    "introParagraphs": [
      "防災は「買って終わり」になりやすいですが、現場は運用です。暗い・喉が渇く・トイレ・連絡が詰まると判断力が落ちます。",
      "全部揃えるのは難しいので、まずは家の中で迷子にならないセットを優先しました。"
    ],
    "forAudience": [
      "防災は気になるが、何から揃えるか迷っている人",
      "一人暮らし・ワンルームで置き場所が少ない人",
      "普段使いもできるものを優先したい人"
    ],
    "body": [],
    "picks": [
      {
        "name": "飲料水（長期保存用）",
        "category": "disaster",
        "imageLabel": "飲料水（長期保存用）",
        "intro": [
          "水がないと何も始まりません。まずは数本でも定位置ができると強いです。"
        ],
        "scenes": [
          "停電・断水",
          "熱中症リスク",
          "調理の下準備"
        ],
        "caution": [
          "期限は管理。直射日光の倉庫置きは避ける"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/manekiyaneeds/30560/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e4ab7.8316a431.536e4ab8.5333e12f/?me_id=1433705&item_id=10000094&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmanekiyaneeds%2Fcabinet%2Fgoq001%2F103_1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e4ab7.8316a431.536e4ab8.5333e12f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmanekiyaneeds%2F30560%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "LEDランタン（充電式）",
        "category": "disaster",
        "imageLabel": "LEDランタン（充電式）",
        "intro": [
          "停電の不安を一番減らすのは明かりです。普段キャンプでも使えると眠らないです。"
        ],
        "scenes": [
          "夜間の家の移動",
          "階段",
          "集合場所までの移動"
        ],
        "caution": [
          "バッテリー劣化はある。定期充電を習慣化"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/tss/plrx-lt01ms/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e4c52.bee5c63b.536e4c53.5784966f/?me_id=1218452&item_id=14451492&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ftss%2Fcabinet%2Fimg-29%2Fplrx-lt01ms.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e4c52.bee5c63b.536e4c53.5784966f/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftss%2Fplrx-lt01ms%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "手回しラジオ（スマホ充電可）",
        "category": "disaster",
        "imageLabel": "手回しラジオ（スマホ充電可）",
        "intro": [
          "情報が取れないと余計に焦ります。電波状況は地域差があるのは理解しておく。"
        ],
        "scenes": [
          "停電長引き",
          "通信混雑",
          "避難所"
        ],
        "caution": [
          "手回しは重い。練習しておく"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/starlighting/radio-07004/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e4d21.fa4bc156.536e4d22.fbc20e5a/?me_id=1430065&item_id=10001146&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fstarlighting%2Fcabinet%2Fautoitem%2Fradio-07004.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e4d21.fa4bc156.536e4d22.fbc20e5a/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstarlighting%2Fradio-07004%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "簡易トイレ（凝固剤タイプ）",
        "category": "disaster",
        "imageLabel": "簡易トイレ（凝固剤タイプ）",
        "intro": [
          "断水のストレスはトイレが上位です。回数は多め見積もりが精神衛生上おすすめです。"
        ],
        "scenes": [
          "断水初日",
          "避難所待機",
          "家族が多い世帯"
        ],
        "caution": [
          "処理方法は自治体ルール確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/across-zakka/wap-100/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e4dc8.741e2d0b.536e4dc9.8cc7d5bb/?me_id=1349310&item_id=10000252&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Facross-zakka%2Fcabinet%2F07351575%2Fcompass1751248858.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e4dc8.741e2d0b.536e4dc9.8cc7d5bb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Facross-zakka%2Fwap-100%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "非常食（自分の胃に合うもの）",
        "category": "disaster",
        "imageLabel": "非常食（自分の胃に合うもの）",
        "intro": [
          "備蓄は食べられないと意味がない。好き嫌いが強い人ほど試食してから増やす。"
        ],
        "scenes": [
          "初期の24〜72時間",
          "仕事の合間の補給",
          "子ども世帯"
        ],
        "caution": [
          "アレルギー表示は必読"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/e-do/bou-alp12/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e4eb1.867cb8c5.536e4eb2.a7f26739/?me_id=1217939&item_id=10011750&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fe-do%2Fcabinet%2Fimg_1%2Fbou-arufa800-12.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e4eb1.867cb8c5.536e4eb2.a7f26739/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fe-do%2Fbou-alp12%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "救急セット（家庭用）",
        "category": "disaster",
        "imageLabel": "救急セット（家庭用）",
        "intro": [
          "切り傷・やけど・発熱の初期対応。大事故は救急ですが、小さな止血は地味に効く。"
        ],
        "scenes": [
          "料理中",
          "DIY",
          "子ども"
        ],
        "caution": [
          "薬の期限管理"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/firstaid/010005a/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536dc284.c3bb3c83.536dc285.1cefe65e/?me_id=1321256&item_id=10000004&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ffirstaid%2Fcabinet%2F04802522%2F5comp2-9-01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536dc284.c3bb3c83.536dc285.1cefe65e/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ffirstaid%2F010005a%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "モバイルバッテリー（大容量）",
        "category": "disaster",
        "imageLabel": "モバイルバッテリー（大容量）",
        "intro": [
          "連絡手段の保険。機内持ち込み規定など旅行時は別ルールなので注意。"
        ],
        "scenes": [
          "停電",
          "避難所",
          "情報収集"
        ],
        "caution": [
          "高温放置禁止。ケーブルは純正寄りが無難"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/asmodeus/asmo20250303cdbd/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5054.8d08b47a.536e5055.27893b4d/?me_id=1420348&item_id=10000253&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fasmodeus%2Fcabinet%2F11993821%2Fcdbd.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5054.8d08b47a.536e5055.27893b4d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fasmodeus%2Fasmo20250303cdbd%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "防災は全部盛りより、水・明かり・トイレ・情報・連絡の順で穴を埋めるのが現実的です。置き場所まで決めて初めて装備になります。"
    ],
    "relatedArticleIds": [
      "home-disaster-kit",
      "toilet-light-disaster",
      "life-useful-goods-10"
    ]
  },
  {
    "id": "rakuten-shopping-mistakes-less",
    "title": "楽天で買い物するときに失敗しにくい見方",
    "category": "life",
    "date": "2026-05-04",
    "readTime": "10分",
    "summary": "レビューと価格に飛びつく前に見るべきポイントを、7つのチェックとして整理しました。",
    "productIds": [],
    "introParagraphs": [
      "楽天は選択肢が多いので、探しているうちに疲れます。疲れると勢いで買って、サイズ違いで終わりがちです。",
      "元自衛官っぽく言うと、装備は「現物の置き場所」と「運用」が先。ページのテンションは後でいいです。"
    ],
    "forAudience": [
      "ネット通販は慣れてないが、楽天で生活用品を揃えたい人",
      "返品が面倒で、失敗を減らしたい人",
      "ランキング信者から卒業したい人"
    ],
    "body": [],
    "picks": [
      {
        "name": "チェック1：寸法（外寸・内寸・取っ手）",
        "category": "life",
        "imageLabel": "チェック1：寸法（外寸・内寸・取っ手",
        "intro": [
          "家具・収納は1cmでも詰まるとストレスです。幅だけじゃなく奥行きと高さも書き出す。"
        ],
        "scenes": [
          "冷蔵庫上",
          "玄関",
          "デスク下"
        ],
        "caution": [
          "画像の見た目は広く写りがち"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/nbdeli/ht8519/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5106.d3b1821d.536e5107.1eac3284/?me_id=1414479&item_id=10000017&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fnbdeli%2Fcabinet%2F10079428%2F12605151%2Fimgrc0127921964.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5106.d3b1821d.536e5107.1eac3284/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnbdeli%2Fht8519%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "チェック2：材質（プラ・金属・布）",
        "category": "life",
        "imageLabel": "チェック2：材質（プラ・金属・布）",
        "intro": [
          "熱・湿気・直射日光に弱い素材は場所で死ぬ。賃貸の温度環境も想像する。"
        ],
        "scenes": [
          "浴室近く",
          "ベランダ",
          "車庫"
        ],
        "caution": [
          "説明書の禁止事項はちゃんと読む"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/kohnan-eshop/4522831835188/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536de13f.4bee90a4.536de140.ccb802e0/?me_id=1343746&item_id=10094135&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fkohnan-eshop%2Fcabinet%2Fgoods%2F202604%2Fs1%2Fsku0117_01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536de13f.4bee90a4.536de140.ccb802e0/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkohnan-eshop%2F4522831835188%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "チェック3：レビューの「低評価の理由」",
        "category": "life",
        "imageLabel": "チェック3：レビューの「低評価の理由",
        "intro": [
          "星の平均より、1〜2星の内容が正直です。自分と同じ失敗パターンがないか見る。"
        ],
        "scenes": [
          "初見ブランド",
          "安すぎる商品",
          "サイズ物"
        ],
        "caution": [
          "投稿数が少ないときは慎重に"
        ],
        "rakutenSearchKeyword": "楽天 レビュー 見方"
      },
      {
        "name": "チェック4：送料・セット割・クーポン条件",
        "category": "life",
        "imageLabel": "チェック4：送料・セット割・クーポン",
        "intro": [
          "本体が安くても総額で負けることがある。条件達成の買い足しは地獄になりやすい。"
        ],
        "scenes": [
          "まとめ買い",
          "大型家電",
          "定期購入"
        ],
        "caution": [
          "条件読み飛ばしが一番の地雷"
        ],
        "rakutenSearchKeyword": "楽天 送料 クーポン"
      },
      {
        "name": "チェック5：保証・返品・問い合わせ窓口",
        "category": "life",
        "imageLabel": "チェック5：保証・返品・問い合わせ窓",
        "intro": [
          "壊れた時に誰が見るのか。家電ほど差が出ます。"
        ],
        "scenes": [
          "高額商品",
          "精密機器",
          "子ども用品"
        ],
        "caution": [
          "開封後返品不可は要確認"
        ],
        "rakutenSearchKeyword": "楽天 返品 保証"
      },
      {
        "name": "チェック6：互換性（規格・型番）",
        "category": "life",
        "imageLabel": "チェック6：互換性（規格・型番）",
        "intro": [
          "消耗品ほど型番ミスが起きる。写真だけ信じない。"
        ],
        "scenes": [
          "掃除機パック",
          "フィルター",
          "PC周辺"
        ],
        "caution": [
          "メーカー純正と互換で性能差"
        ],
        "rakutenSearchKeyword": "互換 品 型番 確認"
      },
      {
        "name": "チェック7：在庫と納期（急ぎのとき）",
        "category": "life",
        "imageLabel": "チェック7：在庫と納期（急ぎのとき）",
        "intro": [
          "イベント前の購入ほど納期が刺さる。出荷元が遠いと地味に遅い。"
        ],
        "scenes": [
          "引越し前",
          "旅行前",
          "故障交換"
        ],
        "caution": [
          "予約商品は特に注意"
        ],
        "rakutenSearchKeyword": "楽天 発送 即日"
      }
    ],
    "conclusionParagraphs": [
      "楽天で強い人は、検索が上手いんじゃなくて確認が早い人です。寸法・低評価・総額の三点だけでも先に見ると、失敗がかなり減ります。"
    ],
    "relatedArticleIds": [
      "rakuten-gear-how-to-choose",
      "life-useful-goods-10",
      "desk-messy-man-organize-7"
    ]
  },
  {
    "id": "solo-man-first-kit",
    "title": "一人暮らしを始める男が最初に揃えたいもの",
    "category": "solo",
    "date": "2026-05-04",
    "readTime": "10分",
    "summary": "インテリアより先に「生活が止まらないセット」。ガサツでも回る7つに絞りました。",
    "productIds": [],
    "introParagraphs": [
      "一人暮らし初日に困るのは、だいたいゴミ袋・トイレットペーパー・照明・寝具・掃除道具のどれかです。",
      "全部高級品にしなくていい。まずは生活導線が通る最低限を揃えて、あとから好みで足すのが堅いです。"
    ],
    "forAudience": [
      "これから一人暮らしを始める男",
      "実家から出るタイミングで荷物を最小にしたい人",
      "何を買えばいいか分からず止まっている人"
    ],
    "body": [],
    "picks": [
      {
        "name": "寝具セット（最低限）",
        "category": "solo",
        "imageLabel": "寝具セット（最低限）",
        "intro": [
          "寝られないと全部終わる。最初はシンプルでいいです。"
        ],
        "scenes": [
          "引越し当日",
          "寮上がり",
          "ワンルーム初日"
        ],
        "caution": [
          "圧縮ロールは開封後の復元時間に注意"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/tansu/7519000100/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e52d9.83471535.536e52da.8af899e5/?me_id=1199397&item_id=10011910&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ftansu%2Fcabinet%2Fkoukoku%2F61140237_10a.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e52d9.83471535.536e52da.8af899e5/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftansu%2F7519000100%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "調理器具（フライパン1・鍋1）",
        "category": "solo",
        "imageLabel": "調理器具（フライパン1・鍋1）",
        "intro": [
          "まず自炊の入口を作る。多機能より洗いやすさ優先で続きやすいです。"
        ],
        "scenes": [
          "麺類",
          "炒め物",
          "卵料理"
        ],
        "caution": [
          "IH対応表記はコンロと要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/kai/ss0332/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e53c8.3082cbf6.536e53c9.7b9dcee8/?me_id=1207985&item_id=10016025&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fkai%2Fcabinet%2Fbc%2Fgoods_2%2Fthumb%2Fss0332_logo.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e53c8.3082cbf6.536e53c9.7b9dcee8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fkai%2Fss0332%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "掃除の最低セット（ほうき・ちりとり）",
        "category": "solo",
        "imageLabel": "掃除の最低セット（ほうき・ちりとり）",
        "intro": [
          "掃除機が無くても床が救える。最初の数日は特にホコリが出ます。"
        ],
        "scenes": [
          "入居直後",
          "砂ぼこり",
          "食べこぼし"
        ],
        "caution": [
          "毛が長いタイプは保管場所が要る"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/shopmarna/w628/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e54a8.13ce3686.536e54a9.ec0127f7/?me_id=1251218&item_id=10006060&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fshopmarna%2Fcabinet%2Fitem_top%2Fw6%2Fw628.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e54a8.13ce3686.536e54a9.ec0127f7/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fshopmarna%2Fw628%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "延長コード＋電球（予備）",
        "category": "solo",
        "imageLabel": "延長コード＋電球（予備）",
        "intro": [
          "部屋の明るさが生活の気分を作る。予備電球は地味に強いです。"
        ],
        "scenes": [
          "寝室が暗い",
          "作業コーナー",
          "クローゼット"
        ],
        "caution": [
          "口金サイズはE17/E26など要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/e-akari/567802/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5532.4751c3a7.536e5533.82ff3985/?me_id=1259395&item_id=10065169&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fe-akari%2Fcabinet%2Fa%2Fimgrc0085822157.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5532.4751c3a7.536e5533.82ff3985/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fe-akari%2F567802%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "トイレットペーパー＆ティッシュの箱買い",
        "category": "solo",
        "imageLabel": "トイレットペーパー＆ティッシュの箱買",
        "intro": [
          "ここが切れるとメンタルが先に折れます。箱はベッド下でもいいので確保。"
        ],
        "scenes": [
          "引越し初週",
          "風邪",
          "来客"
        ],
        "caution": [
          "湿気場所はカビ注意"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/coming/jun1kyuhinrolls-recycle12rw/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e55b9.bd785323.536e55ba.6e53916b/?me_id=1269408&item_id=10000440&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fcoming%2Fcabinet%2Fdaiichimoji%2Fimgrc0096851285.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e55b9.bd785323.536e55ba.6e53916b/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcoming%2Fjun1kyuhinrolls-recycle12rw%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "洗濯用品（洗剤・ハンガー少量）",
        "category": "solo",
        "imageLabel": "洗濯用品（洗剤・ハンガー少量）",
        "intro": [
          "部屋干し前提なら、まずハンガーとピンチ。干す場所は次の段階で。"
        ],
        "scenes": [
          "初回洗濯",
          "運動後",
          "雨の日"
        ],
        "caution": [
          "重量超過で折れるハンガーに注意"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/nishida2/2019102810/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e566d.a6fa9b36.536e566e.f48ae270/?me_id=1305791&item_id=10000355&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fnishida2%2Fcabinet%2F07258509%2Fimgrc0087488523.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e566d.a6fa9b36.536e566e.f48ae270/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnishida2%2F2019102810%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "救急セット（小）",
        "category": "solo",
        "imageLabel": "救急セット（小）",
        "intro": [
          "切り傷とかゆみ止めくらいでも、あると安心して動けます。"
        ],
        "scenes": [
          "引越しの段ボール処理",
          "料理の初日",
          "爪切りすぎ"
        ],
        "caution": [
          "内容確認と期限メモ"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/torreya-shop/100000045/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536656ee.601828c8.536656ef.1bca0db8/?me_id=1322774&item_id=10000085&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ftorreya-shop%2Fcabinet%2F10949533%2Fthumbnail.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536656ee.601828c8.536656ef.1bca0db8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftorreya-shop%2F100000045%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "一人暮らしは「全部揃えてから」だと永遠に始まりません。寝る・食う・捨てる・洗うが回る順に揃えると、あとは好みで装備を足していけます。"
    ],
    "relatedArticleIds": [
      "solo-first-room-gear",
      "dorm-life-useful-7",
      "messy-room-cleanup-7"
    ]
  },
  {
    "id": "recovery-gear-ex-sdf",
    "title": "元自衛官目線で選ぶ、疲れを残さないリカバリーグッズ",
    "category": "training",
    "date": "2026-05-04",
    "readTime": "16分",
    "summary": "気合いで回復しない。睡眠・血流・筋膜のケアを、続けやすい道具で整えます。",
    "productIds": [],
    "introParagraphs": [
      "疲労回復は派手なギアより、睡眠と血流と栄養の方が支配的です。道具はその補助輪みたいな位置づけが現実的です。",
      "「買ったら回復する」みたいな魔法は売ってないので、温度感はそこまでにします。地味に続くものだけ。"
    ],
    "forAudience": [
      "肉体労働・立ち仕事・運動後に疲れが抜けにくい人",
      "睡眠の質を上げたい人",
      "フォームローラーみたいな自己ケアを始めたい人"
    ],
    "body": [],
    "picks": [
      {
        "name": "フォームローラー（ミドル密度）",
        "category": "training",
        "imageLabel": "フォームローラー（ミドル密度）",
        "intro": [
          "最初は激痛ローラーだと続きません。太もも・背中の外周を優先。"
        ],
        "scenes": [
          "走った後",
          "長時間デスク",
          "起床後の身体の固まり"
        ],
        "caution": [
          "骨に当てすぎない。痛みが強すぎるのはやり方のサイン"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/lively777/formroller/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5899.ad4c1f8c.536e589a.3f53cdac/?me_id=1384136&item_id=10000143&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Flively777%2Fcabinet%2Fuyjiazhu%2F2025%2F2025top.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5899.ad4c1f8c.536e589a.3f53cdac/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flively777%2Fformroller%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "マッサージボール（硬め）",
        "category": "training",
        "imageLabel": "マッサージボール（硬め）",
        "intro": [
          "局所のコリに刺さる。デスク下に転がしておけるサイズが強いです。"
        ],
        "scenes": [
          "肩甲骨周り",
          "足裏",
          "前腕"
        ],
        "caution": [
          "転がって家電に当たらない場所で"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/the-perfect-sports/massageball/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5930.033c3f0d.536e5931.09b813ab/?me_id=1377608&item_id=10000012&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fthe-perfect-sports%2Fcabinet%2Fvar%2Fmassageball%2Ftop-5.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5930.033c3f0d.536e5931.09b813ab/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fthe-perfect-sports%2Fmassageball%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "レッグケア（着圧ソックス夜用）",
        "category": "training",
        "imageLabel": "レッグケア（着圧ソックス夜用）",
        "intro": [
          "立ち仕事の日の保険。サイズ選びが成否を分けます。"
        ],
        "scenes": [
          "長時間歩行",
          "残業後",
          "暑い日の脚のだるさ"
        ],
        "caution": [
          "締め付けすぎは逆効果。着用時間は商品指示"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/lifestyle-007/62367/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5a43.9f004c24.536e5a44.0ab00e86/?me_id=1395354&item_id=10002411&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Flifestyle-007%2Fcabinet%2Fitem%2F2026%2F62367.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5a43.9f004c24.536e5a44.0ab00e86/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Flifestyle-007%2F62367%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "スリーピングマスク",
        "category": "life",
        "imageLabel": "スリーピングマスク",
        "intro": [
          "光が入る部屋ほど効きます。安物でも「暗さの習慣」が作れるなら十分。"
        ],
        "scenes": [
          "夜勤明け",
          "ワンルーム同居",
          "昼寝"
        ],
        "caution": [
          "締め付けが苦しいなら調整タイプへ"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/gift-bmcjapan/o20211222/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5b2c.61bd8ece.536e5b2d.8ca4afc3/?me_id=1359848&item_id=10000150&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fgift-bmcjapan%2Fcabinet%2Feyemaskblack%2Fth.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5b2c.61bd8ece.536e5b2d.8ca4afc3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fgift-bmcjapan%2Fo20211222%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "入浴剤（発汗系じゃないリラックス系）",
        "category": "life",
        "imageLabel": "入浴剤（発汗系じゃないリラックス系）",
        "intro": [
          "湯船がない部屋はシャワー中心でOK。足湯用バケツでも代替できます。"
        ],
        "scenes": [
          "冷えた日",
          "神経が冴えて眠れない日",
          "筋肉が重い日"
        ],
        "caution": [
          "肌荒れする成分は要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/coreplus1/saurus_recovery_spa/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5c44.6e1a22a7.536e5c45.f5a81011/?me_id=1340644&item_id=10000036&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fcoreplus1%2Fcabinet%2F12125504%2Fimgrc0099719929.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5c44.6e1a22a7.536e5c45.f5a81011/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fcoreplus1%2Fsaurus_recovery_spa%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "プロテイン（手軽にタンパク質）",
        "category": "training",
        "imageLabel": "プロテイン（手軽にタンパク質）",
        "intro": [
          "食事の穴埋め。味の好みで続くか決まります。"
        ],
        "scenes": [
          "トレ後",
          "忙しくて肉が足りない日",
          "間食の置き換え"
        ],
        "caution": [
          "乳糖不耐など体質は要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/myprotein/12202486_new/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5d3a.d0e401d0.536e5d3b.173553e4/?me_id=1363648&item_id=10007350&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmyprotein%2Fcabinet%2Fit3%2F12202486_new_bannar.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5d3a.d0e401d0.536e5d3b.173553e4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmyprotein%2F12202486_new%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ストレッチバンド（中強度）",
        "category": "training",
        "imageLabel": "ストレッチバンド（中強度）",
        "intro": [
          "可動域を広げるより、姿勢のケア用途が地味に効きます。"
        ],
        "scenes": [
          "腰の張り",
          "胸を開く",
          "肩の前側"
        ],
        "caution": [
          "急に強く引かない。ゴム劣化も見る"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/tempostar/ts-stretchband/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5e99.502e0020.536e5e9a.7bfd2eb2/?me_id=1406187&item_id=10000169&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ftempostar%2Fcabinet%2F12625382%2F12625383%2Fts-stretch01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5e99.502e0020.536e5e9a.7bfd2eb2/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftempostar%2Fts-stretchband%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "指圧スパイクマット（突き型・収納バッグ付）",
        "category": "training",
        "imageLabel": "指圧スパイクマット",
        "intro": [
          "シャクティマットで話題になったタイプの指圧マット。寝る前に短時間だけ背中や足裏に当てて、デスクワークの切り替えに使う人もいます。商品名や仕様は店舗ごとに違うので、リンク先で突起の硬さやサイズを確認してください。"
        ],
        "scenes": [
          "就寝前の床・ヨガマットの上",
          "長時間デスクのあと",
          "足裏だけサクッと刺激したいとき"
        ],
        "caution": [
          "初めは刺激が強いことが多い。肌に傷・炎症がある部位は避ける。不安がある場合は医師に相談",
          "正規の Shakti Mat とは別商品の場合があります。価格・保証・材質は商品ページで要確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/bagray/shakti-yogamat001/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e9689.1e8b84e1.536e968a.797b05a6/?me_id=1315931&item_id=10012234&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fbagray%2Fcabinet%2Fimage06%2Fshakti-yogamat001n1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e9689.1e8b84e1.536e968a.797b05a6/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbagray%2Fshakti-yogamat001%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "足つぼマット（ローラー付き・ボード型）",
        "category": "training",
        "imageLabel": "足つぼマット",
        "intro": [
          "テレビを見ながら足だけ回せるので、面倒くさがりでも続きやすい部類です。足つぼマットは価格帯が広いので、滑り止めや突起の形はレビューと合わせて見るのがおすすめです。"
        ],
        "scenes": [
          "立ち仕事のあと",
          "在宅デスクの合間",
          "むくみが気になる日のセルフケア"
        ],
        "caution": [
          "痛みが強いときは無理しない。転倒しない平らな場所で"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/starcity/28nov24zybx010/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e974f.62b4778f.536e9750.39365a90/?me_id=1424848&item_id=10000976&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fstarcity%2Fcabinet%2Flib_img%2F202407%2F28nov24zybx01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e974f.62b4778f.536e9750.39365a90/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fstarcity%2F28nov24zybx010%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ミニ筋膜リリースガン",
        "category": "training",
        "imageLabel": "ミニ筋膜リリースガン",
        "intro": [
          "疲労回復の定番枠。デスク横の引き出しに入るサイズなら、思い出したときに太ももや肩裏に当てやすいです。プレゼントにも出しやすいカテゴリですが、音や重さは商品ごとに差があります。"
        ],
        "scenes": [
          "トレーニング後",
          "残業で腰・脚が重い日",
          "出張用に小型を探しているとき"
        ],
        "caution": [
          "骨の上・首の前面・傷部位には当てない。取扱説明の時間・強さを守る"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/misaele/mini/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e98ce.a24c4377.536e98cf.c6716018/?me_id=1428611&item_id=10000063&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fmisaele%2Fcabinet%2F12060845%2F12550983%2Fsjk001-55.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e98ce.a24c4377.536e98cf.c6716018/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fmisaele%2Fmini%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ランバーサポート（背もたれクッション）",
        "category": "pc-ai",
        "imageLabel": "ランバーサポート",
        "intro": [
          "腰痛やデスクワークの姿勢は、椅子と背中の隙間を埋めるだけで楽になることがあります。車や在宅チェア兼用の形も多いので、用途が広いものを選ぶとコスパが出ます。"
        ],
        "scenes": [
          "在宅チェア",
          "長時間のオフィスワーク",
          "運転・ドライブ"
        ],
        "caution": [
          "厚みと椅子の相性は個人差大。返品規約は商品ページで確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/iholon/pus02-jj330-212-db060/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e9b64.39a77892.536e9b65.2b84fed3/?me_id=1438510&item_id=10002520&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fiholon%2Fcabinet%2F12752454%2Fus02-jj330-212-db.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e9b64.39a77892.536e9b65.2b84fed3/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fiholon%2Fpus02-jj330-212-db060%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "フットレスト（デスク下・足置き）",
        "category": "pc-ai",
        "imageLabel": "フットレスト",
        "intro": [
          "足が浮いて血流がつらい、というタイプのデスクワークには地味に効きます。リラックスグッズというより「座り方を整える基礎インフラ」枠です。"
        ],
        "scenes": [
          "座面が高い椅子",
          "長時間キーボード作業",
          "足首の負担を減らしたいとき"
        ],
        "caution": [
          "高さは身長・椅子と相性あり。すべり止めや清掃のしやすさもチェック"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/sealinkshop/pctjd_1/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e9c33.4af350c7.536e9c34.3dfa38d5/?me_id=1435212&item_id=10000074&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fsealinkshop%2Fcabinet%2F12485165%2F12752376%2Fimgrc0148719163.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e9c33.4af350c7.536e9c34.3dfa38d5/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsealinkshop%2Fpctjd_1%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ホットアイマスク（レンジ温め・繰り返し）",
        "category": "life",
        "imageLabel": "ホットアイマスク",
        "intro": [
          "睡眠改善の入り口として手軽な部類です。使い捨てタイプと違い、ストックが減らないのが一人暮らし向き。温めすぎ注意は商品説明に従ってください。"
        ],
        "scenes": [
          "寝る前のスマホ後",
          "デスクワークで目が疲れた日",
          "リラックスタイムのルーティン"
        ],
        "caution": [
          "加熱時間は説明書厳守。肌が弱い・眼科受診中は医師に相談"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/ifdltd/4965337021509/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e9e09.08d08976.536e9e0a.cecc5ba9/?me_id=1314518&item_id=10006080&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fifdltd%2Fcabinet%2F08892698%2Fraku3%2F4965337021509_0n.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e9e09.08d08976.536e9e0a.cecc5ba9/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fifdltd%2F4965337021509%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "3Dスリープアイマスク（立体遮光）",
        "category": "life",
        "imageLabel": "3Dスリープアイマスク",
        "intro": [
          "光が入るワンルームでも睡眠の質を守りたいときに。平面タイプよりまぶたに当たりにくい形状が好きな人向けです。旅行や仮眠にも持ち出せます。"
        ],
        "scenes": [
          "朝まで路灯が気になる部屋",
          "夜勤明けの昼寝",
          "出張・新幹線の仮眠"
        ],
        "caution": [
          "顔の形によっては隙間ができることも。ベルト調整できるかを確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/oyasumi/999-000900-20/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e9f00.cba0450f.536e9f01.99484972/?me_id=1209366&item_id=10153032&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Foyasumi%2Fcabinet%2Fm999-2%2F999-000900-20img19.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e9f00.cba0450f.536e9f01.99484972/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Foyasumi%2F999-000900-20%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "リカバリーは気合いじゃなくて習慣です。道具はハードルを下げるための補助で、睡眠と食事の方が上にあります。無理に高価格路線に行かなくていいです。"
    ],
    "relatedArticleIds": [
      "home-training-gear",
      "messy-room-cleanup-7",
      "desk-messy-man-organize-7"
    ]
  },
  {
    "id": "travel-light-packing-7",
    "title": "出張・旅行で荷物を減らす便利グッズ7選",
    "category": "life",
    "date": "2026-05-04",
    "readTime": "9分",
    "summary": "荷物は減らすほど移動がラクになる。出張と旅行の両方に効く7つです。",
    "productIds": [],
    "introParagraphs": [
      "出張は「荷物が増えるほど判断が鈍る」タイプの負荷が乗ります。旅行も同じで、持ち歩く重量はできるだけ減らしたいです。",
      "元自衛官目線だと、移動装備は兼用が強い。一回の用途しかないものは最後に回します。"
    ],
    "forAudience": [
      "国内出張が多い人",
      "バックパック旅行をしたい人",
      "荷造りが遅い・忘れ物が多い人"
    ],
    "body": [],
    "picks": [
      {
        "name": "圧縮バッグ（衣類）",
        "category": "life",
        "imageLabel": "圧縮バッグ（衣類）",
        "intro": [
          "衣類の体積を減らすのが一番効きます。圧しすぎるとシワは増えるので割り切り。"
        ],
        "scenes": [
          "冬物",
          "数日分の着替え",
          "ジム兼用出張"
        ],
        "caution": [
          "防水誤認しない。別途防水袋が必要なら分ける"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/value-create/travel-pouch/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e5fca.808a149e.536e5fcb.1e590fdb/?me_id=1382613&item_id=10000010&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fvalue-create%2Fcabinet%2Ftravelpouch%2F0328_2.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e5fca.808a149e.536e5fcb.1e590fdb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fvalue-create%2Ftravel-pouch%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "トラベルボトル（TSA注意の液体）",
        "category": "life",
        "imageLabel": "トラベルボトル（TSA注意の液体）",
        "intro": [
          "現地調達が面倒な人向け。容量は規制内で。"
        ],
        "scenes": [
          "国内ホテル泊",
          "海外短期",
          "ジムサウナ後"
        ],
        "caution": [
          "規制は航空会社・国で変わるので都度確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/iwa-house/a018/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e60a4.a067d9c9.536e60a5.4c5092a0/?me_id=1432021&item_id=10000842&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fiwa-house%2Fcabinet%2F13014566%2F13122843%2Fimgrc0173003743top.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e60a4.a067d9c9.536e60a5.4c5092a0/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fiwa-house%2Fa018%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "マルチUSB充電器（GaN・小型）",
        "category": "pc-ai",
        "imageLabel": "マルチUSB充電器（GaN・小型）",
        "intro": [
          "ノートとスマホを一本化できると荷物が減ります。"
        ],
        "scenes": [
          "出張PC作業",
          "カフェ作業",
          "海外変圧は別途要検討"
        ],
        "caution": [
          "発熱・ケーブル相性はレビュー確認"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/sugarlight/gr-e9dq6adwd6/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e6180.d081ec54.536e6181.7e7e3fcb/?me_id=1426540&item_id=10185193&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fsugarlight%2Fcabinet%2Fg%2F40%2Fe9dq6adwd6-1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e6180.d081ec54.536e6181.7e7e3fcb/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fsugarlight%2Fgr-e9dq6adwd6%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "パッカブルバッグ（折りたたみ）",
        "category": "life",
        "imageLabel": "パッカブルバッグ（折りたたみ）",
        "intro": [
          "土産が増えた日の保険。薄いのが残りやすいです。"
        ],
        "scenes": [
          "出張帰り",
          "空港",
          "コンビニまとめ買い"
        ],
        "caution": [
          "耐荷重は超えない"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/ace-store/32342/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e62f5.912e8903.536e62f6.f9eaded7/?me_id=1240825&item_id=10008939&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Face-store%2Fcabinet%2Fitem2024%2Facetokyo%2F32342_24aw.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e62f5.912e8903.536e62f6.f9eaded7/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Face-store%2F32342%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "ネックピロー（収納小）",
        "category": "life",
        "imageLabel": "ネックピロー（収納小）",
        "intro": [
          "移動の睡眠負債を減らす。デカいのは持ちません。"
        ],
        "scenes": [
          "新幹線",
          "深夜バス",
          "仮眠室"
        ],
        "caution": [
          "首の長さで合う合わないがある"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/rizelife-hacks/pop6191/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e6362.e03f0f6b.536e6363.f4f6f103/?me_id=1399316&item_id=10010688&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Frizelife-hacks%2Fcabinet%2Fimage32%2Fpop6191.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e6362.e03f0f6b.536e6363.f4f6f103/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frizelife-hacks%2Fpop6191%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "洗濯用洗剤シート／粉小分け",
        "category": "life",
        "imageLabel": "洗濯用洗剤シート／粉小分け",
        "intro": [
          "長期出張でランドリー行く人向け。液体より漏れにくいことが多いです。"
        ],
        "scenes": [
          "ホテル洗濯",
          "長期出張",
          "登山ベース"
        ],
        "caution": [
          "衣類素材によっては不向き"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/tabine/wash/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e641d.617e0aa0.536e641e.a57f26ed/?me_id=1435003&item_id=10000005&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Ftabine%2Fcabinet%2Fwash%2Fwash-set-main-1002.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e641d.617e0aa0.536e641e.a57f26ed/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Ftabine%2Fwash%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      },
      {
        "name": "デジタルメモ（旅程メモでも可）",
        "category": "pc-ai",
        "imageLabel": "デジタルメモ（旅程メモでも可）",
        "intro": [
          "紙でもいい。チェックリスト化すると忘れ物が減ります。"
        ],
        "scenes": [
          "出発前夜",
          "帰宅前の荷造り",
          "仕事道具の点検"
        ],
        "caution": [
          "紛失対策は別途"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/auc-carover/gd-bsmemo/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/536e6516.8c3b62ae.536e6517.4fc36f5d/?me_id=1332282&item_id=10008331&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%40_mall%2Fauc-carover%2Fcabinet%2Fitem%2F2023%2F08%2Fgd-bsmemo-01.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/536e6516.8c3b62ae.536e6517.4fc36f5d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fauc-carover%2Fgd-bsmemo%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "旅行・出張は「持たない練習」が上達に直結します。兼用できる道具から入れて、現地調達で埋まるならそれで十分なことも多いです。"
    ],
    "relatedArticleIds": [
      "car-useful-gear-7",
      "bike-trip-gear",
      "solo-man-first-kit"
    ]
  },
  {
    "id": "nuuca-nuucasleep-guest-disaster",
    "title": "元自衛官の寝袋論：来客・防災・移動で「眠れる状態」を用意する話",
    "category": "disaster",
    "date": "2026-05-06",
    "readTime": "5分",
    "summary": "宿営の夜の経験を土台に、民間でも効く寝泊まりの備えとして Nuuca「ヌーカスリープ」をピックしました。防寒表記や価格は商品ページで要確認です。",
    "productIds": [],
    "introParagraphs": [
      "現役時代、寝袋は「かっこいい装備」というより、翌日ちゃんと動けるかの土台でした。防寒が甘いだけじゃなくて、寝返り、汗、埃、身の回りの気持ち悪さが積み上がると、判断が鈍る。これは野外でも室内でも同じで、いざという夜に「布団がない」「寝袋が古い」は、冷静さまで削ります。",
      "隊を離れてからは、その癖がそのまま来客・防災・車中泊に転がってきました。だからこそ、用途が分散しやすい寝具は「季節幅」「置き場」「洗える」の三点を先に見るようにしています。",
      "この記事で紹介する Nuuca「ヌーカスリープ」は、自分が実際に試したレビュー記事ではなく、商品ページ・仕様・レビューを前提に自分の整理のために載せているピックです。購入前は必ず最新の価格・在庫・レビューでご判断ください。"
    ],
    "forAudience": [
      "防災の寝具だけ先延ばしにしがちな人",
      "来客で布団が足りなくなりやすい人",
      "車中泊・仮眠・夜勤など移動睡眠がある人"
    ],
    "body": [],
    "picks": [
      {
        "name": "Nuuca ヌーカスリープ（寝袋・来客布団セット）",
        "category": "disaster",
        "imageLabel": "ヌーカスリープ",
        "intro": [
          "商品名上で ISO 国際基準の耐寒 −10℃ を謳うオールシーズン寄せのシュラフ／布団セット系。封筒型・コンパクト・収納袋・丸洗い寄せなど、普段の生活戦に効くキーワードが揃っています。体感は環境・服装で変わるので、レビューと仕様の併読が必須です。"
        ],
        "scenes": [
          "防災・備蓄の寝泊まり用",
          "急な来客・帰省の布団不足回避",
          "車中泊・仮眠・夜勤のリカバリー"
        ],
        "caution": [
          "価格・送料・在庫は変動します（掲載時点の表記は参考）。セット内容・寸法は商品ページで最終確認を。",
          "耐寒表現は商品側の謳いに準拠。断定の暖かさ表現は避け、自分の地域の冬と照合してください。"
        ],
        "rakutenProductUrl": "https://item.rakuten.co.jp/nuuca/10000003/",
        "imageUrl": "https://hbb.afl.rakuten.co.jp/hgb/537cde8e.5bd5a5c0.537cde8f.6ea6c2b4/?me_id=1413408&item_id=10000003&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fnuuca%2Fcabinet%2Fbiiino%2Fitem%2Fmain-image%2F20260325100233_1.jpg%3F_ex%3D240x240&s=240x240&t=picttext",
        "affiliateUrl": "https://hb.afl.rakuten.co.jp/ichiba/537cde8e.5bd5a5c0.537cde8f.6ea6c2b4/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnuuca%2F10000003%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIyNDB4MjQwIiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D"
      }
    ],
    "conclusionParagraphs": [
      "寝泊まりは地味ですが、必要になってから揃えるほど手間と焦りが増えやすい領域です。規格やマイナス表記だけで決めず、自分の用途に近いレビューを読んでから買うのが、一番コスパがいいやり方だと今でも思っています。"
    ],
    "relatedArticleIds": [
      "home-disaster-kit",
      "disaster-helpful-gear-7",
      "car-useful-gear-7"
    ]
  }
];

const app = document.querySelector("#app");
const menuButton = document.querySelector("#menuButton");
const siteNav = document.querySelector("#siteNav");

menuButton.addEventListener("click", () => {
  siteNav.classList.toggle("open");
});

siteNav.addEventListener("click", () => {
  siteNav.classList.remove("open");
});

window.addEventListener("hashchange", renderRoute);
window.addEventListener("DOMContentLoaded", renderRoute);

function getCategory(id) {
  return categories.find((category) => category.id === id);
}

function getProducts(ids) {
  return (ids || []).map((id) => products.find((product) => product.id === id)).filter(Boolean);
}

function getArticleImage(article) {
  const explicitImage = article.image || article.thumbnail || article.eyecatch;
  const pickImage = article.picks?.find((pick) => pick.imageUrl)?.imageUrl;
  const productImage = getProducts(article.productIds).find((product) => product.imageUrl)?.imageUrl;

  return explicitImage || pickImage || productImage || placeholderImage(article.title, article.category);
}

function getProductUrl(product) {
  return product.affiliateUrl || product.rakutenProductUrl || "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function articlePickCount(article) {
  if (Array.isArray(article.picks) && article.picks.length) return article.picks.length;
  return article.productIds?.length || 0;
}

function sortArticlesNewestFirst(list) {
  return [...list].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function pickResolveUrl(pick) {
  if (pick.affiliateUrl) return pick.affiliateUrl;
  if (pick.rakutenProductUrl) return rakutenAffiliateUrl(pick.rakutenProductUrl);
  if (pick.rakutenSearchKeyword) return rakutenSearchAffiliateUrl(pick.rakutenSearchKeyword);
  return "";
}

function normalizeParagraphs(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function renderArticleIntroAudience(article) {
  const intro = normalizeParagraphs(article.introParagraphs)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
  const audience = article.forAudience?.length
    ? `<div class="summary-box audience-box"><h2>この記事はこんな人向け</h2><ul>${article.forAudience.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div>`
    : "";
  const introBlock = intro ? `<div class="article-intro">${intro}</div>` : "";
  return `${introBlock}${audience}`;
}

function renderPickBlock(pick, index) {
  const url = pickResolveUrl(pick);
  const cat = getCategory(pick.category);
  const catName = cat?.name || "装備";
  const imgSrc = pick.imageUrl || placeholderImage(pick.imageLabel || pick.name, pick.category);
  const btn = url
    ? `<a class="button rakuten" href="${escapeHtml(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer">楽天で見る</a>`
    : `<button class="button disabled" type="button" disabled>リンク準備中</button>`;
  const mediaOpen = url
    ? `<a class="product-media" href="${escapeHtml(url)}" target="_blank" rel="nofollow sponsored noopener noreferrer" aria-label="${escapeHtml(pick.name)}">`
    : `<div class="product-media" role="img" aria-label="${escapeHtml(pick.name)}">`;
  const mediaClose = url ? "</a>" : "</div>";
  const intros = normalizeParagraphs(pick.intro)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
  const scenes = pick.scenes?.length
    ? `<h3 class="pick-subheading">こんな場面で使える</h3><ul>${pick.scenes.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
    : "";
  const caution = pick.caution?.length
    ? `<h3 class="pick-subheading">注意点</h3><ul>${pick.caution.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
    : "";
  const pickIndex0 = Math.max(0, index - 1);

  return `
    <section class="pick-block article-section" id="pick-${index}">
      <div class="pick-kicker">ピック ${index}</div>
      <h2>${escapeHtml(pick.name)}</h2>
      <div class="pick-layout">
        ${mediaOpen}<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(pick.name)}" loading="lazy" />${mediaClose}
        <div class="pick-body">
          <div class="product-category">${escapeHtml(catName)}</div>
          ${intros}
          ${scenes}
          ${caution}
          <p class="editor-link-hint">楽天リンク差し替え：<code>app.js</code> の該当記事の <code>picks[${pickIndex0}]</code> に、<code>rakutenProductUrl</code> か <code>affiliateUrl</code> を入れてください。仮のときは <code>rakutenSearchKeyword</code>。画像は <code>imageUrl</code>。</p>
          ${btn}
        </div>
      </div>
    </section>
  `;
}

function renderConclusionRelated(article) {
  const conclusionParas = normalizeParagraphs(article.conclusionParagraphs);
  const conclusion = conclusionParas.length
    ? `<div class="summary-box"><h2>まとめ</h2>${conclusionParas.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>`
    : "";
  const relatedIds = article.relatedArticleIds || [];
  const relatedItems = relatedIds
    .map((id) => articles.find((a) => a.id === id))
    .filter(Boolean)
    .map((a) => `<li><a href="article/${escapeHtml(a.id)}/index.html">${escapeHtml(a.title)}</a></li>`)
    .join("");
  const related = relatedItems
    ? `<div class="related-articles"><h2>関連記事</h2><ul class="related-list">${relatedItems}</ul></div>`
    : "";
  return `${conclusion}${related}`;
}

function renderRoute() {
  const hash = window.location.hash || "#/";
  const [path, queryString = ""] = hash.slice(1).split("?");
  const params = new URLSearchParams(queryString);

  if (path.startsWith("/article/")) {
    renderArticle(path.replace("/article/", ""));
  } else if (path.startsWith("/category/")) {
    renderArticleList({ categoryId: path.replace("/category/", ""), query: params.get("q") || "" });
  } else if (path === "/articles") {
    renderArticleList({ query: params.get("q") || "" });
  } else if (path === "/profile") {
    renderProfilePage();
  } else {
    renderHome();
  }

  app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "auto" });
}

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">元自衛官が選ぶ装備レビュー</p>
        <h1>元自衛官が選ぶ、暮らしをラクにする装備レビュー</h1>
        <p class="lead">寮生活・一人暮らし・車・バイク・デスク周り・防災・日用品で役立つアイテムを、元自衛官目線でわかりやすく紹介します。</p>
        <p class="ad-notice">当サイトはアフィリエイト広告を利用しています。</p>
        <div class="hero-actions">
          <a class="button" href="#/articles">記事を読む</a>
          <a class="button secondary" href="#/category/disaster">防災装備を見る</a>
        </div>
      </div>
      <div class="hero-panel" aria-label="装備レビューの概要">
        <div class="hero-panel-inner">
          <span class="panel-label">FIELD NOTES</span>
          <strong>買う前に、用途・置き場所・使う頻度を見る。</strong>
          <p>生活導線に入るものだけが、本当に使える装備になります。</p>
          <div class="stats">
            <div class="stat"><b>${articles.length}</b><small>レビュー記事</small></div>
            <div class="stat"><b>${products.length}</b><small>商品カード</small></div>
            <div class="stat"><b>${categories.length}</b><small>カテゴリ</small></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>カテゴリから探す</h2>
          <p>生活、PC作業、筋トレ、旅、防災。一人暮らしの装備選びを迷いにくくします。</p>
        </div>
      </div>
      <div class="category-grid">
        ${categories.map(renderCategoryButton).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>まず見てほしい商品</h2>
          <p>クリックしやすい商品カードに整理しました。気になるものは楽天で価格を確認できます。</p>
        </div>
      </div>
      <div class="product-grid">
        ${products.slice(0, 6).map(renderProductCard).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>新着記事</h2>
          <p>装備選びの考え方と、記事内で紹介している商品をまとめています。</p>
        </div>
        <a class="button secondary" href="#/articles">記事一覧へ</a>
      </div>
      <div class="article-grid">
        ${sortArticlesNewestFirst(articles).slice(0, 6).map(renderArticleCard).join("")}
      </div>
    </section>
    ${renderProfileBox()}
  `;
}

function renderArticleList({ categoryId = "", query = "" } = {}) {
  const normalized = query.trim().toLowerCase();
  const category = getCategory(categoryId);
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = categoryId ? article.category === categoryId : true;
    const categoryName = getCategory(article.category)?.name || "";
    const haystack = `${article.title} ${article.summary} ${categoryName}`.toLowerCase();
    return matchesCategory && (!normalized || haystack.includes(normalized));
  });
  const filteredProducts = products.filter((product) => (categoryId ? product.category === categoryId : true));

  app.innerHTML = `
    <section class="page-hero">
      <p class="eyebrow">${category ? "カテゴリ" : "記事一覧"}</p>
      <h1>${category ? category.name : "記事一覧"}</h1>
      <p class="lead">${category ? category.description : "キーワード検索とカテゴリで、必要な装備レビューを探せます。"}</p>
      <p class="ad-notice">当サイトはアフィリエイト広告を利用しています。</p>
      <form class="search-panel" id="searchForm">
        <input id="searchInput" type="search" value="${escapeHtml(query)}" placeholder="例：収納、防災、バイク、筋トレ" aria-label="記事を検索" />
        <button class="button" type="submit">検索</button>
      </form>
      <div class="category-list">
        <a class="chip ${!categoryId ? "active" : ""}" href="#/articles">すべて</a>
        ${categories.map((item) => `<a class="chip ${item.id === categoryId ? "active" : ""}" href="#/category/${item.id}">${item.name}</a>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>${category ? `${category.name}の記事` : "記事カード"}</h2>
          <p>読みたいテーマを選んで、記事下の商品まとめから価格を確認できます。</p>
        </div>
      </div>
      <div class="article-grid">
        ${filteredArticles.length ? filteredArticles.map(renderArticleCard).join("") : `<div class="empty-state">条件に合う記事がありません。別のキーワードで検索してください。</div>`}
      </div>
    </section>
    <section class="section">
      <div class="section-head">
        <div>
          <h2>${category ? `${category.name}の商品` : "商品カード一覧"}</h2>
          <p>商品画像、向いている人、楽天リンクをまとめています。</p>
        </div>
      </div>
      <div class="product-grid">
        ${filteredProducts.map(renderProductCard).join("")}
      </div>
    </section>
  `;

  document.querySelector("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = document.querySelector("#searchInput").value.trim();
    const base = categoryId ? `#/category/${categoryId}` : "#/articles";
    window.location.hash = value ? `${base}?q=${encodeURIComponent(value)}` : base;
  });
}

function renderArticle(id) {
  const article = articles.find((item) => item.id === id);
  if (!article) {
    app.innerHTML = `<section class="section"><div class="empty-state">記事が見つかりませんでした。<br /><a class="button" href="#/articles">記事一覧へ戻る</a></div></section>`;
    return;
  }

  const category = getCategory(article.category);
  const hasPicks = Array.isArray(article.picks) && article.picks.length;
  const productIds = article.productIds || [];
  const articleProducts = hasPicks ? [] : getProducts(productIds);
  const sameCategoryProducts = hasPicks
    ? []
    : products.filter((product) => product.category === article.category && !productIds.includes(product.id));

  const bodySections = (article.body || []).map(renderArticleSection).join("");
  const picksSection = hasPicks
    ? `<h2 class="picks-section-title">今回ピックアップする${article.picks.length}つ</h2>${article.picks.map((pick, i) => renderPickBlock(pick, i + 1)).join("")}`
    : "";
  const catalogSummary = hasPicks
    ? ""
    : `
          <div class="summary-box">
            <h2>この記事で紹介した商品まとめ</h2>
            <p>気になる装備は、価格・レビュー・在庫を楽天で確認してから選んでください。</p>
          </div>
          <div class="product-grid compact">
            ${articleProducts.map(renderProductCard).join("")}
          </div>
          ${
            sameCategoryProducts.length
              ? `
                <div class="summary-box">
                  <h2>同カテゴリの商品</h2>
                  <p>${category.name}でほかにチェックしたい装備です。</p>
                </div>
                <div class="product-grid compact">
                  ${sameCategoryProducts.map(renderProductCard).join("")}
                </div>
              `
              : ""
          }
        `;

  app.innerHTML = `
    <div class="article-layout">
      <article class="article-main">
        <header class="article-hero">
          <p class="eyebrow">${category.name}</p>
          <h1>${article.title}</h1>
          <p class="lead">${article.summary}</p>
          <p class="article-meta">${article.date} ・ 読了目安 ${article.readTime}</p>
          <p class="ad-notice">当サイトはアフィリエイト広告を利用しています。</p>
        </header>
        <div class="article-content">
          ${renderArticleIntroAudience(article)}
          ${bodySections}
          ${picksSection}
          ${catalogSummary}
          ${renderConclusionRelated(article)}
        </div>
      </article>
      <aside class="sidebar">
        ${renderProfileBox()}
        <div class="profile-box">
          <h3>同じカテゴリの記事</h3>
          <p>${category.description}</p>
          <div class="section-actions">
            <a class="button secondary" href="#/category/${category.id}">${category.name}を見る</a>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderProfilePage() {
  app.innerHTML = `
    <section class="page-hero">
      <p class="eyebrow">プロフィール</p>
      <h1>元自衛官の視点で、使える装備だけを紹介します。</h1>
      <p class="lead">狭い部屋、寮生活、訓練後の疲れ、長距離移動。そんな現場感をベースに、楽天で探せる便利グッズをレビューします。</p>
      <p class="ad-notice">当サイトはアフィリエイト広告を利用しています。</p>
    </section>
    <section class="section">
      ${renderProfileBox()}
    </section>
  `;
}

function renderArticleSection(section) {
  return `
    <section class="article-section">
      <h2>${section.heading}</h2>
      ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}
    </section>
  `;
}

function renderCategoryButton(category) {
  return `
    <a class="category-button" href="#/category/${category.id}">
      <span>${category.name}</span>
      <small>${category.description}</small>
    </a>
  `;
}

function renderArticleCard(article) {
  const category = getCategory(article.category);
  const pickTotal = articlePickCount(article);
  const articleUrl = `./article/${article.id}/index.html`;
  const imageUrl = getArticleImage(article);

  return `
    <article class="article-card">
      <a class="article-thumb" href="${articleUrl}" aria-label="${escapeHtml(article.title)}">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(article.title)}" loading="lazy" />
        <span class="article-category-badge">${category.name}</span>
        <strong class="article-count-badge">${pickTotal}ピック</strong>
      </a>
      <div class="article-body">
        <div class="article-meta">${article.date} ・ ${article.readTime}</div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <a class="button secondary" href="${articleUrl}">記事を読む</a>
      </div>
    </article>
  `;
}

function renderProductCard(product) {
  const category = getCategory(product.category);
  const productUrl = getProductUrl(product);
  const imageUrl = product.imageUrl || placeholderImage(product.name, product.category);
  const button = productUrl
    ? `<a class="button rakuten" href="${productUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer">楽天で見る</a>`
    : `<button class="button disabled" type="button" disabled>リンク準備中</button>`;

  return `
    <article class="product-card">
      <a class="product-media" ${productUrl ? `href="${productUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer"` : ""} aria-label="${product.name}">
        <img src="${imageUrl}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="product-content">
        <div class="product-category">${category.name}</div>
        <h3>${product.name}</h3>
        <dl>
          <div>
            <dt>おすすめポイント</dt>
            <dd>${product.description}</dd>
          </div>
          <div>
            <dt>向いている人</dt>
            <dd>${product.recommendedFor}</dd>
          </div>
        </dl>
        ${button}
      </div>
    </article>
  `;
}

function renderProfileBox() {
  return `
    <section class="profile-box">
      <div class="profile-head">
        <div class="avatar">元</div>
        <div>
          <h3>運営者プロフィール</h3>
          <div class="article-meta">元自衛官 / 装備レビュー</div>
        </div>
      </div>
      <p>元自衛官の目線で、生活・PC作業・筋トレ・バイク旅・防災に役立つ装備を紹介します。基準は「実際に使うなら、面倒が減るか」。派手さより、置き場所・耐久性・毎日の使いやすさを重視します。</p>
      <p>紹介する商品は、レビュー、価格、サイズ、使う場面を見ながら選びます。寮生活や一人暮らしの狭い部屋でも使いやすいか、防災や旅でも兼用できるかを、できるだけ現場目線で確認していきます。</p>
    </section>
  `;
}

