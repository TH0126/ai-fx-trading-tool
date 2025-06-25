import { Router } from 'express'
import { logger } from '../utils/logger'

const router = Router()

// 通貨ペア一覧取得
router.get('/symbols', async (req, res) => {
  try {
    logger.info('Getting currency symbols list')
    
    // TODO: 実際のデータベースまたは外部APIから取得
    const symbols = [
      { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
      { symbol: 'EUR/USD', name: 'Euro / US Dollar' },
      { symbol: 'GBP/USD', name: 'British Pound / US Dollar' },
      { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
      { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
    ]

    res.json({
      success: true,
      data: symbols,
      count: symbols.length,
    })
  } catch (error) {
    logger.error('Error fetching symbols:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch currency symbols',
    })
  }
})

// ローソク足データ取得
router.get('/candles/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { timeframe = '1h', limit = 100 } = req.query

    logger.info(`Getting candle data for ${symbol}`, { symbol, timeframe, limit })

    // TODO: 実際のデータベースまたは外部APIから取得
    const mockCandles = Array.from({ length: Number(limit) }, (_, i) => ({
      timestamp: Date.now() - (Number(limit) - i - 1) * 3600000, // 1時間間隔
      open: 149.50 + Math.random() * 2,
      high: 149.50 + Math.random() * 3,
      low: 149.50 - Math.random() * 2,
      close: 149.50 + Math.random() * 2,
      volume: Math.floor(Math.random() * 1000000),
    }))

    res.json({
      success: true,
      data: {
        symbol,
        timeframe,
        candles: mockCandles,
      },
    })
  } catch (error) {
    logger.error('Error fetching candle data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch candle data',
    })
  }
})

// リアルタイム価格取得
router.get('/price/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    
    logger.info(`Getting real-time price for ${symbol}`)

    // TODO: 実際のリアルタイムデータから取得
    const mockPrice = {
      symbol,
      bid: 149.50 + Math.random() * 2,
      ask: 149.52 + Math.random() * 2,
      timestamp: Date.now(),
      change: Math.random() * 0.5 - 0.25,
      changePercent: Math.random() * 1 - 0.5,
    }

    res.json({
      success: true,
      data: mockPrice,
    })
  } catch (error) {
    logger.error('Error fetching price data:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch price data',
    })
  }
})

export { router as marketRoutes } 