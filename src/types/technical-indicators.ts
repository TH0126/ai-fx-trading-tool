// テクニカル指標の基本インターface
export interface TechnicalIndicator {
  name: string
  period: number
  calculate: (data: number[]) => number[]
}

// 移動平均線
export interface MovingAverage extends TechnicalIndicator {
  type: 'SMA' | 'EMA'
}

// RSI（相対力指数）
export interface RSI extends TechnicalIndicator {
  overboughtLevel: number
  oversoldLevel: number
}

// MACD（移動平均収束拡散法）
export interface MACD {
  fastPeriod: number
  slowPeriod: number
  signalPeriod: number
  calculate: (prices: number[]) => {
    macd: number[]
    signal: number[]
    histogram: number[]
  }
}

// ボリンジャーバンド
export interface BollingerBands {
  period: number
  standardDeviation: number
  calculate: (prices: number[]) => {
    upper: number[]
    middle: number[]
    lower: number[]
  }
}

// ストキャスティクス
export interface Stochastic {
  kPeriod: number
  dPeriod: number
  smoothing: number
  calculate: (high: number[], low: number[], close: number[]) => {
    k: number[]
    d: number[]
  }
}

// ADX（平均方向性指数）
export interface ADX {
  name: string
  period: number
  calculate: (high: number[], low: number[], close: number[]) => number[]
}

// ATR（平均真の値幅）
export interface ATR {
  name: string
  period: number
  calculate: (high: number[], low: number[], close: number[]) => number[]
}

// フィボナッチリトレースメント
export interface FibonacciRetracement {
  highPrice: number
  lowPrice: number
  levels: number[] // [0.236, 0.382, 0.5, 0.618, 0.786]
  calculate: () => Array<{ level: number; price: number }>
}

// ピボットポイント
export interface PivotPoint {
  high: number
  low: number
  close: number
  calculate: () => {
    pivot: number
    r1: number
    r2: number
    r3: number
    s1: number
    s2: number
    s3: number
  }
}

// サポート・レジスタンスレベル
export interface SupportResistanceLevel {
  price: number
  strength: number // 1-10
  type: 'support' | 'resistance'
  touchCount: number
  lastTouch: number
}

// テクニカル分析結果
export interface TechnicalAnalysisResult {
  symbol: string
  timeframe: string
  timestamp: number
  indicators: {
    sma?: number[]
    ema?: number[]
    rsi?: number[]
    macd?: {
      macd: number[]
      signal: number[]
      histogram: number[]
    }
    bollinger?: {
      upper: number[]
      middle: number[]
      lower: number[]
    }
    stochastic?: {
      k: number[]
      d: number[]
    }
    adx?: number[]
    atr?: number[]
  }
  supportResistance: SupportResistanceLevel[]
  fibonacci?: FibonacciRetracement
  pivot?: PivotPoint
} 