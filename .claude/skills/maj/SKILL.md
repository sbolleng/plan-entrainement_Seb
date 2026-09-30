---
name: maj
description: Met à jour le site d'entraînement de Seb à partir de Strava, puis publie en ligne. À utiliser quand Seb tape "/maj", demande une mise à jour du site, du plan, des stats ou de la semaine, ou signale une séance, une course courue ou une inscription ouverte.
---

# Mise à jour du site d'entraînement

Le site est publié par GitHub Pages depuis `main`. Toute mise à jour n'est
visible qu'une fois fusionnée dans `main`.

## Arguments

Tout ce qui suit `/maj` est du texte libre : inutile de respecter une syntaxe.
Les mots-clés ci-dessous orientent le travail, le reste de la phrase donne le
contexte.

| Commande | Quand l'utiliser | Ce qui est fait |
|---|---|---|
| `/maj` | Retour après quelques jours, ou doute sur la fraîcheur du site | Étapes 1 à 6 |
| `/maj rapide` | Juste après une séance, pour recaler les chiffres | Étapes 1, 2 et 6. Ne toucher ni à la structure ni à la mise en page |
| `/maj semaine` | Un lundi, quand la page affiche encore la semaine écoulée | Basculer sur la semaine calendaire en cours et régénérer les sept jours |
| `/maj seance` | Une séance non trackée sur Strava, dictée dans le message | L'ajouter à `data/renfo.js`, l'enregistrer dans le bon jour, et compléter le catalogue si un exercice y manque |
| `/maj dossard` | Une inscription ouverte, prise, ou une date d'ouverture connue | Mettre à jour le statut dans Objectif et le bandeau « prochaine inscription » |
| `/maj course` | **Après avoir couru une course**, pas avant | Marquer l'étape faite dans la ligne de temps Objectif, enregistrer le résultat, recaler la suite du plan |
| `/maj renfo` | Lassitude des exercices, toutes les 2 à 3 semaines | Faire tourner les exercices de la semaine type en piochant dans le catalogue, dominantes inchangées |
| `/maj repas` | Seb dicte ce qu'il a mangé, à tout moment de la journée | L'ajouter à `data/nutrition.js` sous le jour du message, avec ses macros estimées (p/g/l/f/s) |

### Exemples

```
/maj
/maj rapide
/maj semaine
/maj semaine du 10 au 16 août

/maj seance renfo hier : fentes bulgares 4x10, pont fessier 4x15, KB swing 3x15 10kg
/maj seance j'ai fait 30 min de vélo d'appart ce matin, pas tracké

/maj dossard je me suis inscrit à la VVX
/maj dossard les inscriptions de la Directissime ouvrent le 4 novembre à 10h
/maj dossard Clam Trail : inscriptions ouvertes, 22 €

/maj course Clam Trail 18/10
/maj course Clam Trail 18/10, 20 K en 2h18, genou nickel, aucune douleur
/maj course j'ai abandonné Senlis au 20e km, genou

/maj repas ce midi : poulet, riz, légumes vapeur
/maj repas petit-déj : 2 œufs, pain complet, purée d'amande

/maj renfo
/maj renfo j'en ai marre des fentes bulgares, remplace-les
```

Sans mot-clé reconnaissable, faire une mise à jour complète et tenir compte du
contexte donné dans la phrase.

## Archivage du 27 septembre 2026 · Plan et Cette semaine gelés

Seb construit désormais son plan d'entraînement dans **RunMotion**. Les pages
**Cette semaine** et **Plan** ont été glissées dans un nouvel onglet
**Archives** (`showSubsection`, ids `arch-semaine` et `arch-plan`) et **ne
sont plus mises à jour** — elles restent gelées telles qu'elles étaient à
l'archivage, pour l'historique. En conséquence, **les étapes 2 et 3
ci-dessous sont suspendues** jusqu'à nouvel ordre : ne plus régénérer les
jours de la semaine ni toucher aux tableaux de phase. Elles restent
documentées plus bas au cas où Seb reviendrait un jour sur ce choix.

