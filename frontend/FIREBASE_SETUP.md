# 🔥 Firebase Authentication - Configuração Completa

## ✅ Integração Concluída

A autenticação Firebase foi totalmente integrada ao EstudAI. Aqui está o que foi implementado:

### 📁 Arquivos Criados/Modificados

1. **`src/config/firebase.js`** ✨ NOVO
   - Configuração do Firebase
   - Inicialização do Auth
   - Provider do Google

2. **`src/auth/auth.js`** ♻️ ATUALIZADO
   - Login com email/senha (Firebase)
   - Registro com email/senha (Firebase)
   - Login com Google (Firebase + Backend)
   - Logout
   - Refresh token automático
   - Listener de mudança de autenticação
   - Mensagens de erro em português

3. **`src/pages/Login.jsx`** ♻️ ATUALIZADO
   - Integrado com Firebase Auth
   - Login com email/senha
   - Login com Google funcional
   - Estados de loading

4. **`src/pages/Register.jsx`** ♻️ ATUALIZADO
   - Integrado com Firebase Auth
   - Registro com email/senha + criação no backend
   - Registro com Google funcional
   - Estados de loading

5. **`src/App.jsx`** ♻️ ATUALIZADO
   - Listener de autenticação Firebase
   - Tela de loading inicial
   - Logout integrado

---

## 🔐 Fluxo de Autenticação

### Login/Registro com Email e Senha
```
1. Usuário preenche formulário
2. Firebase Auth valida e cria/autentica usuário
3. Frontend obtém token JWT do Firebase
4. Frontend chama backend (/user-register) para criar usuário no DB
5. Token é salvo no localStorage
6. Usuário é redirecionado para /home
```

### Login/Registro com Google
```
1. Usuário clica no botão do Google
2. Firebase abre popup de autenticação Google
3. Usuário autentica com conta Google
4. Firebase retorna dados do usuário e token
5. Frontend chama backend (/user-register-by-google) para criar/atualizar usuário
6. Token é salvo no localStorage
7. Usuário é redirecionado para /home
```

### Refresh Token Automático
```
- O interceptor do Axios detecta resposta 401
- Chama a função refresh() que pega novo token do Firebase
- Atualiza o token no localStorage
- Refaz a requisição original com novo token
```

---

## 🎯 Funcionalidades Implementadas

✅ **Login com Email/Senha**
- Validação de formulário
- Mensagens de erro em português
- Loading state

✅ **Registro com Email/Senha**
- Validação de formulário
- Criação de usuário no Firebase
- Sincronização com backend
- Mensagens de erro em português

✅ **Login/Registro com Google**
- OAuth 2.0 via Firebase
- Popup de autenticação
- Sincronização automática com backend
- Loading state

✅ **Logout**
- Limpa token do localStorage
- Faz logout no Firebase
- Redireciona para tela de login

✅ **Persistência de Sessão**
- Token salvo no localStorage
- Refresh automático quando expira
- Listener de mudança de autenticação

✅ **Proteção de Rotas**
- Rotas protegidas só acessíveis após login
- Redirecionamento automático para login

---

## 🔧 Variáveis de Ambiente (.env)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:3001
```

---

## 🚀 Como Testar

### 1. Login com Email/Senha
1. Acesse http://localhost:5173/register
2. Crie uma conta com email e senha
3. Será redirecionado para login
4. Faça login com as credenciais

### 2. Login com Google
1. Acesse http://localhost:5173/login
2. Clique no botão do Google
3. Selecione sua conta Google
4. Será autenticado e redirecionado para /home

### 3. Persistência
1. Faça login
2. Feche o navegador
3. Abra novamente http://localhost:5173
4. Você continuará logado

### 4. Logout
1. Estando logado, clique em "Sair" no navbar
2. Será redirecionado para tela de login
3. Sessão será encerrada

---

## 📊 Endpoints Backend Utilizados

### POST `/user-register`
Cria novo usuário no banco de dados (registro com email/senha)
```json
{
  "name": "Nome do Usuário",
  "email": "email@exemplo.com"
}
```

### POST `/user-register-by-google`
Cria ou atualiza usuário no banco (login/registro com Google)
```json
{
  "name": "Nome do Usuário",
  "email": "email@exemplo.com"
}
```

---

## 🛠️ Mensagens de Erro Traduzidas

- `auth/email-already-in-use` → "Este e-mail já está em uso."
- `auth/invalid-email` → "E-mail inválido."
- `auth/weak-password` → "A senha é muito fraca. Use pelo menos 6 caracteres."
- `auth/user-not-found` → "Usuário não encontrado."
- `auth/wrong-password` → "Senha incorreta."
- `auth/invalid-credential` → "Credenciais inválidas."
- `auth/too-many-requests` → "Muitas tentativas. Tente novamente mais tarde."
- `auth/popup-closed-by-user` → "Login cancelado."

---

## 📦 Dependências Instaladas

```bash
npm install firebase
```

---

## ✨ Próximos Passos (Opcional)

- [ ] Adicionar recuperação de senha (Firebase Password Reset)
- [ ] Adicionar verificação de email
- [ ] Adicionar login com Facebook/Apple
- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Adicionar avatares personalizados

---

## 🎉 Tudo Pronto!

O sistema de autenticação está **100% funcional** e integrado com Firebase + Backend!

Agora você pode:
- ✅ Criar contas com email/senha
- ✅ Fazer login com email/senha
- ✅ Fazer login com Google
- ✅ Manter sessão ativa
- ✅ Fazer logout
- ✅ Refresh automático de token
