import React from "react";
import { notFound } from "next/navigation";
import { getSupportCaseDetails } from "@/lib/actions/support";
import { CaseDetailView } from "@/components/support/CaseDetailView";

export const dynamic = "force-dynamic";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  
  // Utilise l'utilisateur pilote en phase de test ou authentifié
  const caseData = await getSupportCaseDetails(id, "usr_alexandre_01", false);

  if (!caseData) {
    notFound();
  }

  return <CaseDetailView caseData={caseData} currentUserId="usr_alexandre_01" />;
}
