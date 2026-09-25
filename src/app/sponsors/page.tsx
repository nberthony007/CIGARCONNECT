import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Eye, Sparkles, Building2, CheckCircle2 } from "lucide-react";
import { SponsorsForm } from "@/components/sponsors/SponsorsForm";

export const metadata: Metadata = {
  title: "Partenariats & Espaces Sponsorisés — CigarConnect",
  description:
    "Visibilité sélective et accompagnée pour manufactures, lounges et artisans d'art. Respect absolu de la vie privée des collectionneurs et zéro enchère programmatique.",
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Fil d'ariane & Retour */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4935] hover:text-[#211D19] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>

        {/* En-tête éditorial */}
        <div className="space-y-4 border-b border-[#D9D2C7] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEAE3] border border-[#D9D2C7] text-[11px] font-semibold text-[#6C4935] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#A88958]" />
            Visibilité Sélective & Discrète
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211D19] tracking-tight">
            Devenir Sponsor de CigarConnect
          </h1>
          <p className="text-sm sm:text-base text-[#645C54] leading-relaxed max-w-3xl">
            CigarConnect propose des espaces de visibilité exclusifs aux acteurs de référence de l’art de vivre : manufactures d’exception, artisans d’humidors, lounges agréés et événements de prestige.
          </p>
        </div>

        {/* Charte & Engagements Éthiques (Sections 9, 10, 15) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#EEEAE3] flex items-center justify-center text-[#6C4935]">
              <ShieldCheck className="w-5 h-5 text-[#365343]" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#211D19]">
              Confidentialité Absolue
            </h3>
            <p className="text-xs text-[#645C54] leading-relaxed">
              Aucun ciblage comportemental à partir des collections privées, des valeurs déclarées ou des messages. Zéro pixel tiers invasif.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#EEEAE3] flex items-center justify-center text-[#6C4935]">
              <Eye className="w-5 h-5 text-[#A88958]" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#211D19]">
              Transparence & Intégrité
            </h3>
            <p className="text-xs text-[#645C54] leading-relaxed">
              Label « Sponsorisé » visible avant toute interaction. Un paiement n'achète ni authenticité, ni classement naturel, ni avis favorable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2.5 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-[#EEEAE3] flex items-center justify-center text-[#6C4935]">
              <Building2 className="w-5 h-5 text-[#6C4935]" />
            </div>
            <h3 className="font-serif font-bold text-sm text-[#211D19]">
              Vente Accompagnée
            </h3>
            <p className="text-xs text-[#645C54] leading-relaxed">
              Forfaits à durée déterminée (30 jours pilote) validés manuellement par notre équipe éditoriale. Aucune enchère automatique.
            </p>
          </div>
        </div>

        {/* Grille des Emplacements Disponibles (Section 10) */}
        <div className="p-6 rounded-2xl bg-[#EEEAE3]/60 border border-[#D9D2C7] space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#211D19]">
            Emplacements Définis & Limites Visuelles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1.5">
              <div className="font-bold text-[#211D19]">Bandeau Accueil (16:9)</div>
              <p className="text-[#645C54] leading-relaxed">
                Positionné après une section éditoriale utile. Jamais à la place du premier écran. 1 seul emplacement disponible.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1.5">
              <div className="font-bold text-[#211D19]">Carte Catalogue (4:5)</div>
              <p className="text-[#645C54] leading-relaxed">
                Parfaitement intégrée à la grille. Maximum 1 carte pour au moins 12 résultats naturels. Jamais de faux résultats.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1.5">
              <div className="font-bold text-[#211D19]">Encadré Journal</div>
              <p className="text-[#645C54] leading-relaxed">
                Mise en valeur sous un article de fond ou contenu dédié revu par le comité éditorial.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1.5">
              <div className="font-bold text-[#211D19]">Lieu / Lounge dans Le Cercle</div>
              <p className="text-[#645C54] leading-relaxed">
                Présentation qualifiée d'un salon privé ou événement convenu pour les rendez-vous d'échange de gré à gré.
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#857A6D] italic">
            Sanctuaire de cave : Les espaces de messagerie privée, l'humidor personnel et les dossiers de négociation restent formellement exempts de toute publicité.
          </div>
        </div>

        {/* Formulaire de qualification de demande (Section 12.1) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#211D19]">
              Formulaire de Demande d'Accompagnement
            </h2>
            <p className="text-xs text-[#645C54] mt-1">
              Renseignez les éléments de votre organisation. Aucun paiement ni carte bancaire n'est requis à ce stade.
            </p>
          </div>

          <SponsorsForm />
        </div>

      </div>
    </div>
  );
}
