#!/bin/bash

# 全アプリケーション - Lambda Web Adapter デプロイ用ビルドスクリプト

set -e

echo "=== 全アプリケーション Lambda Web Adapter ビルド ==="

TAG=${1:-latest}

echo "イメージタグ: ${TAG}"
echo ""

# ビルド対象アプリケーション
APPS=("central" "feature-a" "feature-b")
FAILED_APPS=()

# 各アプリケーションを順次ビルド
for app in "${APPS[@]}"; do
    echo "📦 ${app} アプリケーションをビルド中..."
    
    if [ -d "apps/${app}" ]; then
        cd "apps/${app}"
        
        if [ -f "build-lwa.sh" ]; then
            chmod +x build-lwa.sh
            ./build-lwa.sh "${TAG}"
            
            if [ $? -ne 0 ]; then
                FAILED_APPS+=("${app}")
                echo "❌ ${app} のビルドに失敗しました"
            else
                echo "✅ ${app} のビルドが完了しました"
            fi
        else
            echo "⚠️  ${app}/build-lwa.sh が見つかりません"
            FAILED_APPS+=("${app}")
        fi
        
        cd ../../
        echo ""
    else
        echo "⚠️  apps/${app} ディレクトリが見つかりません"
        FAILED_APPS+=("${app}")
    fi
done

# 結果サマリー
echo "=== ビルド結果サマリー ==="
echo "成功したアプリケーション:"
for app in "${APPS[@]}"; do
    if [[ ! " ${FAILED_APPS[@]} " =~ " ${app} " ]]; then
        echo "  ✅ ${app}"
    fi
done

if [ ${#FAILED_APPS[@]} -gt 0 ]; then
    echo ""
    echo "失敗したアプリケーション:"
    for app in "${FAILED_APPS[@]}"; do
        echo "  ❌ ${app}"
    done
    echo ""
    echo "❌ 一部のアプリケーションでビルドが失敗しました"
    exit 1
else
    echo ""
    echo "🎉 全てのアプリケーションのビルドが完了しました！"
    echo ""
    echo "作成されたイメージ:"
    echo "  - multi-lwa-central:${TAG}"
    echo "  - multi-lwa-feature-a:${TAG}"
    echo "  - multi-lwa-feature-b:${TAG}"
    echo ""
    echo "🚀 全アプリケーション デプロイ準備完了"
fi
