import { CandleData, Timeframe, CurrencyPair } from './market-data'

// チャート表示設定
export interface ChartSettings {
  symbol: CurrencyPair
  timeframe: Timeframe
  candleCount: number
  showVolume: boolean
  showGrid: boolean
  theme: 'light' | 'dark'
}

// チャート指標設定
export interface ChartIndicatorSettings {
  movingAverages: MovingAverageSettings[]
  bollinger: BollingerBandSettings | null
  rsi: RSISettings | null
  macd: MACDSettings | null
  stochastic: StochasticSettings | null
}

// 移動平均設定
export interface MovingAverageSettings {
  id: string
  type: 'SMA' | 'EMA'
  period: number
  color: string
  visible: boolean
}

// ボリンジャーバンド設定
export interface BollingerBandSettings {
  period: number
  standardDeviation: number
  color: string
  visible: boolean
}

// RSI設定
export interface RSISettings {
  period: number
  overboughtLevel: number
  oversoldLevel: number
  color: string
  visible: boolean
}

// MACD設定
export interface MACDSettings {
  fastPeriod: number
  slowPeriod: number
  signalPeriod: number
  color: {
    macd: string
    signal: string
    histogram: string
  }
  visible: boolean
}

// ストキャスティクス設定
export interface StochasticSettings {
  kPeriod: number
  dPeriod: number
  smoothing: number
  overboughtLevel: number
  oversoldLevel: number
  color: {
    k: string
    d: string
  }
  visible: boolean
}

// チャートデータ
export interface ChartData {
  candles: CandleData[]
  indicators: ChartIndicatorData
  lastUpdate: number
}

// チャート指標データ
export interface ChartIndicatorData {
  movingAverages: MovingAverageData[]
  bollinger?: BollingerBandData
  rsi?: RSIData
  macd?: MACDData
  stochastic?: StochasticData
}

// 移動平均データ
export interface MovingAverageData {
  id: string
  values: Array<{ time: number; value: number }>
}

// ボリンジャーバンドデータ
export interface BollingerBandData {
  upper: Array<{ time: number; value: number }>
  middle: Array<{ time: number; value: number }>
  lower: Array<{ time: number; value: number }>
}

// RSIデータ
export interface RSIData {
  values: Array<{ time: number; value: number }>
}

// MACDデータ
export interface MACDData {
  macd: Array<{ time: number; value: number }>
  signal: Array<{ time: number; value: number }>
  histogram: Array<{ time: number; value: number }>
}

// ストキャスティクスデータ
export interface StochasticData {
  k: Array<{ time: number; value: number }>
  d: Array<{ time: number; value: number }>
}

// チャートイベント
export interface ChartEvent {
  type: 'zoom' | 'pan' | 'crosshair' | 'click'
  data: unknown
  timestamp: number
} 