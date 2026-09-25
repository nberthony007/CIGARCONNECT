"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userEmail: string = "jean.marc@cigarconnect.fr") {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        privacySettings: true,
        _count: {
          select: { humidorLots: true, sentTrades: true, receivedTrades: true },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    return null;
  }
}

export async function updatePrivacySettings(
  userId: string,
  data: {
    showLocation: boolean;
    showValuation: boolean;
    allowDirectMessages: boolean;
  }
) {
  try {
    const updated = await prisma.privacySettings.upsert({
      where: { userId },
      update: {
        showLocation: data.showLocation,
        showValuation: data.showValuation,
        allowDirectMessages: data.allowDirectMessages,
      },
      create: {
        userId,
        showLocation: data.showLocation,
        showValuation: data.showValuation,
        allowDirectMessages: data.allowDirectMessages,
      },
    });

    try {
      revalidatePath("/humidor");
      revalidatePath("/");
    } catch {}
    return { success: true, settings: updated };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la confidentialité :", error);
    return { success: false, error: "Impossible de mettre à jour les paramètres de confidentialité." };
  }
}
