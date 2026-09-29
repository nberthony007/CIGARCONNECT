# CigarConnect — Premier lot international d’enrichissement

29 septembre 2026 — Dossier à transmettre à Antigravity.

## Résultat livré

- **40 nouvelles références modèle/format**, documentées à partir de pages de fabricants ou marques.
- **10 désignations existantes** extraites de l’export et isolées pour revue.
- Un cahier d’import permettant de préparer les données sans modifier l’inventaire.
- Une vue lisible de toutes les nouvelles références.

Il s’agit d’un premier lot de préparation, pas d’un catalogue mondial complet ni d’un import déjà exécuté. L’objectif évoqué de 100 références n’est pas encore atteint : ce lot en apporte 40 nouvelles. La compatibilité exacte avec la base du site reste à établir à partir du schéma de données du projet. Les dimensions documentées ne constituent pas une certification des pièces possédées par les membres.

## Ce que contient réellement le fichier reçu

Le JSON fourni est un **export d’humidor**, daté du 29 septembre 2026 : 10 lots, 7 marques et 48 unités. Il indique 40 unités échangeables et 8 non échangeables. Il contient également l’identité d’un membre, des codes de boîtes et des conditions de conservation.

Ce n’est pas un export du catalogue complet : il ne contient pas d’identifiants de référence distincts des identifiants de lots, de sources fabricant, d’historique éditorial ou de schéma de base.

Les fichiers de catalogue préparés ne recopient ni identité du membre, ni quantité, ni disponibilité, ni codes de boîte, ni mesures de cave. Le fichier original n’a pas été modifié.

## Composition du premier lot

| Marque | Gamme | Références nouvelles |
|---|---|---:|
| Padrón | 1964 Anniversary Series | 8 |
| Arturo Fuente | Hemingway | 8 |
| Oliva | Serie V | 8 |
| AJ Fernandez | New World Dorado | 5 |
| Bohekio / Supreme Tobacco | Habano | 5 |
| Cohiba | Plusieurs gammes | 6 |
| **Total** | | **40** |

Les références Natural/Maduro ne sont pas artificiellement multipliées. Quand une page présente plusieurs capes pour le même format, elles restent des options à choisir pour l’identification exacte. Ce lot ne prétend pas représenter tous les pays producteurs ; Honduras, Mexique, Brésil et autres origines pourront faire partie des lots suivants après recherche dédiée.

## Place des marques haïtiennes

### Bohekio / Supreme Tobacco

La page officielle [Bohekio Habano](https://www.supremetobaccohaiti.com/bohekio-habano) publie cinq formats, retenus ici. L’identité haïtienne de la maison est documentée sur sa [page de présentation](https://www.supremetobaccohaiti.com/about).

Un conflit mérite clarification : la page de présentation évoque une fabrication haïtienne, tandis que la [fiche produit de la boutique](https://www.supremetobaccohaiti.com/store/p/bohekio-habano) indique une fabrication en République dominicaine. Cela peut correspondre à une évolution de production, mais ce n’est pas établi par les éléments consultés.

Le lot conserve donc **l’affiliation de marque HT**, les origines de tabac renseignées par la page produit et un **pays de fabrication vide avec conflit explicite**. Demander au fabricant les lieux et périodes de production applicables avant de compléter ce champ.

### Kashimbo

Les quatre désignations de l’export sont conservées : Heritage Majestic, Heritage Noble Origins, Year of the Horse 2026 et Year of the Snake 2025. Leurs noms, dimensions et affiliation à Haïti restent des déclarations de l’export à vérifier.

Le [site officiel](https://www.kashimbocigars.com/) indique être en reconstruction lors de la consultation. Le lien de kit de présentation n’a pas fourni de dossier exploitable dans cette recherche. Cela ne remet pas en cause l’existence des références ; cela empêche simplement de les considérer ici comme vérifiées par le fabricant.

À obtenir auprès de la marque : catalogue ou fiches techniques, dénominations exactes, tailles, capes, éditions, pays de fabrication par gamme, dates qualifiées et autorisation d’utilisation des images. Aucun contact n’a été envoyé en ton nom.

## Corrections à prévoir dans les données existantes

1. **Origine** : le champ actuel mélange pays, identité de marque et édition. Les séparer.
2. **Millésime** : ne pas interpréter automatiquement `vintage` comme année de production. Distinguer récolte, édition, fabrication et acquisition.
3. **El Morro** : le nom contient 2003 mais le champ `vintage` est vide. Préserver cette divergence en attente de clarification.
4. **Trinidad** : les dimensions 192 mm/calibre 40 figurent dans un document officiel historique, mais cela ne valide pas le millésime 1998, le code de boîte ou toutes les caractéristiques du lot.
5. **Codes de boîte et hygrométrie** : ce sont des informations de lot, pas de modèle commun.
6. **Conditionnement** : distinguer taille nominale d’une boîte et quantité réellement possédée.
7. **Calibres doubles** : certains formats Fuente ont deux valeurs publiées. Ne pas tronquer automatiquement vers une valeur unique.

## Lire les statuts

`source_documented` : les informations indiquées ont une source primaire consultée ; cela ne signifie ni exhaustivité ni droit de réutilisation de tous les contenus du site source.

`source_documented_with_origin_conflict` : dimensions documentées mais contradiction à résoudre sur la fabrication.

`user_export_unverified` : donnée issue du fichier utilisateur, sans validation indépendante complète.

Tous les nouveaux enregistrements sont en **draft** ; les candidats existants sont en **hold**. Les champs inconnus restent nuls. Un pays vide ne signifie pas que le cigare n’a pas d’origine : cela signifie que celle-ci n’est pas suffisamment documentée dans ce lot.

## Sources et limites

Les URL et dates de consultation figurent dans le JSON. Le catalogue Habanos utilisé est historique : ne pas en déduire une disponibilité commerciale actuelle. Les caractéristiques relevées sont des informations de modèle, pas des preuves d’authenticité physique.

Aucune photographie, description commerciale longue, note de dégustation ou notation critique n’est copiée dans les données livrées. Les droits de stockage et de publication à l’échelle du projet restent à examiner ; la consultation d’une page n’est pas une licence globale. Aucun accès API ni abonnement n’a été acheté.

## Suite recommandée

Importer ces éléments dans une zone de préparation, vérifier les doublons contre le vrai catalogue, compléter les champs nécessaires et faire valider la publication. Obtenir en priorité les fiches Kashimbo et la clarification Supreme Tobacco. Préparer ensuite un deuxième lot de 60 références, en variant davantage marques et pays, pour atteindre l’objectif initial de 100 nouvelles références documentées.
