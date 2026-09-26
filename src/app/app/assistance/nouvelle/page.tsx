import React from "react";
import Link from "next/link";
import { ChevronLeft, LifeBuoy } from "lucide-react";
import { CreateCaseForm } from "@/components/support/CreateCaseForm";

export const dynamic = "force-dynamic";

interface NewCasePageProps {
  searchParams: Promise<{ cat?: string; tradeId?: string; art?: string }>;
}

export default async function NewCasePage({ searchParams }: NewCasePageProps) {
  const resolvedParams = await searchParams;
  const initialCategory = resolvedParams.cat || "GENERAL";
  const initialTradeId = resolvedParams.tradeId || "";
  const initialArticleSlug = resolvedParams.art || "";

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#241E1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Fil d'ariane & Bouton retour */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/app/assistance"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71513B] hover:text-[#241E1A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour à mes demandes</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#AA8959]">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Médiation & Assistance Écrite</span>
          </div>
        </div>

        {/* Titre de la page */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#241E1A]">
            Déposer une Demande d'Assistance
          </h1>
          <p className="text-xs sm:text-sm text-[#71513B] mt-2 leading-relaxed">
            Formulez votre question ou détaillez une situation relative à un échange du Cercle. Votre demande sera instruite par un agent ou un médiateur assermenté.
          </p>
        </div>

        {/* Formulaire interactif */}
        <CreateCaseForm
          initialCategory={initialCategory}
          initialTradeId={initialTradeId}
          initialArticleSlug={initialArticleSlug}
        />
      </div>
    </div>
  );
}
