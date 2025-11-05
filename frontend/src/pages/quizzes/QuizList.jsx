import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './QuizList.css';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockQuizzes = [
    {
      id: 1,
      title: 'Mathematics Challenge',
      subject: 'Mathematics',
      description: 'Test your algebra and geometry skills with this comprehensive quiz',
      questions: 20,
      duration: 30,
      difficulty: 'Medium',
      color: 'blue',
      completed: false,
      score: null
    },
    {
      id: 2,
      title: 'History: French Revolution',
      subject: 'History',
      description: 'Assess your knowledge of the French Revolution and its impact',
      questions: 15,
      duration: 20,
      difficulty: 'Hard',
      color: 'purple',
      completed: true,
      score: 85
    },
    {
      id: 3,
      title: 'Portuguese Grammar Quiz',
      subject: 'Portuguese',
      description: 'Test your understanding of Portuguese grammar rules',
      questions: 25,
      duration: 25,
      difficulty: 'Easy',
      color: 'green',
      completed: false,
      score: null
    },
    {
      id: 4,
      title: 'Cell Biology Basics',
      subject: 'Biology',
      description: 'Quiz on cell structure, organelles, and their functions',
      questions: 18,
      duration: 22,
      difficulty: 'Medium',
      color: 'orange',
      completed: true,
      score: 92
    },
    {
      id: 5,
      title: 'Physics: Motion & Forces',
      subject: 'Physics',
      description: 'Evaluate your understanding of Newton\'s laws and kinematics',
      questions: 15,
      duration: 25,
      difficulty: 'Hard',
      color: 'red',
      completed: false,
      score: null
    },
    {
      id: 6,
      title: 'Chemistry Fundamentals',
      subject: 'Chemistry',
      description: 'Test your knowledge of the periodic table and chemical reactions',
      questions: 20,
      duration: 28,
      difficulty: 'Medium',
      color: 'teal',
      completed: true,
      score: 78
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuizzes(mockQuizzes);
      setLoading(false);
    }, 500);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div>
          <h1 className="quiz-title">Practice Quizzes</h1>
          <p className="quiz-subtitle">
            Test your knowledge and track your progress
          </p>
        </div>
        <button className="action-button primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Quiz
        </button>
      </div>

      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <Link 
            key={quiz.id} 
            to={`/quizzes/${quiz.id}`}
            className={`quiz-card ${quiz.color}`}
          >
            {quiz.completed && (
              <div className="quiz-completed-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </div>
            )}

            <div className="quiz-card-header">
              <span className="quiz-subject-badge">{quiz.subject}</span>
              <span 
                className="quiz-difficulty"
                style={{ color: getDifficultyColor(quiz.difficulty) }}
              >
                {quiz.difficulty}
              </span>
            </div>

            <h3 className="quiz-card-title">{quiz.title}</h3>
            <p className="quiz-card-description">{quiz.description}</p>

            <div className="quiz-stats">
              <div className="quiz-stat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{quiz.questions} questions</span>
              </div>
              <div className="quiz-stat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{quiz.duration} mins</span>
              </div>
            </div>

            {quiz.completed && quiz.score !== null && (
              <div className="quiz-score">
                <span className="score-label">Last Score:</span>
                <span className="score-value">{quiz.score}%</span>
              </div>
            )}

            <div className="quiz-card-footer">
              <button className={`quiz-action-button ${quiz.completed ? 'secondary' : 'primary'}`}>
                {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
