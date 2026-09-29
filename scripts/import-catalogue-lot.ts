import { previewImportLot01, executeImportLot01 } from "../src/lib/actions/catalogue-import";
import { prisma } from "../src/lib/prisma";

async function main() {
  const isPreview = process.argv.includes("--preview");

  console.log("================================================================================");
  console.log("CIGARCONNECT — MOTEUR D'IMPORT DU CATALOGUE (LOT INTERNATIONAL 01)");
  console.log("================================================================================");

  if (isPreview) {
    console.log("🔎 Mode PREVIEW (Dry-Run sans mutation de base)...");
    const preview = await previewImportLot01();
    console.log("\n--- RAPPORT DE PRÉVISUALISATION ---");
    console.log(`Lot: ${preview.batchKey} (v${preview.schemaVersion})`);
    console.log(`Nouvelles références candidates: ${preview.newCandidatesCount}`);
    console.log(`Candidats existants pour rapprochement: ${preview.existingCandidatesCount}`);
    console.log(`Total références dans le lot: ${preview.totalReferencesCount}`);
    console.log("\nVentilation par marque (Nouveautés):", preview.newReferencesByBrand);
    console.log("Statuts de documentation:", preview.evidenceStatusCounts);
    console.log("\nConflits & Réserves documentées:", preview.originConflicts);
    console.log("\nRapprochements détectés (10 candidats):");
    preview.reconciliations.forEach((r) => {
      console.log(`  - [${r.candidateKey}] ${r.brand} ${r.declaredName} -> Ref: ${r.matchedExistingRefId || "Aucun"}, Lot: ${r.matchedExistingLotId || "Aucun"}`);
    });
    console.log("\nContrôle d'intégrité de l'inventaire:", preview.inventoryIntegrityCheck);
    return;
  }

  console.log("🚀 Exécution de l'import idempotent...");
  const result = await executeImportLot01();
  console.log("\n--- RÉSULTAT D'EXÉCUTION ---");
  console.log(`Succès: ${result.success ? "OUI" : "NON"}`);
  console.log(`Batch: ${result.batchKey}`);
  console.log(`Nouvelles références insérées / mises à jour: ${result.stagedNewCount}`);
  console.log(`Candidats existants rapprochés: ${result.stagedReconciledCount}`);
  console.log(`Total en zone de préparation: ${result.totalStagedCount}`);
  console.log(`\n🛡️ Intégrité de l'inventaire membre vérifiée identique: ${result.inventoryVerifiedIdentical ? "CONFIRMÉE (Aucun stock altéré)" : "ÉCHEC"}`);
  console.log("Avant:", result.beforeSnapshot);
  console.log("Après:", result.afterSnapshot);
  console.log("\nNotes d'audit:");
  result.notes.forEach((n) => console.log(`  • ${n}`));
}

main()
  .catch((err) => {
    console.error("Erreur lors de l'import:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
