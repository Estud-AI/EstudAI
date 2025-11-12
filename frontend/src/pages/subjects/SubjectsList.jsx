import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserSubjects } from '../../services/subjects';
import { getAuth } from '../../auth/auth';
import { useSubjects } from '../../contexts/SubjectsContext';
import './SubjectsList.css';

export default function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { shouldRefresh } = useSubjects();

  useEffect(() => {
    loadSubjects();
  }, [shouldRefresh]); // Recarrega quando shouldRefresh muda

  async function loadSubjects() {
    try {
      const auth = getAuth();
      if (!auth || !auth.user) {
        toast.error('Você precisa estar logado');
        setLoading(false);
        return;
      }

      const userId = parseInt(auth.user.id) || 1;
      const data = await getUserSubjects(userId);
      
      // Mapear dados do backend para o formato esperado
      const mappedSubjects = (data || []).map(subject => ({
        id: subject.id,
        name: subject.name,
        progress: subject.progress || 0,
        topics: subject._count?.summaries || 0,
        flashcards: subject._count?.flashcards || 0,
        quizzes: subject._count?.tests || 0,
        color: getRandomColor(subject.id)
      }));

      setSubjects(mappedSubjects);
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
      toast.error(error.message || 'Erro ao carregar matérias');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }

  function getRandomColor(id) {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];
    return colors[id % colors.length];
  }

  if (loading) {
    return (
      <div className="subjects-container">
        <div className="loading">
          <svg className="spinner-large" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
          </svg>
          Carregando matérias...
        </div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="subjects-container">
        <div className="subjects-header">
          <h1 className="subjects-title">Minhas Matérias</h1>
        </div>
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <h3>Nenhuma matéria ainda</h3>
          <p>Crie sua primeira matéria na página inicial para começar a estudar</p>
          <Link to="/home" className="button-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Criar Matéria
          </Link>
        </div>
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
