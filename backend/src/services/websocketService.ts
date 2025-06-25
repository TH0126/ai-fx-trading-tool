import { Server as SocketIOServer, Socket } from 'socket.io'
import { logger } from '../utils/logger'

interface ConnectedClient {
  id: string
  socket: Socket
  subscribedSymbols: string[]
  lastSeen: number
}

const connectedClients = new Map<string, ConnectedClient>()

// リアルタイム価格更新のモック（実際の実装では外部APIから取得）
const mockPriceUpdates = () => {
  const symbols = ['USD/JPY', 'EUR/USD', 'GBP/USD', 'AUD/USD']
  
  return symbols.map(symbol => ({
    symbol,
    bid: 149.50 + Math.random() * 2,
    ask: 149.52 + Math.random() * 2,
    timestamp: Date.now(),
    change: Math.random() * 0.5 - 0.25,
    changePercent: Math.random() * 1 - 0.5,
  }))
}

export const websocketHandler = (io: SocketIOServer) => {
  io.on('connection', (socket: Socket) => {
    const clientId = socket.id
    logger.info(`WebSocket client connected: ${clientId}`)

    // クライアント情報を保存
    connectedClients.set(clientId, {
      id: clientId,
      socket,
      subscribedSymbols: [],
      lastSeen: Date.now(),
    })

    // 通貨ペア購読
    socket.on('subscribe', (data: { symbols: string[] }) => {
      const client = connectedClients.get(clientId)
      if (client) {
        client.subscribedSymbols = data.symbols
        client.lastSeen = Date.now()
        logger.info(`Client ${clientId} subscribed to symbols:`, data.symbols)
        
        // 購読確認を送信
        socket.emit('subscribed', {
          symbols: data.symbols,
          timestamp: Date.now(),
        })
      }
    })

    // 通貨ペア購読解除
    socket.on('unsubscribe', (data: { symbols: string[] }) => {
      const client = connectedClients.get(clientId)
      if (client) {
        client.subscribedSymbols = client.subscribedSymbols.filter(
          symbol => !data.symbols.includes(symbol)
        )
        client.lastSeen = Date.now()
        logger.info(`Client ${clientId} unsubscribed from symbols:`, data.symbols)
      }
    })

    // AI分析結果の購読
    socket.on('subscribe_ai', (data: { symbol: string }) => {
      logger.info(`Client ${clientId} subscribed to AI analysis for ${data.symbol}`)
      
      // AI分析結果をモック送信（実際の実装では定期的なAI分析結果を送信）
      setTimeout(() => {
        socket.emit('ai_analysis', {
          symbol: data.symbol,
          analysis: {
            timestamp: Date.now(),
            signal: {
              type: Math.random() > 0.5 ? 'buy' : 'sell',
              strength: 5 + Math.random() * 5,
              confidence: 0.5 + Math.random() * 0.5,
            },
            sentiment: {
              score: Math.random() * 2 - 1,
              overall: Math.random() > 0.5 ? 'bullish' : 'bearish',
            },
          },
        })
      }, 2000)
    })

    // ハートビート
    socket.on('ping', () => {
      const client = connectedClients.get(clientId)
      if (client) {
        client.lastSeen = Date.now()
      }
      socket.emit('pong', { timestamp: Date.now() })
    })

    // 切断処理
    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket client disconnected: ${clientId}, reason: ${reason}`)
      connectedClients.delete(clientId)
    })

    // エラーハンドリング
    socket.on('error', (error) => {
      logger.error(`WebSocket error for client ${clientId}:`, error)
    })
  })

  // 定期的な価格更新の送信（モック）
  const priceUpdateInterval = setInterval(() => {
    const priceUpdates = mockPriceUpdates()
    
    connectedClients.forEach((client) => {
      if (client.subscribedSymbols.length > 0) {
        const relevantUpdates = priceUpdates.filter(update =>
          client.subscribedSymbols.includes(update.symbol)
        )
        
        if (relevantUpdates.length > 0) {
          client.socket.emit('price_update', {
            prices: relevantUpdates,
            timestamp: Date.now(),
          })
        }
      }
    })
  }, 1000) // 1秒間隔

  // 非アクティブクライアントのクリーンアップ
  const cleanupInterval = setInterval(() => {
    const now = Date.now()
    const timeout = 5 * 60 * 1000 // 5分

    connectedClients.forEach((client, clientId) => {
      if (now - client.lastSeen > timeout) {
        logger.info(`Cleaning up inactive client: ${clientId}`)
        client.socket.disconnect()
        connectedClients.delete(clientId)
      }
    })
  }, 60000) // 1分間隔

  // サーバー終了時のクリーンアップ
  const cleanup = () => {
    clearInterval(priceUpdateInterval)
    clearInterval(cleanupInterval)
    connectedClients.clear()
  }

  process.on('SIGTERM', cleanup)
  process.on('SIGINT', cleanup)

  return { connectedClients, cleanup }
} 