# AWS Terraform デプロイガイド

---

## 構成フェーズ

段階的に構成を追加していきます。

| フェーズ | 内容 | 状態 |
|---------|------|------|
| **Phase 1** | EC2（フロント＋バックエンド同居） | 🔧 **今ここ** |
| Phase 2 | RDS（PostgreSQL をマネージドDBへ移行） | 未着手 |
| Phase 3 | デプロイ自動化 | 未着手 |

---

## Phase 1：EC2 構成

### アーキテクチャ

```
ユーザー (ブラウザ)
    │
    └─── HTTP:80 ──→ [EC2 t3.micro]
                     ├── Nginx (ポート 80)
                     │    ├── /       → フロントエンド静的ファイル
                     │    └── /api    → Spring Boot (ポート 8080) にプロキシ
                     ├── Spring Boot (ポート 8080)
                     └── PostgreSQL (ポート 5432、同じサーバー内)
```

フロントエンドとバックエンドを 1 台の EC2 にまとめることで、構成をシンプルに保ちます。  
Phase 2 で PostgreSQL を RDS に切り出します。

### 作成するAWSリソース

| リソース | 内容 | 無料枠 |
|---------|------|--------|
| VPC | 仮想ネットワーク | 常時無料 |
| EC2 t3.micro | アプリケーションサーバー | 750時間/月（12ヶ月） |
| Elastic IP | 固定パブリックIP | 起動中は無料 |
| Security Group | ポート 22・80 を開放 | 常時無料 |

### ファイル構成

```
infra/
├── README.md
└── terraform/
    ├── main.tf               ← Terraformプロバイダー設定
    ├── variables.tf          ← 変数定義
    ├── vpc.tf                ← VPC・サブネット・ルーティング
    ├── security_groups.tf    ← セキュリティグループ（22, 80番ポート）
    ├── ec2.tf                ← EC2インスタンス・Elastic IP
    ├── outputs.tf            ← IPアドレス・SSH接続コマンドなど
    └── terraform.tfvars.example
```

---

## 事前準備

### 1. ツールの確認 ✅ 完了

| ツール | バージョン |
|--------|-----------|
| AWS CLI | 2.34.43 |
| Terraform | 1.15.1 |
| Docker | 28.2.2 |

### 2. AWS IAM ユーザーの作成

```
AWSコンソール → IAM → ユーザー → ユーザーを作成

ユーザー名：terraform-deployer
権限：AdministratorAccess
アクセスキーを作成（CLI用）→ キーIDとシークレットをメモ
```

### 3. AWS CLI の認証設定

```bash
aws configure
# Access Key ID     : ← メモしたID
# Secret Access Key : ← メモしたキー
# Default region    : ap-northeast-1
# Output format     : json

# 確認
aws sts get-caller-identity
```

### 4. EC2 キーペアの作成

SSH接続に使う鍵をAWSで作成します。

```
AWSコンソール → EC2 → キーペア → キーペアを作成

名前：taskmanagement-key
タイプ：RSA
形式：.pem
```

ダウンロードした `.pem` を配置：

```bash
mv ~/Downloads/taskmanagement-key.pem ~/.ssh/
chmod 400 ~/.ssh/taskmanagement-key.pem
```

> **注意**：`.pem` は再ダウンロードできません。大切に保管してください。

---

## デプロイ手順

### 1. tfvars の作成

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars` を開いて以下の値を設定します：

```bash
# 自分のPCのパブリックIPを確認する
curl ifconfig.me
# → 203.0.113.1 のように表示される。/32 をつけて my_ip に設定する
```

| 設定項目 | 値 |
|---------|-----|
| `ec2_key_pair_name` | 第4章で作成したキーペア名 |
| `my_ip` | `curl ifconfig.me` で確認したIP + `/32`（例: `203.0.113.1/32`） |

### 2. Terraform の実行

```bash
# 初期化（初回のみ）
terraform init

# 作成されるリソースの確認
terraform plan

# リソースの作成（2〜3分）
terraform apply
```

完了すると以下が表示されます：

```
Outputs:

app_url       = "http://13.112.xx.xx"
ec2_public_ip = "13.112.xx.xx"
ssh_command   = "ssh -i ~/.ssh/taskmanagement-key.pem ec2-user@13.112.xx.xx"
```

### 3. 動作確認

```bash
# SSH接続できるか確認
ssh -i ~/.ssh/taskmanagement-key.pem ec2-user@<EC2_PUBLIC_IP>

# Docker・Nginx が起動しているか確認
sudo systemctl status docker
sudo systemctl status nginx
```

---

## 環境を削除するとき

```bash
cd infra/terraform
terraform destroy
```

---

## 料金の目安

| サービス | 無料枠（12ヶ月） | 無料枠終了後 |
|---------|---------------|------------|
| EC2 t3.micro | $0 | 約 $8〜10/月 |
| Elastic IP | $0（起動中） | $0（起動中）/ $0.005/時（停止中） |
| VPC・SG | $0 | $0 |
| **合計** | **$0** | **約 $8〜10/月** |
