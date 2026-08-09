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
  maj: '2026-08-09',
  seances: [
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
    }
  ]
};
