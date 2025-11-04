import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './SubjectsList.css';

export default function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockSubjects = [
    { 
      id: 1, 
      name: 'Matemática', 
      progress: 75,
      topics: 12,
      flashcards: 45,
      quizzes: 8,
      color: 'blue'
    },
    { 
      id: 2, 
      name: 'Português', 
      progress: 60,
      topics: 15,
      flashcards: 38,
      quizzes: 6,
      color: 'green'
    },
    { 
      id: 3, 
      name: 'História', 
      progress: 45,
      topics: 20,
      flashcards: 52,
      quizzes: 10,
      color: 'purple'
    },
    { 
      id: 4, 
      name: 'Biologia', 
      progress: 85,
      topics: 18,
      flashcards: 61,
      quizzes: 12,
      color: 'orange'
    },
    { 
      id: 5, 
      name: 'Física', 
      progress: 30,
      topics: 14,
      flashcards: 29,
      quizzes: 5,
      color: 'red'
    },
    { 
      id: 6, 
      name: 'Química', 
      progress: 55,
      topics: 16,
      flashcards: 42,
      quizzes: 7,
      color: 'teal'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubjects(mockSubjects);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="subjects-container">
        <div className="loading">Carregando matérias...</div>
      </div>
    );
  }

  return (
    <div className="subjects-container">
      <div className="subjects-header">
        <h1 className="subjects-title">Suas Matérias</h1>
        <p className="subjects-subtitle">
          Acompanhe seu progresso e explore materiais de estudo
        </p>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => (
          <Link 
            key={subject.id} 
            to={`/subjects/${subject.id}`}
            className={`subject-card ${subject.color}`}
          >
            <div className="subject-header">
              <h3 className="subject-name">{subject.name}</h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            <div className="subject-progress">
              <div className="progress-info">
                <span className="progress-label">Progresso</span>
                <span className="progress-value">{subject.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>

            <div className="subject-stats">
              <div className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>{subject.topics} tópicos</span>
              </div>
              <div className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                </svg>
                <span>{subject.flashcards} cards</span>
              </div>
              <div className="stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>{subject.quizzes} quizzes</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
