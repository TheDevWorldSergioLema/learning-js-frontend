import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index.js'
import { ScreenGuard } from './layout/ScreenGuard.jsx'
import './styles/global.scss'
import { PlaygroundView } from './views/playground/PlaygroundView.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ScreenGuard>
      <PlaygroundView />
    </ScreenGuard>
  </StrictMode>,
)
