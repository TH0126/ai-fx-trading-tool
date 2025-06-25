// API基本レスポンス
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: number
}

// APIエラー
export interface ApiError {
  code: string
  message: string
  details?: unknown
}

// ページネーション
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// ページネーション付きレスポンス
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

// Alpha Vantage API レスポンス型
export interface AlphaVantageResponse {
  'Meta Data': {
    '1. Information': string
    '2. Symbol': string
    '3. Last Refreshed': string
    '4. Interval': string
    '5. Output Size': string
    '6. Time Zone': string
  }
  'Time Series (1min)': Record<string, AlphaVantageCandle>
}

export interface AlphaVantageCandle {
  '1. open': string
  '2. high': string
  '3. low': string
  '4. close': string
  '5. volume': string
}

// NewsAPI レスポンス型
export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

// 経済指標API レスポンス型
export interface EconomicIndicatorResponse {
  indicators: EconomicIndicatorData[]
}

export interface EconomicIndicatorData {
  id: string
  name: string
  country: string
  currency: string
  importance: 'low' | 'medium' | 'high'
  date: string
  time: string
  actual: number | null
  forecast: number | null
  previous: number | null
}

// WebSocketメッセージ型
export interface WebSocketMessage {
  type: 'price_update' | 'news_update' | 'signal_update' | 'error' | 'connection'
  data: unknown
  timestamp: number
}

// リアルタイム価格更新メッセージ
export interface PriceUpdateMessage {
  type: 'price_update'
  data: {
    symbol: string
    bid: number
    ask: number
    timestamp: number
  }
}

// ニュース更新メッセージ
export interface NewsUpdateMessage {
  type: 'news_update'
  data: {
    id: string
    headline: string
    impact: 'low' | 'medium' | 'high'
    currencies: string[]
  }
}

// シグナル更新メッセージ
export interface SignalUpdateMessage {
  type: 'signal_update'
  data: {
    symbol: string
    signal: 'buy' | 'sell' | 'hold'
    strength: number
    confidence: number
  }
}

// API設定
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  apiKey?: string
}

// リクエストパラメータ型
export interface GetCandlesParams {
  symbol: string
  timeframe: string
  limit?: number
  from?: number
  to?: number
}

export interface GetNewsParams {
  currencies?: string[]
  from?: string
  to?: string
  limit?: number
  importance?: 'low' | 'medium' | 'high'
}

export interface GetEconomicIndicatorsParams {
  country?: string
  currency?: string
  from?: string
  to?: string
  importance?: 'low' | 'medium' | 'high'
} 