"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ShieldCheck, 
  Send, 
  ArrowLeftRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare,
  Sparkles,
  Loader2,
  FileSignature,
  SlidersHorizontal,
  Eye,
  Plus,
  Minus,
  Check
} from "lucide-react";
import { 
  TradeWithDetails, 
  acceptTradeProposal, 
  finalizeTradeExchange, 
  declineTradeProposal, 
  sendTradeMessage, 
  submitCounterOffer 
} from "@/lib/actions/trade";
import { CigarDetailModal, CigarDetailData } from "@/components/catalog/CigarDetailModal";
import { useToast } from "@/components/ui/Toast";

interface TradeNegotiationRoomProps {
  isOpen: boolean;
  onClose: () => void;
  trade: TradeWithDetails | null;
  currentUserId: string;
  cigarsMap: Record<string, any>;
  universalCigars?: any[];
  userLots?: any[];
  initialShowCounterOffer?: boolean;
  onTradeUpdated: () => void;
}

export const TradeNegotiationRoom: React.FC<TradeNegotiationRoomProps> = ({
  isOpen,
  onClose,
  trade,
  currentUserId,
  cigarsMap,
  universalCigars = [],
  userLots = [],
  initialShowCounterOffer = false,
  onTradeUpdated,
}) => {
  const { showToast } = useToast();
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(0);
  const [messageInput, setMessageInput] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // États de la contre-offre & changement de vitoles
  const [showCounterOfferForm, setShowCounterOfferForm] = useState<boolean>(false);
  const [selectedOfferedCigarId, setSelectedOfferedCigarId] = useState<string>("");
  const [selectedDesiredCigarId, setSelectedDesiredCigarId] = useState<string>("");
  const [counterOfferedQty, setCounterOfferedQty] = useState<number>(1);
  const [counterDesiredQty, setCounterDesiredQty] = useState<number>(1);
  const [counterNote, setCounterNote] = useState<string>("");

  // Modale d'inspection de vitole
  const [selectedCigarForDetail, setSelectedCigarForDetail] = useState<CigarDetailData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Synchronisation à l'ouverture
  useEffect(() => {
    if (isOpen && trade) {
      const activeVer = trade.versions[0];
      if (activeVer) {
        setSelectedOfferedCigarId(activeVer.offeredLotId);
        setSelectedDesiredCigarId(activeVer.desiredLotId);
        setCounterOfferedQty(activeVer.offeredQuantity || 1);
        setCounterDesiredQty(activeVer.desiredQuantity || 1);
      }
      if (initialShowCounterOffer) {
        setShowCounterOfferForm(true);
      }
    }
  }, [isOpen, trade, initialShowCounterOffer]);

  if (!isOpen || !trade) return null;

  const activeVersion = trade.versions[activeVersionIndex] || trade.versions[0];
  const isProposer = currentUserId === trade.proposerId;
  const partner = isProposer ? trade.recipient : trade.proposer;

  const offeredCigar = cigarsMap[activeVersion.offeredLotId] || {
    id: activeVersion.offeredLotId,
    brand: "Vitole Offerte",
    name: "Module de Collection",
    origin: "Cuba",
    vitola: "Spéciale",
    ringGauge: 52,
    lengthMm: 156,
    defaultImageUrl: "/assets/cigar-behike56.jpg",
    strength: "Moyenne à Forte",
    factoryNotes: "Conservé sous hygrométrie certifiée 68–70% HR.",
  };

  const desiredCigar = cigarsMap[activeVersion.desiredLotId] || {
    id: activeVersion.desiredLotId,
    brand: "Vitole Recherchée",
    name: "Module d'Exception",
    origin: "Cuba",
    vitola: "Spéciale",
    ringGauge: 40,
    lengthMm: 192,
    defaultImageUrl: "/assets/cigar-trinidad.jpg",
    strength: "Moyenne",
    factoryNotes: "Format diplomatique d'État roulé à El Laguito.",
  };

  // Liste de choix pour les vitoles (universelles + lots de cave)
  const availableCigarsList = universalCigars.length > 0 
    ? universalCigars 
    : Object.values(cigarsMap);

  const previewOfferedCigar = cigarsMap[selectedOfferedCigarId] || offeredCigar;
  const previewDesiredCigar = cigarsMap[selectedDesiredCigarId] || desiredCigar;

  // Ouvrir la modale d'inspection
  const handleInspect = (cigar: any, titlePrefix: string) => {
    setSelectedCigarForDetail({
      id: cigar.id,
      brand: cigar.brand,
      name: cigar.name,
      origin: cigar.origin || "Cuba",
      countryCode: cigar.countryCode || "CU",
      vitola: cigar.vitola || "Format Rare",
      ringGauge: cigar.ringGauge || 52,
      lengthMm: cigar.lengthMm || 156,
      vintageYear: cigar.vintageYear || "2010",
      rarityLabel: cigar.rarityLabel || "Pièce de Collection",
      defaultImageUrl: cigar.defaultImageUrl || "/assets/cigar-behike56.jpg",
      factoryNotes: cigar.factoryNotes || "Conservation rigoureusement documentée en cabinet de cèdre.",
      strength: cigar.strength || "Moyenne à Forte",
      boxCode: cigar.boxCode || (titlePrefix.includes("Offre") ? "BBM MAY 10" : "VC-EP0-01"),
      boxCodeVerified: true,
      conditionHr: "69% HR Stable",
      conditionTemp: "19°C",
      packaging: cigar.packaging || "Coffret numéroté en cèdre",
      provenanceDeclared: `Dossier d'échange Le Cercle N° ${trade.id.slice(0, 8)}`,
      ownerName: titlePrefix.includes("Offre") ? (isProposer ? "Votre Cave" : partner.firstName) : (isProposer ? partner.firstName : "Votre Cave"),
      ownerCity: partner.city,
    });
    setIsDetailModalOpen(true);
  };

  // Envoi d'un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setLoadingAction(true);
    setErrorMsg(null);
    const res = await sendTradeMessage(trade.id, currentUserId, messageInput.trim());
    setLoadingAction(false);

    if (res.success) {
      setMessageInput("");
      showToast("Message transmis", "Message envoyé dans le salon confidentiel.", "info");
      onTradeUpdated();
    } else {
      setErrorMsg(res.error || "Erreur d'envoi du message.");
    }
  };

  // Signature / Accord mutuel atomique
  const handleAccept = async () => {
    if (
      !confirm(
        `Confirmez-vous la signature de l'accord sur la Version ${activeVersion.versionNumber} ? Les unités seront immédiatement verrouillées sous réservation atomique en cave 68–70% HR.`
      )
    ) {
      return;
    }

    setLoadingAction(true);
    setErrorMsg(null);
    const res = await acceptTradeProposal(trade.id, activeVersion.id, currentUserId);
    setLoadingAction(false);

    if (res.success) {
      showToast("Accord Mutuel Scellé !", "Les unités ont été réservées de manière atomique en cave.", "success");
      onTradeUpdated();
    } else {
      setErrorMsg(res.error || "Échec de l'accord mutuel.");
    }
  };

  // Clôture définitive et transfert
  const handleFinalize = async () => {
    if (
      !confirm(
        "Confirmez-vous que la remise en main propre a été effectuée ? Les inventaires respectifs seront définitivement mis à jour."
      )
    ) {
      return;
    }

    setLoadingAction(true);
    setErrorMsg(null);
    const res = await finalizeTradeExchange(trade.id, currentUserId);
    setLoadingAction(false);

    if (res.success) {
      showToast("Échange Clôturé & Transféré", "Les vitoles ont été réassignées aux caves respectives.", "success");
      onTradeUpdated();
    } else {
      setErrorMsg(res.error || "Échec de la clôture.");
    }
  };

  // Refus ou annulation
  const handleDecline = async () => {
    const reason = prompt("Indiquez la raison du refus (optionnel) :", "Conditions non réunies.");
    if (reason === null) return;

    setLoadingAction(true);
    setErrorMsg(null);
    const res = await declineTradeProposal(trade.id, currentUserId, reason);
    setLoadingAction(false);

    if (res.success) {
      showToast("Échange Décliné", "Le dossier a été archivé dans Le Cercle.", "info");
      onTradeUpdated();
    } else {
      setErrorMsg(res.error || "Échec de l'annulation.");
    }
  };

  // Soumission d'une contre-offre avec CHANGEMENT COMPLET DE VITOLES
  const handleCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    setErrorMsg(null);

    const res = await submitCounterOffer({
      tradeProposalId: trade.id,
      senderId: currentUserId,
      offeredCigarId: selectedOfferedCigarId || activeVersion.offeredLotId,
      offeredQuantity: Number(counterOfferedQty),
      desiredCigarId: selectedDesiredCigarId || activeVersion.desiredLotId,
      desiredQuantity: Number(counterDesiredQty),
      notes: counterNote.trim() || undefined,
    });

    setLoadingAction(false);

    if (res.success) {
      setShowCounterOfferForm(false);
      showToast(
        `Contre-Offre Version ${res.versionNumber || trade.currentVersion + 1} Transmise`,
        "Les vitoles sélectionnées ont été intégrées à la nouvelle proposition.",
        "success"
      );
      onTradeUpdated();
    } else {
      setErrorMsg(res.error || "Erreur lors de la contre-offre.");
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Fond obscurci */}
        <div
          className="fixed inset-0 bg-[#161210]/80 backdrop-blur-md transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Salon de Négociation */}
        <div className="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#D9D0C2] rounded-3xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]">
          {/* En-tête du Salon Privé */}
          <div className="bg-[#241E1A] text-[#FAF7F2] p-5 sm:p-6 border-b border-[#AA8959]/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#71513B] flex items-center justify-center text-[#FAF7F2] border border-[#AA8959]/50 shadow-inner">
                <ShieldCheck className="w-6 h-6 text-[#AA8959]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#FAF7F2]">
                    Salon Privé de Négociation
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#AA8959]/20 text-[#AA8959] border border-[#AA8959]/40">
                    {trade.status}
                  </span>
                </div>
                <p className="text-xs text-[#FAF7F2]/70 font-light">
                  Dossier confidentiel entre <strong>{trade.proposer.firstName} {trade.proposer.lastName}</strong> et <strong>{trade.recipient.firstName} {trade.recipient.lastName}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl border border-[#D9D0C2]/30 flex items-center justify-center text-[#FAF7F2]/80 hover:text-white hover:bg-[#71513B] transition-colors"
              aria-label="Fermer le salon"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message d'erreur éventuel */}
          {errorMsg && (
            <div className="p-3 bg-red-900/10 border-b border-red-800/20 text-xs text-red-800 font-medium text-center">
              {errorMsg}
            </div>
          )}

          {/* Corps principal : Diptyque de la Version & Fil de Discussion */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-grow">
            {/* Bandeau d'état de l'accord */}
            {trade.status === "MUTUALLY_AGREED" && (
              <div className="p-4 rounded-2xl bg-[#35483F]/15 border border-[#35483F]/40 text-[#35483F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-sm block">Accord Mutuel Scellé & Confirmé</span>
                    <span>Les unités sont réservées de manière atomique en cave sous 68–70% HR. Prêtes pour la remise.</span>
                  </div>
                </div>
                <button
                  onClick={handleFinalize}
                  disabled={loadingAction}
                  className="btn-primary-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm"
                >
                  Confirmer la Remise
                </button>
              </div>
            )}

            {/* Barre de Sélection des Versions (V1, V2...) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D9D0C2]/70">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-cigar-ink-muted uppercase tracking-wider pr-1">
                  Versions :
                </span>
                {trade.versions.map((ver, idx) => (
                  <button
                    key={ver.id}
                    onClick={() => setActiveVersionIndex(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                      activeVersionIndex === idx
                        ? "bg-[#71513B] text-[#FAF7F2] shadow-xs"
                        : "bg-white text-cigar-ink-muted border border-cigar-stone hover:border-cigar-brass"
                    }`}
                  >
                    Version {ver.versionNumber} {idx === 0 ? "(Actuelle)" : ""}
                  </button>
                ))}
              </div>

              {/* Bouton direct pour ouvrir le formulaire de changement de vitoles */}
              {trade.status !== "MUTUALLY_AGREED" && trade.status !== "COMPLETED" && (
                <button
                  onClick={() => setShowCounterOfferForm(!showCounterOfferForm)}
                  className="px-3.5 py-1.5 rounded-xl border border-cigar-brass bg-white text-cigar-ink text-xs font-bold flex items-center gap-1.5 hover:bg-[#F4F0E7] shadow-xs transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cigar-brass" />
                  <span>{showCounterOfferForm ? "Masquer ajustements" : "Changer les vitoles / Contre-Offre"}</span>
                </button>
              )}
            </div>

            {/* Diptyque comparatif de la version inspectée (CLIQUABLE POUR VOIR DÉTAILS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Volet Offre */}
              <div 
                onClick={() => handleInspect(offeredCigar, "Offre")}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-cigar-stone/90 hover:border-cigar-brass transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
                title="Cliquer pour voir la fiche d'expertise complète"
              >
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-cigar-cedar bg-[#F4F0E7] px-2 py-0.5 rounded-full border border-cigar-brass/40 shadow-xs">
                  <Eye className="w-3 h-3 text-cigar-brass" />
                  <span>Voir fiche</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0 overflow-hidden rounded-xl border border-cigar-stone">
                    <img
                      src={offeredCigar.defaultImageUrl}
                      alt={offeredCigar.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-cigar-ink group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-[#241E1A]/80 backdrop-blur-xs text-[#FAF7F2] text-[9px] font-mono px-1.5 py-0.5 rounded">
                      x{activeVersion.offeredQuantity}
                    </div>
                  </div>

                  <div className="text-xs space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-cigar-cedar font-bold block">
                      Offre de {trade.proposer.firstName}
                    </span>
                    <div className="font-serif font-bold text-sm sm:text-base text-cigar-ink group-hover:text-cigar-cedar transition-colors truncate">
                      {activeVersion.offeredQuantity}x {offeredCigar.brand} {offeredCigar.name}
                    </div>
                    <div className="text-[11px] text-cigar-ink-muted">
                      {offeredCigar.origin} · {offeredCigar.vitola} (Cepo {offeredCigar.ringGauge})
                    </div>
                    <div className="text-[10px] font-semibold text-[#35483F] flex items-center gap-1 pt-0.5">
                      <Check className="w-3 h-3" />
                      <span>Signature : {activeVersion.signedByProposer ? "Accord signé" : "En pourparlers"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volet Recherche */}
              <div 
                onClick={() => handleInspect(desiredCigar, "Recherche")}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-cigar-stone/90 hover:border-cigar-brass transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
                title="Cliquer pour voir la fiche d'expertise complète"
              >
                <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold text-cigar-cedar bg-[#F4F0E7] px-2 py-0.5 rounded-full border border-cigar-brass/40 shadow-xs">
                  <Eye className="w-3 h-3 text-cigar-brass" />
                  <span>Voir fiche</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0 overflow-hidden rounded-xl border border-cigar-stone">
                    <img
                      src={desiredCigar.defaultImageUrl}
                      alt={desiredCigar.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-cigar-ink group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-[#241E1A]/80 backdrop-blur-xs text-[#FAF7F2] text-[9px] font-mono px-1.5 py-0.5 rounded">
                      x{activeVersion.desiredQuantity}
                    </div>
                  </div>

                  <div className="text-xs space-y-1 min-w-0 flex-1">
                    <span className="text-[10px] uppercase tracking-wider text-cigar-cedar font-bold block">
                      Recherche / En échange de
                    </span>
                    <div className="font-serif font-bold text-sm sm:text-base text-cigar-ink group-hover:text-cigar-cedar transition-colors truncate">
                      {activeVersion.desiredQuantity}x {desiredCigar.brand} {desiredCigar.name}
                    </div>
                    <div className="text-[11px] text-cigar-ink-muted">
                      {desiredCigar.origin} · {desiredCigar.vitola} (Cepo {desiredCigar.ringGauge})
                    </div>
                    <div className="text-[10px] font-semibold text-[#35483F] flex items-center gap-1 pt-0.5">
                      <Check className="w-3 h-3" />
                      <span>Signature : {activeVersion.signedByRecipient ? "Accord signé" : "En pourparlers"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FORMULAIRE DE CONTRE-OFFRE AVEC CHANGEMENT COMPLET DES VITOLES */}
            {showCounterOfferForm && (
              <form
                onSubmit={handleCounterOffer}
                className="p-5 rounded-2xl bg-white border border-[#AA8959] space-y-5 shadow-md animate-in slide-in-from-top-4 duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#D9D0C2]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#71513B] uppercase tracking-wider">
                    <SlidersHorizontal className="w-4 h-4 text-[#AA8959]" />
                    <span>Modifier les Vitoles & Déposer une Contre-Offre (Version {trade.currentVersion + 1})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCounterOfferForm(false)}
                    className="text-[#8D8078] hover:text-[#241E1A] text-xs font-semibold"
                  >
                    Fermer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* SÉLECTEUR 1 : VITOLE OFFERTE */}
                  <div className="space-y-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#D9D0C2]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#71513B] block">
                        1. Choisir la Vitole Offerte
                      </label>
                      <button
                        type="button"
                        onClick={() => handleInspect(previewOfferedCigar, "Offre")}
                        className="text-[11px] text-cigar-brass hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Fiche</span>
                      </button>
                    </div>

                    <select
                      value={selectedOfferedCigarId}
                      onChange={(e) => setSelectedOfferedCigarId(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-[#D9D0C2] text-xs font-semibold text-[#241E1A] focus:outline-none focus:border-[#AA8959] shadow-xs"
                    >
                      {availableCigarsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.brand} {c.name} ({c.vitola} · Cepo {c.ringGauge})
                        </option>
                      ))}
                    </select>

                    {/* Aperçu direct de la vitole offerte */}
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#D9D0C2]/70 text-xs">
                      <img
                        src={previewOfferedCigar.defaultImageUrl}
                        alt={previewOfferedCigar.name}
                        className="w-12 h-12 rounded object-cover border border-[#D9D0C2]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-serif font-bold text-xs text-[#241E1A] truncate">
                          {previewOfferedCigar.brand} {previewOfferedCigar.name}
                        </div>
                        <div className="text-[10px] text-[#8D8078]">
                          {previewOfferedCigar.origin} · {previewOfferedCigar.vitola}
                        </div>
                      </div>
                    </div>

                    {/* Quantité offerte avec stepper */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-cigar-ink">Quantité offerte :</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCounterOfferedQty(Math.max(1, counterOfferedQty - 1))}
                          className="w-7 h-7 rounded-lg border border-cigar-stone bg-white flex items-center justify-center text-xs font-bold hover:bg-cigar-ivory"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-serif font-bold text-sm w-6 text-center">{counterOfferedQty}</span>
                        <button
                          type="button"
                          onClick={() => setCounterOfferedQty(counterOfferedQty + 1)}
                          className="w-7 h-7 rounded-lg border border-cigar-stone bg-white flex items-center justify-center text-xs font-bold hover:bg-cigar-ivory"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SÉLECTEUR 2 : VITOLE DEMANDÉE */}
                  <div className="space-y-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#D9D0C2]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#71513B] block">
                        2. Choisir la Vitole Demandée
                      </label>
                      <button
                        type="button"
                        onClick={() => handleInspect(previewDesiredCigar, "Recherche")}
                        className="text-[11px] text-cigar-brass hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Fiche</span>
                      </button>
                    </div>

                    <select
                      value={selectedDesiredCigarId}
                      onChange={(e) => setSelectedDesiredCigarId(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-[#D9D0C2] text-xs font-semibold text-[#241E1A] focus:outline-none focus:border-[#AA8959] shadow-xs"
                    >
                      {availableCigarsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.brand} {c.name} ({c.vitola} · Cepo {c.ringGauge})
                        </option>
                      ))}
                    </select>

                    {/* Aperçu direct de la vitole demandée */}
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#D9D0C2]/70 text-xs">
                      <img
                        src={previewDesiredCigar.defaultImageUrl}
                        alt={previewDesiredCigar.name}
                        className="w-12 h-12 rounded object-cover border border-[#D9D0C2]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-serif font-bold text-xs text-[#241E1A] truncate">
                          {previewDesiredCigar.brand} {previewDesiredCigar.name}
                        </div>
                        <div className="text-[10px] text-[#8D8078]">
                          {previewDesiredCigar.origin} · {previewDesiredCigar.vitola}
                        </div>
                      </div>
                    </div>

                    {/* Quantité demandée avec stepper */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-cigar-ink">Quantité demandée :</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCounterDesiredQty(Math.max(1, counterDesiredQty - 1))}
                          className="w-7 h-7 rounded-lg border border-cigar-stone bg-white flex items-center justify-center text-xs font-bold hover:bg-cigar-ivory"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-serif font-bold text-sm w-6 text-center">{counterDesiredQty}</span>
                        <button
                          type="button"
                          onClick={() => setCounterDesiredQty(counterDesiredQty + 1)}
                          className="w-7 h-7 rounded-lg border border-cigar-stone bg-white flex items-center justify-center text-xs font-bold hover:bg-cigar-ivory"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note d'ajustement */}
                <div>
                  <label className="block text-[#71513B] font-semibold text-xs mb-1">
                    Justification ou proposition pour l'aficionado (optionnel) :
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Je propose d'ajuster sur un cabinet de Fundadores 1998 pour équilibrer la valeur patrimoniale."
                    value={counterNote}
                    onChange={(e) => setCounterNote(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FAF7F2] border border-[#D9D0C2] text-xs text-cigar-ink focus:outline-none focus:border-[#AA8959]"
                  />
                </div>

                {/* Boutons d'action du formulaire */}
                <div className="flex justify-end items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCounterOfferForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#241E1A] hover:bg-[#F4F0E7]"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="btn-primary-gold text-xs py-2.5 px-5 font-semibold flex items-center gap-2 shadow-sm"
                  >
                    {loadingAction ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowLeftRight className="w-4 h-4 text-[#AA8959]" />
                    )}
                    <span>Transmettre la Nouvelle Version V{trade.currentVersion + 1}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Fil de Messages Confidentiels */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#71513B] uppercase tracking-wider pb-1">
                <MessageSquare className="w-4 h-4 text-[#AA8959]" />
                <span>Pourparlers & Messages Confidentiels</span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto p-4 rounded-2xl bg-white border border-[#D9D0C2] shadow-inner">
                {trade.messages.length === 0 ? (
                  <div className="text-center py-6 text-xs text-cigar-ink-muted">
                    Aucun message échangé pour l'instant. Initiez la conversation ci-dessous.
                  </div>
                ) : (
                  trade.messages.map((msg) => {
                    const isMine = msg.senderId === currentUserId;

                    if (msg.isSystemEvent) {
                      return (
                        <div
                          key={msg.id}
                          className="p-2.5 rounded-xl bg-cigar-stone/20 border border-cigar-stone/50 text-[11px] text-cigar-ink-muted text-center font-medium my-2"
                        >
                          {msg.content}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMine
                              ? "bg-[#241E1A] text-[#FAF7F2] rounded-br-none"
                              : "bg-[#F4F0E7] text-[#241E1A] border border-[#D9D0C2] rounded-bl-none"
                          }`}
                        >
                          <div
                            className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                              isMine ? "text-[#AA8959]" : "text-[#71513B]"
                            }`}
                          >
                            {msg.sender.firstName} {msg.sender.lastName}
                          </div>
                          <p>{msg.content}</p>
                        </div>
                        <span className="text-[9px] text-cigar-ink-muted mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Champ de Saisie de Message */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Écrire un message confidentiel dans le salon..."
                  className="flex-grow p-3 rounded-xl bg-white border border-cigar-stone text-xs text-cigar-ink placeholder-cigar-ink-muted focus:outline-none focus:border-cigar-brass shadow-sm"
                />
                <button
                  type="submit"
                  disabled={loadingAction || !messageInput.trim()}
                  className="btn-primary-gold px-4 py-3 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                  aria-label="Envoyer le message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Barre d'Actions Transactionnelles en bas */}
          <div className="p-4 sm:p-5 bg-white border-t border-cigar-stone/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecline}
                disabled={loadingAction || trade.status === "COMPLETED"}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-800 hover:bg-red-50 transition-colors border border-red-800/20"
              >
                Décliner l'échange
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {trade.status !== "MUTUALLY_AGREED" && trade.status !== "COMPLETED" && (
                <>
                  <button
                    onClick={() => setShowCounterOfferForm(!showCounterOfferForm)}
                    disabled={loadingAction}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-cigar-ink border border-cigar-stone hover:border-cigar-brass transition-colors shadow-xs"
                  >
                    {showCounterOfferForm ? "Masquer Ajustements" : "Changer les Vitoles / Contre-Offre"}
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={loadingAction}
                    className="btn-primary-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                  >
                    {loadingAction ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileSignature className="w-4 h-4 text-[#AA8959]" />
                    )}
                    <span>Sceller l'Accord (Signer)</span>
                  </button>
                </>
              )}

              {trade.status === "MUTUALLY_AGREED" && (
                <button
                  onClick={handleFinalize}
                  disabled={loadingAction}
                  className="btn-primary-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#AA8959]" />
                  <span>Confirmer la Remise (Clôturer)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modale d'Inspection Détaillée */}
      <CigarDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        cigar={selectedCigarForDetail}
      />
    </>
  );
};
