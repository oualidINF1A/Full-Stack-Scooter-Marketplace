import React from 'react'
import { UserContextProvider } from './context/UserContext'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>,
)
