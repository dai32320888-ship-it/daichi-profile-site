const categories = [
  { id: "life", name: "生活装備", description: "鍵、収納、家事など、毎日の小さな手間を減らす装備。" },
  { id: "pc-ai", name: "PC・AI作業環境", description: "デスク周りを整えて、長時間作業をラクにする装備。" },
  { id: "training", name: "筋トレ装備", description: "自宅でも続けやすい、省スペースな家トレ装備。" },
  { id: "bike", name: "バイク旅装備", description: "雨、積載、ナビの不安を減らすツーリング装備。" },
  { id: "disaster", name: "防災装備", description: "普段使いしながら、災害時にも役立つ備え。" },
  { id: "solo", name: "一人暮らし準備", description: "寮生活やワンルームで生活導線を整える初期装備。" }
];

const RAKUTEN_AFFILIATE_PATH = "53663d8f.6b4c8828.53663d90.626681b4";

function rakutenAffiliateUrl(rakutenProductUrl) {
  return `https://hb.afl.rakuten.co.jp/ichiba/${RAKUTEN_AFFILIATE_PATH}/?pc=${encodeURIComponent(rakutenProductUrl)}&link_type=hybrid_url`;
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
    imageUrl: placeholderImage("ケーブルトレー", "pc-ai"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/apricot-r/3605-a260/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/apricot-r/3605-a260/",
    searchKeyword: "ケーブルトレー デスク下"
  },
  {
    id: "folding-storage",
    name: "折りたたみ収納ボックス",
    category: "solo",
    description: "使わない時はたためて、衣類や小物をまとめやすい。",
    recommendedFor: "寮生活・一人暮らしで収納が少ない人",
    imageUrl: placeholderImage("折りたたみ収納", "solo"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/risu-proshop/63567-5/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/risu-proshop/63567-5/",
    searchKeyword: "収納ボックス 折りたたみ"
  },
  {
    id: "adjustable-dumbbell",
    name: "可変式ダンベル20kg",
    category: "training",
    description: "重量を変えられるので、自宅トレの幅が広がる。",
    recommendedFor: "家で胸・肩・腕・背中を鍛えたい人",
    imageUrl: placeholderImage("可変式ダンベル", "training"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/sportsmonster/flex32-2/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/sportsmonster/flex32-2/",
    searchKeyword: "可変式ダンベル 20kg"
  },
  {
    id: "door-gym",
    name: "ドアジム・懸垂バー",
    category: "training",
    description: "省スペースで懸垂やぶら下がり運動ができる。",
    recommendedFor: "背中を鍛えたい人、ジムに行けない日も鍛えたい人",
    imageUrl: placeholderImage("ドアジム", "training"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/danimo/8265139/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/danimo/8265139/",
    searchKeyword: "懸垂 ドアジム"
  },
  {
    id: "waterproof-touring-bag",
    name: "防水ツーリングバッグ",
    category: "bike",
    description: "雨の日でも着替えや荷物を濡らしにくい。",
    recommendedFor: "バイク旅・キャンプツーリングをする人",
    imageUrl: placeholderImage("防水バッグ", "bike"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/flyingfish/60018/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/flyingfish/60018/",
    searchKeyword: "バイク ツーリング 防水バッグ"
  },
  {
    id: "bike-phone-holder",
    name: "バイク用スマホホルダー",
    category: "bike",
    description: "スマホナビを確認しやすくなり、長距離移動のストレスを減らせる。",
    recommendedFor: "スマホナビを使ってツーリングする人",
    imageUrl: placeholderImage("スマホホルダー", "bike"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/kaedear/kdr-m8s/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/kaedear/kdr-m8s/",
    searchKeyword: "バイク スマホホルダー 防水"
  },
  {
    id: "disaster-kit",
    name: "防災セット1人用",
    category: "disaster",
    description: "非常食・ライト・衛生用品などをまとめて準備できる。",
    recommendedFor: "一人暮らしで防災グッズをまだ揃えていない人",
    imageUrl: placeholderImage("防災セット", "disaster"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/relieved-life/re-l-bousai/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/relieved-life/re-l-bousai/",
    searchKeyword: "防災セット 1人用"
  },
  {
    id: "emergency-toilet",
    name: "簡易トイレ 防災用",
    category: "disaster",
    description: "災害時に一番困りやすいトイレ問題の備えになる。",
    recommendedFor: "最低限の防災備蓄を整えたい人",
    imageUrl: placeholderImage("簡易トイレ", "disaster"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/torreya-shop/100000041/"),
    rakutenProductUrl: "https://item.rakuten.co.jp/torreya-shop/100000041/",
    searchKeyword: "簡易トイレ 防災 50回"
  },
  {
    id: "led-lantern",
    name: "LEDランタン 充電式",
    category: "disaster",
    description: "停電時やキャンプ、車中泊でも使いやすい明かり装備。",
    recommendedFor: "防災・アウトドア兼用で使えるライトがほしい人",
    imageUrl: placeholderImage("LEDランタン", "disaster"),
    affiliateUrl: rakutenAffiliateUrl("https://item.rakuten.co.jp/k-power/ur002/"),
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
  return ids.map((id) => products.find((product) => product.id === id)).filter(Boolean);
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
        <p class="lead">寮生活・一人暮らし・筋トレ・バイク旅・防災で役立つアイテムを、元自衛官目線でわかりやすく紹介します。</p>
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
        ${articles.slice(0, 3).map(renderArticleCard).join("")}
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
  const articleProducts = getProducts(article.productIds);
  const sameCategoryProducts = products.filter((product) => product.category === article.category && !article.productIds.includes(product.id));

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
          ${article.body.map(renderArticleSection).join("")}
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
  const linkedProducts = getProducts(article.productIds);
  const articleUrl = `./article/${article.id}/`;

  return `
    <article class="article-card">
      <a class="article-thumb" href="${articleUrl}">
        <span>${category.name}</span>
        <strong>${linkedProducts.length}商品</strong>
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
    ? `<a class="button rakuten" href="${productUrl}" target="_blank" rel="nofollow sponsored noopener noreferrer">楽天で価格を見る</a>`
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
