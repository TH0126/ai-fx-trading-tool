import axios from 'axios'
import { CurrencyPair, Timeframe, CandleData, RealTimePriceData } from '@/types'

interface AlphaVantageConfig {
  apiKey: string
  baseUrl: string
}



interface AlphaVantageTimeSeriesResponse {
  'Meta Data': {
    '1. Information': string
    '2. From Symbol': string
    '3. To Symbol': string
    '4. Last Refreshed': string
    '5. Time Zone': string
  }
  [key: string]: any // 動的なキーに対応
}

interface ExchangeRateResponse {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': string
    '2. From_Currency Name': string
    '3. To_Currency Code': string
    '4. To_Currency Name': string
    '5. Exchange Rate': string
    '6. Last Refreshed': string
    '7. Time Zone': string
    '8. Bid Price': string
    '9. Ask Price': string
  }
}

class AlphaVantageAPI {
  private config: AlphaVantageConfig
  private lastCallTime: number = 0
  private callInterval: number = 12000 // 12秒間隔（5 calls/分制限対応）

  constructor() {
    this.config = {
      apiKey: (import.meta as any).env?.VITE_ALPHA_VANTAGE_API_KEY || 'demo',
      baseUrl: (import.meta as any).env?.VITE_ALPHA_VANTAGE_BASE_URL || 'https://www.alphavantage.co/query'
    }
  }

