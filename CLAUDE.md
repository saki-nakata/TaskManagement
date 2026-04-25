# CLAUDE.md — Claude AI エージェント向け作業ガイドライン

このファイルは Claude Code がこのプロジェクトで作業する際に従うべきガイドラインを定義します。

---

## 推奨ワークフロー

原則として、すべての作業を以下の手順で進めてください。

```
1. GitHub Issue を作成する
      ↓
2. Issue 番号を確認する（例: #12）
      ↓
3. Issue 番号を含むブランチを作成する
      ↓
4. 実装・修正を行う
      ↓
5. コミットする
      ↓
6. リモートブランチへプッシュする
      ↓
7. Pull Request を作成する（Closes #番号 を必ず記載）
      ↓
8. PR をマージする
```

---

## ブランチ命名規則

| 種別 | 命名パターン | 例 |
|------|------------|-----|
| 新機能 | `feature/#{番号}-{英語説明}` | `feature/#12-add-card-tags` |
| バグ修正 | `fix/#{番号}-{英語説明}` | `fix/#7-drag-drop-broken` |
| ドキュメント | `docs/#{番号}-{英語説明}` | `docs/#3-update-api-spec` |

- `{英語説明}` は英数字とハイフンのみ使用する（スペース・アンダースコア不可）
- Issue 番号は `#` を含めて記載する

```bash
# ブランチ作成例（Issue #12 の場合）
git checkout -b feature/#12-add-card-tags
```

---

## コミットメッセージ規則

- **言語**: 日本語
- **形式**: 自由形式
- **末尾**: `(#Issue番号)` を付ける

```
# 例
カードにタグ機能を追加 (#12)
ドラッグ&ドロップが動かないバグを修正 (#7)
API仕様書を更新 (#3)
```

---

## gh CLI コマンド例

### Issue の作成

```bash
# 新機能の Issue
gh issue create --title "[Feature] 機能名" --label "enhancement"

# バグ報告の Issue
gh issue create --title "[Bug] バグの説明" --label "bug"

# 作成後、Issue 番号を確認する
gh issue list
```

### Pull Request の作成

```bash
# PR 作成（Issue 番号を必ず含める）
gh pr create \
  --title "変更内容のタイトル" \
  --body "Closes #12

## 変更内容
- 追加した機能の説明
- 変更した内容"
```

### その他の便利なコマンド

```bash
# Issue の一覧確認
gh issue list

# PR の一覧確認
gh pr list

# PR をマージ
gh pr merge --squash
```

---

## GitHub ブランチ保護について

`main` ブランチには以下の保護ルールが設定されています。

- **直接 push 禁止** — `git push origin main` はサーバー側で拒否されます
- **force push 禁止**
- **ブランチ削除禁止**
- **マージは PR 経由のみ**（レビュー承認は不要）

---

## プロジェクト構成（参考）

- **フロントエンド**: React 18 + TypeScript + Vite
- **バックエンド**: Spring Boot 4.0.5 + Java 25 + MyBatis
- **データベース**: PostgreSQL 16
- **インフラ**: Docker Compose

### ローカル起動手順

```bash
# DB + バックエンドの起動
docker compose up -d

# フロントエンドの起動
cd frontend && pnpm dev
```

---

## サーバー起動ルール

動作確認などでサーバーを起動する際は、以下のルールを**必ず**守ること。

- アプリケーションが定義しているデフォルトポートで起動する
  - フロントエンド（Vite）: **5173**
  - バックエンド（Spring Boot）: **8080**
- **ポート競合が発生しても、別のポートで起動してはいけない**
  - 競合しているプロセスを特定してユーザーに確認の上停止する
  - 停止後、デフォルトポートで起動する
