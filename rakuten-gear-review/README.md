# 元自衛官の楽天装備レビュー

GitHub Pages で公開している楽天アフィリエイト系の静的レビューサイトです。

公開URL:

https://dai32320888-ship-it.github.io/daichi-profile-site/rakuten-gear-review/

## 現在の構成

- `index.html`: トップページ
- `article/*/index.html`: 各レビュー記事
- `category/*.html`: カテゴリ一覧
- `hub/*.html`: 主要テーマのまとめページ
- `data/extra-articles.json`: 追加記事データ
- `app.js`: クライアント側の表示ロジックと記事データ
- `sitemap.xml`: 検索エンジン向けサイトマップ
- `feed.xml`: RSSフィード
- `robots.txt`: クロール設定
- `scripts/repair-static-site.cjs`: 静的HTMLの修復、トップ新着順・記事数・表現の補正
- `scripts/audit-static-site.cjs`: SEO、リンク、PR表記、記事データ整合性の監査

## 保守コマンド

```powershell
npm run repair
npm run audit
npm run audit:images
npm run build
npm run dev
```

`npm run build` は `repair`、`audit`、`audit:images` を順に実行します。記事を追加・修正した後は、このコマンドでトップページの新着順、記事数、サイト内リンク、canonical、OGP、JSON-LD、PR表記、画像フォールバックを確認してください。

ローカル確認:

```powershell
npm run dev
```

起動後、次のURLで確認できます。

http://127.0.0.1:5173/

## 公開前チェック

- トップページの「新着記事」が日付の新しい順になっている
- 表示記事数が実データと一致している
- 不自然な助数詞や機械的なタイトル表現が残っていない
- 記事ページにPR表記がある
- canonical / OGP / JSON-LD が壊れていない
- `sitemap.xml` と `feed.xml` が更新されている
- ローカルリンク切れがない
- 記事カード・商品カードの画像に `data-fallback` と `onerror` が入っている

## 注意

このサイトは現在、静的HTMLを中心に公開されています。大きな記事追加やテンプレート変更を行う場合は、手作業でHTMLだけを直さず、`scripts/repair-static-site.cjs` と `scripts/audit-static-site.cjs` も必要に応じて更新してください。
