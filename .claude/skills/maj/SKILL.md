---
name: maj
description: Met à jour le site d'entraînement de Seb à partir de Strava, puis publie en ligne. À utiliser quand Seb tape "/maj", demande une mise à jour du site, du plan, des stats ou de la semaine, ou signale une séance, une course courue ou une inscription ouverte.
---

# Mise à jour du site d'entraînement

Le site est publié par GitHub Pages depuis `main`. Toute mise à jour n'est
visible qu'une fois fusionnée dans `main`.

## Arguments

| Argument | Effet |
|---|---|
| *(aucun)* | Mise à jour complète : étapes 1 à 6 |
| `rapide` | Étapes 1, 2 et 6 seulement. Ne toucher ni à la structure ni à la mise en page |
| `semaine` | Basculer la page « Cette semaine » sur la semaine calendaire en cours et régénérer les sept jours |
| `course <nom> <date>` | Intégrer un résultat de course : marquer l'étape faite dans la ligne de temps Objectif et recaler la suite du plan |
| `renfo` | Faire tourner les exercices de la semaine type en piochant dans le catalogue, dominantes inchangées |

## 1 · Données Strava

Lire Strava depuis la date indiquée dans `app.js` (commentaire « données
Strava, calculées le … ») jusqu'à aujourd'hui. Relever pour chaque séance :
date, nom, distance, temps de déplacement et temps écoulé, D+, cadence, FC,
et les notes de la description — genou, cheville, ressenti, terrain.

**Ne jamais faire confiance au titre d'une séance : recouper avec la durée.**
Le protocole donne une durée théorique exacte par palier (5 min de marche +
N blocs + 5 min de marche). Une séance titrée 6×(2'C/1'M) qui dure 25 min est
un 5×. Signaler tout écart entre le titre et la durée.

Recalculer le mois en cours dans `statsMonthly` : distance, D+, dpk. Sur les
mois de reprise course/marche, laisser allure, cadence, FC et efficience à
`null` — les blocs de marche les faussent et les rendent incomparables aux
mois de course continue. Recalculer le volume cumulé depuis novembre 2025.

## 2 · Page « Cette semaine »

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

## 3 · Page « Plan »

Dans le tableau de la phase 0 : cocher les séances réalisées avec leur date,
marquer les sautées, mettre à jour la colonne État, et déplacer la classe
`plan-race` sur la ligne de la semaine en cours. Si la reprise est terminée,
basculer le surlignage sur la phase suivante.

Vérifier que les périodes des tableaux de phase restent cohérentes avec le
calendrier réel et les dates de course retenues.

## 4 · Page « Profil »

Données actuelles : sorties par semaine, renfo, volume cumulé, dernière
course, vélo, cadence, FC.

Réécrire le bloc « Progression & stats » : ce qui progresse, ce qui stagne, ce
qui décroche, puis trois conseils concrets pour les semaines qui viennent.
**Appuyer chaque affirmation sur un chiffre.** Mettre à jour la date des six
lignes « Mis à jour le … » sous les graphes.

## 5 · Page « Objectif 26-27 »

Vérifier les dates d'ouverture des dossards dont l'échéance approche, en
cherchant sur le web si besoin. Si une inscription est ouverte ou imminente,
la remonter dans le bandeau « prochaine inscription » de la page Cette
semaine.

## 6 · Publication

Committer sur la branche de travail, fusionner dans `main`, pousser, puis
vérifier que le déploiement GitHub Pages passe au vert. Résumer ce qui a
changé et ce qui mérite l'attention de Seb.

## Contexte à garder en tête

- La page est protégée par un mot de passe côté client, sans valeur de
  sécurité : n'y mettre aucune information sensible.
- L'écart déterminant pour le Sancy est le D+ par kilomètre : environ 10 m/km
  aujourd'hui, 60 m/km demandés par la course.
- Le renfo cuisses et stabilité est le seul levier direct sur la descente,
  qui est ce qui fait réagir le genou.
- Le catalogue d'exercices vit dans Guide → Renfo. Les dominantes de la
  semaine type sont fixes, les exercices tournent.
