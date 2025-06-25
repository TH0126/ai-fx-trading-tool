import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import dotenv from 'dotenv'
import { logger } from '@/utils/logger'
import { errorHandler } from '@/middleware/errorHandler'
import { marketRoutes } from '@/routes/marketRoutes'
import { aiRoutes } from '@/routes/aiRoutes'
import { authRoutes } from '@/routes/authRoutes'
import { websocketHandler } from '@/services/websocketService'

// 環境変数読み込み
dotenv.config()

const app = express()
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

// セキュリティミドルウェア
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}))

// CORS設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}))

// レート制限
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: NODE_ENV === 'production' ? 100 : 1000, // リクエスト制限
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

// その他のミドルウェア
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ヘルスチェック
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  })
})

// API ルーティング
app.use('/api/auth', authRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/ai', aiRoutes)

// WebSocket接続処理
websocketHandler(io)

// エラーハンドリング
app.use(errorHandler)

// 404ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  })
})

// サーバー起動
server.listen(PORT, () => {
  logger.info(`🚀 AI FX Trading Backend Server is running`)
  logger.info(`📍 Port: ${PORT}`)
  logger.info(`🌍 Environment: ${NODE_ENV}`)
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`)
})

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  server.close(() => {
    logger.info('Process terminated')
    process.exit(0)
  })
})

export { app, server, io } 