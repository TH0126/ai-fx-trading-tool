import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { Layout } from './components/Layout/Layout'
import Dashboard from './components/Dashboard/Dashboard'
import TradingChart from './components/Chart/TradingChart'
import { Analytics } from './components/Analytics/Analytics'
import { Settings } from './components/Settings/Settings'

const App: React.FC = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chart" element={<TradingChart currencyPair="USD/JPY" timeFrame="1h" />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Box>
    </Router>
  )
}

export default App 