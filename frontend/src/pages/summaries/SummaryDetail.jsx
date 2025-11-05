import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './SummaryDetail.css';

function SummaryDetail() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const mockSummaries = {
    1: {
      id: 1,
      title: 'Equações Algébricas',
      subject: 'Matemática',
      content: `
# Equações Algébricas

## Introdução
As equações algébricas são expressões matemáticas que contêm uma igualdade e pelo menos uma variável. Elas são fundamentais para resolver problemas matemáticos em diversas áreas.

## Equações do Primeiro Grau
Uma equação do primeiro grau tem a forma geral: ax + b = 0, onde a ≠ 0.

**Exemplo:**
2x + 5 = 13
2x = 13 - 5
2x = 8
x = 4

## Equações do Segundo Grau
Têm a forma geral: ax² + bx + c = 0, onde a ≠ 0.

**Fórmula de Bhaskara:**
x = (-b ± √(b² - 4ac)) / 2a

**Exemplo:**
x² - 5x + 6 = 0
a = 1, b = -5, c = 6
Δ = 25 - 24 = 1
x₁ = (5 + 1)/2 = 3
x₂ = (5 - 1)/2 = 2

## Sistemas de Equações
Conjunto de duas ou mais equações que devem ser resolvidas simultaneamente.

**Métodos de resolução:**
- Substituição
- Adição/Eliminação
- Comparação

## Aplicações Práticas
- Cálculo de dimensões
- Problemas de velocidade e distância
- Análise financeira
- Modelagem de fenômenos naturais

## Dicas de Estudo
✓ Pratique regularmente com exercícios variados
✓ Memorize as fórmulas principais
✓ Entenda o conceito antes de decorar
✓ Faça revisões espaçadas
      `,
      wordCount: 850,
      readTime: 4,
      color: 'blue',
      date: '2024-11-01'
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSummary(mockSummaries[id] || mockSummaries[1]);
      setLoading(false);
    }, 300);
  }, [id]);

  if (loading) {
    return (
      <div className="summary-detail-container">
        <div className="loading">Carregando resumo...</div>
      </div>
    );
  }

  return (
    <div className="summary-detail-container">
      <Link to="/summaries" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Voltar para Resumos
      </Link>

      <div className={`summary-detail-header ${summary.color}`}>
        <div className="header-badge">{summary.subject}</div>
        <h1 className="summary-detail-title">{summary.title}</h1>
        <div className="summary-meta-info">
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {summary.readTime} min de leitura
          </span>
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {summary.wordCount} palavras
          </span>
          <span className="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {new Date(summary.date).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="summary-content">
        <div className="content-body">
          {summary.content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
              return <h1 key={index} className="content-h1">{line.substring(2)}</h1>;
            } else if (line.startsWith('## ')) {
              return <h2 key={index} className="content-h2">{line.substring(3)}</h2>;
            } else if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={index} className="content-bold">{line.slice(2, -2)}</p>;
            } else if (line.startsWith('- ') || line.startsWith('✓ ')) {
              return <li key={index} className="content-li">{line.substring(2)}</li>;
            } else if (line.trim()) {
              return <p key={index} className="content-p">{line}</p>;
            }
            return null;
          })}
        </div>

        <div className="summary-actions">
          <button className="action-btn primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Baixar PDF
          </button>
          <button className="action-btn secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SummaryDetail;
