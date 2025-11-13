import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import icon from '../assets/logo/icon_estudai.png';
import { getUserSubjects, deleteSubject } from '../services/subjects';
import { getAuth } from '../auth/auth';
import { useSubjects } from '../contexts/SubjectsContext';
import ConfirmDialog from './ConfirmDialog';

export default function Sidebar({ isMinimized, toggleMinimize, isMobileOpen, closeMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { shouldRefresh } = useSubjects();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  useEffect(() => {
    loadSubjects();
  }, [shouldRefresh]); // Recarrega quando shouldRefresh muda

  const loadSubjects = async () => {
    try {
      const auth = getAuth();
      if (!auth?.user?.id) return;
      
      const data = await getUserSubjects(auth.user.id);
      setSubjects(data.slice(0, 5)); // Máximo 5 matérias no sidebar
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e, subject) => {
    e.preventDefault();
    e.stopPropagation();
    setSubjectToDelete(subject);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;

    try {
      setIsDeleting(true);
      await deleteSubject(subjectToDelete.id);
      toast.success('Matéria deletada com sucesso!');
      
      // Atualizar a lista removendo a matéria deletada
      setSubjects(prev => prev.filter(s => s.id !== subjectToDelete.id));
      
      // Se estiver na página da matéria deletada, redirecionar
      if (location.pathname.includes(`/subjects/${subjectToDelete.id}`)) {
        navigate('/subjects');
      }
      
      setDeleteDialogOpen(false);
      setSubjectToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar matéria:', error);
      toast.error(error.message || 'Erro ao deletar matéria');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSubjectToDelete(null);
  };

  const handleLinkClick = () => {
    if (closeMobile) {
      closeMobile();
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99] lg:hidden"
          onClick={closeMobile}
        ></div>
      )}
      
      <aside className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-[100]
        flex flex-col
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isMinimized ? 'w-[70px]' : 'w-[260px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <img 
              src={icon} 
              alt="EstudAI" 
              className="w-8 h-8 shrink-0 object-contain"
            />
            {!isMinimized && (
              <span className="font-bold text-lg text-gray-900 truncate">
                EstudAI
              </span>
            )}
          </div>
          <button 
            className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            onClick={toggleMinimize}
            title={isMinimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMinimized ? (
                <path d="M9 18l6-6-6-6"/>
              ) : (
                <path d="M15 18l-6-6 6-6"/>
              )}
            </svg>
          </button>
        </div>
      
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <Link 
            to="/home" 
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${isActive('/home') 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-100'
              }
              ${isMinimized ? 'justify-center' : ''}
            `}
            onClick={handleLinkClick}
            title="Início"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {!isMinimized && <span className="font-medium">Início</span>}
          </Link>

          {/* Matérias Section */}
          <div className="mt-6">
            {!isMinimized && (
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Minhas Matérias
                </span>
              </div>
            )}
            
            {loading ? (
              !isMinimized && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Carregando...
                </div>
              )
            ) : subjects.length > 0 ? (
              <>
                {subjects.map((subject) => (
                  <div key={subject.id} className="relative group">
                    <Link
                      to={`/subjects/${subject.id}`}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                        ${isActive(`/subjects/${subject.id}`)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isMinimized ? 'justify-center' : ''}
                      `}
                      onClick={handleLinkClick}
                      title={subject.name}
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                      </svg>
                      {!isMinimized && (
                        <span className="font-medium truncate flex-1">
                          {subject.name}
                        </span>
                      )}
                    </Link>
                    {!isMinimized && (
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md bg-red-50 border border-red-200 text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all"
                        onClick={(e) => handleDeleteClick(e, subject)}
                        title="Deletar matéria"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <Link 
                  to="/subjects" 
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-blue-600 hover:bg-blue-50 mt-2
                    ${isMinimized ? 'justify-center' : ''}
                  `}
                  onClick={handleLinkClick}
                  title="Ver todas as matérias"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {!isMinimized && <span className="font-medium">Ver todas</span>}
                </Link>
              </>
            ) : (
              !isMinimized && (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  <p>Nenhuma matéria ainda</p>
                </div>
              )
            )}
          </div>
        </nav>
        
        {/* Footer */}
        <div className="p-2 border-t border-gray-200 shrink-0">
          <Link 
            to="/profile" 
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-gray-100
              ${isMinimized ? 'justify-center' : ''}
            `}
            onClick={handleLinkClick} 
            title="Perfil"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {!isMinimized && <span className="font-medium">Perfil</span>}
          </Link>
        </div>

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Deletar Matéria"
        message={`Tem certeza que deseja deletar a matéria "${subjectToDelete?.name}"?\n\nEsta ação não pode ser desfeita e todos os resumos, flashcards e simulados serão deletados.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        isLoading={isDeleting}
      />
    </aside>
    </>
  );
}
