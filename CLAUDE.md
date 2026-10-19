# Plan d'entraînement · consignes pour Claude

Deux sites d'entraînement publiés par GitHub Pages depuis `main` : celui de Seb (`index.html`, profil trail) et celui de JDP (`jdp.html`, profil route). Ils sont en maintenance : mises à jour de contenu et corrections, pas de fonctionnalité neuve. L'outil qui les remplacera, MyRunTools, se construit dans le dépôt `myruntools`, avec ses spécifications.

## Qui fait quoi

- `index.html`, `app.js`, `data/` : site de Seb, mis à jour par la commande `/maj` (`.claude/skills/maj/SKILL.md`, `MISE-A-JOUR.md`).
- `jdp.html`, `jdp.js`, `jdp.css` : site de JDP, dans sa discussion dédiée.
- Partagés : `style.css`, `planning.js`, `palmares.js`. Ne pas toucher à la page de l'autre profil sans demande.

## Règles

- Ne jamais inventer de données : demander.
- Dépôt public : aucun nom complet de tiers, aucune référence de réservation, aucun secret.
- Tout fichier CSS ou JS modifié change de numéro dans son lien (`?v=AAAAMMJJx`), et la balise `site-version` de la page change aussi : c'est ce qui force les navigateurs, iPhone compris, à recharger.
- Circuit git : branche de la session, fusion dans `main` (`--no-ff`), envoi des deux, puis vérification que la publication GitHub Pages a réussi, avant d'annoncer que c'est en ligne.
