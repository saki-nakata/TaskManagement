CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    status      VARCHAR(50)  NOT NULL DEFAULT 'TODO',
    priority    VARCHAR(10)  NOT NULL DEFAULT 'MEDIUM',
    due_date    DATE         NOT NULL,
    position    INTEGER      NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);
