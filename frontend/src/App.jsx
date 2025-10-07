
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MateriasList from './pages/materias/MateriasList';
import MateriaDetail from './pages/materias/MateriaDetail';
import FlashcardList from './pages/materias/FlashcardList';
import ResumoList from './pages/materias/ResumoList';
import SimuladoList from './pages/materias/SimuladoList';
import SimuladoDetail from './pages/materias/SimuladoDetail';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shouldLogout, setShouldLogout] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShouldLogout(false);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setShouldLogout(true);
  };

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="colored" closeOnClick pauseOnHover={false} />
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      {shouldLogout && <Navigate to="/login" replace />}
      <Routes>
        <Route path="/" element={<Login onShowRegister={() => window.location.replace('/register')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onShowRegister={() => window.location.replace('/register')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onShowLogin={() => window.location.replace('/login')} />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/materias" element={isLoggedIn ? <MateriasList /> : <Navigate to="/login" />} />
        <Route path="/materias/:id" element={isLoggedIn ? <MateriaDetail /> : <Navigate to="/login" />} />
        <Route path="/materias/flashcards" element={isLoggedIn ? <FlashcardList /> : <Navigate to="/login" />} />
        <Route path="/materias/resumos" element={isLoggedIn ? <ResumoList /> : <Navigate to="/login" />} />
        <Route path="/simulados" element={isLoggedIn ? <SimuladoList /> : <Navigate to="/login" />} />
        <Route path="/simulados/:id" element={isLoggedIn ? <SimuladoDetail /> : <Navigate to="/login" />} />
        <Route path="/quizzes" element={isLoggedIn ? <SimuladoList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App
