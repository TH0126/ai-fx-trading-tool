import React from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Badge,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ShowChart as ChartIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  NotificationsActive as NotificationIcon,
  WifiOff as DisconnectedIcon,
  Wifi as ConnectedIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 240

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // TODO: 実際のストアから取得
  const isConnected = false
  const notificationCount = 0

  const menuItems = [
    { path: '/', icon: <DashboardIcon />, label: 'ダッシュボード' },
    { path: '/chart', icon: <ChartIcon />, label: 'チャート' },
    { path: '/analytics', icon: <AnalyticsIcon />, label: 'AI分析' },
    { path: '/settings', icon: <SettingsIcon />, label: '設定' },
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      {/* アプリバー */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI FX Trading Assistant
          </Typography>
          
          {/* 接続状態 */}
          <IconButton color="inherit" sx={{ mr: 2 }}>
            {isConnected ? (
              <ConnectedIcon color="success" />
            ) : (
              <DisconnectedIcon color="error" />
            )}
          </IconButton>

          {/* 通知 */}
          <IconButton color="inherit">
            <Badge badgeContent={notificationCount} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
} 