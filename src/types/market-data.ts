// 通貨ペア定義
export type CurrencyPair = 
  | 'USD/JPY' | 'EUR/USD' | 'GBP/USD' | 'USD/CHF' | 'AUD/USD' | 'USD/CAD'
  | 'EUR/JPY' | 'GBP/JPY' | 'AUD/JPY' | 'NZD/JPY' | 'CHF/JPY' | 'CAD/JPY'
  | 'EUR/GBP' | 'EUR/CHF' | 'GBP/CHF' | 'AUD/NZD' | 'EUR/AUD' | 'GBP/AUD'
  | 'USD/SGD' | 'USD/ZAR'

// 時間軸定義
export type Timeframe = 
  | '1m' | '5m' | '15m' | '30m' 
  | '1h' | '4h' | '1d' | '1w' | '1M'

// ローソク足データ
export interface CandleData {
  time: number // Unix timestamp
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

// リアルタイム価格データ
export interface RealTimePriceData {
  symbol: CurrencyPair
  bid: number
  ask: number
  spread: number
  timestamp: number
  change: number
  changePercent: number
}

// 価格ティック
export interface PriceTick {
  symbol: CurrencyPair
  price: number
  timestamp: number
  volume?: number
}

// マーケット時間情報
export interface MarketSession {
  name: 'tokyo' | 'london' | 'new_york' | 'sydney'
  isOpen: boolean
  openTime: string
  closeTime: string
  timezone: string
}

// マーケット状況
export interface MarketStatus {
  isOpen: boolean
  nextOpen?: number
  nextClose?: number
  sessions: MarketSession[]
  volatility: 'low' | 'medium' | 'high'
}

// 経済指標
export interface EconomicIndicator {
  id: string
  name: string
  country: string
  currency: string
  importance: 'low' | 'medium' | 'high'
  releaseTime: number
  actual?: number
  forecast?: number
  previous?: number
  impact: 'bullish' | 'bearish' | 'neutral'
}

// ニュースデータ
export interface NewsItem {
  id: string
  title: string
  content: string
  source: string
  publishedAt: number
  sentiment: 'positive' | 'negative' | 'neutral'
  relevantCurrencies: string[]
  impact: 'low' | 'medium' | 'high'
  url?: string
} 