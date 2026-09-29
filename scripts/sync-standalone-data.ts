import fs from "fs";
import path from "path";

const data40 = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "imports/catalogue-international-lot-01/01-nouvelles-references-40.json"), "utf-8"));
const data10 = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "imports/catalogue-international-lot-01/02-references-existantes-a-revoir-10.json"), "utf-8"));

const stagingSummary = [
  ...data40.references.map((r: any) => ({
    referenceKey: r.reference_key,
    brand: r.brand,
    line: r.line || null,
    name: r.commercial_name,
    lengthMm: r.length_mm,
    ringGauge: r.ring_gauge,
    ringGaugeOriginal: r.ring_gauge_original,
    wrapperOptions: r.wrapper_options || [],
    manufacturerCountry: r.manufacturer_country,
    brandCountryAffiliation: r.brand_country_affiliation,
    evidenceStatus: r.evidence_status,
    publicationStatus: r.publication_status,
    sources: r.source_ids || []
  })),
  ...data10.references.map((r: any) => ({
    referenceKey: r.candidate_key,
    brand: r.brand,
    line: null,
    name: r.declared_name,
    lengthMm: r.parsed_length_mm,
    ringGauge: r.parsed_ring_gauge,
    ringGaugeOriginal: String(r.parsed_ring_gauge),
    wrapperOptions: [],
    manufacturerCountry: r.manufacturer_country,
    brandCountryAffiliation: r.declared_origin?.includes("Haïti") ? "HT" : null,
    evidenceStatus: r.evidence_status,
    publicationStatus: r.publication_status,
    sources: []
  }))
];

const jsContent = `\n/**
 * LOT INTERNATIONAL 01 — ZONE DE PRÉPARATION DU CATALOGUE (STAGING)
 * 40 Nouvelles Vitoles Candidates · 10 Désignations Rapprochées en Réserve
 */
const DEMO_CATALOG_STAGING_LOT_01 = ${JSON.stringify(stagingSummary, null, 2)};
`;

const dataJsPath = path.resolve(process.cwd(), "js/data.js");
let currentDataJs = fs.readFileSync(dataJsPath, "utf-8");

if (!currentDataJs.includes("DEMO_CATALOG_STAGING_LOT_01")) {
  currentDataJs += jsContent;
  fs.writeFileSync(dataJsPath, currentDataJs, "utf-8");
  console.log("DEMO_CATALOG_STAGING_LOT_01 ajouté avec succès à js/data.js");
} else {
  console.log("DEMO_CATALOG_STAGING_LOT_01 déjà présent dans js/data.js");
}
