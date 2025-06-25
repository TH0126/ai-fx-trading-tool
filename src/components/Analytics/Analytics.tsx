import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Psychology as AIIcon,
  Newspaper as NewsIcon,
  Assessment as PatternIcon,
} from '@mui/icons-material'

export const Analytics: React.FC = () => {
  // TODO: 実際のAI分析データに置き換え
  const mockAnalytics = {
    signals: [
      {
        symbol: 'USD/JPY',
        type: 'buy',
        strength: 8.5,
        confidence: 0.82,
        reasoning: ['RSI oversold', 'MACD bullish crossover', 'Support level hold'],
      },
      {
        symbol: 'EUR/USD',
        type: 'sell',
        strength: 7.2,
        confidence: 0.74,
        reasoning: ['Resistance at 1.095', 'Bearish divergence', 'News sentiment negative'],
      },
    ],
    patterns: [
      { symbol: 'GBP/USD', pattern: 'Double Bottom', confidence: 0.89 },
      { symbol: 'AUD/USD', pattern: 'Ascending Triangle', confidence: 0.76 },
    ],
    sentiment: {
      overall: 'neutral',
      score: 0.12,
      factors: [
        { source: 'News', impact: -0.3, description: 'Fed meeting concerns' },
        { source: 'Technical', impact: 0.4, description: 'Support levels holding' },
        { source: 'Economic', impact: 0.02, description: 'Mixed indicators' },
      ],
    },
  }

  const SignalCard: React.FC<{
    signal: typeof mockAnalytics.signals[0]
  }> = ({ signal }) => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{signal.symbol}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {signal.type === 'buy' ? (
              <TrendingUpIcon color="success" />
            ) : (
              <TrendingDownIcon color="error" />
            )}
            <Chip
              label={signal.type === 'buy' ? 'BUY' : 'SELL'}
              color={signal.type === 'buy' ? 'success' : 'error'}
              size="small"
            />
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            シグナル強度: {signal.strength}/10
          </Typography>
          <LinearProgress
            variant="determinate"
            value={signal.strength * 10}
            color={signal.type === 'buy' ? 'success' : 'error'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            信頼度: {(signal.confidence * 100).toFixed(1)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={signal.confidence * 100}
            color="primary"
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          判定理由:
        </Typography>
        <List dense>
          {signal.reasoning.map((reason, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemText primary={`• ${reason}`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI分析
      </Typography>

      <Grid container spacing={3}>
        {/* AIシグナル */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <AIIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">アクティブシグナル</Typography>
            </Box>
            
            {mockAnalytics.signals.map((signal, index) => (
              <SignalCard key={index} signal={signal} />
            ))}
          </Paper>
        </Grid>

        {/* サイドパネル */}
        <Grid item xs={12} lg={4}>
          {/* パターン認識 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PatternIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">パターン認識</Typography>
            </Box>
            
            {mockAnalytics.patterns.map((pattern, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">{pattern.symbol}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {pattern.pattern}
                </Typography>
                <Typography variant="body2" color="primary">
                  信頼度: {(pattern.confidence * 100).toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pattern.confidence * 100}
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Paper>

          {/* マーケットセンチメント */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <NewsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">マーケットセンチメント</Typography>
            </Box>
            
            <Box textAlign="center" mb={3}>
              <Typography variant="h4" component="div" 
                color={
                  mockAnalytics.sentiment.score > 0.2 ? 'success.main' :
                  mockAnalytics.sentiment.score < -0.2 ? 'error.main' : 'text.primary'
                }
              >
                {mockAnalytics.sentiment.overall.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                スコア: {mockAnalytics.sentiment.score.toFixed(2)}
              </Typography>
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              要因分析:
            </Typography>
            {mockAnalytics.sentiment.factors.map((factor, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">{factor.source}</Typography>
                  <Typography 
                    variant="body2" 
                    color={factor.impact > 0 ? 'success.main' : 'error.main'}
                  >
                    {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {factor.description}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
} 