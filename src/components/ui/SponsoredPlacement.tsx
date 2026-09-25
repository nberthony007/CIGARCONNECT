"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { registerAdClick } from "@/lib/actions/sponsors";

export interface CampaignData {
  id: string;
  sponsorName: string;
  placement: string;
  title: string;
  description: string;
  imageUrl: string;
  destinationUrl: string;
  altText: string;
}

interface SponsoredPlacementProps {
  campaign?: CampaignData | null;
  campaigns?: CampaignData[];
  format?: "banner_16_9" | "card_4_5";
  className?: string;
}

export const SponsoredPlacement: React.FC<SponsoredPlacementProps> = ({
  campaign,
  campaigns,
  format = "banner_16_9",
  className = "",
}) => {
  // Déterminer la liste des campagnes effectives
  const campaignList: CampaignData[] = React.useMemo(() => {
    if (campaigns && campaigns.length > 0) return campaigns;
    if (campaign) return [campaign];
    return [];
  }, [campaigns, campaign]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [clickedMap, setClickedMap] = useState<Record<string, boolean>>({});

  // Règle d'or Section 10 & 19 : « Ne pas réserver un grand espace vide ; réorganiser la page »
  if (campaignList.length === 0) {
    return null;
  }

  const currentCampaign = campaignList[activeIndex] || campaignList[0];

  const handleClick = async (campId: string) => {
    if (!clickedMap[campId]) {
      setClickedMap((prev) => ({ ...prev, [campId]: true }));
      await registerAdClick(campId);
    }
  };

  const nextCampaign = () => {
    setActiveIndex((prev) => (prev + 1) % campaignList.length);
  };

  const prevCampaign = () => {
    setActiveIndex((prev) => (prev - 1 + campaignList.length) % campaignList.length);
  };

  if (format === "card_4_5") {
    return (
      <div className={`cigar-card-surface rounded-2xl overflow-hidden border border-[#D9D2C7] flex flex-col justify-between group relative bg-[#FFFFFF] ${className}`}>
        {/* En-tête obligatoire avec label Sponsorisé (Section 9) */}
        <div className="p-3 bg-[#EEEAE3]/80 border-b border-[#D9D2C7] flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#6C4935] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D9D2C7]">
            Sponsorisé
          </span>
          <span className="text-[10px] text-[#857A6D] font-medium truncate max-w-[150px]">
            {currentCampaign.sponsorName}
          </span>
        </div>

        {/* Visuel 4:5 soigné */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#211D19]">
          <img
            src={currentCampaign.imageUrl}
            alt={currentCampaign.altText}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211D19]/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-[#F7F5F0]">
            <h4 className="font-serif font-bold text-sm line-clamp-2">
              {currentCampaign.title}
            </h4>
          </div>
        </div>

        {/* Description & Lien externe vérifié */}
        <div className="p-4 space-y-3 grow flex flex-col justify-between">
          <p className="text-xs text-[#645C54] line-clamp-3 leading-relaxed">
            {currentCampaign.description}
          </p>
          <a
            href={currentCampaign.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(currentCampaign.id)}
            className="inline-flex items-center justify-between w-full pt-2 border-t border-[#D9D2C7] text-xs font-semibold text-[#6C4935] hover:text-[#211D19] transition-colors"
          >
            <span>Visiter le site officiel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Format par défaut : Bandeau 16:9 élégant multi-partenaires (Section 10)
  return (
    <aside
      aria-label="Partenaires sélectionnés par la rédaction"
      className={`relative rounded-2xl overflow-hidden border border-[#D9D2C7] bg-[#FFFFFF] shadow-sm my-8 transition-all duration-300 ${className}`}
    >
      {/* Label obligatoire visible avant toute interaction (Section 9) + Sélecteur de partenaires */}
      <div className="px-4 py-2.5 bg-[#EEEAE3]/80 border-b border-[#D9D2C7] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#6C4935] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#D9D2C7]">
            Sponsorisé
          </span>
          <span className="text-[11px] text-[#645C54] font-medium hidden sm:inline">
            Partenaires sélectionnés par la rédaction
          </span>
          {campaignList.length > 1 && (
            <span className="text-[10px] text-[#857A6D] font-mono px-1.5 py-0.5 rounded bg-[#E4DDD3]">
              {activeIndex + 1}/{campaignList.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Navigation si plusieurs partenaires */}
          {campaignList.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevCampaign}
                aria-label="Partenaire précédent"
                className="w-6 h-6 rounded flex items-center justify-center border border-[#D9D2C7] bg-[#FAF7F2] text-[#6C4935] hover:bg-[#EEEAE3] transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextCampaign}
                aria-label="Partenaire suivant"
                className="w-6 h-6 rounded flex items-center justify-center border border-[#D9D2C7] bg-[#FAF7F2] text-[#6C4935] hover:bg-[#EEEAE3] transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <Link
            href="/sponsors"
            className="text-[11px] text-[#857A6D] hover:text-[#211D19] underline transition-colors"
          >
            À propos des partenariats
          </Link>
        </div>
      </div>

      {/* Barre d'onglets des 3 partenaires si multi-partenaires */}
      {campaignList.length > 1 && (
        <div className="px-4 py-2 bg-[#F4F0E7] border-b border-[#D9D2C7]/70 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase tracking-wider text-[#857A6D] font-semibold mr-1 shrink-0 hidden md:inline">
            Sélectionner :
          </span>
          {campaignList.map((c, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={c.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#211D19] text-[#F7F5F0] shadow-xs"
                    : "bg-[#FFFFFF] text-[#645C54] border border-[#D9D2C7] hover:border-[#6C4935] hover:text-[#211D19]"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#A88958]" : "bg-[#D9D2C7]"}`} />
                <span>{c.sponsorName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Contenu principal de la campagne sélectionnée */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
        {/* Visuel 16:9 studio */}
        <div className="md:col-span-5 relative aspect-[16/10] md:aspect-auto min-h-[220px] md:min-h-[260px] overflow-hidden bg-[#211D19]">
          <img
            key={currentCampaign.imageUrl}
            src={currentCampaign.imageUrl}
            alt={currentCampaign.altText}
            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211D19]/50 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-2 left-3 text-[10px] uppercase tracking-wider text-[#F7F5F0]/80 font-mono bg-[#211D19]/60 px-2 py-0.5 rounded backdrop-blur-xs">
            {currentCampaign.sponsorName}
          </div>
        </div>

        {/* Contenu textuel soigné & CTA vérifié */}
        <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#A88958]">
                {currentCampaign.sponsorName}
              </span>
              <span className="text-[#D9D2C7] text-xs">·</span>
              <span className="text-[10px] text-[#857A6D] font-mono">
                {currentCampaign.destinationUrl.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#211D19] leading-snug">
              {currentCampaign.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
              {currentCampaign.description}
            </p>
          </div>

          <div className="pt-3 border-t border-[#D9D2C7]/60 flex flex-wrap items-center justify-between gap-3">
            <a
              href={currentCampaign.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleClick(currentCampaign.id)}
              className="btn-ink-primary text-xs px-4 py-2.5 inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Accéder à {currentCampaign.sponsorName}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#A88958] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <div className="flex items-center gap-1.5 text-[11px] text-[#857A6D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#365343]" />
              <span>Partenaire vérifié par CigarConnect</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

