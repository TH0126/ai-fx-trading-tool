import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

interface CustomError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ログ出力
  logger.error(`Error in ${req.method} ${req.path}: ${err.message}`, {
    error: err.stack,
    method: req.method,
    path: req.path,
    statusCode: err.statusCode,
  })

  // デフォルトエラー設定
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  const isProduction = process.env['NODE_ENV'] === 'production'

  // レスポンス
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isProduction ? {} : { stack: err.stack }),
      statusCode,
      timestamp: new Date().toISOString(),
    },
  })
}

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next) 