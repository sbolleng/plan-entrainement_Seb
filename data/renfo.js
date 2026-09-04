// ===== Journal des séances de renforcement =====
//
// Source de vérité de l'historique renfo. Alimenté par deux canaux :
//   - le parsing des séances Hevy remontées sur Strava (source: "hevy")
//   - la commande /maj seance quand Seb dicte une séance (source: "dicté")
//
// dom : F = cuisses/force · S = stabilité/fessiers · A = abdos/tronc · H = haut du corps
// charge en kg, 0 = poids du corps. duree en minutes.
// Pour une séance au temps (gainage), reps = secondes et tenue = true.

const RENFO_LOG = {
  maj: '2026-09-04',
  seances: [
    // --- Séances de kinésithérapie du sport (cabinet) ---
    // Comptées comme des séances de renfo : c'est du travail encadré sur le
    // genou et la cheville. Le détail des exercices n'est pas connu, donc
    // exercices reste vide — elles comptent dans le nombre de séances mais
    // n'ajoutent aucun tonnage, faute de charge mesurée.
    { date: '2026-07-07', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-07-09', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-07-16', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-07-20', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-07-24', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-07-28', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-07-30', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-08-04', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-08-07', source: 'kiné', duree: null, exercices: [] },
    {
      date: '2026-07-26', source: 'hevy', duree: 43,
      exercices: [
        { nom: 'Élévation latérale jambe lestée', dom: 'S', series: 4, reps: 25, charge: 1 },
        { nom: 'Kettlebell around the world', dom: 'S', series: 4, reps: 40, charge: 10 }
      ]
    },
    {
      date: '2026-07-30', source: 'hevy', duree: 1, incomplete: true,
      exercices: [
        { nom: 'Calf press', dom: 'F', series: 1, reps: 10, charge: 25 },
        { nom: 'Step up haltères', dom: 'F', series: 1, reps: 10, charge: 12 }
      ]
    },
    {
      date: '2026-08-01', source: 'hevy', duree: 34,
      exercices: [
        { nom: 'Kettlebell around the world', dom: 'S', series: 4, reps: 40, charge: 10 },
        { nom: 'Élévation latérale jambe lestée', dom: 'S', series: 4, reps: 30, charge: 1 },
        { nom: 'Fentes haltères', dom: 'F', series: 4, reps: 12, charge: 20 }
      ]
    },
    {
      date: '2026-08-08', source: 'dicté', duree: 30,
      exercices: [
        { nom: 'Kettlebell around the world', dom: 'S', series: 3, reps: 20, charge: 10 },
        { nom: 'Gainage sur une jambe', dom: 'A', series: 1, reps: 30, charge: 0, tenue: true },
        { nom: 'Russian twist kettlebell', dom: 'A', series: 3, reps: 20, charge: 10 },
        { nom: 'Pompes', dom: 'H', series: 3, reps: 13, charge: 0 },
        { nom: 'Kettlebell swing 2 mains', dom: 'F', series: 3, reps: 15, charge: 10 }
      ]
    },
    {
      // Bloc de reprise, jour 1. Hevy indique 4:30 de moving_time, très
      // probablement sous-évalué (ne compte pas les temps de repos entre
      // séries) au vu du nombre d'exercices : durée réelle non fiable.
      date: '2026-08-23', source: 'hevy', duree: null,
      exercices: [
        { nom: 'Squat', dom: 'F', series: 4, reps: 15, charge: 10 },
        { nom: 'Fentes haltères', dom: 'F', series: 3, reps: 15, charge: 10 },
        { nom: 'Step up haltères', dom: 'F', series: 3, reps: 15, charge: 0 },
        { nom: 'Mollets', dom: 'F', series: 3, reps: 20, charge: 0 },
        { nom: 'Gainage ventral', dom: 'A', series: 3, reps: 60, charge: 0, tenue: true },
        { nom: 'Gainage latéral', dom: 'A', series: 3, reps: 30, charge: 0, tenue: true },
        { nom: 'Crunch', dom: 'A', series: 3, reps: 20, charge: 0 }
      ]
    },
    {
      // Jour 3 du bloc de reprise (25/08), mais exercices différents de
      // ceux prescrits ce jour-là (stabilité/fessiers) — abandon plutôt
      // qu'exécution du plan. Une seule série par exercice loguée, durée
      // Hevy 4:37 pour 4 mouvements : séance réellement abrégée.
      date: '2026-08-25', source: 'hevy', duree: null, incomplete: true,
      exercices: [
        { nom: 'Fentes bulgares', dom: 'F', series: 1, reps: 15, charge: 10 },
        { nom: 'Chaise sur une jambe', dom: 'S', series: 1, reps: 30, charge: 0, tenue: true },
        { nom: 'Squat sumo', dom: 'F', series: 1, reps: 15, charge: 10 },
        { nom: 'Russian twist kettlebell', dom: 'A', series: 1, reps: 20, charge: 10 }
      ]
    },
    {
      // Séance de kiné, loguée via Hevy sous le titre « Kiné 🏋️ ». Contenu
      // connu cette fois, contrairement aux neuf séances de juillet-août.
      // Durée Hevy (4:37) non fiable comme d'habitude.
      // L'élévation latérale a été faite à 0 kg sur 3 séries et 1 kg sur la
      // dernière : enregistrée à 0, l'écart de tonnage est négligeable.
      date: '2026-08-31', source: 'kiné', duree: null,
      exercices: [
        { nom: 'Presse à cuisses 1 jambe', dom: 'F', series: 1, reps: 20, charge: 50 },
        { nom: 'Élévation latérale jambe lestée', dom: 'S', series: 4, reps: 12, charge: 0 },
        { nom: 'Fentes haltères', dom: 'F', series: 3, reps: 15, charge: 10 }
      ]
    },
    {
      // Séance de kiné, jeudi 3 sept, loguée via Hevy sous le titre
      // « Entraînement du soir ». Le 25 min continu prescrit ce jour-là
      // n'a pas eu lieu (aucune course loguée) : la séance de kiné a pris
      // sa place. Durée Hevy (6:08) non fiable comme d'habitude pour le kiné.
      // « Extensions Une Jambe » = Leg extension fait en unilatéral, noté
      // sous le nom du catalogue pour garder la progression de charge.
      // « Marche Latérale Bande Élastique » = même mouvement que « Pas
      // chassés demi-squat + levers latéraux », renommé à l'identique.
      date: '2026-09-03', source: 'kiné', duree: null,
      exercices: [
        { nom: 'Leg extension', dom: 'F', series: 1, reps: 12, charge: 12.5 },
        { nom: 'Squat une jambe', dom: 'F', series: 1, reps: 10, charge: 0 },
        { nom: 'Pas chassés demi-squat + levers latéraux', dom: 'S', series: 1, reps: 30, charge: 0 }
      ]
    }
  ]
};
