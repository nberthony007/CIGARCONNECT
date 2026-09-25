import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { EditorialDarkSection } from "@/components/home/EditorialDarkSection";
import { CigarCatalog } from "@/components/catalog/CigarCatalog";
import { CigarData } from "@/components/catalog/CigarCard";
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Box, 
  Droplets, 
  BookOpen, 
  ArrowLeftRight,
  SlidersHorizontal,
  FileText
} from "lucide-react";
import { getSponsoredCampaign, getSponsoredCampaigns, getCampaignBySponsor } from "@/lib/actions/sponsors";
import { SponsoredPlacement } from "@/components/ui/SponsoredPlacement";
import { IndependentSponsorBanner } from "@/components/sponsors/IndependentSponsorBanner";

export const dynamic = "force-dynamic";

// Données de référence patrimoniales avec profils de collectionneurs certifiés
const fallbackCigars: CigarData[] = [
  {
    id: "cohiba-behike-56",
    brand: "Cohiba",
    name: "Behike BHK 56",
    origin: "Cuba",
    countryCode: "CU",
    vitola: "Laguito No. 6",
    ringGauge: 56,
    lengthMm: 166,
    vintageYear: "2010",
    rarityGrade: "ULTRA_RARE",
    rarityLabel: "Édition Historique",
    defaultImageUrl: "/assets/cigar-behike56.jpg",
    factoryNotes: "Intègre la feuille de Medio Tiempo. Arômes de crème, cèdre noble et fèves de cacao.",
    strength: "Moyenne à Forte",
    owner: {
      name: "Alexandre de M.",
      city: "Genève",
      country: "Suisse",
      initials: "AM",
      boxCode: "BBM MAY 10",
      conditionHr: "69.2% HR Stable",
      isTradeable: true,
    },
  },
  {
    id: "trinidad-fundadores",
    brand: "Trinidad",
    name: "Fundadores Millésime 1998",
    origin: "Cuba",
    countryCode: "CU",
    vitola: "Laguito No. 1",
    ringGauge: 40,
    lengthMm: 192,
    vintageYear: "1998",
    rarityGrade: "VINTAGE",
    rarityLabel: "Millésime Diplomatique",
    defaultImageUrl: "/assets/cigar-trinidad.jpg",
    factoryNotes: "Vitole réservée pendant des décennies aux dignitaires et chefs d'État.",
    strength: "Moyenne",
    owner: {
      name: "Jean-Marc L.",
      city: "Paris",
      country: "France",
      initials: "JM",
      boxCode: "CLE DIC 98",
      conditionHr: "68.8% HR Stable",
      isTradeable: true,
    },
  },
  {
    id: "montecristo-no2-reserva",
    brand: "Montecristo",
    name: "No. 2 Reserva Cosecha 2005",
    origin: "Cuba",
    countryCode: "CU",
    vitola: "Pirámide",
    ringGauge: 52,
    lengthMm: 156,
    vintageYear: "2005",
    rarityGrade: "RESERVA",
    rarityLabel: "Reserva Cosecha 2005",
    defaultImageUrl: "/assets/cigar-montecristo.jpg",
    factoryNotes: "Feuilles vieillies pendant 3 ans minimum. Rondeur crémeuse, cacao et épices chaudes.",
    strength: "Moyenne à Forte",
    owner: {
      name: "Lord Kensington",
      city: "Londres",
      country: "Royaume-Uni",
      initials: "LK",
      boxCode: "OEB NOV 09",
      conditionHr: "69.5% HR Stable",
      isTradeable: true,
    },
  },
  {
    id: "partagas-lusitanias",
    brand: "Partagás",
    name: "Lusitanias Gran Reserva Cosecha 2007",
    origin: "Cuba",
    countryCode: "CU",
    vitola: "Prominente",
    ringGauge: 49,
    lengthMm: 194,
    vintageYear: "2007",
    rarityGrade: "GRAN_RESERVA",
    rarityLabel: "Gran Reserva Cosecha 2007",
    defaultImageUrl: "/assets/cigar-lusitanias.jpg",
    factoryNotes: "Feuilles sélectionnées de la récolte 2007 et affinées pendant 5 ans.",
    strength: "Forte",
    owner: {
      name: "Philippe V.",
      city: "Bordeaux",
      country: "France",
      initials: "PV",
      boxCode: "LRE DIC 13",
      conditionHr: "68.9% HR Stable",
      isTradeable: true,
    },
  },
  {
    id: "davidoff-oro-blanco",
    brand: "Davidoff",
    name: "Oro Blanco Special Reserve 2002",
    origin: "République Dominicaine",
    countryCode: "DO",
    vitola: "Toro Extra",
    ringGauge: 54,
    lengthMm: 152,
    vintageYear: "2002",
    rarityGrade: "ULTRA_RARE",
    rarityLabel: "Special Reserve",
    defaultImageUrl: "/assets/cigar-davidoff.jpg",
    factoryNotes: "Tabacs récoltés en 2002 dans la vallée du Cibao et vieillis pendant plus de 12 ans.",
    strength: "Moyenne",
    owner: {
      name: "Carlos S.",
      city: "Madrid",
      country: "Espagne",
      initials: "CS",
      boxCode: "DAV-OB-02",
      conditionHr: "69.0% HR Stable",
      isTradeable: true,
    },
  },
];

