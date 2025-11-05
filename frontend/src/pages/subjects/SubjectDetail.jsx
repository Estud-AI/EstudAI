import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';
import './SubjectDetail.css';

function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubject();
  }, [id]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      const data = await getSubjectById(id);
      setSubject(data);
    } catch (error) {
      console.error('Erro ao carregar matéria:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="subject-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando matéria...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="subject-detail-container">
        <div className="error-state">
          <h2>Matéria não encontrada</h2>
          <button onClick={() => navigate('/subjects')} className="btn-primary">
            Voltar para matérias
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    summaries: subject.summaries?.length || 0,
    tests: subject.tests?.length || 0,
    flashcards: subject.flashcards?.length || 0,
  };

  return (
    <div className="subject-detail-container">
      <button onClick={() => navigate('/subjects')} className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Voltar
      </button>

      <div className="subject-detail-header">
        <h1 className="subject-detail-title">{subject.name}</h1>
        <p className="subject-detail-description">
          Explore todo o conteúdo gerado para esta matéria
        </p>
      </div>

      <div className="subject-cards-grid">
        {/* Card Resumos */}
        <div 
          className="subject-card resumos-card"
          onClick={() => navigate(`/subjects/${id}/summaries`)}
        >
          <div className="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="card-content">
            <h3>Resumos</h3>
            <p className="card-count">{stats.summaries} resumo{stats.summaries !== 1 ? 's' : ''}</p>
            <p className="card-description">Material de estudo condensado</p>
          </div>
          <div className="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Card Simulados */}
        <div 
          className="subject-card simulados-card"
          onClick={() => navigate(`/subjects/${id}/tests`)}
        >
          <div className="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="card-content">
            <h3>Simulados</h3>
            <p className="card-count">{stats.tests} simulado{stats.tests !== 1 ? 's' : ''}</p>
            <p className="card-description">Testes de conhecimento</p>
          </div>
          <div className="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        {/* Card Flashcards */}
        <div 
          className="subject-card flashcards-card"
          onClick={() => navigate(`/subjects/${id}/flashcards`)}
        >
          <div className="card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 3h2a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div className="card-content">
            <h3>Flashcards</h3>
            <p className="card-count">{stats.flashcards} flashcard{stats.flashcards !== 1 ? 's' : ''}</p>
            <p className="card-description">Cartões de memorização</p>
          </div>
          <div className="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="subject-stats">
        <div className="stat-item">
          <span className="stat-label">Progresso</span>
          <span className="stat-value">{subject.progress || 0}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Criada em</span>
          <span className="stat-value">
            {new Date(subject.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
