import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Alert,
} from '@mui/material'
import {
  Settings as GeneralIcon,
  ShowChart as ChartIcon,
  Psychology as AIIcon,
  Notifications as NotificationIcon,
  Palette as AppearanceIcon,
} from '@mui/icons-material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
)

export const Settings: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0)
  
  // TODO: 実際の設定状態に置き換え
  const [settings, setSettings] = React.useState({
    general: {
      defaultSymbol: 'USD/JPY',
      language: 'ja',
      autoRefresh: true,
      refreshInterval: 30,
    },
    ai: {
      enableSignals: true,
      confidenceThreshold: 0.7,
      maxSignalsPerDay: 20,
      riskTolerance: 'medium',
    },
    notifications: {
      enableDesktop: true,
      enableSound: true,
      enableEmail: false,
    },
    appearance: {
      theme: 'light',
      primaryColor: '#1976d2',
      fontSize: 'medium',
    },
  })

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    // TODO: 実際の保存処理
    console.log('Settings saved:', settings)
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        設定
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<GeneralIcon />} label="一般" />
            <Tab icon={<ChartIcon />} label="チャート" />
            <Tab icon={<AIIcon />} label="AI設定" />
            <Tab icon={<NotificationIcon />} label="通知" />
            <Tab icon={<AppearanceIcon />} label="外観" />
          </Tabs>
        </Box>

        {/* 一般設定 */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              基本設定
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>デフォルト通貨ペア</InputLabel>
              <Select
                value={settings.general.defaultSymbol}
                label="デフォルト通貨ペア"
                onChange={(e) => updateSetting('general', 'defaultSymbol', e.target.value)}
              >
                <MenuItem value="USD/JPY">USD/JPY</MenuItem>
                <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                <MenuItem value="AUD/USD">AUD/USD</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>言語</InputLabel>
              <Select
                value={settings.general.language}
                label="言語"
                onChange={(e) => updateSetting('general', 'language', e.target.value)}
              >
                <MenuItem value="ja">日本語</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.general.autoRefresh}
                  onChange={(e) => updateSetting('general', 'autoRefresh', e.target.checked)}
                />
              }
              label="自動更新を有効にする"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="更新間隔（秒）"
              value={settings.general.refreshInterval}
              onChange={(e) => updateSetting('general', 'refreshInterval', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 5, max: 300 } }}
              sx={{ mb: 3 }}
            />
          </Box>
        </TabPanel>

        {/* チャート設定 */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              チャート設定
            </Typography>
            <Alert severity="info">
              チャート詳細設定は将来のバージョンで追加予定です。
            </Alert>
          </Box>
        </TabPanel>

        {/* AI設定 */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              AI分析設定
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.ai.enableSignals}
                  onChange={(e) => updateSetting('ai', 'enableSignals', e.target.checked)}
                />
              }
              label="AIシグナルを有効にする"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="信頼度閾値"
              value={settings.ai.confidenceThreshold}
              onChange={(e) => updateSetting('ai', 'confidenceThreshold', parseFloat(e.target.value))}
              InputProps={{ inputProps: { min: 0.1, max: 1.0, step: 0.1 } }}
              helperText="0.1-1.0の範囲で設定してください"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              type="number"
              label="1日の最大シグナル数"
              value={settings.ai.maxSignalsPerDay}
              onChange={(e) => updateSetting('ai', 'maxSignalsPerDay', parseInt(e.target.value))}
              InputProps={{ inputProps: { min: 1, max: 100 } }}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>リスク許容度</InputLabel>
              <Select
                value={settings.ai.riskTolerance}
                label="リスク許容度"
                onChange={(e) => updateSetting('ai', 'riskTolerance', e.target.value)}
              >
                <MenuItem value="low">低リスク</MenuItem>
                <MenuItem value="medium">中リスク</MenuItem>
                <MenuItem value="high">高リスク</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </TabPanel>

        {/* 通知設定 */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              通知設定
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.enableDesktop}
                  onChange={(e) => updateSetting('notifications', 'enableDesktop', e.target.checked)}
                />
              }
              label="デスクトップ通知"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.enableSound}
                  onChange={(e) => updateSetting('notifications', 'enableSound', e.target.checked)}
                />
              }
              label="音声通知"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.enableEmail}
                  onChange={(e) => updateSetting('notifications', 'enableEmail', e.target.checked)}
                />
              }
              label="メール通知"
              sx={{ mb: 2 }}
            />

            <Alert severity="info" sx={{ mt: 2 }}>
              詳細な通知設定は将来のバージョンで追加予定です。
            </Alert>
          </Box>
        </TabPanel>

        {/* 外観設定 */}
        <TabPanel value={tabValue} index={4}>
          <Box sx={{ p: 3, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              外観設定
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>テーマ</InputLabel>
              <Select
                value={settings.appearance.theme}
                label="テーマ"
                onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
              >
                <MenuItem value="light">ライト</MenuItem>
                <MenuItem value="dark">ダーク</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>フォントサイズ</InputLabel>
              <Select
                value={settings.appearance.fontSize}
                label="フォントサイズ"
                onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
              >
                <MenuItem value="small">小</MenuItem>
                <MenuItem value="medium">中</MenuItem>
                <MenuItem value="large">大</MenuItem>
              </Select>
            </FormControl>

            <Alert severity="info" sx={{ mt: 2 }}>
              ダークテーマとカラーカスタマイズは将来のバージョンで追加予定です。
            </Alert>
          </Box>
        </TabPanel>

        <Divider />
        
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>
            設定を保存
          </Button>
        </Box>
      </Paper>
    </Box>
  )
} 