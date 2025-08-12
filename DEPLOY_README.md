# 🚀 Multi-LWA 簡易デプロイガイド

## 前提条件

1. **AWS CLI設定**
```bash
# AWS CLIが未設定の場合
aws configure
# または AWS SSO使用の場合
aws sso login
```

2. **必要な権限**
- ECR: リポジトリ作成、イメージプッシュ
- Lambda: 関数作成、更新
- IAM: ロール作成
- Function URL作成権限

## ワンコマンドデプロイ

```bash
# プロジェクトルートで実行
./deploy.sh
```

## 手動デプロイ（段階的）

### 1. ECRリポジトリ作成
```bash
aws ecr create-repository --repository-name multi-lwa-central
aws ecr create-repository --repository-name multi-lwa-feature-a  
aws ecr create-repository --repository-name multi-lwa-feature-b
```

### 2. イメージプッシュ
```bash
# ECRログイン
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージタグ付けとプッシュ
docker tag multi-lwa-central:optimized <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-central:latest
docker push <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-central:latest

# feature-a, feature-bも同様に実行
```

### 3. Lambda関数作成
```bash
# IAMロール作成
aws iam create-role --role-name multi-lwa-lambda-role --assume-role-policy-document file://trust-policy.json

# Lambda関数作成
aws lambda create-function \
  --function-name multi-lwa-central \
  --package-type Image \
  --code ImageUri=<account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/multi-lwa-central:latest \
  --role arn:aws:iam::<account-id>:role/multi-lwa-lambda-role
```

### 4. Function URL作成
```bash
aws lambda create-function-url-config \
  --function-name multi-lwa-central \
  --auth-type NONE
```

## デプロイ後の確認

1. **Function URLにアクセス**
2. **デモアカウントでログイン**
   - 管理者: `admin` / `password`
   - 一般: `user` / `password`
3. **各機能の動作確認**

## トラブルシューティング

### AWS CLI未設定
```bash
aws configure
# Access Key ID, Secret, Region (ap-northeast-1), Output format (json)
```

### ECR認証エラー
```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com
```

### Lambda関数の起動が遅い
- メモリを1024MB以上に増加
- Provisioned Concurrencyの設定

## 料金目安

- **Lambda**: 月100リクエストなら数円
- **ECR**: イメージストレージ 約$0.10/GB/月
- **総額**: 月$5以下（軽い使用の場合）
