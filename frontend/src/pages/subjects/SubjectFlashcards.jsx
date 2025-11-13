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
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
          <svg className="animate-spin text-purple-500" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
          </svg>
          <p className="text-lg text-gray-600">Carregando flashcards...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subject.flashcards || subject.flashcards.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <button 
          onClick={() => navigate(`/subjects/${id}`)} 
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-gray-600 bg-white border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
          <div className="p-6 bg-purple-50 rounded-full">
            <svg className="text-purple-500" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 3h2a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Nenhum flashcard encontrado</h2>
          <p className="text-lg text-gray-600 max-w-md">Esta matéria ainda não possui flashcards gerados.</p>
          <button 
            onClick={handleCreateFlashcards} 
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={creating}
          >
            {creating ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
                </svg>
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
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-6">
        <button 
          onClick={() => navigate(`/subjects/${id}`)} 
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Flashcards - {subject.name}</h1>
          <p className="text-gray-600">{flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''} disponível{flashcards.length !== 1 ? 'eis' : ''}</p>
        </div>
        <button 
          onClick={handleCreateFlashcards} 
          className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
          disabled={creating}
        >
          {creating ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
              </svg>
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
      <div className="flex gap-3 mb-8">
        <button 
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            filter === 'ALL' 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => { setFilter('ALL'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Todos ({subject.flashcards.length})
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            filter === 'EASY' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => { setFilter('EASY'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Fácil ({subject.flashcards.filter(c => c.level === 'EASY').length})
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            filter === 'MEDIUM' 
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => { setFilter('MEDIUM'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Médio ({subject.flashcards.filter(c => c.level === 'MEDIUM').length})
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            filter === 'HARD' 
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => { setFilter('HARD'); setCurrentIndex(0); setIsFlipped(false); }}
        >
          Difícil ({subject.flashcards.filter(c => c.level === 'HARD').length})
        </button>
      </div>

      {flashcards.length > 0 && (
        <div className="max-w-4xl mx-auto">
          {/* Progress e Level */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold text-gray-700">
              {currentIndex + 1} de {flashcards.length}
            </span>
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm ${
                getLevelColor(currentCard.level).bg === '#dcfce7' ? 'bg-green-100 text-green-700' :
                getLevelColor(currentCard.level).bg === '#fef3c7' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}
            >
              {getLevelLabel(currentCard.level)}
            </div>
          </div>

          {/* Flashcard */}
          <div 
            className="relative h-96 cursor-pointer mb-8 perspective-1000"
            onClick={handleFlip}
          >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Frente */}
              <div className="absolute w-full h-full backface-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-white">
                  <div className="text-xs font-bold uppercase tracking-wider mb-6 bg-white/20 px-4 py-2 rounded-lg">
                    FRENTE
                  </div>
                  <div className="text-center flex-1 flex items-center justify-center px-6">
                    <p className="text-2xl font-semibold leading-relaxed">
                      {currentCard?.front || 'Sem conteúdo'}
                    </p>
                  </div>
                  <div className="text-sm opacity-75 mt-6 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Clique para virar o card
                  </div>
                </div>
              </div>
              {/* Verso */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-white">
                  <div className="text-xs font-bold uppercase tracking-wider mb-6 bg-white/20 px-4 py-2 rounded-lg">
                    VERSO
                  </div>
                  <div className="text-center flex-1 flex items-center justify-center px-6">
                    <p className="text-2xl font-semibold leading-relaxed">
                      {currentCard?.back || 'Sem conteúdo'}
                    </p>
                  </div>
                  <div className="text-sm opacity-75 mt-6 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Clique para virar o card
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={handlePrev} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={flashcards.length <= 1}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Anterior
            </button>
            <button 
              onClick={handleFlip} 
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-purple-600 hover:to-purple-700"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Virar Card
            </button>
            <button 
              onClick={handleNext} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={flashcards.length <= 1}
            >
              Próximo
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
