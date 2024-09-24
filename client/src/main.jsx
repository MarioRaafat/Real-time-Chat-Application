import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"
import './index.css'
import {SocketProvider} from "@/context/SocketContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <SocketProvider>
            <App />
            <Toaster closeButton/>
      </SocketProvider>
  </StrictMode>,
)
