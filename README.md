# AI FX Trading Assistant

## 📊 プロジェクト概要

AI FX Trading Assistantは、個人FXトレーダー（初心者〜上級者）向けのAI支援トレーディングツールです。リアルタイムチャート分析、テクニカル指標計算、AIによるパターン認識とシグナル生成を統合した包括的なプラットフォームを提供します。

### 🎯 主要機能

- **📈 リアルタイムチャート**: TradingViewライクなインタラクティブチャート
- **🤖 AI分析**: 機械学習によるパターン認識とシグナル生成
- **📊 テクニカル指標**: 20種類以上の指標をサポート
- **📰 ファンダメンタル分析**: ニュースセンチメント・経済指標連携
- **⚡ リアルタイム更新**: 1秒以内のデータ更新
- **📱 レスポンシブ対応**: デスクトップ・タブレット・スマートフォン対応

### 💻 技術スタック

#### フロントエンド
- **フレームワーク**: React 18 + TypeScript + Vite
- **UIライブラリ**: Material-UI v5
- **状態管理**: Zustand
- **データフェッチング**: React Query (TanStack Query)
- **チャートライブラリ**: Lightweight Charts
- **リアルタイム通信**: Socket.io-client

#### バックエンド
- **Node.js API**: Express + TypeScript + Socket.io
- **Python AI分析**: FastAPI + TensorFlow + TA-Lib
- **データベース**: PostgreSQL + Redis
- **ORM**: Prisma

#### 外部API連携
- **価格データ**: Alpha Vantage API
- **ニュースデータ**: NewsAPI
- **経済指標**: Economic Calendar API

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0.0以上
- npm 9.0.0以上
- Python 3.9以上（AI分析エンジン用）
- Docker & Docker Compose（推奨）

### インストール

1. **リポジトリのクローン**
```bash
git clone https://github.com/your-username/ai-fx-trading-assistant.git
cd ai-fx-trading-assistant
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**
```bash
cp env.example .env
# .envファイルを編集してAPIキーを設定
```

4. **開発サーバーの起動**
```bash
npm run dev
```

アプリケーションが `http://localhost:3000` で起動します。

## 📁 プロジェクト構造

```
ai-fx-trading-tool/
├── src/                      # ソースコード
│   ├── components/           # Reactコンポーネント
│   ├── hooks/               # カスタムフック
│   ├── services/            # API・ビジネスロジック
│   ├── utils/               # ユーティリティ関数
│   ├── types/               # TypeScript型定義
│   └── ai-analysis/         # AI分析関連
├── docs/                    # ドキュメント
├── tests/                   # テストファイル
├── data/                    # データファイル
├── package.json            # NPM設定
├── tsconfig.json           # TypeScript設定
├── vite.config.ts          # Vite設定
└── @todo.md                # タスク管理
```

## 🔧 開発

### スクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run type-check

# リンター実行
npm run lint

# テスト実行
npm run test
```

### 開発環境セットアップ

1. **TypeScript設定**: 厳密な型チェックを有効化
2. **パスエイリアス**: `@/` プレフィックスでのインポート
3. **WebSocketプロキシ**: バックエンドとの通信設定
4. **Hot Reload**: 開発時の自動リロード

## 🏗️ 開発フェーズ

### ✅ フェーズ1: プロジェクト準備（完了）
- [x] プロジェクト構造作成
- [x] 要件定義書作成
- [x] 技術スタック決定
- [x] 環境設定ファイル作成
- [x] 型定義ファイル作成

### 🔄 フェーズ2: 環境構築（次回）
- [ ] フロントエンド環境構築
- [ ] バックエンド環境構築
- [ ] 外部API連携準備
- [ ] Docker環境構築

### ⏳ フェーズ3: 基礎実装
- [ ] チャート機能実装
- [ ] テクニカル指標実装
- [ ] AI分析エンジン基礎実装

### ⏳ フェーズ4: 機能開発
- [ ] リアルタイム機能実装
- [ ] FX特化機能実装
- [ ] テスト・最適化

## 📊 パフォーマンス目標

- **チャート描画**: 5000本のローソク足を60fps で描画
- **データ更新**: 1秒以内のリアルタイム更新
- **API応答**: 500ms以下のレスポンス時間
- **AI分析**: 5秒以内のシグナル生成

## 🔒 セキュリティ

- JWT トークンベース認証
- HTTPS通信
- APIキーの安全な管理
- レート制限による悪用防止

## 📈 成功指標（KPI）

### 技術指標
- チャート描画パフォーマンス: 60fps維持率 > 95%
- データ更新遅延: 平均 < 500ms
- システム稼働率: > 99.5%

### AI分析精度
- シグナル的中率: > 60%（初期目標）
- 偽陽性率: < 30%
- 分析結果提供時間: < 5秒

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing-feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ 免責事項

このツールは教育・研究目的で開発されています。実際の投資判断は自己責任で行ってください。開発者は投資結果に対して一切の責任を負いません。

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 サポート

- Issues: GitHub Issues
- Documentation: `/docs` フォルダ
- Email: support@example.com

---

**注意**: このプロジェクトは開発中です。本番環境での使用前に十分なテストを行ってください。 