import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { getAuth } from '../auth/auth';

export default function Navbar({ onLogout, toggleMobileSidebar, isMobile }) {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const auth = getAuth();
      if (!auth?.user?.id) return;

      const response = await api.get(`/api/user/profile/${auth.user.id}`);
      if (response.data.ok) {
        setStreak(response.data.profile.dayStreak || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar streak:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 right-0 h-16 md:h-16 bg-white border-b border-gray-200 z-50 transition-all duration-300 flex items-center px-4 md:px-8">
      <div className="w-full flex items-center justify-between">
        {/* Left side - Menu button */}
        <div className="flex items-center me-48">
          {isMobile && (
            <button 
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              onClick={toggleMobileSidebar}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-6">
          {!loading && (
            <div className="flex items-center gap-2 md:gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 px-3 md:px-4 py-2 rounded-xl border border-orange-200">
              <svg className="w-5 h-6 md:w-6 md:h-7 shrink-0" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Chama externa - coral/salmão */}
                <path d="M10 1C10 1 4 7 4 12.5C4 17.7467 7.58172 22 12 22C16.4183 22 20 17.7467 20 12.5C20 7 14 1 10 1Z" 
                      fill="#E17B63" stroke="none"/>
                
                {/* Flama esquerda */}
                <path d="M2 14C2 14 0 17.5 0 20C0 22.2091 1.79086 24 4 24C6.20914 24 8 22.2091 8 20C8 17.5 5 14 2 14Z" 
                      fill="#E17B63" stroke="none"/>
                
                {/* Flama direita */}
                <path d="M18 14C18 14 16 17.5 16 20C16 22.2091 17.7909 24 20 24C22.2091 24 24 22.2091 24 20C24 17.5 21 14 18 14Z" 
                      fill="#E17B63" stroke="none" transform="translate(-4, 0)"/>
                
                {/* Chama interna - amarelo */}
                <path d="M10 5C10 5 6.5 9.5 6.5 13C6.5 16.0376 8.68629 18.5 11.5 18.5C14.3137 18.5 16.5 16.0376 16.5 13C16.5 9.5 13 5 10 5Z" 
                      fill="#F4CE7C" stroke="none"/>
                
                {/* Núcleo central - amarelo claro */}
                <path d="M10 9C10 9 8 11.5 8 13.5C8 15.1569 9.34315 16.5 11 16.5C12.6569 16.5 14 15.1569 14 13.5C14 11.5 12 9 10 9Z" 
                      fill="#FFF5D6" stroke="none"/>
              </svg>
              <div className="flex flex-col">
                <span className="text-lg md:text-2xl font-bold text-orange-600 leading-none">
                  {streak}
                </span>
                <span className="text-[10px] md:text-xs text-orange-700 font-medium leading-tight">
                  dia{streak !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
          
          <button 
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            onClick={onLogout}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
