import { CurrencyPair, Timeframe } from './market-data'
import { ChartSettings, ChartIndicatorSettings } from './chart'

// ユーザー設定
export interface UserSettings {
  // 基本設定
  general: GeneralSettings
  
  // チャート設定
  chart: ChartSettings
  
  // 指標設定
  indicators: ChartIndicatorSettings
  
  // AI設定
  ai: AISettings
  
  // 通知設定
  notifications: NotificationSettings
  
  // 外観設定
  appearance: AppearanceSettings
  
  // アカウント設定
  account: AccountSettings
}

// 一般設定
export interface GeneralSettings {
  defaultSymbol: CurrencyPair
  defaultTimeframe: Timeframe
  language: 'ja' | 'en'
  timezone: string
  numberFormat: 'japanese' | 'western'
  dateFormat: 'japanese' | 'western'
  autoSave: boolean
  autoRefresh: boolean
  refreshInterval: number // seconds
}

// AI設定
export interface AISettings {
  enableSignals: boolean
  signalConfidenceThreshold: number // 0-1
  enablePatternRecognition: boolean
  enableSentimentAnalysis: boolean
  enableNewAnalysis: boolean
  maxSignalsPerDay: number
  riskTolerance: 'low' | 'medium' | 'high'
  preferredRiskRewardRatio: number
}

// 通知設定
export interface NotificationSettings {
  enableDesktop: boolean
  enableSound: boolean
  enableEmail: boolean
  email?: string
  
  // シグナル通知
  signalNotifications: {
    enabled: boolean
    minStrength: number
    currencies: CurrencyPair[]
  }
  
  // ニュース通知
  newsNotifications: {
    enabled: boolean
    minImportance: 'low' | 'medium' | 'high'
    currencies: string[]
  }
  
  // 経済指標通知
  economicNotifications: {
    enabled: boolean
    minImportance: 'low' | 'medium' | 'high'
    currencies: string[]
    advanceNotice: number // minutes
  }
  
  // 価格アラート
  priceAlerts: PriceAlert[]
}

// 価格アラート
export interface PriceAlert {
  id: string
  symbol: CurrencyPair
  condition: 'above' | 'below' | 'crosses_up' | 'crosses_down'
  price: number
  enabled: boolean
  notified: boolean
  createdAt: number
  expiresAt?: number
}

// 外観設定
export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  secondaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  layout: 'compact' | 'comfortable' | 'spacious'
  showGrid: boolean
  showCrosshair: boolean
  animationsEnabled: boolean
}

// アカウント設定
export interface AccountSettings {
  username: string
  email: string
  profilePicture?: string
  subscriptionTier: 'free' | 'basic' | 'premium' | 'professional'
  apiUsage: ApiUsageStats
  preferences: UserPreferences
  lastLogin: number
  createdAt: number
}

// API使用統計
export interface ApiUsageStats {
  dailyLimit: number
  dailyUsed: number
  monthlyLimit: number
  monthlyUsed: number
  lastReset: number
}

// ユーザー設定プリファレンス
export interface UserPreferences {
  favoriteSymbols: CurrencyPair[]
  recentSymbols: CurrencyPair[]
  savedChartLayouts: SavedChartLayout[]
  tradingStrategy: TradingStrategy
  displayCurrency: string
}

// 保存されたチャートレイアウト
export interface SavedChartLayout {
  id: string
  name: string
  settings: ChartSettings & ChartIndicatorSettings
  createdAt: number
  lastModified: number
}

// トレーディング戦略
export interface TradingStrategy {
  name: string
  description: string
  riskManagement: {
    maxRiskPerTrade: number // percentage
    maxDailyLoss: number // percentage
    stopLossStrategy: 'fixed' | 'trailing' | 'atr_based'
    takeProfitStrategy: 'fixed' | 'trailing' | 'risk_reward_ratio'
  }
  entryRules: {
    requiredIndicators: string[]
    minimumConfidence: number
    marketConditions: ('trending' | 'ranging' | 'volatile')[]
  }
  exitRules: {
    profitTarget: number
    stopLoss: number
    timeBasedExit: boolean
    maxHoldingPeriod?: number // hours
  }
}

// 設定エクスポート/インポート
export interface SettingsExport {
  version: string
  exportedAt: number
  settings: UserSettings
  checksum: string
}

// 設定カテゴリ
export type SettingsCategory = 
  | 'general' 
  | 'chart' 
  | 'indicators' 
  | 'ai' 
  | 'notifications' 
  | 'appearance' 
  | 'account'

// 設定変更イベント
export interface SettingsChangeEvent {
  category: SettingsCategory
  key: string
  oldValue: unknown
  newValue: unknown
  timestamp: number
} 