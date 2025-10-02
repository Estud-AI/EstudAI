const STORAGE_KEY = 'app_auth'; // { token, user, expiresAt }

export function getAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth({ token, user, expiresAt }) {
  const payload = { token, user: user ?? null, expiresAt: expiresAt ?? null };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getToken() {
  const auth = getAuth();
  return auth?.token ?? null;
}

export function isAuthenticated() {
  const auth = getAuth();
  if (!auth?.token) return false;
  if (auth.expiresAt) {
    const now = Date.now();
    const expMs = new Date(auth.expiresAt).getTime();
    return now < expMs;
  }
  return true;
}

// Stub de login: troque depois por chamada real ao backend.
export async function login({ email, password }) {
  if (!email || !password) throw new Error('Credenciais inválidas');
  const fakeToken = 'fake-jwt-token';
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // +1h
  const user = { id: '123', name: 'Usuário Demo', email };
  setAuth({ token: fakeToken, user, expiresAt });
  return { token: fakeToken, user, expiresAt };
}

export function logout() {
  clearAuth();
}

export async function refresh() {
  const auth = getAuth();
  if (!auth?.token) throw new Error('Sem token para refresh');
  const newToken = 'fake-jwt-token-refreshed';
  const newExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  setAuth({ token: newToken, user: auth.user, expiresAt: newExpiresAt });
  return { token: newToken, expiresAt: newExpiresAt };
}
