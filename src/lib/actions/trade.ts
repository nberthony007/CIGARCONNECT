"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface TradeWithDetails {
  id: string;
  proposerId: string;
  recipientId: string;
  status: string; // SUBMITTED, NEGOTIATING, MUTUALLY_AGREED, IN_TRANSIT, COMPLETED, DECLINED
  currentVersion: number;
  exchangeLocationType: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  proposer: {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    avatarInitials: string;
    role: string;
  };
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    avatarInitials: string;
    role: string;
  };
  versions: Array<{
    id: string;
    versionNumber: number;
    offeredLotId: string;
    offeredQuantity: number;
    desiredLotId: string;
    desiredQuantity: number;
    notes: string | null;
    signedByProposer: boolean;
    signedByRecipient: boolean;
    createdAt: Date;
  }>;
  messages: Array<{
    id: string;
    senderId: string;
    content: string;
    isSystemEvent: boolean;
    createdAt: Date;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      avatarInitials: string;
    };
  }>;
}

// Récupération de l'ensemble des échanges pour un aficionado donné
export async function getUserTrades(userEmail: string = "alexandre.montmirail@cigarconnect.fr") {
  try {
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      user = await prisma.user.findFirst();
    }

    if (!user) {
      throw new Error(`Aucun aficionado trouvé.`);
    }

    const trades = await prisma.tradeProposal.findMany({
      where: {
        OR: [{ proposerId: user.id }, { recipientId: user.id }],
      },
      include: {
        proposer: true,
        recipient: true,
        versions: {
          orderBy: { versionNumber: "desc" },
        },
        messages: {
          include: { sender: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Chargement de l'inventaire des vitoles universelles pour mapper les IDs
    const universalCigars = await prisma.cigarReference.findMany();
    const cigarsMap = new Map(universalCigars.map((c) => [c.id, c]));

    return {
      user,
      trades: trades as TradeWithDetails[],
      universalCigars,
      cigarsMap: Object.fromEntries(cigarsMap),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des échanges :", error);
    throw error;
  }
}

// Initialisation d'une proposition de troc pur de gré à gré
export async function createTradeProposal(data: {
  proposerId: string;
  recipientId: string;
  offeredCigarId: string;
  offeredQuantity: number;
  desiredCigarId: string;
  desiredQuantity: number;
  exchangeLocationType: string;
  initialMessage?: string;
}) {
  try {
    const trade = await prisma.$transaction(async (tx) => {
      const newTrade = await tx.tradeProposal.create({
        data: {
          proposerId: data.proposerId,
          recipientId: data.recipientId,
          status: "SUBMITTED",
          currentVersion: 1,
          exchangeLocationType:
            data.exchangeLocationType || "Salon privé convenu d'un commun accord",
          notes: data.initialMessage || "Proposition d'échange entre gentlemen aficionados.",
          versions: {
            create: {
              versionNumber: 1,
              offeredLotId: data.offeredCigarId,
              offeredQuantity: data.offeredQuantity || 1,
              desiredLotId: data.desiredCigarId,
              desiredQuantity: data.desiredQuantity || 1,
              notes: data.initialMessage || "Offre initiale V1",
              signedByProposer: true,
              signedByRecipient: false,
            },
          },
        },
      });

      if (data.initialMessage) {
        await tx.tradeMessage.create({
          data: {
            tradeProposalId: newTrade.id,
            senderId: data.proposerId,
            content: data.initialMessage,
            isSystemEvent: false,
          },
        });
      }

      await tx.tradeMessage.create({
        data: {
          tradeProposalId: newTrade.id,
          senderId: data.proposerId,
          content: "Proposition d'échange V1 soumise dans Le Cercle.",
          isSystemEvent: true,
        },
      });

      return newTrade;
    });

    try {
      revalidatePath("/trade");
      revalidatePath("/humidor");
      revalidatePath("/");
    } catch {}

    return { success: true, trade };
  } catch (error) {
    console.error("Erreur lors de l'initiation du troc :", error);
    return { success: false, error: "Impossible de créer la proposition d'échange." };
  }
}

// Soumission d'une contre-offre (Version N+1)
export async function submitCounterOffer(data: {
  tradeProposalId: string;
  senderId: string;
  offeredCigarId: string;
  offeredQuantity: number;
  desiredCigarId: string;
  desiredQuantity: number;
  notes?: string;
}) {
  try {
    const trade = await prisma.tradeProposal.findUnique({
      where: { id: data.tradeProposalId },
      include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
    });

    if (!trade) {
      throw new Error("Dossier d'échange introuvable.");
    }

    const nextVersionNum = (trade.versions[0]?.versionNumber || 1) + 1;
    const isProposer = data.senderId === trade.proposerId;

    await prisma.$transaction(async (tx) => {
      await tx.tradeVersion.create({
        data: {
          tradeProposalId: data.tradeProposalId,
          versionNumber: nextVersionNum,
          offeredLotId: data.offeredCigarId,
          offeredQuantity: data.offeredQuantity,
          desiredLotId: data.desiredCigarId,
          desiredQuantity: data.desiredQuantity,
          notes: data.notes || `Contre-offre V${nextVersionNum}`,
          signedByProposer: isProposer,
          signedByRecipient: !isProposer,
        },
      });

      await tx.tradeProposal.update({
        where: { id: data.tradeProposalId },
        data: {
          currentVersion: nextVersionNum,
          status: "NEGOTIATING",
        },
      });

      await tx.tradeMessage.create({
        data: {
          tradeProposalId: data.tradeProposalId,
          senderId: data.senderId,
          content: `Contre-offre Version ${nextVersionNum} déposée : ${data.notes || "Ajustement des termes de l'échange."}`,
          isSystemEvent: true,
        },
      });
    });

    try {
      revalidatePath("/trade");
      revalidatePath("/humidor");
    } catch {}

    return { success: true, versionNumber: nextVersionNum };
  } catch (error) {
    console.error("Erreur lors de la contre-offre :", error);
    return { success: false, error: "Impossible de soumettre la contre-offre." };
  }
}

// ACCEPTATION OFFICIELLE : RÉSERVATION ATOMIQUE DE STOCK SOUS TRANSACTION
export async function acceptTradeProposal(
  tradeProposalId: string,
  versionId: string,
  userId: string
): Promise<{ success: true; status: string } | { success: false; error: string }> {
  try {
    return await prisma.$transaction(async (tx) => {
      const trade = await tx.tradeProposal.findUnique({
        where: { id: tradeProposalId },
        include: {
          proposer: true,
          recipient: true,
          versions: { where: { id: versionId } },
        },
      });

      if (!trade || trade.versions.length === 0) {
        throw new Error("Proposition ou version d'échange introuvable.");
      }

      const activeVersion = trade.versions[0];
      const isProposer = userId === trade.proposerId;

      // 1. Signature électronique de la partie qui accepte
      await tx.tradeVersion.update({
        where: { id: versionId },
        data: {
          signedByProposer: isProposer ? true : activeVersion.signedByProposer,
          signedByRecipient: !isProposer ? true : activeVersion.signedByRecipient,
        },
      });

      // 2. Vérification et Réservation Atomique des stocks pour l'offrant
      // Recherche du lot en cave correspondant à la vitole offerte
      const offeredLot = await tx.humidorLot.findFirst({
        where: {
          userId: trade.proposerId,
          cigarReferenceId: activeVersion.offeredLotId,
        },
      });

      if (offeredLot) {
        const availableQty = offeredLot.quantity - offeredLot.reservedQuantity;
        if (availableQty < activeVersion.offeredQuantity) {
          throw new Error(
            `Stock insuffisant : seules ${availableQty} pièce(s) restent disponible(s) en cave.`
          );
        }

        // Verrouillage atomique
        await tx.humidorLot.update({
          where: { id: offeredLot.id },
          data: {
            reservedQuantity: { increment: activeVersion.offeredQuantity },
          },
        });
      }

      // 3. Passage de l'échange au statut MUTUALLY_AGREED
      const updatedTrade = await tx.tradeProposal.update({
        where: { id: tradeProposalId },
        data: { status: "MUTUALLY_AGREED" },
      });

      // 4. Message officiel scellé
      await tx.tradeMessage.create({
        data: {
          tradeProposalId,
          senderId: userId,
          content: `Accord mutuel scellé sur la Version ${activeVersion.versionNumber}. Stock réservé atomiquement sous contrôle d'hygrométrie 68–70% HR.`,
          isSystemEvent: true,
        },
      });

      try {
        revalidatePath("/trade");
        revalidatePath("/humidor");
        revalidatePath("/");
      } catch {}

      return { success: true, status: updatedTrade.status };
    });
  } catch (error: any) {
    console.error("Erreur lors de l'accord mutuel atomique :", error);
    return {
      success: false,
      error: error.message || "Erreur lors de la confirmation de l'accord.",
    };
  }
}

// CLÔTURE DÉFINITIVE & TRANSFERT D'INVENTAIRE
export async function finalizeTradeExchange(
  tradeProposalId: string,
  userId: string
): Promise<{ success: true; status: string } | { success: false; error: string }> {
  try {
    return await prisma.$transaction(async (tx) => {
      const trade = await tx.tradeProposal.findUnique({
        where: { id: tradeProposalId },
        include: {
          versions: { orderBy: { versionNumber: "desc" }, take: 1 },
        },
      });

      if (!trade || trade.status !== "MUTUALLY_AGREED") {
        throw new Error("L'échange doit faire l'objet d'un accord mutuel avant clôture.");
      }

      const activeVer = trade.versions[0];

      // 1. Décrémentation chez l'offrant
      const offeredLot = await tx.humidorLot.findFirst({
        where: {
          userId: trade.proposerId,
          cigarReferenceId: activeVer.offeredLotId,
        },
      });

      if (offeredLot) {
        if (offeredLot.quantity <= activeVer.offeredQuantity) {
          await tx.humidorLot.delete({ where: { id: offeredLot.id } });
        } else {
          await tx.humidorLot.update({
            where: { id: offeredLot.id },
            data: {
              quantity: { decrement: activeVer.offeredQuantity },
              reservedQuantity: { decrement: activeVer.offeredQuantity },
            },
          });
        }
      }

      // 2. Transfert dans la cave du receveur
      const existingRecipientLot = await tx.humidorLot.findFirst({
        where: {
          userId: trade.recipientId,
          cigarReferenceId: activeVer.offeredLotId,
        },
      });

      if (existingRecipientLot) {
        await tx.humidorLot.update({
          where: { id: existingRecipientLot.id },
          data: { quantity: { increment: activeVer.offeredQuantity } },
        });
      } else {
        await tx.humidorLot.create({
          data: {
            userId: trade.recipientId,
            cigarReferenceId: activeVer.offeredLotId,
            quantity: activeVer.offeredQuantity,
            packaging: offeredLot?.packaging || "Unité individuelle",
            boxCode: offeredLot?.boxCode || null,
            boxCodeVerified: offeredLot?.boxCodeVerified || false,
            conditionHr: "69% HR",
            conditionTemp: "19°C",
            provenanceDeclared: `Acquis par échange de gré à gré (Dossier ${trade.id.slice(0, 8)})`,
            isTradeable: false, // Arrive en coffre privé par défaut
            isPublic: true,
          },
        });
      }

      // 3. Statut final COMPLETED
      const completedTrade = await tx.tradeProposal.update({
        where: { id: tradeProposalId },
        data: { status: "COMPLETED" },
      });

      await tx.tradeMessage.create({
        data: {
          tradeProposalId,
          senderId: userId,
          content: "Remise des vitoles effectuée et confirmée. Les inventaires de cave ont été synchronisés avec succès.",
          isSystemEvent: true,
        },
      });

      try {
        revalidatePath("/trade");
        revalidatePath("/humidor");
        revalidatePath("/");
      } catch {}

      return { success: true, status: completedTrade.status };
    });
  } catch (error: any) {
    console.error("Erreur lors de la clôture de l'échange :", error);
    return { success: false, error: error.message || "Erreur de clôture." };
  }
}

// REFUS / ANNULATION DE L'ÉCHANGE
export async function declineTradeProposal(
  tradeProposalId: string,
  userId: string,
  reason?: string
): Promise<{ success: true; status: string } | { success: false; error: string }> {
  try {
    return await prisma.$transaction(async (tx) => {
      const trade = await tx.tradeProposal.findUnique({
        where: { id: tradeProposalId },
        include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
      });

      if (!trade) throw new Error("Dossier introuvable.");

      // Si l'échange était en accord mutuel, libération immédiate du stock réservé
      if (trade.status === "MUTUALLY_AGREED") {
        const activeVer = trade.versions[0];
        const offeredLot = await tx.humidorLot.findFirst({
          where: {
            userId: trade.proposerId,
            cigarReferenceId: activeVer.offeredLotId,
          },
        });

        if (offeredLot && offeredLot.reservedQuantity >= activeVer.offeredQuantity) {
          await tx.humidorLot.update({
            where: { id: offeredLot.id },
            data: { reservedQuantity: { decrement: activeVer.offeredQuantity } },
          });
        }
      }

      const updated = await tx.tradeProposal.update({
        where: { id: tradeProposalId },
        data: { status: "DECLINED" },
      });

      await tx.tradeMessage.create({
        data: {
          tradeProposalId,
          senderId: userId,
          content: `Négociation déclinée : ${reason || "Les conditions n'ont pu être réunies."}`,
          isSystemEvent: true,
        },
      });

      try {
        revalidatePath("/trade");
        revalidatePath("/humidor");
      } catch {}

      return { success: true, status: updated.status };
    });
  } catch (error: any) {
    console.error("Erreur lors de l'annulation :", error);
    return { success: false, error: error.message || "Erreur lors de l'annulation." };
  }
}

// ENVOI D'UN MESSAGE DANS LE SALON PRIVÉ
export async function sendTradeMessage(
  tradeProposalId: string,
  senderId: string,
  content: string
) {
  try {
    if (!content.trim()) return { success: false, error: "Message vide." };

    const msg = await prisma.tradeMessage.create({
      data: {
        tradeProposalId,
        senderId,
        content: content.trim(),
        isSystemEvent: false,
      },
      include: { sender: true },
    });

    try {
      revalidatePath("/trade");
    } catch {}

    return { success: true, message: msg };
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    return { success: false, error: "Impossible d'envoyer le message." };
  }
}
