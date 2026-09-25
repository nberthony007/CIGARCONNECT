"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, ShieldCheck, ArrowUpRight } from "lucide-react";
import { registerAdClick } from "@/lib/actions/sponsors";
import { CampaignData } from "@/components/ui/SponsoredPlacement";

interface IndependentSponsorBannerProps {
  brand: "kashimbo" | "fermin" | "eliebleu";
  campaign?: CampaignData | null;
  className?: string;
}

export const IndependentSponsorBanner: React.FC<IndependentSponsorBannerProps> = ({
  brand,
  campaign,
  className = "",
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = async (campId?: string) => {
    if (campId && !clicked) {
      setClicked(true);
      await registerAdClick(campId);
    }
  };

  // =========================================================================
  // SPONSOR 1 : KASHIMBO CIGARS (VERT, BLANC, NOIR)
  // Identité : Vert forêt profond, blanc éclatant, noir absolu
  // =========================================================================
  if (brand === "kashimbo") {
    const data = {
      id: campaign?.id || "kashimbo-cigars",
      name: campaign?.sponsorName || "Kashimbo Cigars",
      title: campaign?.title || "Manufacture Artisanale & Cigares d'Exception Roulés Main",
      description:
        campaign?.description ||
        "Cigares d'auteur roulés en tripa larga par des maîtres torcedores chevronnés. Sélection rigoureuse de feuilles nobles, équilibre aromatique parfait et tirage irréprochable.",
      imageUrl: campaign?.imageUrl || "/assets/kashimbo-cigars-banner.jpg",
      destinationUrl: campaign?.destinationUrl || "https://www.kashimbocigars.com",
      altText: campaign?.altText || "Manufacture artisanale de cigares faits main Kashimbo Cigars",
    };

    return (
      <aside
        aria-label="Espace Partenaire Indépendant Kashimbo Cigars"
        className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${className}`}
        style={{
          backgroundColor: "#051A0E",
          backgroundImage: "linear-gradient(135deg, #04190D 0%, #0A2E1A 60%, #031209 100%)",
          border: "1px solid #165633",
        }}
      >
        {/* Bandeau d'en-tête Kashimbo : Vert noble & Blanc */}
        <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#165633]/60 bg-[#03130A]/90">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-[0.22em] uppercase px-2.5 py-1 rounded-md bg-[#FFFFFF] text-[#041D10] shadow-sm">
              Sponsorisé
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#A7F3D0] uppercase">
              Partenaire Indépendant · Manufacture Artisanale
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#A7F3D0]/80">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-mono">www.kashimbocigars.com</span>
          </div>
        </div>

        {/* Corps du bandeau Kashimbo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Visuel Studio Torcedor */}
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[240px] lg:min-h-[290px] overflow-hidden bg-[#000000]">
            <img
              src={data.imageUrl}
              alt={data.altText}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051A0E] via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-3 bg-[#04190D]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#165633] text-[10px] uppercase tracking-wider font-bold text-[#FFFFFF]">
              Maître Torcedor · Tripa Larga
            </div>
          </div>

          {/* Typographie & Call-to-action (Vert, Blanc, Noir) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 text-[#FFFFFF]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-[0.25em] uppercase text-[#34D399]">
                  {data.name}
                </span>
                <span className="text-[#165633]">·</span>
                <span className="text-[11px] text-[#D1FAE5]/70">Atelier de Création</span>
              </div>

              <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight leading-snug">
                {data.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#D1E7DD] leading-relaxed max-w-2xl font-normal">
                {data.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#165633]/60 flex flex-wrap items-center justify-between gap-4">
              <a
                href={data.destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(data.id)}
                className="px-6 py-3.5 rounded-xl font-black text-xs tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#041D10",
                }}
              >
                <span>Découvrir Kashimbo Cigars</span>
                <ArrowUpRight className="w-4 h-4 text-[#041D10]" />
              </a>

              <div className="text-[11px] text-[#A7F3D0]/80 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                <span>Site officiel partenaire vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // =========================================================================
  // SPONSOR 2 : FERMIN PEREZ CIGARS (NOIR ET OR)
  // Identité : Noir d'onyx profond, Or étincelant, opulence de Little Havana & Estelí
  // =========================================================================
  if (brand === "fermin") {
    const data = {
      id: campaign?.id || "fermin-perez-cigars",
      name: campaign?.sponsorName || "Fermin Perez Cigars",
      title: campaign?.title || "Terroirs d'Estelí — De la Graine à la Vitole de Maître",
      description:
        campaign?.description ||
        "Maison boutique d'Estelí (Nicaragua) et Little Havana. Maîtrise intégrale de la culture à l'affinage, capes San Andrés Maduro d'une richesse aromatique intense et subtile.",
      imageUrl: campaign?.imageUrl || "/assets/fermin-perez-banner.jpg",
      destinationUrl: campaign?.destinationUrl || "https://ferminperez.com",
      altText: campaign?.altText || "Cigares de terroir nicaraguayen faits main Fermin Perez Cigars",
    };

    return (
      <aside
        aria-label="Espace Partenaire Indépendant Fermin Perez Cigars"
        className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${className}`}
        style={{
          backgroundColor: "#0A0A0A",
          backgroundImage: "linear-gradient(135deg, #060606 0%, #15130E 60%, #0A0A0A 100%)",
          border: "1px solid #A8862A",
        }}
      >
        {/* Bandeau d'en-tête Fermin Perez : Noir d'onyx & Or */}
        <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#A8862A]/40 bg-[#080808]/95">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-black tracking-[0.22em] uppercase px-2.5 py-1 rounded-md text-[#0A0A0A] shadow-sm"
              style={{
                background: "linear-gradient(135deg, #F5D061 0%, #D4AF37 50%, #B8860B 100%)",
              }}
            >
              Sponsorisé
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#F5D061] uppercase">
              Partenaire Indépendant · Little Havana & Estelí
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#D4AF37]/90 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
            <span>ferminperez.com</span>
          </div>
        </div>

        {/* Corps du bandeau Fermin Perez */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Visuel Studio San Andrés Maduro */}
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[240px] lg:min-h-[290px] overflow-hidden bg-[#000000]">
            <img
              src={data.imageUrl}
              alt={data.altText}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-3 bg-[#000000]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#A8862A] text-[10px] uppercase tracking-wider font-bold text-[#F5D061]">
              Serie de Oro · 90 Pts Rating
            </div>
          </div>

          {/* Typographie & Call-to-action (Noir et Or) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 text-[#FFFFFF]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-[0.25em] uppercase text-[#F5D061]">
                  {data.name}
                </span>
                <span className="text-[#A8862A]">·</span>
                <span className="text-[11px] text-[#E5C158]/70">Boutique Blend d'Élite</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                <span
                  style={{
                    background: "linear-gradient(90deg, #FFFFFF 0%, #F5D061 50%, #D4AF37 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {data.title}
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-[#D5CCA8] leading-relaxed max-w-2xl font-normal">
                {data.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#A8862A]/40 flex flex-wrap items-center justify-between gap-4">
              <a
                href={data.destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(data.id)}
                className="px-6 py-3.5 rounded-xl font-extrabold text-xs tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #F5D061 0%, #D4AF37 50%, #996515 100%)",
                  color: "#000000",
                }}
              >
                <span>Accéder à Fermin Perez Cigars</span>
                <ArrowUpRight className="w-4 h-4 text-[#000000]" />
              </a>

              <div className="text-[11px] text-[#D4AF37]/80 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F5D061]" />
                <span>Maison officielle vérifiée</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // =========================================================================
  // SPONSOR 3 : MAISON ELIE BLEU PARIS (BLEU NUIT, BLANC PLATINE, LAITON DORÉ)
  // Identité : Bleu nuit royal de Paris, blanc platine, haute ébénisterie française
  // =========================================================================
  if (brand === "eliebleu") {
    const data = {
      id: campaign?.id || "elie-bleu-paris",
      name: campaign?.sponsorName || "Maison Elie Bleu Paris",
      title: campaign?.title || "Écrins d'Exception & Caves en Cèdre d'Espagne depuis 1976",
      description:
        campaign?.description ||
        "Manufacture d'art française mondialement reconnue pour ses humidors de prestige. Marqueterie d'essences précieuses, intérieurs en cèdre d'Espagne et conservation hygrométrique absolue.",
      imageUrl: campaign?.imageUrl || "/assets/elie-bleu-paris-banner.jpg",
      destinationUrl: campaign?.destinationUrl || "https://www.eliebleu.com",
      altText: campaign?.altText || "Humidors et caves à cigares de prestige en marqueterie d'art Elie Bleu Paris",
    };

    return (
      <aside
        aria-label="Espace Partenaire Indépendant Maison Elie Bleu Paris"
        className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${className}`}
        style={{
          backgroundColor: "#071626",
          backgroundImage: "linear-gradient(135deg, #051220 0%, #0E2847 60%, #061524 100%)",
          border: "1px solid #1E4675",
        }}
      >
        {/* Bandeau d'en-tête Elie Bleu : Bleu Nuit & Blanc Platine */}
        <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#1E4675]/60 bg-[#051424]/95">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-black tracking-[0.22em] uppercase px-2.5 py-1 rounded-md text-[#FFFFFF] shadow-sm"
              style={{
                backgroundColor: "#C5A059",
                color: "#071626",
              }}
            >
              Sponsorisé
            </span>
            <span className="text-xs font-semibold tracking-wider text-[#93C5FD] uppercase">
              Partenaire Indépendant · Haute Ébénisterie Parisienne
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#BFDBFE]/80 font-mono">
            <span>Paris, France</span>
            <span className="text-[#1E4675]">·</span>
            <span>www.eliebleu.com</span>
          </div>
        </div>

        {/* Corps du bandeau Elie Bleu */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Visuel Studio Marqueterie Humidor */}
          <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto min-h-[240px] lg:min-h-[290px] overflow-hidden bg-[#000000]">
            <img
              src={data.imageUrl}
              alt={data.altText}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071626] via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-3 bg-[#051424]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[#C5A059]/50 text-[10px] uppercase tracking-wider font-bold text-[#E2C17C]">
              Manufacture de Paris · Depuis 1976
            </div>
          </div>

          {/* Typographie & Call-to-action (Bleu Nuit, Blanc, Laiton) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 text-[#FFFFFF]">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-[0.25em] uppercase text-[#E2C17C]">
                  {data.name}
                </span>
                <span className="text-[#1E4675]">·</span>
                <span className="text-[11px] text-[#93C5FD]">Maison de Maître</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight leading-snug">
                {data.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#BACDDF] leading-relaxed max-w-2xl font-normal">
                {data.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1E4675]/60 flex flex-wrap items-center justify-between gap-4">
              <a
                href={data.destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleClick(data.id)}
                className="px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer"
                style={{
                  backgroundColor: "#0B223D",
                  border: "2px solid #C5A059",
                  color: "#FFFFFF",
                }}
              >
                <span>Consulter la Maison Elie Bleu</span>
                <ArrowUpRight className="w-4 h-4 text-[#E2C17C]" />
              </a>

              <div className="text-[11px] text-[#BFDBFE]/80 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Manufacture d'art certifiée</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
