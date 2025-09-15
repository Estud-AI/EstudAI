import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health')
        const data = await response.json()
        setHealthStatus(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to connect to backend')
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>EstudAI - Full Stack Template</h1>
      <div className="card">
        <h2>Backend Health Status</h2>
        {loading && <p>Checking backend connection...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {healthStatus && (
          <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <p>Backend Status: <strong>{healthStatus.status}</strong></p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Successfully connected to backend at http://localhost:3001/api/health
            </p>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Full-Stack template with Node.js (Express) + React (Vite)
      </p>
    </>
  )
}

export default App
