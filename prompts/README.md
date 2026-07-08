# Kikuchi Prompt Hub

ChatGPT で毎回作っていた長い作業プロンプトを、Cursor 内で再利用するための保管場所。
毎回コピペしなくていいように、プロンプト・コマンド・ルールをまとめてある。

## 構成

```
.cursor/
  commands/          Cursor のスラッシュコマンド（/コマンド名 で呼び出す）
    rakuten-research.md
    audit-site.md
    fix-safe.md
    add-article.md
    deploy-check.md
  rules/
    kikuchi-web-rules.mdc   プロジェクト共通ルール（常時適用）
prompts/             元になる長文プロンプト（この README を含む）
    rakuten-affiliate.md
    site-operation.md
    github-safe-work.md
```

## 使い方

### コマンド（おすすめ）

Cursor のチャットで `/` を打つと、`.cursor/commands/` のコマンドが候補に出る。

- `/rakuten-research` — 楽天記事の調査・更新候補出し
- `/audit-site` — サイト監査
- `/fix-safe` — 安全修正
- `/add-article` — 記事追加
- `/deploy-check` — 公開前チェック

### プロンプト

`prompts/` の各ファイルは、コマンドの元ネタ・詳しい方針書。
コマンドで足りないときは、該当ファイルの内容をチャットに貼って使う。

## 基本方針（全コマンド共通）

- 既存サイトを壊さない
- いきなり自動修正しない（まず調査・差分・監査・レポート）
- push 前に必ず `git status` と監査結果を確認
- PR表記 / canonical / sitemap / feed / slug / 内部リンク を壊さない
- 不明点は推測で変えず、`reports/` に残す
- 最後は日本語で「何をしたか」「次に何をすればいいか」を説明する
