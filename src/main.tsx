import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n' // i18n 초기화 (반드시 App 임포트 전에 위치)
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
