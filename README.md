# 📡 KiVaOu - Backend

API REST du projet **KiVaOu**, une application communautaire permettant aux utilisateurs de créer, gérer et participer à des sorties au sein de leur communauté.

Ce backend gère l’authentification, les sessions, la gestion des utilisateurs, des lieux, des événements et des rôles (admin, chef de communauté, utilisateur).

---

## 🚀 Technologies utilisées

- **Node.js** : environnement JavaScript côté serveur.
- **Express.js** : framework léger pour la création d’API web.
- **express-session** : gestion des sessions utilisateurs côté serveur.
- **JWT (jsonwebtoken)** : gestion d’authentification sécurisée via token.
- **Bcrypt** : hachage des mots de passe pour la sécurité des utilisateurs.
- **PostgreSQL** : base de données relationnelle robuste et performante.
- **CORS** : pour permettre les appels sécurisés depuis le frontend.

---

## 📦 Installation

Il vous faudra installer PostgresSQL sur Docker ou sur la machine cible au préalable 

```bash
git clone https://github.com/Deuli-P/kivaou-backend.git

cd kivaou-backend

npm install

npm i

npm start

```
--- 

## 🔗 Liens vers les documentations

[📘 NodeJS](https://nodejs.org/docs/latest/api/)

[🧩 Express.js](https://expressjs.com/)

[🔐 express-session](https://www.npmjs.com/package/express-session)

[🪪 jsonwebtoken](https://jwt.io/introduction)

[🧂 Bcrypt](https://www.npmjs.com/package/bcrypt)

[🛢️ PostgreSQ](https://www.postgresql.org/)

[🌐 CORS](https://expressjs.com/en/resources/middleware/cors.html)

---

## 🔐 Sécurité & Authentification

- Les mots de passe sont hachés à l’aide de Bcrypt, garantissant leur protection en cas de fuite de données.
-	Des sessions sont gérées côté serveur via express-session.
-	Des middlewares sont mis en place pour encadré l'utilisation de la plateforme pour chaque type d'utilisateur.
  
---

## 🧭 Frontend

Ce projet backend communique avec une frontend développé en React.js , ViteJs, Typescript et SASS.
🔗 Retrouvez le dépôt frontend [GitHub - kivaou-frontend](https://github.com/Deuli-P/kivaou-frontend)

--- 

## Auteur 

**Pierre Antoniutti**

_pierre.antoniutti@gmail.com_