Un `/maj` couvre donc désormais les étapes **1** (données Strava), **3 bis**
(journal de renfo), **4** (Profil) et **5** (Objectif 26-27), puis la
publication (étape 6). Le point d'entrée par défaut du site est **Objectif
26-27** (demande explicite de Seb le 27/09/2026). Une nouvelle page
**Palmarès** existe aussi depuis cette date (voir étape 5), ainsi qu'une page
**Nutrition** (28/09/2026, voir étape 3 ter) entre Objectif et Palmarès dans
la nav.

## Le genou n'est plus un sujet d'analyse (27/09/2026)

Demande explicite de Seb : **arrêter de centrer les analyses sur le genou**,
c'est derrière lui maintenant. En pratique :
- Ne plus demander confirmation du ressenti genou après une grosse séance
  (le réflexe `AskUserQuestion` utilisé jusqu'ici est abandonné).
- Ne plus écrire de paragraphe d'analyse centré sur « le genou tient/lâche » —
  dans Profil, Objectif ou ailleurs. Parler plutôt en termes de forme,
  d'intensité, d'endurance, de tonnage renfo : les métriques normales d'un
  athlète qui s'entraîne, sans arrière-plan médical.
- Les descriptions techniques d'exercices dans Guide → Renfo peuvent
  continuer à mentionner le genou comme articulation travaillée (c'est de
  l'anatomie, pas de l'inquiétude) — la nuance porte sur le ton, pas sur le
  mot.
- Ne plus utiliser « depuis/avant la fissure » comme repère temporel ; dire
  « depuis la reprise » ou donner une date si besoin.

## 1 · Données Strava

Lire Strava depuis la date indiquée dans `app.js` (commentaire « données
Strava, calculées le … ») jusqu'à aujourd'hui. Relever pour chaque séance :
date, nom, distance, temps de déplacement et temps écoulé, D+, cadence, FC,
et les notes de la description — genou, cheville, ressenti, terrain.

**Ne jamais faire confiance au titre d'une séance : recouper avec la durée.**
Le protocole donne une durée théorique exacte par palier (5 min de marche +
N blocs + 5 min de marche). Une séance titrée 6×(2'C/1'M) qui dure 25 min est
un 5×. Signaler tout écart entre le titre et la durée.

Recalculer le mois en cours dans `statsMonthly` (`app.js`) : distance, D+,
dpk, mais aussi **allure d'effort, cadence, FC et efficience** dès que le
mois est un mois de course continue (la reprise course/marche est terminée
depuis septembre 2026). Pour chaque métrique, pondérer par le temps de
déplacement de chaque sortie du mois (pas une simple moyenne arithmétique) :
- **paceSecPerKm** (allure d'effort) = somme des temps de déplacement ÷
  somme des km-effort (km-effort = km + D+/100 par sortie).
- **cadenceSpm** = somme (cadence Strava × temps) ÷ somme des temps, **×2**
  (Strava rapporte une cadence par jambe, le site affiche la cadence totale).
- **hrBpm** = somme (FC moyenne × temps) ÷ somme des temps.
- **effBeats** = somme des battements (FC moyenne × minutes) ÷ somme des
  km-effort.

Récupérer FC moyenne et cadence par sortie via `get_activity_performance`
(Strava), pas seulement `list_activities` qui ne les donne pas. Recalculer
le volume cumulé depuis novembre 2025 — **l'historique n'est pas effacé**,
il reste affiché sur tous les graphes.

**Important, ne pas confondre avec un « nouveau départ » :** `statsMonthly`
garde tout son historique nov. 2025 → août 2026. Juillet et août restent à
`null` sur allure/cadence/FC/efficience (mois de reprise course/marche, pas
comparables) — **c'est un trou volontaire, à laisser tel quel**, pas une
absence de données à combler. Septembre referme ce trou avec de vraies
valeurs calculées (premier mois de course continue depuis juin) ; chaque
mois suivant s'ajoute normalement à la suite du tableau. Les 6 graphes de
Profil utilisent tous `seriesFrom()` sur ce même tableau. Le graphe D+/km
(`chart-dpk`) a sa propre série codée en dur dans `renderStatsCharts()`
(23 points mensuels, nov. 2025 → sept. 2027, le dpk n'étant jamais nullé
même sur les mois de reprise) : y ajouter la valeur réelle du mois à son
index à chaque `/maj`.

## 2 bis · Nouvelle page « Cette semaine » (29/09/2026)

Seb a redemandé une page **Cette semaine** vivante (`#semaine`, premier onglet,
actif par défaut) — distincte de l'ancienne, qui reste gelée dans Archives.
Ce n'est plus un plan d'entraînement (il vit dans RunMotion, auquel on n'a
pas accès) mais une **liste de tout ce que Seb a à faire** dans la semaine :

- **Bandeau** : semaine, inscription à prendre en priorité, prochaine course,
  objectif A (La Directissime).
- **À faire cette semaine** (`.todo-list`, `.todo-item.is-urgent` pour le plus
  pressé) : dossards à prendre, kinés à venir, mesures à refaire (FC repos),
  réservations, rappels nutrition, infos à m'envoyer.
- **Jour par jour** : kinés (depuis le commentaire du calendrier kiné dans
  Archives → Plan), séances réelles d'après Strava, et « Séance RunMotion »
  pour les jours à venir tant que Seb ne les a pas dictées. Ne jamais
  inventer le contenu d'une séance RunMotion.

À régénérer sur `/maj semaine` et à rafraîchir sur tout `/maj`.

## 2 · Ancienne page « Cette semaine » — suspendue depuis le 27/09/2026, voir plus haut

- **Bandeau** : phase et semaine en cours, prochaine inscription à surveiller
  (première échéance du tableau des dossards de la page Objectif), prochaine
  course, objectif A.
- **Bloc de description** : réécrire les quatre paragraphes dans cet ordre —
  où on en est, la règle du palier, l'état du corps, ce qui décroche. Le titre
  est le fait marquant de la semaine, pas un intitulé générique.
- **Jour par jour** : régénérer les sept jours avec le bon `data-date`. Un
  carré COURSE (ou REPOS) et un carré RENFO par jour. Sur les jours passés,
  indiquer ce qui a réellement été fait d'après Strava.

Si l'écart au protocole est significatif — palier sauté, repos non pris,
dénivelé sur une séance censée être plate — le dire et **adapter la
recommandation du jour** au lieu de recopier le plan.

## 3 · Page « Plan » — suspendu depuis le 27/09/2026, voir plus haut

Dans le tableau de la phase 0 : cocher les séances réalisées avec leur date,
marquer les sautées, mettre à jour la colonne État, et déplacer la classe
`plan-race` sur la ligne de la semaine en cours. Si la reprise est terminée,
basculer le surlignage sur la phase suivante.

Vérifier que les périodes des tableaux de phase restent cohérentes avec le
calendrier réel et les dates de course retenues.

Les tableaux de phase (Phase 1 et suivantes) sont des **gabarits génériques
sur plusieurs semaines** — ne pas y inscrire de date précise de kiné, ça ne
serait juste que pour une semaine sur les deux ou trois que couvre la ligne.
Les dates précises de kiné vivent dans « Cette semaine », qui elle est
régénérée chaque semaine avec les vraies dates. Le calendrier des rendez-vous
de kiné à venir est gardé dans un commentaire HTML juste avant le tableau de
la phase en cours (non affiché sur le site, sur demande de Seb) : y piocher
les dates qui tombent dans la semaine affichée pour construire les jours de
« Cette semaine », et mettre ce commentaire à jour au fil des nouveaux
rendez-vous que Seb communique.

Partout où une séance de kiné apparaît avec une date fixe (jour de « Cette
semaine », ligne renfo d'un tableau de phase qui liste des semaines
spécifiques comme l'ancien tableau de reprise) — utiliser la classe `.kine`
sur le texte et `has-kine` sur la cellule (`<td class="has-kine">`) plutôt que
des couleurs en dur : c'est ce qui distingue visuellement un rendez-vous
imposé d'un créneau de renfo qu'on choisit soi-même.

## 3 bis · Journal de renfo

Toute séance de renforcement, qu'elle vienne d'une description Hevy sur Strava
ou d'un message de Seb, doit être ajoutée à **`data/renfo.js`** — c'est la
source de vérité de l'historique, et les indicateurs de Profil en découlent.
Renseigner date, source, durée, puis chaque exercice avec sa dominante, ses
séries, ses répétitions et sa charge (0 pour le poids du corps, `tenue: true`
si les répétitions sont des secondes). Mettre à jour le champ `maj`.

**Sur les mouvements dynamiques (crunch, russian twist, fentes, squat…),
privilégier un nombre de répétitions plutôt qu'un temps** quand on propose une
séance : un temps fixe pousse à bâcler l'amplitude en fin de bloc pour
« remplir » le chrono, et ne se compare pas d'une séance à l'autre. Garder le
temps uniquement pour les tenues statiques (gainage sous toutes ses formes) où
il n'y a rien à répéter.

Garder les noms d'exercices **strictement identiques** d'une séance à l'autre :
c'est sur le nom que se calcule la progression de charge. Tout exercice absent
du catalogue de Guide → Renfo doit y être ajouté dans le même passage.

## 3 ter · Page Nutrition (28/09/2026)

Page de suivi quotidien, entre Objectif et Palmarès dans la nav. **Pas de
formulaire de saisie sur la page** — Seb dicte ce qu'il mange par message
(`/maj repas`), tout se passe dans `data/nutrition.js` et se recalcule à la
publication :

- **`NUTRITION_TARGETS`** : fourchette du jour pour 8 clés — p/g/l/f/s
  (protéines/glucides/lipides/fibres/sel, en grammes), `w` (eau, en litres),
  `cafe` et `alcool` (nombre de fois, pas des grammes). `capBasis` = ce que
  représente un cercle plein sur les jauges. `sources` (aliments concrets,
  ex. *œuf, fromage blanc, steak, poulet, raisin* — jamais une catégorie
  vague seule comme « fruits ») ne s'applique qu'à p/g/l/f. Les nutriments à
  plafond seul (`s`, `cafe`, `alcool`) portent plutôt `overAdvice` /
  `nearAdvice` / `fineAdvice` — trois phrases selon que la valeur du jour
  dépasse, approche (≥ 80 %) ou reste sous le plafond ; l'eau (plancher seul)
  a un simple rappel codé dans `renderNutrition()`, pas de champ dédié.
  Ne changer ces cibles que si Seb en donne de nouvelles — il a prévenu que
  les glucides bougeraient à l'approche d'une course, et préviendra lui-même.
- **`NUTRITION_LOG.jours`** : un objet par jour (`date`, `repas: [...]`),
  chaque repas portant `when`, `what` et ses valeurs pour les 8 clés (0 pour
  celles qui ne s'appliquent pas) — un café ou un verre d'eau sont des
  « repas » comme un autre, juste avec le reste à 0. Sur `/maj repas`,
  ajouter le repas au jour du message (créer le jour s'il n'existe pas
  encore), et mettre à jour le champ `maj`.
- **`NUTRITION_PAIR_MEALS`** : propositions de repas concrets (pas une simple
  liste d'aliments) pour les paires de nutriments les plus fréquemment en
  retard ensemble. Étendre cette table plutôt que la carte Conseil elle-même
  si de nouvelles combinaisons reviennent souvent.

Tout le rendu (jauges du jour, carte Conseil, mosaïque du mois, séries en
cours/meilleure) est calculé par `renderNutrition()` dans `app.js` à partir
de ces trois structures — rien à écrire à la main dans `index.html`.
**Calculatrice « Mon besoin du jour » (30/09/2026)**, en haut de la page,
toujours ouverte. Réplique l'onglet « DEJ (journée) » de la calculette Excel
de Seb : métabolisme de base de Black et al. (homme 1,083 × P^0,48 × T(m)^0,5
× âge^−0,13 × 1000/4,1855 ; femme 0,963) × niveau d'activité hors sport
(1,2 / 1,3 / 1,45 / 1,6) + Σ MET × poids × heures (3 sports max, liste
courte de l'Excel + CrossFit). Répartition selon les repères de Seb :
protéines 1,4–2 g/kg, glucides 50–60 % et lipides 25–35 % des kcal
(carbo-loading 65–75 % / 15–25 %, veille 55–65 % / 15–25 %), fibres ≥ 30 g
(≤ 15 g en carbo-loading et veille), eau ≥ 2 L + 0,5 L par heure de sport.
Profil par défaut dans `NUTRITION_PROFILE` (public) ; ce que Seb saisit sur
son téléphone est gardé dans son navigateur (`localStorage`) et prend le pas.
Quand Seb me dit son sport du jour, l'ajouter au jour dans
`NUTRITION_LOG.jours` sous `calc: { nap, phase, sports: [['j95', 1]] }` :
les jours passés sont alors jugés sur leurs vraies cibles sur tous les
appareils. Sans rien, un jour passé garde les cibles fixes.

**Comment accompagner Seb sur la nutrition** (demandé le 30/09/2026) : à
chaque repas décrit, donner la répartition glucides / protéines / lipides du
repas, dire si c'est adapté à la phase du jour (il précise sa séance du
jour), et ce qu'il faut ajuster ou compléter aux prochains repas ou
collations. Ses repères : glucides 5–7 g/kg en modéré, 7–10 g/kg en intense ;
protéines 1,4 g/kg en modéré, 2 g/kg en intense ; lipides ~30 %, 20 %
(1,3 g/kg) avant compétition ; fibres 30 g, à réduire fortement à
l'approche d'une course. Vigilance fer, sodium, antioxydants, vitamines B.
Dernier repas 2–4 h avant l'effort : 60 % glucides, 15–20 % protéines
maigres, 20 % lipides insaturés, peu de fibres. Avant une course : J-14 à
J-4 habitudes saines, arrêt de l'alcool ; J-3 à J-1 carbo-loading (glucides
70 %, féculents blancs, sans légumineuses, crucifères, complets, oléagineux,
épices) ; veille glucides 60 %, lipides 20 % ; jour J petit-déjeuner 2–3 h
avant (gâteau au yaourt, banana bread, pancakes + miel + yaourt + banane,
fromage blanc + muesli + banane + miel, ou pain + œuf + fromage) ; pendant
l'effort 30–60 g de glucides par heure ; après, boisson sodium + glucides
et 1–1,2 g/kg de glucides dans l'heure.

L'**historique** sous la mosaïque (un bloc repliable par mois, mois le plus
récent ouvert, jours notés seulement, du plus récent au plus ancien, colonne
Date figée sur téléphone) est calculé de la même façon par
`renderNutritionHistory()`.

## 4 · Page « Profil »

Données actuelles : sorties par semaine, renfo, volume cumulé, dernière
course, vélo, cadence, FC.

Réécrire le bloc « Progression & stats » : ce qui progresse, ce qui stagne, ce
qui décroche, puis trois conseils concrets pour les semaines qui viennent.
**Appuyer chaque affirmation sur un chiffre.** Mettre à jour la date des six
lignes « Mis à jour le … » sous les graphes.

Le bloc « Renfo · suivi » se calcule tout seul depuis `data/renfo.js` : tuiles,
tonnage hebdomadaire et progression par exercice. Rien à écrire à la main.

## 5 · Page « Objectif 26-27 »

Depuis le 27/09/2026, chaque étape de la ligne de temps (`.race-step`) suit
une structure fixe à 5 cellules dans son `.rs-grid` (2 colonnes, la dernière
en pleine largeur via `.rs-cell.is-wide`) :
1. **Objectif · temps cible** — temps visé, mode finisher ou chrono.
2. **Dossard** — pris / à faire / pas encore ouvert. Chercher sur le web la
   date d'ouverture quand elle n'est pas connue plutôt que de deviner ; si
   l'info reste introuvable ou contradictoire, le dire explicitement et
   proposer une meilleure estimation sourcée plutôt qu'un silence.
3. **Rôle dans la prépa** — ce que cette course apporte (ou n'apporte pas)
   pour la Directissime : terrain, D+/D−, distance, place dans le bloc. Analyse de
   forme et de spécificité, pas de bulletin médical.
4. **Stratégie** — comment bien gérer la course pour aller au bout : allure,
   ravitaillement, gestion du terrain. Pas de cadrage genou (voir plus haut).
5. **Logistique** (`.rs-cell.is-wide`) — trajet depuis Paris, nuit sur place
   ou non, météo/saison, réservation d'hébergement, matériel spécifique.

Le paragraphe `.rs-desc` sous le compte à rebours doit être une description
factuelle de la course (terrain, histoire, format), trouvée sur le web —
plus un récit centré sur l'état de forme de Seb.

Sur `/maj course` : ne marquer une étape comme faite que si la course a
réellement été courue. Enregistrer le temps réel à côté du temps cible,
indiquer si l'objectif est tenu, recaler les phases suivantes en conséquence,
et **ajouter le résultat à la page Palmarès** (tableau chronologique des
courses courues, section `#palmares`) — un abandon ou un temps très en
dessous de la cible change la suite du plan, pas seulement la ligne de temps.

Vérifier les dates d'ouverture des dossards dont l'échéance approche, en
cherchant sur le web si besoin. Si une inscription est ouverte ou imminente,
le signaler à Seb.

## Page « Palmarès »

Page `#palmares`, entre Objectif et Profil dans le DOM (nav : juste après
Objectif 26-27). Deux blocs : un tableau de résultats de courses (rempli au
fil des `/maj course`), et le tableau « Meilleurs temps » dupliqué depuis
Profil — les deux copies doivent rester synchronisées si l'une des deux
change.

## 6 · Publication

**Avant de committer, incrémenter la version partout d'un coup** : la balise
`<meta name="site-version">` et le paramètre `?v=` de `style.css`,
`data/renfo.js`, `data/nutrition.js` et `app.js` dans `index.html` (plus
`style.css` dans `jdp.html`), au format `AAAAMMJJ` suivi d'une lettre si
plusieurs publications dans la journée — un simple `sed` sur l'ancienne
valeur suffit. Sans ça, les navigateurs servent l'ancien JavaScript et
l'ancienne feuille de style depuis leur cache. La balise `site-version` sert
en plus à `checkNewVersion()` (app.js) : un onglet resté ouvert ou une page
servie depuis le cache se recharge tout seul dès qu'une version plus récente
est en ligne — à condition qu'elle soit plus grande que la précédente.

Committer sur la branche de travail, fusionner dans `main`, pousser, puis
vérifier que le déploiement GitHub Pages passe au vert. Résumer ce qui a
changé et ce qui mérite l'attention de Seb.

## Contexte à garder en tête

- Le site est public : dépôt public servi par GitHub Pages, sans
  authentification. N'y mettre aucune information sensible.
- Depuis le 29/09/2026, l'objectif final n'est plus le Sancy mais **la
  Directissime** des Grands Trails Esprit Volcans (34 km, +770 m / −1 800 m,
  ~12 sept. 2027, du sommet du puy de Dôme à Cournon). L'écart déterminant
  est donc la **descente** : 53 m/km de D− le jour J, rien de comparable dans
  l'entraînement actuel. Le D+ (23 m/km) passe au second plan.
- Le renfo cuisses et stabilité est le seul levier direct sur la descente.
- Le renfo est réparti sur trois pages sans redondance : **Plan** (archivé)
  portait la prescription par phase, **Guide → Renfo** garde le catalogue et
  la semaine type, **Profil** le suivi de ce qui est réellement fait.
- Les dominantes de la semaine type sont fixes, les exercices tournent.
