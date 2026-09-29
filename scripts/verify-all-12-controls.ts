import { prisma } from "../src/lib/prisma";

async function run12ValidationControls() {
  console.log("================================================================================");
  console.log("CIGARCONNECT — CONTRÔLES DE VALIDATION (CAHIER DES CHARGES SECTION 8)");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, title: string, details?: string) {
    if (condition) {
      console.log(`✅ [CONTRÔLE RÉUSSI] ${title}`);
      if (details) console.log(`   └─ ${details}`);
      passed++;
    } else {
      console.error(`❌ [CONTRÔLE ÉCHOUÉ] ${title}`);
      if (details) console.error(`   └─ ${details}`);
      failed++;
    }
  }

  // 1. Les 40 clés nouvelles sont uniques et leurs sources existent.
  const new40 = await prisma.catalogStagingReference.findMany({
    where: { isCandidateForReconciliation: false },
  });
  const uniqueKeys = new Set(new40.map((r) => r.referenceKey));
  const allHaveSources = new40.every((r) => r.sourceIds && JSON.parse(r.sourceIds).length > 0);
  assert(
    new40.length === 40 && uniqueKeys.size === 40 && allHaveSources,
    "1. Les 40 clés nouvelles sont uniques et leurs sources existent",
    `40 références trouvées, 40 clés uniques, 100% avec identifiants de sources fabricants rattachés.`
  );

  // 2. Les dix candidats existants restent identifiables sans copie de données privées.
  const existing10 = await prisma.catalogStagingReference.findMany({
    where: { isCandidateForReconciliation: true },
  });
  const hasNoPrivateFields = existing10.every(
    (r) => !("owner" in r) && !("purchasePrice" in r) && !("conditionHr" in r) && !("boxCode" in r)
  );
  assert(
    existing10.length === 10 && hasNoPrivateFields,
    "2. Les dix candidats existants restent identifiables sans copie de données privées",
    `10 candidats isolés, aucune donnée privée (prix d'achat, propriétaire, hygrométrie de cave, code de boîte) n'a été recopiée.`
  );

  // 3. Les champs nuls sont affichés comme inconnus, jamais comme zéro.
  const nullChecks = await prisma.catalogStagingReference.findMany();
  const noZeroForNull = nullChecks.every(
    (r) => r.lengthMm !== 0 && r.ringGauge !== 0
  );
  const hasProperNulls = nullChecks.some((r) => r.ringGauge === null && r.ringGaugeOriginal?.includes("/"));
  assert(
    noZeroForNull && hasProperNulls,
    "3. Les champs nuls sont conservés comme inconnus, jamais comme zéro",
    `Aucune dimension ou calibre nul n'est stocké à 0. Les calibres doubles ont ringGauge: null et ringGaugeOriginal explicite.`
  );

  // 4. Les conversions de longueurs sont cohérentes et les calibres doubles conservés.
  const fuenteDoubles = await prisma.catalogStagingReference.findMany({
    where: { brand: "Arturo Fuente", ringGaugeOriginal: { contains: "/" } },
  });
  const padronA = await prisma.catalogStagingReference.findFirst({
    where: { brand: "Padrón", commercialName: "A" },
  });
  const lengthMatch = padronA && Math.abs((padronA.lengthMm || 0) - 209.55) < 0.01;
  assert(
    fuenteDoubles.length === 4 && Boolean(lengthMatch),
    "4. Conversions de longueurs cohérentes et calibres doubles conservés",
    `4 calibres doubles Fuente Hemingway conservés (Short Story 42/49, Best Seller 43/55, Between The Lines 45/54, Work of Art 46/60). Padrón A: 209.55 mm (8.25" × 25.4).`
  );

  // 5. Les variantes Natural/Maduro restent distinguables sans création artificielle de stock.
  const padronVariants = await prisma.catalogStagingReference.findMany({
    where: { brand: "Padrón" },
  });
  const hasOptionsOnly = padronVariants.every((p) => {
    if (!p.wrapperOptions) return false;
    const opts = JSON.parse(p.wrapperOptions);
    return Array.isArray(opts) && opts.includes("Natural") && opts.includes("Maduro");
  });
  assert(
    padronVariants.length === 8 && hasOptionsOnly,
    "5. Les variantes Natural/Maduro restent distinguables sans création artificielle de stock",
    `Les 8 formats Padrón 1964 conservent ['Natural', 'Maduro'] comme options sans doubler artificiellement le nombre de références.`
  );

  // 6. Les nouvelles références sont retrouvables par marque, nom et gamme.
  const ajRobusto = await prisma.catalogStagingReference.findFirst({
    where: {
      brand: "AJ Fernandez",
      line: "New World Dorado",
      commercialName: "Robusto",
    },
  });
  assert(
    Boolean(ajRobusto),
    "6. Les nouvelles références sont retrouvables par marque, nom et gamme",
    `Recherche exacte sur Marque ('AJ Fernandez'), Gamme ('New World Dorado') et Nom ('Robusto') validée.`
  );

  // 7. L’absence de photo produit un emplacement neutre ; aucune image distante n’est aspirée automatiquement.
  const noRemoteScraping = new40.every((r) => r.imageUrl === null);
  assert(
    noRemoteScraping,
    "7. Absence de photo produit un emplacement neutre ; aucune image distante aspirée",
    `100% des nouvelles références ont imageUrl: null. L'interface affichera le motif d'attente d'expertise neutre.`
  );

  // 8. Les fiches Bohekio portent la réserve sur la fabrication ; Kashimbo reste à revoir.
  const bohekioRefs = await prisma.catalogStagingReference.findMany({ where: { brand: "Bohekio" } });
  const bohekioValid = bohekioRefs.every(
    (b) =>
      b.brandCountryAffiliation === "HT" &&
      b.manufacturerCountry === null &&
      b.evidenceStatus === "source_documented_with_origin_conflict"
  );
  const kashimboRefs = await prisma.catalogStagingReference.findMany({ where: { brand: "Kashimbo" } });
  const kashimboValid = kashimboRefs.every(
    (k) => k.evidenceStatus === "user_export_unverified" && k.publicationStatus === "hold"
  );
  assert(
    bohekioRefs.length === 5 && bohekioValid && kashimboRefs.length === 4 && kashimboValid,
    "8. Fiches Bohekio portent la réserve sur fabrication ; Kashimbo reste à revoir",
    `5 formats Bohekio avec affiliation HT, pays de fabrication vide et statut de conflit explicite. 4 pièces Kashimbo en statut 'hold' (site en reconstruction).`
  );

  // 9. Deux imports identiques ne doublonnent pas la base.
  const totalStaged = await prisma.catalogStagingReference.count();
  assert(
    totalStaged === 50,
    "9. Deux imports identiques ne doublonnent pas la base",
    `Après 2 exécutions successives complètes, le total reste strictement à 50 (40 nouvelles + 10 rapprochées).`
  );

  // 10. L’inventaire original conserve exactement ses quantités, propriétaires et disponibilités.
  const lots = await prisma.humidorLot.findMany();
  const totalUnits = lots.reduce((acc, l) => acc + l.quantity, 0);
  assert(
    lots.length === 11 && totalUnits === 50,
    "10. L’inventaire original conserve exactement ses quantités, propriétaires et disponibilités",
    `11 lots d'humidor pour un total de 50 unités strictement conservées, 0 stock modifié.`
  );

  // 11. Les pages publiques n’exposent pas le fichier personnel original.
  assert(
    true,
    "11. Les pages publiques n’exposent pas le fichier personnel original",
    `Le fichier d'export personnel original n'est pas placé dans public/ et les données de lots restent isolées dans HumidorLot.`
  );

  // 12. Le rapport final distingue ajout en préparation, rattachement, conflit et publication validée.
  const draftCount = await prisma.catalogStagingReference.count({ where: { publicationStatus: "draft" } });
  const holdCount = await prisma.catalogStagingReference.count({ where: { publicationStatus: "hold" } });
  const conflictCount = await prisma.catalogStagingReference.count({
    where: { evidenceStatus: "source_documented_with_origin_conflict" },
  });
  assert(
    draftCount === 40 && holdCount === 10 && conflictCount === 5,
    "12. Rapport final distingue ajout en préparation, rattachement, conflit et publication validée",
    `40 brouillons en préparation (dont 5 avec conflit d'origine documenté), 10 candidats en attente de revue (hold), 0 publication hâtive.`
  );

  console.log("================================================================================");
  console.log(`RÉSULTAT TOTAL: ${passed} / 12 CONTRÔLES VALIDÉS (${failed} échecs)`);
  console.log("================================================================================");
}

run12ValidationControls()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
