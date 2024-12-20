# Use uma imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json para o container
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia o restante dos arquivos do projeto para o container
COPY . .

# Expõe a porta 3000 para o backend
EXPOSE 5500

# Comando padrão para rodar sua aplicação
CMD ["npm", "start"]
