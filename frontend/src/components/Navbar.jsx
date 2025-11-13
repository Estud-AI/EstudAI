import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { getAuth } from '../auth/auth';
import '../styles/navbar.css';

export default function Navbar({ onLogout }) {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const auth = getAuth();
      if (!auth?.user?.id) return;

      const response = await api.get(`/api/user/profile/${auth.user.id}`);
      if (response.data.ok) {
        setStreak(response.data.profile.dayStreak || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <h1 className="navbar-title">Assistente de Estudos</h1>
        </div>
        
        <div className="navbar-right">
          {!loading && (
            <div className="navbar-streak">
              <svg className="streak-icon" width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Chama externa - coral/salmão */}
                <path d="M10 1C10 1 4 7 4 12.5C4 17.7467 7.58172 22 12 22C16.4183 22 20 17.7467 20 12.5C20 7 14 1 10 1Z" 
                      fill="#E17B63" stroke="none"/>
                
                {/* Flama esquerda */}
                <path d="M2 14C2 14 0 17.5 0 20C0 22.2091 1.79086 24 4 24C6.20914 24 8 22.2091 8 20C8 17.5 5 14 2 14Z" 
                      fill="#E17B63" stroke="none"/>
                
                {/* Flama direita */}
                <path d="M18 14C18 14 16 17.5 16 20C16 22.2091 17.7909 24 20 24C22.2091 24 24 22.2091 24 20C24 17.5 21 14 18 14Z" 
                      fill="#E17B63" stroke="none" transform="translate(-4, 0)"/>
                
                {/* Chama interna - amarelo */}
                <path d="M10 5C10 5 6.5 9.5 6.5 13C6.5 16.0376 8.68629 18.5 11.5 18.5C14.3137 18.5 16.5 16.0376 16.5 13C16.5 9.5 13 5 10 5Z" 
                      fill="#F4CE7C" stroke="none"/>
                
                {/* Núcleo central - amarelo claro */}
                <path d="M10 9C10 9 8 11.5 8 13.5C8 15.1569 9.34315 16.5 11 16.5C12.6569 16.5 14 15.1569 14 13.5C14 11.5 12 9 10 9Z" 
                      fill="#FFF5D6" stroke="none"/>
                
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
              <div className="streak-info">
                <span className="streak-value">{streak}</span>
                <span className="streak-label">dia{streak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
          
          <button className="navbar-button" onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
