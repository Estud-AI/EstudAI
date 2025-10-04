import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // MOCK: Simula resposta do backend para testes sem backend
    setTimeout(() => {
      setHealthStatus({ status: 'OK (mock)' })
      setLoading(false)
    }, 500)
  }, [])

  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      {showRegister ? (
        <Register onShowLogin={() => setShowRegister(false)} />
      ) : (
        <Login onShowRegister={() => setShowRegister(true)} />
      )}
      {/* ...existing code... */}
    </>
  )
}

export default App
