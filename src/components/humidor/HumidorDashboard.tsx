"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, 
  Droplets, 
  Thermometer, 
  LayoutGrid, 
  Table, 
  Plus, 
  Download, 
  Eye, 
  EyeOff, 
  Lock, 
  Search,
  SlidersHorizontal,
  ArrowRight
} from "lucide-react";
import { HumidorLotWithCigar, HumidorStats } from "@/lib/actions/humidor";
import { HumidorGalleryView } from "./HumidorGalleryView";
import { HumidorLedgerView } from "./HumidorLedgerView";
import { AddCigarModal } from "./AddCigarModal";
import { VisitorPreviewBanner } from "../profile/VisitorPreviewBanner";
import { useAuth } from "@/context/AuthContext";

interface HumidorDashboardProps {
  initialLots: HumidorLotWithCigar[];
  initialStats: HumidorStats;
  userId: string;
  userName: string;
  userCity: string;
  universalCigars: Array<{
    id: string;
    brand: string;
    name: string;
    origin: string;
    vitola: string;
    ringGauge: number;
    lengthMm: number;
    vintageYear: string | null;
    defaultImageUrl: string;
  }>;
}

export const HumidorDashboard: React.FC<HumidorDashboardProps> = ({
  initialLots,
  initialStats,
  userId,
  userName,
  userCity,
  universalCigars,
}) => {
  const { user: authUser, openAuthModal } = useAuth();
  const activeName = authUser ? `${authUser.firstName} ${authUser.lastName}` : userName;
  const activeCity = authUser ? `${authUser.city}, ${authUser.country}` : userCity;

  const [viewMode, setViewMode] = useState<"gallery" | "ledger">("gallery");
  const [isVisitorMode, setIsVisitorMode] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "tradeable" | "private">("all");

  // Mémorisation de la préférence d'affichage (Section 13)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cigarconnect_humidor_view");
      if (saved === "gallery" || saved === "ledger") {
        setViewMode(saved);
      }
    } catch (e) {
      // localStorage indisponible
    }
  }, []);

  const handleViewModeChange = (mode: "gallery" | "ledger") => {
    setViewMode(mode);
    try {
      localStorage.setItem("cigarconnect_humidor_view", mode);
    } catch (e) {}
  };

  // Filtrage local en direct
  const filteredLots = useMemo(() => {
    return initialLots.filter((lot) => {
      const cigar = lot.cigarReference;
      const brand = cigar?.brand || lot.customBrand || "";
      const name = cigar?.name || lot.customName || "";
      const matchesSearch =
        !searchQuery.trim() ||
        brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lot.boxCode && lot.boxCode.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesAvailability =
        availabilityFilter === "all"
          ? true
          : availabilityFilter === "tradeable"
          ? lot.isTradeable
          : !lot.isTradeable;

      return matchesSearch && matchesAvailability;
    });
  }, [initialLots, searchQuery, availabilityFilter]);

  // Export JSON conforme RGPD
  const handleExportJson = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      aficionado: {
        name: isVisitorMode ? "Membre Privé" : userName,
        city: isVisitorMode ? "Confidentiel" : userCity,
      },
      conservationParameters: {
        standardHr: "68–70% HR",
        measuredAvgHr: initialStats.avgHr,
        measuredAvgTemp: initialStats.avgTemp,
      },
      inventory: filteredLots.map((lot) => ({
        id: lot.id,
        brand: lot.cigarReference?.brand || lot.customBrand || "Marque personnelle",
        vitola: lot.cigarReference?.name || lot.customName || "Pièce de cave",
        origin: lot.cigarReference?.origin || lot.customOrigin || "Origine déclarée",
        format: lot.cigarReference
          ? `${lot.cigarReference.vitola} (Cepo ${lot.cigarReference.ringGauge} · ${lot.cigarReference.lengthMm}mm)`
          : lot.customVitola || "Module personnel",
        vintage: lot.cigarReference?.vintageYear || lot.acquisitionDate || null,
        quantity: lot.quantity,
        packaging: lot.packaging,
        boxCode: lot.boxCode,
        conditionHr: lot.conditionHr,
        isTradeable: lot.isTradeable,
        registeredAt: lot.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cigarconnect_humidor_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Aperçu visiteur si activé */}
      <VisitorPreviewBanner
        isVisitorMode={isVisitorMode}
        onToggle={() => setIsVisitorMode(false)}
      />

      {/* Bannière d'invitation si mode visiteur (non connecté) */}
      {!authUser && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#A88958]/10 border border-[#A88958]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#211D19] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A88958] inline-block" />
              <span>Humidor de démonstration aficionado</span>
            </div>
            <p className="text-xs text-[#645C54] leading-relaxed">
              Créez votre compte confidentiel pour enregistrer vos propres vitoles, contrôler l'hygrométrie et proposer des échanges de gré à gré.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className="btn-ink-primary text-xs py-2 px-4 shrink-0 shadow-sm"
          >
            Créer mon compte aficionado
          </button>
        </div>
      )}

      {/* =========================================================================
          EN-TÊTE OFFICIEL DE PRÉCISION (Section 13)
          « Mon humidor » · Mention « Privé par défaut » · Bouton « Ajouter une pièce »
         ========================================================================= */}
      <div className="bg-[#FFFFFF] border border-[#D9D2C7] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D9D2C7]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-sans text-2xl sm:text-3xl font-semibold text-[#211D19]">
                {isVisitorMode ? `Cave publique de ${activeName}` : "Mon humidor"}
              </h1>
              {/* Cadenas avec texte visible « Privé par défaut » (Section 13) */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEEAE3] text-[#645C54] border border-[#D9D2C7]">
                <Lock className="w-3 h-3 text-[#645C54]" />
                <span>Privé par défaut</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#645C54]">
              {activeCity} · Haute conservation régulée sous 68–70% HR en cabinet de cèdre.
            </p>
          </div>

          {/* Actions : Ajouter une pièce & Outils */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsVisitorMode(!isVisitorMode)}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                isVisitorMode
                  ? "bg-[#6C4935] text-[#F7F5F0] border-[#6C4935]"
                  : "bg-[#FFFFFF] text-[#211D19] border-[#D9D2C7] hover:bg-[#EEEAE3]"
              }`}
              title="Basculer entre vue propriétaire et vue publique restreinte"
            >
              {isVisitorMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isVisitorMode ? "Mode Propriétaire" : "Aperçu Visiteur"}</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-full text-xs font-medium bg-[#FFFFFF] text-[#211D19] border border-[#D9D2C7] hover:bg-[#EEEAE3] transition-colors flex items-center gap-1.5"
              title="Exporter l'inventaire au format JSON (Souveraineté des données)"
            >
              <Download className="w-3.5 h-3.5 text-[#6C4935]" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            {!isVisitorMode && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-ink-primary text-xs py-2 px-4"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                <span>Ajouter une pièce</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            LIGNE DE SYNTHÈSE UNIQUE (Section 13)
            Unités, lots, disponibilités et hygrométrie en chiffres tabulaires
           ========================================================================= */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-[#645C54] tabular-nums">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              Total : <strong className="text-[#211D19] font-semibold text-sm">{initialStats.totalQuantity}</strong> unités
            </span>
            <span>·</span>
            <span>
              <strong className="text-[#211D19] font-semibold text-sm">{initialLots.length}</strong> lots qualifiés
            </span>
            <span>·</span>
            <span className="text-[#365343] font-medium">
              <strong className="font-semibold text-sm">{initialStats.tradeableQuantity}</strong> disponibles à l'échange
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-[#365343] font-medium bg-[#365343]/10 px-2.5 py-1 rounded-md">
              <Droplets className="w-3.5 h-3.5" />
              <span>{initialStats.avgHr} stable</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[#6C4935] font-medium bg-[#EEEAE3] px-2.5 py-1 rounded-md">
              <Thermometer className="w-3.5 h-3.5" />
              <span>{initialStats.avgTemp}</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BARRE D'OUTILS : RECHERCHE, FILTRES & SÉLECTEUR GALERIE / TABLEAU
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        {/* Recherche & Filtre de Disponibilité */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search className="w-3.5 h-3.5 text-[#857A6D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par vitole ou code boîte..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] placeholder-[#857A6D] focus:outline-none focus:border-[#6C4935]"
            />
          </div>

          {/* Filtre de Disponibilité */}
          <div className="flex items-center gap-1 p-1 bg-[#FFFFFF] border border-[#D9D2C7] rounded-full text-xs">
            <button
              onClick={() => setAvailabilityFilter("all")}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                availabilityFilter === "all" ? "bg-[#211D19] text-[#F7F5F0]" : "text-[#645C54] hover:text-[#211D19]"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setAvailabilityFilter("tradeable")}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                availabilityFilter === "tradeable" ? "bg-[#211D19] text-[#F7F5F0]" : "text-[#645C54] hover:text-[#211D19]"
              }`}
            >
              Ouvertes à l'échange
            </button>
            <button
              onClick={() => setAvailabilityFilter("private")}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                availabilityFilter === "private" ? "bg-[#211D19] text-[#F7F5F0]" : "text-[#645C54] hover:text-[#211D19]"
              }`}
            >
              Privées
            </button>
          </div>
        </div>

        {/* Sélecteur Galerie / Tableau avec préférence conservée */}
        <div className="flex items-center gap-1 p-1 bg-[#FFFFFF] border border-[#D9D2C7] rounded-full shrink-0">
          <button
            onClick={() => handleViewModeChange("gallery")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              viewMode === "gallery"
                ? "bg-[#211D19] text-[#F7F5F0]"
                : "text-[#645C54] hover:text-[#211D19]"
            }`}
            title="Vue Galerie (Cartes de pièces)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Galerie</span>
          </button>
          <button
            onClick={() => handleViewModeChange("ledger")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              viewMode === "ledger"
                ? "bg-[#211D19] text-[#F7F5F0]"
                : "text-[#645C54] hover:text-[#211D19]"
            }`}
            title="Vue Tableau d'inventaire avec nombres alignés"
          >
            <Table className="w-3.5 h-3.5" />
            <span>Tableau</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          CONTENU : ÉTAT VIDE CONFORME OU AFFICHAGE DU STOCK
         ========================================================================= */}
      {filteredLots.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#D9D2C7] p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EEEAE3] text-[#6C4935] flex items-center justify-center mx-auto">
            <Box className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-serif text-lg font-normal text-[#211D19]">
              Votre collection commence ici.
            </h3>
            <p className="text-xs text-[#645C54] leading-relaxed">
              Ajoutez une première pièce. Elle restera privée par défaut et sous votre contrôle absolu.
            </p>
          </div>
          {!isVisitorMode && (
            <div className="pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-ink-primary text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une pièce</span>
              </button>
            </div>
          )}
        </div>
      ) : viewMode === "gallery" ? (
        <HumidorGalleryView
          lots={filteredLots}
          isVisitorMode={isVisitorMode}
        />
      ) : (
        <HumidorLedgerView
          lots={filteredLots}
          isVisitorMode={isVisitorMode}
        />
      )}

      {/* Modale d'Enregistrement de Vitole */}
      <AddCigarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        userId={userId}
        universalCigars={universalCigars}
      />
    </div>
  );
};
