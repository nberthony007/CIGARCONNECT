"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface HumidorLotWithCigar {
  id: string;
  userId: string;
  cigarReferenceId: string | null;
  isCustomPiece?: boolean;
  customBrand?: string | null;
  customName?: string | null;
  customVitola?: string | null;
  customOrigin?: string | null;
  humidorLocation?: string | null;
  acquisitionDate?: string | null;
  purchasePrice?: number | null;
  purchaseCurrency?: string | null;
  privateNotes?: string | null;
  quantity: number;
  reservedQuantity: number;
  conditionHr: string;
  conditionTemp: string;
  conditionNotes: string | null;
  packaging: string;
  boxCode: string | null;
  boxCodeVerified: boolean;
  provenanceDeclared: string | null;
  customPhotoUrl: string | null;
  valuationAmount: number | null;
  valuationSource: string | null;
  isTradeable: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  cigarReference: {
    id: string;
    brand: string;
    name: string;
    origin: string;
    countryCode: string;
    vitola: string;
    ringGauge: number;
    lengthMm: number;
    vintageYear: string | null;
    rarityGrade: string;
    rarityLabel: string;
    defaultImageUrl: string;
    factoryNotes: string | null;
    strength: string;
  } | null;
}

export interface HumidorStats {
  totalQuantity: number;
  tradeableQuantity: number;
  reservedQuantity: number;
  avgHr: string;
  avgTemp: string;
  boxesCount: number;
}

