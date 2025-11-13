import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';
import { createSummary } from '../../services/ai';
import { getUserId } from '../../auth/auth';

export default function SubjectSummaries() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  useEffect(() => {
    loadSubject();
  }, [id]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      const data = await getSubjectById(id);
      setSubject(data);
      
      // Selecionar o primeiro resumo automaticamente
      if (data.summaries && data.summaries.length > 0) {
        setSelectedSummary(data.summaries[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar matéria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSummary = async () => {
    try {
      setCreating(true);
      const userId = getUserId();
      await createSummary(userId, Number(id));
      await loadSubject(); // Recarregar matéria
    } catch (error) {
      console.error('Erro ao criar resumo:', error);
      alert('Erro ao gerar resumo. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  const parseSummaryContent = (text) => {
    try {
      // Tentar fazer parse do JSON
      const parsed = JSON.parse(text);
      
      // Se parsed for um objeto válido, retorná-lo
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
      
      // Se não, retornar como texto simples
      return { content: text };
    } catch (error) {
      // Se falhar o parse, retornar como texto simples
      return { content: text };
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
          <p className="text-lg text-gray-600">Carregando resumos...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subject.summaries || subject.summaries.length === 0) {
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
          <div className="p-6 bg-blue-50 rounded-full">
            <svg className="text-blue-500" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Nenhum resumo encontrado</h2>
          <p className="text-lg text-gray-600 max-w-md">Esta matéria ainda não possui resumos gerados.</p>
          <button 
            onClick={handleCreateSummary} 
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={creating}
          >
            {creating ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
                </svg>
                Gerando resumo...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Gerar Resumo
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const summaryContent = selectedSummary ? parseSummaryContent(selectedSummary.text) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <button 
          onClick={() => navigate(`/subjects/${id}`)} 
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 truncate">Resumos - {subject.name}</h1>
          <p className="text-sm md:text-base text-gray-600">{subject.summaries.length} resumo{subject.summaries.length !== 1 ? 's' : ''} disponível{subject.summaries.length !== 1 ? 'eis' : ''}</p>
        </div>
        <button 
          onClick={handleCreateSummary} 
          className="inline-flex items-center gap-2.5 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap text-sm md:text-base w-full sm:w-auto justify-center"
          disabled={creating}
        >
          {creating ? (
            <>
              <svg className="animate-spin shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" opacity="0.25" />
                <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
              </svg>
              <span className="hidden sm:inline">Gerando...</span>
            </>
          ) : (
            <>
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span className="hidden sm:inline">Gerar Novo</span>
              <span className="sm:hidden">Novo</span>
            </>
          )}
        </button>
      </div>

      {/* Layout com sidebar */}
      <div className={`flex gap-6 ${subject.summaries.length > 1 ? '' : 'justify-center'}`}>
        {/* Sidebar com lista de resumos */}
        {subject.summaries.length > 1 && (
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumos disponíveis</h3>
              <div className="space-y-2">
                {subject.summaries.map((summary) => (
                  <button
                    key={summary.id}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                      selectedSummary?.id === summary.id
                        ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSummary(summary)}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      selectedSummary?.id === summary.id ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      <svg 
                        className={selectedSummary?.id === summary.id ? 'text-blue-500' : 'text-gray-500'} 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <span className={`block font-semibold truncate ${
                        selectedSummary?.id === summary.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {summary.name}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {new Date(summary.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Conteúdo do resumo */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {selectedSummary && (
            <>
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedSummary.name}</h2>
                <span className="text-sm text-gray-500">
                  Criado em {new Date(selectedSummary.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="prose prose-lg max-w-none">
                {summaryContent && typeof summaryContent === 'object' && Object.keys(summaryContent).length > 0 ? (
                  Object.entries(summaryContent).map(([key, value]) => {
                    // Pular chaves vazias ou 'content' se for só texto
                    if (!value || key === 'content' && typeof value === 'string' && Object.keys(summaryContent).length === 1) {
                      return <p key={key} className="text-gray-700 leading-relaxed whitespace-pre-wrap">{value}</p>;
                    }
                    
                    return (
                      <div key={key} className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h3>
                        {typeof value === 'string' ? (
                          <p className="text-gray-700 leading-relaxed">{value}</p>
                        ) : Array.isArray(value) ? (
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {value.map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {typeof item === 'object' ? 
                                  Object.entries(item).map(([k, v]) => (
                                    <span key={k}><strong className="font-semibold text-gray-900">{k}:</strong> {v}. </span>
                                  ))
                                  : item
                                }
                              </li>
                            ))}
                          </ul>
                        ) : typeof value === 'object' && value !== null ? (
                          <div className="space-y-3 pl-4 border-l-4 border-blue-200 bg-blue-50/50 p-4 rounded">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="text-gray-700">
                                <strong className="font-semibold text-gray-900">{subKey.replace(/_/g, ' ')}:</strong>{' '}
                                {typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-700 leading-relaxed">{String(value)}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedSummary.text}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
