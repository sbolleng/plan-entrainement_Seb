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
| `/maj seance` | Une séance non trackée sur Strava, dictée dans le message | L'enregistrer dans le bon jour ; ajouter au catalogue tout exercice qui n'y figure pas |
| `/maj dossard` | Une inscription ouverte, prise, ou une date d'ouverture connue | Mettre à jour le statut dans Objectif et le bandeau « prochaine inscription » |
| `/maj course` | **Après avoir couru une course**, pas avant | Marquer l'étape faite dans la ligne de temps Objectif, enregistrer le résultat, recaler la suite du plan |
| `/maj renfo` | Lassitude des exercices, toutes les 2 à 3 semaines | Faire tourner les exercices de la semaine type en piochant dans le catalogue, dominantes inchangées |

### Exemples

```
/maj
/maj rapide
/maj semaine
/maj semaine du 10 au 16 août

/maj seance renfo hier : fentes bulgares 4x10, pont fessier 4x15, KB swing 3x15 10kg
/maj seance j'ai fait 30 min de vélo d'appart ce matin, pas tracké

/maj dossard je me suis inscrit à la VVX
/maj dossard les inscriptions du Sancy ouvrent le 4 novembre à 10h
/maj dossard Clam Trail : inscriptions ouvertes, 22 €

/maj course Clam Trail 18/10
/maj course Clam Trail 18/10, 20 K en 2h18, genou nickel, aucune douleur
/maj course j'ai abandonné Senlis au 20e km, genou

/maj renfo
/maj renfo j'en ai marre des fentes bulgares, remplace-les
```

Sans mot-clé reconnaissable, faire une mise à jour complète et tenir compte du
contexte donné dans la phrase.
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

Sur `/maj course` : ne marquer une étape comme faite que si la course a
réellement été courue. Enregistrer le temps réel à côté du temps cible,
indiquer si l'objectif est tenu, et recaler les phases suivantes en
conséquence — un abandon ou un temps très en dessous de la cible change la
suite du plan, pas seulement la ligne de temps.


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
