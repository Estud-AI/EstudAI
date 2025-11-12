import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';
import icon from '../assets/logo/icon_estudai.png';
import { getUserSubjects } from '../services/subjects';
import { getAuth } from '../auth/auth';
import { useSubjects } from '../contexts/SubjectsContext';

export default function Sidebar() {
  const location = useLocation();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { shouldRefresh } = useSubjects();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  useEffect(() => {
    loadSubjects();
  }, [shouldRefresh]); // Recarrega quando shouldRefresh muda

  const loadSubjects = async () => {
    try {
      const auth = getAuth();
      if (!auth?.user?.id) return;
      
      const data = await getUserSubjects(auth.user.id);
      setSubjects(data.slice(0, 5)); // Máximo 5 matérias no sidebar
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    } finally {
      setLoading(false);
    }
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

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            <span>Minhas Matérias</span>
          </div>
          
          {loading ? (
            <div className="sidebar-loading">Carregando...</div>
          ) : subjects.length > 0 ? (
            <>
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  to={`/subjects/${subject.id}`}
                  className={`sidebar-link sidebar-subject ${isActive(`/subjects/${subject.id}`) ? 'active' : ''}`}
                >
                  <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <span>{subject.name}</span>
                </Link>
              ))}
              <Link 
                to="/subjects" 
                className="sidebar-link sidebar-view-all"
              >
                <svg className="sidebar-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Ver todas</span>
              </Link>
            </>
          ) : (
            <div className="sidebar-empty">
              <p>Nenhuma matéria ainda</p>
            </div>
          )}
        </div>
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
