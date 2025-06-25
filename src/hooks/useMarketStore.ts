import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { CurrencyPair, Timeframe, CandleData, RealTimePriceData } from '@/types'
import { alphaVantageAPI, timeframeToInterval } from '@/services/alphaVantageApi'

interface MarketState {
  // 接続状態
  isConnected: boolean
  
  // 現在選択中の通貨ペアと時間軸
  selectedSymbol: CurrencyPair
  selectedTimeframe: Timeframe
  
  // チャートデータ（通貨ペア別、時間軸別）
  candleData: Record<CurrencyPair, Record<Timeframe, CandleData[]>>
  isLoading: boolean
  
  // リアルタイム価格
  realtimePrices: Record<CurrencyPair, RealTimePriceData>
  
  // エラー状態
  error: string | null
  
  // アクション
  setConnected: (connected: boolean) => void
  setSelectedSymbol: (symbol: CurrencyPair) => void
  setSelectedTimeframe: (timeframe: Timeframe) => void
  setCandleData: (symbol: CurrencyPair, timeframe: Timeframe, data: CandleData[]) => void
  setLoading: (loading: boolean) => void
  updateRealtimePrice: (symbol: CurrencyPair, price: RealTimePriceData) => void
  setError: (error: string | null) => void
  
  // チャート用メソッド
  fetchCandleData: (symbol: CurrencyPair, timeframe: Timeframe) => Promise<void>
  subscribeToRealtimeData: (symbol: CurrencyPair, callback: (price: { price: number; timestamp: number }) => void) => () => void
  fetchMultipleRates: (symbols: CurrencyPair[]) => Promise<void>
  
  // リセット
  reset: () => void
}

const initialState = {
  isConnected: false,
  selectedSymbol: 'USD/JPY' as CurrencyPair,
  selectedTimeframe: '1h' as Timeframe,
  candleData: {} as Record<CurrencyPair, Record<Timeframe, CandleData[]>>,
  isLoading: false,
  realtimePrices: {} as Record<CurrencyPair, RealTimePriceData>,
  error: null,
}

// モックデータ生成関数
const generateMockCandleData = (symbol: CurrencyPair, timeframe: Timeframe): CandleData[] => {
  const data: CandleData[] = []
  const basePrice = symbol.includes('JPY') ? 150 : 1.1 // JPY pairs vs others
  const now = Date.now()
  const timeframeMs = timeframe === '1m' ? 60000 : 
                     timeframe === '5m' ? 300000 :
                     timeframe === '15m' ? 900000 :
                     timeframe === '30m' ? 1800000 :
                     timeframe === '1h' ? 3600000 :
                     timeframe === '4h' ? 14400000 :
                     timeframe === '1d' ? 86400000 : 3600000

  for (let i = 99; i >= 0; i--) {
    const time = now - (i * timeframeMs)
    const volatility = Math.random() * 0.01 // 1% volatility
    const open = basePrice + (Math.random() - 0.5) * volatility * basePrice
    const close = open + (Math.random() - 0.5) * volatility * basePrice
    const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5

    data.push({
      time,
      open: Number(open.toFixed(symbol.includes('JPY') ? 3 : 5)),
      high: Number(high.toFixed(symbol.includes('JPY') ? 3 : 5)),
      low: Number(low.toFixed(symbol.includes('JPY') ? 3 : 5)),
      close: Number(close.toFixed(symbol.includes('JPY') ? 3 : 5)),
      volume: Math.floor(Math.random() * 10000)
    })
  }

  return data
}

