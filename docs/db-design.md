# DB設計

## テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| tasks | タスク（カード）情報 |

---

## tasks テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | SERIAL | PK | 一意のID（自動採番） |
| title | VARCHAR(255) | NOT NULL | タイトル |
| description | TEXT | | 説明文 |
| status | VARCHAR(50) | NOT NULL DEFAULT 'TODO' | ステータス（TODO / IN_PROGRESS / DONE） |
| priority | VARCHAR(10) | NOT NULL DEFAULT 'MEDIUM' | 優先度（HIGH / MEDIUM / LOW） |
| due_date | DATE | NOT NULL | 期限 |
| position | INT | NOT NULL DEFAULT 0 | カラム内の並び順 |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 更新日時 |

---

## status の値

| 値 | 表示名 |
|----|--------|
| TODO | Todo |
| IN_PROGRESS | In Progress |
| DONE | Done |

## priority の値

| 値 | 表示名 |
|----|--------|
| HIGH | 高 |
| MEDIUM | 中 |
| LOW | 低 |

---

## 未実装テーブル（認証機能実装時に追加予定）

### users テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | BIGSERIAL | PK | 一意のID |
| username | VARCHAR | NOT NULL, UNIQUE | ログインID |
| password_hash | VARCHAR | NOT NULL | BCryptハッシュ化パスワード |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

認証機能の実装時は、`tasks` テーブルに `user_id BIGINT NOT NULL REFERENCES users(id)` を追加する予定。