  private async rateLimitedCall<T>(url: string): Promise<T> {
    const now = Date.now()
    const timeSinceLastCall = now - this.lastCallTime
    
    if (timeSinceLastCall < this.callInterval) {
      const waitTime = this.callInterval - timeSinceLastCall
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastCallTime = Date.now()
    
    try {
      const response = await axios.get<T>(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API Error: ${error.response?.status} - ${error.message}`)
      }
      throw error
    }
  }

  private formatCurrencyPairForAPI(pair: CurrencyPair): { from: string; to: string } {
    const parts = pair.split('/')
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid currency pair format: ${pair}`)
    }
    const [from, to] = parts
    return { from, to }
  }

  // リアルタイム為替レート取得
  async getRealTimeRate(pair: CurrencyPair): Promise<RealTimePriceData> {
    const { from, to } = this.formatCurrencyPairForAPI(pair)
    const url = `${this.config.baseUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${this.config.apiKey}`
    
    try {
      const data = await this.rateLimitedCall<ExchangeRateResponse>(url)
      const rate = data['Realtime Currency Exchange Rate']
      
      if (!rate) {
        console.warn(`API response missing rate data for ${pair}, falling back to demo data`)
        return this.generateDemoData(pair)
      }

      const price = parseFloat(rate['5. Exchange Rate'])
      const bid = parseFloat(rate['8. Bid Price'])
      const ask = parseFloat(rate['9. Ask Price'])
      
      if (isNaN(price) || isNaN(bid) || isNaN(ask)) {
        console.warn(`Invalid price data for ${pair}, falling back to demo data`)
        return this.generateDemoData(pair)
      }
      
      return {
        symbol: pair,
        price,
        bid,
        ask,
        spread: ask - bid,
        timestamp: new Date(rate['6. Last Refreshed']).getTime(),
        change: 0, // Will be calculated by comparing with previous data
        changePercent: 0 // Will be calculated by comparing with previous data
      }
    } catch (error) {
      console.error(`Failed to fetch real-time rate for ${pair}:`, error)
      console.warn(`Falling back to demo data for ${pair}`)
      return this.generateDemoData(pair)
    }
  }

  // 日中データ取得（1分足）
  async getIntradayData(pair: CurrencyPair, interval: '1min' | '5min' | '15min' | '30min' | '60min' = '1min'): Promise<CandleData[]> {
    const { from, to } = this.formatCurrencyPairForAPI(pair)
    const url = `${this.config.baseUrl}?function=FX_INTRADAY&from_symbol=${from}&to_symbol=${to}&interval=${interval}&apikey=${this.config.apiKey}`
    
    try {
      const data = await this.rateLimitedCall<AlphaVantageTimeSeriesResponse>(url)
      const timeSeries = data[`Time Series FX (${interval})`]
      
      if (!timeSeries) {
        console.warn(`No time series data available for ${pair}, generating demo data`)
        return this.generateDemoCandleData(pair, 100)
      }

      const candleData: CandleData[] = []
      
      Object.entries(timeSeries)
        .slice(0, 100) // 最新100本のデータ
        .reverse() // 古い順にソート
        .forEach(([timestamp, values]: [string, any]) => {
          const time = new Date(timestamp).getTime()
          candleData.push({
            time,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: 0 // Alpha VantageのFXデータにはボリュームなし
          })
        })

      if (candleData.length === 0) {
        console.warn(`Empty candle data for ${pair}, generating demo data`)
        return this.generateDemoCandleData(pair, 100)
      }

      return candleData
    } catch (error) {
      console.error(`Failed to fetch intraday data for ${pair}:`, error)
      console.warn(`Falling back to demo candle data for ${pair}`)
      return this.generateDemoCandleData(pair, 100)
    }
  }

  // 日足データ取得
  async getDailyData(pair: CurrencyPair): Promise<CandleData[]> {
    const { from, to } = this.formatCurrencyPairForAPI(pair)
    const url = `${this.config.baseUrl}?function=FX_DAILY&from_symbol=${from}&to_symbol=${to}&apikey=${this.config.apiKey}`
    
    try {
      const data = await this.rateLimitedCall<any>(url)
      const timeSeries = data['Time Series FX (Daily)']
      
      if (!timeSeries) {
        throw new Error('No daily data available')
      }

      const candleData: CandleData[] = []
      
      Object.entries(timeSeries)
        .slice(0, 100) // 最新100本のデータ
        .reverse()
        .forEach(([timestamp, values]: [string, any]) => {
          const time = new Date(timestamp).getTime()
          candleData.push({
            time,
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
            volume: 0
          })
        })

      return candleData
    } catch (error) {
      console.error(`Failed to fetch daily data for ${pair}:`, error)
      throw error
    }
  }

  // 複数通貨ペアの一括取得（効率化）
  async getMultipleRates(pairs: CurrencyPair[]): Promise<Partial<Record<CurrencyPair, RealTimePriceData>>> {
    const results: Partial<Record<CurrencyPair, RealTimePriceData>> = {}
    
    // レート制限を考慮して順次実行
    for (const pair of pairs) {
      try {
        results[pair] = await this.getRealTimeRate(pair)
      } catch (error) {
        console.error(`Failed to fetch rate for ${pair}:`, error)
        // エラーの場合はスキップして次の通貨ペアを処理
      }
    }
    
    return results
  }

  // デモデータ生成（API制限時の代替）
  generateDemoData(pair: CurrencyPair): RealTimePriceData {
    const basePrice = pair.includes('JPY') ? 150 : 1.1
    const volatility = 0.001
    const price = basePrice + (Math.random() - 0.5) * volatility * basePrice
    const spread = price * 0.0001 // 1 pip spread
    
    return {
      symbol: pair,
      price: Number(price.toFixed(pair.includes('JPY') ? 3 : 5)),
      bid: Number((price - spread/2).toFixed(pair.includes('JPY') ? 3 : 5)),
      ask: Number((price + spread/2).toFixed(pair.includes('JPY') ? 3 : 5)),
      spread: Number(spread.toFixed(pair.includes('JPY') ? 3 : 5)),
      timestamp: Date.now(),
      change: (Math.random() - 0.5) * 0.01,
      changePercent: (Math.random() - 0.5) * 1
    }
  }

  generateDemoCandleData(pair: CurrencyPair, count: number): CandleData[] {
    const data: CandleData[] = []
    const basePrice = pair.includes('JPY') ? 150 : 1.1
    const volatility = 0.001
    let currentPrice = basePrice
    const now = Date.now()
    const minuteInterval = 60000 // 1分間隔
    
    for (let i = count - 1; i >= 0; i--) {
      const time = now - (i * minuteInterval)
      
      // ランダムな価格変動を追加
      const priceChange = (Math.random() - 0.5) * volatility * currentPrice
      currentPrice = Math.max(currentPrice + priceChange, basePrice * 0.95) // 最低価格を設定
      currentPrice = Math.min(currentPrice, basePrice * 1.05) // 最高価格を設定
      
      const open = currentPrice
      const close = open + (Math.random() - 0.5) * volatility * open
      const high = Math.max(open, close) + Math.random() * volatility * open * 0.5
      const low = Math.min(open, close) - Math.random() * volatility * open * 0.5
      
      const decimals = pair.includes('JPY') ? 3 : 5
      
      data.push({
        time,
        open: Number(open.toFixed(decimals)),
        high: Number(high.toFixed(decimals)),
        low: Number(low.toFixed(decimals)),
        close: Number(close.toFixed(decimals)),
        volume: 0
      })
      
      currentPrice = close
    }
    
    return data.sort((a, b) => a.time - b.time) // 時間順にソート
  }
}

// Alpha Vantage APIインスタンスをエクスポート
export const alphaVantageAPI = new AlphaVantageAPI()

// ヘルパー関数
export const timeframeToInterval = (timeframe: Timeframe): '1min' | '5min' | '15min' | '30min' | '60min' | 'daily' => {
  switch (timeframe) {
    case '1m': return '1min'
    case '5m': return '5min'
    case '15m': return '15min'
    case '30m': return '30min'
    case '1h': return '60min'
    case '4h': return 'daily' // 4時間足は日足から計算
    case '1d': return 'daily'
    default: return '60min'
  }
} 