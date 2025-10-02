// src/pages/materias/MateriasList.jsx
import { useEffect, useState } from 'react';
import api from '../../api/api';
import styles from './MateriasList.module.css';

export default function MateriasList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/api/materias').then(r => setItems(r.data || [])).catch(() => setItems([]));
  }, []);

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
    </div>
  );
}
