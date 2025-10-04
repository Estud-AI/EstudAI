import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Função chamada após login bem-sucedido
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        {showRegister ? (
          <Register onShowLogin={() => setShowRegister(false)} />
        ) : (
          <Login onShowRegister={() => setShowRegister(true)} onLoginSuccess={handleLoginSuccess} />
        )}
      </>
    );
  }

  // Após login, mostra Navbar e Sidebar
  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem' }}>
          {/* Conteúdo principal */}
          <h2>Bem-vindo ao EstudAI!</h2>
        </main>
      </div>
    </>
  );
}

export default App
