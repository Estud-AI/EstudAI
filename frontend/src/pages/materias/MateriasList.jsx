// src/pages/materias/MateriasList.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';
import styles from './MateriasList.module.css';
import { Link } from 'react-router-dom';

export default function MateriasList() {
  // Conteúdo fictício para teste
  const items = [
    { id: 1, name: 'Matemática', progresso: 80 },
    { id: 2, name: 'Português', progresso: 60 },
    { id: 3, name: 'História', progresso: 40 }
  ];

  return (
    <div className="container">
      <h1 className={styles.title}>Matérias</h1>
      <ul className="list">
        {items.map(m => (
          <li key={m.id} className={styles.row}>
            <a className={styles.name} href={`/materias/${m.id}`}>{m.name}</a>
            <span className={styles.progress}>progresso: {m.progresso ?? 0}%</span>
          </li>
        ))}
      </ul>
      <Link to="/home" style={{marginTop: '2rem', display: 'inline-block', color: 'var(--primary-blue)', fontWeight: 600}}>Voltar para Início</Link>
    </div>
  );
}
