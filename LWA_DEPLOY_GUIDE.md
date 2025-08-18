# Lambda Web Adapter (LWA) デプロイガイド

このドキュメントでは、3つのNuxt4アプリケーション（central、feature-a、feature-b）をLambda Web AdapterでAWS Lambdaにデプロイする方法を説明します。

## アーキテクチャ概要

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Central App   │    │  Feature A App  │    │  Feature B App  │
│  (認証・ダッシュ)  │────│   (TODO管理)    │    │ (Profile管理)   │
│                 │    │                 │    │                 │
│ Lambda Function │    │ Lambda Function │    │ Lambda Function │
│ + LWA          │    │ + LWA          │    │ + LWA          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ビルド方法

### 個別アプリケーションのビルド

各アプリケーションを個別にビルドする場合：

```bash
# Central App（認証・ダッシュボード）
cd apps/central
./build-lwa.sh [tag]

# Feature A App（TODO管理）
cd apps/feature-a
./build-lwa.sh [tag]

# Feature B App（Profile管理）
cd apps/feature-b
./build-lwa.sh [tag]
```

### 全アプリケーション一括ビルド

全てのアプリケーションを一度にビルドする場合：

```bash
# プロジェクトルートから実行
./build-lwa.sh [tag]
```

**パラメータ：**
- `tag`: Dockerイメージのタグ（省略時は `latest`）

## 作成されるDockerイメージ

- `multi-lwa-central:latest` - Central App
- `multi-lwa-feature-a:latest` - Feature A App (TODO管理)
- `multi-lwa-feature-b:latest` - Feature B App (Profile管理)

## AWS環境での設定

### 1. ECRリポジトリの作成

```bash
# ECRリポジトリを作成
aws ecr create-repository --repository-name multi-lwa-central
aws ecr create-repository --repository-name multi-lwa-feature-a
aws ecr create-repository --repository-name multi-lwa-feature-b
```

### 2. イメージのプッシュ

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージをタグ付けしてプッシュ
docker tag multi-lwa-central:latest <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-central:latest
docker push <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-central:latest

docker tag multi-lwa-feature-a:latest <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-feature-a:latest
docker push <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-feature-a:latest

docker tag multi-lwa-feature-b:latest <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-feature-b:latest
docker push <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-feature-b:latest
```

### 3. Lambda関数の作成

各アプリケーション用のLambda関数を作成し、ECRイメージを指定します。

#### Central App用Lambda関数

```bash
aws lambda create-function \
  --function-name multi-lwa-central \
  --package-type Image \
  --code ImageUri=<account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-central:latest \
  --role arn:aws:iam::<account-id>:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables='{
    "FEATURE_A_URL":"https://<feature-a-function-url>",
    "FEATURE_B_URL":"https://<feature-b-function-url>"
  }'
```

#### Feature A App用Lambda関数

```bash
aws lambda create-function \
  --function-name multi-lwa-feature-a \
  --package-type Image \
  --code ImageUri=<account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-feature-a:latest \
  --role arn:aws:iam::<account-id>:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512
```

#### Feature B App用Lambda関数

```bash
aws lambda create-function \
  --function-name multi-lwa-feature-b \
  --package-type Image \
  --code ImageUri=<account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-feature-b:latest \
  --role arn:aws:iam::<account-id>:role/lambda-execution-role \
  --timeout 30 \
  --memory-size 512
```

### 4. Function URLの作成

各Lambda関数にFunction URLを作成します：

```bash
# Central App
aws lambda create-function-url-config \
  --function-name multi-lwa-central \
  --auth-type NONE \
  --cors AllowCredentials=true,AllowHeaders="*",AllowMethods="*",AllowOrigins="*"

# Feature A App
aws lambda create-function-url-config \
  --function-name multi-lwa-feature-a \
  --auth-type NONE \
  --cors AllowCredentials=true,AllowHeaders="*",AllowMethods="*",AllowOrigins="*"

# Feature B App
aws lambda create-function-url-config \
  --function-name multi-lwa-feature-b \
  --auth-type NONE \
  --cors AllowCredentials=true,AllowHeaders="*",AllowMethods="*",AllowOrigins="*"
```

### 5. Central Appの環境変数更新

Feature AとFeature BのFunction URLが取得できたら、Central Appの環境変数を更新します：

```bash
aws lambda update-function-configuration \
  --function-name multi-lwa-central \
  --environment Variables='{
    "FEATURE_A_URL":"https://<feature-a-function-url>",
    "FEATURE_B_URL":"https://<feature-b-function-url>"
  }'
```

## デモアカウント

システムには以下のデモアカウントが設定されています：

- **管理者アカウント**
  - ユーザー名: `admin`
  - パスワード: `password`

- **一般ユーザーアカウント**
  - ユーザー名: `user`
  - パスワード: `password`

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   - Node.jsのバージョンを確認（Node.js 20推奨）
   - `yarn install` を実行してから再ビルド

2. **Lambda関数の起動が遅い**
   - メモリサイズを1024MB以上に増加
   - Provisioned Concurrencyの設定を検討

3. **環境変数が反映されない**
   - Lambda関数の設定を確認
   - 関数の再デプロイを実行

### ログの確認

```bash
# Lambda関数のログを確認
aws logs tail /aws/lambda/multi-lwa-central --follow
aws logs tail /aws/lambda/multi-lwa-feature-a --follow
aws logs tail /aws/lambda/multi-lwa-feature-b --follow
```

## 参考リンク

- [Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter)
- [Nuxt Deployment AWS Lambda](https://nuxt.com/docs/getting-started/deployment#aws-lambda)
- [ECR User Guide](https://docs.aws.amazon.com/ecr/)
