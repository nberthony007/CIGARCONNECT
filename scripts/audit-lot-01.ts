import fs from "fs";
import path from "path";

const file40Path = path.resolve(process.cwd(), "imports/catalogue-international-lot-01/01-nouvelles-references-40.json");
const file10Path = path.resolve(process.cwd(), "imports/catalogue-international-lot-01/02-references-existantes-a-revoir-10.json");

const data40 = JSON.parse(fs.readFileSync(file40Path, "utf-8"));
const data10 = JSON.parse(fs.readFileSync(file10Path, "utf-8"));

console.log("=== AUDIT FICHIER 40 RÉFÉRENCES NOUVELLES ===");
console.log(`Version: ${data40.schema_version}, Count déclaré: ${data40.count}, Références réelles: ${data40.references.length}`);
console.log(`Sources déclarées: ${Object.keys(data40.sources).length} sources`);

// Vérification de l'unicité des clés
const keys40 = new Set<string>();
const duplicateKeys: string[] = [];
data40.references.forEach((r: any) => {
  if (keys40.has(r.reference_key)) duplicateKeys.push(r.reference_key);
  keys40.add(r.reference_key);
});
console.log(`Clés uniques: ${keys40.size} / 40. Doublons détectés: ${duplicateKeys.length}`);

// Ventilation par marque et statut
const brandCounts: Record<string, number> = {};
const statusCounts: Record<string, number> = {};
const doubleGauges: any[] = [];
const haitiAffiliated: any[] = [];

data40.references.forEach((r: any) => {
  brandCounts[r.brand] = (brandCounts[r.brand] || 0) + 1;
  statusCounts[r.evidence_status] = (statusCounts[r.evidence_status] || 0) + 1;
  if (r.ring_gauge_original && r.ring_gauge_original.includes("/")) {
    doubleGauges.push({ brand: r.brand, name: r.commercial_name, original: r.ring_gauge_original, parsed: r.ring_gauge });
  }
  if (r.brand_country_affiliation === "HT" || r.brand.toLowerCase().includes("bohekio")) {
    haitiAffiliated.push({
      brand: r.brand,
      name: r.commercial_name,
      affiliation: r.brand_country_affiliation,
      manufacturer: r.manufacturer_country,
      status: r.evidence_status,
      notes: r.notes
    });
  }
});

console.log("Ventilation par marque:", brandCounts);
console.log("Ventilation par statut de preuve:", statusCounts);
console.log(`Calibres doubles préservés (${doubleGauges.length}):`, doubleGauges);
console.log(`Références liées à Haïti (${haitiAffiliated.length}):`, haitiAffiliated);

console.log("\n=== AUDIT FICHIER 10 CANDIDATS EXISTANTS ===");
console.log(`Count déclaré: ${data10.count}, Références: ${data10.references.length}`);
data10.references.forEach((r: any, idx: number) => {
  console.log(`  [${idx + 1}] ${r.candidate_key} | ${r.brand} — ${r.declared_name} | format: ${r.declared_format} | status: ${r.evidence_status}/${r.publication_status}`);
});
