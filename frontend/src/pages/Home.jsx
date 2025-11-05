import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createSubject } from '../services/subjects';
import { getAuth } from '../auth/auth';
import '../styles/home.css';

export default function Home() {
  const [materia, setMateria] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      title: 'Resumos Inteligentes',
      description: 'A IA cria resumos completos e estruturados sobre qualquer tema, organizando o conteúdo de forma clara e didática para facilitar seu aprendizado.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 3h2a2 2 0 0 1 2 2v2" />
        </svg>
      ),
      title: 'Flashcards Personalizados',
      description: 'Sistema de cartões interativos com perguntas e respostas, classificados por dificuldade (fácil, médio, difícil) para otimizar sua memorização.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      title: 'Simulados Automáticos',
      description: 'Testes com 10 questões de múltipla escolha gerados pela IA para avaliar seu conhecimento, com correção automática e explicações detalhadas.'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Bem-vindo ao EstudAI!</h1>
        <p className="home-subtitle">
          Sua plataforma de estudos com Inteligência Artificial
        </p>
      </div>

      <div className="home-search">
        <div className="search-card">
          <h3>Criar Nova Matéria</h3>
          <p className="search-description">
            Digite o tema que você deseja estudar e nossa IA irá criar automaticamente todo o conteúdo necessário para seus estudos.
          </p>
          <form onSubmit={handleCreateSubject} className="search-form">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Ex: Revolução Francesa, Álgebra Linear, Fotossíntese..."
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                disabled={isCreating}
                required
              />
            </div>
            <button 
              type="submit" 
              className="create-button"
              disabled={isCreating || !materia.trim()}
            >
              {isCreating ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
                  </svg>
                  Gerando conteúdo...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Criar Matéria
                </>
              )}
            </button>
          </form>
          
          <div className="home-actions-section">
            <Link to="/subjects" className="view-subjects-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Ver Minhas Matérias
            </Link>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h1 className="section-title">Como Funciona?</h1>
        <p className="section-subtitle">O EstudAI utiliza Inteligência Artificial para criar conteúdo personalizado de estudo</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  async function handleCreateSubject(e) {
    e.preventDefault();
    
    if (!materia.trim()) {
      toast.error('Digite o nome da matéria');
      return;
    }

    const auth = getAuth();
    if (!auth || !auth.user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setIsCreating(true);
    
    try {
      toast.info('🤖 IA gerando conteúdo... Isso pode levar até 1 minuto.', {
        autoClose: false,
        toastId: 'creating'
      });

      const result = await createSubject(materia.trim(), parseInt(auth.user.id) || 1);
      
      toast.dismiss('creating');
      toast.success(`✅ Matéria "${result.data.subjectName}" criada com sucesso!`);
      
      // Redirecionar para a matéria criada
      navigate(`/subjects/${result.data.subjectId}`);
      
    } catch (error) {
      toast.dismiss('creating');
      toast.error(error.message || 'Erro ao criar matéria');
    } finally {
      setIsCreating(false);
      setMateria('');
    }
  }
}
