
import React, { useState } from 'react';
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
