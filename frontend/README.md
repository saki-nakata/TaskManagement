# TaskManagement フロントエンド

Trello 風タスク管理アプリのフロントエンドです。

## 技術スタック

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3
- @dnd-kit（ドラッグ&ドロップ）
- Axios

## 開発サーバーの起動

```bash
pnpm install
pnpm dev
```

`http://localhost:5173` でアクセスできます。バックエンド（`:8080`）は別途起動が必要です。

## 主なコマンド

```bash
pnpm dev        # 開発サーバー起動
pnpm build      # 本番ビルド
pnpm lint       # ESLint チェック
pnpm typecheck  # TypeScript チェック
```
