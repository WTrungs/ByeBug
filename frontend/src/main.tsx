import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter }  from 'react-router-dom'
import './index.css'
import './styles/admin.css';
import './styles/ProblemManagement.css'
import './styles/UserManagement.css'
import './styles/modules/Problems.css'

import './styles/ActivityLog.css'
import App from './App'

const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter>
        <App />
        </BrowserRouter>
      </StrictMode>,
    )
}


