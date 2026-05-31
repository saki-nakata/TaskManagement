# REST API設計

## タスク

| メソッド | エンドポイント | 説明 |
|----------|--------------|------|
| GET | /api/tasks | タスク一覧取得 |
| POST | /api/tasks | タスク作成 |
| PUT | /api/tasks/{id} | タスク更新（編集・移動） |
| PATCH | /api/tasks/reorder | タスクの並び順・ステータスを一括更新 |
| DELETE | /api/tasks/{id} | タスク削除 |

---

### GET /api/tasks

タスク一覧を取得する。クエリパラメータで絞り込みが可能。

**クエリパラメータ（すべて任意）**

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| keyword | string | タイトルの部分一致検索（大文字小文字無視） |
| status | string | ステータスで絞り込み（TODO / IN_PROGRESS / DONE） |

**レスポンス:** `200 OK`

---

### POST /api/tasks

タスクを新規作成する。

**レスポンス:** `201 Created`

---

### PUT /api/tasks/{id}

タスクを更新する。

**レスポンス:** `200 OK` / `404 Not Found`

---

### PATCH /api/tasks/reorder

複数タスクの並び順とステータスを一括更新する（ドラッグ＆ドロップ後の順序保存に使用）。

**リクエストボディ:**
```json
[
  { "id": 1, "status": "IN_PROGRESS", "position": 1 },
  { "id": 2, "status": "IN_PROGRESS", "position": 2 }
]
```

**レスポンス:** `204 No Content`

---

### DELETE /api/tasks/{id}

タスクを削除する。

**レスポンス:** `204 No Content` / `404 Not Found`

---

## エラーレスポンス形式

すべてのエラーレスポンスは以下の形式で返す。

```json
{
  "status": 404,
  "message": "Task not found: 99"
}
```

| ステータス | 発生条件 |
|-----------|---------|
| 400 Bad Request | バリデーションエラー（タイトル未入力・期日未指定など） |
| 404 Not Found | 指定した ID のタスクが存在しない |
| 500 Internal Server Error | 予期せぬサーバーエラー |

---

## 未実装エンドポイント（将来の実装予定）

| メソッド | エンドポイント | 説明 |
|----------|--------------|------|
| POST | /api/auth/login | ログイン |
| POST | /api/auth/logout | ログアウト |
