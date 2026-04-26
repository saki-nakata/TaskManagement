CREATE TABLE IF NOT EXISTS tasks (
    id         SERIAL       PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50)  NOT NULL DEFAULT 'TODO',
    priority   VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    due_date   DATE,
    position   INT          NOT NULL DEFAULT 0,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, description, status, priority, due_date, position) VALUES
    ('バックエンドAPIを設計する',   'エンドポイントの設計とOpenAPI仕様書の作成',       'DONE',        'HIGH',   '2026-04-10', 1),
    ('MyBatisのMapper実装',        'TaskMapperインターフェースとSQLの実装',           'DONE',        'HIGH',   '2026-04-15', 2),
    ('フロントエンドのUI作成',      'カンバンボードのコンポーネント実装',              'IN_PROGRESS', 'MEDIUM', '2026-04-30', 3),
    ('テストコードを書く',          'ユニットテストと結合テストの作成',                'TODO',        'MEDIUM', '2026-05-10', 4),
    ('本番環境へデプロイする',      'DockerイメージのビルドとAWS EC2へのデプロイ',    'TODO',        'LOW',    '2026-06-20', 5);
