const productCards = [
  {
    name: "個包装のお菓子",
    reason: "人数が読みにくい職場や取引先でも配りやすく、相手に負担をかけにくい定番です。",
    target: "取引先、同僚、上司、帰省先",
    budget: "1,000円から5,000円",
    tags: ["取引先", "同僚", "上司", "親", "無難", "消えもの", "取引先への手土産", "帰省土産", "お礼", "謝罪", "3,000円以内", "5,000円以内"],
    avoid: ["食べ物NG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/business-gift-client/"
  },
  {
    name: "焼き菓子ギフト",
    reason: "好みが分かれにくく、見た目もきちんとしているため、手土産やお礼に使いやすい候補です。",
    target: "友達、親、取引先、上司",
    budget: "2,000円から5,000円",
    tags: ["取引先", "友達", "親", "上司", "無難", "センス良く見える", "消えもの", "取引先への手土産", "お礼", "帰省土産"],
    avoid: ["食べ物NG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/gift-under-3000/"
  },
  {
    name: "コーヒー・紅茶ギフト",
    reason: "消えもので保管しやすく、甘いものが苦手な相手にも選びやすい贈り物です。",
    target: "上司、取引先、親、同僚",
    budget: "1,500円から6,000円",
    tags: ["取引先", "上司", "親", "同僚", "実用的", "消えもの", "無難", "取引先への手土産", "退職祝い", "お礼"],
    avoid: ["食べ物NG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/business-gift-client/"
  },
  {
    name: "上質タオルギフト",
    reason: "実用的で相手の生活に残りすぎず、退職祝いや引っ越し祝いにも合わせやすいです。",
    target: "上司、親、祖父母、同僚",
    budget: "3,000円から10,000円",
    tags: ["上司", "親", "祖父母", "同僚", "高級感", "実用的", "退職祝い", "引っ越し祝い", "結婚祝い", "5,000円以内", "10,000円以内"],
    avoid: [],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/retirement-gift-boss/"
  },
  {
    name: "タンブラー",
    reason: "職場でも自宅でも使いやすく、男性向け・女性向けどちらにも寄せやすい万能候補です。",
    target: "彼氏、上司、同僚、30代男性",
    budget: "2,000円から8,000円",
    tags: ["彼氏", "上司", "同僚", "男性", "30代", "40代", "実用的", "高級感", "退職祝い", "誕生日", "5,000円以内"],
    avoid: [],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/practical-gift-man-30s/"
  },
  {
    name: "名入れボールペン",
    reason: "ビジネス感があり、節目の贈り物としてきちんと見えやすいアイテムです。",
    target: "上司、取引先、同僚、後輩",
    budget: "3,000円から10,000円",
    tags: ["上司", "取引先", "同僚", "後輩", "男性", "女性", "高級感", "実用的", "退職祝い", "お礼", "10,000円以内"],
    avoid: ["個性的すぎるものNG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/retirement-gift-boss/"
  },
  {
    name: "コスメ雑貨",
    reason: "リップケアやハンドケアなど軽めの雑貨なら、特別感を出しつつ重くなりにくいです。",
    target: "彼女、女友達、20代女性",
    budget: "1,500円から6,000円",
    tags: ["彼女", "友達", "女性", "20代", "30代", "おしゃれ", "センス良く見える", "誕生日", "お礼", "3,000円以内", "5,000円以内"],
    avoid: ["香りものNG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/birthday-gift-woman-20s/"
  },
  {
    name: "アクセサリー小物",
    reason: "小ぶりで普段使いしやすいものを選ぶと、誕生日らしい華やかさを出せます。",
    target: "彼女、20代女性",
    budget: "3,000円から10,000円以上",
    tags: ["彼女", "女性", "20代", "30代", "おしゃれ", "高級感", "センス良く見える", "誕生日", "10,000円以内", "それ以上"],
    avoid: ["高すぎるものNG", "個性的すぎるものNG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/birthday-gift-woman-20s/"
  },
  {
    name: "フラワーギフト",
    reason: "写真映えしやすく、誕生日やお祝いの気持ちをまっすぐ伝えられます。",
    target: "彼女、親、友達、祖父母",
    budget: "3,000円から10,000円",
    tags: ["彼女", "親", "友達", "祖父母", "女性", "おしゃれ", "高級感", "誕生日", "退職祝い", "結婚祝い", "お礼"],
    avoid: ["個性的すぎるものNG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/birthday-gift-woman-20s/"
  },
  {
    name: "ガジェット小物",
    reason: "実用性が高く、好みを外しても使い道が残りやすい男性向けの定番です。",
    target: "彼氏、30代男性、同僚、後輩",
    budget: "2,000円から8,000円",
    tags: ["彼氏", "同僚", "後輩", "男性", "20代", "30代", "40代", "実用的", "面白い", "誕生日", "お礼", "5,000円以内"],
    avoid: [],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/practical-gift-man-30s/"
  },
  {
    name: "キーケース・革小物",
    reason: "毎日使いやすく、価格帯を調整すればカジュアルにもきちんとした贈り物にもできます。",
    target: "彼氏、男性、上司、同僚",
    budget: "3,000円から15,000円",
    tags: ["彼氏", "上司", "同僚", "男性", "30代", "40代", "実用的", "高級感", "誕生日", "退職祝い", "10,000円以内", "それ以上"],
    avoid: ["高すぎるものNG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/practical-gift-man-30s/"
  },
  {
    name: "入浴剤・バスギフト",
    reason: "相手に気を遣わせにくく、女友達や同僚への軽い誕生日ギフトに向いています。",
    target: "友達、同僚、後輩",
    budget: "1,000円から3,000円",
    tags: ["友達", "同僚", "後輩", "女性", "20代", "30代", "おしゃれ", "消えもの", "センス良く見える", "誕生日", "お礼", "3,000円以内"],
    avoid: ["香りものNG"],
    rakutenUrl: "#",
    amazonUrl: "#",
    detailUrl: "article/birthday-gift-female-friend/"
  }
];

const articles = [
  {
    slug: "birthday-gift-woman-20s",
    title: "20代女性への誕生日プレゼントおすすめ",
    description: "20代女性に贈る誕生日プレゼントの選び方、重くなりにくいおすすめカテゴリ、避けたいプレゼントを紹介します。",
    intro: "20代女性への誕生日プレゼントは、特別感と普段使いのしやすさのバランスが大切です。相手との距離感に合わせて、消耗品や小物から選ぶと失敗しにくくなります。",
    points: ["相手の普段の服装や持ち物に近い雰囲気を選ぶ", "高価すぎるものは関係性によって重く見えるため注意する", "香りや色味の好みが分かれるものは定番寄りにする"],
    categories: ["コスメ雑貨", "アクセサリー小物", "フラワーギフト", "ルームウェア", "カフェチケット"],
    mistakes: ["好みが強く出る香水", "サイズ選びが難しい服", "高額すぎるブランド品"]
  },
  {
    slug: "practical-gift-man-30s",
    title: "30代男性への実用的なプレゼントおすすめ",
    description: "30代男性に贈りやすい実用的なプレゼントを、ビジネス小物、ガジェット、タンブラーなどのカテゴリで紹介します。",
    intro: "30代男性には、仕事や日常で自然に使える実用的なアイテムが選びやすいです。派手さよりも品質や使い勝手を重視すると、長く使ってもらいやすくなります。",
    points: ["仕事用か休日用かを先に決める", "すでに持っていても困りにくい消耗品や小物を選ぶ", "色は黒、ネイビー、グレーなど落ち着いたものが無難"],
    categories: ["ガジェット小物", "タンブラー", "キーケース・革小物", "ビジネス小物", "コーヒーギフト"],
    mistakes: ["趣味性が強すぎる雑貨", "サイズが必要な服飾品", "職場で使いにくい派手なデザイン"]
  },
  {
    slug: "business-gift-client",
    title: "取引先に失礼にならない手土産おすすめ",
    description: "取引先への手土産で失礼になりにくい、個包装のお菓子、焼き菓子、コーヒーギフト、老舗の和菓子などを紹介します。",
    intro: "取引先への手土産は、華やかさよりも配りやすさと失礼のなさが大切です。個包装、日持ち、常温保存を意識すると、相手先で扱いやすい贈り物になります。",
    points: ["個包装で人数より少し多めに入ったものを選ぶ", "常温で持ち運べるものを優先する", "謝罪時は派手すぎるパッケージを避ける"],
    categories: ["個包装のお菓子", "焼き菓子ギフト", "コーヒー・紅茶ギフト", "老舗の和菓子", "小分けのせんべい"],
    mistakes: ["切り分けが必要なケーキ", "要冷蔵で管理が難しいもの", "香りが強すぎる食品"]
  },
  {
    slug: "retirement-gift-boss",
    title: "上司への退職祝いおすすめ",
    description: "上司への退職祝いに向く、上質タオル、タンブラー、名入れボールペン、上質なお菓子などを紹介します。",
    intro: "上司への退職祝いは、感謝が伝わりつつ個人的になりすぎないものが向いています。職場一同で贈る場合は、少し上質に見える実用品や消えものが選びやすいです。",
    points: ["職場での関係性に合う価格帯にする", "持ち帰りやすい大きさを選ぶ", "名入れはシンプルな表記にとどめる"],
    categories: ["上質タオルギフト", "タンブラー", "名入れボールペン", "上質なお菓子", "花束・フラワーギフト"],
    mistakes: ["冗談が強すぎる記念品", "大きくて持ち帰りにくいもの", "好みが分かれる香りもの"]
  },
  {
    slug: "gift-under-3000",
    title: "3,000円以内でセンスよく見えるプレゼントおすすめ",
    description: "3,000円以内でも安っぽく見えにくい、焼き菓子、入浴剤、コーヒー、ハンドケアなどのプレゼントを紹介します。",
    intro: "3,000円以内のプレゼントは、価格よりも見せ方と実用性で印象が変わります。小さくてもパッケージが整ったもの、使い切れるものを選ぶとセンス良く見えます。",
    points: ["箱やラッピングがきれいなものを選ぶ", "単品より小さなセット品を選ぶ", "相手に気を遣わせない価格帯として活かす"],
    categories: ["焼き菓子ギフト", "入浴剤・バスギフト", "コーヒー・紅茶ギフト", "ハンドケア", "ミニタオル"],
    mistakes: ["安さが見えやすい雑貨", "用途がわかりにくい置物", "相手の好みに寄せすぎた個性的なもの"]
  },
  {
    slug: "birthday-gift-female-friend",
    title: "女友達に重すぎない誕生日プレゼントおすすめ",
    description: "女友達への誕生日プレゼントで重くなりにくい、入浴剤、コスメ雑貨、お菓子、カフェギフトなどを紹介します。",
    intro: "女友達への誕生日プレゼントは、気軽に受け取れて日常で使えるものが向いています。相手の好みを決めつけすぎず、消えものや軽めの雑貨を選ぶと自然です。",
    points: ["高価すぎない価格帯にする", "自分では少しだけ買わないものを選ぶ", "香りや色は万人向けに寄せる"],
    categories: ["入浴剤・バスギフト", "コスメ雑貨", "焼き菓子ギフト", "カフェチケット", "ハンドクリーム"],
    mistakes: ["恋人感が強いアクセサリー", "好みが分かれる香水", "収納に困る大きな雑貨"]
  }
];

function scoreProduct(product, answers) {
  const terms = [answers.recipient, answers.gender, answers.age, answers.budget, answers.scene, answers.mood].filter(Boolean);
  let score = terms.reduce((sum, term) => sum + (product.tags.includes(term) ? 3 : 0), 0);
  if (answers.avoid.some((avoid) => product.avoid.includes(avoid))) score -= 8;
  if (answers.mood === "無難" && product.avoid.includes("個性的すぎるものNG")) score += 1;
  if (answers.scene === "謝罪" && product.tags.includes("高級感")) score -= 2;
  return score;
}

function renderProducts(items, container) {
  const basePrefix = document.body.dataset.article ? "../../" : "";
  const detailHref = (url) => url === "#" || url.startsWith("http") ? url : `${basePrefix}${url}`;
  container.innerHTML = items.map((item) => `
    <article class="product-card">
      <h3>${item.name}</h3>
      <p>${item.reason}</p>
      <div class="meta">
        <span><strong>向いている相手:</strong> ${item.target}</span>
        <span><strong>予算目安:</strong> ${item.budget}</span>
      </div>
      <div class="card-actions">
        <a class="button shop" href="${item.rakutenUrl}" rel="nofollow sponsored">楽天で見る</a>
        <a class="button shop" href="${item.amazonUrl}" rel="nofollow sponsored">Amazonで見る</a>
        <a class="button detail" href="${detailHref(item.detailUrl)}">詳しく見る</a>
      </div>
    </article>
  `).join("");
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

    results.innerHTML = `
      <div class="section-heading">
        <p class="breadcrumb">ホーム &gt; 診断結果</p>
        <h2>おすすめ候補</h2>
        <p class="result-summary">${answers.recipient}・${answers.scene}・${answers.mood}に合わせて、扱いやすい候補を選びました。リンク先は広告を含む予定です。</p>
      </div>
      <div class="product-grid"></div>
    `;
    renderProducts(ranked, results.querySelector(".product-grid"));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderArticleList() {
  const list = document.querySelector("#articleList");
  if (!list) return;
  list.innerHTML = articles.map((article) => `
    <a class="article-link" href="article/${article.slug}/">
      <h3>${article.title}</h3>
      <p>${article.description}</p>
      <span>記事を読む</span>
    </a>
  `).join("");
}

function renderArticlePage() {
  const body = document.body;
  const slug = body.dataset.article;
  if (!slug) return;
  const article = articles.find((item) => item.slug === slug);
  const container = document.querySelector("#articleContent");
  const side = document.querySelector("#sideLinks");
  if (!article || !container) return;
  const relatedProducts = productCards.filter((product) => product.detailUrl.includes(slug)).slice(0, 5);
  const fallbackProducts = relatedProducts.length ? relatedProducts : productCards.slice(0, 5);

  container.innerHTML = `
    <p class="breadcrumb"><a href="../../">ホーム</a> &gt; 記事 &gt; ${article.title}</p>
    <p class="eyebrow">広告を含みます</p>
    <h1>${article.title}</h1>
    <p>${article.intro}</p>
    <h2>選び方のポイント</h2>
    <ul>${article.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    <h2>おすすめカテゴリ5つ</h2>
    <ul>${article.categories.map((category) => `<li>${category}</li>`).join("")}</ul>
    <h2>失敗しやすいプレゼント</h2>
    <ul>${article.mistakes.map((mistake) => `<li>${mistake}</li>`).join("")}</ul>
    <h2>商品リンク用カード</h2>
    <div class="product-grid" id="articleProducts"></div>
    <h2>まとめ</h2>
    <p>${article.title.replace("おすすめ", "")}は、相手との距離感、予算、持ち帰りやすさをそろえて考えると選びやすくなります。迷ったときは、実用的なものや消えものから候補を絞るのがおすすめです。</p>
  `;
  renderProducts(fallbackProducts, document.querySelector("#articleProducts"));

  if (side) {
    side.innerHTML = `<strong>関連記事</strong>` + articles
      .filter((item) => item.slug !== slug)
      .slice(0, 5)
      .map((item) => `<a href="../${item.slug}/">${item.title}</a>`)
      .join("");
  }
}

setupDiagnosis();
renderArticleList();
renderArticlePage();
