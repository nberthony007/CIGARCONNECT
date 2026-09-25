---
trigger: always_on
description: Mandatory rules specifying the active skills to use for developing and transitioning CigarConnect to Full-Stack.
---

# Directives d'Utilisation des Skills — CigarConnect

Pour tout développement, refonte, architecture ou implémentation de la plateforme **CigarConnect**, l'assistant doit systématiquement combiner et appliquer les compétences définies dans les skills suivants :

## 1. Skill `cigarconnect-assistant` (Règles Métier, Données & Direction Artistique)
- **Localisation** : `.agents/skills/cigarconnect-assistant/SKILL.md`
- **Application impérative** :
  - **Charte Visuelle & Dignité de Collectionneur** : Respecter scrupuleusement la palette de matières réelles : Ivoire Chaud (`--bg-deep: #F4F0E7`), Brun d'Encre (`--text-primary: #241E1A`), Cèdre d'Espagne (`--wood-cedar: #71513B`), Laiton Patiné (`--brass-patina: #AA8959`), Vert Pin de Vérification (`--pine-verify: #35483F`), et Pierre claire (`--stone-border: #D9D0C2`). Interdiction formelle du clinquant, des fausses dorures criardes ou des dégradés agressifs.
  - **Photographie Réelle Exigée** : Vitoles et coffrets représentés par de vraies photographies de studio haute définition (veinage, bague, capes grasses).
  - **Normes de Conservation** : Respect strict de l'hygrométrie de cave à 68–70% HR à 18–20°C.
  - **Règles du Troc Pur ("Le Cercle")** : Échanges de gré à gré sans intermédiaire financier. Réservation atomique des unités en cave dès qu'un accord mutuel est confirmé sur une version de proposition.
  - **Confidentialité Native** : Valorisations privées par défaut, géolocalisation floutée (Ville, Pays), séparation stricte entre vitoles publiques et vitoles de coffre-fort privé.

## 2. Skill `antigravity-design-expert` (Architecture Full-Stack, UI Interactive & Motion)
- **Localisation** : `.agents/skills/antigravity-design-expert/SKILL.md`
- **Application impérative** :
  - **Stack Technique Cible** : Next.js (App Router, Server Components & Actions), TypeScript, Tailwind CSS pour les utilitaires de mise en page, couplé à du CSS custom pour les matières nobles et les transformations 3D.
  - **Micro-Animations & Fluidité** : GSAP & ScrollTrigger pour les révélations au scroll délicates, transitions sans à-coups (minimum `0.3s ease-out`), apparitions étagées (*staggered entrances*) des vitoles et cartes de troc.
  - **Profondeur Spatiale & Légèreté ("Weightlessness")** : Ombres portées minérales douces et étagées (`rgba(36, 30, 26, 0.05)`), subtil glassmorphism (`backdrop-filter: blur(14px)`) sur la barre de navigation et les modales de négociation.
  - **Haute Performance Rétinienne** : Utilisation stricte de `will-change: transform` sur les éléments animés, respect des utilisateurs avec `prefers-reduced-motion: reduce`, code modulaire et composants réutilisables.
