import winston from 'winston'
import path from 'path'

const { combine, timestamp, errors, json, printf, colorize } = winston.format

// カスタムフォーマット
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`
})

// ログレベル設定
const logLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

// ログディレクトリ
const logDir = path.join(process.cwd(), 'logs')

// Logger設定
export const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'ai-fx-trading-backend' },
  transports: [
    // ファイル出力（本番環境）
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
})

// 開発環境ではコンソール出力も追加
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'HH:mm:ss' }),
      customFormat
    ),
  }))
}

// ログディレクトリ作成
import fs from 'fs'
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// ログレベル別のヘルパー関数
export const loggerHelpers = {
  apiRequest: (method: string, url: string, userId?: string) => {
    logger.info(`API Request: ${method} ${url}`, { method, url, userId })
  },
  
  apiResponse: (method: string, url: string, statusCode: number, duration: number) => {
    logger.info(`API Response: ${method} ${url} - ${statusCode} (${duration}ms)`, {
      method,
      url,
      statusCode,
      duration,
    })
  },
  
  marketData: (symbol: string, action: string, data?: any) => {
    logger.debug(`Market Data: ${symbol} - ${action}`, { symbol, action, data })
  },
  
  aiAnalysis: (symbol: string, analysisType: string, result?: any) => {
    logger.info(`AI Analysis: ${symbol} - ${analysisType}`, { symbol, analysisType, result })
  },
  
  websocket: (event: string, clientId: string, data?: any) => {
    logger.debug(`WebSocket: ${event} - Client: ${clientId}`, { event, clientId, data })
  },
  
  error: (error: Error, context?: string) => {
    logger.error(`Error${context ? ` in ${context}` : ''}: ${error.message}`, {
      error: error.stack,
      context,
    })
  },
  
  performance: (operation: string, duration: number, metadata?: any) => {
    logger.info(`Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      metadata,
    })
  },
} 