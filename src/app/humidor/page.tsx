import React from "react";
import { getUserHumidor, getUniversalCigars } from "@/lib/actions/humidor";
import { HumidorDashboard } from "@/components/humidor/HumidorDashboard";
import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon Humidor — Haute Conservation & Gestion de Cave | CigarConnect",
  description:
    "Gestionnaire de cave numérique de haute précision sous régulation stricte 68–70% HR. Inventaire des vitoles de collection, traçabilité des boîtes et pièces disponibles à l'échange.",
};

export default async function HumidorPage() {
  const { user, lots, stats } = await getUserHumidor("alexandre.montmirail@cigarconnect.fr");
  const universalCigars = await getUniversalCigars();

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Fil d'Ariane & Retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cigar-cedar hover:text-cigar-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <div className="text-xs text-cigar-ink-muted">
            Connecté en tant que <strong className="text-cigar-ink">{user.firstName} {user.lastName}</strong> ({user.role})
          </div>
        </div>

        {/* Dashboard Complet de l'Humidor */}
        <HumidorDashboard
          initialLots={lots}
          initialStats={stats}
          userId={user.id}
          userName={`${user.firstName} ${user.lastName}`}
          userCity={`${user.city}, ${user.country}`}
          universalCigars={universalCigars}
        />
      </div>
    </div>
  );
}
