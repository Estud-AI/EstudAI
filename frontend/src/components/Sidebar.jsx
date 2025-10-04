import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">
        <Link to="/home" className="sidebar-link">Início</Link>
        <Link to="/materias" className="sidebar-link">Matérias</Link>
        <Link to="/quizzes" className="sidebar-link">Quizzes</Link>
        <Link to="/perfil" className="sidebar-link">Perfil</Link>
      </nav>
    </aside>
  );
}
