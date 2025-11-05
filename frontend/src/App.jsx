
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SubjectsList from './pages/subjects/SubjectsList';
import SubjectDetail from './pages/subjects/SubjectDetail';
import FlashcardList from './pages/flashcards/FlashcardList';
import SummaryList from './pages/summaries/SummaryList';
import SummaryDetail from './pages/summaries/SummaryDetail';
import QuizList from './pages/quizzes/QuizList';
import QuizDetail from './pages/quizzes/QuizDetail';
import Profile from './pages/profile/Profile';
import AppLayout from './layout/AppLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthChange, logout as firebaseLogout } from './auth/auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLogout, setShouldLogout] = useState(false);

  useEffect(() => {
    // Listener de mudança de estado de autenticação do Firebase
    const unsubscribe = onAuthChange((user) => {
      setIsLoggedIn(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShouldLogout(false);
  };
  
  const handleLogout = async () => {
    try {
      await firebaseLogout();
      setIsLoggedIn(false);
      setShouldLogout(true);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-estudai-blue mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar theme="colored" closeOnClick pauseOnHover={false} />
      {shouldLogout && <Navigate to="/login" replace />}
      <Routes>
        <Route path="/" element={<Login onShowRegister={() => window.location.replace('/register')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/login" element={<Login onShowRegister={() => window.location.replace('/register')} onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onShowLogin={() => window.location.replace('/login')} />} />
        
        {/* Protected routes with layout */}
        <Route element={isLoggedIn ? <AppLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/subjects" element={<SubjectsList />} />
          <Route path="/subjects/:id" element={<SubjectDetail />} />
          <Route path="/flashcards" element={<FlashcardList />} />
          <Route path="/summaries" element={<SummaryList />} />
          <Route path="/summaries/:id" element={<SummaryDetail />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
