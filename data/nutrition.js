// ===== Journal nutrition =====
//
// Source de vérité du suivi nutrition quotidien. Alimenté par /maj repas
// quand Seb dicte ce qu'il a mangé — jamais de saisie directe sur la page.
//
// p/g/l/f/s = protéines/glucides/lipides/fibres/sel, en grammes, par repas.
// NUTRITION_TARGETS donne la fourchette du jour (min et/ou max, l'un des
// deux peut être absent), capBasis = ce que représente un cercle plein sur
// les jauges (un peu de marge au-delà du plafond, ou du plancher sans
// plafond), et des exemples d'aliments concrets pour les propositions de
// repas — jamais de catégorie vague comme « fruits » ou « légumineuses »
// seules.

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
    label: 'Sel', unit: 'g', min: null, max: 5, capBasis: 6.5,
    sources: null
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
  maj: '2026-09-28',
  jours: [
    // { date: '2026-09-28', repas: [ { when: '12:30', what: 'Poulet, riz, légumes vapeur', p: 38, g: 62, l: 20, f: 4, s: 1.1 } ] }
    // Vide pour l'instant — se remplit au fil des /maj repas.
  ]
};
