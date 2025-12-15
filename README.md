# Messagerie Temps Réel

Application de chat en temps réel développée avec React et Netlify Functions.

## Description

Une application web de messagerie permettant aux utilisateurs de créer un compte et d'échanger des messages en temps réel. Les messages sont actualisés automatiquement toutes les 3 secondes.

## Fonctionnalités

- Création d'utilisateurs avec nom et email
- Envoi et réception de messages
- Actualisation automatique des conversations
- Interface responsive et moderne
- Fonction administrateur pour vider le chat

## Technologies

**Frontend**
- React avec TypeScript
- Vite pour le build
- Déployé sur Vercel

**Backend**
- Netlify Functions
- TypeScript
- APIs REST

## URLs

- Application : https://messagerie-temps-reel.vercel.app
- Backend : https://messagerie-backend.netlify.app

## Installation locale

### Prérequis
- Node.js 18+
- npm

### Frontend
```
git clone https://github.com/BertrandM22/messagerie-temps-reel.git
cd messagerie-temps-reel/client
npm install
npm run dev
```

### Backend
```
cd messagerie-temps-reel/server
npm install
netlify dev
```

## APIs

- GET /api/users - Liste des utilisateurs
- POST /api/users - Créer un utilisateur
- GET /api/messages - Liste des messages
- POST /api/messages - Envoyer un message
- DELETE /api/messages/clear - Vider le chat (admin)

## Configuration

Créer un fichier `.env.development` dans le dossier client :
```
VITE_API_URL=http://localhost:8888
```

Pour la production, l'URL est configurée automatiquement.

## Déploiement

Le projet est automatiquement déployé via GitHub Actions :
- Frontend : Vercel
- Backend : Netlify

## Utilisation

1. Accéder à l'application web
2. Créer un utilisateur avec nom et email
3. Envoyer des messages dans le chat
4. Les messages s'actualisent automatiquement

## Administration

Pour vider le chat, cliquer sur le bouton "Vider le chat" et entrer le code administrateur.
- Node.js 
- npm

### Installation du projet

Clonez le repository et installez les dépendances :

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```
cd client
npm install
```

## Lancement de l'application

### Développement

Ouvrez deux terminaux et lancez simultanément :

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:3001

### Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## Structure du projet

```
messagerie-fullstack/
├── client/                 # Application React
│   ├── src/
│   │   ├── App.tsx        # Composant principal
│   │   └── main.tsx       # Point d'entrée
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Serveur Node.js
│   ├── src/
│   │   └── index.ts       # Serveur Express + Socket.io
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Endpoints

### Utilisateurs
- `GET /api/users` - Récupère tous les utilisateurs
- `GET /api/users/:id` - Récupère un utilisateur spécifique
- `POST /api/users` - Crée un nouvel utilisateur

### Messages
- `GET /api/messages` - Récupère tous les messages
- `POST /api/messages` - Envoie un nouveau message

### Santé de l'API
- `GET /api/health` - Vérifie le statut du serveur
- `GET /` - Page d'accueil de l'API

## Utilisation

1. Ouvrez l'application dans votre navigateur
2. Créez un nouvel utilisateur en renseignant votre nom et email
3. Commencez à envoyer des messages
4. Ouvrez plusieurs onglets pour tester la communication en temps réel

## Configuration

Les variables d'environnement peuvent être configurées dans un fichier `.env` :

```env
PORT=3001
```

## Développement

### Scripts disponibles

**Frontend:**
- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile pour la production
- `npm run preview` - Prévisualise la version de production

**Backend:**
- `npm run dev` - Lance le serveur en mode développement avec    rechargement automatique
- `npm run build` - Compile le TypeScript
- `npm start` - Lance le serveur en mode production

## Contribution

Ce projet a été développé dans un cadre d'apprentissage. Les contributions et suggestions sont les bienvenues pour améliorer les fonctionnalités et la performance.

## A rajouter

- [ ] Authentification des utilisateurs
- [ ] Salles de chat privées
- [ ] Émojis et réactions
- [ ] Notifications push
- [ ] Historique des messages persistant
- [ ] Indicateurs de présence (en ligne/hors ligne)
- [ ] Upload de fichiers/images

##  Notes Techniques

- **Port Backend** : 3000 (configurable via variable d'environnement PORT)
- **Port Frontend** : 5173 (Vite par défaut)
- **Base de données** : En mémoire (arrays JavaScript)
- **CORS** : Configuré pour accepter toutes les origines



