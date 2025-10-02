import { getCurrentUser, logout } from '../auth/auth';
import styles from './Navbar.module.css';

export default function Navbar() {
  const user = getCurrentUser();
  function handleLogout() {
    logout();
    window.location.href = '/login';
  }

  return (
    <header className={styles.header}>
      <strong className={styles.brand}>EstudAI</strong>
      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.streak}>{user.name} · 🔥 {user.dayStreak}d</span>
            <button className="btn" onClick={handleLogout}>Sair</button>
          </>
        )}
      </div>
    </header>
  );
}
