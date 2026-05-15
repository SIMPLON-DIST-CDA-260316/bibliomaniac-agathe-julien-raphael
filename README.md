# Bibliomaniac

> Application web de bibliothèque numérique permettant de rechercher des livres via l'API Google Books, consulter leurs
> informations et explorer un catalogue sur mobile comme sur desktop.

<!-- BADGES -->
<!-- ![Vercel](https://img.shields.io/badge/deployed-vercel-black) -->
<!-- ![License](https://img.shields.io/badge/license-TODO-blue) -->

## 🔗 Liens

- **Application déployée :** _(à venir)_
- **Maquettes Figma :**
  - [Biblionet — Copy (maquette de travail)](https://www.figma.com/design/VwfTGOrHoNmOD6LkchKVlv/Biblionet--Copy-?m=auto&t=tc6IsPy79cSPB11I-6) — copie éditable de Biblionet, augmentée par notre équipe. **Référence d'implémentation de cette codebase.**
  - [Biblionet (source, lecture seule)](https://www.figma.com/design/7RWuX61fj65aoS3PYMFm5U/Biblionet?m=auto&t=tc6IsPy79cSPB11I-6) — prototype J1 produit par un autre groupe, que nous avons implémenté.
  - [Bibliomaniac — prototype J1](https://www.figma.com/design/CKURoX0LSGmfm2ionc9e5X/Bibliomaniac?m=auto&t=tc6IsPy79cSPB11I-6) — prototype J1 produit par notre équipe (Agathe, Julien, Raphaël). Non implémenté ici ; un autre groupe l'a récupéré pour son projet.
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

- **Framework :** React 19 + Vite 8
- **Langage :** TypeScript
- **Styling :** Tailwind CSS v4
- **Routing :** React Router v7
- **UI :** Radix UI, shadcn/ui, Embla Carousel
- **API :** Open Library (proxy Express local, port `3001`)
- **Qualité :** ESLint + Prettier + Husky + Commitlint + lint-staged
- **Déploiement :** Vercel _(à venir)_

## 📦 Prérequis

- Node.js >= 20
- npm (le dépôt fournit un `package-lock.json`)

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/SIMPLON-DIST-CDA-260316/bibliomaniac-agathe-julien-raphael.git
cd bibliomaniac-agathe-julien-raphael

# Installer les dépendances
npm install
```

## ⚙️ Variables d'environnement

Aucune variable d'environnement requise pour le moment : le front interroge le proxy Express local (`server.mjs`), qui requête Open Library sans clé d'API.

Un fichier `.env.example` est présent pour servir de gabarit lorsque des variables seront introduites — copier alors `cp .env.example .env.local` puis renseigner les valeurs.

## 💻 Lancement en local

```bash
# Démarre simultanément le proxy API (port 3001) et le serveur Vite (port 5173)
npm run dev
```

- Front Vite : http://localhost:5173
- Proxy API : http://localhost:3001/books?q=science+fiction&limit=10

Pour ne lancer que le proxy ou que le front :

```bash
npm run server   # uniquement le proxy Express
npx vite         # uniquement le front Vite
```

## 📜 Scripts disponibles

| Script               | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | Lance le proxy Express et le serveur Vite en parallèle       |
| `npm run server`     | Lance uniquement le proxy Express (port 3001)                |
| `npm run build`      | Build de production (`tsc -b && vite build`)                 |
| `npm run preview`    | Prévisualise le build de production                          |
| `npm run lint`       | Vérifie le formatage Prettier et exécute ESLint              |
| `npm run lint:fix`   | Alias de `format` : applique Prettier puis `eslint --fix`    |
| `npm run format`     | Formate le code (`prettier --write` + `eslint --fix`)        |
| `npm run type-check` | Vérifie les types TypeScript sans émettre de build           |
| `npm run validate`   | Combine `lint` + `type-check` (utile en pré-PR)              |

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

## 🌿 Git & Commits

### Conventions de commit

Ce projet utilise les **Conventional Commits** validés automatiquement par Husky et Commitlint.

Format obligatoire :

```
<type>(<scope>): <sujet>

<corps optionnel>

<pied de page optionnel>
```

**Types autorisés :** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`

**Exemples :**

```bash
git commit -m "feat(search): ajouter support recherche ISBN"
git commit -m "fix(navbar): corriger lien actif"
git commit -m "docs: mettre à jour README"
git commit -m "chore(deps): mettre à jour tailwindcss"
```

### Hooks Git automatiques

- **Pre-commit :** Exécute Prettier et ESLint sur les fichiers modifiés
- **Commit-msg :** Valide que votre message respecte Conventional Commits

## 🚢 Déploiement

> ⏳ **À venir.** Le projet n'est pas encore déployé. Cible prévue : Vercel (déploiement automatique sur push `main`). Les instructions seront ajoutées ici une fois la cible configurée.

## 📄 Licence

<!-- TODO: MIT / autre -->
