import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Item({ to, children }) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link className={`${styles.item} ${active ? styles.active : ''}`} to={to}>
      {children}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className={styles.aside}>
      <nav className={styles.nav}>
        <Item to="/materias">Matérias</Item>
      </nav>
    </aside>
  );
}
