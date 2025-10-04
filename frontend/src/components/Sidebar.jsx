import React from 'react';
import '../styles/sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <a href="#" className="sidebar-link">Início</a>
        <a href="#" className="sidebar-link">Matérias</a>
        <a href="#" className="sidebar-link">Quizzes</a>
        <a href="#" className="sidebar-link">Perfil</a>
      </nav>
    </aside>
  );
}
