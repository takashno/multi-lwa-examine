# Lambda Web Adapter用 最適化Dockerfile
# ========================================
# ビルドステージ
# ========================================
FROM public.ecr.aws/lambda/nodejs:22 as builder

WORKDIR /app

# パッケージファイルをコピー
COPY package.json ./

# 全依存関係のインストール（ビルド用）
RUN npm install --silent

# ソースコードをコピー
COPY . .

# Nuxtアプリケーションをビルド
RUN npm run build

# ========================================
# 本番ステージ
# ========================================
FROM public.ecr.aws/lambda/nodejs:22

# Lambda Web Adapterの追加
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter

# 作業ディレクトリの設定
WORKDIR /var/task

# package.jsonをコピーして本番用依存関係のみインストール
COPY package.json ./
RUN npm install --only=production --silent && npm cache clean --force

# ビルド成果物のみをコピー
COPY --from=builder /app/.output ./.output

# 不要なファイルを削除
RUN rm -rf /tmp/* /var/cache/* /root/.npm

# Lambda Web Adapter環境変数の設定
ENV AWS_LAMBDA_EXEC_WRAPPER=/opt/extensions/lambda-adapter
ENV RUST_LOG=info
ENV PORT=8080
ENV NODE_ENV=production

# ポートを公開
EXPOSE 8080

# アプリケーションの起動
CMD ["node", ".output/server/index.mjs"]
