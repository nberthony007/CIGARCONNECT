"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Layers, SlidersHorizontal } from "lucide-react";
import { CigarCard, CigarData } from "./CigarCard";
import { MotionReveal } from "@/components/motion/MotionReveal";

interface CigarCatalogProps {
  initialCigars: CigarData[];
}

export const CigarCatalog: React.FC<CigarCatalogProps> = ({ initialCigars }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const origins = useMemo(() => {
    const list = Array.from(new Set(initialCigars.map((c) => c.origin)));
    return ["ALL", ...list];
  }, [initialCigars]);

  const filteredCigars = useMemo(() => {
    return initialCigars.filter((cigar) => {
      const matchesOrigin =
        selectedOrigin === "ALL" || cigar.origin.toLowerCase() === selectedOrigin.toLowerCase();
      const matchesSearch =
        cigar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cigar.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cigar.vitola.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesOrigin && matchesSearch;
    });
  }, [initialCigars, selectedOrigin, searchQuery]);

  return (
    <section id="catalogue" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* En-tête de section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-cigar-stone/80 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cigar-brass font-bold mb-2">
            <Layers className="w-4 h-4 text-cigar-brass" />
            <span>Catalogue Patrimonial</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-cigar-ink">
            Grandes Vitoles de Collection
          </h2>
          <p className="text-sm text-cigar-ink-muted mt-1 max-w-xl">
            Répertoire des modules d'exception documentés selon les critères des grandes maisons de vente.
          </p>
        </div>

        {/* Barre de Recherche */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cigar-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher marque, vitole..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-cigar-ivory-light border border-cigar-stone text-xs text-cigar-ink placeholder-cigar-ink-muted focus:outline-none focus:border-cigar-brass transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Filtres de Terroirs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs scrollbar-none">
        <span className="text-cigar-ink-muted flex items-center gap-1 font-semibold pr-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Terroir :
        </span>
        {origins.map((origin) => {
          const isSelected = selectedOrigin === origin;
          return (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider transition-all shrink-0 ${
                isSelected
                  ? "bg-cigar-cedar text-cigar-ivory-light shadow-sm"
                  : "bg-cigar-ivory-light text-cigar-ink-muted border border-cigar-stone hover:border-cigar-brass hover:text-cigar-ink"
              }`}
            >
              {origin === "ALL" ? "Tous les Terroirs" : origin}
            </button>
          );
        })}
      </div>

      {/* Grille des Vitoles avec animation étagée */}
      {filteredCigars.length > 0 ? (
        <MotionReveal
          key={selectedOrigin + searchQuery}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          stagger={0.06}
        >
          {filteredCigars.map((cigar) => (
            <CigarCard key={cigar.id} cigar={cigar} />
          ))}
        </MotionReveal>
      ) : (
        <div className="text-center py-16 bg-cigar-ivory-light rounded-2xl border border-cigar-stone/80 p-8">
          <p className="font-serif text-lg text-cigar-ink font-bold mb-1">
            Aucune vitole ne correspond à votre recherche
          </p>
          <p className="text-xs text-cigar-ink-muted">
            Modifiez vos filtres de terroir ou essayez un autre mot-clé.
          </p>
          <button
            onClick={() => {
              setSelectedOrigin("ALL");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold btn-cigar-secondary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </section>
  );
};
