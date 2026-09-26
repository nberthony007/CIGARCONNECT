import React from "react";
import { getTeamCases } from "@/lib/actions/support";
import { TeamInboxManager } from "@/components/support/TeamInboxManager";

export const dynamic = "force-dynamic";

interface AdminAssistancePageProps {
  searchParams: Promise<{ view?: string; cat?: string; q?: string }>;
}

export default async function AdminAssistancePage({ searchParams }: AdminAssistancePageProps) {
  const resolvedParams = await searchParams;
  const view = resolvedParams.view || "all";
  const category = resolvedParams.cat || "ALL";
  const search = resolvedParams.q || "";

  // Récupère l'ensemble des dossiers pour la console d'équipe
  const cases = await getTeamCases(view, category, "ALL", search);

  return <TeamInboxManager initialCases={cases} currentStaffRole="Médiateur du Cercle" />;
}