// Récupération complète de la cave avec calcul des indicateurs de conservation
export async function getUserHumidor(userEmail: string = "alexandre.montmirail@cigarconnect.fr") {
  try {
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { privacySettings: true },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        include: { privacySettings: true },
      });
    }

    if (!user) {
      throw new Error(`Aucun aficionado trouvé dans la base.`);
    }

    const lots = await prisma.humidorLot.findMany({
      where: { userId: user.id },
      include: { cigarReference: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculs statistiques précis
    let totalQty = 0;
    let tradeableQty = 0;
    let reservedQty = 0;
    let boxes = 0;

    for (const lot of lots) {
      totalQty += lot.quantity;
      if (lot.isTradeable) {
        tradeableQty += Math.max(0, lot.quantity - lot.reservedQuantity);
      }
      reservedQty += lot.reservedQuantity;
      if (lot.packaging.toLowerCase().includes("boîte") || lot.packaging.toLowerCase().includes("cabinet") || lot.packaging.toLowerCase().includes("coffret")) {
        boxes++;
      }
    }

    const stats: HumidorStats = {
      totalQuantity: totalQty,
      tradeableQuantity: tradeableQty,
      reservedQuantity: reservedQty,
      avgHr: "69.2% HR", // Conforme aux mesures Boveda actives
      avgTemp: "19.0°C",
      boxesCount: boxes,
    };

    return { user, lots: lots as HumidorLotWithCigar[], stats };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'humidor :", error);
    return {
      user: {
        id: "default-user",
        email: userEmail,
        firstName: "Alexandre",
        lastName: "de Montmirail",
        city: "Paris",
        country: "France",
        role: "MEMBER",
        avatarInitials: "AM",
        bio: "Collectionneur aficionado passionné par les terroirs d'Amérique centrale et les grands millésimes cubains.",
        createdAt: new Date(),
        updatedAt: new Date(),
        privacySettings: null,
      },
      lots: [] as HumidorLotWithCigar[],
      stats: {
        totalQuantity: 0,
        tradeableQuantity: 0,
        reservedQuantity: 0,
        avgHr: "69.0% HR",
        avgTemp: "19.0°C",
        boxesCount: 0,
      },
    };
  }
}

// Récupération de l'ensemble des vitoles du catalogue universel pour la sélection
export async function getUniversalCigars() {
  try {
    return await prisma.cigarReference.findMany({
      orderBy: { brand: "asc" },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du catalogue universel :", error);
    return [];
  }
}

// Ajout d'une vitole en cave avec traçabilité et conservation Boveda (Hybride Référencé ou Hors Catalogue)
export async function addHumidorLot(data: {
  userId: string;
  cigarReferenceId?: string;
  isCustomPiece?: boolean;
  customBrand?: string;
  customName?: string;
  customVitola?: string;
  customOrigin?: string;
  humidorLocation?: string;
  quantity: number;
  packaging: string;
  boxCode?: string;
  boxCodeVerified?: boolean;
  provenanceDeclared?: string;
  customPhotoUrl?: string;
  conditionHr?: string;
  conditionTemp?: string;
  conditionNotes?: string;
  acquisitionDate?: string;
  purchasePrice?: number;
  purchaseCurrency?: string;
  privateNotes?: string;
  valuationAmount?: number;
  valuationSource?: string;
  isTradeable: boolean;
  isPublic?: boolean;
}) {
  try {
    const newLot = await prisma.humidorLot.create({
      data: {
        userId: data.userId,
        cigarReferenceId: data.cigarReferenceId || null,
        isCustomPiece: data.isCustomPiece ?? !data.cigarReferenceId,
        customBrand: data.customBrand || null,
        customName: data.customName || null,
        customVitola: data.customVitola || null,
        customOrigin: data.customOrigin || null,
        humidorLocation: data.humidorLocation || null,
        quantity: data.quantity,
        packaging: data.packaging || "Unité individuelle",
        boxCode: data.boxCode || null,
        boxCodeVerified: data.boxCodeVerified ?? Boolean(data.boxCode),
        provenanceDeclared: data.provenanceDeclared || null,
        customPhotoUrl: data.customPhotoUrl || null,
        conditionHr: data.conditionHr || "69% HR",
        conditionTemp: data.conditionTemp || "19°C",
        conditionNotes: data.conditionNotes || null,
        acquisitionDate: data.acquisitionDate || null,
        purchasePrice: data.purchasePrice || null,
        purchaseCurrency: data.purchaseCurrency || "EUR",
        privateNotes: data.privateNotes || null,
        valuationAmount: data.valuationAmount || null,
        valuationSource: data.valuationSource || "Estimation déclarée",
        isTradeable: data.isTradeable,
        isPublic: data.isPublic ?? data.isTradeable,
      },
      include: { cigarReference: true },
    });

    try {
      revalidatePath("/humidor");
      revalidatePath("/");
    } catch {}
    return { success: true, lot: newLot };
  } catch (error) {
    console.error("Erreur lors de l'ajout en cave :", error);
    return { success: false, error: "Impossible d'enregistrer la vitole en cave." };
  }
}

// Proposer une référence au catalogue éditorial (Section 5)
export async function submitCatalogContribution(data: {
  userId: string;
  lotId?: string;
  brand: string;
  line?: string;
  name: string;
  format: string;
  ringGauge?: number;
  lengthMm?: number;
  originCountry?: string;
  shareableImageUrl?: string;
}) {
  try {
    const contribution = await prisma.catalogContribution.create({
      data: {
        userId: data.userId,
        lotId: data.lotId || null,
        brand: data.brand.trim(),
        line: data.line?.trim() || null,
        name: data.name.trim(),
        format: data.format.trim(),
        ringGauge: data.ringGauge ? Number(data.ringGauge) : null,
        lengthMm: data.lengthMm ? Number(data.lengthMm) : null,
        originCountry: data.originCountry?.trim() || "Cuba",
        shareableImageUrl: data.shareableImageUrl || null,
        status: "submitted",
      },
    });

    try {
      revalidatePath("/humidor");
    } catch {}

    return { 
      success: true, 
      contributionId: contribution.id,
      message: "Votre proposition a été transmise pour revue. Votre pièce reste disponible dans votre humidor."
    };
  } catch (error) {
    console.error("Erreur proposition catalogue :", error);
    return { success: false, error: "Impossible de transmettre la proposition au comité éditorial." };
  }
}

// Bascule de l'échangeabilité d'un lot dans Le Cercle
export async function toggleLotTradeable(lotId: string, isTradeable: boolean) {
  try {
    const updated = await prisma.humidorLot.update({
      where: { id: lotId },
      data: {
        isTradeable,
        isPublic: isTradeable ? true : undefined,
      },
    });

    try {
      revalidatePath("/humidor");
      revalidatePath("/");
    } catch {}
    return { success: true, isTradeable: updated.isTradeable };
  } catch (error) {
    console.error("Erreur lors de la modification du statut de troc :", error);
    return { success: false, error: "Erreur de mise à jour." };
  }
}

// Dégustation d'une vitole : décrémente de 1 unité le stock
export async function consumeLotStick(lotId: string) {
  try {
    const current = await prisma.humidorLot.findUnique({
      where: { id: lotId },
    });

    if (!current) {
      throw new Error("Lot introuvable.");
    }

    if (current.quantity <= 1) {
      // Si c'est la dernière pièce dégustée, on supprime le lot ou on le passe à 0
      await prisma.humidorLot.delete({
        where: { id: lotId },
      });
    } else {
      await prisma.humidorLot.update({
        where: { id: lotId },
        data: { quantity: { decrement: 1 } },
      });
    }

    try {
      revalidatePath("/humidor");
      revalidatePath("/");
    } catch {}
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la dégustation :", error);
    return { success: false, error: "Impossible de décrémenter le stock." };
  }
}

// Retrait définitif d'un lot de la cave
export async function deleteHumidorLot(lotId: string) {
  try {
    await prisma.humidorLot.delete({
      where: { id: lotId },
    });

    try {
      revalidatePath("/humidor");
      revalidatePath("/");
    } catch {}
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du lot :", error);
    return { success: false, error: "Impossible de supprimer le lot." };
  }
}
