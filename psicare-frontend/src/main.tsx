import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css' // Mantenha apenas este CSS
// import './App.css'  <-- SE TIVER ISSO, APAGUE ESTA LINHA!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)