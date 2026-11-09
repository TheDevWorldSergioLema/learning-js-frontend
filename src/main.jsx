import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/index.js'
import './styles/global.scss'
import { PlaygroundView } from './views/playground/PlaygroundView.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaygroundView />
  </StrictMode>,
)
