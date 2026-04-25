CREATE TABLE IF NOT EXISTS tasks (
    id         SERIAL       PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    status     VARCHAR(50)  NOT NULL DEFAULT 'TODO',
    position   INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, status, position) VALUES
    ('バックエンドAPIを設計する',   'DONE',        1),
    ('MyBatisのMapper実装',        'DONE',        2),
    ('フロントエンドのUI作成',      'IN_PROGRESS', 3),
    ('テストコードを書く',          'TODO',        4),
    ('本番環境へデプロイする',      'TODO',        5);
