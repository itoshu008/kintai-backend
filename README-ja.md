# 勤怠管理バックエンドシステム (Windows + Node v22)

## 概要
このシステムは、社員の出退勤管理、部署管理、勤怠記録、備考管理、バックアップ機能を提供するRESTful APIバックエンドです。

## 主な機能
- **社員管理**: 社員の登録、更新、削除、検索
- **部署管理**: 部署の作成、編集、削除
- **勤怠管理**: 出勤・退勤の打刻、勤怠時間の修正
- **備考管理**: 日別の備考・メモの保存・取得
- **祝日管理**: 日本の祝日カレンダー機能
- **週次レポート**: 週単位での勤怠集計
- **セッション管理**: ユーザー認証・セッション管理
- **バックアップ**: データの自動・手動バックアップと復元

## セットアップ手順

### 1. 環境準備
```bash
# 環境変数ファイルのコピーと設定
cp env.example .env
# .envファイルを編集して必要な値を設定
```

### 2. 依存関係のインストール
```bash
npm ci
# または
npm install
```

### 3. TypeScriptのビルド
```bash
npm run build
```

### 4. サーバーの起動
```bash
# 開発環境
npm run start:dev

# 本番環境
npm run start:prod
```

## ヘルスチェック
サーバーが正常に動作しているか確認：
```
GET http://127.0.0.1:8001/api/admin/health
```
レスポンス例：
```json
{
  "ok": true,
  "env": "development",
  "now": "2024-01-01T00:00:00.000Z"
}
```

## API エンドポイント

### 部署管理
- `GET /api/admin/departments` - 部署一覧取得
- `POST /api/admin/departments` - 部署追加
- `PUT /api/admin/departments/:id` - 部署更新
- `DELETE /api/admin/departments/:id` - 部署削除

### 社員管理
- `GET /api/admin/employees` - 社員一覧取得
- `POST /api/admin/employees` - 社員追加
- `PUT /api/admin/employees/:code` - 社員更新
- `DELETE /api/admin/employees/:code` - 社員削除
- `GET /api/admin/employees/:code/exists` - 社員コード存在確認

### 勤怠管理
- `POST /api/admin/clock/in` - 出勤打刻
- `POST /api/admin/clock/out` - 退勤打刻
- `POST /api/admin/attendance/checkin` - 出勤打刻（フロントエンド互換）
- `POST /api/admin/attendance/checkout` - 退勤打刻（フロントエンド互換）
- `PUT /api/admin/attendance/update` - 勤怠時間修正

### 備考管理
- `POST /api/admin/remarks` - 備考保存
- `GET /api/admin/remarks/:employeeCode/:date` - 個別備考取得
- `GET /api/admin/remarks/:employeeCode` - 月別備考取得

### 祝日管理
- `GET /api/admin/holidays` - 祝日一覧取得
- `GET /api/admin/holidays/:date` - 特定日の祝日チェック

### 週次レポート
- `GET /api/admin/weekly` - 週次レポート取得

### セッション管理
- `POST /api/admin/sessions` - セッション保存
- `GET /api/admin/sessions/:sessionId` - セッション取得
- `DELETE /api/admin/sessions/:sessionId` - セッション削除

### バックアップ管理
- `GET /api/admin/backups` - バックアップ一覧取得
- `POST /api/admin/backups/create` - バックアップ作成
- `POST /api/admin/backup` - バックアップ作成（フロントエンド互換）
- `DELETE /api/admin/backups/:name` - バックアップ削除
- `GET /api/admin/backups/:id/preview` - バックアッププレビュー
- `POST /api/admin/backups/restore` - バックアップ復元
- `POST /api/admin/backups/:id/restore` - バックアップ復元（フロントエンド互換）
- `POST /api/admin/backups/cleanup` - バックアップクリーンアップ

### マスターデータ
- `GET /api/admin/master` - 全マスターデータ取得

## データ構造

### 社員データ
```json
{
  "code": "EMP001",
  "name": "田中太郎",
  "department_id": 1,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 部署データ
```json
{
  "id": 1,
  "name": "営業部",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 勤怠データ
```json
{
  "code": "EMP001",
  "date": "2024-01-01",
  "clock_in": "2024-01-01T09:00:00.000Z",
  "clock_out": "2024-01-01T18:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 備考データ
```json
{
  "code": "EMP001",
  "date": "2024-01-01",
  "remark": "午後から外出",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `HOST` | サーバーホスト | `0.0.0.0` |
| `PORT` | サーバーポート | `8001` |
| `NODE_ENV` | 実行環境 | `development` |
| `DATA_DIR` | データディレクトリ | `./data` |
| `TZ` | タイムゾーン | `Asia/Tokyo` |
| `SESSION_SECRET` | セッション秘密鍵 | - |
| `SESSION_TIMEOUT` | セッションタイムアウト（ミリ秒） | `3600000` |
| `BACKUP_ENABLED` | バックアップ有効化 | `1` |
| `BACKUP_INTERVAL_MINUTES` | バックアップ間隔（分） | `60` |
| `BACKUP_MAX_KEEP` | 保持するバックアップ数 | `24` |

## 本番環境での運用

### PM2を使用した本番運用
```bash
# PM2でアプリケーションを起動
pm2 start pm2.config.cjs

# ステータス確認
pm2 status

# ログ確認
pm2 logs kintai-api

# 再起動
pm2 restart kintai-api

# 停止
pm2 stop kintai-api
```

### データバックアップ
システムは自動的にデータをバックアップします：
- 設定された間隔で自動バックアップを実行
- 手動でバックアップを作成可能
- 古いバックアップの自動クリーンアップ

## トラブルシューティング

### よくある問題

1. **サーバーが起動しない**
   - ポートが既に使用されていないか確認
   - 環境変数が正しく設定されているか確認

2. **データが保存されない**
   - データディレクトリの書き込み権限を確認
   - ディスク容量を確認

3. **APIが応答しない**
   - ヘルスチェックエンドポイントでサーバー状態を確認
   - ログファイルでエラーを確認

### ログの確認
```bash
# PM2ログの確認
pm2 logs kintai-api

# エラーログのみ
pm2 logs kintai-api --err

# 出力ログのみ
pm2 logs kintai-api --out
```

## 開発者向け情報

### プロジェクト構造
```
src/
├── config.ts              # 設定ファイル
├── index.ts               # アプリケーションエントリーポイント
├── server.ts              # サーバー起動ファイル
├── routes/
│   └── admin/
│       └── index.ts       # 管理APIルート
├── utils/
│   └── dataStore.ts       # データストレージユーティリティ
└── helpers/
    └── writeJsonAtomic.ts # アトミック書き込みヘルパー
```

### 技術スタック
- **Node.js**: v22
- **TypeScript**: v5.6.3
- **Express**: v4.19.2
- **PM2**: プロセス管理
- **JSON**: データストレージ

### コントリビューション
1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/新機能`)
3. 変更をコミット (`git commit -am '新機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/新機能`)
5. プルリクエストを作成

## ライセンス
MIT License

## サポート
問題が発生した場合は、GitHubのIssuesページで報告してください。

