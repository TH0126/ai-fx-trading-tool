import React, { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import TradingChart from '../Chart/TradingChart';
import { useMarketStore } from '../../hooks/useMarketStore';
import { CurrencyPair, Timeframe } from '../../types/market-data';

const Dashboard: React.FC = () => {
  const { 
    selectedSymbol, 
    selectedTimeframe, 
    setSelectedSymbol, 
    setSelectedTimeframe,
    realtimePrices,
    fetchMultipleRates,
    error,
    isLoading
  } = useMarketStore();
  
  // 主要通貨ペアのリスト
  const majorPairs: CurrencyPair[] = ['USD/JPY', 'EUR/USD', 'GBP/USD', 'EUR/JPY', 'GBP/JPY', 'AUD/USD'];
  const timeframes: Timeframe[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  // 初回読み込み時に複数通貨ペアの価格を取得
  useEffect(() => {
    fetchMultipleRates(majorPairs);
    
    // 定期的に更新（5分間隔）
    const interval = setInterval(() => {
      fetchMultipleRates(majorPairs);
    }, 300000); // 5分
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (pair: CurrencyPair, price?: number) => {
    if (!price) return '--';
    return pair.includes('JPY') ? price.toFixed(3) : price.toFixed(5);
  };

  const handleRefresh = () => {
    fetchMultipleRates(majorPairs);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          FX Trading Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleRefresh} disabled={isLoading}>
            <Tooltip title="Refresh">
              <RefreshIcon />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip title="Settings">
              <SettingsIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>

      {/* エラーメッセージ */}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* メインチャート */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: 'fit-content' }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>通貨ペア</InputLabel>
                <Select
                  value={selectedSymbol}
                  label="通貨ペア"
                  onChange={(e) => setSelectedSymbol(e.target.value as CurrencyPair)}
                >
                  {majorPairs.map((pair) => (
                    <MenuItem key={pair} value={pair}>{pair}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>時間軸</InputLabel>
                <Select
                  value={selectedTimeframe}
                  label="時間軸"
                  onChange={(e) => setSelectedTimeframe(e.target.value as Timeframe)}
                >
                  {timeframes.map((tf) => (
                    <MenuItem key={tf} value={tf}>{tf.toUpperCase()}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <TradingChart 
              currencyPair={selectedSymbol} 
              timeFrame={selectedTimeframe} 
              height={500}
            />
          </Paper>
        </Grid>

        {/* サイドパネル */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* 主要通貨ペア一覧 */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  🌍 主要通貨ペア
                </Typography>
                {majorPairs.map((pair) => {
                  const priceData = realtimePrices[pair];
                  const price = priceData?.price;
                  const change = priceData?.change || 0;
                  const changePercent = priceData?.changePercent || 0;
                  const isPositive = changePercent >= 0;
                  
                  return (
                    <Card 
                      key={pair} 
                      sx={{ 
                        mb: 1, 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: selectedSymbol === pair ? '2px solid #2962ff' : '1px solid transparent',
                        '&:hover': { 
                          bgcolor: 'action.hover',
                          transform: 'translateY(-1px)',
                          boxShadow: 2
                        }
                      }}
                      onClick={() => setSelectedSymbol(pair)}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {pair}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatPrice(pair, price)}
                            </Typography>
                            {priceData?.bid && priceData?.ask && (
                              <Typography variant="caption" color="text.secondary">
                                Bid: {formatPrice(pair, priceData.bid)} / Ask: {formatPrice(pair, priceData.ask)}
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {isPositive ? (
                                <TrendingUpIcon sx={{ color: '#26a69a', fontSize: 18 }} />
                              ) : (
                                <TrendingDownIcon sx={{ color: '#ef5350', fontSize: 18 }} />
                              )}
                              <Typography 
                                variant="body2" 
                                sx={{ color: isPositive ? '#26a69a' : '#ef5350', fontWeight: 'bold' }}
                              >
                                {changePercent.toFixed(2)}%
                              </Typography>
                            </Box>
                            {priceData?.timestamp && (
                              <Typography variant="caption" color="text.secondary">
                                {new Date(priceData.timestamp).toLocaleTimeString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Paper>
            </Grid>

            {/* マーケット情報 */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  📈 マーケット情報
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip 
                    label="東京市場 - オープン" 
                    color="success" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    label="ロンドン市場 - クローズ" 
                    color="default" 
                    variant="outlined" 
                    size="small"
                  />
                  <Chip 
                    label="NY市場 - クローズ" 
                    color="default" 
                    variant="outlined" 
                    size="small"
                  />
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    ボラティリティ: 中程度
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    次回重要指標: 明日 21:30 (米雇用統計)
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* AI分析サマリー */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  🤖 AI分析サマリー
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(41, 98, 255, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {selectedSymbol} - 上昇トレンド継続
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      信頼度: 75%
                    </Typography>
                  </Box>
                  
                  <Box sx={{ p: 1, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2">
                      レジスタンス: {formatPrice(selectedSymbol, (realtimePrices[selectedSymbol]?.price || 0) * 1.01)}
                    </Typography>
                    <Typography variant="body2">
                      サポート: {formatPrice(selectedSymbol, (realtimePrices[selectedSymbol]?.price || 0) * 0.99)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    ⚠️ AI分析は投資助言ではありません
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 