FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências incluindo swagger-jsdoc
RUN npm install

# Gerar Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copiar o restante do código
COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]