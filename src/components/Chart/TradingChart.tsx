import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Toolbar, Typography, ToggleButton, ToggleButtonGroup, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, LineData, BarData } from 'lightweight-charts';
import { useMarketStore } from '../../hooks/useMarketStore';
import { CurrencyPair, Timeframe, CandleData } from '../../types/market-data';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SettingsIcon from '@mui/icons-material/Settings';

interface TradingChartProps {
  currencyPair: CurrencyPair;
  timeFrame: Timeframe;
  height?: number;
}

type ChartType = 'candlestick' | 'line' | 'area' | 'bar';

const TradingChart: React.FC<TradingChartProps> = ({ 
  currencyPair, 
  timeFrame, 
  height = 500 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Line' | 'Area' | 'Bar'> | null>(null);
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const { candleData, isLoading, error, fetchCandleData, subscribeToRealtimeData } = useMarketStore();

  // チャートのリサイズハンドラ
  const handleResize = () => {
    if (chartRef.current && chartContainerRef.current) {
      chartRef.current.applyOptions({ 
        width: chartContainerRef.current.clientWidth,
        height: height
      });
    }
  };

  // Lightweight Charts初期化
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // チャート作成
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d4dc',
        fontSize: 12,
        fontFamily: 'Arial, sans-serif',
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      rightPriceScale: {
        borderColor: '#2B2B43',
        textColor: '#d1d4dc',
      },
      timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: timeFrame === '1m' || timeFrame === '5m',
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
        vertLine: {
          color: '#758696',
          width: 1,
          style: 2, // LineStyle.Dashed
        },
        horzLine: {
          color: '#758696',
          width: 1,
          style: 2, // LineStyle.Dashed
        },
      },
      grid: {
        vertLines: {
          color: '#2B2B43',
          style: 2, // LineStyle.Dashed
        },
        horzLines: {
          color: '#2B2B43',
          style: 2, // LineStyle.Dashed
        },
      },
    });

    chartRef.current = chart;

    // ウィンドウリサイズイベント
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      // シリーズを安全にクリア
      if (seriesRef.current && chartRef.current) {
        try {
          chartRef.current.removeSeries(seriesRef.current);
        } catch (error) {
          console.warn('Error removing series on cleanup:', error);
        }
        seriesRef.current = null;
      }
      
      // チャートを安全に削除
      if (chartRef.current) {
        try {
          chartRef.current.remove();
        } catch (error) {
          console.warn('Error removing chart on cleanup:', error);
        }
        chartRef.current = null;
      }
    };
  }, [height, timeFrame]);

  // チャートタイプ変更時のシリーズ更新
  useEffect(() => {
    if (!chartRef.current) return;

    // 既存シリーズを安全に削除
    if (seriesRef.current && chartRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (error) {
        console.warn('Error removing series:', error);
      }
      seriesRef.current = null;
    }

    // 新しいシリーズを作成
    let newSeries: ISeriesApi<'Candlestick' | 'Line' | 'Area' | 'Bar'>;

    try {
      switch (chartType) {
        case 'candlestick':
          newSeries = chartRef.current.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
          break;
        case 'line':
          newSeries = chartRef.current.addLineSeries({
            color: '#2962ff',
            lineWidth: 2,
          });
          break;
        case 'area':
          newSeries = chartRef.current.addAreaSeries({
            lineColor: '#2962ff',
            topColor: 'rgba(41, 98, 255, 0.4)',
            bottomColor: 'rgba(41, 98, 255, 0.1)',
            lineWidth: 2,
          });
          break;
        case 'bar':
          newSeries = chartRef.current.addBarSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            openVisible: false,
          });
          break;
        default:
          newSeries = chartRef.current.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
      }

      seriesRef.current = newSeries;
    } catch (error) {
      console.error('Error creating series:', error);
    }
  }, [chartType]);

  // データ更新
  useEffect(() => {
    if (!seriesRef.current) return;

    const currentData = candleData[currencyPair]?.[timeFrame] || [];
    if (currentData.length === 0) return;

         // データ形式をLightweight Charts形式に変換
     const convertData = (data: CandleData[]) => {
       return data.map(candle => {
         const baseData = {
           time: Math.floor(candle.time / 1000), // ミリ秒を秒に変換
         };

        switch (chartType) {
          case 'candlestick':
            return {
              ...baseData,
              open: candle.open,
              high: candle.high,
              low: candle.low,
              close: candle.close,
            } as CandlestickData;
          case 'line':
          case 'area':
            return {
              ...baseData,
              value: candle.close,
            } as LineData;
          case 'bar':
            return {
              ...baseData,
              open: candle.open,
              high: candle.high,
              low: candle.low,
              close: candle.close,
            } as BarData;
          default:
            return {
              ...baseData,
              value: candle.close,
            } as LineData;
        }
      });
    };

    try {
      const formattedData = convertData(currentData);
      seriesRef.current.setData(formattedData);

      // チャートの表示範囲を調整
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    } catch (error) {
      console.warn('Error setting chart data:', error);
    }
  }, [candleData, currencyPair, timeFrame, chartType]);

  // データ取得
  useEffect(() => {
    if (fetchCandleData) {
      fetchCandleData(currencyPair, timeFrame);
    }
  }, [currencyPair, timeFrame, fetchCandleData]);

    // リアルタイムデータ購読
  useEffect(() => {
    if (subscribeToRealtimeData && seriesRef.current) {
      const unsubscribe = subscribeToRealtimeData(currencyPair, (newPrice) => {
        console.log('Realtime price update:', newPrice);
        
        // リアルタイム更新をチャートに反映
        if (seriesRef.current && chartRef.current) {
          try {
            const timestamp = Math.floor(Date.now() / 1000);
            const priceValue = typeof newPrice === 'number' ? newPrice : newPrice.price;
            
            if (chartType === 'candlestick' || chartType === 'bar') {
              const lastCandle = candleData[currencyPair]?.[timeFrame]?.slice(-1)[0];
              if (lastCandle) {
                const updatedCandle: CandlestickData = {
                  time: Math.floor(lastCandle.time / 1000) as any,
                  open: lastCandle.open,
                  high: Math.max(lastCandle.high, priceValue),
                  low: Math.min(lastCandle.low, priceValue),
                  close: priceValue,
                };
                seriesRef.current.update(updatedCandle);
              }
            } else {
              const updatedData: LineData = {
                time: timestamp as any,
                value: priceValue,
              };
              seriesRef.current.update(updatedData);
            }
          } catch (error) {
            console.warn('Error updating realtime data:', error);
          }
        }
      });

      return unsubscribe;
    }
    return undefined;
  }, [currencyPair, subscribeToRealtimeData, chartType, candleData, timeFrame]);

  const currentData = candleData[currencyPair]?.[timeFrame] || [];
  const lastCandle = currentData[currentData.length - 1];

  const handleChartTypeChange = (_: React.MouseEvent<HTMLElement>, newType: ChartType | null) => {
    if (newType) {
      setChartType(newType);
    }
  };

  const handleFullscreen = () => {
    if (chartContainerRef.current) {
      if (chartContainerRef.current.requestFullscreen) {
        chartContainerRef.current.requestFullscreen();
      }
    }
  };

  const formatPrice = (price: number) => {
    return currencyPair.includes('JPY') 
      ? price.toFixed(3) 
      : price.toFixed(5);
  };

  const calculatePriceChange = () => {
    if (currentData.length < 2) return { change: 0, percentage: 0 };
    
    const current = currentData[currentData.length - 1];
    const previous = currentData[currentData.length - 2];
    
    if (!current || !previous) return { change: 0, percentage: 0 };
    
    const change = current.close - previous.close;
    const percentage = (change / previous.close) * 100;
    
    return { change, percentage };
  };

  const priceChange = calculatePriceChange();

  return (
    <Paper sx={{ width: '100%', height: height + 60, bgcolor: '#1a1a1a' }}>
      <Toolbar 
        sx={{ 
          minHeight: '48px !important', 
          px: 2, 
          bgcolor: '#252530',
          borderBottom: '1px solid #2B2B43'
        }}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#d1d4dc' }}>
          {currencyPair} - {timeFrame.toUpperCase()}
        </Typography>
        
        {lastCandle && (
          <Box sx={{ mr: 2, textAlign: 'right' }}>
            <Typography variant="h6" sx={{ 
              color: priceChange.change >= 0 ? '#26a69a' : '#ef5350',
              fontWeight: 'bold'
            }}>
              {formatPrice(lastCandle.close)}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: priceChange.change >= 0 ? '#26a69a' : '#ef5350'
            }}>
              {priceChange.change >= 0 ? '+' : ''}{formatPrice(priceChange.change)} ({priceChange.percentage.toFixed(2)}%)
            </Typography>
          </Box>
        )}
        
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
          sx={{ mr: 2 }}
        >
          <ToggleButton value="candlestick" aria-label="candlestick chart">
            <Tooltip title="Candlestick Chart">
              <TrendingUpIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="line" aria-label="line chart">
            <Tooltip title="Line Chart">
              <ShowChartIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="area" aria-label="area chart">
            <Tooltip title="Area Chart">
              <TimelineIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="bar" aria-label="bar chart">
            <Tooltip title="Bar Chart">
              <BarChartIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <IconButton color="inherit" onClick={handleFullscreen} sx={{ mr: 1 }}>
          <Tooltip title="Fullscreen">
            <FullscreenIcon />
          </Tooltip>
        </IconButton>
        
        <IconButton color="inherit">
          <Tooltip title="Chart Settings">
            <SettingsIcon />
          </Tooltip>
        </IconButton>
      </Toolbar>
      
      <Box 
        ref={chartContainerRef}
        sx={{ 
          width: '100%', 
          height: height,
          position: 'relative',
          bgcolor: '#1a1a1a'
        }}
      >
        {isLoading && (
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#d1d4dc',
            zIndex: 1000
          }}>
            <CircularProgress size={40} sx={{ color: '#2962ff', mb: 2 }} />
            <Typography variant="body1">Loading chart data...</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#ef5350',
            zIndex: 1000
          }}>
            <Typography variant="h6">Error loading chart data</Typography>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default TradingChart; 