# REST API設計

## 認証

| メソッド | エンドポイント | 説明 |
|----------|--------------|------|
| POST | /api/auth/login | ログイン |
| POST | /api/auth/logout | ログアウト |

---

## タスク

| メソッド | エンドポイント | 説明 |
|----------|--------------|------|
| GET | /api/tasks | タスク一覧取得 |
| POST | /api/tasks | タスク作成 |
| PUT | /api/tasks/{id} | タスク更新（編集・移動） |
| DELETE | /api/tasks/{id} | タスク削除 |
