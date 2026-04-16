# Bibliomaniac

> Application web de bibliothèque numérique permettant de rechercher des livres via l'API Google Books, consulter leurs informations et explorer un catalogue sur mobile comme sur desktop.

<!-- BADGES -->
<!-- ![Vercel](https://img.shields.io/badge/deployed-vercel-black) -->
<!-- ![License](https://img.shields.io/badge/license-TODO-blue) -->

## 🔗 Liens

- **Application déployée :** <!-- TODO: https://... -->
- **Maquettes Figma :** [Biblionet](https://www.figma.com/design/7RWuX61fj65aoS3PYMFm5U/Biblionet?node-id=0-1&p=f&t=BBf0EqrpcApm1lYP-0)
- **Prototype cliquable :** <!-- TODO: https://figma.com/proto/... -->
- **GitHub Project :** <!-- TODO: https://github.com/orgs/.../projects/... -->

## 👥 Équipe

- **Agathe** — <!-- TODO: rôle / GitHub -->
- **Julien** — <!-- TODO: rôle / GitHub -->
- **Raphaël** — <!-- TODO: rôle / GitHub -->

## ✨ Fonctionnalités

- 🔍 Recherche de livres par titre, auteur ou ISBN
- 📚 Liste de résultats paginée
- 📖 Fiche détaillée par livre
- 📱 Interface responsive (mobile first)
- ♿ Accessibilité prise en compte
- ⏳ Gestion des états : chargement, erreur, absence de résultat, données manquantes

## 🛠️ Stack technique

- **Framework :** React + <!-- TODO: Vite / Next.js -->
- **Langage :** TypeScript
- **Styling :** Tailwind CSS
- **API :** Google Books API
- **Qualité :** ESLint + Prettier <!-- + Lefthook -->
- **Déploiement :** Vercel

## 📦 Prérequis

- Node.js >= <!-- TODO: version -->
- <!-- TODO: gestionnaire de paquets : npm / pnpm / yarn -->
- Un compte Google Books API (clé API)

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/<!-- TODO: org/repo -->.git
cd bibliomaniac-agathe-julien-raphael

# Installer les dépendances
<!-- TODO: npm install -->

# Copier le fichier d'environnement
cp .env.example .env.local
```

## ⚙️ Variables d'environnement

Renseigner les variables suivantes dans `.env.local` :

```env
<!-- TODO: VITE_GOOGLE_BOOKS_API_KEY=your_api_key_here -->
```

## 💻 Lancement en local

```bash
# Démarrer le serveur de développement
<!-- TODO: npm run dev -->
```

L'application sera disponible sur <!-- TODO: http://localhost:5173 -->

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `<!-- TODO: dev -->` | Lance le serveur de développement |
| `<!-- TODO: build -->` | Build de production |
| `<!-- TODO: preview -->` | Prévisualise le build de production |
| `<!-- TODO: lint -->` | Vérifie le code avec ESLint |
| `<!-- TODO: format -->` | Formate le code avec Prettier |

## 🏗️ Structure du projet

```
<!-- TODO: arborescence du projet -->
src/
├── components/
├── pages/
├── hooks/
├── services/
└── ...
```

## 🌿 Workflow Git

- **Branche principale :** `main`
- **Branches de fonctionnalité :** `feat/nom-feature`, `fix/nom-bug`, etc.
- **Commits :** [Conventional Commits](https://www.conventionalcommits.org/)
- **Pull requests** obligatoires pour toute évolution importante

Exemples de commits :

```
feat(search): add ISBN search support
fix(book-detail): handle missing thumbnail
chore(deps): update tailwindcss to v4
```

## 🚢 Déploiement

Le projet est déployé automatiquement sur Vercel à chaque push sur `main`.

<!-- TODO: instructions de déploiement manuel si nécessaire -->

```bash
<!-- TODO: vercel --prod -->
```

## 📄 Licence

<!-- TODO: MIT / autre -->
