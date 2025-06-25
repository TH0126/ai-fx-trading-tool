import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { UserSettings, ChartSettings, ChartIndicatorSettings } from '@/types'

interface SettingsState extends UserSettings {
  // アクション
  updateGeneral: (settings: Partial<UserSettings['general']>) => void
  updateChart: (settings: Partial<ChartSettings>) => void
  updateIndicators: (settings: Partial<ChartIndicatorSettings>) => void
  updateAI: (settings: Partial<UserSettings['ai']>) => void
  updateNotifications: (settings: Partial<UserSettings['notifications']>) => void
  updateAppearance: (settings: Partial<UserSettings['appearance']>) => void
  
  // 設定リセット
  resetToDefaults: () => void
  
  // インポート・エクスポート
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
}

const defaultSettings: UserSettings = {
  general: {
    defaultSymbol: 'USD/JPY',
    defaultTimeframe: '1h',
    language: 'ja',
    timezone: 'Asia/Tokyo',
    numberFormat: 'japanese',
    dateFormat: 'japanese',
    autoSave: true,
    autoRefresh: true,
    refreshInterval: 30,
  },
  chart: {
    symbol: 'USD/JPY',
    timeframe: '1h',
    candleCount: 500,
    showVolume: true,
    showGrid: true,
    theme: 'light',
  },
  indicators: {
    movingAverages: [
      {
        id: 'sma20',
        type: 'SMA',
        period: 20,
        color: '#ff9800',
        visible: true,
      },
      {
        id: 'ema50',
        type: 'EMA',
        period: 50,
        color: '#2196f3',
        visible: true,
      },
    ],
    bollinger: {
      period: 20,
      standardDeviation: 2,
      color: '#9c27b0',
      visible: false,
    },
    rsi: {
      period: 14,
      overboughtLevel: 70,
      oversoldLevel: 30,
      color: '#f44336',
      visible: false,
    },
    macd: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      color: {
        macd: '#2196f3',
        signal: '#ff9800',
        histogram: '#9e9e9e',
      },
      visible: false,
    },
    stochastic: {
      kPeriod: 14,
      dPeriod: 3,
      smoothing: 3,
      overboughtLevel: 80,
      oversoldLevel: 20,
      color: {
        k: '#4caf50',
        d: '#f44336',
      },
      visible: false,
    },
  },
  ai: {
    enableSignals: true,
    signalConfidenceThreshold: 0.7,
    enablePatternRecognition: true,
    enableSentimentAnalysis: true,
    enableNewAnalysis: true,
    maxSignalsPerDay: 20,
    riskTolerance: 'medium',
    preferredRiskRewardRatio: 2.0,
  },
  notifications: {
    enableDesktop: true,
    enableSound: true,
    enableEmail: false,
    signalNotifications: {
      enabled: true,
      minStrength: 7,
      currencies: ['USD/JPY', 'EUR/USD', 'GBP/USD'],
    },
    newsNotifications: {
      enabled: true,
      minImportance: 'medium',
      currencies: ['USD', 'EUR', 'JPY'],
    },
    economicNotifications: {
      enabled: true,
      minImportance: 'high',
      currencies: ['USD', 'EUR', 'JPY'],
      advanceNotice: 30,
    },
    priceAlerts: [],
  },
  appearance: {
    theme: 'light',
    primaryColor: '#1976d2',
    secondaryColor: '#dc004e',
    fontSize: 'medium',
    layout: 'comfortable',
    showGrid: true,
    showCrosshair: true,
    animationsEnabled: true,
  },
  account: {
    username: '',
    email: '',
    subscriptionTier: 'free',
    apiUsage: {
      dailyLimit: 500,
      dailyUsed: 0,
      monthlyLimit: 15000,
      monthlyUsed: 0,
      lastReset: Date.now(),
    },
    preferences: {
      favoriteSymbols: ['USD/JPY', 'EUR/USD'],
      recentSymbols: ['USD/JPY'],
      savedChartLayouts: [],
      tradingStrategy: {
        name: 'Conservative',
        description: 'Conservative trading with low risk',
        riskManagement: {
          maxRiskPerTrade: 2,
          maxDailyLoss: 5,
          stopLossStrategy: 'fixed',
          takeProfitStrategy: 'risk_reward_ratio',
        },
        entryRules: {
          requiredIndicators: ['RSI', 'MACD'],
          minimumConfidence: 0.8,
          marketConditions: ['trending'],
        },
        exitRules: {
          profitTarget: 2,
          stopLoss: 1,
          timeBasedExit: true,
          maxHoldingPeriod: 24,
        },
      },
      displayCurrency: 'JPY',
    },
    lastLogin: Date.now(),
    createdAt: Date.now(),
  },
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultSettings,
        
        updateGeneral: (settings) =>
          set(
            (state) => ({
              general: { ...state.general, ...settings },
            }),
            false,
            'updateGeneral'
          ),
          
        updateChart: (settings) =>
          set(
            (state) => ({
              chart: { ...state.chart, ...settings },
            }),
            false,
            'updateChart'
          ),
          
        updateIndicators: (settings) =>
          set(
            (state) => ({
              indicators: { ...state.indicators, ...settings },
            }),
            false,
            'updateIndicators'
          ),
          
        updateAI: (settings) =>
          set(
            (state) => ({
              ai: { ...state.ai, ...settings },
            }),
            false,
            'updateAI'
          ),
          
        updateNotifications: (settings) =>
          set(
            (state) => ({
              notifications: { ...state.notifications, ...settings },
            }),
            false,
            'updateNotifications'
          ),
          
        updateAppearance: (settings) =>
          set(
            (state) => ({
              appearance: { ...state.appearance, ...settings },
            }),
            false,
            'updateAppearance'
          ),
          
        resetToDefaults: () =>
          set(defaultSettings, false, 'resetToDefaults'),
          
        exportSettings: () => {
          const state = get()
          const settings = {
            general: state.general,
            chart: state.chart,
            indicators: state.indicators,
            ai: state.ai,
            notifications: state.notifications,
            appearance: state.appearance,
          }
          return JSON.stringify(settings, null, 2)
        },
        
        importSettings: (settingsJson: string) => {
          try {
            const settings = JSON.parse(settingsJson)
            set(
              (state) => ({
                ...state,
                ...settings,
              }),
              false,
              'importSettings'
            )
            return true
          } catch (error) {
            console.error('設定のインポートに失敗しました:', error)
            return false
          }
        },
      }),
      {
        name: 'fx-settings',
        version: 1,
      }
    ),
    {
      name: 'settings-store',
    }
  )
) 