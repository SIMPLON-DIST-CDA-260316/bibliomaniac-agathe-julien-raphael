# Priorisation rendu — vendredi 2026-05-15

> Analyse rédigée le mercredi 2026-05-13, après merge de la PR #53 (issue #32 — UI BookCTA + Drawer).

## Contexte temps

- Aujourd'hui (mercredi) : reste demi-journée dev
- Jeudi : férié (Ascension)
- Vendredi : rendu (~½ journée tampon)

Soit **~1 jour effectif**. Projet pédagogique → démo qui marche > features bâclées.

## Recommandation priorisée

### Tier 1 — quick wins UI haute valeur

1. **#42 UI carrousels livres liés**
   La fiche livre a actuellement 3 placeholders `bg-primary/20 h-48` qui font "page inachevée". Les composants `BookCarousel` et `BookCard` ont déjà été créés en PR #50. Il reste à les assembler avec des données mockées.
   - **Coût** : ~1h
   - **Gain** : énorme visuellement, la fiche livre cesse de paraître inachevée
   - **Dépendance** : aucune, tout est en place

2. **#34 UI bookmark + Drawer multi-listes**
   Réutilise l'infrastructure Drawer + le hook `useInertWhileDrawerOpen` posés dans la PR #53. Valide notre infra a11y sur un deuxième cas. Le `BookmarkButton` existe déjà en placeholder sur la fiche livre.
   - **Coût** : ~2-3h
   - **Gain** : feature visible + démonstration de réutilisation de l'infra

3. **#36 UI toggle lu/non-lu**
   Petit switch shadcn ajouté à la fiche livre. Ajoute de la richesse fonctionnelle perçue.
   - **Coût** : ~1h
   - **Gain** : polish + signal "app aboutie"

### Tier 2 — bonus si le temps reste

- **#40 UI cloche notification** — ~30 min, complète l'US6 visuellement.
- **#23 Bibliothèque journal mensuel** — gros chantier mais belle visualisation si on veut impressionner.

### Tier 3 — à ÉVITER pour le rendu

- **Toutes les Logic issues** (#31, #33, #35, #37, #39, #41, #43) — nécessitent un backend ou un mocking lourd, peu rentables côté démo.
- **#38 UI calendrier réservation** — couplé à #33 logic, complexe.

## Plan suggéré

| Quand | Quoi | Pourquoi |
|-------|------|----------|
| Mercredi PM | **#42** carrousels livres liés | Quick win, fiche livre devient "finie" visuellement |
| Vendredi AM | **#34** bookmark Drawer multi-listes | Valide réutilisation infra Drawer + a11y |
| Vendredi midi | **#36** toggle lu/non-lu | Polish final |
| Si temps | **#40** cloche notification | Bonus US6 |

## Principe directeur

Présenter une fiche livre **complètement habitée** + 2-3 features connexes lisibles est plus impressionnant pour la démo qu'une seule feature parfaitement implémentée bout-en-bout avec un backend, à côté d'écrans vides.

L'infrastructure posée jusqu'ici (Drawer + focus trap + types discriminés + sandbox dev) supporte naturellement les 3 features Tier 1 sans nouveau travail d'archi.

## État d'avancement à date

**Mergé :**
- PR #50 — fiche livre UI complète avec mock data
- PR #53 — CTA contextuel 6 variantes + Drawer confirmation réservation (US2 #32)

**Restant côté UI parent :**
- US3 #13 (bookmark) → sous-issue UI #34
- US4 #14 (lu/non-lu) → sous-issue UI #36
- US6 #15 (cloche) → sous-issue UI #40
- US7 #16 (livres liés) → sous-issue UI #42

**Backend / Logic : laissé hors scope rendu** — toutes les issues `phase:logic` (#31, #33, #35, #37, #39, #41, #43, #47) nécessitent une intégration backend qui n'est pas prête.
