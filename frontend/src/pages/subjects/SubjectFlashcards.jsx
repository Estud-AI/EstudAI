import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';
import { createFlashcards } from '../../services/ai';
import { getUserId } from '../../auth/auth';
import { updateStreak } from '../../services/streak';
import './SubjectFlashcards.css';

export default function SubjectFlashcards() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState('ALL'); // ALL, EASY, MEDIUM, HARD
  const [readCount, setReadCount] = useState(0); // Contador de flashcards lidos

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

  const handleCreateFlashcards = async () => {
    try {
      setCreating(true);
      await createFlashcards(Number(id));
      await loadSubject(); // Recarregar matéria
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Erro ao criar flashcards:', error);
      alert('Erro ao gerar flashcards. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const getFilteredFlashcards = () => {
    if (!subject?.flashcards) return [];
    if (filter === 'ALL') return subject.flashcards;
    return subject.flashcards.filter(card => card.level === filter);
  };

  const flashcards = getFilteredFlashcards();
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = async () => {
    const wasNotFlipped = !isFlipped;
    setIsFlipped(!isFlipped);
    
    // Se está virando o card (não estava virado antes), incrementa o contador
    if (wasNotFlipped) {
      const newCount = readCount + 1;
      setReadCount(newCount);
      
      // Atualizar streak após ler 5 flashcards
      if (newCount === 5) {
        try {
          const userId = getUserId();
          await updateStreak(userId);
          console.log('Streak atualizado após ler 5 flashcards!');
        } catch (error) {
          console.error('Erro ao atualizar streak:', error);
        }
      }
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      EASY: { bg: '#dcfce7', text: '#16a34a' },
      MEDIUM: { bg: '#fef3c7', text: '#d97706' },
      HARD: { bg: '#fee2e2', text: '#dc2626' },
    };
    return colors[level] || colors.MEDIUM;
  };

  const getLevelLabel = (level) => {
    const labels = {
      EASY: 'Fácil',
      MEDIUM: 'Médio',
      HARD: 'Difícil',
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="subject-flashcards-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando flashcards...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subject.flashcards || subject.flashcards.length === 0) {
    return (
      <div className="subject-flashcards-container">
        <button onClick={() => navigate(`/subjects/${id}`)} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 3h2a2 2 0 0 1 2 2v2" />
          </svg>
          <h2>Nenhum flashcard encontrado</h2>
          <p>Esta matéria ainda não possui flashcards gerados.</p>
          <button 
            onClick={handleCreateFlashcards} 
            className="btn-create"
            disabled={creating}
          >
            {creating ? (
              <>
                <div className="btn-spinner"></div>
                Gerando flashcards...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Gerar Flashcards
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-flashcards-container">
      <div className="flashcards-header">
        <button onClick={() => navigate(`/subjects/${id}`)} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div>
          <h1 className="page-title">Flashcards - {subject.name}</h1>
          <p className="page-subtitle">{flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''} disponível{flashcards.length !== 1 ? 'eis' : ''}</p>
        </div>
        <button 
          onClick={handleCreateFlashcards} 
          className="btn-create-header"
          disabled={creating}
        >
          {creating ? (
            <>
              <div className="btn-spinner"></div>
              Gerando...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Gerar Mais
            </>
          )}
        </button>
      </div>

      {/* Filtros */}
      <div className="flashcards-filters">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => { setFilter('ALL'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Todos ({subject.flashcards.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'EASY' ? 'active' : ''}`}
          onClick={() => { setFilter('EASY'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Fácil ({subject.flashcards.filter(c => c.level === 'EASY').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'MEDIUM' ? 'active' : ''}`}
          onClick={() => { setFilter('MEDIUM'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Médio ({subject.flashcards.filter(c => c.level === 'MEDIUM').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'HARD' ? 'active' : ''}`}
          onClick={() => { setFilter('HARD'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Difícil ({subject.flashcards.filter(c => c.level === 'HARD').length})
        </button>
      </div>

      {flashcards.length > 0 && (
        <div className="flashcard-viewer">
          <div className="flashcard-progress">
            <span>{currentIndex + 1} de {flashcards.length}</span>
            <div 
              className="level-badge" 
              style={{ 
                backgroundColor: getLevelColor(currentCard.level).bg,
                color: getLevelColor(currentCard.level).text 
              }}
            >
              {getLevelLabel(currentCard.level)}
            </div>
          </div>

          <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <div className="flashcard-label">FRENTE</div>
                <div className="flashcard-content">
                  <p>{currentCard?.front || 'Sem conteúdo'}</p>
                </div>
                <div className="flashcard-hint">👆 Clique para virar o card</div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-label">VERSO</div>
                <div className="flashcard-content">
                  <p>{currentCard?.back || 'Sem conteúdo'}</p>
                </div>
                <div className="flashcard-hint">👆 Clique para virar o card</div>
              </div>
            </div>
          </div>

          <div className="flashcard-controls">
            <button 
              onClick={handlePrev} 
              className="control-btn"
              disabled={flashcards.length <= 1}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Anterior
            </button>
            <button onClick={handleFlip} className="control-btn flip-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Virar
            </button>
            <button 
              onClick={handleNext} 
              className="control-btn"
              disabled={flashcards.length <= 1}
            >
              Próximo
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
