import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';

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
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
          <svg className="animate-spin text-blue-500" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
          </svg>
          <p className="text-lg text-gray-600">Carregando matéria...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Matéria não encontrada</h2>
          <button 
            onClick={() => navigate('/subjects')} 
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
          >
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
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate('/subjects')} 
        className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-gray-600 bg-white border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Voltar
      </button>

      {/* Header com gradiente */}
      <div className="mb-12 p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{subject.name}</h1>
        <p className="text-lg text-white/90 leading-relaxed">
          Explore todo o conteúdo gerado para esta matéria
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Card Resumos */}
        <div 
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 group"
          onClick={() => navigate(`/subjects/${id}/summaries`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-200">
              <svg className="text-blue-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <svg className="text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Resumos</h3>
            <p className="text-3xl font-bold text-blue-500 mb-2">{stats.summaries}</p>
            <p className="text-sm text-gray-600">Material de estudo condensado</p>
          </div>
        </div>

        {/* Card Simulados */}
        <div 
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-green-400 group"
          onClick={() => navigate(`/subjects/${id}/tests`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors duration-200">
              <svg className="text-green-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <svg className="text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-green-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Simulados</h3>
            <p className="text-3xl font-bold text-green-500 mb-2">{stats.tests}</p>
            <p className="text-sm text-gray-600">Testes de conhecimento</p>
          </div>
        </div>

        {/* Card Flashcards */}
        <div 
          className="bg-white border-2 border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-purple-400 group"
          onClick={() => navigate(`/subjects/${id}/flashcards`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors duration-200">
              <svg className="text-purple-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 3h2a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <svg className="text-gray-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-purple-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h3>
            <p className="text-3xl font-bold text-purple-500 mb-2">{stats.flashcards}</p>
            <p className="text-sm text-gray-600">Cartões de memorização</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="flex flex-wrap gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="flex-1 min-w-[200px]">
          <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Progresso</span>
          <span className="text-3xl font-bold text-gray-900">{subject.progress || 0}%</span>
        </div>
        <div className="flex-1 min-w-[200px]">
          <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Criada em</span>
          <span className="text-3xl font-bold text-gray-900">
            {new Date(subject.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