export const useMarketStore = create<MarketState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setConnected: (connected: boolean) =>
        set({ isConnected: connected }, false, 'setConnected'),
        
      setSelectedSymbol: (symbol: CurrencyPair) =>
        set({ selectedSymbol: symbol }, false, 'setSelectedSymbol'),
        
      setSelectedTimeframe: (timeframe: Timeframe) =>
        set({ selectedTimeframe: timeframe }, false, 'setSelectedTimeframe'),
        
      setCandleData: (symbol: CurrencyPair, timeframe: Timeframe, data: CandleData[]) =>
        set(
          (state) => ({
            candleData: {
              ...state.candleData,
              [symbol]: {
                ...state.candleData[symbol],
                [timeframe]: data,
              },
            },
          }),
          false,
          'setCandleData'
        ),
        
      setLoading: (loading: boolean) =>
        set({ isLoading: loading }, false, 'setLoading'),
        
      updateRealtimePrice: (symbol: CurrencyPair, price: RealTimePriceData) =>
        set(
          (state) => ({
            realtimePrices: {
              ...state.realtimePrices,
              [symbol]: price,
            },
          }),
          false,
          'updateRealtimePrice'
        ),
        
      setError: (error: string | null) =>
        set({ error }, false, 'setError'),
        
      // チャート用のデータ取得（Alpha Vantage API実装）
      fetchCandleData: async (symbol: CurrencyPair, timeframe: Timeframe) => {
        const { setLoading, setCandleData, setError } = get()
        
        try {
          setLoading(true)
          setError(null)
          
          let candleData: CandleData[]
          
          // Alpha Vantage APIからリアルデータを取得
          const interval = timeframeToInterval(timeframe)
          
          if (interval === 'daily') {
            candleData = await alphaVantageAPI.getDailyData(symbol)
          } else {
            candleData = await alphaVantageAPI.getIntradayData(symbol, interval)
          }
          
          setCandleData(symbol, timeframe, candleData)
        } catch (error) {
          console.warn('Alpha Vantage API failed, falling back to mock data:', error)
          
          // API失敗時はモックデータにフォールバック
          const mockData = generateMockCandleData(symbol, timeframe)
          setCandleData(symbol, timeframe, mockData)
          
          setError('Using demo data - API unavailable')
        } finally {
          setLoading(false)
        }
      },
      
      // リアルタイムデータ購読（Alpha Vantage API + フォールバック）
      subscribeToRealtimeData: (symbol: CurrencyPair, callback: (price: { price: number; timestamp: number }) => void) => {
        let intervalId: NodeJS.Timeout
        
        const fetchRealTimeData = async () => {
          try {
            // Alpha Vantage APIからリアルタイムデータを取得
            const rateData = await alphaVantageAPI.getRealTimeRate(symbol)
            callback({
              price: rateData.price,
              timestamp: rateData.timestamp
            })
          } catch (error) {
            console.warn('Real-time API failed, using demo data:', error)
            
            // API失敗時はデモデータを使用
            const demoData = alphaVantageAPI.generateDemoData(symbol)
            callback({
              price: demoData.price,
              timestamp: demoData.timestamp
            })
          }
        }
        
        // 初回実行
        fetchRealTimeData()
        
        // 30秒間隔で更新（Alpha Vantage APIのレート制限を考慮）
        intervalId = setInterval(fetchRealTimeData, 30000)
        
        return () => clearInterval(intervalId)
      },
      
      // 複数通貨ペアの価格一括取得
      fetchMultipleRates: async (symbols: CurrencyPair[]) => {
        const { updateRealtimePrice, setError } = get()
        
        try {
          const rates = await alphaVantageAPI.getMultipleRates(symbols)
          
          Object.entries(rates).forEach(([symbol, rateData]) => {
            updateRealtimePrice(symbol as CurrencyPair, rateData)
          })
        } catch (error) {
          console.warn('Multiple rates fetch failed, using demo data:', error)
          
          // API失敗時は全ての通貨ペアにデモデータを設定
          symbols.forEach(symbol => {
            const demoData = alphaVantageAPI.generateDemoData(symbol)
            updateRealtimePrice(symbol, demoData)
          })
          
          setError('Using demo data - API unavailable')
        }
      },
        
      reset: () =>
        set(initialState, false, 'reset'),
    }),
    {
      name: 'market-store',
    }
  )
)

// セレクター関数（パフォーマンス最適化用）
export const useSelectedSymbol = () => useMarketStore((state) => state.selectedSymbol)
export const useSelectedTimeframe = () => useMarketStore((state) => state.selectedTimeframe)
export const useCandleData = () => useMarketStore((state) => state.candleData)
export const useIsLoading = () => useMarketStore((state) => state.isLoading)
export const useRealtimePrices = () => useMarketStore((state) => state.realtimePrices)
export const useConnectionStatus = () => useMarketStore((state) => state.isConnected) 