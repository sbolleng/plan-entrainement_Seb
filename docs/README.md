# Documentation du projet

Ce dossier rassemble les spécifications de l'application : ce qu'elle fait, comment elle est organisée, et les décisions prises en chemin. Il est mis à jour en même temps que le code.

> Le dépôt est public : aucune donnée personnelle dans ces fichiers.

## Sommaire

| Document | Contenu | État |
| --- | --- | --- |
| [Spécification générale](specification-generale.md) | Structure commune, en-tête, thèmes, modules, administration par l'utilisateur, données | Brouillon v0.1 |
| [Page Objectif](page-objectif.md) | Premier module : feuille de route, comptes à rebours, difficulté, suivi en course, météo | Brouillon v0.1 |

Une spécification est rédigée pour chaque module au moment de le construire, pas avant.

## Le projet en bref

Une application web modulaire pour les coureurs sur piste, sur route et en trail : un point d'entrée unique pour planifier ses courses, suivre sa préparation, sa nutrition, son matériel et sa logistique. Chaque coureur active les modules utiles à sa pratique. Deux profils pilotes : un profil trail (objectif UTMB OCC, août 2028) et un profil route (objectif Marathon de Rome, mars 2028).

## Feuille de route

| Jalon | Échéance | Contenu |
| --- | --- | --- |
| 1 | 10 octobre 2026 | Nom de l'application ; socle commun (navigation, configuration par utilisateur, thèmes, en-tête) ; module Objectif ; module Courses à surveiller |
| 2 | Non daté | Supabase (comptes, données privées) ; Réglages ; module Nutrition |
| 3 | Non daté | Guide ; Profil et Palmarès ; Cette semaine |
| En parallèle, après Supabase | Non daté | Import Strava automatique ; bilan hebdomadaire par Claude |
| À positionner | — | Calculatrice ; Logistique ; Matériel |

Chaque module suit le même cycle : spécification, modèle de données, maquette validée, développement, contenus, mise en production.

## Journal des décisions

La plus récente en haut.

| Date | Sujet | Décision |
| --- | --- | --- |
| 5 oct. 2026 | Documentation | Les spécifications vivent en Markdown dans `docs/`, à côté du code ; une présentation sert à présenter le projet. La note de cadrage n'est plus tenue à jour. |
| 5 oct. 2026 | Confidentialité | Le site sera protégé par la connexion Supabase (comptes individuels), pas par un hébergement à accès restreint. Le dépôt reste public ; chaque module devient privé quand son contenu passe dans Supabase. |
| 5 oct. 2026 | En-tête | Décrit comme un chapitre de la spécification générale, pas dans un document séparé. |
| 4 oct. 2026 | Calendrier | Jalon 1 au 10 octobre 2026 : nom, socle et module Objectif, Courses à surveiller. |
| 4 oct. 2026 | En-tête | Compteur toujours aligné en haut du titre, à toutes les résolutions ; ligne « prochaine étape » sous les indicateurs ; type de course en blanc, nom de la course en couleur d'accent. |
| 4 oct. 2026 | Nom | « Ravito » écarté, déjà utilisé. |
| 4 oct. 2026 | Suivi en course | Temps saisis en chiffres seuls acceptés (2629 = 26:29), le clavier numérique des téléphones n'ayant pas de « : ». |
| 3 oct. 2026 | En-tête | Style éditorial ; quatre indicateurs : distance, D+ (en km, arrondi), objectif, date ; identique sur toutes les pages ; nom de l'application en haut à droite. |
| 3 oct. 2026 | Objectif | Suivi en course et météo actifs par défaut ; graphique de difficulté affiché pour tous, repliable. |
| 3 oct. 2026 | Modules | Ordre : Objectif, Courses à surveiller, Nutrition, Guide, Profil et Palmarès, Cette semaine. |
| 3 oct. 2026 | Thèmes | Trail en bleu et orange, route en vert et rose. |
| 3 oct. 2026 | Vision | Application modulaire, activation des modules par utilisateur ; deux profils pilotes, ouverture possible ; application web, sans installation. |
| Oct. 2026 | Données | Supabase retenu ; trois automatisations prioritaires : import Strava, bilan hebdomadaire, suivi du plan nutritionnel. |

## Idées de modules

Idées notées pour plus tard, sans jalon.

### Calendrier annuel des courses (idée du 5 oct. 2026)

Une vue de l'année d'un seul tenant, pour voir le planning en un coup d'œil, pas un simple récapitulatif.

- Les 12 mois visibles ensemble, un petit carré par jour.
- Chaque course est un carré de couleur vive à sa date (par exemple rouge ; l'objectif plus marqué).
- Un liseré part de chaque course et remonte dans le temps sur la durée de sa préparation : deux liserés qui se superposent signalent deux préparations qui se chevauchent.
- Les jours sans course ni liseré font apparaître les plages libres pour la récupération et la préparation.
- Construit à partir de la même liste de courses que la page Objectif, sans double saisie.

À trancher le moment venu :

- [ ] Durée de préparation : fixée par type de course, ou saisie course par course ?
- [ ] Liseré de récupération après chaque course, d'une autre couleur ?
- [ ] Période affichée : année civile, ou 12 mois glissants ?
- [ ] Module à part (« Calendrier »), ou bloc de la page Objectif ?

## Questions ouvertes

- [ ] **Nom de l'application** : à arrêter d'ici au 10 octobre 2026 (recommandation : MyRunTools ; disponibilité à vérifier).
- [ ] **Supabase** : plus tôt dans la feuille de route, puisqu'il porte désormais la confidentialité du site ?
- [ ] **Piste** : couverte dès le lancement, ou plus tard faute de profil pilote ?
- [ ] **Calculatrice** : liste des calculs à valider ; livraison anticipée possible, car elle ne dépend d'aucune donnée.
- [ ] **Ravitaillement en course** : repères de référence (glucides et eau par heure).
- [ ] **Matériel** et **Logistique** : périmètre de chaque module.
- [ ] **Renforcement musculaire** : module dédié, ou intégré à Profil ou à Cette semaine ?
- [ ] **Types de course** proposés dans l'en-tête : Trail court, Trail, Trail long, Ultra, Marathon, Semi-marathon, 10 km, Piste. Liste complète ?
- [ ] **Adresse d'accès** : une adresse par utilisateur, ou une adresse unique avec connexion ?
