import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createSubject } from '../services/subjects';
import { getAuth } from '../auth/auth';
import { useSubjects } from '../contexts/SubjectsContext';

export default function Home() {
  const [materia, setMateria] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { refreshSubjects } = useSubjects();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 -m-8 p-8">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            Bem-vindo ao EstudAI!
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Sua plataforma de estudos com Inteligência Artificial
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Criar Nova Matéria</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Digite o tema que você deseja estudar e nossa IA irá criar automaticamente todo o conteúdo necessário para seus estudos.
            </p>
            <form onSubmit={handleCreateSubject} className="space-y-6">
              <div className="relative">
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500" 
                  placeholder="Ex: Revolução Francesa, Álgebra Linear, Fotossíntese..."
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  disabled={isCreating}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isCreating || !materia.trim()}
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link 
                to="/subjects" 
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-blue-600 border-2 border-blue-200 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-50 hover:border-blue-400"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Ver Minhas Matérias
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Como Funciona?</h1>
          <p className="text-lg text-gray-600">O EstudAI utiliza Inteligência Artificial para criar conteúdo personalizado de estudo</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
      
      // Notificar o contexto para atualizar a sidebar
      refreshSubjects();
      
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
