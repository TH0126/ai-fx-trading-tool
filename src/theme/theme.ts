import { createTheme } from '@mui/material/styles'

// FXトレーディング用のカラーパレット
const colors = {
  primary: '#1976d2', // ブルー
  secondary: '#dc004e', // レッド
  success: '#4caf50', // グリーン（上昇）
  error: '#f44336', // レッド（下降）
  warning: '#ff9800', // オレンジ
  info: '#2196f3', // ライトブルー
  background: {
    default: '#fafafa',
    paper: '#ffffff',
    dark: '#121212',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
  },
  chart: {
    bullish: '#4caf50', // 上昇トレンド
    bearish: '#f44336', // 下降トレンド
    neutral: '#9e9e9e', // 横ばい
    grid: '#e0e0e0', // グリッド線
    background: '#ffffff',
  },
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary,
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary,
      light: '#ff5983',
      dark: '#ab000d',
      contrastText: '#ffffff',
    },
    success: {
      main: colors.success,
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: colors.error,
      light: '#ef5350',
      dark: '#d32f2f',
    },
    warning: {
      main: colors.warning,
      light: '#ffb74d',
      dark: '#f57c00',
    },
    info: {
      main: colors.info,
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
        elevation2: {
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
    },
  },
})

// ダークテーマ（将来の拡張用）
export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: colors.background.dark,
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      disabled: '#777777',
    },
  },
})

// テーマタイプの定義（カスタムプロパティ用）
declare module '@mui/material/styles' {
  interface Palette {
    chart: {
      bullish: string
      bearish: string
      neutral: string
      grid: string
      background: string
    }
  }

  interface PaletteOptions {
    chart?: {
      bullish?: string
      bearish?: string
      neutral?: string
      grid?: string
      background?: string
    }
  }
} 