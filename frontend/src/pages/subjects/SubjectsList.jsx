import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserSubjects, deleteSubject } from '../../services/subjects';
import { getAuth } from '../../auth/auth';
import { useSubjects } from '../../contexts/SubjectsContext';

export default function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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

  function getColorClasses(color) {
    const colorMap = {
      blue: 'hover:border-blue-400',
      green: 'hover:border-green-400',
      purple: 'hover:border-purple-400',
      orange: 'hover:border-orange-400',
      red: 'hover:border-red-400',
      teal: 'hover:border-teal-400'
    };
    return colorMap[color] || '';
  }

  function getProgressColorClasses(color) {
    const colorMap = {
      blue: 'from-blue-500 to-blue-400',
      green: 'from-green-500 to-green-400',
      purple: 'from-purple-500 to-purple-400',
      orange: 'from-orange-500 to-orange-400',
      red: 'from-red-500 to-red-400',
      teal: 'from-teal-500 to-teal-400'
    };
    return colorMap[color] || 'from-blue-500 to-blue-400';
  }

  async function handleDeleteSubject(e, subjectId, subjectName) {
    e.preventDefault(); // Previne navegação do Link
    e.stopPropagation(); // Para propagação do evento
    
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar a matéria "${subjectName}"?\n\nEsta ação não pode ser desfeita e todos os resumos, flashcards e simulados serão deletados.`
    );
    
    if (!confirmed) return;
    
    try {
      setDeletingId(subjectId);
      await deleteSubject(subjectId);
      toast.success('Matéria deletada com sucesso!');
      
      // Atualizar a lista removendo a matéria deletada
      setSubjects(prev => prev.filter(s => s.id !== subjectId));
    } catch (error) {
      console.error('Erro ao deletar matéria:', error);
      toast.error(error.message || 'Erro ao deletar matéria');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-5">
          <svg className="animate-spin text-blue-500" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.25" />
            <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
          </svg>
          <p className="text-lg">Carregando matérias...</p>
        </div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Minhas Matérias</h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-500 gap-6 p-12 bg-gradient-to-br from-blue-50/30 to-blue-100/30 rounded-3xl border-2 border-dashed border-gray-200">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <h3 className="text-3xl font-bold text-gray-900 m-0">Nenhuma matéria ainda</h3>
          <p className="max-w-md leading-relaxed text-lg m-0">Crie sua primeira matéria na página inicial para começar a estudar</p>
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-lg font-semibold no-underline cursor-pointer transition-all duration-300 mt-2 shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 active:translate-y-0 active:shadow-md active:shadow-blue-500/30"
          >
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
    <div className="max-w-7xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between gap-8 mb-3">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">Suas Matérias</h1>
            <p className="text-lg text-gray-500 leading-relaxed m-0">
              Acompanhe seu progresso e explore materiais de estudo
            </p>
          </div>
          <Link 
            to="/home" 
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl text-base font-bold no-underline cursor-pointer transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl hover:-translate-y-1 hover:from-blue-600 hover:to-blue-700 hover:text-white active:translate-y-0 active:shadow-md"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Nova Matéria</span>
          </Link>
        </div>
      </div>

      {/* Grid de Matérias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div 
            key={subject.id} 
            className={`bg-white border-2 border-gray-100 rounded-3xl p-0 no-underline transition-all duration-300 flex flex-col relative overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-gray-200 ${getColorClasses(subject.color)} group`}
          >
            <Link 
              to={`/subjects/${subject.id}`}
              className="no-underline text-inherit flex flex-col gap-5 cursor-pointer p-7 flex-1"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-bold text-gray-900 m-0 leading-tight">
                  {subject.name}
                </h3>
                <svg 
                  className="text-gray-300 transition-all duration-300 flex-shrink-0 mt-1 group-hover:translate-x-1 group-hover:text-blue-500" 
                  width="22" 
                  height="22" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>

              {/* Progresso */}
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Progresso
                  </span>
                  <span className="text-2xl font-extrabold text-gray-900">
                    {subject.progress}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColorClasses(subject.color)} rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                    style={{ width: `${subject.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 transition-all duration-200 hover:from-blue-100 hover:to-blue-50 hover:scale-105 group/stat">
                  <svg 
                    className="text-blue-500 transition-all duration-200 group-hover/stat:scale-110" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{subject.topics}</div>
                    <div className="text-xs text-gray-500 font-medium">tópicos</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-50/50 transition-all duration-200 hover:from-purple-100 hover:to-purple-50 hover:scale-105 group/stat">
                  <svg 
                    className="text-purple-500 transition-all duration-200 group-hover/stat:scale-110" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  </svg>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{subject.flashcards}</div>
                    <div className="text-xs text-gray-500 font-medium">cards</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-green-50 to-green-50/50 transition-all duration-200 hover:from-green-100 hover:to-green-50 hover:scale-105 group/stat">
                  <svg 
                    className="text-green-500 transition-all duration-200 group-hover/stat:scale-110" 
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
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{subject.quizzes}</div>
                    <div className="text-xs text-gray-500 font-medium">quizzes</div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Botão Deletar */}
            <button
              className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm border border-red-200 rounded-xl p-2.5 cursor-pointer transition-all duration-300 flex items-center justify-center text-red-500 z-10 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 hover:bg-red-500 hover:border-red-500 hover:text-white hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              onClick={(e) => handleDeleteSubject(e, subject.id, subject.name)}
              disabled={deletingId === subject.id}
              title="Deletar matéria"
            >
              {deletingId === subject.id ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2 A10 10 0 0 1 22 12" opacity="0.75" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
