"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Eye, ArrowRight, ShieldCheck, Droplets } from "lucide-react";
import { CigarDetailModal } from "@/components/catalog/CigarDetailModal";

export interface CigarOwner {
  name: string;
  city: string;
  country?: string;
  initials: string;
  boxCode?: string;
  conditionHr?: string;
  isTradeable?: boolean;
}

export interface CigarData {
  id: string;
  brand: string;
  name: string;
  origin: string;
  countryCode: string;
  vitola: string;
  ringGauge: number;
  lengthMm: number;
  vintageYear: string | null;
  rarityGrade: string;
  rarityLabel: string;
  defaultImageUrl: string;
  factoryNotes: string | null;
  strength: string;
  owner?: CigarOwner;
}

interface CigarCardProps {
  cigar: CigarData;
}

export const CigarCard: React.FC<CigarCardProps> = ({ cigar }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <>
      <article className="cigar-card-surface rounded-2xl overflow-hidden flex flex-col justify-between h-full group bg-[#FFFFFF] border border-[#D9D2C7] transition-all duration-150">
        <div>
          {/* Photo au ratio 4:5 dans une surface claire (Section 11) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EEEAE3]">
            <img
              src={cigar.defaultImageUrl}
              alt={`${cigar.brand} ${cigar.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />

            {/* Bouton Favori distinct (non imbriqué dans un lien, Section 11) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                isFavorite
                  ? "bg-[#211D19] text-[#F7F5F0]"
                  : "bg-[#FFFFFF]/85 text-[#645C54] hover:text-[#211D19] hover:bg-[#FFFFFF]"
              }`}
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              title="Ajouter aux favoris"
            >
              <Bookmark className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} strokeWidth={1.8} />
            </button>

            {/* Badge d'origine sobre */}
            <div className="absolute top-3 left-3 bg-[#211D19]/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase tracking-wider text-[#F7F5F0] font-medium border border-[#D9D2C7]/30">
              {cigar.origin}
            </div>
          </div>

          {/* Sous l'image : Marque, nom, année qualifiée et disponibilité (Section 11) */}
          <div className="p-5 space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6C4935] font-semibold">
                {cigar.brand} {cigar.vintageYear && `· ${cigar.vintageYear}`}
              </div>
              <h3 className="font-serif text-lg font-normal text-[#211D19] leading-snug mt-0.5 line-clamp-1">
                {cigar.name}
              </h3>
              <p className="text-xs text-[#645C54] mt-1">
                {cigar.vitola} · Cepo {cigar.ringGauge} · {cigar.lengthMm} mm
              </p>
            </div>

            {/* Disponibilité & hygrométrie */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#D9D2C7]/60">
              <span className="text-[#365343] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365343]" />
                {cigar.owner?.isTradeable ? "Ouvert à l'échange" : "Collection privée"}
              </span>
              <span className="text-[#857A6D] text-[11px]">
                {cigar.owner?.conditionHr || "69% HR"}
              </span>
            </div>
          </div>
        </div>

        {/* Boutons d'Action Distincts (Lien vers fiche et Aperçu modal) */}
        <div className="px-5 pb-5 pt-1 grid grid-cols-2 gap-2 border-t border-[#D9D2C7]/40">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary-luxury text-xs py-2 px-2.5 justify-center"
            title="Aperçu rapide"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu</span>
          </button>

          <Link
            href={`/pieces/${cigar.id}`}
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
            className="btn-ink-primary text-xs py-2 px-2.5 justify-center"
            title="Consulter le dossier d'expertise complet"
          >
            <span>Détails</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </article>

      {/* Modale d'expertise rapide synchronisée */}
      <CigarDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cigar={cigar}
      />
    </>
  );
};
