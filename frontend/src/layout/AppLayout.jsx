import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { SubjectsProvider } from '../contexts/SubjectsContext';

export default function AppLayout({ onLogout }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMinimize = () => {
    if (!isMobile) {
      setIsMinimized(!isMinimized);
    }
  };

  const toggleMobileSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <SubjectsProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar 
          isMinimized={isMinimized} 
          toggleMinimize={toggleMinimize}
          isMobileOpen={isMobileOpen}
          closeMobile={closeMobileSidebar}
        />
        <div 
          className={`
            transition-all duration-300
            ${isMobile 
              ? 'ml-0 w-full' 
              : isMinimized 
                ? 'ml-[70px] w-[calc(100%-70px)]' 
                : 'ml-[260px] w-[calc(100%-260px)]'
            }
          `}
          style={{ minHeight: '100vh' }}
        >
          <Navbar 
            onLogout={onLogout} 
            toggleMobileSidebar={toggleMobileSidebar}
            isMobile={isMobile}
          />
          <main className="pt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </SubjectsProvider>
  );
}
