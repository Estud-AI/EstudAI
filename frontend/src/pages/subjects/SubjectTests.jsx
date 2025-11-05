import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';
import './SubjectTests.css';

export default function SubjectTests() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadSubject();
  }, [id]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      const data = await getSubjectById(id);
      setSubject(data);
      
      // Selecionar o primeiro teste automaticamente
      if (data.tests && data.tests.length > 0) {
        setSelectedTest(data.tests[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar matéria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    if (!selectedTest?.questions) return;
    
    let correctCount = 0;
    selectedTest.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getOptionByNumber = (question, number) => {
    const options = [question.option1, question.option2, question.option3, question.option4];
    return options[number - 1];
  };

  if (loading) {
    return (
      <div className="subject-tests-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando simulados...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subject.tests || subject.tests.length === 0) {
    return (
      <div className="subject-tests-container">
        <button onClick={() => navigate(`/subjects/${id}`)} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <h2>Nenhum simulado encontrado</h2>
          <p>Esta matéria ainda não possui simulados gerados.</p>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = selectedTest?.questions?.length || 0;
  const canSubmit = answeredCount === totalQuestions && totalQuestions > 0;

  return (
    <div className="subject-tests-container">
      <div className="tests-header">
        <button onClick={() => navigate(`/subjects/${id}`)} className="btn-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Voltar
        </button>
        <div>
          <h1 className="page-title">Simulados - {subject.name}</h1>
          <p className="page-subtitle">{subject.tests.length} simulado{subject.tests.length !== 1 ? 's' : ''} disponível{subject.tests.length !== 1 ? 'eis' : ''}</p>
        </div>
      </div>

      <div className={`tests-layout ${subject.tests.length > 1 ? 'with-sidebar' : ''}`}>
        {/* Lista de testes */}
        {subject.tests.length > 1 && (
          <aside className="tests-sidebar">
            <h3>Simulados disponíveis</h3>
            <div className="tests-list">
              {subject.tests.map((test) => (
                <button
                  key={test.id}
                  className={`test-item ${selectedTest?.id === test.id ? 'active' : ''}`}
                  onClick={() => handleSelectTest(test)}
                >
                  <div className="test-item-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <div className="test-item-content">
                    <span className="test-item-name">{test.name}</span>
                    <span className="test-item-info">{test.questions?.length || 0} questões</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Conteúdo do teste */}
        <div className="test-content">
          {selectedTest && (
            <>
              {!showResults ? (
                <>
                  <div className="test-content-header">
                    <h2>{selectedTest.name}</h2>
                    <div className="test-progress">
                      <span>{answeredCount} de {totalQuestions} respondidas</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="questions-list">
                    {selectedTest.questions?.map((question, qIndex) => (
                      <div key={question.id} className="question-card">
                        <div className="question-number">Questão {qIndex + 1}</div>
                        <div className="question-text">{question.question}</div>
                        
                        <div className="options-list">
                          {[1, 2, 3, 4].map((optNum) => (
                            <label
                              key={optNum}
                              className={`option-item ${answers[question.id] === optNum ? 'selected' : ''}`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={answers[question.id] === optNum}
                                onChange={() => handleAnswer(question.id, optNum)}
                              />
                              <span className="option-letter">{getOptionLetter(optNum - 1)}</span>
                              <span className="option-text">{getOptionByNumber(question, optNum)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="test-actions">
                    <button 
                      onClick={handleSubmit} 
                      className="btn-submit"
                      disabled={!canSubmit}
                    >
                      Finalizar e Ver Resultado
                    </button>
                  </div>
                </>
              ) : (
                <div className="test-results">
                  <div className="results-header">
                    <div className="results-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h2>Resultado do Simulado</h2>
                    <div className="results-score">
                      <div className="score-value">
                        {score} / {totalQuestions}
                      </div>
                      <div className="score-percentage">
                        {Math.round((score / totalQuestions) * 100)}% de acerto
                      </div>
                    </div>
                  </div>

                  <div className="questions-review">
                    {selectedTest.questions?.map((question, qIndex) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;
                      
                      return (
                        <div key={question.id} className={`question-review ${isCorrect ? 'correct' : 'wrong'}`}>
                          <div className="review-header">
                            <span className="question-number">Questão {qIndex + 1}</span>
                            <span className={`review-badge ${isCorrect ? 'correct' : 'wrong'}`}>
                              {isCorrect ? '✓ Correta' : '✗ Incorreta'}
                            </span>
                          </div>
                          <div className="question-text">{question.question}</div>
                          
                          <div className="review-answers">
                            <div className="review-answer">
                              <strong>Sua resposta:</strong> {getOptionLetter(userAnswer - 1)} - {getOptionByNumber(question, userAnswer)}
                            </div>
                            {!isCorrect && (
                              <div className="review-answer correct-answer">
                                <strong>Resposta correta:</strong> {getOptionLetter(question.correctAnswer - 1)} - {getOptionByNumber(question, question.correctAnswer)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="test-actions">
                    <button onClick={handleReset} className="btn-retry">
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
