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
  maj: '2026-10-06',
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
    },
    // Deux séances de kiné cette semaine, mercredi et jeudi, à la place du
    // renfo prévu mardi (non fait) — contenu non communiqué, comme la
    // plupart des séances de kiné avant le 31 août.
    { date: '2026-09-09', source: 'kiné', duree: null, exercices: [] },
    { date: '2026-09-10', source: 'kiné', duree: null, exercices: [] },
    {
      // Séance abdos du dimanche, format circuit proposé le 13/09. Reps
      // comptées sur crunch/russian twist, temps sur les trois gainages,
      // conformément à la règle adoptée ce jour-là. « Relevé de Jambes
      // Allongé » ajouté par Seb en plus du programme, absent du catalogue
      // avant ce passage. Durée Hevy (8 min) très sous-évaluée pour 6
      // exercices × 3 séries : non fiable.
      date: '2026-09-13', source: 'hevy', duree: null,
      exercices: [
        { nom: 'Crunch', dom: 'A', series: 3, reps: 20, charge: 0 },
        { nom: 'Russian twist kettlebell', dom: 'A', series: 3, reps: 20, charge: 10 },
        { nom: 'Gainage dynamique', dom: 'A', series: 3, reps: 40, charge: 0, tenue: true },
        { nom: 'Gainage latéral', dom: 'A', series: 3, reps: 60, charge: 0, tenue: true },
        { nom: 'Relevé de jambes allongé', dom: 'A', series: 3, reps: 20, charge: 0 },
        { nom: 'Gainage sur une jambe', dom: 'A', series: 3, reps: 60, charge: 0, tenue: true }
      ]
    },
    {
      // Séance courte du vendredi matin, loguée « Abdo ». Pompes en 3
      // séries dégressives (20/16/13) : reps notées sur la dernière série,
      // comme la convention déjà en place pour ce type de série.
      date: '2026-09-18', source: 'hevy', duree: null,
      exercices: [
        { nom: 'Crunch', dom: 'A', series: 3, reps: 20, charge: 0 },
        { nom: 'Pompes', dom: 'H', series: 3, reps: 13, charge: 0 }
      ]
    },
    {
      // Séance de kiné du 18/09, loguée cette fois avec le contenu complet
      // (sport_type Hevy « PhysicalTherapy ») — une première depuis le
      // début du suivi. Durée Hevy (45 min) plausible pour un vrai
      // rendez-vous, gardée telle quelle.
      // « Fentes (Haltère) » = Fentes haltères, « Marche Latérale Bande
      // Élastique » = Pas chassés demi-squat + levers latéraux.
      date: '2026-09-18', source: 'kiné', duree: 45,
      exercices: [
        { nom: 'Step up haltères', dom: 'F', series: 3, reps: 24, charge: 16 },
        { nom: 'Fentes haltères', dom: 'F', series: 3, reps: 20, charge: 12 },
        { nom: 'Pas chassés demi-squat + levers latéraux', dom: 'S', series: 2, reps: 40, charge: 0 }
      ]
    },
    {
      // « Abdo / Fessier / Équilibre » du 19/09. Fentes bulgares et squat
      // une jambe loggés en une ou deux séries seulement (le reste en
      // trois) : séance probablement écourtée en fin de programme.
      // Reps notées sur la dernière série pour les exercices dégressifs
      // (crunch 25/24/24, pompes 20/15/13, squat une jambe 24/22,
      // russian twist 24/20/20). « Split Squat Bulgare (Haltère) » =
      // Fentes bulgares, « squat une jambe lestée » = Squat une jambe.
      date: '2026-09-19', source: 'hevy', duree: null, incomplete: true,
      exercices: [
        { nom: 'Crunch', dom: 'A', series: 3, reps: 24, charge: 0 },
        { nom: 'Pompes', dom: 'H', series: 3, reps: 13, charge: 0 },
        { nom: 'Fentes bulgares', dom: 'F', series: 1, reps: 40, charge: 10 },
        { nom: 'Squat une jambe', dom: 'F', series: 2, reps: 22, charge: 10 },
        { nom: 'Russian twist kettlebell', dom: 'A', series: 3, reps: 20, charge: 10 }
      ]
    },
    {
      // Kiné du 21/09, loguée avec le contenu complet (deuxième fois après le
      // 18/09). Durée Hevy 30:00 pile, plausible pour un vrai rendez-vous.
      // « Fentes (Haltère) » = Fentes haltères, « Marche Latérale Bande
      // Élastique » = Pas chassés demi-squat + levers latéraux (mappings déjà
      // établis). « lateral step down lesté » est un mouvement nouveau —
      // descente latérale contrôlée d'un step, travail excentrique du
      // quadriceps très proche de ce qui est recherché pour la descente en
      // trail — ajouté au catalogue sous « Step down latéral ».
      date: '2026-09-21', source: 'kiné', duree: 30,
      exercices: [
        { nom: 'Fentes haltères', dom: 'F', series: 3, reps: 20, charge: 20 },
        { nom: 'Pas chassés demi-squat + levers latéraux', dom: 'S', series: 2, reps: 40, charge: 0 },
        { nom: 'Step down latéral', dom: 'F', series: 3, reps: 10, charge: 10 }
      ]
    },
    {
      // Séance perso du 22/09 (« Abdo »). Reps notées sur la dernière série
      // pour le crunch (dégressif 25/20/20) et le relevé de jambes (dégressif
      // 20/20/10) ; temps noté sur la dernière série pour le gainage latéral
      // (3 tenues proches, ~2 min chacune). Durée Hevy (24:18) plausible pour
      // 3 exercices × 3 séries dont deux minutes de gainage par série.
      date: '2026-09-22', source: 'hevy', duree: 24,
      exercices: [
        { nom: 'Crunch', dom: 'A', series: 3, reps: 20, charge: 0 },
        { nom: 'Gainage latéral', dom: 'A', series: 3, reps: 117, charge: 0, tenue: true },
        { nom: 'Relevé de jambes allongé', dom: 'A', series: 3, reps: 10, charge: 0 }
      ]
    },
    // Kiné du 24/09 (18h45, Justine Bonhomme) : confirmée faite par Seb, mais
    // pas loguée dans Hevy — contenu inconnu, comme la plupart des séances de
    // kiné avant le 18/09.
    { date: '2026-09-24', source: 'kiné', duree: null, exercices: [] },
    {
      // Séance perso du 27/09 (« Abdo »), manifestement écourtée : gainage
      // latéral coupé à 2 séries au lieu de 3 (2min01 puis seulement 1min09),
      // pompes en chute libre 20/12/6, calories Hevy anormalement basses (61)
      // pour 3 exercices. Reps/temps notés sur la dernière série. « relevé de
      // jambes lestées » est la même charnière que « Relevé de jambes
      // allongé » désormais lestée à 2 kg (avant : poids du corps) — logué
      // sous le même nom pour garder la progression de charge.
      date: '2026-09-27', source: 'hevy', duree: 18, incomplete: true,
      exercices: [
        { nom: 'Gainage latéral', dom: 'A', series: 2, reps: 69, charge: 0, tenue: true },
        { nom: 'Relevé de jambes allongé', dom: 'A', series: 3, reps: 20, charge: 2 },
        { nom: 'Pompes', dom: 'H', series: 3, reps: 6, charge: 0 }
      ]
    },
    // Kiné du 28/09 (18h15) : faite, à la place de la préparation physique
    // RunMotion du jour, mais contenu non noté (Seb n'en a pas besoin).
    { date: '2026-09-28', source: 'kiné', duree: null, exercices: [] },
    {
      // Kiné du 01/10 (17h45), loguée avec le contenu complet. Durée Hevy
      // 30:05, plausible. Mappings habituels : « Fentes (Haltère) » = Fentes
      // haltères (40 reps par série, sans doute 20 par jambe), « Marche
      // Latérale Bande Élastique » = Pas chassés demi-squat + levers latéraux,
      // « Extension Jambe latérale avec Élastique » = Élévation latérale jambe
      // lestée, ici avec un élastique plutôt qu'un poids (charge 0).
      date: '2026-10-01', source: 'kiné', duree: 30,
      exercices: [
        { nom: 'Fentes haltères', dom: 'F', series: 3, reps: 40, charge: 20 },
        { nom: 'Pas chassés demi-squat + levers latéraux', dom: 'S', series: 2, reps: 40, charge: 0 },
        { nom: 'Élévation latérale jambe lestée', dom: 'S', series: 3, reps: 24, charge: 0 }
      ]
    },
    {
      // Séance perso du 04/10 (« Abdo »), 13 min. Crunch dégressif 20/17/17 :
      // reps notées sur la dernière série. « Extension Jambe latérale avec
      // Élastique » = Élévation latérale jambe lestée (élastique, charge 0),
      // 20/24/24 noté 24.
      date: '2026-10-04', source: 'hevy', duree: 13,
      exercices: [
        { nom: 'Crunch', dom: 'A', series: 3, reps: 17, charge: 0 },
        { nom: 'Élévation latérale jambe lestée', dom: 'S', series: 3, reps: 24, charge: 0 }
      ]
    },
    {
      // Kiné du 05/10 (17h45), 30 min, contenu complet. « Squat Une Jambe
      // Statique » = tenue isométrique sur une jambe, notée sous « Chaise sur
      // une jambe » (même travail du quadriceps en isométrie). « Split Squat
      // Bulgare (Haltère) » = Fentes bulgares, passées de 10 à 18 kg.
      // « Around the World + Extension de Jambe (Kettlebell / Élastique) » est
      // une variante nouvelle (kettlebell 4 kg autour du bassin + extension de
      // la jambe libre à l'élastique) : ajoutée au catalogue sous son nom,
      // distincte du « Kettlebell around the world » simple à 10 kg.
      date: '2026-10-05', source: 'kiné', duree: 30,
      exercices: [
        { nom: 'Chaise sur une jambe', dom: 'S', series: 6, reps: 30, charge: 0, tenue: true },
        { nom: 'Fentes bulgares', dom: 'F', series: 3, reps: 10, charge: 18 },
        { nom: 'Around the world + extension de jambe', dom: 'S', series: 3, reps: 20, charge: 4 }
      ]
    }
  ]
};
