// ===== Feuille de route 2026-2029 · source de vérité de l'onglet Objectif =====
//
// Une course = un objet. Tout se construit depuis cette liste : les blocs de
// la frise, le graphique de difficulté et son tableau, le compteur de stones,
// les tuiles « courses » et « stones » et le compte à rebours de l'en-tête.
//
// Champs d'une course :
//   saison        1, 2 ou 3 (intertitres de la frise, voir saisons)
//   type          'etape' | 'option' | 'objectif' (objectif de l'année) |
//                 'final' (l'OCC) | 'echeance' (tirage au sort, sans bloc détaillé)
//   badge         texte du badge en haut à gauche du bloc
//   date          date ISO, sert au compte à rebours et au graphique
//   quand         date affichée ; estimee: true ajoute « à confirmer »
//   court         nom court (graphique, tableau, en-tête) ; etiquette : nom
//                 affiché à côté du point sur le graphique
//   km, dp, dm    distance, D+ et D− ; dm omis = course en boucle (D− = D+)
//   index         catégorie UTMB Index ('20K', '50K'), true si la catégorie
//                 n'est pas connue ; omis si la course n'est pas Index
//   stones        Running Stones rapportées (courses UTMB World Series)
//   cible         { txt } : temps calculé depuis la référence ci-dessous ;
//                 { txt, temps, note } : temps fixé à la main
//   dossard       { statut: 'pris' | 'a-prendre' | 'pas-ouvert' | 'tirage', txt }
//   formats       option à plusieurs formats : une carte et un point par format
//   resultat      null tant que la course n'est pas courue, puis le temps
//                 officiel ('47:12'). Une course finie remplace son compte à
//                 rebours par le temps et gagne ses stones : badge, compteur
//                 et en-tête suivent. Avant de changer la référence, figer
//                 cible.temps des courses déjà courues.

