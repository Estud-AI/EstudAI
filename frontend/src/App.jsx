import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="colored" />
      <Routes>
        <Route path="/" element={<Login onShowRegister={() => window.location.replace('/register')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onShowRegister={() => window.location.replace('/register')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onShowLogin={() => window.location.replace('/login')} />} />
        <Route path="/home" element={
          isLoggedIn ? <Home /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App
