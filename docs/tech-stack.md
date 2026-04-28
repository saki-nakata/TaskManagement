# 技術スタック

## 主要技術

| 項目 | 技術 | バージョン |
|------|------|-----------|
| フロントエンド | React + TypeScript | 19.2 / 6.0 |
| ビルドツール（フロント） | Vite | 8.x |
| CSSフレームワーク | Tailwind CSS | 3.4 |
| バックエンド | Java + Spring Boot | 25 / 4.0.5 |
| ビルドツール（バック） | Gradle (Kotlin DSL) | 9.4.1 |
| O/Rマッパー | MyBatis | 3.5.x (mybatis-spring-boot-starter 4.x) |
| データベース | PostgreSQL | 16 |
| フロント・バック間通信 | REST API (JSON) | — |
| 認証方式 | JWT (HttpOnly Cookie) | 未実装 — 将来対応予定 |

## フロントエンドライブラリ

| 用途 | ライブラリ | バージョン |
|------|-----------|-----------|
| HTTPクライアント | Axios | 1.7 |
| ドラッグ＆ドロップ | @dnd-kit/core | 6.3.x |
| ドラッグ＆ドロップ | @dnd-kit/sortable | 10.x |
| ドラッグ＆ドロップ | @dnd-kit/utilities | 3.2.x |

## バックエンドライブラリ

| 用途 | ライブラリ | バージョン |
|------|-----------|-----------|
| セキュリティ | Spring Security | (Spring Boot 管理) |
| バリデーション | spring-boot-starter-validation | (Spring Boot 管理) |
| コード生成 | Lombok | (Spring Boot 管理) |

## インフラ・開発環境

| 用途 | 技術 | バージョン |
|------|------|-----------|
| コンテナ | Docker Compose | v2 |
| DBコンテナ | PostgreSQL (Docker) | 16 |
| パッケージマネージャー（フロント） | pnpm | 10.x |
