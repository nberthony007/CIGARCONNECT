import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CigarData } from "@/components/catalog/CigarCard";
import { PieceDetailView } from "@/components/catalog/PieceDetailView";
import type { Metadata } from "next";

// Données de secours
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

async function getCigarById(id: string): Promise<CigarData | null> {
  try {
    const dbCigar = await prisma.cigarReference.findUnique({
      where: { id },
      include: {
        lots: {
          include: { user: true },
          take: 1,
        },
      },
    });

    if (dbCigar) {
      const fallback = fallbackCigars.find((f) => f.id === id);
      const firstLot = dbCigar.lots?.[0];
      return {
        id: dbCigar.id,
        brand: dbCigar.brand,
        name: dbCigar.name,
        origin: dbCigar.origin,
        countryCode: dbCigar.countryCode,
        vitola: dbCigar.vitola,
        ringGauge: dbCigar.ringGauge,
        lengthMm: dbCigar.lengthMm,
        vintageYear: dbCigar.vintageYear,
        rarityGrade: dbCigar.rarityGrade,
        rarityLabel: dbCigar.rarityLabel,
        defaultImageUrl: dbCigar.defaultImageUrl,
        factoryNotes: dbCigar.factoryNotes,
        strength: dbCigar.strength,
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
          : fallback?.owner,
      };
    }
  } catch (e) {
    // base non connectée ou hors ligne
  }

  const found = fallbackCigars.find((c) => c.id === id);
  return found || fallbackCigars[0];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const cigar = await getCigarById(id);

  if (!cigar) {
    return { title: "Pièce introuvable — CigarConnect" };
  }

  return {
    title: `${cigar.brand} ${cigar.name} — Fiche d'Expertise | CigarConnect`,
    description: `Fiche complète de la vitole ${cigar.brand} ${cigar.name} (${cigar.vitola}, Cepo ${cigar.ringGauge}). Conservation vérifiée sous 68–70% HR.`,
  };
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cigar = await getCigarById(id);

  if (!cigar) {
    notFound();
  }

  return <PieceDetailView cigar={cigar} />;
}
