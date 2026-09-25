"use client";

import React from "react";
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react";

interface VisitorPreviewBannerProps {
  isVisitorMode: boolean;
  onToggle: () => void;
}

export const VisitorPreviewBanner: React.FC<VisitorPreviewBannerProps> = ({
  isVisitorMode,
  onToggle,
}) => {
  if (!isVisitorMode) return null;

  return (
    <div className="bg-cigar-cedar-dark text-[#FAF7F2] border-b border-cigar-brass/40 py-2.5 px-4 sticky top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-cigar-brass/30 flex items-center justify-center text-cigar-brass-light shrink-0">
            <EyeOff className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-cigar-brass-light uppercase tracking-wider text-[11px] block sm:inline mr-2">
              Mode Aperçu Visiteur Actif :
            </span>
            <span className="text-cigar-ivory/80 font-light">
              Seules vos vitoles publiques sont affichées. Valorisations financières et pièces de coffre-fort privé strictement masquées.
            </span>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="shrink-0 px-3 py-1.5 rounded-md bg-cigar-brass text-cigar-ink text-xs font-bold uppercase tracking-wider hover:bg-cigar-brass-light transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Revenir en Mode Propriétaire</span>
        </button>
      </div>
    </div>
  );
};
