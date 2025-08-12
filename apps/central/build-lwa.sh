#!/bin/bash

# Central App - Lambda Web Adapter デプロイ用ビルドスクリプト

set -e

echo "=== Central App - Lambda Web Adapter ビルド ==="

APP_NAME="central"
TAG=${1:-latest}
IMAGE_NAME="multi-lwa-central"

echo "アプリケーション: ${APP_NAME}"
echo "イメージ名: ${IMAGE_NAME}:${TAG}"

# 古いイメージを削除（オプション）
if docker images "${IMAGE_NAME}:${TAG}" --format "{{.Repository}}:{{.Tag}}" | grep -q "${IMAGE_NAME}:${TAG}"; then
    echo "既存のイメージを削除中: ${IMAGE_NAME}:${TAG}"
    docker rmi "${IMAGE_NAME}:${TAG}" || true
fi

# Dockerイメージをビルド
echo "Dockerイメージをビルド中..."

docker build -t "${IMAGE_NAME}:${TAG}" .

if [ $? -eq 0 ]; then
    echo "✅ ビルド完了: ${IMAGE_NAME}:${TAG}"
    
    # イメージサイズを表示
    echo "イメージサイズ:"
    docker images "${IMAGE_NAME}:${TAG}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
    
    echo ""
    echo "🚀 Central App デプロイ準備完了"
    echo "次のステップ:"
    echo "1. ECRリポジトリにプッシュ"
    echo "2. Lambda関数の更新 (Central App)"
    echo "3. 環境変数の設定:"
    echo "   - FEATURE_A_URL: Feature A アプリのURL"
    echo "   - FEATURE_B_URL: Feature B アプリのURL"
else
    echo "❌ ビルドに失敗しました"
    exit 1
fi
