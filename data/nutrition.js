// ===== Journal nutrition =====
//
// Source de vérité du suivi nutrition quotidien. Alimenté par /maj repas
// quand Seb dicte ce qu'il a mangé — jamais de saisie directe sur la page.
//
// p/g/l/f/s = protéines/glucides/lipides/fibres/sel, en grammes ; w = eau, en
// litres ; cafe/alcool = nombre de cafés / verres d'alcool — tous par repas
// (un café ou un verre d'eau sont des « repas » comme un autre, juste avec
// les autres champs à 0). NUTRITION_TARGETS donne la fourchette du jour (min
// et/ou max, l'un des deux peut être absent), capBasis = ce que représente
// un cercle plein sur les jauges (un peu de marge au-delà du plafond, ou du
// plancher sans plafond), et des exemples d'aliments concrets pour les
// propositions de repas — jamais de catégorie vague comme « fruits » ou
// « légumineuses » seules. overAdvice/nearAdvice/fineAdvice ne servent
// qu'aux nutriments à plafond seul (sel, café, alcool) : phrase affichée
// selon que la valeur du jour dépasse, approche (≥80 %) ou reste sous le
// plafond.

const NUTRITION_TARGETS = {
  p: {
    label: 'Protéines', unit: 'g', min: 97, max: 119, capBasis: 137,
    sources: 'œuf, fromage blanc, steak, poulet, poisson'
  },
  g: {
    label: 'Glucides', unit: 'g', min: 216, max: 264, capBasis: 304,
    sources: 'riz, pâtes, pain complet, lentilles, raisin, banane'
  },
  l: {
    label: 'Lipides', unit: 'g', min: 63, max: 77, capBasis: 89,
    sources: "huile d'olive, avocat, amandes, noix"
  },
  f: {
    label: 'Fibres', unit: 'g', min: 25, max: null, capBasis: 40,
    sources: "lentilles, brocolis, pomme, flocons d'avoine"
  },
  s: {
    label: 'Sel', unit: 'g', min: null, max: 5, capBasis: 6.5, sources: null,
    overAdvice: 'dépasse déjà le plafond du jour — évite les plats préparés et la charcuterie ce soir.',
    nearAdvice: 'approche du plafond — reste léger ce soir.',
    fineAdvice: 'a de la marge — pas besoin d\'y penser ce soir.'
  },
  w: {
    label: 'Eau', unit: 'L', min: 2, max: null, capBasis: 3, sources: null
  },
  cafe: {
    label: 'Café', unit: '×', min: null, max: 2, capBasis: 3, sources: null,
    overAdvice: 'trop de café aujourd\'hui — passe à la déca ou à la tisane pour la suite.',
    nearAdvice: 'dernier café autorisé bientôt atteint — un dernier avant de passer à la déca.',
    fineAdvice: 'encore de la marge.'
  },
  alcool: {
    label: 'Alcool', unit: '×', min: null, max: 0, capBasis: 2, sources: null,
    overAdvice: 'objectif zéro dépassé aujourd\'hui — pas de deuxième verre.',
    nearAdvice: 'objectif zéro dépassé aujourd\'hui — pas de deuxième verre.',
    fineAdvice: 'aucun alcool aujourd\'hui, comme prévu.'
  }
};

// Propositions de repas concrets par paire de nutriments les plus en retard
// (clé = les deux lettres triées, séparées par une virgule) — plus parlant
// qu'une simple liste d'aliments quand deux manquent à la fois.
const NUTRITION_PAIR_MEALS = {
  'g,p': 'Poulet grillé et riz complet, avec une portion généreuse de riz.',
  'l,p': "Pavé de saumon en papillote, filet d'huile d'olive sur les légumes.",
  'f,p': 'Dahl de lentilles corail avec un filet de cabillaud et épinards.',
  'g,l': 'Pâtes complètes, avocat en tranches et copeaux de parmesan.',
  'f,g': 'Bol de quinoa, pois chiches et légumes rôtis.',
  'f,l': 'Salade de pois chiches, avocat et poignée d\'amandes.'
};

const NUTRITION_LOG = {
  maj: '2026-09-29',
  jours: [
    { date: '2026-09-29', repas: [
      { when: 'Petit-déj', what: '4 madeleines, eau chaude au miel et citron', p: 8, g: 84, l: 29, f: 2, s: 0.7, w: 0.25, cafe: 0, alcool: 0 },
      { when: 'Midi', what: 'Filet de bar, risotto', p: 36, g: 55, l: 13, f: 1, s: 1.8, w: 0, cafe: 0, alcool: 0 },
      { when: 'Encas', what: 'Deux poignées d\'amandes', p: 13, g: 13, l: 30, f: 7, s: 0, w: 0, cafe: 0, alcool: 0 },
      { when: 'Soir', what: 'Poulet pané, fromage blanc 0% sucré', p: 36, g: 26, l: 10, f: 1, s: 1.15, w: 0, cafe: 0, alcool: 0 },
      { when: 'Soir', what: 'Un demi de bière', p: 0, g: 10, l: 0, f: 0, s: 0, w: 0, cafe: 0, alcool: 1 }
    ] }
  ]
};
