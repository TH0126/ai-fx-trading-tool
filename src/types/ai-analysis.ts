import { CurrencyPair, Timeframe } from './market-data'

// AI分析結果
export interface AIAnalysisResult {
  symbol: CurrencyPair
  timeframe: Timeframe
  timestamp: number
  
  // エントリーシグナル
  signal: TradingSignal
  
  // パターン認識結果
  patterns: ChartPattern[]
  
  // 予測価格
  prediction: PricePrediction
  
  // センチメント分析
  sentiment: MarketSentiment
  
  // 信頼度スコア
  confidence: number // 0-1
}

// トレーディングシグナル
export interface TradingSignal {
  type: 'buy' | 'sell' | 'hold'
  strength: number // 1-10
  entryPrice: number
  stopLoss: number
  takeProfit: number
  riskRewardRatio: number
  winProbability: number // 0-1
  reasoning: string[]
  technicalFactors: TechnicalFactor[]
}

// テクニカル要因
export interface TechnicalFactor {
  indicator: string
  condition: string
  weight: number
  bullish: boolean
}

// チャートパターン
export interface ChartPattern {
  type: ChartPatternType
  confidence: number
  startTime: number
  endTime: number
  keyLevels: number[]
  prediction: {
    direction: 'bullish' | 'bearish' | 'neutral'
    targetPrice?: number
    probability: number
  }
}

// チャートパターンタイプ
export type ChartPatternType = 
  | 'double_top' | 'double_bottom'
  | 'head_shoulders' | 'inverse_head_shoulders'
  | 'triangle_ascending' | 'triangle_descending' | 'triangle_symmetrical'
  | 'flag_bullish' | 'flag_bearish'
  | 'pennant_bullish' | 'pennant_bearish'
  | 'rectangle' | 'wedge_rising' | 'wedge_falling'
  | 'cup_handle'

// 価格予測
export interface PricePrediction {
  horizon: '1h' | '4h' | '1d' | '1w'
  predictions: Array<{
    time: number
    price: number
    confidence: number
  }>
  support: number[]
  resistance: number[]
}

// マーケットセンチメント
export interface MarketSentiment {
  overall: 'bullish' | 'bearish' | 'neutral'
  score: number // -1 to 1
  factors: SentimentFactor[]
  newsImpact: NewsImpact[]
}

// センチメント要因
export interface SentimentFactor {
  type: 'technical' | 'fundamental' | 'news' | 'market_structure'
  description: string
  impact: number // -1 to 1
  weight: number
}

// ニュース影響
export interface NewsImpact {
  newsId: string
  headline: string
  sentiment: 'positive' | 'negative' | 'neutral'
  relevance: number // 0-1
  expectedImpact: number // -1 to 1
  timeframe: string
}

// AI学習データ
export interface AITrainingData {
  features: number[][]
  labels: number[]
  metadata: {
    symbol: CurrencyPair
    timeframe: Timeframe
    startDate: number
    endDate: number
    featureNames: string[]
  }
}

// AI模型性能指標
export interface AIModelPerformance {
  modelId: string
  version: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  sharpeRatio?: number
  maxDrawdown?: number
  winRate?: number
  lastUpdated: number
  backtestResults: BacktestResult[]
}

// バックテスト結果
export interface BacktestResult {
  period: {
    start: number
    end: number
  }
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
  totalReturn: number
} 