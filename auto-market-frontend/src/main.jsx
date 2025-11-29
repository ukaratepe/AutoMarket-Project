import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { FavoriteProvider } from './context/FavoriteContext'; // <--- İMPORT ET

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <FavoriteProvider> {/* <--- BURAYA EKLE */}
        <App />
      </FavoriteProvider>
    </AuthProvider>
  </StrictMode>,
)