import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';
import { createSummary } from '../../services/ai';
import { getUserId } from '../../auth/auth';
import './SubjectSummaries.css';

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
      <div className="subject-summaries-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando resumos...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subject.summaries || subject.summaries.length === 0) {
    return (
      <div className="subject-summaries-container">
        <button onClick={() => navigate(`/subjects/${id}`)} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h2>Nenhum resumo encontrado</h2>
          <p>Esta matéria ainda não possui resumos gerados.</p>
          <button 
            onClick={handleCreateSummary} 
            className="btn-create"
            disabled={creating}
          >
            {creating ? (
              <>
                <div className="btn-spinner"></div>
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
    <div className="subject-summaries-container">
      <div className="summaries-header">
        <button onClick={() => navigate(`/subjects/${id}`)} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div>
          <h1 className="page-title">Resumos - {subject.name}</h1>
          <p className="page-subtitle">{subject.summaries.length} resumo{subject.summaries.length !== 1 ? 's' : ''} disponível{subject.summaries.length !== 1 ? 'eis' : ''}</p>
        </div>
        <button 
          onClick={handleCreateSummary} 
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
              Gerar Novo
            </>
          )}
        </button>
      </div>

      <div className={`summaries-layout ${subject.summaries.length > 1 ? 'with-sidebar' : ''}`}>
        {/* Lista de resumos */}
        {subject.summaries.length > 1 && (
          <aside className="summaries-sidebar">
            <h3>Resumos disponíveis</h3>
            <div className="summaries-list">
              {subject.summaries.map((summary) => (
                <button
                  key={summary.id}
                  className={`summary-item ${selectedSummary?.id === summary.id ? 'active' : ''}`}
                  onClick={() => setSelectedSummary(summary)}
                >
                  <div className="summary-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="summary-item-content">
                    <span className="summary-item-name">{summary.name}</span>
                    <span className="summary-item-date">
                      {new Date(summary.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Conteúdo do resumo */}
        <div className="summary-content">
          {selectedSummary && (
            <>
              <div className="summary-content-header">
                <h2>{selectedSummary.name}</h2>
                <span className="summary-date">
                  Criado em {new Date(selectedSummary.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="summary-text">
                {summaryContent && typeof summaryContent === 'object' && Object.keys(summaryContent).length > 0 ? (
                  Object.entries(summaryContent).map(([key, value]) => {
                    // Pular chaves vazias ou 'content' se for só texto
                    if (!value || key === 'content' && typeof value === 'string' && Object.keys(summaryContent).length === 1) {
                      return <p key={key} className="summary-text-content">{value}</p>;
                    }
                    
                    return (
                      <div key={key} className="summary-section">
                        <h3>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                        {typeof value === 'string' ? (
                          <p>{value}</p>
                        ) : Array.isArray(value) ? (
                          <ul>
                            {value.map((item, idx) => (
                              <li key={idx}>
                                {typeof item === 'object' ? 
                                  Object.entries(item).map(([k, v]) => (
                                    <span key={k}><strong>{k}:</strong> {v}. </span>
                                  ))
                                  : item
                                }
                              </li>
                            ))}
                          </ul>
                        ) : typeof value === 'object' && value !== null ? (
                          <div className="summary-subsection">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey}>
                                <strong>{subKey.replace(/_/g, ' ')}:</strong>{' '}
                                {typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{String(value)}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="summary-text-content">{selectedSummary.text}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
