## いま起きていること（Google検索に出ない）

- **公開URLはあるのに、トップページが JavaScript 依存**になっていて、Google が十分にレンダリングできないと内容や記事リンクを拾いにくい状態です（原因候補 **J**）。
- **`robots.txt` が未配置**でした（原因候補 **E** の確認ポイント）。
- **canonical / sitemap のベースURLがコードにベタ書き固定**で、公開URLを変えるとズレやすい構造でした（原因候補 **D / G** の温床）。

このリポジトリでは、`npm run build` により **トップをHTMLとして生成**し、記事一覧の「素のリンク」を含めることで、Google が JS を実行できない場合でもクロールできる状態に寄せています。

---

## 1) このサイトが本当にネット上に公開されているか確認

### 公開URLが存在するか

- 公開URL候補（canonical に入っているもの）
  - `https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review/`

### 公開URLでトップページが開けるか

- ブラウザで公開URLを開き、表示されることを確認
- 可能なら PowerShell でHTTP確認（例）

```powershell
$u='https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review/';
(Invoke-WebRequest -Uri $u -UseBasicParsing).StatusCode
```

### どこにデプロイされているか見分ける

- **GitHub Pages**: `*.github.io` 配下で表示される
- **Netlify**: `*.netlify.app` もしくは `netlify.toml` があることが多い
- **Vercel**: `*.vercel.app` もしくは `vercel.json` があることが多い

---

## 2) Google Search Console 登録済みか確認する手順

### 手順（チェックリスト）

- Google Search Console を開く
- 左上のプロパティ切り替えから **登録済みプロパティ一覧**を見る
- このサイトのURL（公開URL）があるか確認
- 登録タイプがどちらか確認
  - **URL プレフィックス**（例：`https://example.com/`）
  - **ドメイン**（例：`example.com`）
- **所有権の確認**が完了しているか確認（未完了なら再確認が必要）
- 左メニューの「**サイトマップ**」で次を確認
  - `sitemap.xml` が送信済みか
  - ステータスが「成功」か（エラーなら原因表示を読む）
- 左メニューの「**インデックス作成 > ページ**」で次を確認
  - インデックス済みページ数
  - 「検出 - インデックス未登録」や「クロール済み - インデックス未登録」が多くないか
- 右上の検索窓（URL検査）で次を確認
  - トップURLを入力 → 「インデックス登録状況」を確認
  - 問題がなければ「**インデックス登録をリクエスト**」

---

## 3) サイト側のSEO設定（確認ポイント）

このサイトで確認する対象ファイルは主に以下です。

- `index.html`
- `article/*/index.html`
- `sitemap.xml`
- `structured-data.json`
- `robots.txt`

### チェック項目

- **title タグ**: 各ページ固有になっているか
- **meta description**: 各ページ固有になっているか
- **canonical**: `file:///` や `localhost` ではなく、公開URLになっているか
- **OGP**: `og:title` / `og:description` / `og:url` / `og:image` が公開URL基準か
- **robots**: `noindex` が入っていないか（meta / header）
- **robots.txt**: 全体ブロックしていないか
- **sitemap.xml**: `<loc>` が公開URLと一致しているか
- **structured data**: JSON-LD が壊れていないか、URLが公開URL基準か

---

## 4) Googleに出ない原因の切り分け（A〜J）

- **A. そもそもネットに公開されていない**
  - 公開URLにアクセスできない / 404
- **B. 公開はされているが、Search Console未登録**
  - プロパティがない
- **C. Search Console登録済みだが sitemap未送信**
  - サイトマップ未送信
- **D. sitemapのURLが間違っている**
  - `sitemap.xml` の `<loc>` が違うURL
- **E. robots.txtでブロック**
  - `Disallow: /` など
- **F. noindexが入っている**
  - `<meta name="robots" content="noindex">` など
- **G. canonical URLが間違っている**
  - 旧URL / file / localhost を指す
- **H. 公開したばかりで反映待ち**
  - 正常でも数日〜数週間かかる場合あり
- **I. 内容が薄く順位が低すぎて見つからない**
  - `site:` で出るか確認
- **J. SPA/JavaScript依存で読み取りにくい**
  - トップが空HTMLで、本文/リンクがJS生成のみ

現状は **J が濃厚**（トップがJS依存）で、加えて URL固定があるため **D/G も将来起きやすい**です。

---

## 5) 修正した内容（このリポジトリ）

- `scripts/build-static.js`
  - **`SITE_URL` / `CANONICAL_BASE_URL` / `SITEMAP_BASE_URL`** を環境変数で差し替え可能に変更
  - `index.html` を **記事リンク入りのHTML**として生成（JSなしでもクロール可能に寄せる）
  - `robots.txt` を生成（最低限 Allow）
  - `sitemap.xml` 生成は `SITEMAP_BASE_URL` を使うよう変更

---

## 6) 公開URLが未確定の場合の管理（環境変数）

ビルド時に以下を渡すと、canonical / sitemap のURLを差し替えできます。

- `SITE_URL`
- `CANONICAL_BASE_URL`
- `SITEMAP_BASE_URL`

例（PowerShell）:

```powershell
$env:SITE_URL="https://example.com"
$env:CANONICAL_BASE_URL="https://example.com"
$env:SITEMAP_BASE_URL="https://example.com"
npm run build
```

---

## 7) 公開先は Netlify / Vercel / GitHub Pages どれが向いてる？

このサイトは **静的ファイル（HTML/CSS/JS）**中心で、ビルドは Node だけなので以下が向きます。

- **GitHub Pages（おすすめ）**
  - すでに `*.github.io` に公開されている形跡があり、構成と相性が良い
- **Netlify**
  - ビルドコマンド設定だけでデプロイできる。プレビュー環境も便利
- **Vercel**
  - 可能だが、静的サイト用途なら Netlify の方が設定が素直なことが多い

---

## 8) Search Console で sitemap 送信手順

- Search Console → 対象プロパティを選択
- 左メニュー「サイトマップ」
- 「新しいサイトマップの追加」に `sitemap.xml` を入力して送信
  - 例：`https://.../rakuten-gear-review/sitemap.xml`
- ステータスが「成功」になるか確認

---

## 9) Google検索に出るまでの確認方法

- `site:公開ドメイン` で出るか確認（例：`site:dai32320888-ship-it.github.io rakuten-gear-review`）
- Search Console の「URL検査」で
  - 取得できるか
  - インデックス登録可否
  - リクエスト送信済みか

---

## 10) 検索に出ない場合の追加チェックリスト

- **公開URLが本当に正しいか**（別リポジトリ/別フォルダを公開していないか）
- Search Console のプロパティが **別URL** を見ていないか
- `sitemap.xml` が Search Console で「成功」になっているか
- `robots.txt` が意図せずブロックしていないか
- canonical が旧URLを指していないか
- 記事ページ（`/article/.../`）がブラウザで直接開けるか
- GitHub Pages の公開設定（ブランチ/ディレクトリ）が意図通りか
