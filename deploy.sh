#!/bin/bash

# Multi-LWA Deployment Script
# AWS Lambda + ECR + Function URL でのデプロイ自動化

set -e

# 設定
AWS_REGION=${AWS_REGION:-ap-northeast-1}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-""}
PROJECT_NAME="multi-lwa"

# 色付きメッセージ
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# AWS Account ID の取得
get_account_id() {
    if [ -z "$AWS_ACCOUNT_ID" ]; then
        log_info "AWS Account IDを取得中..."
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
        if [ -z "$AWS_ACCOUNT_ID" ]; then
            log_error "AWS Account IDの取得に失敗しました。AWS CLIの設定を確認してください。"
            echo "aws configure または aws sso login を実行してください。"
            exit 1
        fi
        log_success "AWS Account ID: $AWS_ACCOUNT_ID"
    fi
}

# ECRリポジトリの作成
create_ecr_repositories() {
    log_info "ECRリポジトリを作成中..."
    
    for app in central feature-a feature-b; do
        repo_name="${PROJECT_NAME}-${app}"
        
        # リポジトリが存在するかチェック
        if aws ecr describe-repositories --repository-names "$repo_name" --region "$AWS_REGION" >/dev/null 2>&1; then
            log_warning "ECRリポジトリ $repo_name は既に存在します"
        else
            log_info "ECRリポジトリ $repo_name を作成中..."
            aws ecr create-repository \
                --repository-name "$repo_name" \
                --region "$AWS_REGION" \
                --image-scanning-configuration scanOnPush=true >/dev/null
            log_success "ECRリポジトリ $repo_name を作成しました"
        fi
    done
}

# Dockerイメージのプッシュ
push_docker_images() {
    log_info "Dockerイメージをプッシュ中..."
    
    # ECRにログイン
    log_info "ECRにログイン中..."
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
    
    for app in central feature-a feature-b; do
        local_image="${PROJECT_NAME}-${app}:v8080"
        ecr_image="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-${app}:latest"
        
        log_info "イメージ $local_image をタグ付け中..."
        docker tag "$local_image" "$ecr_image"
        
        log_info "イメージ $ecr_image をプッシュ中..."
        docker push "$ecr_image"
        log_success "イメージ $ecr_image をプッシュしました"
    done
}

# Lambda実行ロールの作成
create_lambda_role() {
    local role_name="${PROJECT_NAME}-lambda-role"
    
    # ロールが存在するかチェック
    if aws iam get-role --role-name "$role_name" >/dev/null 2>&1; then
        log_warning "IAMロール $role_name は既に存在します"
        echo "arn:aws:iam::${AWS_ACCOUNT_ID}:role/${role_name}"
        return
    fi
    
    log_info "Lambda実行ロール $role_name を作成中..."
    
    # 信頼ポリシー
    cat > /tmp/trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
    
    # ロール作成
    role_arn=$(aws iam create-role \
        --role-name "$role_name" \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        --query 'Role.Arn' \
        --output text)
    
    # 基本実行ポリシーをアタッチ
    aws iam attach-role-policy \
        --role-name "$role_name" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
    
    log_success "Lambda実行ロール $role_name を作成しました"
    echo "$role_arn"
    
    # ロールの作成完了を待つ
    log_info "ロールの準備完了を待機中（10秒）..."
    sleep 10
}

# Lambda関数の作成
create_lambda_functions() {
    local role_arn="$1"
    
    log_info "Lambda関数を作成中..."
    
    for app in central feature-a feature-b; do
        function_name="${PROJECT_NAME}-${app}"
        image_uri="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-${app}:latest"
        
        # 関数が存在するかチェック
        if aws lambda get-function --function-name "$function_name" >/dev/null 2>&1; then
            log_warning "Lambda関数 $function_name は既に存在します。更新中..."
            aws lambda update-function-code \
                --function-name "$function_name" \
                --image-uri "$image_uri" >/dev/null
            log_success "Lambda関数 $function_name を更新しました"
        else
            log_info "Lambda関数 $function_name を作成中..."
            aws lambda create-function \
                --function-name "$function_name" \
                --package-type Image \
                --code ImageUri="$image_uri" \
                --role "$role_arn" \
                --timeout 30 \
                --memory-size 512 >/dev/null
            log_success "Lambda関数 $function_name を作成しました"
        fi
    done
}

# Function URLの作成
create_function_urls() {
    log_info "Function URLを作成中..."
    
    declare -A function_urls
    
    for app in central feature-a feature-b; do
        function_name="${PROJECT_NAME}-${app}"
        
        # Function URLが存在するかチェック
        existing_url=$(aws lambda get-function-url-config \
            --function-name "$function_name" \
            --query 'FunctionUrl' \
            --output text 2>/dev/null || echo "None")
        
        if [ "$existing_url" != "None" ]; then
            log_warning "Function URL for $function_name は既に存在します: $existing_url"
            function_urls[$app]="$existing_url"
        else
            log_info "Function URL for $function_name を作成中..."
            function_url=$(aws lambda create-function-url-config \
                --function-name "$function_name" \
                --auth-type NONE \
                --cors AllowCredentials=true,AllowHeaders="*",AllowMethods="*",AllowOrigins="*" \
                --query 'FunctionUrl' \
                --output text)
            
            function_urls[$app]="$function_url"
            log_success "Function URL for $function_name: $function_url"
        fi
    done
    
    # Central関数の環境変数を更新
    log_info "Central関数の環境変数を更新中..."
    aws lambda update-function-configuration \
        --function-name "${PROJECT_NAME}-central" \
        --environment Variables="{
            \"FEATURE_A_URL\":\"${function_urls[feature-a]}\",
            \"FEATURE_B_URL\":\"${function_urls[feature-b]}\"
        }" >/dev/null
    
    log_success "環境変数を更新しました"
    
    # 結果表示
    echo ""
    log_success "🎉 デプロイ完了！"
    echo ""
    echo "📱 アプリケーションURL:"
    echo "  🏠 Central (ダッシュボード): ${function_urls[central]}"
    echo "  📝 Feature A (TODO管理):   ${function_urls[feature-a]}"
    echo "  👤 Feature B (Profile管理): ${function_urls[feature-b]}"
    echo ""
    echo "🔑 デモアカウント:"
    echo "  管理者: admin / password"
    echo "  一般ユーザー: user / password"
}

# メイン実行
main() {
    echo "🚀 Multi-LWA Deployment Script"
    echo "=============================="
    
    get_account_id
    create_ecr_repositories
    push_docker_images
    
    role_arn=$(create_lambda_role)
    create_lambda_functions "$role_arn"
    create_function_urls
    
    log_success "✨ デプロイが完了しました！"
}

# スクリプト実行
main "$@"
