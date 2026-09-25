"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Récupération d'une campagne active pour un emplacement donné (Sections 9, 10, 13)
export async function getSponsoredCampaign(placement: string, country: string = "FR") {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        placement,
        status: "active",
        isEmergencyStopped: false,
        OR: [
          { territories: "ALL" },
          { territories: { contains: country } }
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    if (!campaign) return null;

    // Enregistrement d'une diffusion servie (Section 15 - métrique agrégée uniquement)
    try {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { impressions: { increment: 1 } },
      });
    } catch {}

    return campaign;
  } catch (error) {
    console.error("Erreur lors de la récupération de la campagne sponsorisée :", error);
    return null;
  }
}

// Récupération de l'ensemble des campagnes actives pour un emplacement (Multi-partenaires)
export async function getSponsoredCampaigns(placement: string, country: string = "FR") {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        placement,
        status: "active",
        isEmergencyStopped: false,
        OR: [
          { territories: "ALL" },
          { territories: { contains: country } }
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    if (!campaigns || campaigns.length === 0) return [];

    // Enregistrement agrégé d'impressions
    try {
      await prisma.campaign.updateMany({
        where: { id: { in: campaigns.map((c) => c.id) } },
        data: { impressions: { increment: 1 } },
      });
    } catch {}

    return campaigns;
  } catch (error) {
    console.error("Erreur lors de la récupération des campagnes sponsorisées :", error);
    return [];
  }
}

// Récupération d'une campagne par nom ou mot-clé de sponsor
export async function getCampaignBySponsor(nameKeyword: string) {
  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        sponsorName: { contains: nameKeyword },
        status: "active",
        isEmergencyStopped: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!campaign) return null;

    try {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: { impressions: { increment: 1 } },
      });
    } catch {}

    return campaign;
  } catch (error) {
    console.error("Erreur getCampaignBySponsor :", error);
    return null;
  }
}

// Clic publicitaire sécurisé avec destination enregistrée (Section 18)
export async function registerAdClick(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) return { success: false, error: "Campagne introuvable" };

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { clicks: { increment: 1 } },
    });

    return { success: true, destinationUrl: campaign.destinationUrl };
  } catch (error) {
    console.error("Erreur enregistrement clic sponsorisé :", error);
    return { success: false, error: "Erreur technique" };
  }
}

// Soumission d'une demande de partenariat / sponsoring (Section 12.1)
export async function submitSponsorshipInquiry(data: {
  organization: string;
  contactName: string;
  contactEmail: string;
  websiteUrl: string;
  activityDomain: string;
  targetTerritories: string;
  desiredPlacement: string;
  desiredPeriod?: string;
  message?: string;
}) {
  try {
    const request = await prisma.sponsorshipRequest.create({
      data: {
        organization: data.organization.trim(),
        contactName: data.contactName.trim(),
        contactEmail: data.contactEmail.trim().toLowerCase(),
        websiteUrl: data.websiteUrl.trim(),
        activityDomain: data.activityDomain.trim(),
        targetTerritories: data.targetTerritories.trim(),
        desiredPlacement: data.desiredPlacement,
        desiredPeriod: data.desiredPeriod?.trim() || "Forfait Pilote 30 jours",
        message: data.message?.trim() || null,
        commercialStatus: "lead",
        paymentStatus: "not_due",
      },
    });

    return {
      success: true,
      requestId: request.id,
      message: "Votre demande de partenariat a été enregistrée avec succès. Notre équipe éditoriale et commerciale reviendra vers vous sous 48 heures pour convenir des dates et créations.",
    };
  } catch (error) {
    console.error("Erreur création demande sponsor :", error);
    return {
      success: false,
      error: "Impossible d'enregistrer votre demande pour le moment. Veuillez réessayer ou contacter notre support.",
    };
  }
}
