# 技術スタック

## 主要技術

| 項目 | 技術 | バージョン |
|------|------|-----------|
| フロントエンド | React + TypeScript | 18.3 / 5.4 |
| ビルドツール（フロント） | Vite | 5.x |
| CSSフレームワーク | Tailwind CSS | 3.4 |
| バックエンド | Java + Spring Boot | 25 LTS / 4.0.5 |
| ビルドツール（バック） | Gradle (Kotlin DSL) | 9.4.1 |
| O/Rマッパー | MyBatis | 3.5.x (mybatis-spring-boot-starter 4.x) |
| データベース | PostgreSQL | 16 |
| フロント・バック間通信 | REST API (JSON) | — |
| 認証方式 | JWT (HttpOnly Cookie) | jjwt 0.12 |

## フロントエンドライブラリ

| 用途 | ライブラリ | バージョン |
|------|-----------|-----------|
| ルーティング | React Router | 6.x |
| HTTPクライアント | Axios | 1.7 |
| ドラッグ＆ドロップ | @dnd-kit/core + @dnd-kit/sortable | 6.x / 8.x |
| フォーム | React Hook Form | 7.x |
| 状態管理 | Zustand | 4.x |
| 日付操作 | date-fns | 3.x |

## バックエンドライブラリ

| 用途 | ライブラリ | バージョン |
|------|-----------|-----------|
| DBマイグレーション | Flyway | 10.x |
| セキュリティ | Spring Security | 7.x |
| バリデーション | Hibernate Validator | 9.x |
| JWTライブラリ | jjwt (io.jsonwebtoken) | 0.12 |

## インフラ・開発環境

| 用途 | 技術 | バージョン |
|------|------|-----------|
| コンテナ | Docker Compose | v2 |
| DBコンテナ | PostgreSQL (Docker) | 16 |
