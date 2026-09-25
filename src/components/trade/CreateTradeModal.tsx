"use client";

import React, { useState } from "react";
import { 
  X, 
  ArrowLeftRight, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Loader2,
  Box 
} from "lucide-react";
import { createTradeProposal } from "@/lib/actions/trade";
import { HumidorLotWithCigar } from "@/lib/actions/humidor";

interface CreateTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  userLots: HumidorLotWithCigar[];
  universalCigars: Array<{
    id: string;
    brand: string;
    name: string;
    origin: string;
    vitola: string;
    ringGauge: number;
    defaultImageUrl: string;
  }>;
  partnerUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    city: string;
  }>;
  initialDesiredCigarId?: string;
  onTradeCreated?: () => void;
}

export const CreateTradeModal: React.FC<CreateTradeModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  userLots,
  universalCigars,
  partnerUsers,
  initialDesiredCigarId,
  onTradeCreated,
}) => {
  // Vitoles disponibles à l'échange dans la cave de l'utilisateur
  const availableLots = userLots.filter(
    (l) => l.isTradeable && l.quantity - l.reservedQuantity > 0
  );

  const [selectedLotId, setSelectedLotId] = useState<string>(
    availableLots[0]?.id || ""
  );
  const [offeredQty, setOfferedQty] = useState<number>(1);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    partnerUsers[0]?.id || ""
  );
  const [desiredCigarId, setDesiredCigarId] = useState<string>(
    initialDesiredCigarId || universalCigars[1]?.id || universalCigars[0]?.id || ""
  );
  const [desiredQty, setDesiredQty] = useState<number>(1);
  const [locationType, setLocationType] = useState<string>(
    "Remise en main propre en salon privé convenu (Paris/Genève)"
  );
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedLot = availableLots.find((l) => l.id === selectedLotId);
  const selectedDesiredCigar = universalCigars.find((c) => c.id === desiredCigarId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) {
      setErrorMsg("Veuillez sélectionner une vitole de votre cave à proposer.");
      return;
    }
    if (!desiredCigarId) {
      setErrorMsg("Veuillez sélectionner la vitole recherchée.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await createTradeProposal({
      proposerId: currentUserId,
      recipientId: selectedPartnerId,
      offeredCigarId: selectedLot.cigarReferenceId || selectedLot.id,
      offeredQuantity: Number(offeredQty) || 1,
      desiredCigarId,
      desiredQuantity: Number(desiredQty) || 1,
      exchangeLocationType: locationType,
      initialMessage: message.trim() || undefined,
    });

    setLoading(false);

    if (res.success) {
      if (onTradeCreated) onTradeCreated();
      onClose();
    } else {
      setErrorMsg(res.error || "Erreur lors de la création de l'échange.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Fond obscurci */}
      <div
        className="fixed inset-0 bg-cigar-ink/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Boîte Modale */}
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-cigar-stone rounded-3xl shadow-2xl overflow-hidden z-10 my-6">
        {/* En-tête */}
        <div className="bg-cigar-cedar-dark text-[#FAF7F2] p-5 sm:p-6 flex items-center justify-between border-b border-cigar-stone/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cigar-cedar flex items-center justify-center text-cigar-brass-light border border-cigar-brass/40 shadow-inner">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-wide">
                Initier une Proposition d'Échange
              </h3>
              <p className="text-xs text-cigar-ivory/70 font-light">
                Le Cercle · Échange d'égal à égal sans intermédiaire financier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-cigar-stone/40 flex items-center justify-center text-cigar-ivory/80 hover:text-white hover:bg-cigar-cedar transition-colors"
            aria-label="Fermer la boîte"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20 text-xs text-red-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Interlocuteur Aficionado */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-cigar-ink">
              Destinataire de la Proposition
            </label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-white border border-cigar-stone text-xs text-cigar-ink font-semibold focus:outline-none focus:border-cigar-brass shadow-sm"
            >
              {partnerUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.city})
                </option>
              ))}
            </select>
          </div>

          {/* 1. Pièce Offerte (Issue de la cave) */}
          <div className="p-4 rounded-2xl bg-white border border-cigar-stone/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cigar-cedar flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5" />
                <span>Vitole Offerte de Votre Cave</span>
              </label>
              <span className="text-[11px] text-cigar-pine font-medium">
                {availableLots.length} référence(s) disponible(s)
              </span>
            </div>

            {availableLots.length === 0 ? (
              <div className="p-3 bg-cigar-ivory rounded-lg text-xs text-cigar-ink-muted">
                Aucune vitole marquée "Disponible pour échange" avec stock libre dans votre cave. Veuillez activer l'échangeabilité d'un lot dans votre Humidor.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <select
                    value={selectedLotId}
                    onChange={(e) => setSelectedLotId(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-cigar-ivory border border-cigar-stone text-xs text-cigar-ink font-medium focus:outline-none focus:border-cigar-brass"
                  >
                    {availableLots.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.cigarReference
                          ? `${l.cigarReference.brand} ${l.cigarReference.name}`
                          : `${l.customBrand || "Pièce"} ${l.customName || "personnelle"}`} (Dispo : {l.quantity - l.reservedQuantity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    max={selectedLot ? selectedLot.quantity - selectedLot.reservedQuantity : 1}
                    value={offeredQty}
                    onChange={(e) => setOfferedQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 rounded-lg bg-cigar-ivory border border-cigar-stone text-xs font-bold text-center text-cigar-ink"
                    placeholder="Qté"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Pièce Recherchée */}
          <div className="p-4 rounded-2xl bg-white border border-cigar-stone/80 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-cigar-cedar flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cigar-brass" />
              <span>Vitole Demandée en Échange</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-3">
                <select
                  value={desiredCigarId}
                  onChange={(e) => setDesiredCigarId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-cigar-ivory border border-cigar-stone text-xs text-cigar-ink font-medium focus:outline-none focus:border-cigar-brass"
                >
                  {universalCigars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.brand} {c.name} ({c.origin} · {c.vitola})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={desiredQty}
                  onChange={(e) => setDesiredQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-lg bg-cigar-ivory border border-cigar-stone text-xs font-bold text-center text-cigar-ink"
                  placeholder="Qté"
                />
              </div>
            </div>
          </div>

          {/* Modalité de Remise */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-cigar-ink flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cigar-cedar" />
              <span>Modalité de Rencontre ou Expédition Convenue</span>
            </label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-white border border-cigar-stone text-xs text-cigar-ink focus:outline-none focus:border-cigar-brass shadow-sm"
            >
              <option value="Remise en main propre en salon privé convenu (Paris/Genève)">
                Remise en main propre en salon privé convenu (Paris/Genève)
              </option>
              <option value="Rencontre en club privé d'aficionados">
                Rencontre en club privé d'aficionados
              </option>
              <option value="Envoi sécurisé sous étui étanche Boveda 69% HR">
                Envoi sécurisé sous étui étanche Boveda 69% HR
              </option>
            </select>
          </div>

          {/* Message d'Introduction */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-cigar-ink">
              Message d'Introduction au Salon Privé
            </label>
            <textarea
              rows={3}
              placeholder="Cher confrère, je vous propose cet échange pour enrichir votre cave..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-white border border-cigar-stone text-xs text-cigar-ink focus:outline-none focus:border-cigar-brass shadow-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-cigar-stone flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-cigar-ink hover:bg-cigar-stone/30"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || availableLots.length === 0}
              className="btn-cigar-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmission...</span>
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Transmettre la Proposition</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
