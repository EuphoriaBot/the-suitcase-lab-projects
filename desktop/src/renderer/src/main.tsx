import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './styles/css/base.css'
import './styles/css/layout.css'
import './styles/css/component.css'
import './styles/css/arcanist.css'
import './styles/css/status-effect.css'
import './styles/css/responsive.css'
import './styles/css/database.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
