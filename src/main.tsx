import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DailyQuizApp } from './components/DailyQuizApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DailyQuizApp />
  </StrictMode>,
)
