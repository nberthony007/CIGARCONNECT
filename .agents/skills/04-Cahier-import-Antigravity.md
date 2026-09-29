# Cahier des charges — Intégrer le premier lot international

## 1. Mission

Importer les fichiers de ce dossier dans une zone de préparation du catalogue CigarConnect. Ne pas les traiter comme un remplacement de base ou un inventaire. Le fichier original fourni est un export personnel ; ses identifiants ne prouvent pas l’existence d’identifiants catalogue correspondants.

Auditer d’abord les modèles et migrations du dépôt : références, variantes, lots et annonces. Produire un mapping des champs avant mutation. Réutiliser l’architecture existante sans générer de nouveau site.

## 2. Fichiers

- `01-nouvelles-references-40.json` : sources et 40 références nouvelles candidates.
- `02-references-existantes-a-revoir-10.json` : désignations existantes à revoir, sans données de stock.
- `03-Vue-des-references.md` : lecture humaine du lot.
- `00-LIRE-EN-PREMIER.md` : audit, limites et décisions nécessaires.

Il n’y a pas de fichier CSV à interpréter avec des séparateurs locaux. Les fichiers JSON sont encodés en UTF-8. Le point est le séparateur décimal dans les nombres JSON.

## 3. Modèle cible

Une référence modèle/format dispose d’un identifiant stable, marque, gamme, nom commercial, dimensions, variantes éventuelles, sources, statut et dates. Les clés `reference_key` du lot sont des clés externes de rapprochement, à mapper vers les identifiants internes ; ne pas écraser des identifiants existants.

Conserver séparément :

- `brand_country_affiliation` : identité ou affiliation documentée de la marque.
- `manufacturer_country` : fabrication du produit, si établie.
- `tobacco_origin` : cape, sous-cape et tripe, seulement lorsque documentées.
- `edition_year`, `production_year`, `harvest_year` : années qualifiées.

La date d’achat appartient au lot personnel. Une maison liée à Haïti ne doit pas être automatiquement classée comme fabricant en Haïti. Prévoir un filtre « Marques liées à Haïti » distinct de « Fabriqué en Haïti ».

## 4. Dimensions et variantes

Le JSON conserve longueur d’origine et unité. La conversion des pouces est calculée avec 25,4 mm par pouce ; afficher un arrondi adapté sans modifier la valeur de travail. Les longueurs en millimètres publiées directement sont conservées telles quelles.

Le calibre est en soixante-quatrièmes de pouce ; ne pas le stocker comme un diamètre millimétrique. Si `ring_gauge` est nul mais `ring_gauge_original` contient une valeur double, préserver celle-ci et adapter le modèle à un format variable. Ne pas inventer de diamètre unique.

`wrapper_options` contient parfois plusieurs variantes et parfois des codes du fabricant. Ne pas développer N/M/S sans légende vérifiée. Les options ne désignent pas automatiquement la cape du cigare d’un membre. Lors du choix d’une référence, demander une variante si elle est nécessaire ; autoriser « à préciser » pour l’inventaire privé.

## 5. Rapprochement et revue

Normaliser accents et casse pour la recherche, mais préserver les noms affichés. Comparer marque, gamme, nom, dimensions et édition. Ne pas fusionner des marques homonymes de fabrications différentes ni une édition limitée avec le modèle courant sur le seul nom.

Avant import, afficher créations proposées, correspondances possibles, différences, champs inconnus et conflits. Les dix références issues de l’export sont des candidats de rapprochement, pas dix créations obligatoires.

La correspondance Behike BHK 56 existante ne doit pas être confondue avec les nouvelles BHK 52 et BHK 54. Pour Trinidad, ne pas remplacer automatiquement un lot millésimé par une référence générique en supprimant les détails personnels.

## 6. Sources et statut

Conserver les sources au niveau des champs quand elles sont fournies. Les sources sont consultées au 29 septembre 2026 ; certaines sont historiques. Ne pas convertir cette date en date de fabrication ou de lancement.

Ne jamais afficher « authentifié » à partir de `source_documented`. Afficher au besoin « Référence documentée » et les liens appropriés après revue. Les données d’un membre ne deviennent pas des faits certifiés par simple migration.

Le moteur d’import ne publie rien automatiquement. Les conflits sur un champ peuvent être résolus en laissant ce champ inconnu plutôt qu’en inventant une valeur. La validation éditoriale et les conditions de réutilisation sont distinctes.

## 7. Opération sûre et réversible

Créer un identifiant de lot d’import et un rapport avant/après. Faire une sauvegarde adaptée et travailler d’abord en environnement de test. Importer de manière idempotente à partir des clés externes : rejouer le même fichier ne crée pas de doublons.

Ne pas modifier quantité, propriétaire, boîte, mesures, disponibilité, transactions ou messages. Ne pas créer de comptes, annonces ou stocks avec ces références.

Un rattachement ultérieur d’un lot personnel doit conserver son historique. Une correction de catalogue ne réécrit pas les instantanés d’échanges passés. Pour annuler un import, retirer les créations non utilisées ou les archiver ; ne pas supprimer en cascade les pièces personnelles rattachées.

## 8. Contrôles de validation

1. Les 40 clés nouvelles sont uniques et leurs sources existent.
2. Les dix candidats existants restent identifiables sans copie de données privées.
3. Les champs nuls sont affichés comme inconnus, jamais comme zéro.
4. Les conversions de longueurs sont cohérentes et les calibres doubles conservés.
5. Les variantes Natural/Maduro restent distinguables sans création artificielle de stock.
6. Les nouvelles références sont retrouvables par marque, nom et gamme.
7. L’absence de photo produit un emplacement neutre ; aucune image distante n’est aspirée automatiquement.
8. Les fiches Bohekio portent la réserve sur la fabrication ; Kashimbo reste à revoir.
9. Deux imports identiques ne doublonnent pas la base.
10. L’inventaire original conserve exactement ses quantités, propriétaires et disponibilités après le travail.
11. Les pages publiques n’exposent pas le fichier personnel original.
12. Le rapport final distingue ajout en préparation, rattachement, conflit et publication validée.

## 9. Livraison attendue

Mapping de schéma, migrations éventuelles, prévisualisation d’import, rapport de doublons, import test rejouable, tests de non-modification de l’inventaire et liste des points à confirmer. Ne pas annoncer « 100 cigares intégrés » : ce lot contient 40 nouvelles références candidates et dix anciennes désignations à revoir.

## 10. Prompt pour Antigravity

Examine le catalogue et l’inventaire existants. Utilise ce dossier comme un lot de préparation de références, sans modifier les stocks. Mets en place un import idempotent avec prévisualisation, sources et statuts. Rapproche les dix candidats existants au lieu de les recréer automatiquement. Sépare identité de marque, fabrication et origine du tabac, notamment pour les marques liées à Haïti. Conserve toutes les incertitudes documentées. Ne publie ni références ni images sans la revue nécessaire. Fournis les résultats vérifiés et les décisions restant à prendre.
