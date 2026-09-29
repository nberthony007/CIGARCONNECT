import React from "react";
import { prisma } from "@/lib/prisma";
import { CatalogStagingDashboard } from "@/components/catalog/CatalogStagingDashboard";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export default async function AdminCataloguePage() {
  // Récupération du lot et des références préparées
  const batch = await prisma.catalogImportBatch.findUnique({
    where: { batchKey: "catalogue-international-lot-01" },
  });

  const references = await prisma.catalogStagingReference.findMany({
    where: { batchKey: "catalogue-international-lot-01" },
    orderBy: [{ brand: "asc" }, { commercialName: "asc" }],
  });

  // Chargement du dictionnaire des sources
  let sourcesDict: Record<string, any> = {};
  try {
    const file40Path = path.resolve(process.cwd(), "imports/catalogue-international-lot-01/01-nouvelles-references-40.json");
    if (fs.existsSync(file40Path)) {
      const raw = JSON.parse(fs.readFileSync(file40Path, "utf-8"));
      sourcesDict = raw.sources || {};
    }
  } catch (e) {
    console.error("Erreur de chargement des sources:", e);
  }

  // Sérialisation des dates pour composants Client
  const serializedReferences = references.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  const batchInfo = {
    batchKey: batch?.batchKey || "catalogue-international-lot-01",
    title: batch?.title || "Premier lot international d'enrichissement",
    schemaVersion: batch?.schemaVersion || "1.0",
    status: batch?.status || "staged",
    importedAt: batch?.importedAt.toISOString() || new Date().toISOString(),
  };

  return (
    <CatalogStagingDashboard
      initialReferences={serializedReferences}
      sourcesDict={sourcesDict}
      batchInfo={batchInfo}
    />
  );
}
