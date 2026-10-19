# Plan d'entraînement · consignes pour Claude

Deux sites d'entraînement publiés par GitHub Pages depuis `main` : celui de Seb (`index.html`, profil trail) et celui de JDP (`jdp.html`, profil route). Ils sont en maintenance : mises à jour de contenu et corrections, pas de fonctionnalité neuve. L'outil qui les remplacera, MyRunTools, se construit dans le dépôt `myruntools`, avec ses spécifications.

## Qui fait quoi

- `index.html`, `app.js`, `data/` : site de Seb, mis à jour par la commande `/maj` (`.claude/skills/maj/SKILL.md`, `MISE-A-JOUR.md`).
- `jdp.html`, `jdp.js`, `jdp.css` : site de JDP, mis à jour à la demande, dans la même discussion que celui de Seb.
- Partagés : `style.css`, `planning.js`, `palmares.js`. Ne pas toucher à la page de l'autre profil sans demande.

## Règles

- Ne jamais inventer de données : demander.
- Dépôt public : aucun nom complet de tiers, aucune référence de réservation, aucun secret.
- Tout fichier CSS ou JS modifié change de numéro dans son lien (`?v=AAAAMMJJx`), et la balise `site-version` de la page change aussi : c'est ce qui force les navigateurs, iPhone compris, à recharger.
- Circuit git : branche de la session, fusion dans `main` (`--no-ff`), envoi des deux, puis vérification que la publication GitHub Pages a réussi, avant d'annoncer que c'est en ligne.

## Quand Seb demande « la todo »

Toujours répondre en quatre blocs, dans cet ordre :
1. **Seb · courses et autres** (`index.html`) : liste « À faire cette semaine », kinés à venir, rappels.
2. **Seb · le site lui-même** (`index.html`) : corrections ou contenus en attente sur la page.
3. **JDP · courses et autres** (`jdp.html`) : onglet Pense-bête (dossards, hébergements, épargne).
4. **JDP · le site lui-même** (`jdp.html`) : la liste « En attente sur le site de JDP » ci-dessous.

« La todo de index » : blocs 1 et 2 seulement. « La todo de JDP » : blocs 3 et 4 seulement. Un bloc vide se dit (« rien en attente »), il ne disparaît pas.

## En attente sur le site de JDP (au 19 octobre 2026)

- Onglet « Palmarès V2 », provisoire : remplacer le Palmarès actuel quand Seb le valide.
- Dates 2027 de La Pins Just'à Pied et du Trail des 3 Rocs : ajouter compte à rebours et étape (`STEPS` de `jdp.js`) dès leur publication.
- Kilométrage des chaussures : Seb doit le demander à JDP.
- Planning : durées de préparation et de récupération à définir, plus tard.
