import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../api/api';

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
  const authData = getAuth();
  if (!authData?.token) return false;
  if (authData.expiresAt) {
    const now = Date.now();
    const expMs = new Date(authData.expiresAt).getTime();
    return now < expMs;
  }
  return true;
}

// Login com Email/Password
export async function login({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    
    // Salvar dados localmente
    const userData = {
      id: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email,
      photoURL: user.photoURL,
    };
    
    setAuth({ 
      token, 
      user: userData, 
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() 
    });
    
    return { token, user: userData };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

// Registro com Email/Password
export async function register({ name, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar perfil com nome
    await updateProfile(user, { displayName: name });
    
    const token = await user.getIdToken();
    
    // Criar usuário no backend
    await api.post('/user-register', {
      name,
      email,
    });
    
    // Salvar dados localmente
    const userData = {
      id: user.uid,
      name: name,
      email: user.email,
      photoURL: user.photoURL,
    };
    
    setAuth({ 
      token, 
      user: userData, 
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() 
    });
    
    return { token, user: userData };
  } catch (error) {
    console.error('Register error:', error);
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

// Login com Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    
    // Criar/atualizar usuário no backend
    await api.post('/user-register-by-google', {
      name: user.displayName,
      email: user.email,
    });
    
    // Salvar dados localmente
    const userData = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
    
    setAuth({ 
      token, 
      user: userData, 
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() 
    });
    
    return { token, user: userData };
  } catch (error) {
    console.error('Google login error:', error);
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

// Logout
export async function logout() {
  try {
    await firebaseSignOut(auth);
    clearAuth();
  } catch (error) {
    console.error('Logout error:', error);
    clearAuth(); // Limpar mesmo se houver erro
  }
}

// Refresh token
export async function refresh() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Sem usuário autenticado');
    
    const newToken = await currentUser.getIdToken(true);
    const authData = getAuth();
    
    setAuth({ 
      token: newToken, 
      user: authData.user, 
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() 
    });
    
    return { token: newToken, expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() };
  } catch (error) {
    console.error('Refresh error:', error);
    throw error;
  }
}

// Listener de mudança de estado de autenticação
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      const userData = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0],
        email: user.email,
        photoURL: user.photoURL,
      };
      setAuth({ 
        token, 
        user: userData, 
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() 
      });
      callback(userData);
    } else {
      clearAuth();
      callback(null);
    }
  });
}

// Mensagens de erro em português
function getFirebaseErrorMessage(errorCode) {
  const messages = {
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado.',
  };
  
  return messages[errorCode] || 'Erro ao autenticar. Tente novamente.';
}
