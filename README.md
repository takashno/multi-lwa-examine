# Multi-Nuxt (Nuxt4 + Lambda Web Adapter + API Gateway + CloudFront + WAF) 検証プロジェクト

## 概要
このプロジェクトは、Nuxt4 アプリケーションを 3 つ（Central, FeatureA, FeatureB）用意し、AWS Lambda (Docker/Lambda Web Adapter) 上で SSR 実行するマルチアプリケーション構成です。

静的アセットは S3 + CloudFront から配信し、API Gateway HTTP API 経由で SSR/動的 API を提供します。  
CloudFront の前段に AWS WAF を設定し、Cognito JWT オーソライザーで API 認証を行います。

## 技術スタック
- **Frontend**: Nuxt4 (Node.js 22)
- **Package Manager**: Yarn
- **Deployment**: AWS Lambda (Docker/Lambda Web Adapter)
- **Static Assets**: S3 + CloudFront
- **API**: API Gateway HTTP API
- **Authentication**: AWS Cognito (Hosted UI + JWT)
- **Security**: AWS WAF
- **Infrastructure**: AWS CDK

## プロジェクト構成

```
multi-lwa-examine/
├─ README.md
├─ apps/
│  ├─ central/                  # Central アプリ (認証・メインページ)
│  │  ├─ package.json           # Nuxt4アプリ設定
│  │  ├─ yarn.lock              # 独立した依存関係
│  │  ├─ nuxt.config.ts         # Nuxt設定
│  │  ├─ app/                   # アプリケーションコード
│  │  └─ .nuxt/                 # Nuxt生成ファイル
│  ├─ feature-a/                # FeatureA アプリ (未作成)
│  └─ feature-b/                # FeatureB アプリ (未作成)
├─ infra/                       # CDKプロジェクト (未作成)
└─ development/
   └─ prompt/
      └─ 0010_first.md          # プロジェクト仕様書
```

## 開発環境セットアップ

### 前提条件
- Node.js 22.x
- Yarn

### 初期セットアップ
```bash
# リポジトリクローン
git clone <repository-url>
cd multi-lwa
