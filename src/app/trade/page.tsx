import React from "react";
import { getUserTrades } from "@/lib/actions/trade";
import { getUserHumidor } from "@/lib/actions/humidor";
import { TradeDashboard } from "@/components/trade/TradeDashboard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le Cercle — Salon d'Échange de Gré à Gré & Négociations Privées | CigarConnect",
  description:
    "Salon privé d'échange de vitoles rares de gré à gré entre collectionneurs. Zéro commission financière, réservation atomique des stocks et traçabilité de conservation 68–70% HR.",
};

export default async function TradePage(props: {
  searchParams?: Promise<{ target?: string; openTrade?: string; counter?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const { user, trades, universalCigars, cigarsMap } = await getUserTrades(
    "alexandre.montmirail@cigarconnect.fr"
  );
  const { lots } = await getUserHumidor("alexandre.montmirail@cigarconnect.fr");

  // Recherche des autres partenaires disponibles (ex: Alexandre D.)
  const partnerUsers = await prisma.user.findMany({
    where: { id: { not: user.id } },
    select: { id: true, firstName: true, lastName: true, city: true },
  });

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Fil d'Ariane, Lien vers Le Salon & Statut Membre */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D9D2C7]/60">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cigar-cedar hover:text-cigar-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l'accueil</span>
            </Link>

            <span className="text-[#D9D2C7] hidden sm:inline">|</span>

            {/* Lien direct prescrit par la Section 24.1 */}
            <Link
              href="/app/salon"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#EEEAE3] border border-[#A88958] text-[#6C4935] hover:bg-[#211D19] hover:text-[#F7F5F0] hover:border-[#211D19] transition-all"
              title="Accéder à la conversation collective des membres"
            >
              <span className="w-2 h-2 rounded-full bg-[#365343] inline-block" />
              <span>Le Salon</span>
              <span className="text-[10px] text-[#A88958] font-mono">→</span>
            </Link>
          </div>

          <div className="text-xs text-cigar-ink-muted">
            Membre actif : <strong className="text-cigar-ink">{user.firstName} {user.lastName}</strong> ({user.city})
          </div>
        </div>

        {/* Dashboard Complet d'Échange de Gré à Gré */}
        <TradeDashboard
          initialTrades={trades}
          currentUserId={user.id}
          userName={`${user.firstName} ${user.lastName}`}
          userLots={lots}
          universalCigars={universalCigars}
          cigarsMap={cigarsMap}
          partnerUsers={partnerUsers}
          initialTargetId={searchParams.target}
          initialOpenTrade={searchParams.openTrade === "1" || !!searchParams.counter}
          initialCounterMode={searchParams.counter === "1"}
        />
      </div>
    </div>
  );
}
