import React from "react";
import type { Metadata } from "next";
import { getSalonMessages, getSalonPreference } from "@/lib/actions/salon";
import { SalonView } from "@/components/salon/SalonView";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Le Salon — Conversation Collective entre Membres | CigarConnect",
  description:
    "Espace collectif unique réservé aux membres de CigarConnect pour échanger sur la conservation, les terroirs et les grandes vitoles de collection.",
};

export const dynamic = "force-dynamic";

export default async function SalonPage() {
  // Récupérer le membre aficionado initial
  let user = await prisma.user.findUnique({
    where: { email: "alexandre.montmirail@cigarconnect.fr" },
  });
  if (!user) {
    user = await prisma.user.findFirst();
  }

  const { messages } = await getSalonMessages(user?.id);
  const { preference } = user ? await getSalonPreference(user.id) : { preference: null };

  return (
    <SalonView
      initialMessages={messages}
      initialNotificationsEnabled={preference?.replyNotificationsEnabled ?? true}
      acceptedCharterVersion={preference?.acceptedCharterVersion}
    />
  );
}
