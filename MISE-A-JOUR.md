# Mise à jour du site

## La commande

Dans une session Claude Code ouverte sur ce dépôt :

```
/maj
```

C'est tout. Aucune commande git à taper : la session lit Strava, recale les
pages, committe, fusionne dans `main` et vérifie le déploiement.

### Variantes

| Commande | Effet |
|---|---|
| `/maj` | Mise à jour complète |
| `/maj rapide` | Chiffres et textes seulement, sans toucher à la mise en page |
| `/maj semaine` | Bascule sur la semaine calendaire en cours et régénère les sept jours |
| `/maj course Clam Trail 18/10` | Intègre un résultat de course et recale la suite du plan |
| `/maj renfo` | Fait tourner les exercices de la semaine type |

La commande est définie dans `.claude/skills/maj/SKILL.md`. Si elle n'est pas
reconnue, le prompt complet ci-dessous fait la même chose en copier-coller.

---

## Le prompt équivalent, en copier-coller

---

```
Fais la mise à jour complète du site.

1. DONNÉES
   - Lis Strava depuis la dernière date de mise à jour indiquée dans app.js
     (commentaire « données Strava, calculées le … ») jusqu'à aujourd'hui.
   - Relève pour chaque séance : date, nom, distance, temps, D+, cadence, FC,
     et les notes de la description (genou, cheville, ressenti, terrain).
   - Recalcule le mois en cours dans statsMonthly (distance, D+, dpk).
     Sur les mois de reprise course/marche, laisse allure, cadence, FC et
     efficience à null : les blocs de marche les faussent.
   - Recalcule le volume cumulé depuis nov. 2025.

2. PAGE « CETTE SEMAINE »
   - Bandeau : phase et semaine en cours, prochaine inscription à surveiller
     (première échéance du tableau des dossards de la page Objectif),
     prochaine course, objectif A.
   - Bloc de description : réécris les quatre paragraphes dans cet ordre —
     où on en est, la règle du palier, l'état du corps, ce qui décroche.
     Titre = le fait marquant de la semaine, pas un intitulé générique.
   - Jour par jour : régénère les sept jours de la semaine en cours avec
     data-date correct. Un carré COURSE (ou REPOS) + un carré RENFO par jour.
     Sur les jours passés, indique ce qui a réellement été fait d'après Strava.
     Si l'écart au protocole est significatif (palier sauté, repos non pris,
     dénivelé sur une séance censée être plate), dis-le et adapte la
     recommandation du jour au lieu de recopier le plan.

3. PAGE « PLAN »
   - Tableau de la phase 0 : coche les séances réalisées avec leur date,
     marque les sautées, mets à jour la colonne État et surligne la semaine
     en cours (classe plan-race sur la ligne).
   - Si la reprise est terminée, bascule le surlignage sur la phase suivante.
   - Vérifie que les périodes des tableaux de phase sont toujours cohérentes
     avec le calendrier réel et les dates de course retenues.

4. PAGE « PROFIL »
   - Données actuelles : sorties/semaine, renfo, volume cumulé, dernière
     course, vélo, cadence, FC.
   - Bloc « Progression & stats » : réécris l'analyse. Elle doit dire ce qui
     progresse, ce qui stagne, ce qui décroche, et se terminer par trois
     conseils concrets pour les semaines qui viennent. Appuie chaque
     affirmation sur un chiffre.
   - Mets à jour la date sur les six lignes « Mis à jour le … » des graphes.

5. PAGE « OBJECTIF 26-27 »
   - Vérifie les dates d'ouverture des dossards des courses dont l'ouverture
     approche ; cherche sur le web si besoin.
   - Si une inscription est ouverte ou imminente, remonte-la dans le bandeau
     « prochaine inscription » de la page Cette semaine.

6. PUBLICATION
   - Commit sur la branche de travail, merge dans main, push.
   - Vérifie que le déploiement GitHub Pages passe au vert.
   - Résume-moi ce qui a changé et ce qui mérite mon attention.
```

---

## Variantes utiles

- **Mise à jour rapide** (données seulement, sans retoucher la mise en page) :
  ajouter « Ne touche qu'aux chiffres et aux textes, pas à la structure. »
- **Changement de semaine** : ajouter « On passe à la semaine du JJ au JJ MOIS,
  régénère les sept jours. »
- **Après une course** : ajouter « J'ai couru NOM le JJ/MM. Intègre le résultat,
  marque l'étape comme faite dans la ligne de temps Objectif, et recale la
  suite du plan. »

## Rappels de contexte

- Le site est publié par GitHub Pages depuis `main`. Toute mise à jour doit
  être fusionnée dans `main` pour être visible.
- La page est protégée par un mot de passe côté client, sans valeur de
  sécurité : ne pas y mettre d'information sensible.
- Les mois de reprise course/marche ne sont pas comparables aux mois de course
  continue sur l'allure, la cadence et l'efficience cardiaque.
- L'écart déterminant pour le Sancy est le D+ par kilomètre : environ 10 m/km
  aujourd'hui, 60 m/km demandés par la course.
