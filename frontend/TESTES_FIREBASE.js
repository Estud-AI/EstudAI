// ⚠️ ATENÇÃO: Este arquivo é apenas para referência
// Não execute diretamente - use o console do navegador

// ============================================
// TESTES DE AUTENTICAÇÃO FIREBASE
// ============================================

console.log('🔥 Firebase Authentication - Guia de Testes');

// --------------------------------------------
// 1. VERIFICAR CONFIGURAÇÃO DO FIREBASE
// --------------------------------------------
console.log('\n1️⃣ Verificar Configuração');
console.log('Abra o console e digite:');
console.log('import { auth } from "./src/config/firebase.js"');
console.log('console.log(auth)');

// --------------------------------------------
// 2. TESTAR REGISTRO COM EMAIL/SENHA
// --------------------------------------------
console.log('\n2️⃣ Testar Registro');
console.log('1. Acesse: http://localhost:5173/register');
console.log('2. Preencha: Nome, Email, Senha (mín. 6 caracteres)');
console.log('3. Clique em "Criar conta"');
console.log('4. ✅ Deve ver: "Registro realizado com sucesso!"');
console.log('5. ✅ Deve ser redirecionado para /login');

// --------------------------------------------
// 3. TESTAR LOGIN COM EMAIL/SENHA
// --------------------------------------------
console.log('\n3️⃣ Testar Login');
console.log('1. Acesse: http://localhost:5173/login');
console.log('2. Preencha: Email e Senha cadastrados');
console.log('3. Clique em "Entrar"');
console.log('4. ✅ Deve ver: "Login realizado com sucesso!"');
console.log('5. ✅ Deve ser redirecionado para /home');

// --------------------------------------------
// 4. TESTAR LOGIN COM GOOGLE
// --------------------------------------------
console.log('\n4️⃣ Testar Login com Google');
console.log('1. Acesse: http://localhost:5173/login');
console.log('2. Clique no botão do Google (ícone colorido)');
console.log('3. Selecione sua conta Google no popup');
console.log('4. ✅ Deve ver: "Login com Google realizado com sucesso!"');
console.log('5. ✅ Deve ser redirecionado para /home');
console.log('6. ✅ Verifique no backend se o usuário foi criado');

// --------------------------------------------
// 5. TESTAR PERSISTÊNCIA DE SESSÃO
// --------------------------------------------
console.log('\n5️⃣ Testar Persistência');
console.log('1. Faça login (email ou Google)');
console.log('2. Feche o navegador completamente');
console.log('3. Abra novamente e acesse: http://localhost:5173');
console.log('4. ✅ Deve ir direto para /home (sem pedir login)');

// --------------------------------------------
// 6. VERIFICAR TOKEN NO LOCALSTORAGE
// --------------------------------------------
console.log('\n6️⃣ Verificar Token');
console.log('No console do navegador, digite:');
console.log('localStorage.getItem("app_auth")');
console.log('✅ Deve retornar: { token, user, expiresAt }');

// --------------------------------------------
// 7. TESTAR LOGOUT
// --------------------------------------------
console.log('\n7️⃣ Testar Logout');
console.log('1. Estando logado, clique em "Sair" no navbar');
console.log('2. ✅ Deve ser redirecionado para /login');
console.log('3. ✅ Tente acessar /home - deve redirecionar para /login');
console.log('4. No console: localStorage.getItem("app_auth")');
console.log('5. ✅ Deve retornar: null');

// --------------------------------------------
// 8. TESTAR MENSAGENS DE ERRO
// --------------------------------------------
console.log('\n8️⃣ Testar Mensagens de Erro');
console.log('A. Registro com email já existente:');
console.log('   - Tente criar conta com email já cadastrado');
console.log('   - ✅ Deve mostrar: "Este e-mail já está em uso."');
console.log('\nB. Login com credenciais inválidas:');
console.log('   - Tente fazer login com senha errada');
console.log('   - ✅ Deve mostrar: "Credenciais inválidas."');
console.log('\nC. Senha fraca:');
console.log('   - Tente criar conta com senha < 6 caracteres');
console.log('   - ✅ Deve mostrar: "A senha é muito fraca..."');

// --------------------------------------------
// 9. TESTAR INTEGRAÇÃO COM BACKEND
// --------------------------------------------
console.log('\n9️⃣ Testar Backend');
console.log('1. Certifique-se que o backend está rodando');
console.log('2. Faça um registro ou login com Google');
console.log('3. No backend, verifique os logs');
console.log('4. ✅ Deve ver: POST /user-register ou /user-register-by-google');
console.log('5. No banco de dados (Prisma), verifique:');
console.log('   - ✅ Usuário foi criado com name e email corretos');

// --------------------------------------------
// 10. TESTAR REFRESH TOKEN AUTOMÁTICO
// --------------------------------------------
console.log('\n🔟 Testar Refresh Token');
console.log('1. Faça login');
console.log('2. No console, expire o token manualmente:');
console.log('   const auth = JSON.parse(localStorage.getItem("app_auth"))');
console.log('   auth.expiresAt = new Date(Date.now() - 1000).toISOString()');
console.log('   localStorage.setItem("app_auth", JSON.stringify(auth))');
console.log('3. Faça uma requisição à API (navegue para outra página)');
console.log('4. ✅ Token deve ser renovado automaticamente');
console.log('5. ✅ Requisição deve funcionar normalmente');

// --------------------------------------------
// ✅ CHECKLIST FINAL
// --------------------------------------------
console.log('\n✅ CHECKLIST FINAL:');
console.log('□ Firebase instalado (npm install firebase)');
console.log('□ Arquivo .env configurado com credenciais Firebase');
console.log('□ Projeto Firebase criado no console');
console.log('□ Authentication habilitado (Email/Password e Google)');
console.log('□ Backend rodando (porta 3001)');
console.log('□ Frontend rodando (porta 5173)');
console.log('□ Registro com email funciona');
console.log('□ Login com email funciona');
console.log('□ Login com Google funciona');
console.log('□ Logout funciona');
console.log('□ Persistência de sessão funciona');
console.log('□ Usuários são criados no backend');
console.log('□ Mensagens de erro aparecem em português');
console.log('□ Refresh token automático funciona');

// --------------------------------------------
// 🐛 TROUBLESHOOTING
// --------------------------------------------
console.log('\n🐛 PROBLEMAS COMUNS:');
console.log('\n❌ "Firebase: Error (auth/configuration-not-found)"');
console.log('   → Verifique o arquivo .env');
console.log('   → Certifique-se que todas as variáveis VITE_FIREBASE_* estão definidas');
console.log('\n❌ "Firebase: Error (auth/unauthorized-domain)"');
console.log('   → No Firebase Console → Authentication → Settings');
console.log('   → Adicione "localhost" nos Authorized domains');
console.log('\n❌ "Network Error" ao fazer login');
console.log('   → Verifique se o backend está rodando');
console.log('   → Verifique VITE_API_BASE_URL no .env');
console.log('\n❌ Popup do Google não abre');
console.log('   → Desabilite bloqueadores de popup');
console.log('   → Certifique-se que o Google OAuth está habilitado no Firebase');
console.log('\n❌ Usuário não é criado no backend');
console.log('   → Verifique logs do backend');
console.log('   → Verifique se o Prisma está configurado corretamente');
console.log('   → Verifique se o banco de dados está rodando');

console.log('\n🎉 Boa sorte nos testes!');
