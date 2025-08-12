# Dockerfile構成ガイド

このディレクトリには以下のDockerfileがあります：

## メインDockerfile

### `Dockerfile`
- **用途**: 本番用デプロイメント
- **特徴**: マルチステージビルドによる最適化
- **サイズ**: 約644MB
- **推奨**: Lambda Web Adapterデプロイ用のデフォルト

## 代替Dockerfile

### `Dockerfile.ultra-light`
- **用途**: さらなる軽量化が必要な場合
- **特徴**: Alpine Linuxベースでの最大限軽量化
- **サイズ**: 未測定（500MB以下を目標）
- **注意**: 実験的、互換性問題の可能性あり

## 使用方法

```bash
# メイン版でビルド
docker build -t multi-lwa-central:latest .

# 軽量版でビルド
docker build -f Dockerfile.ultra-light -t multi-lwa-central:ultra-light .
```

## 最適化のポイント

1. **マルチステージビルド**: ビルド環境と実行環境を分離
2. **本番用依存関係のみ**: 開発用ツールを除外
3. **キャッシュクリーンアップ**: 不要なファイルを削除
4. **ビルド成果物のみコピー**: `.output`ディレクトリのみ

## サイズ比較

- 初期版: 1.3GB
- 最適化版: 644MB（50%削減）
- 目標（ultra-light版）: 500MB以下
