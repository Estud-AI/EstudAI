import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { SubjectsProvider } from '../contexts/SubjectsContext';
import './AppLayout.css';

export default function AppLayout({ onLogout }) {
  return (
    <SubjectsProvider>
      <div className="app-layout">
        <Sidebar />
        <div className="app-content">
          <Navbar onLogout={onLogout} />
          <main className="app-main">
            <Outlet />
          </main>
        </div>
      </div>
    </SubjectsProvider>
  );
}
