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

export function getUserId() {
  const auth = getAuth();
  return auth?.user?.id ?? null;
}

export function getUser() {
  const auth = getAuth();
  return auth?.user ?? null;
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
    
    // Tentar buscar usuário no backend
    let backendUser = null;
    try {
      const response = await api.get(`/api/user/user-by-email/${encodeURIComponent(user.email)}`);
      backendUser = response.data.user;
    } catch (error) {
      // Se não encontrar, criar o usuário no backend
      const createResponse = await api.post('/api/user/user-register', {
        name: user.displayName || email.split('@')[0],
        email: user.email,
      });
      backendUser = createResponse.data.user;
    }
    
    // Salvar dados localmente com o ID do backend
    const userData = {
      id: backendUser.id, // ID do banco de dados (number)
      firebaseUid: user.uid, // UID do Firebase (string)
      name: user.displayName || backendUser.name || email.split('@')[0],
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
    
    // Criar usuário no backend e pegar o ID do banco
    const backendResponse = await api.post('/api/user/user-register', {
      name,
      email,
    });
    
    // Salvar dados localmente com o ID do backend
    const userData = {
      id: backendResponse.data.user.id, // ID do banco de dados (number)
      firebaseUid: user.uid, // UID do Firebase (string)
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
    
    // Criar/atualizar usuário no backend e pegar o ID do banco
    const backendResponse = await api.post('/api/user/user-register-by-google', {
      name: user.displayName,
      email: user.email,
    });
    
    // Salvar dados localmente com o ID do backend
    const userData = {
      id: backendResponse.data.user.id, // ID do banco de dados (number)
      firebaseUid: user.uid, // UID do Firebase (string)
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
      
      // Verificar se já temos o ID do backend no localStorage
      const existingAuth = getAuth();
      if (existingAuth?.user?.id && typeof existingAuth.user.id === 'number') {
        // Já temos o ID do banco, usar o existente
        callback(existingAuth.user);
        return;
      }
      
      // Buscar ou criar usuário no backend para pegar o ID
      let backendUser = null;
      try {
        const response = await api.get(`/api/user/user-by-email/${encodeURIComponent(user.email)}`);
        backendUser = response.data.user;
      } catch (error) {
        // Se não encontrar, criar o usuário no backend
        try {
          const createResponse = await api.post('/api/user/user-register', {
            name: user.displayName || user.email?.split('@')[0],
            email: user.email,
          });
          backendUser = createResponse.data.user;
        } catch (createError) {
          console.error('Erro ao criar usuário no backend:', createError);
          clearAuth();
          callback(null);
          return;
        }
      }
      
      const userData = {
        id: backendUser.id, // ID do banco de dados (number)
        firebaseUid: user.uid, // UID do Firebase (string)
        name: user.displayName || backendUser.name || user.email?.split('@')[0],
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
