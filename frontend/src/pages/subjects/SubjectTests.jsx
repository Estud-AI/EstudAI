import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../../services/subjects';
import { createTest } from '../../services/ai';
import { getUserId } from '../../auth/auth';
import { updateStreak } from '../../services/streak';

export default function SubjectTests() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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

  const handleCreateTest = async () => {
    try {
      setCreating(true);
      const userId = getUserId();
      await createTest(userId, Number(id));
      await loadSubject(); // Recarregar matéria
    } catch (error) {
      console.error('Erro ao criar simulado:', error);
      alert('Erro ao gerar simulado. Tente novamente.');
    } finally {
      setCreating(false);
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

  const handleSubmit = async () => {
    if (!selectedTest?.questions) return;
    
    let correctCount = 0;
    selectedTest.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
    
    // Atualizar streak após completar um simulado
    try {
      const userId = getUserId();
      await updateStreak(userId);
      console.log('Streak atualizado após completar simulado!');
    } catch (error) {
      console.error('Erro ao atualizar streak:', error);
    }
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
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
          <svg className="animate-spin text-green-500" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
          </svg>
          <p className="text-lg text-gray-600">Carregando simulados...</p>
        </div>
      </div>
    );
  }

  if (!subject || !subject.tests || subject.tests.length === 0) {
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
          <div className="p-6 bg-green-50 rounded-full">
            <svg className="text-green-500" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Nenhum simulado encontrado</h2>
          <p className="text-lg text-gray-600 max-w-md">Esta matéria ainda não possui simulados gerados.</p>
          <button 
            onClick={handleCreateTest} 
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={creating}
          >
            {creating ? (
              <>
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
                </svg>
                Gerando simulado...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Gerar Simulado
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = selectedTest?.questions?.length || 0;
  const canSubmit = answeredCount === totalQuestions && totalQuestions > 0;

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 truncate">Simulados - {subject.name}</h1>
          <p className="text-sm md:text-base text-gray-600">{subject.tests.length} simulado{subject.tests.length !== 1 ? 's' : ''} disponível{subject.tests.length !== 1 ? 'eis' : ''}</p>
        </div>
        <button 
          onClick={handleCreateTest} 
          className="inline-flex items-center gap-2.5 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap text-sm md:text-base w-full sm:w-auto justify-center"
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
      <div className={`flex gap-6 ${subject.tests.length > 1 ? '' : 'justify-center'}`}>
        {/* Sidebar */}
        {subject.tests.length > 1 && (
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Simulados disponíveis</h3>
              <div className="space-y-2">
                {subject.tests.map((test) => (
                  <button
                    key={test.id}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                      selectedTest?.id === test.id
                        ? 'bg-green-50 border-2 border-green-500 shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectTest(test)}
                  >
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      selectedTest?.id === test.id ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      <svg 
                        className={selectedTest?.id === test.id ? 'text-green-500' : 'text-gray-500'} 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <span className={`block font-semibold truncate ${
                        selectedTest?.id === test.id ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {test.name}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {test.questions?.length || 0} questões
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Conteúdo do teste */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {selectedTest && (
            <>
              {!showResults ? (
                <>
                  {/* Header do teste */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedTest.name}</h2>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          {answeredCount} de {totalQuestions} respondidas
                        </span>
                        <span className="text-sm font-semibold text-gray-700">
                          {Math.round((answeredCount / totalQuestions) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                          style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lista de questões */}
                  <div className="space-y-8">
                    {selectedTest.questions?.map((question, qIndex) => (
                      <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold mb-4">
                          Questão {qIndex + 1}
                        </div>
                        <div className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
                          {question.question}
                        </div>
                        
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((optNum) => (
                            <label
                              key={optNum}
                              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                answers[question.id] === optNum
                                  ? 'bg-green-50 border-green-500 shadow-md'
                                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                checked={answers[question.id] === optNum}
                                onChange={() => handleAnswer(question.id, optNum)}
                                className="mt-1 w-4 h-4 text-green-500 focus:ring-2 focus:ring-green-500"
                              />
                              <div className="flex items-center gap-3 flex-1">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm flex-shrink-0 ${
                                  answers[question.id] === optNum
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                                }`}>
                                  {getOptionLetter(optNum - 1)}
                                </span>
                                <span className={`text-base ${
                                  answers[question.id] === optNum ? 'font-semibold text-gray-900' : 'text-gray-700'
                                }`}>
                                  {getOptionByNumber(question, optNum)}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botão submit */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button 
                      onClick={handleSubmit} 
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none"
                      disabled={!canSubmit}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Finalizar e Ver Resultado
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-8">
                  {/* Header de resultados */}
                  <div className="text-center py-8 border-b border-gray-200">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                      <svg className="text-green-500" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Resultado do Simulado</h2>
                    <div className="inline-block bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl px-12 py-6">
                      <div className="text-6xl font-bold text-green-600 mb-2">
                        {score} / {totalQuestions}
                      </div>
                      <div className="text-xl font-semibold text-green-700">
                        {Math.round((score / totalQuestions) * 100)}% de acerto
                      </div>
                    </div>
                  </div>

                  {/* Revisão das questões */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Revisão das Questões</h3>
                    {selectedTest.questions?.map((question, qIndex) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;
                      
                      return (
                        <div 
                          key={question.id} 
                          className={`border-2 rounded-xl p-6 ${
                            isCorrect 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-red-50 border-red-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-gray-700">Questão {qIndex + 1}</span>
                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-sm ${
                              isCorrect 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                            }`}>
                              {isCorrect ? (
                                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> Correta</>
                              ) : (
                                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Incorreta</>
                              )}
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-gray-900 mb-6">
                            {question.question}
                          </div>
                          
                          <div className="space-y-3">
                            <div className={`p-4 rounded-lg border-2 ${
                              isCorrect 
                                ? 'bg-white border-green-300' 
                                : 'bg-white border-red-300'
                            }`}>
                              <strong className="text-sm font-semibold text-gray-700 block mb-1">Sua resposta:</strong>
                              <span className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {getOptionLetter(userAnswer - 1)} - {getOptionByNumber(question, userAnswer)}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div className="p-4 rounded-lg border-2 bg-white border-green-300">
                                <strong className="text-sm font-semibold text-gray-700 block mb-1">Resposta correta:</strong>
                                <span className="font-medium text-green-700">
                                  {getOptionLetter(question.correctAnswer - 1)} - {getOptionByNumber(question, question.correctAnswer)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Botão tentar novamente */}
                  <div className="pt-6">
                    <button 
                      onClick={handleReset} 
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 4v6h6M23 20v-6h-6"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                      </svg>
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
