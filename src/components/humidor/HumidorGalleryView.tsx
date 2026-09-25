"use client";

import React, { useState } from "react";
import { 
  Droplets, 
  Thermometer, 
  Lock, 
  ArrowLeftRight, 
  Flame, 
  Trash2, 
  Award, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye
} from "lucide-react";
import { HumidorLotWithCigar, consumeLotStick, toggleLotTradeable, deleteHumidorLot } from "@/lib/actions/humidor";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { WeightlessCard } from "@/components/motion/WeightlessCard";
import { CigarDetailModal, CigarDetailData } from "@/components/catalog/CigarDetailModal";
import { useToast } from "@/components/ui/Toast";

interface HumidorGalleryViewProps {
  lots: HumidorLotWithCigar[];
  isVisitorMode: boolean;
  onLotUpdated?: () => void;
}

export const HumidorGalleryView: React.FC<HumidorGalleryViewProps> = ({
  lots,
  isVisitorMode,
  onLotUpdated,
}) => {
  const { showToast } = useToast();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedCigarForDetail, setSelectedCigarForDetail] = useState<CigarDetailData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // En mode visiteur, seules les vitoles échangeables sont affichées
  const displayedLots = isVisitorMode ? lots.filter((l) => l.isTradeable) : lots;

  const handleOpenDetail = (lot: HumidorLotWithCigar) => {
    const cigar = lot.cigarReference;
    setSelectedCigarForDetail({
      id: cigar?.id || lot.id,
      brand: cigar?.brand || lot.customBrand || "Marque personnelle",
      name: cigar?.name || lot.customName || "Pièce non répertoriée",
      origin: cigar?.origin || lot.customOrigin || "Origine déclarée",
      countryCode: cigar?.countryCode || "CU",
      vitola: cigar?.vitola || lot.customVitola || "Module libre",
      ringGauge: cigar?.ringGauge || 50,
      lengthMm: cigar?.lengthMm || 150,
      vintageYear: cigar?.vintageYear || lot.acquisitionDate || null,
      rarityGrade: cigar?.rarityGrade || (lot.isCustomPiece ? "CUSTOM" : "REGULAR"),
      rarityLabel: cigar?.rarityLabel || (lot.isCustomPiece ? "Pièce Personnelle Hors Catalogue" : "Pièce de Référence"),
      defaultImageUrl: lot.customPhotoUrl || cigar?.defaultImageUrl || "/assets/cigar-behike56.jpg",
      factoryNotes: cigar?.factoryNotes || lot.privateNotes || "Conservée sous contrôle hygrométrique rigoureux.",
      strength: cigar?.strength || "Moyenne",
      boxCode: lot.boxCode,
      boxCodeVerified: lot.boxCodeVerified,
      packaging: lot.packaging,
      conditionHr: lot.conditionHr,
      conditionTemp: lot.conditionTemp,
      provenanceDeclared: lot.provenanceDeclared,
    });
    setIsDetailModalOpen(true);
  };

  const handleConsume = async (lotId: string, cigarName: string) => {
    if (!confirm(`Confirmez-vous la dégustation d'une vitole "${cigarName}" ? Le stock diminuera de 1 unité.`)) {
      return;
    }
    setActionLoadingId(lotId);
    await consumeLotStick(lotId);
    setActionLoadingId(null);
    showToast("Dégustation Enregistrée", `Une unité de ${cigarName} a été décomptée de votre cave.`, "success");
    if (onLotUpdated) onLotUpdated();
  };

  const handleToggleTrade = async (lotId: string, currentStatus: boolean) => {
    setActionLoadingId(lotId);
    await toggleLotTradeable(lotId, !currentStatus);
    setActionLoadingId(null);
    showToast(
      !currentStatus ? "Disponible à l'Échange" : "Placé en Coffre Privé",
      `Le statut de la pièce a été mis à jour dans Le Cercle.`,
      "info"
    );
    if (onLotUpdated) onLotUpdated();
  };

  const handleDelete = async (lotId: string, cigarName: string) => {
    if (!confirm(`Souhaitez-vous retirer définitivement "${cigarName}" de votre cave ?`)) {
      return;
    }
    setActionLoadingId(lotId);
    await deleteHumidorLot(lotId);
    setActionLoadingId(null);
    showToast("Pièce Retirée", `Le lot ${cigarName} a été retiré de votre inventaire.`, "info");
    if (onLotUpdated) onLotUpdated();
  };

  if (displayedLots.length === 0) {
    return (
      <div className="text-center py-20 bg-cigar-ivory-light rounded-3xl border border-cigar-stone p-8">
        <div className="w-16 h-16 rounded-2xl bg-cigar-stone/40 flex items-center justify-center text-cigar-cedar mx-auto mb-4">
          <Droplets className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-cigar-ink mb-2">
          {isVisitorMode ? "Aucune vitole publique à l'échange" : "Votre humidor est vide"}
        </h3>
        <p className="text-xs text-cigar-ink-muted max-w-md mx-auto leading-relaxed">
          {isVisitorMode
            ? "Cet aficionado conserve actuellement toutes ses pièces dans son coffre-fort privé."
            : "Consignez vos premières boîtes et vitoles de collection pour activer le suivi hygrométrique 68–70% HR."}
        </p>
      </div>
    );
  }

  return (
    <>
      <MotionReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.06}>
      {displayedLots.map((lot) => {
        const cigar = lot.cigarReference;
        const brand = cigar?.brand || lot.customBrand || "Marque personnelle";
        const name = cigar?.name || lot.customName || "Pièce non répertoriée";
        const origin = cigar?.origin || lot.customOrigin || "Origine déclarée";
        const vitola = cigar?.vitola || lot.customVitola || "Module libre";
        const ringGauge = cigar?.ringGauge || 50;
        const vintageYear = cigar?.vintageYear || lot.acquisitionDate;
        const imageUrl = lot.customPhotoUrl || cigar?.defaultImageUrl || "/assets/cigar-behike56.jpg";
        const isReserved = lot.reservedQuantity > 0;
        const availableQty = Math.max(0, lot.quantity - lot.reservedQuantity);

        return (
          <WeightlessCard key={lot.id} className="rounded-2xl h-full">
            <article className="cigar-card-surface rounded-2xl overflow-hidden flex flex-col justify-between h-full group relative">
            <div>
              {/* Photo Studio avec calque d'information & Clic Interactif */}
              <div 
                onClick={() => handleOpenDetail(lot)}
                className="relative h-60 w-full overflow-hidden bg-cigar-ink cursor-pointer"
                title="Cliquer pour voir la fiche d'expertise complète"
              >
                <img
                  src={imageUrl}
                  alt={`${brand} ${name}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cigar-ink/85 via-transparent to-black/30" />

                {/* Pastille au survol */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#241E1A]/90 backdrop-blur-md text-[#FAF7F2] text-xs font-bold border border-[#AA8959] shadow-lg">
                  <Eye className="w-3.5 h-3.5 text-[#AA8959]" />
                  <span>Examiner la vitole</span>
                </div>

                {/* Badge d'origine */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-[#241E1A]/85 backdrop-blur-md text-[#FAF7F2] text-[10px] font-bold tracking-widest uppercase border border-cigar-stone/40">
                    {origin}
                  </span>
                </div>

                {/* Badge de statut d'échange ou coffre privé */}
                <div className="absolute top-3 right-3">
                  {lot.isTradeable ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cigar-pine/90 backdrop-blur-md text-[#FAF7F2] text-[10px] font-bold tracking-wider uppercase border border-cigar-pine">
                      <ArrowLeftRight className="w-3 h-3 text-cigar-brass-light" />
                      Disponible Échange
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cigar-cedar-dark/85 backdrop-blur-md text-[#FAF7F2] text-[10px] font-medium tracking-wider uppercase border border-cigar-stone/40">
                      <Lock className="w-3 h-3 text-cigar-brass-light" />
                      Coffre Privé
                    </span>
                  )}
                </div>

                {/* Marque & Nom en bas d'image */}
                <div className="absolute bottom-3 left-4 right-4 text-[#FAF7F2]">
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-cigar-brass-light">
                    {brand}
                  </div>
                  <h3 className="font-serif text-lg font-bold tracking-wide line-clamp-1">
                    {name}
                  </h3>
                  <div className="text-[11px] text-[#FAF7F2]/80 font-light flex items-center justify-between mt-0.5">
                    <span>{vitola} {cigar ? `· Cepo ${ringGauge}` : ""}</span>
                    {vintageYear && (
                      <span className="text-cigar-brass-light font-semibold">
                        Millésime {vintageYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Détails du lot en cave */}
              <div className="p-5 space-y-4">
                {/* Conditionnement & Quantité */}
                <div className="flex items-center justify-between pb-3 border-b border-cigar-stone/70">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-cigar-ink-muted block">
                      Conditionnement
                    </span>
                    <span className="text-xs font-serif font-bold text-cigar-ink">
                      {lot.packaging}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-cigar-ink-muted block">
                      Stock en Cave
                    </span>
                    <span className="text-sm font-bold text-cigar-cedar">
                      {lot.quantity} {lot.quantity > 1 ? "unités" : "unité"}
                    </span>
                  </div>
                </div>

                {/* Traçabilité : Code Boîte & Provenance */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-cigar-stone/20 border border-cigar-stone/60">
                  <div>
                    <span className="text-[10px] text-cigar-ink-muted block">Code Boîte</span>
                    <span className="font-mono font-bold text-cigar-ink">
                      {lot.boxCode || "Non renseigné"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-cigar-ink-muted block">Certification</span>
                    <span className="text-[11px] text-cigar-pine font-medium inline-flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-3 h-3" />
                      {lot.boxCodeVerified ? "Authentifié" : "Déclaratif"}
                    </span>
                  </div>
                </div>

                {/* Paramètres de Conservation (Norme 68–70% HR) */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-cigar-pine font-semibold">
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{lot.conditionHr}</span>
                  </div>
                  <div className="flex items-center gap-1 text-cigar-cedar font-medium">
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>{lot.conditionTemp}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-cigar-brass font-bold px-2 py-0.5 rounded bg-cigar-brass/10 border border-cigar-brass/30">
                    Boveda Stable
                  </span>
                </div>

                {/* Valorisation (Masquée par défaut en mode visiteur) */}
                {!isVisitorMode && lot.valuationAmount && (
                  <div className="pt-2 text-[11px] text-cigar-ink-muted flex items-center justify-between border-t border-cigar-stone/50">
                    <span>Estimation déclarée :</span>
                    <span className="font-serif font-bold text-cigar-ink">
                      {lot.valuationAmount.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Propriétaire (Masquées en Mode Visiteur) */}
            {!isVisitorMode && (
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-cigar-stone/70 flex items-center justify-between gap-2">
                  {/* Bouton Déguster (-1 unité) */}
                  <button
                    onClick={() => handleConsume(lot.id, `${brand} ${name}`)}
                    disabled={actionLoadingId === lot.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cigar-cedar hover:bg-cigar-stone/30 transition-colors border border-cigar-stone"
                    title="Déguster une pièce (diminue le stock de 1)"
                  >
                    <Flame className="w-3.5 h-3.5 text-cigar-brass" />
                    <span>Déguster (-1)</span>
                  </button>

                  {/* Bouton Bascule Échange */}
                  <button
                    onClick={() => handleToggleTrade(lot.id, lot.isTradeable)}
                    disabled={actionLoadingId === lot.id}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      lot.isTradeable
                        ? "text-cigar-pine border-cigar-pine/40 hover:bg-cigar-pine/10"
                        : "text-cigar-ink-muted border-cigar-stone hover:bg-cigar-stone/30"
                    }`}
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>{lot.isTradeable ? "À l'Échange" : "En Coffre"}</span>
                  </button>

                  {/* Bouton Retirer */}
                  <button
                    onClick={() => handleDelete(lot.id, `${brand} ${name}`)}
                    disabled={actionLoadingId === lot.id}
                    className="p-1.5 rounded-lg text-cigar-ink-muted hover:text-red-700 hover:bg-red-50 transition-colors"
                    title="Retirer de la cave"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            </article>
          </WeightlessCard>
        );
      })}
    </MotionReveal>

    {/* Modale d'Expertise Détaillée pour l'Humidor */}
    <CigarDetailModal
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      cigar={selectedCigarForDetail}
    />
    </>
  );
};
