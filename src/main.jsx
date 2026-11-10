import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initFitTextScale } from './utils/fitTextScale.js'

/** 카카오톡, Threads 등 환경마다 다른 글자 확대를 보정해 같은 크기로 맞춘다 */
initFitTextScale()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
