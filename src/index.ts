<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { admin } from './routes/admin/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルート設定
app.use('/api/admin', admin);

// ヘルスチェック
app.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404ハンドラー
app.use('*', (_req, res) => {
  res.status(404).json({ 
    ok: false, 
    error: 'Not Found' 
  });
});

// エラーハンドラー
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    ok: false, 
    error: 'Internal Server Error' 
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Admin API: http://localhost:${PORT}/api/admin`);
});

=======
// backend/src/index.ts
import express from 'express';

export function createApp() {
  const app = express();

  // ここにミドルウェアやルートを追加
  app.get('/api/admin/health', (_req, res) =>
    res.json({ ok: true, env: process.env.NODE_ENV ?? 'dev', now: new Date().toISOString() })
  );

  return app;
}

export const app = createApp();
>>>>>>> 1c2fbb3 (fix: resolve file structure and encoding issues)
export default app;