"use client";

import React, { useState } from "react";
import { 
  ArrowLeftRight, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Info,
  Sparkles
} from "lucide-react";
import { TradeWithDetails } from "@/lib/actions/trade";
import { WeightlessCard } from "@/components/motion/WeightlessCard";
import { CigarDetailModal, CigarDetailData } from "@/components/catalog/CigarDetailModal";

interface TradeDiptychCardProps {
  trade: TradeWithDetails;
  cigarsMap: Record<string, any>;
  currentUserId: string;
  onOpenNegotiation: (trade: TradeWithDetails, openCounterOffer?: boolean) => void;
}

export const TradeDiptychCard: React.FC<TradeDiptychCardProps> = ({
  trade,
  cigarsMap,
  currentUserId,
  onOpenNegotiation,
}) => {
  const [selectedCigarForDetail, setSelectedCigarForDetail] = useState<CigarDetailData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const activeVersion = trade.versions[0] || {
    versionNumber: 1,
    offeredLotId: "",
    offeredQuantity: 1,
    desiredLotId: "",
    desiredQuantity: 1,
  };

  const offeredCigar = cigarsMap[activeVersion.offeredLotId] || {
    id: activeVersion.offeredLotId || "offered-1",
    brand: "Cohiba",
    name: "Behike BHK 56",
    origin: "Cuba",
    vitola: "Laguito No. 6",
    ringGauge: 56,
    lengthMm: 166,
    vintageYear: "2010",
    rarityLabel: "Édition Historique — Premier Millésime",
    defaultImageUrl: "/assets/cigar-behike56.jpg",
    factoryNotes: "Feuille de Medio Tiempo sous le soleil direct de San Juan y Martínez. Notes intenses de cèdre, torréfaction et cuir noble.",
    strength: "Moyenne à Forte",
    conditionHr: "69% HR Stable",
    boxCode: "BBM MAY 10",
    boxCodeVerified: true,
  };

  const desiredCigar = cigarsMap[activeVersion.desiredLotId] || {
    id: activeVersion.desiredLotId || "desired-1",
    brand: "Trinidad",
    name: "Fundadores Millésime 1998",
    origin: "Cuba",
    vitola: "Laguito No. 1",
    ringGauge: 40,
    lengthMm: 192,
    vintageYear: "1998",
    rarityLabel: "Millésime Diplomatique",
    defaultImageUrl: "/assets/cigar-trinidad.jpg",
    factoryNotes: "Format diplomatique d'État roulé exclusivement à El Laguito. Arômes floraux, miel d'acacia et bois précieux.",
    strength: "Moyenne",
    conditionHr: "68% HR Stable",
    boxCode: "VC-EP0-01",
    boxCodeVerified: true,
  };

  const isProposer = currentUserId === trade.proposerId;
  const partner = isProposer ? trade.recipient : trade.proposer;

  const handleInspectCigar = (cigar: any, lotRole: "offered" | "desired") => {
    setSelectedCigarForDetail({
      id: cigar.id || (lotRole === "offered" ? activeVersion.offeredLotId : activeVersion.desiredLotId),
      brand: cigar.brand,
      name: cigar.name,
      origin: cigar.origin || "Cuba",
      countryCode: cigar.countryCode || "CU",
      vitola: cigar.vitola || "Format Spécial",
      ringGauge: cigar.ringGauge || 50,
      lengthMm: cigar.lengthMm || 150,
      vintageYear: cigar.vintageYear || "2010",
      rarityGrade: cigar.rarityGrade,
      rarityLabel: cigar.rarityLabel || "Vitole de Prestige",
      defaultImageUrl: cigar.defaultImageUrl || "/assets/cigar-behike56.jpg",
      factoryNotes: cigar.factoryNotes || "Conservation rigoureusement documentée en cabinet de cèdre espagnol.",
      strength: cigar.strength || "Moyenne à Forte",
      boxCode: cigar.boxCode || (lotRole === "offered" ? "BBM MAY 10" : "VC-EP0-01"),
      boxCodeVerified: true,
      conditionHr: cigar.conditionHr || "69% HR Stable",
      conditionTemp: cigar.conditionTemp || "19°C",
      packaging: cigar.packaging || "Cabinet d'origine scellé",
      provenanceDeclared: cigar.provenanceDeclared || `Dossier de gré à gré Le Cercle N° ${trade.id.slice(0, 8)}`,
      ownerName: lotRole === "offered" ? (isProposer ? "Votre Cave" : partner.firstName) : (isProposer ? partner.firstName : "Votre Cave"),
      ownerCity: partner.city,
    });
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = () => {
    switch (trade.status) {
      case "MUTUALLY_AGREED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#35483F]/15 text-[#35483F] border border-[#35483F]/40 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Accord Scellé · Réservation Atomique
          </span>
        );
      case "NEGOTIATING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#AA8959]/20 text-[#71513B] border border-[#AA8959]/40 shadow-xs">
            <Clock className="w-3.5 h-3.5" />
            Négociation Active · Version {trade.currentVersion}
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9D0C2]/50 text-[#241E1A] border border-[#D9D0C2]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#35483F]" />
            Échange Clôturé & Transféré
          </span>
        );
      case "DECLINED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-red-900/10 text-red-800 border border-red-800/20">
            Échange Décliné
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#AA8959]/20 text-[#71513B] border border-[#AA8959]/40">
            Proposition V1 Soumise
          </span>
        );
    }
  };

  const lastMessage = trade.messages[trade.messages.length - 1];

  return (
    <>
      <WeightlessCard className="rounded-3xl h-full">
        <article className="cigar-card-surface rounded-3xl p-6 sm:p-8 border border-cigar-stone shadow-sm hover:shadow-cigar-hover transition-all space-y-6 h-full">
          {/* En-tête de la carte d'échange */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-cigar-stone/70 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#241E1A] text-[#FAF7F2] font-serif font-bold text-xs flex items-center justify-center border border-[#AA8959]/50 shadow-inner">
                {partner.avatarInitials}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-cigar-brass font-bold block">
                  Dossier N° {trade.id.slice(0, 8).toUpperCase()}
                </span>
                <div className="font-serif text-sm sm:text-base font-bold text-cigar-ink">
                  Échange avec {partner.firstName} {partner.lastName} ({partner.city})
                </div>
              </div>
            </div>

            <div>{getStatusBadge()}</div>
          </div>

          {/* Diptyque Visuel Interactif : Pièce Offerte ⇄ Pièce Recherchée */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 sm:gap-6 items-center">
            {/* Volet Gauche : Offre (Cliquable pour détails complets) */}
            <div 
              onClick={() => handleInspectCigar(offeredCigar, "offered")}
              className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-cigar-stone/90 hover:border-cigar-brass transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
              title="Cliquer pour examiner la fiche complète de cette vitole"
            >
              {/* Badge d'interaction au hover */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] font-bold text-cigar-cedar bg-[#F4F0E7] px-2 py-0.5 rounded-full border border-cigar-brass/40 shadow-xs">
                <Eye className="w-3 h-3 text-cigar-brass" />
                <span>Voir détails</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-cigar-stone">
                  <img
                    src={offeredCigar.defaultImageUrl}
                    alt={offeredCigar.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-cigar-ink group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-[#241E1A]/80 backdrop-blur-xs text-[#FAF7F2] text-[9px] font-mono px-1.5 py-0.5 rounded">
                    x{activeVersion.offeredQuantity}
                  </div>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-cigar-cedar font-bold block">
                      Offre de {isProposer ? "votre cave" : trade.proposer.firstName}
                    </span>
                  </div>

                  <div className="font-serif font-bold text-sm sm:text-base text-cigar-ink group-hover:text-cigar-cedar transition-colors truncate">
                    {activeVersion.offeredQuantity}x {offeredCigar.brand} {offeredCigar.name}
                  </div>

                  <div className="text-xs text-cigar-ink-muted truncate">
                    {offeredCigar.origin} · {offeredCigar.vitola} (Cepo {offeredCigar.ringGauge})
                  </div>

                  {/* Boutons d'action rapide intégrés */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cigar-brass hover:text-cigar-cedar transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examiner la vitole</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Séparateur Central d'Échange avec Version et Action Changer */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
              <div 
                onClick={() => onOpenNegotiation(trade, true)}
                className="w-11 h-11 rounded-full bg-cigar-ivory border border-cigar-brass/60 hover:border-cigar-cedar hover:bg-[#FAF7F2] flex items-center justify-center text-cigar-cedar shadow-sm cursor-pointer transition-all duration-200 group"
                title="Modifier les vitoles ou soumettre une contre-offre"
              >
                <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </div>
              <span className="text-[10px] font-bold text-cigar-brass uppercase tracking-wider mt-1.5">
                V{activeVersion.versionNumber}
              </span>
            </div>

            {/* Volet Droit : Recherche (Cliquable pour détails complets) */}
            <div 
              onClick={() => handleInspectCigar(desiredCigar, "desired")}
              className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-cigar-stone/90 hover:border-cigar-brass transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
              title="Cliquer pour examiner la fiche complète de cette vitole"
            >
              {/* Badge d'interaction au hover */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-[10px] font-bold text-cigar-cedar bg-[#F4F0E7] px-2 py-0.5 rounded-full border border-cigar-brass/40 shadow-xs">
                <Eye className="w-3 h-3 text-cigar-brass" />
                <span>Voir détails</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative shrink-0 overflow-hidden rounded-xl border border-cigar-stone">
                  <img
                    src={desiredCigar.defaultImageUrl}
                    alt={desiredCigar.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-cigar-ink group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-1 right-1 bg-[#241E1A]/80 backdrop-blur-xs text-[#FAF7F2] text-[9px] font-mono px-1.5 py-0.5 rounded">
                    x{activeVersion.desiredQuantity}
                  </div>
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-cigar-cedar font-bold block">
                      En échange de
                    </span>
                  </div>

                  <div className="font-serif font-bold text-sm sm:text-base text-cigar-ink group-hover:text-cigar-cedar transition-colors truncate">
                    {activeVersion.desiredQuantity}x {desiredCigar.brand} {desiredCigar.name}
                  </div>

                  <div className="text-xs text-cigar-ink-muted truncate">
                    {desiredCigar.origin} · {desiredCigar.vitola} (Cepo {desiredCigar.ringGauge})
                  </div>

                  {/* Boutons d'action rapide intégrés */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cigar-brass hover:text-cigar-cedar transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examiner la vitole</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pied de Carte : Lieu convenu, Dernier message & Actions Clés */}
          <div className="pt-4 border-t border-cigar-stone/70 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-cigar-ink font-medium">
                <MapPin className="w-3.5 h-3.5 text-cigar-cedar shrink-0" />
                <span className="truncate max-w-md">{trade.exchangeLocationType}</span>
              </div>
              {lastMessage && (
                <div className="text-[11px] text-cigar-ink-muted flex items-center gap-1.5 italic">
                  <MessageSquare className="w-3 h-3 text-cigar-brass shrink-0" />
                  <span className="truncate max-w-sm">
                    "{lastMessage.content.slice(0, 75)}{lastMessage.content.length > 75 ? "..." : ""}"
                  </span>
                </div>
              )}
            </div>

            {/* Boutons d'Action Principaux */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Bouton Changer les vitoles / Modifier l'offre */}
              <button
                onClick={() => onOpenNegotiation(trade, true)}
                className="px-3.5 py-2 rounded-xl border border-cigar-brass/50 bg-[#FAF7F2] hover:bg-cigar-ivory text-cigar-ink font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                title="Modifier les vitoles de l'échange ou proposer une contre-offre"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cigar-brass" />
                <span>Changer les vitoles</span>
              </button>

              {/* Bouton Salon de Négociation */}
              <button
                onClick={() => onOpenNegotiation(trade, false)}
                className="btn-primary-gold text-xs shrink-0 py-2 px-4 shadow-xs"
              >
                <span>Salon de Négociation</span>
                <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </article>
      </WeightlessCard>

      {/* Modale d'Expertise Détaillée de la Vitole */}
      <CigarDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cigar={selectedCigarForDetail}
        onChangeInTrade={() => {
          setIsDetailModalOpen(false);
          onOpenNegotiation(trade, true);
        }}
        changeActionLabel="Modifier cette vitole dans l'échange"
      />
    </>
  );
};
