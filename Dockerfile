# Utilise une image Node légère
FROM node:20-alpine

# Crée le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json (s’il existe)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source dans le conteneur
COPY . .

# Expose le port sur lequel ton serveur écoute (à adapter si besoin)
EXPOSE 3000

# Démarre le serveur
CMD ["node", "server.js"]