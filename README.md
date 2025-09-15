# EstudAI - Full-Stack Template

O EstudAI é uma plataforma web que ajuda estudantes a organizar seus estudos e potencializar o aprendizado por meio de inteligência artificial.

## Arquitetura

Este projeto usa uma arquitetura Full-Stack com:

- **Backend**: Node.js + Express (Porta 3001)
- **Frontend**: React + Vite (Porta 3000)
- **Docker**: Containerização com Docker Compose

## Estrutura do Projeto

```
EstudAI/
├── backend/
│   ├── src/
│   │   └── server.js      # Servidor Express
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   └── App.jsx        # Componente principal React
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml     # Orquestração dos serviços
└── README.md
```

## Como executar

### Opção 1: Com Docker Compose (Recomendado)

1. Certifique-se de ter Docker e Docker Compose instalados
2. Execute o comando:
   ```bash
   docker-compose up --build
   ```
3. Acesse as aplicações:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Opção 2: Executar localmente

#### Backend
```bash
cd backend
npm install
npm start
# Servidor rodará na porta 3001
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Aplicação rodará na porta 3000
```

## API Endpoints

### GET /api/health
Endpoint para verificar o status do servidor.

**Resposta:**
```json
{
  "status": "ok"
}
```

## Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - CORS

- **Frontend:**
  - React 18
  - Vite
  - JavaScript/JSX

- **DevOps:**
  - Docker
  - Docker Compose

## Scripts Disponíveis

### Backend
- `npm start` - Executa o servidor em modo produção
- `npm run dev` - Executa o servidor com nodemon (modo desenvolvimento)

### Frontend
- `npm run dev` - Executa o aplicativo em modo desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run preview` - Visualiza a aplicação buildada

## Desenvolvimento

O frontend faz uma requisição para o endpoint `/api/health` do backend e exibe o status da conexão na interface. Isso demonstra a comunicação completa entre as duas aplicações.
