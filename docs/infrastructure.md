# インフラ構成

## アーキテクチャ概要

```
Internet
    │
    └─── HTTP:80 ──→ [EC2 t3.micro]
                     ├── Nginx (ポート 80)
                     │    ├── /       → フロントエンド静的ファイル
                     │    └── /api    → Spring Boot (ポート 8080) にプロキシ
                     └── Spring Boot (Docker, ポート 8080)
                                │
                           [RDS PostgreSQL 16]
                           (ポート 5432, プライベートサブネット)
```

---

## AWSリソース一覧

| リソース | 説明 |
|---------|------|
| VPC | 仮想ネットワーク（パブリック／プライベートサブネット） |
| EC2 (t3.micro) | Nginx + Spring Boot を稼働させるアプリケーションサーバー |
| Elastic IP | EC2 に割り当てる固定パブリック IP アドレス |
| RDS PostgreSQL 16 (db.t3.micro) | マネージドデータベース（プライベートサブネット配置） |
| Security Group (EC2用) | SSH(22)・HTTP(80) を許可 |
| Security Group (RDS用) | EC2 からの PostgreSQL(5432) 接続を許可 |
| DB Subnet Group | RDS 用のサブネットグループ |

---

## ネットワーク構成

- **VPC**: パブリックサブネット + プライベートサブネット（マルチ AZ）
- **EC2**: パブリックサブネットに配置、Elastic IP で外部公開
- **RDS**: プライベートサブネットに配置、EC2 からのみアクセス可能

---

## ディレクトリ構成

```
infra/
├── nginx/
│   └── app.conf              # Nginx 設定（静的配信 + /api プロキシ）
├── scripts/
│   └── deploy.sh             # デプロイスクリプト（ローカル実行）
└── terraform/
    ├── main.tf               # Terraform プロバイダー設定
    ├── variables.tf          # 変数定義
    ├── vpc.tf                # VPC・サブネット・ルーティング
    ├── security_groups.tf    # セキュリティグループ
    ├── ec2.tf                # EC2 インスタンス・Elastic IP
    ├── rds.tf                # RDS インスタンス・サブネットグループ
    ├── outputs.tf            # 出力値（IP・接続情報など）
    └── terraform.tfvars      # 実際の変数値（gitignore 対象）
```

---

## デプロイ手順概要

| ステップ | 内容 |
|---------|------|
| 1. Terraform でインフラ構築 | `terraform init` → `terraform plan` → `terraform apply` |
| 2. DB スキーマ初期化（初回のみ） | SSH で EC2 接続後、`schema.sql` を RDS に適用 |
| 3. デプロイスクリプト実行 | `bash infra/scripts/deploy.sh <EC2_IP> <KEY_PATH> <RDS_HOST> <DB_PASSWORD>` |

デプロイスクリプト（`infra/scripts/deploy.sh`）は以下を自動実行:

1. フロントエンドビルド（`pnpm build`）
2. バックエンド Docker イメージビルド
3. EC2 へ SCP 転送（フロントエンド dist・バックエンドイメージ・Nginx 設定）
4. バックエンドコンテナ起動
5. Nginx 設定反映（静的ファイル配置・設定リロード）

---

## ローカル開発環境

ローカル開発は Docker Compose を使用。EC2・RDS は不要。

```bash
# DB + バックエンドの起動
docker compose up -d

# フロントエンドの起動
cd frontend && pnpm dev
```

| 環境 | フロントエンド | バックエンド | DB |
|------|------------|------------|-----|
| ローカル | Vite dev server (5173) | Spring Boot (8080) | Docker PostgreSQL |
| 本番 (AWS) | Nginx 静的配信 (80) | Docker Spring Boot (8080) | RDS PostgreSQL 16 |
