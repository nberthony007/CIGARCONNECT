---
name: cigarconnect-assistant
description: >-
  Guide and runbook for developing, maintaining, and curating the CigarConnect platform.
  Use this skill whenever adding or modifying cigars, updating the data in js/data.js,
  generating or validating cigar studio photography in assets/, maintaining the authentic
  collector design system (Warm Ivory, Ink Brown, Cedar, Patinated Brass), checking humidor
  conservation parameters (68-70% HR), or testing the peer-to-peer exchange workflows.
---

# CigarConnect Assistant & Curator Skill

Ce skill définit les protocoles de développement, de conservation et de design pour la plateforme **CigarConnect** (Cercle Privé de Collectionneurs & Haute Traçabilité).

---

## 1. Principes Fondamentaux de la Plateforme

* **Esthétique de Maison de Vente** : Rigueur d'une maison d'enchères (Christie's / Sotheby's Private Sales) et intimité d'un cabinet de dégustation privé.
* **Anti-Clinquant** : Aucun dégradé d'or agressif, aucun badge flottant ou forme en pilule lourde. Utiliser des séparateurs fins en pierre (`#D9D0C2`), des contrastes parfaits (texte foncé sur fond ivoire clair, texte clair sur footer sombre).
* **Photographie Réelle Exigée** : Toutes les vitoles doivent être représentées par de véritables photographies de studio haute définition (veinage, bague en relief, coffret cèdre), jamais d'illustrations abstraites ou de faux cigares en CSS.

---

## 2. Nuancier des Matières Réelles

Toujours utiliser les variables CSS officielles :

| Variable CSS | Code Hex | Matériau / Usage |
| :--- | :--- | :--- |
| `--bg-deep` | `#F4F0E7` | Ivoire Chaud — Fond de page principal |
| `--text-primary` | `#241E1A` | Brun d'Encre — Texte principal et boutons majeurs |
| `--wood-cedar` | `#71513B` | Cèdre d'Espagne — Modules, terroirs, cotes |
| `--brass-patina`| `#AA8959` | Laiton Patiné — Rareté, accents et détails d'auteur |
| `--stone-border`| `#D9D0C2` | Pierre / Lin — Filets et bordures fins (1px) |
| `--pine-verify` | `#35483F` | Vert Pin — Conservation optimale & authenticité |

---

## 3. Structure des Données de Vitole (`js/data.js`)

Lors de l'ajout d'une nouvelle pièce dans `INITIAL_CIGARS` ou `INITIAL_NEW_ARRIVALS`, respecter strictement les attributs qualifiés :

```javascript
{
  id: "cig-identifiant-unique",
  brand: "Marque (ex: Cohiba, Trinidad, Montecristo)",
  name: "Nom complet de la vitole",
  origin: "Cuba | République Dominicaine | Nicaragua",
  countryFlag: "🇨🇺 | 🇩🇴 | 🇳🇮",
  vitola: "Module officiel (ex: Laguito No. 6, Pirámide)",
  ringGauge: 56, // Calibre de bague
  lengthMm: 166, // Longueur en mm
  vintage: "2010",
  harvestYear: "Récolte 2007 (Année de récolte des feuilles)",
  boxYear: "Mise en boîte : Mai 2010 (Date du coffret usine)",
  acquisitionDate: "Acquis en 2018 (Vente privée Christie's)",
  provenance: "Manufacture et historique de détention",
  declaredConservation: "Précisions sur l'humidor (ex: Armoire Liebherr 18.5°C / 69% HR)",
  boxCode: "BBM MAY 10", // Code usine
  boxCodeVerified: true,
  rarity: "ultra-rare | exclusive | vintage",
  rarityLabel: "Édition Mythique | Gran Reserva | Cabinet Historique",
  strength: 4, // Échelle de 1 à 5
  estimatedValue: "€ 450",
  condition: "Parfait (69% HR / 18.5°C)",
  owner: "Nom du propriétaire",
  ownerAvatar: "Initiales",
  ownerLocation: "Ville, Pays",
  image: "assets/cigar-nom.jpg",
  gallery: ["assets/cigar-nom.jpg", "assets/hero-cigar-library.jpg"],
  aromas: ["Cuir", "Cèdre", "Cacao", "Sous-Bois"],
  description: "Notes de dégustation et histoire de la pièce",
  status: "Disponible pour échange | Pièce de contemplation"
}
```

---

## 4. Règles de Conservation & Hygrométrie (68-70% HR)

* **Plage Idéale** : 68% à 70% d'humidité relative à 18-20°C.
* En dessous de 64% HR : risque de dessèchement des huiles essentielles.
* Au-dessus de 72% HR : risque de moisissure ou d'infestation par le lasioderme.
* Pour les envois sécurisés : obligatoirement sous sachet régulateur Boveda 69% HR dans un emballage hermétique scellé.

---

## 5. Procédure de Test Locale

1. **Lancement du serveur** : `python3 -m http.server 3000`
2. **Accès** : `http://localhost:3000`
3. **Vérification** :
   - Tester le basculement Vue Galerie / Vue Inventaire dans **Mon Humidor**.
   - Vérifier l'ouverture du **Dossier de Collection** sur une vitole.
   - Contrôler l'affichage sur mobile et desktop.
