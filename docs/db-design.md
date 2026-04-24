# DB設計

## テーブル一覧

| テーブル名 | 説明 |
|-----------|------|
| USER | ログインユーザー情報 |
| TASK | タスク（カード）情報 |

---

## USER テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 一意のID |
| username | VARCHAR | NOT NULL, UNIQUE | ログインID |
| password_hash | VARCHAR | NOT NULL | BCryptハッシュ化パスワード |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

---

## TASK テーブル

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | INT | PK, AUTO_INCREMENT | 一意のID |
| user_id | BIGINT | FK（USER.id）, NOT NULL | 所有ユーザーのID |
| title | VARCHAR | NOT NULL | タイトル |
| description | TEXT | | 説明文 |
| priority | ENUM | NOT NULL | HIGH / MEDIUM / LOW |
| due_date | DATE | | 期限 |
| column_type | ENUM | NOT NULL | TODO / IN_PROGRESS / DONE |
| position | INTEGER | NOT NULL | カラム内の並び順 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

---

## ENUMの定義

### priority

| 値 | 表示名 |
|----|--------|
| HIGH | 高 |
| MEDIUM | 中 |
| LOW | 低 |

### column_type

| 値 | 表示名 |
|----|--------|
| TODO | Todo |
| IN_PROGRESS | In Progress |
| DONE | Done |
