import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './QuizDetail.css';

function QuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const mockQuiz = {
    id: 1,
    title: 'Mathematics Challenge',
    subject: 'Mathematics',
    description: 'Test your algebra and geometry skills with this comprehensive quiz',
    questions: [
      {
        id: 1,
        question: 'What is the value of x in the equation 2x + 5 = 13?',
        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
        correct: 1
      },
      {
        id: 2,
        question: 'What is the area of a circle with radius 5?',
        options: ['25π', '10π', '5π', '15π'],
        correct: 0
      },
      {
        id: 3,
        question: 'Simplify: (x + 3)(x - 3)',
        options: ['x² - 9', 'x² + 9', 'x² - 6x + 9', 'x² + 6x - 9'],
        correct: 0
      }
    ],
    duration: 30,
    color: 'blue'
  };

  useEffect(() => {
    setTimeout(() => {
      setQuiz(mockQuiz);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / quiz.questions.length) * 100);
  };

  if (loading) {
    return (
      <div className="quiz-detail-container">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="quiz-detail-container">
        <Link to="/quizzes" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Quizzes
        </Link>

        <div className={`quiz-intro ${quiz.color}`}>
          <h1 className="quiz-intro-title">{quiz.title}</h1>
          <p className="quiz-intro-description">{quiz.description}</p>

          <div className="quiz-intro-stats">
            <div className="intro-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <div className="stat-value">{quiz.questions.length}</div>
                <div className="stat-label">Questions</div>
              </div>
            </div>
            <div className="intro-stat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <div className="stat-value">{quiz.duration}</div>
                <div className="stat-label">Minutes</div>
              </div>
            </div>
          </div>

          <button className="start-quiz-button" onClick={() => setStarted(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="quiz-detail-container">
        <div className="quiz-results">
          <div className="results-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="results-title">Quiz Completed!</h2>
          <div className="results-score">
            <span className="score-percentage">{score}%</span>
            <span className="score-fraction">
              {Object.values(answers).filter((a, i) => a === quiz.questions[i].correct).length} / {quiz.questions.length} correct
            </span>
          </div>
          <div className="results-actions">
            <Link to="/quizzes" className="results-button secondary">
              Back to Quizzes
            </Link>
            <button className="results-button primary" onClick={() => {
              setStarted(false);
              setCurrentQuestion(0);
              setAnswers({});
              setShowResults(false);
            }}>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-detail-container">
      <div className="quiz-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-question-container">
        <div className="question-header">
          <span className="question-number">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>

        <h2 className="question-text">{question.question}</h2>

        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${answers[question.id] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(question.id, index)}
            >
              <div className="option-indicator">
                {answers[question.id] === index && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>

        <div className="question-navigation">
          <button
            className="nav-button secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Previous
          </button>
          <button
            className="nav-button primary"
            onClick={handleNext}
            disabled={answers[question.id] === undefined}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizDetail;
