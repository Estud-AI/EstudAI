import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';
import icon from '../assets/logo/icon_estudai.png';

export default function Sidebar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={icon} alt="EstudAI" className="sidebar-icon-logo" />
        <span className="sidebar-title">EstudAI</span>
      </div>
      
      <nav className="sidebar-menu">
        <Link 
          to="/home" 
          className={`sidebar-link ${isActive('/home') ? 'active' : ''}`}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Início</span>
        </Link>
        
        <Link 
          to="/subjects" 
          className={`sidebar-link ${isActive('/subjects') ? 'active' : ''}`}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Matérias</span>
        </Link>
        
        <Link 
          to="/flashcards" 
          className={`sidebar-link ${isActive('/flashcards') ? 'active' : ''}`}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 3h2a2 2 0 0 1 2 2v2" />
          </svg>
          <span>Flashcards</span>
        </Link>
        
        <Link 
          to="/quizzes" 
          className={`sidebar-link ${isActive('/quizzes') ? 'active' : ''}`}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>Quizzes</span>
        </Link>
        
        <Link 
          to="/summaries" 
          className={`sidebar-link ${isActive('/summaries') ? 'active' : ''}`}
        >
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Resumos</span>
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <Link to="/profile" className="sidebar-link">
          <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Perfil</span>
        </Link>
      </div>
    </aside>
  );
}
