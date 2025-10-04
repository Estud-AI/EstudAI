import React from 'react';
import '../styles/navbar.css';

export default function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-title">EstudAI</div>
      <button className="navbar-logout" onClick={onLogout}>Sair</button>
    </nav>
  );
}
