import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  const quickActions = [
    {
      title: 'Explorar Matérias',
      description: 'Navegue pelas suas matérias e materiais de estudo',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      link: '/subjects',
      color: 'blue'
    },
    {
      title: 'Estudar Flashcards',
      description: 'Revise e memorize conceitos importantes',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 3h2a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      link: '/flashcards',
      color: 'green'
    },
    {
      title: 'Fazer um Quiz',
      description: 'Teste seus conhecimentos com quizzes práticos',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      link: '/quizzes',
      color: 'purple'
    },
    {
      title: 'Ver Resumos',
      description: 'Acesse resumos gerados por IA',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      link: '/summaries',
      color: 'orange'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Bem-vindo de volta!</h1>
        <p className="home-subtitle">
          Como posso ajudar você a estudar hoje?
        </p>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <Link 
            key={index} 
            to={action.link} 
            className={`action-card ${action.color}`}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-content">
              <h3 className="action-title">{action.title}</h3>
              <p className="action-description">{action.description}</p>
            </div>
            <svg className="action-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>

      <div className="home-search">
        <div className="search-card">
          <h3>Qual matéria vamos estudar hoje?</h3>
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Digite o nome da matéria..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
