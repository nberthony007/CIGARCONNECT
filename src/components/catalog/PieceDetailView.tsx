"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  MessageSquare, 
  ArrowLeftRight, 
  ShieldCheck, 
  Droplets, 
  Thermometer, 
  Box, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Info,
  CheckCircle2,
  Lock
} from "lucide-react";
import { CigarData } from "./CigarCard";

interface PieceDetailViewProps {
  cigar: CigarData;
}

export const PieceDetailView: React.FC<PieceDetailViewProps> = ({ cigar }) => {
  // Galerie avec sélection et zoom
  const galleryImages = [
    cigar.defaultImageUrl,
    "/assets/cigar-macro-detail.jpg",
    "/assets/hero-cigar-library.jpg",
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeBadgeExplainer, setActiveBadgeExplainer] = useState<string | null>(null);

  // Clavier pour le zoom modal (Échap, flèches gauche/droite)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return;
      if (e.key === "Escape") setIsZoomOpen(false);
      if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, galleryImages.length]);

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Fil d'Ariane & Retour */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/#catalogue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4935] hover:text-[#211D19] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux collections</span>
          </Link>
          <div className="text-xs text-[#645C54] truncate">
            Réf. catalogue : <strong className="text-[#211D19]">{cigar.id}</strong>
          </div>
        </div>

        {/* =========================================================================
            COMPOSITION OFFICIELLE SECTION 12 :
            Desktop : Galerie à gauche (~60% de largeur), Informations et actions à droite (~40%)
            Téléphone : Image, identité, état et action, puis détails
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* COLONNE GAUCHE (60% Desktop) : Galerie photo haute définition */}
          <div className="lg:col-span-7 space-y-4">
            {/* Image Principale avec bouton Zoom */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#211D19] border border-[#D9D2C7] shadow-sm group">
              <img
                src={galleryImages[activeImageIndex]}
                alt={`${cigar.brand} ${cigar.name} — Vue ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              />

              {/* Bouton Agrandir / Zoom */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-4 right-4 bg-[#211D19]/85 backdrop-blur-md text-[#F7F5F0] p-2.5 rounded-full border border-[#D9D2C7]/40 opacity-90 hover:opacity-100 hover:scale-105 transition-all"
                aria-label="Agrandir la photographie"
                title="Ouvrir le zoom haute définition"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Compteur d'image */}
              <div className="absolute top-4 left-4 bg-[#211D19]/85 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-medium text-[#F7F5F0] border border-[#D9D2C7]/30">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Miniatures sélectionnables */}
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-[#6C4935] shadow-sm scale-105"
                      : "border-[#D9D2C7] opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Afficher la photo ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Miniature ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* COLONNE DROITE (40% Desktop) : Identité, actions et détails structurés */}
          <div className="lg:col-span-5 space-y-6">
            {/* Premier Niveau : Identité essentielle */}
            <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] shadow-sm space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6C4935] font-semibold">
                  {cigar.brand} · {cigar.origin} {cigar.vintageYear && `· ${cigar.vintageYear}`}
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#211D19] mt-1 leading-snug">
                  {cigar.name}
                </h1>
                <p className="text-xs text-[#645C54] mt-1">
                  Module officiel : <strong className="text-[#211D19]">{cigar.vitola}</strong> (Cepo {cigar.ringGauge} · {cigar.lengthMm} mm)
                </p>
              </div>

              {/* Propriétaire & Disponibilité */}
              <div className="pt-3 border-t border-[#D9D2C7]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <div className="text-[#645C54]">Détenteur certifié</div>
                  <div className="font-semibold text-[#211D19]">{cigar.owner?.name || "Membre Privé"}</div>
                  <div className="text-[11px] text-[#857A6D]">{cigar.owner?.city}, {cigar.owner?.country}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[#645C54]">Statut</div>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#365343] text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#365343]" />
                    Disponible à l'échange
                  </span>
                </div>
              </div>

              {/* Actions Principales (Section 12) */}
              <div className="pt-2 space-y-2.5">
                {/* Action Dominante : Discuter de cette pièce */}
                <Link
                  href={`/trade?target=${cigar.id}&openChat=1`}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="w-full btn-ink-primary flex items-center justify-center gap-2 py-3"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuter de cette pièce</span>
                </Link>

                {/* Action Secondaire : Proposer un échange */}
                <Link
                  href={`/trade?target=${cigar.id}`}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="w-full btn-secondary-luxury flex items-center justify-center gap-2 py-3"
                >
                  <ArrowLeftRight className="w-4 h-4 text-[#6C4935]" />
                  <span>Proposer un échange</span>
                </Link>
              </div>
            </div>

            {/* Badges de contrôle explicables avec panneau popover (Section 12) */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-[#645C54] font-semibold">
                Contrôles & Niveaux de Vérification
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setActiveBadgeExplainer(
                      activeBadgeExplainer === "hygro" ? null : "hygro"
                    )
                  }
                  className="cigar-badge cigar-badge-pine hover:bg-[#365343]/20 transition-colors"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>{cigar.owner?.conditionHr || "69% HR"}</span>
                  <Info className="w-3 h-3 ml-0.5 opacity-70" />
                </button>

                <button
                  onClick={() =>
                    setActiveBadgeExplainer(
                      activeBadgeExplainer === "boxcode" ? null : "boxcode"
                    )
                  }
                  className="cigar-badge cigar-badge-brass hover:bg-[#A88958]/25 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Code Boîte : {cigar.owner?.boxCode || "Vérifié"}</span>
                  <Info className="w-3 h-3 ml-0.5 opacity-70" />
                </button>
              </div>

              {/* Panneau explicatif du badge ouvert */}
              {activeBadgeExplainer === "hygro" && (
                <div className="p-3 rounded-lg bg-[#EEEAE3] text-xs text-[#211D19] border border-[#D9D2C7] animate-in fade-in duration-150">
                  <div className="font-semibold mb-1">Norme de conservation 68–70% HR :</div>
                  Cette vitole a été conservée sous régulation hygrométrique certifiée en cabinet de cèdre d'Espagne à température stable (18–20°C).
                </div>
              )}

              {activeBadgeExplainer === "boxcode" && (
                <div className="p-3 rounded-lg bg-[#EEEAE3] text-xs text-[#211D19] border border-[#D9D2C7] animate-in fade-in duration-150">
                  <div className="font-semibold mb-1">Code Usine Vérifié :</div>
                  L'inscription usine au dos du coffret ({cigar.owner?.boxCode || "BBM MAY 10"}) correspond à la manufacture officielle et au mois de mise en boîte de la marque.
                </div>
              )}
            </div>

            {/* LES 4 SECTIONS OFFICIELLES (Section 12) */}
            <div className="space-y-4">
              {/* Section 1 : Présentation */}
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                <h3 className="font-serif text-base font-semibold text-[#211D19]">
                  1. Présentation de la Vitole
                </h3>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  {cigar.factoryNotes ||
                    "Vitole d'exception issue des meilleures plantations de tabac. Les feuilles de tripe et sous-cape ont été affinées pour offrir un profil aromatique noble et équilibré."}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#645C54] border-t border-[#D9D2C7]/60">
                  <div>Puissance : <strong className="text-[#211D19]">{cigar.strength}</strong></div>
                  <div>Rareté : <strong className="text-[#6C4935]">{cigar.rarityLabel}</strong></div>
                </div>
              </div>

              {/* Section 2 : Provenance */}
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                <h3 className="font-serif text-base font-semibold text-[#211D19]">
                  2. Provenance & Authenticité
                </h3>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  Origine déclarée : <strong>{cigar.origin}</strong>. La pièce est accompagnée de son code boîte d'origine. Aucune altération physique de la bague.
                </p>
              </div>

              {/* Section 3 : Conservation */}
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                <h3 className="font-serif text-base font-semibold text-[#211D19]">
                  3. Conditions de Conservation
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F7F5F0] border border-[#D9D2C7]">
                    <div className="text-[#645C54]">Hygrométrie</div>
                    <div className="font-bold text-[#365343]">{cigar.owner?.conditionHr || "69.2% HR"}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F5F0] border border-[#D9D2C7]">
                    <div className="text-[#645C54]">Température</div>
                    <div className="font-bold text-[#6C4935]">18.5°C Stable</div>
                  </div>
                </div>
              </div>

              {/* Section 4 : Collectionneur */}
              <div className="p-5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                <h3 className="font-serif text-base font-semibold text-[#211D19]">
                  4. Collectionneur & Confidentialité
                </h3>
                <p className="text-xs text-[#645C54] leading-relaxed">
                  Membre actif du cercle. Coordonnées privées protégées, échanges organisés en salon feutré sécurisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DIALOGUE DE ZOOM GALERIE ACCESSIBLE (Section 12)
         ========================================================================= */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1916]/95 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Agrandissement de la photographie"
        >
          {/* Bouton Fermer */}
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-[#FFFFFF]/10 text-[#F7F5F0] hover:bg-[#FFFFFF]/20 transition-colors"
            aria-label="Fermer le zoom"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Flèche Précédent */}
          <button
            onClick={() =>
              setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))
            }
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-[#FFFFFF]/10 text-[#F7F5F0] hover:bg-[#FFFFFF]/20 transition-colors"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image agrandie */}
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-xl">
            <img
              src={galleryImages[activeImageIndex]}
              alt={`${cigar.brand} ${cigar.name} agrandi`}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>

          {/* Flèche Suivant */}
          <button
            onClick={() =>
              setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))
            }
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-[#FFFFFF]/10 text-[#F7F5F0] hover:bg-[#FFFFFF]/20 transition-colors"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Légende bas de page */}
          <div className="absolute bottom-6 text-center text-xs text-[#EEEAE3]/80">
            {cigar.brand} {cigar.name} · Photo {activeImageIndex + 1} sur {galleryImages.length} (Appuyez sur Échap pour fermer)
          </div>
        </div>
      )}
    </div>
  );
};
