import React from 'react'
import ReactDOM from 'react-dom/client'
import PopupPage from './PopupPage.tsx'
import './index.css'
import theme from './theme'
import { ColorModeScript } from '@chakra-ui/color-mode'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <PopupPage />
  </React.StrictMode>,
)
