import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './AppLayout.css';

export default function AppLayout({ onLogout }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <Navbar onLogout={onLogout} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
