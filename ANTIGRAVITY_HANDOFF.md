# ⚜️ CigarConnect — Document de Transition & Dossier d'Architecture
**Plateforme :** [www.cigarconnect.net](http://www.cigarconnect.net)  
**Slogan :** *"Where Cigars Connect"*  
**Dépôt GitHub :** [https://github.com/nberthony007/CIGARCONNECT](https://github.com/nberthony007/CIGARCONNECT)  
**Emplacement Local :** `/Users/berthony/Library/CloudStorage/Dropbox/KALEI_CLIENTS/CIGARCONNECT`  
**Branche Active :** `main` (synchronisée via SSH `id_ed25519`)  

---

## 1. Résumé Exécutif & Vision du Projet

**CigarConnect** est la première plateforme web haut de gamme conçue pour connecter les passionnés, collectionneurs et clubs de cigares autour de trois valeurs cardinales :
- **Éducation** : Transmission de la culture du cigare, rituels d'allumage, conservation optimale et identification des arômes.
- **Networking** : Échanges sécurisés de vitoles rares et de collection entre membres vérifiés.
- **Accessibilité** : Une expérience digitale fluide, immersive et prestigieuse (ambiance club privé, salon lounge, bois précieux et or bruni).

---

## 2. État Actuel du Projet (Ce qui est fait et prêt à l'emploi)

L'application a été entièrement construite et testée en **HTML5 sémantique, CSS3 moderne et JavaScript ES6+**.  
Elle fonctionne immédiatement dans n'importe quel navigateur web **sans dépendance externe ni étape de compilation**.

### 🌟 Fonctionnalités Opérationnelles :

1. **Trésors & Galerie des Cigares Rares (`view-catalog`)** :
   - Moteur de recherche instantané multi-critères (par marque, terroir, vitola, millésime ou arômes).
   - Filtres rapides par terroir (Cuba 🇨🇺, République Dominicaine 🇩🇴, Nicaragua 🇳🇮) et par grade de rareté (*Édition Mythique*, *Réserve Privée*, *Cabinet Millésimé*).
   - Fiche d'inspection complète (modale) avec pyramide aromatique, code boîte sous UV, hygrométrie et profil du propriétaire.

2. **Bourse d'Échange Peer-to-Peer (`view-trade`)** :
   - Flux d'échanges actifs avec visualisation face-à-face (*Cigare offert ⇄ Cigare convoité*).
   - Assistant interactif de proposition d'échange permettant de sélectionner un cigare de son humidor personnel, le cigare convoité, et d'ajouter une compensation financière d'équilibrage (€).
   - Salon de négociation interactif avec chat en direct et simulation de contre-offre.
   - Validation de l'échange avec protocole de tiers de confiance.

3. **Mon Humidor Virtuel (`view-humidor`)** :
   - Tableau de bord en temps réel avec hygromètre régulé (**69.2% HR**), thermomètre (**19.4°C**) et calculateur de valorisation patrimoniale de la collection.
   - Bascule instantanée (*Toggle Switch*) pour marquer chaque vitole comme "Disponible à l'échange" ou "Privée".
   - Formulaire d'ajout de nouvelles vitoles avec persistance immédiate dans `localStorage`.

4. **Académie & Outil d'Authenticité Anti-Contrefaçon (`view-academy`)** :
   - Outil de diagnostic interactif avec 5 points de contrôle (hologrammes en relief, sceau UV Habanos, finesse de cape, triple calotte, code boîte).
   - Recalcul en direct du score d'authenticité et recommandation d'expertise.
   - Guides complets sur la règle d'or des 69% d'hygrométrie, l'allumage au cèdre et les accords spiritueux.

5. **Lounge Communautaire & Club VIP (`view-lounge`)** :
   - Espace de discussion communautaire avec publication de nouveaux sujets et réactions "J'aime".
   - Modale des adhésions de monétisation (*Aficionado* Gratuit, *Connoisseur VIP* 19 €/mois, *Master Collector* 49 €/mois).

---

## 3. Cartographie & Rôle des Fichiers

```
CIGARCONNECT/
│
├── index.html                  # Point d'entrée principal (structure sémantique, 5 vues SPA, 5 modales, drawer)
├── README.md                   # Documentation officielle pour GitHub
├── .gitignore                  # Exclusion des fichiers macOS (.DS_Store) et Dropbox
├── ANTIGRAVITY_HANDOFF.md      # Ce document d'architecture et de transition
│
├── css/
│   ├── style.css               # Charte graphique (Playfair Display, Cinzel, Plus Jakarta Sans, palette luxe & variables)
│   ├── components.css          # Cartes de vitoles, jauges circulaires, modales, bague visuelle, toggle switch
│   └── animations.css          # Reflets dorés (gold-shine-effect), pulsation hygrométrique, volutes de fumée
│
└── js/
    ├── data.js                 # Base de données initiale (Behike 56, OpusX, Padrón 80th, Oro Blanco 2002, etc.)
    ├── catalog.js              # Recherche instantanée, filtres multi-terroirs, ouverture de la modale détail
    ├── humidor.js              # Logique de gestion de la cave virtuelle, calcul de valeur, ajout/retrait de vitoles
    ├── trade.js                # Bourse d'échange, assistant de proposition, salon de négociation & chat
    └── app.js                  # Orchestrateur global, routage SPA, vérificateur d'authenticité, salon lounge & toasts
```

---

## 4. Palette Graphique & Design Tokens

| Couleur / Élément | Valeur Hex / CSS | Usage |
|---|---|---|
| **Brun Maduro / Bois Sombre** | `#0a0807` / `#14100d` / `#1c1612` | Arrière-plan, cartes et atmosphère lounge |
| **Or Bruni / Laiton Doré** | `#d4af37` / `#fae69e` / `#a17f1a` | Boutons CTA, bordures de prestige, reflets |
| **Cèdre Espagnol & Havane** | `#733917` / `#3a1b0d` / `#2a1a12` | Accents boisés, corps des cigares stylisés |
| **Vert Émeraude Authenticité**| `#2ea068` (fond `rgba(46,160,104,0.12)`) | Statut optimal humidor, badges de certification |
| **Typographie Titres** | `'Playfair Display', Georgia, serif` | Titres des vitoles, prestige artisanal |
| **Typographie Emblème** | `'Cinzel', serif` | Monogramme "CC", badges et en-têtes |
| **Typographie Corps** | `'Plus Jakarta Sans', sans-serif` | Lisibilité moderne, fiches techniques et données |

---

## 5. Comment Ouvrir et Continuer sur Antigravity IDE

1. **Ouvrir le Projet dans Antigravity IDE** :
   - Lancez Antigravity IDE.
   - Choisissez **Open Folder** (ou `Cmd + O`) et sélectionnez :
     `/Users/berthony/Library/CloudStorage/Dropbox/KALEI_CLIENTS/CIGARCONNECT`

2. **Prévisualiser l'Application** :
   - Ouvrez `index.html` dans l'IDE.
   - Cliquez sur le bouton de prévisualisation intégrée (*Live Preview / Browser Pane*) ou ouvrez-le dans Safari/Chrome.

3. **Synchronisation Git** :
   - Le dépôt distant est déjà configuré sur votre branche `main`.
   - Vos commandes de synchronisation habituelles fonctionneront directement depuis le terminal intégré de l'IDE :
     ```bash
     git status
     git add .
     git commit -m "Description de vos modifications"
     git push
     ```

---

## 6. Prochaines Étapes Recommandées sur Antigravity IDE

1. **Backend & Base de Données Réelle** :
   - Intégrer **Supabase** ou **Firebase** pour l'authentification réelle des membres (connexion email/mot de passe/OAuth Google/Apple) et le stockage en base PostgreSQL des cigares et offres d'échange.
2. **Messagerie en Temps Réel** :
   - Connecter les négociations à un canal WebSocket ou Supabase Realtime pour recevoir les messages instantanément sans rechargement.
3. **Paiements & Souscriptions VIP** :
   - Intégrer l'API Stripe Checkout pour monétiser les adhésions (*Connoisseur VIP* à 19 €/mois et *Master Collector* à 49 €/mois).
4. **Déploiement en Ligne (Production)** :
   - Connecter votre dépôt GitHub [github.com/nberthony007/CIGARCONNECT](https://github.com/nberthony007/CIGARCONNECT) à **Vercel** ou **Cloudflare Pages** pour rendre le site accessible en 1 clic sur `www.cigarconnect.net`.