export default async function HomePage() {
  let cigars: CigarData[] = [];

  try {
    const dbCigars = await prisma.cigarReference.findMany({
      orderBy: { brand: "asc" },
      include: {
        lots: {
          include: { user: true },
          take: 1,
        },
      },
    });

    if (dbCigars && dbCigars.length > 0) {
      cigars = dbCigars.map((c) => {
        const matchingFallback = fallbackCigars.find((f) => f.id === c.id || f.name === c.name);
        const firstLot = c.lots?.[0];

        return {
          id: c.id,
          brand: c.brand,
          name: c.name,
          origin: c.origin,
          countryCode: c.countryCode,
          vitola: c.vitola,
          ringGauge: c.ringGauge,
          lengthMm: c.lengthMm,
          vintageYear: c.vintageYear,
          rarityGrade: c.rarityGrade,
          rarityLabel: c.rarityLabel,
          defaultImageUrl: c.defaultImageUrl,
          factoryNotes: c.factoryNotes,
          strength: c.strength,
          owner: firstLot?.user
            ? {
                name: `${firstLot.user.firstName} ${firstLot.user.lastName.charAt(0)}.`,
                city: firstLot.user.city,
                country: firstLot.user.country,
                initials: firstLot.user.avatarInitials,
                boxCode: firstLot.boxCode || undefined,
                conditionHr: firstLot.conditionHr || "69% HR Stable",
                isTradeable: firstLot.isTradeable,
              }
            : matchingFallback?.owner,
        };
      });
    } else {
      cigars = fallbackCigars;
    }
  } catch (error) {
    cigars = fallbackCigars;
  }

  // 3 pièces emblématiques pour la Scène B (« À découvrir de près »)
  const selection3 = cigars.slice(0, 3);

  // Récupération des 3 sponsors indépendants (chacun avec son univers visuel propre)
  const kashimboCampaign = await getCampaignBySponsor("Kashimbo");
  const ferminCampaign = await getCampaignBySponsor("Fermin");
  const eliebleuCampaign = await getCampaignBySponsor("Elie Bleu");

  return (
    <div className="space-y-0">
      {/* =========================================================================
          SCÈNE A : PREMIÈRE SCÈNE (Section 10 A)
          « Votre collection. Toute une histoire. »
         ========================================================================= */}
      <HeroSection />

      {/* =========================================================================
          SCÈNE B : SÉLECTION DE PIÈCES (Section 10 B)
          « À découvrir de près. » — 3 pièces sur ordinateur, photo, marque, millésime
         ========================================================================= */}
      <section className="bg-[#FFFFFF] py-16 sm:py-20 border-t border-[#D9D2C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#D9D2C7]/60">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#6C4935] font-semibold mb-1">
                Sélection curatoriale
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[#211D19]">
                À découvrir de près.
              </h2>
            </div>
            <div>
              <a
                href="#catalogue"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4935] hover:text-[#211D19] transition-colors"
              >
                <span>Toutes les collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Grille des 3 pièces */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {selection3.map((cigar) => (
              <div
                key={cigar.id}
                className="group rounded-2xl border border-[#D9D2C7] bg-[#F7F5F0] overflow-hidden flex flex-col justify-between hover:border-[#6C4935] transition-all duration-200"
              >
                {/* Photo au ratio 4:5 avec fond soigné */}
                <div className="relative aspect-[4/3] sm:aspect-[4/3.5] w-full overflow-hidden bg-[#211D19]">
                  <img
                    src={cigar.defaultImageUrl}
                    alt={`${cigar.brand} ${cigar.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {cigar.vintageYear && (
                    <div className="absolute top-3 left-3 bg-[#211D19]/85 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider text-[#F7F5F0] font-medium border border-[#D9D2C7]/30">
                      {cigar.origin} · {cigar.vintageYear}
                    </div>
                  )}
                </div>

                {/* Métadonnées épurées */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#6C4935] font-semibold mb-1">
                      {cigar.brand}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-normal text-[#211D19] leading-snug">
                      {cigar.name}
                    </h3>
                    <p className="text-xs text-[#645C54] mt-1.5">
                      {cigar.vitola} · Cepo {cigar.ringGauge} · {cigar.lengthMm} mm
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D9D2C7]/70 flex items-center justify-between text-xs">
                    <span className="text-[#365343] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#365343]" />
                      {cigar.owner?.conditionHr || "68–70% HR"}
                    </span>
                    <Link
                      href={`/pieces/${cigar.id}`}
                      className="font-medium text-[#211D19] hover:text-[#6C4935] transition-colors flex items-center gap-1"
                    >
                      <span>Examiner</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            ESPACE INDÉPENDANT SPONSOR 1 : KASHIMBO CIGARS (Vert, Blanc, Noir)
           ========================================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <IndependentSponsorBanner brand="kashimbo" campaign={kashimboCampaign} />
        </div>
      </section>

      {/* =========================================================================
          SCÈNE C : HUMIDOR PERSONNEL (Section 10 C)
          « Chaque pièce, à sa place. » — Interface réelle & 3 bénéfices concrets
         ========================================================================= */}
      <section className="bg-[#F7F5F0] py-16 sm:py-24 border-t border-[#D9D2C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#6C4935] font-semibold mb-2">
              Gestionnaire de cave
            </div>
            <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[#211D19] tracking-tight">
              Chaque pièce, à sa place.
            </h2>
            <p className="text-sm sm:text-base text-[#645C54] mt-3 leading-relaxed">
              Un outil de haute précision conçu pour documenter vos vitoles, suivre les conditions d'affinage et garder la maîtrise absolue de vos partages.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* 3 Bénéfices Structurés */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#211D19] mb-1.5">
                  <Box className="w-4 h-4 text-[#6C4935]" />
                  <span>1. Organiser</span>
                </div>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  Inventoriez vos pièces par cave, cabinet ou boîte scellée. Consultez vos stocks en un coup d'œil avec chiffres tabulaires alignés.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#211D19] mb-1.5">
                  <FileText className="w-4 h-4 text-[#6C4935]" />
                  <span>2. Documenter</span>
                </div>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  Consignez les codes boîtes officiels de manufacture, les dates d'acquisition, les certificats et l'historique d'hygrométrie (68–70% HR).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#211D19] mb-1.5">
                  <Lock className="w-4 h-4 text-[#365343]" />
                  <span>3. Choisir ce que l'on partage</span>
                </div>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  Par défaut, l'intégralité de votre collection est privée. Vous décidez unitairement quelles vitoles rendre visibles pour l'échange de gré à gré.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/humidor"
                  className="btn-ink-primary"
                >
                  <span>Accéder à mon humidor</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            {/* Démonstration de l'interface réelle de collection (Ligne de synthèse et aperçu) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#D9D2C7] bg-[#FFFFFF] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#D9D2C7]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#645C54] font-semibold">
                      Aperçu d'inventaire
                    </span>
                    <h4 className="font-serif text-lg font-normal text-[#211D19]">
                      Cabinet Principal — Cèdre d'Espagne
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#365343]/10 text-[#365343] text-xs font-semibold">
                    <Droplets className="w-3.5 h-3.5" /> 69.2% HR
                  </span>
                </div>

                {/* Synthèse compacte */}
                <div className="py-4 border-b border-[#D9D2C7]/60 flex items-center justify-between text-xs text-[#645C54] tabular-nums">
                  <span><strong>17</strong> unités</span>
                  <span><strong>4</strong> lots qualifiés</span>
                  <span className="text-[#365343] font-medium"><strong>3</strong> ouvertes à l'échange</span>
                  <span className="text-[#645C54]"><strong>14</strong> en garde privée</span>
                </div>

                {/* Liste d'échantillons réels */}
                <div className="divide-y divide-[#D9D2C7]/60 pt-2">
                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#211D19]">Cohiba Behike BHK 56</div>
                      <div className="text-[11px] text-[#645C54]">Boîte BBM MAY 10 · Cèdre massif</div>
                    </div>
                    <span className="text-xs font-semibold text-[#211D19] tabular-nums">1 unité</span>
                  </div>

                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#211D19]">Trinidad Fundadores 1998</div>
                      <div className="text-[11px] text-[#645C54]">Boîte CLE DIC 98 · Diplomatique</div>
                    </div>
                    <span className="text-xs font-semibold text-[#211D19] tabular-nums">2 unités</span>
                  </div>

                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#211D19]">Montecristo No. 2 Reserva</div>
                      <div className="text-[11px] text-[#645C54]">Cosecha 2005 · Millésime scellé</div>
                    </div>
                    <span className="text-xs font-semibold text-[#211D19] tabular-nums">1 boîte (20)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCÈNE D : SECTION DE MATIÈRE SOMBRE (Section 10 D)
          « Le détail mérite votre attention. » — Photographie macro sur fond #1B1916
         ========================================================================= */}
      <EditorialDarkSection />

      {/* =========================================================================
          SCÈNE E : LE CERCLE (Section 10 E)
          « Le Cercle — Échanges de gré à gré » — Troc pur, salon feutré, réservation atomique
         ========================================================================= */}
      <section id="cercle" className="bg-[#FFFFFF] py-16 sm:py-24 border-t border-[#D9D2C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#6C4935] font-semibold">
                Salon de négociation privée
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl font-semibold text-[#211D19] tracking-tight">
                Le Cercle : Échanges de gré à gré.
              </h2>

              <p className="text-sm sm:text-base text-[#645C54] leading-relaxed">
                Négociez d'égal à égal dans un salon confidentiel. Aucun intermédiaire commercial, aucune commission prélevée : dès qu'un accord mutuel est confirmé sur une proposition, les unités correspondantes sont réservées immédiatement de manière atomique, écartant tout risque de double promesse.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#211D19]">
                  <ShieldCheck className="w-4 h-4 text-[#365343] shrink-0" />
                  <span>Réservation transactionnelle atomique des stocks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#211D19]">
                  <Lock className="w-4 h-4 text-[#365343] shrink-0" />
                  <span>Salons privés chiffrés · Valorisations confidentielles</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/trade"
                  className="btn-ink-primary"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Entrer dans Le Cercle</span>
                </Link>
              </div>
            </div>

            {/* Dossier d'échange structuré (Section 15) */}
            <div className="lg:col-span-6">
              <div className="bg-[#F7F5F0] border border-[#D9D2C7] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-[#D9D2C7] text-xs">
                  <span className="font-semibold text-[#211D19]">
                    Dossier d'Échange N° 849-PARIS
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#365343]/10 text-[#365343] font-semibold text-[10px] border border-[#365343]/30">
                    Accord en négociation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                  <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#D9D2C7]">
                    <div className="text-[10px] uppercase tracking-wider text-[#645C54] mb-1">
                      Proposition de Jean-Marc (Paris)
                    </div>
                    <div className="font-serif text-sm font-semibold text-[#211D19]">
                      1x Cohiba Behike 56
                    </div>
                    <div className="text-[11px] text-[#6C4935] mt-1">
                      Boîte BBM MAY 10 · 69.2% HR
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#D9D2C7]">
                    <div className="text-[10px] uppercase tracking-wider text-[#645C54] mb-1">
                      Proposition d'Alexandre (Genève)
                    </div>
                    <div className="font-serif text-sm font-semibold text-[#211D19]">
                      1x Trinidad Fundadores 1998
                    </div>
                    <div className="text-[11px] text-[#6C4935] mt-1">
                      Millésime Diplomatique · 68.8% HR
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D9D2C7] flex items-center justify-between text-xs text-[#645C54]">
                  <span>Modalité convenue : Remise en main propre</span>
                  <Link 
                    href="/trade" 
                    className="font-semibold text-[#6C4935] hover:underline"
                  >
                    Voir la version 2.1
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ESPACE INDÉPENDANT SPONSOR 2 : FERMIN PEREZ CIGARS (Noir et Or)
         ========================================================================= */}
      <section className="bg-[#EEEAE3] py-12 border-t border-[#D9D2C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <IndependentSponsorBanner brand="fermin" campaign={ferminCampaign} />
        </div>
      </section>

      {/* =========================================================================
          CATALOGUE COMPLET DES VITOLES (Ancré #catalogue)
         ========================================================================= */}
      <CigarCatalog initialCigars={cigars} />

      {/* =========================================================================
          SCÈNE F : JOURNAL (Section 10 F)
          Deux articles maximum mis en avant avec date, auteur et visuels sobres
         ========================================================================= */}
      <section id="journal" className="bg-[#FFFFFF] py-16 sm:py-20 border-t border-[#D9D2C7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#D9D2C7]/60">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#6C4935] font-semibold mb-1">
                Transmission & Rituels
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[#211D19]">
                Journal de la Manufacture.
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-xs font-semibold text-[#6C4935] hover:text-[#211D19] transition-colors flex items-center gap-1 group"
            >
              <span>Consulter l'édition complète</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Article 1 */}
            <article className="group rounded-2xl border border-[#D9D2C7] bg-[#F7F5F0] overflow-hidden flex flex-col justify-between hover:border-[#6C4935] transition-all">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#211D19]">
                <img
                  src="/assets/cigar-davidoff.jpg"
                  alt="Dégustation et conservation de cigares rares"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="text-[11px] uppercase tracking-wider text-[#6C4935] font-semibold">
                  Conservation & Rituels · 14 Septembre 2026
                </div>
                <h3 className="font-serif text-xl font-normal text-[#211D19] group-hover:text-[#6C4935] transition-colors leading-snug">
                  L'art de l'hygrométrie : pourquoi la règle des 68–70% protège les huiles essentielles
                </h3>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  Comprendre l'impact de la tension de vapeur d'eau sur l'élasticité de la cape et le vieillissement harmonieux des terroirs de la Vuelta Abajo.
                </p>
                <div className="text-[11px] text-[#857A6D] pt-2 border-t border-[#D9D2C7]/60">
                  Par <strong>Jean-Marc L.</strong>, Conservateur de cave
                </div>
              </div>
            </article>

            {/* Article 2 */}
            <article className="group rounded-2xl border border-[#D9D2C7] bg-[#F7F5F0] overflow-hidden flex flex-col justify-between hover:border-[#6C4935] transition-all">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#211D19]">
                <img
                  src="/assets/hero-cigar-library.jpg"
                  alt="Cabinet de cigares et boîtes scellées de La Havane"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="text-[11px] uppercase tracking-wider text-[#6C4935] font-semibold">
                  Traçabilité & Codes Usine · 02 Août 2026
                </div>
                <h3 className="font-serif text-xl font-normal text-[#211D19] group-hover:text-[#6C4935] transition-colors leading-snug">
                  Les secrets des codes usines de La Havane : décoder le mois et la manufacture
                </h3>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  De la codification NIVELACUSO aux codes modernes à 3 lettres : méthode rigoureuse pour dater précisément vos coffrets et vérifier leur authenticité.
                </p>
                <div className="text-[11px] text-[#857A6D] pt-2 border-t border-[#D9D2C7]/60">
                  Par <strong>Alexandre de M.</strong>, Collectionneur
                </div>
              </div>
            </article>
          </div>

          {/* =========================================================================
              ESPACE INDÉPENDANT SPONSOR 3 : MAISON ELIE BLEU PARIS (Bleu Nuit, Blanc, Laiton)
             ========================================================================= */}
          <div className="pt-12 border-t border-[#D9D2C7]/50 mt-12">
            <IndependentSponsorBanner brand="eliebleu" campaign={eliebleuCampaign} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCÈNE G : INVITATION FINALE (Section 10 G)
          « Donnez une place à votre collection. » — Action « Créer mon humidor »
         ========================================================================= */}
      <section className="bg-[#EEEAE3] py-20 border-t border-[#D9D2C7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="text-[11px] uppercase tracking-[0.14em] text-[#6C4935] font-semibold">
            Rejoindre la phase pilote
          </div>

          <h2 className="font-sans text-3xl sm:text-5xl font-semibold text-[#211D19] tracking-tight">
            Donnez une place à votre collection.
          </h2>

          <p className="text-sm sm:text-base text-[#645C54] max-w-xl mx-auto leading-relaxed">
            Documentez vos premières pièces dans un espace calme, confidentiel et dédié aux passionnés de haute conservation.
          </p>

          <div className="pt-2">
            <Link
              href="/humidor"
              className="btn-ink-primary text-base px-8 py-3"
            >
              <span>Créer mon humidor</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <p className="text-xs text-[#857A6D] pt-2">
            Privé par défaut. Aucune information ni valorisation n'est rendue publique sans votre accord formel.
          </p>
        </div>
      </section>
    </div>
  );
}