const ROADMAP = {
  maj: '2026-10-17',

  // Temps cible = minutes × (km-effort / km-effort de la référence)^exposant
  // (formule de Riegel : l'allure ralentit avec la durée), affiché à ±5 %.
  // À remplacer par la dernière course courue après chaque résultat.
  reference: { nom: 'Forez 2026', km: 24.4, dp: 933, minutes: 185, exposant: 1.10 },

  stonesRepere: { valeur: 5.5, txt: 'Moyenne des tirés au sort OCC 2026' },

  saisons: {
    1: { titre: 'Saison 1 : reconstruire', sous: '2026-2027 · objectif les Templiers' },
    2: { titre: 'Saison 2 : monter en puissance', sous: '2028 · objectif le Grand Raid des Pyrénées' },
    3: { titre: "Saison 3 : l'OCC", sous: '2029' }
  },

  courses: [
    {
      saison: 1, type: 'etape', badge: 'Étape · retour au dossard',
      date: '2026-10-18T10:00', quand: 'Dim. 18 oct. 2026',
      evenement: 'Clam Trail · CSM Clamart', nom: 'Le 10 K', court: 'Clam Trail',
      lien: 'https://www.finishers.com/course/clam-trail',
      km: 10, dp: 128, lieu: 'Clamart (92)',
      terrain: 'trail urbain, rues du quartier Galvents-Corby et sentiers de la forêt de Clamart',
      desc: `Le Clam'Trail est organisé par le CSM Clamart Athlétisme au cœur de la forêt de Clamart. Le format 10 km part à 10h00 de l'esplanade du Stade de la Plaine, traverse les rues du quartier Galvents-Corby puis les sentiers boisés de la forêt, pour 128 m de D+ — une course urbaine et forestière, sans rien de technique.`,
      cible: { txt: 'Temps prévu par le plan RunMotion, soit 4:48/km.', temps: '~48 min' },
      dossard: { statut: 'pris', txt: '— inscription confirmée sur le 10 km, plus rien à surveiller de ce côté.' },
      role: `Retrouver la routine de course : <strong>premier dossard de la saison</strong>, retrait, échauffement, gestion du peloton au départ. Peu de D+ (128 m), rien de technique : ce n'est pas un test de terrain, mais une répétition avant les échéances plus exigeantes de décembre et janvier.`,
      strategie: `Tenir 4:48/km sur les portions roulantes, sans chercher à garder l'allure dans les montées du bois : c'est là qu'on perd tout en voulant forcer. Profiter des passages en sous-bois pour retrouver l'appui sur terrain irrégulier avant les courses à D+.`,
      logistique: `Clamart (92), accessible en Transilien/RER depuis Paris — aucune nuit sur place nécessaire. Départ 10h00 du Stade de la Plaine (131 chemin du Parc), retrait du dossard habituellement la veille ou le matin même sur place. Chaussures de trail conseillées pour les sentiers forestiers.`,
      resultat: null
    },
    {
      saison: 1, type: 'etape', badge: 'Étape · premier vrai D+',
      date: '2026-12-05T09:00', quand: 'Sam. 5 déc. 2026',
      evenement: "L'Hivernale des Templiers", nom: "Le Rock'Angel", court: "Rock'Angel",
      lien: 'https://www.hivernaledestempliers.com/rockangel/',
      km: 18.3, dp: 750, dpApprox: true, lieu: 'Roquefort-sur-Soulzon (12)', terrain: 'causses et corniches',
      desc: `Le Rock'Angel est l'une des courses de l'Hivernale des Templiers, version hivernale du Festival des Templiers dans les Grands Causses. Départ donné depuis l'intérieur des caves de Roquefort Société — dans la cave dite « cathédrale » — à rythme contrôlé jusqu'au grand porche où le peloton est lâché. Le parcours traverse des paysages minéraux, longe le rocher de Rocangel et les cirques de Saint-Paul-des-Fonts et de Tournemire, en plein terroir du Roquefort.`,
      cible: { txt: "Finir en gérant l'effort." },
      dossard: { statut: 'pris', txt: '— inscription confirmée.' },
      role: `Premier vrai D+ et premières descentes techniques : <strong>~750 m sur 18 km, soit 40 m/km</strong>, quatre fois l'ordinaire d'entraînement, sur un terrain de causses et de corniches calcaires introuvable en Île-de-France. Sert à calibrer montée et descente avant Forez.`,
      strategie: `Marche assumée dans les montées, énergie gardée pour la descente. En descente : appuis courts, cadence haute, plutôt que de longues foulées relâchées. Le chrono compte moins que la qualité d'exécution en descente.`,
      logistique: `Roquefort-sur-Soulzon (Aveyron), ~6h de route ou de train depuis Paris — une nuit sur place est nécessaire. Décembre : prévoir des couches chaudes et de quoi affronter le vent des corniches. Réserver l'hébergement à l'avance, l'offre est limitée dans ce petit village. Prévoir d'arriver tôt pour le départ original depuis l'intérieur des caves.`,
      resultat: null
    },
    {
      saison: 1, type: 'etape', badge: 'Étape · distance',
      date: '2027-01-17T09:00', quand: 'Dim. 17 janv. 2027',
      evenement: 'Trail des 2 Baies', nom: 'Le D2B', court: 'D2B',
      lien: 'https://www.finishers.com/course/trail-d2b',
      km: 23.5, dp: 300, lieu: 'Le Touquet-Paris-Plage (62)', terrain: 'sable, dunes et estran',
      index: '20K', noteKe: 'sable : difficulté sous-estimée par la formule',
      desc: `Le Trail des 2 Baies est un trail 100 % sable, disputé sur l'estran et les dunes du Touquet-Paris-Plage, entre la baie de Canche et la baie de Slack. Quatre distances sont proposées pour tous les niveaux. Le sable, souvent humide et instable selon la marée, en fait une épreuve à part : le relief compte moins que la résistance musculaire à un appui qui se dérobe.`,
      cible: { txt: "Tenir 2h45 d'effort continu.", temps: '2h45 – 3h05', note: 'Fourchette fixée à la main : le km-effort ignore le sable.' },
      dossard: { statut: 'pris', txt: 'le 14 octobre 2026 sur <a href="https://traildes2baies.fr/" target="_blank" rel="noopener">traildes2baies.fr</a> — plus rien à surveiller de ce côté.' },
      role: `La distance et le renfort musculaire du sable : <strong>23,5 km</strong>, la plus longue course depuis Forez 2026, sur un profil quasi plat. Le complément exact du Rock'Angel : là où décembre apporte la pente, janvier apporte la distance. Le sable sollicite les mollets et la stabilité de cheville autrement que le sentier.`,
      strategie: `Allure régulière, effort contenu sur les deux premières heures — c'est un test d'endurance, pas d'intensité. Attention au vent de la baie, qui double le coût sur l'estran ; ajuster l'allure selon le sens du vent plutôt que viser un chrono fixe.`,
      logistique: `Le Touquet-Paris-Plage (Pas-de-Calais), ~2h30 de route ou de train depuis Paris — faisable dans la journée selon l'horaire de départ, sinon une nuit sur place. Janvier en bord de mer : prévoir des vêtements chauds et coupe-vent pour l'avant/après-course, et de quoi protéger les yeux du sable soufflé par le vent.`,
      resultat: null
    },
    {
      saison: 1, type: 'etape', badge: 'Étape · répétition générale',
      date: '2027-03-07T09:00', quand: 'Dim. 7 mars 2027',
      evenement: 'Forez Trails', nom: "L'Augerolloise", court: 'Forez 2027', etiquette: 'Forez 27',
      lien: 'https://www.finishers.com/course/forez-trails',
      km: 33, dp: 1100, lieu: 'Augerolles (63)', terrain: 'monts du Forez',
      desc: `L'Augerolloise est le format intermédiaire des Forez Trails, organisés par Augerolles 2000 dans le Puy-de-Dôme, entre le Parc naturel régional Livradois-Forez et une zone Natura 2000. Quatre distances sont au programme (12, 24, 33 et 50 km), ouvertes en solo ou en duo sauf la plus courte. Le 33 km s'élance à 9h00, sur un tracé technique mais qui permet de rentrer avant la nuit.`,
      cible: { txt: 'Répétition générale sur un terrain connu.' },
      dossard: { statut: 'pris', txt: "le 14 octobre 2026. Reste à réserver l'hébergement de la veille." },
      role: `Répétition générale sur un terrain connu : édition 2026 courue en 3h05 sur 24,4 km / 933 m D+. L'Augerolloise ajoute <strong>9 km et 170 m D+</strong>, pour plus de quatre heures d'effort : la plus longue course de la saison avant le 4×1800, et la meilleure jauge pour mesurer la progression sur un an, dans la même Auvergne volcanique.`,
      strategie: `Viser une allure d'effort au moins égale à 2026 malgré la distance et le D+ supplémentaires. Marche assumée dans les raidillons, ravitaillement réglé sur l'expérience de l'édition précédente plutôt qu'à l'improvisation.`,
      logistique: `Augerolles (Puy-de-Dôme), ~4h30 de route depuis Paris. Départ à 9h00 : une nuit sur place la veille est recommandée plutôt qu'un aller-retour dans la journée. Réserver un hébergement local (gîtes, village) suffisamment à l'avance vu le format weekend.`,
      resultat: null
    },
    {
      saison: 1, type: 'etape', badge: 'Étape · première stone',
      date: '2027-06-13T08:00', quand: 'Dim. 13 juin 2027',
      evenement: 'Trail 100 Andorra by UTMB', nom: 'Le Trail 21K', court: 'Andorre 21K',
      lien: 'https://andorra.utmb.world/races/trail-21k',
      km: 24.9, dp: 1350, lieu: 'Ordino (Andorre)', terrain: 'Pyrénées andorranes, départ et arrivée à Ordino',
      index: '20K', stones: 1,
      desc: `Trail 100 Andorra fait partie des UTMB World Series : chaque mois de juin, Ordino accueille le départ et l'arrivée de toutes les courses, du 10K à l'Ultra 105K. Malgré son nom, le Trail 21K de l'édition 2027 mesure 24,9 km pour 1 350 m de D+, avec 6 h de barrière horaire. Il compte dans la catégorie 20K de l'UTMB Index et rapporte 1 Running Stone à chaque finisher.`,
      cible: { txt: "Finir et décrocher la stone, sans s'exploser en altitude." },
      dossard: { statut: 'a-prendre', txt: 'Inscriptions ouvertes depuis le 9 juillet 2026 sur <a href="https://andorra.utmb.world/registration" target="_blank" rel="noopener">andorra.utmb.world</a> : 126,97 € au tarif actuel, 143,12 € au palier suivant. En 2026, tout était complet en deux mois.' },
      role: `La première Running Stone du plan, et la première course en altitude : <strong>54 m/km</strong> de D+, proche de la pente de l'OCC (58), sur un format court qui se récupère vite avant le 4×1800 de juillet.`,
      strategie: `Partir très en dedans : l'altitude coupe le souffle dans les premières montées, et le chrono ne compte pas. Marche active dès que la pente se redresse, boire régulièrement, garder les cuisses pour les descentes vers Ordino.`,
      logistique: `Ordino (Andorre), ~9h de route depuis Paris, ou train jusqu'à Toulouse puis ~3h de bus. Deux nuits sur place, arrivée le vendredi. Juin en montagne : coupe-vent et couche chaude pour les hauteurs, et le matériel obligatoire du règlement.`,
      resultat: null
    },
    {
      saison: 1, type: 'etape', badge: 'Étape · montagne longue',
      date: '2027-07-17T07:45', quand: 'Mi-juil. 2027', estimee: true,
      evenement: 'Trail des 4×1800 · Cantal', nom: 'La 4×1800', court: '4×1800',
      lien: 'https://www.finishers.com/course/le-trail-des-4-x-1800',
      km: 35, dp: 2150, lieu: 'Le Lioran (15)', terrain: 'monts du Cantal, quatre sommets au-dessus de 1 800 m',
      index: '50K',
      desc: `La 4×1800 est la course reine du Trail des 4×1800, au Lioran, au cœur des monts du Cantal. Elle enchaîne les quatre sommets du massif qui dépassent 1 800 m — le Plomb du Cantal, le puy de Peyre-Arse, le puy Brunet et le puy du Rocher selon la fiche ITRA —, sans bâtons, avec un seul ravitaillement au 20e km à Saint-Jacques-des-Blats, où se fait aussi le passage de témoin des relais. Édition 2026 : 34,8 km et 2 147 m D+ selon ITRA, départ à 7h45.`,
      cible: { txt: "Finir sans se griller : c'est un test, pas l'objectif de l'année." },
      dossard: { statut: 'pas-ouvert', txt: `Date d'ouverture 2027 non communiquée — à surveiller sur <a href="https://www.finishers.com/course/le-trail-des-4-x-1800" target="_blank" rel="noopener">Finishers</a>.` },
      role: `Le test de montagne longue, à une pente proche de celle de l'OCC : <strong>61 m/km</strong> sur 35 km. Trois mois avant les Templiers, c'est la course qui dit si les cuisses tiennent 2 000 m de descente.`,
      strategie: `Un seul ravitaillement, au 20e km : partir avec de quoi boire et manger pour trois heures. Bâtons interdits : marche active mains sur les cuisses dans les montées raides, appuis courts dans les descentes, et garder de la réserve pour le dernier sommet.`,
      logistique: `Le Lioran (Cantal), ~5h de route depuis Paris, ou train jusqu'à la gare du Lioran via Clermont-Ferrand. Nuit sur place la veille indispensable vu le départ matinal. Juillet en altitude : orages possibles, prévoir un coupe-vent.`,
      resultat: null
    },
    {
      saison: 1, type: 'option', badge: 'Option · dernier test',
      date: '2027-09-12T09:00', quand: '~Dim. 12 sept. 2027', estimee: true,
      evenement: 'Grands Trails Esprit Volcans · Clermont-Ferrand', nom: 'Le Gergo Trail', court: 'Gergo Trail',
      lien: 'https://www.finishers.com/course/grand-trail-esprit-volcans',
      km: 22, dp: 900, lieu: 'Cournon (63)', terrain: "départ et arrivée à la Grande Halle d'Auvergne · plateau de Gergovie",
      index: true,
      desc: `Le Gergo Trail est le format montagne des Grands Trails Esprit Volcans, le même week-end et au même endroit que la Directissime. Départ et arrivée à la Grande Halle d'Auvergne à Cournon : le parcours grimpe sur le plateau de Gergovie, traverse le bois des Fours à Chaux et le ravin de Vazilhat, et passe par le puy de Mardoux.`,
      cible: { txt: 'Finir en gérant les montées.' },
      dossard: { statut: 'pas-ouvert', txt: `Date d'ouverture 2027 non trouvée — à surveiller sur <a href="https://www.finishers.com/course/grand-trail-esprit-volcans" target="_blank" rel="noopener">Finishers</a>. L'édition 2026 s'est courue le 13 septembre ; la date 2027 retenue ici suit la même logique.` },
      role: `Le dernier test, cinq semaines avant les Templiers : <strong>900 m de D+ sur 22 km, soit 41 m/km</strong>, en grande partie dans la montée vers le plateau de Gergovie. Une option : à courir seulement si la récupération du 4×1800 et la forme le permettent.`,
      strategie: `Partir prudemment : la course se joue dans la montée vers Gergovie. Marche active assumée dès que la pente se redresse, relances courtes sur les replats, et garder de la réserve pour la descente finale vers Cournon.`,
      logistique: `Clermont-Ferrand, ~3h30 de train ou de route depuis Paris. Nuit sur place la veille indispensable. Départ et arrivée au même endroit, à la Grande Halle d'Auvergne (Cournon) : pas de navette à prévoir, l'hébergement peut se choisir à proximité.`,
      resultat: null
    },
    {
      saison: 1, type: 'objectif', badge: 'Objectif 2027',
      date: '2027-10-16T06:40', quand: 'Mi-oct. 2027', estimee: true,
      evenement: 'Festival des Templiers · Millau', nom: 'La Boffi Fifty', court: 'Templiers · Boffi Fifty', etiquette: 'Templiers',
      lien: 'https://www.festivaldestempliers.com/courses/boffi-fifty',
      km: 46.5, dp: 2005, lieu: 'Millau (12)', terrain: 'Grands Causses : Larzac, causse Noir, vallée de la Dourbie',
      index: '50K',
      desc: `Le Festival des Templiers, à Millau, est la course pionnière du trail français, au cœur des Grands Causses. La Boffi Fifty en est le format intermédiaire : une boucle au départ du domaine de Saint-Estève, sur le terrain du Grand Trail des Templiers (Larzac, causse Noir, vallée de la Dourbie), avec selon les traces publiées une boucle technique dans les falaises du Boffi. Édition 2026 : 46,5 km et 2 005 m D+ selon le site officiel, départ le samedi à l'aube en deux vagues, 6h40 et 7h05.`,
      cible: { txt: "L'objectif de l'année : finir en gérant les deux dernières heures." },
      dossard: { statut: 'pas-ouvert', txt: `Ouverture mi-janvier 2027 à midi (2026 : lundi 19 janvier) — les places partent en quelques heures. Compte prêt et connexion à l'heure pile.` },
      role: `L'objectif de 2027 et un premier ~50 km, sur la course pionnière du trail français : <strong>43 m/km</strong> de D+ pour 77 km-effort, la plus grosse marche de la saison.`,
      strategie: `Départ de nuit à la frontale, très en dedans : les vagues se mettent vite en file sur les monotraces. Marche active dans les montées des causses, manger dès la première heure (30 à 60 g de glucides par heure), garder des cuisses pour les descentes techniques de la fin.`,
      logistique: `Millau (Aveyron), ~6h30 de route depuis Paris par l'A75, ou train via Clermont-Ferrand ou Montpellier puis car. Deux nuits sur place : retrait des dossards dès le jeudi, départ le samedi avant le lever du jour. Octobre sur les causses : matins froids, frontale obligatoire pour le départ.`,
      resultat: null
    },
    {
      saison: 2, type: 'etape', badge: 'Étape · ouverture de saison',
      date: '2028-03-05T09:00', quand: 'Début mars 2028', estimee: true,
      evenement: 'Forez Trails', nom: "L'Augerolloise", court: 'Forez 2028',
      lien: 'https://www.finishers.com/course/forez-trails',
      km: 33, dp: 1100, lieu: 'Augerolles (63)', terrain: "monts du Forez, même parcours qu'en 2027",
      desc: `Retour sur l'Augerolloise, le 33 km des Forez Trails organisés par Augerolles 2000 dans le Puy-de-Dôme, entre le Parc naturel régional Livradois-Forez et une zone Natura 2000. Même parcours qu'en 2027 si l'organisation ne le modifie pas : départ à 9h00, tracé technique.`,
      cible: { txt: 'Battre le chrono de 2027.' },
      dossard: { statut: 'pas-ouvert', txt: "Ouverture à l'automne 2027 (le dossard 2027 avait été pris le 14 octobre 2026)." },
      role: `Ouverture de la saison 2 sur le même parcours qu'en 2027, pour mesurer la progression au chrono près, un an plus tard.`,
      strategie: `Partir sur les temps de passage de 2027 et n'accélérer qu'après la mi-course si les jambes suivent. Ravitaillement réglé sur l'expérience des deux éditions précédentes.`,
      logistique: `Augerolles (Puy-de-Dôme), ~4h30 de route depuis Paris. Départ à 9h00 : une nuit sur place la veille, comme en 2027.`,
      resultat: null
    },
    {
      saison: 2, type: 'etape', badge: 'Étape · stone garantie',
      date: '2028-04-22T08:30', quand: 'Fin avril 2028', estimee: true,
      evenement: 'Grand Raid Ventoux by UTMB', nom: 'Le Trail des Coteaux', court: 'Ventoux · Coteaux',
      lien: 'https://ventoux.utmb.world',
      km: 26, dp: 1100, lieu: 'Malaucène (84)', terrain: 'pentes du mont Ventoux',
      index: '20K', stones: 1,
      desc: `Le Grand Raid Ventoux fait partie des UTMB World Series depuis 2025, au pied du mont Ventoux, à Malaucène. Le Trail des Coteaux est le plus court de ses quatre formats : 26 km pour 1 100 m de D+, 1 Running Stone. Le parcours emprunte les premiers kilomètres de la route du sommet, passe par le site naturel du Groseau puis la chapelle Saint-Sidoine. Édition 2026 : départ de Malaucène à 8h30, 6 h maximum.`,
      cible: { txt: 'Prendre la stone sans entamer la suite du printemps.' },
      dossard: { statut: 'pas-ouvert', txt: `Inscription directe, vers septembre 2027 — complet en ~72 h : à surveiller dès la fin de l'été.` },
      role: `Une stone garantie : l'inscription est directe (le 50K, lui, passe par un tirage au sort), sur une course légère qui ne coûte pas la saison. Trois semaines avant les Celtes.`,
      strategie: `Course de rodage : allure contrôlée dans la montée du début, relâchement dans les descentes vers Malaucène sans forcer. L'objectif est de repartir frais vers les Celtes.`,
      logistique: `Malaucène (Vaucluse), TGV jusqu'à Avignon (~2h40 depuis Paris) puis ~45 min de route, ou ~7h de voiture. Une nuit sur place la veille. Fin avril au pied du Ventoux : matins frais, vent possible.`,
      planB: `Viser 7 stones avec le Mistral Marathon Trail (51 km, 2 500 m D+, 2 stones, tirage au sort) à la place des Coteaux. <strong>Déconseillé</strong> : il tombe trois semaines avant les Celtes.`,
      resultat: null
    },
    {
      saison: 2, type: 'etape', badge: 'Étape · 2 stones',
      date: '2028-05-14T07:00', quand: 'Mi-mai 2028', estimee: true,
      evenement: 'Trail Alsace by UTMB', nom: 'Le Trail des Celtes', court: 'Alsace · Celtes',
      lien: 'https://alsace.utmb.world/races/TDC',
      km: 47, dp: 1600, lieu: 'Obernai (67)', terrain: "vignoble et forêt vosgienne, de Barr aux remparts d'Obernai",
      index: '50K', stones: 2,
      desc: `Trail Alsace by UTMB, épreuve des UTMB World Series, réunit chaque mois de mai six courses qui finissent toutes aux remparts d'Obernai. Le Trail des Celtes part des vignobles de Barr, plonge dans la forêt vosgienne et passe par le château du Landsberg puis Birkenfels. Édition 2026 : 47 km et 1 600 m D+, départ le dimanche à 7h00, 9 h maximum. Il rapporte 2 Running Stones.`,
      cible: { txt: 'Une sortie longue en conditions de course.' },
      dossard: { statut: 'pas-ouvert', txt: "Ouverture début août 2027, avec deux jours d'avance pour les détenteurs d'un UTMB Index (pour 2027 : le 4 août 2026 à 11h avec Index, le 6 août pour les autres). Les prix ont augmenté pendant la file d'attente : s'inscrire dès l'ouverture." },
      role: `Deux stones et une sortie longue en conditions de course : 47 km, la distance des Templiers, sur un profil plus roulant (34 m/km). Quatre semaines avant Andorre.`,
      strategie: `Course d'entraînement, pas de chrono : allure d'endurance dans le vignoble, marche active dans les montées de la forêt, et répétition de la nutrition de l'été (30 à 60 g de glucides par heure).`,
      logistique: `Obernai (Bas-Rhin), TGV Paris–Strasbourg (~1h50) puis TER jusqu'à Obernai ; navette vers le départ de Barr à vérifier. Une nuit sur place la veille.`,
      resultat: null
    },
    {
      saison: 2, type: 'etape', badge: "Étape · répétition de l'été",
      date: '2028-06-10T08:00', quand: 'Mi-juin 2028', estimee: true,
      evenement: 'Trail 100 Andorra by UTMB', nom: 'Le Trail 50K', court: 'Andorre 50K',
      lien: 'https://andorra.utmb.world',
      km: 50, dp: 3400, lieu: 'Ordino (Andorre)', terrain: 'Pyrénées andorranes, départ et arrivée à Ordino',
      index: '50K', stones: 2,
      desc: `Le Trail 50K est le format intermédiaire de Trail 100 Andorra by UTMB, à Ordino : 50 km pour 3 400 m de D+, 2 Running Stones. En 2023, il mesurait 50,4 km pour 3 430 m D+, avec un départ à 8h00 et 14 h maximum selon ITRA. L'édition 2028 n'est pas encore annoncée.`,
      cible: { txt: 'Finir la plus grosse course avant le GRP.' },
      dossard: { statut: 'pas-ouvert', txt: "Ouverture vers juillet 2027, si l'édition 2028 a lieu : pour 2027, les inscriptions ont ouvert le 7 juillet 2026 pour les détenteurs d'un UTMB Index, le 9 pour les autres." },
      role: `Deux stones et la répétition générale de l'été : 3 400 m de D+, presque le dénivelé de l'OCC, à <strong>68 m/km</strong>. Dix semaines avant le GRP.`,
      strategie: `À gérer comme un ultra : partir lent, manger dès la première heure, marche active dans toutes les montées longues. C'est ici qu'on valide le matériel, les bâtons et la nutrition du GRP.`,
      logistique: `Comme en 2027 : Ordino, ~9h de route depuis Paris, ou train jusqu'à Toulouse puis ~3h de bus. Deux nuits sur place.`,
      planB: `Si l'édition 2028 n'a pas lieu : le Monistrail du <a href="https://saint-jacques.utmb.world" target="_blank" rel="noopener">Trail du Saint-Jacques by UTMB</a>, fin juin au Puy-en-Velay (55 km et 2 100 m D+ en 2026), rapporte aussi 2 stones.`,
      resultat: null
    },
    {
      saison: 2, type: 'objectif', badge: 'Objectif 2028',
      date: '2028-08-24T05:30', quand: 'Fin août 2028', estimee: true,
      evenement: 'Grand Raid des Pyrénées', nom: 'Le Tour du Moudang', court: 'GRP · Tour du Moudang', etiquette: 'GRP',
      lien: 'https://www.grandraidpyrenees.com/coursesgrp/tour-du-moudang/',
      km: 60, dp: 3600, lieu: 'Vielle-Aure (65)', terrain: "de Piau-Engaly à Vielle-Aure, par l'Espagne et le col de Portet",
      index: '50K',
      desc: `Le Grand Raid des Pyrénées se court fin août dans la vallée d'Aure. Le Tour du Moudang part de Piau-Engaly, fait une boucle dans la station, descend vers la chapelle des Templiers, passe le Port Vieux et l'Espagne, le pont de Moudang et le lac de l'Oule, puis finit par le col de Portet jusqu'à Vielle-Aure : environ 60 km et 3 600 m D+, classé UTMB Index 50K en 2024 et 2025. Édition 2026 : départ le jeudi vers 5h30.`,
      cible: { txt: "L'objectif de l'année : finir l'équivalent de l'OCC, un an avant." },
      dossard: { statut: 'tirage', txt: 'Pré-inscriptions mi-janvier 2028, puis tirage au sort (le calendrier publié indique une pré-inscription du 11 au 15 janvier et un tirage le 22, 1 € par pré-inscription).' },
      role: `L'objectif de 2028 et le jumeau de l'OCC : 60 km pour 3 600 m D+, soit <strong>60 m/km</strong> et 114 km-effort, contre 112 pour l'OCC. Courir le Moudang, c'est arriver à Chamonix en 2029 en ayant déjà couru l'équivalent.`,
      strategie: `Départ avant l'aube à la frontale. Le gérer comme l'OCC : très lent dans la première montée, manger et boire toutes les 30 à 45 minutes, bâtons dans les longues montées, et garder les cuisses pour la longue descente finale du col de Portet.`,
      logistique: `Vielle-Aure (Hautes-Pyrénées), ~8h de route depuis Paris, ou train jusqu'à Tarbes ou Lannemezan puis voiture. Navette vers le départ de Piau-Engaly à vérifier. Deux nuits sur place.`,
      planB: `Se pré-inscrire au Moudang <strong>et</strong> au Tour du Bastan (~50 km), ce que le règlement autorise. Si aucun tirage ne passe : le Trail des Aiguilles Rouges, fin septembre à Chamonix (50 km, 3 700 m D+).`,
      resultat: null
    },
    {
      saison: 2, type: 'option', badge: 'Option · course plaisir',
      date: '2028-10-14T08:00', quand: 'Mi-oct. 2028', estimee: true,
      evenement: "Grands Trails d'Auvergne", nom: 'Le Trail du Lac ou le Trail des Druides', court: "Grands Trails d'Auvergne",
      lien: 'https://fr.milesrepublic.com/event/grand-trail-dauvergne-6762',
      lieu: "Aubusson-d'Auvergne (63)",
      index: true,
      formats: [
        { nom: 'Trail du Lac', km: 25, dp: 800, txt: "Pour finir l'année en douceur." },
        { nom: 'Trail des Druides', km: 48.5, dp: 1940, txt: 'Si les jambes en redemandent après le GRP.' }
      ],
      desc: `Les Grands Trails d'Auvergne réunissent chaque automne à Aubusson-d'Auvergne (Puy-de-Dôme) une série de courses, du speed-trail de 16 km au 100 miles. Deux formats entrent dans le plan : le Trail du Lac et le Trail des Druides. Distances à confirmer : les fiches publiées varient selon les éditions (jusqu'à 27 km pour le Trail du Lac).`,
      cible: { txt: 'Course plaisir, sans chrono.' },
      dossard: { statut: 'pas-ouvert', txt: 'Ouverture vers le 24 décembre 2027 à midi (pour 2026 : le 24 décembre 2025 à midi).' },
      role: `Course plaisir de fin de saison, sept semaines après le GRP, à choisir selon la récupération.`,
      strategie: `Au feeling : c'est la seule course du plan sans enjeu. Choisir le format en septembre, selon la récupération du GRP.`,
      logistique: `Aubusson-d'Auvergne (Puy-de-Dôme), ~4h de route depuis Paris, ou train jusqu'à Clermont-Ferrand puis ~45 min de voiture. Une nuit sur place la veille.`,
      resultat: null
    },
    {
      saison: 3, type: 'echeance', badge: 'Échéance · tirage au sort',
      date: '2029-01-10', quand: 'Janv. 2029', estimee: true,
      nom: "Tirage au sort de l'OCC 2029", court: 'Tirage OCC',
      specs: 'Stones gagnées avant le 31 déc. 2028 · pré-inscriptions début janvier · bonus mobilité de +30 % en venant en train',
      desc: `L'inscription à l'OCC passe par le tirage au sort UTMB de janvier. Il faut un UTMB Index valide et au moins une Running Stone ; chaque stone ajoute une chance, et seules celles gagnées avant le 31 décembre 2028 comptent pour 2029. Le plan en vise 6, plus le bonus mobilité de +30 % en venant en train.`
    },
    {
      saison: 3, type: 'final', badge: '🏔️ Objectif final · finisher',
      date: '2029-08-30T08:15', quand: '~Jeu. 30 août 2029', estimee: true,
      evenement: 'UTMB World Series Finals · catégorie 50K', nom: "L'OCC", court: 'OCC', etiquette: 'OCC',
      lien: 'https://montblanc.utmb.world/races/OCC',
      km: 60, dp: 3500, dm: 3300, lieu: 'Orsières → Champex → Chamonix', terrain: 'Tête de Balme (2 321 m), point culminant',
      index: '50K', noteKe: 'course en ligne, D− estimé',
      desc: `L'OCC — Orsières-Champex-Chamonix — est la finale 50K des UTMB World Series, courue le jeudi de la semaine de l'UTMB Mont-Blanc, fin août. Depuis 2026, le parcours fait 60 km pour 3 500 m D+ : départ à 8h15 de la place Centrale d'Orsières, Champex-Lac, La Giète, Trient, puis le col de Balme et la Tête de Balme (2 321 m), nouveau point culminant, avant le col des Posettes, Le Tour et les balcons nord jusqu'à Chamonix ; la montée de La Flégère a disparu. La date 2029 n'est pas encore publiée : le 30 août est une estimation.`,
      cible: { txt: 'Finisher.' },
      dossard: { statut: 'tirage', txt: 'Pré-inscriptions début janvier 2029, voir le bloc au-dessus.' },
      role: `L'objectif final. Le Tour du Moudang, couru un an plus tôt, en est l'équivalent : 114 km-effort contre 112, avec les mêmes montées longues.`,
      strategie: `Partir très lentement d'Orsières : la course se joue après Trient, dans la montée au col de Balme et à la Tête de Balme. Bâtons, manger dès la première heure, et garder des cuisses pour la descente finale vers Chamonix.`,
      logistique: `Chamonix (Haute-Savoie), ~6h de train depuis Paris — le bonus mobilité du tirage récompense justement le train. Départ d'Orsières, en Suisse : navette depuis Chamonix tôt le matin, à vérifier. Réserver l'hébergement dès le tirage, la semaine de l'UTMB affiche complet.`,
      planB: `OCC 2029 non tirée : les stones restent acquises, l'OCC passe en 2030.`,
      resultat: null
    }
  ]
};
