プロジェクト全体の品質チェック（静的解析）を実行してください。以下の手順を必ず守ること。

## 実行手順

### 1. フロントエンド

作業ディレクトリ: `frontend/`

```bash
cd frontend

# ESLint チェック
pnpm lint

# TypeScript コンパイルチェック
pnpm exec tsc -b --noEmit
```

### 2. バックエンド

作業ディレクトリ: `backend/`

```bash
cd backend

# Checkstyle チェック（main + test）
./gradlew checkstyleMain checkstyleTest
```

### 3. Terraform

作業ディレクトリ: `infra/terraform/`

```bash
cd infra/terraform
terraform fmt -check -recursive
terraform validate
```

## 結果のレポート

チェックが完了したら、以下の形式でまとめて報告すること。

```
## 品質チェック結果

### フロントエンド（ESLint）
- 結果: PASS / FAIL
- エラー数: X 件
- 警告数: X 件
- 問題があれば内容を列挙

### フロントエンド（TypeScript）
- 結果: PASS / FAIL
- エラーがあれば内容を列挙

### バックエンド（Checkstyle）
- 結果: PASS / FAIL
- 違反数: X 件
- 問題があれば内容を列挙

### Terraform（fmt / validate）
- 結果: PASS / FAIL
- 問題があれば内容を列挙
```

問題が見つかった場合は、修正方法の提案も合わせて提示すること。
