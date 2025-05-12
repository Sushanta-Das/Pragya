import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Chat from './pages/Chat.jsx'
import Home from './pages/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Chat />
  </StrictMode>
)
