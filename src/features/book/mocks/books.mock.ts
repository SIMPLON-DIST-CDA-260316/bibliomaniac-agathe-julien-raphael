import type { Book } from '../model/book.types'

export const MOCK_BOOKS_BY_ID: Record<string, Book> = {
  '1': {
    id: '1',
    title: '20th Century Boys - Tome 1',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Shonen',
    publishedDate: '2002',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 418,
    rating: 4.7,
    copies: 2,
    stats: [
      { label: 'Exemplaires', value: 2 },
      { label: 'Pages', value: 418 },
      { label: 'Note', value: 4.7 },
    ],
    summary:
      "Kenji est un commerçant tranquille qui a repris et transformé le magasin familial. Son seul problème est Kana, la fille de sa sœur, que cette dernière lui a confiée avant de partir. Mais voilà qu'un jour, la police vient l'interroger sur un de ses anciens camarades de classe porté disparu...",
  },
  '2': {
    id: '2',
    title: 'Le Petit Livre',
    author: 'Auteur Inconnu',
    authorId: null,
    genre: 'Roman',
    publishedDate: '2020',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 80,
    rating: 3.2,
    copies: 1,
    stats: [
      { label: 'Exemplaires', value: 1 },
      { label: 'Pages', value: 80 },
      { label: 'Note', value: 3.2 },
    ],
    summary: 'Un court récit qui tient en une seule phrase.',
  },
  '3': {
    id: '3',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    authorId: 'victor-hugo',
    genre: 'Roman historique',
    publishedDate: '1862',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 1900,
    rating: 4.9,
    copies: 5,
    stats: [
      { label: 'Exemplaires', value: 5 },
      { label: 'Pages', value: 1900 },
      { label: 'Note', value: 4.9 },
    ],
    summary:
      "Au début du XIXᵉ siècle, Jean Valjean, ancien forçat libéré après dix-neuf ans de bagne pour le vol d'un pain, peine à trouver sa place dans une société qui le rejette. Recueilli par l'évêque Myriel, dont la bonté le bouleverse, il choisit la voie de la rédemption sous une nouvelle identité, Monsieur Madeleine, et devient maire d'une petite ville où sa générosité change le destin de Fantine, ouvrière déchue contrainte à la prostitution pour nourrir sa fille Cosette. Lorsque Fantine meurt, Valjean reprend la fuite, hanté par l'inspecteur Javert, incarnation rigide de la loi, et arrache Cosette aux Thénardier, aubergistes cupides qui l'exploitaient. À Paris, Valjean élève Cosette dans la discrétion, jusqu'au jour où l'adolescente croise Marius, jeune républicain idéaliste lié aux Amis de l'ABC, un groupe d'étudiants insurgés. Le récit culmine sur les barricades du soulèvement de juin 1832, où Valjean sauve la vie de Marius et épargne celle de Javert, qui, incapable de réconcilier sa conscience avec sa loi, choisit la mort. Roman-fresque, méditation sur la justice, la misère, l'éducation et la conscience, Les Misérables suit aussi des destins secondaires — Gavroche, Éponine, Mgr Myriel — pour composer une vaste épopée de l'âme humaine, où la rédemption d'un seul homme éclaire les douleurs et les espoirs de tout un peuple. Hugo y mêle digressions philosophiques, fresques historiques (Waterloo, les égouts de Paris, le couvent du Petit-Picpus) et plaidoyer politique, faisant du roman un manifeste contre l'injustice sociale autant qu'une vaste cathédrale romanesque.",
  },
}
