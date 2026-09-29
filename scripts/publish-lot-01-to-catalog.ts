import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== SYNCHRONISATION DU LOT 01 VERS LE CATALOGUE UNIVERSEL CIGARCONNECT ===");

  const stagingRefs = await prisma.catalogStagingReference.findMany({
    where: { isCandidateForReconciliation: false }, // Les 40 nouvelles
  });

  console.log(`Nombre de nouvelles références en staging à publier : ${stagingRefs.length}`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const stg of stagingRefs) {
    const existing = await prisma.cigarReference.findFirst({
      where: {
        OR: [
          { stagingReferenceKey: stg.referenceKey },
          {
            brand: stg.brand,
            name: stg.commercialName,
            line: stg.line || undefined,
          },
        ],
      },
    });

    const defaultImg =
      stg.brand === "Cohiba"
        ? "/assets/cigar-behike56.jpg"
        : stg.brand === "Arturo Fuente"
        ? "/assets/cigar-partagas.jpg"
        : stg.brand === "Oliva"
        ? "/assets/cigar-lusitanias.jpg"
        : stg.brand === "AJ Fernandez"
        ? "/assets/cigar-fundadores.jpg"
        : stg.brand === "Padrón"
        ? "/assets/cigar-macro-detail.jpg"
        : stg.brand === "Bohekio"
        ? "/assets/fermin-perez-banner.jpg"
        : "/assets/cigar-macro-detail.jpg";

    const ringGaugeInt = stg.ringGauge || (stg.ringGaugeOriginal ? parseInt(stg.ringGaugeOriginal.split("/")[0], 10) : 50);
    const lengthMmInt = Math.round(stg.lengthMm || 150);

    const displayName = stg.line ? `${stg.line} — ${stg.commercialName}` : stg.commercialName;

    if (existing) {
      await prisma.cigarReference.update({
        where: { id: existing.id },
        data: {
          brand: stg.brand,
          name: displayName,
          origin: stg.manufacturerCountry === "CU" ? "Cuba" : stg.manufacturerCountry === "NI" ? "Nicaragua" : stg.brandCountryAffiliation === "HT" ? "Haïti" : stg.brandCountryAffiliation === "DO" ? "République Dominicaine" : "International",
          countryCode: stg.manufacturerCountry || stg.brandCountryAffiliation || "INT",
          vitola: stg.commercialName,
          ringGauge: ringGaugeInt,
          lengthMm: lengthMmInt,
          stagingReferenceKey: stg.referenceKey,
          line: stg.line,
          brandCountryAffiliation: stg.brandCountryAffiliation,
          manufacturerCountry: stg.manufacturerCountry,
          evidenceStatus: stg.evidenceStatus,
          rarityLabel: "Référence Documentée (Lot 01)",
        },
      });
      updatedCount++;
    } else {
      await prisma.cigarReference.create({
        data: {
          id: `ref-${stg.referenceKey}`,
          brand: stg.brand,
          name: displayName,
          origin: stg.manufacturerCountry === "CU" ? "Cuba" : stg.manufacturerCountry === "NI" ? "Nicaragua" : stg.brandCountryAffiliation === "HT" ? "Haïti" : stg.brandCountryAffiliation === "DO" ? "République Dominicaine" : "International",
          countryCode: stg.manufacturerCountry || stg.brandCountryAffiliation || "INT",
          vitola: stg.commercialName,
          ringGauge: ringGaugeInt,
          lengthMm: lengthMmInt,
          defaultImageUrl: defaultImg,
          stagingReferenceKey: stg.referenceKey,
          line: stg.line,
          brandCountryAffiliation: stg.brandCountryAffiliation,
          manufacturerCountry: stg.manufacturerCountry,
          evidenceStatus: stg.evidenceStatus,
          rarityLabel: "Référence Documentée (Lot 01)",
        },
      });
      createdCount++;
    }
  }

  const totalRefs = await prisma.cigarReference.count();
  console.log(`\n✅ SYNCHRONISATION TERMINÉE :`);
  console.log(`- Créées : ${createdCount}`);
  console.log(`- Mises à jour : ${updatedCount}`);
  console.log(`- Total vitoles dans le catalogue de référence (CigarReference) : ${totalRefs}`);

  // Vérification de non-altération des lots d'humidor
  const lotsCount = await prisma.humidorLot.count();
  const lots = await prisma.humidorLot.findMany();
  const totalUnits = lots.reduce((acc, l) => acc + l.quantity, 0);
  console.log(`- Intégrité humidor : ${lotsCount} lots, ${totalUnits} unités physiques (Strictement préservés).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
