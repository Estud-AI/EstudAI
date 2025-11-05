FROM node:20-alpine

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci --legacy-peer-deps || npm install

# Copiar o restante do código
COPY . .

EXPOSE 3000

# Variável de ambiente para o Vite
ENV HOST=0.0.0.0
ENV PORT=3000

# Rodar vite em modo watch
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 3000"]