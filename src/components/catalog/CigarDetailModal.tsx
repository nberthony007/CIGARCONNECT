"use client";

import React, { useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  Droplets, 
  Thermometer, 
  ArrowLeftRight, 
  Sparkles, 
  Clock, 
  Award,
  Box,
  CheckCircle2,
  Info
} from "lucide-react";
import Link from "next/link";

export interface CigarDetailData {
  id: string;
  brand: string;
  name: string;
  origin: string;
  countryCode?: string;
  vitola: string;
  ringGauge: number;
  lengthMm: number;
  vintageYear?: string | null;
  rarityGrade?: string;
  rarityLabel?: string;
  defaultImageUrl: string;
  factoryNotes?: string | null;
  strength?: string;
  // Données de cave ou de lot facultatives
  boxCode?: string | null;
  boxCodeVerified?: boolean;
  packaging?: string;
  conditionHr?: string;
  conditionTemp?: string;
  provenanceDeclared?: string | null;
  ownerName?: string;
  ownerCity?: string;
}

interface CigarDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cigar: CigarDetailData | null;
  // Optionnel : action pour intégrer dans un échange en cours
  onChangeInTrade?: (cigar: CigarDetailData) => void;
  changeActionLabel?: string;
}

export const CigarDetailModal: React.FC<CigarDetailModalProps> = ({
  isOpen,
  onClose,
  cigar,
  onChangeInTrade,
  changeActionLabel,
}) => {
  // Fermeture par touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !cigar) return null;

  // Calcul du diamètre approximatif en mm depuis le cepo (1 cepo = 1/64 de pouce = ~0.3968 mm)
  const diameterMm = (cigar.ringGauge * 0.3968).toFixed(1);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cigar-title"
    >
      {/* Fond sombre transparent avec flou artistique */}
      <div 
        className="fixed inset-0 bg-[#161210]/80 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />

      {/* Conteneur principal de la modale */}
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#D9D0C2] rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* En-tête Prestige */}
        <div className="bg-[#241E1A] text-[#FAF7F2] p-5 sm:p-6 flex items-center justify-between border-b border-[#AA8959]/40 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#71513B] text-[#AA8959] flex items-center justify-center border border-[#AA8959]/50 shadow-inner shrink-0">
              <Sparkles className="w-5 h-5 text-[#FAF7F2]" />
            </div>
            <div className="truncate">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#AA8959] font-bold block">
                Fiche d'Expertise & Traçabilité
              </span>
              <h2 id="modal-cigar-title" className="font-serif text-lg sm:text-xl font-bold truncate">
                {cigar.brand} {cigar.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-[#D9D0C2]/30 flex items-center justify-center text-[#FAF7F2]/80 hover:text-white hover:bg-[#71513B] transition-colors shrink-0"
            aria-label="Fermer la fiche d'expertise"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps défilable */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6 flex-1">
          {/* Photo Studio & Badges principaux */}
          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-[#241E1A] border border-[#D9D0C2]/80 shadow-inner group">
            <img
              src={cigar.defaultImageUrl}
              alt={`${cigar.brand} ${cigar.name}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241E1A]/90 via-transparent to-black/30" />

            {/* Badges d'origine et de rareté */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#241E1A]/90 backdrop-blur-md text-[#FAF7F2] text-xs font-bold tracking-widest uppercase border border-[#D9D0C2]/40">
                {cigar.origin}
              </span>
              {cigar.vintageYear && (
                <span className="px-3 py-1 rounded-full bg-[#AA8959] text-[#241E1A] text-xs font-bold tracking-wider uppercase shadow-xs">
                  Millésime {cigar.vintageYear}
                </span>
              )}
            </div>

            {/* Force et conservation en haut à droite */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35483F]/90 backdrop-blur-md text-[#FAF7F2] text-xs font-semibold border border-[#35483F]">
              <Droplets className="w-3.5 h-3.5 text-[#AA8959]" />
              <span>{cigar.conditionHr || "69% HR Norme Stable"}</span>
            </div>

            {/* Titre en surimpression basse */}
            <div className="absolute bottom-4 left-5 right-5 text-[#FAF7F2]">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#AA8959]">
                {cigar.rarityLabel || "Vitole de Collection"}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
                {cigar.brand} {cigar.name}
              </h3>
            </div>
          </div>

          {/* Grille des Caractéristiques Techniques */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#71513B] mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#AA8959]" />
              <span>Spécifications & Mensurations de Galera</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#D9D0C2] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">
                  Vitola de Galera
                </span>
                <span className="font-serif font-bold text-sm text-[#241E1A] block mt-0.5">
                  {cigar.vitola}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D9D0C2] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">
                  Calibre / Cepo
                </span>
                <span className="font-serif font-bold text-sm text-[#241E1A] block mt-0.5">
                  Cepo {cigar.ringGauge} <span className="text-[11px] font-normal text-[#8D8078]">({diameterMm} mm)</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D9D0C2] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">
                  Longueur
                </span>
                <span className="font-serif font-bold text-sm text-[#241E1A] block mt-0.5">
                  {cigar.lengthMm} mm
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D9D0C2] text-center">
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">
                  Puissance
                </span>
                <span className="font-serif font-bold text-sm text-[#71513B] block mt-0.5">
                  {cigar.strength || "Moyenne à Forte"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Organoleptiques & Terroir */}
          {cigar.factoryNotes && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D9D0C2] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#71513B] uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#AA8959]" />
                <span>Notes de Dégustation & Terroir</span>
              </div>
              <p className="text-xs sm:text-sm text-[#241E1A]/85 leading-relaxed font-light">
                {cigar.factoryNotes}
              </p>
            </div>
          )}

          {/* Traçabilité, Boîte & Conservation en Cave */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F0E7] border border-[#D9D0C2] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#D9D0C2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#241E1A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#35483F]" />
                <span>Traçabilité & Conservation Certifiée</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#35483F] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{cigar.boxCodeVerified ? "Certificat Habanos Valide" : "Régulation Vérifiée"}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">Code Boîte</span>
                <span className="font-mono font-bold text-[#241E1A] text-sm">
                  {cigar.boxCode || "Boîte d'origine scellée"}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">Conditionnement</span>
                <span className="font-serif font-semibold text-[#241E1A]">
                  {cigar.packaging || "Cabinet en Cèdre d'Espagne"}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8D8078] block">Atmosphère Cave</span>
                <span className="font-semibold text-[#35483F] flex items-center gap-1 mt-0.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#71513B]" />
                  <span>{cigar.conditionTemp || "19.0°C"} · {cigar.conditionHr || "69% HR"}</span>
                </span>
              </div>
            </div>

            {cigar.provenanceDeclared && (
              <div className="pt-2 border-t border-[#D9D0C2]/60 text-[11px] text-[#8D8078]">
                <strong>Provenance déclarée :</strong> {cigar.provenanceDeclared}
              </div>
            )}
          </div>
        </div>

        {/* Pied de Modale & Actions */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#D9D0C2] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D9D0C2] text-xs font-semibold text-[#241E1A] hover:bg-[#F4F0E7] transition-colors"
          >
            Fermer la fiche
          </button>

          <div className="flex items-center gap-2">
            {onChangeInTrade && (
              <button
                onClick={() => {
                  onChangeInTrade(cigar);
                  onClose();
                }}
                className="btn-primary-gold text-xs py-2.5 px-4 font-semibold flex items-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#AA8959]" />
                <span>{changeActionLabel || "Sélectionner dans cet échange"}</span>
              </button>
            )}

            {!onChangeInTrade && (
              <Link
                href={`/trade?target=${cigar.id}`}
                onClick={onClose}
                className="btn-primary-gold text-xs py-2.5 px-4 font-semibold flex items-center gap-2"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#AA8959]" />
                <span>Proposer un échange pour cette pièce</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
