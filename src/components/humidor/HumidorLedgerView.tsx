"use client";

import React, { useState } from "react";
import { 
  Droplets, 
  Thermometer, 
  Lock, 
  ArrowLeftRight, 
  Flame, 
  Trash2, 
  ShieldCheck,
  Eye
} from "lucide-react";
import Link from "next/link";
import { HumidorLotWithCigar, consumeLotStick, toggleLotTradeable, deleteHumidorLot } from "@/lib/actions/humidor";

interface HumidorLedgerViewProps {
  lots: HumidorLotWithCigar[];
  isVisitorMode: boolean;
  onLotUpdated?: () => void;
}

export const HumidorLedgerView: React.FC<HumidorLedgerViewProps> = ({
  lots,
  isVisitorMode,
  onLotUpdated,
}) => {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const displayedLots = isVisitorMode ? lots.filter((l) => l.isTradeable) : lots;

  const handleConsume = async (lotId: string, name: string) => {
    if (!confirm(`Déguster une vitole "${name}" (-1 unité) ?`)) return;
    setActionLoadingId(lotId);
    await consumeLotStick(lotId);
    setActionLoadingId(null);
    if (onLotUpdated) onLotUpdated();
  };

  const handleToggleTrade = async (lotId: string, currentStatus: boolean) => {
    setActionLoadingId(lotId);
    await toggleLotTradeable(lotId, !currentStatus);
    setActionLoadingId(null);
    if (onLotUpdated) onLotUpdated();
  };

  const handleDelete = async (lotId: string, name: string) => {
    if (!confirm(`Retirer définitivement "${name}" de votre humidor ?`)) return;
    setActionLoadingId(lotId);
    await deleteHumidorLot(lotId);
    setActionLoadingId(null);
    if (onLotUpdated) onLotUpdated();
  };

  if (displayedLots.length === 0) {
    return (
      <div className="text-center py-16 bg-[#FFFFFF] rounded-2xl border border-[#D9D2C7] p-6">
        <p className="font-serif text-lg font-normal text-[#211D19]">
          Aucun enregistrement dans le Grand Livre
        </p>
      </div>
    );
  }

  return (
    <div className="cigar-card-surface rounded-2xl overflow-hidden border border-[#D9D2C7] bg-[#FFFFFF] shadow-sm">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#1B1916] text-[#F7F5F0] border-b border-[#857A6D]/40">
              <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px]">Vitole & Terroir</th>
              <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px]">Conditionnement</th>
              <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px]">Quantité</th>
              <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px]">Visibilité & Échange</th>
              <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px]">Code Usine</th>
              <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px]">Conservation</th>
              {!isVisitorMode && (
                <th className="py-3.5 px-4 font-sans uppercase tracking-wider font-semibold text-[11px] text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9D2C7]/60 bg-[#FFFFFF]">
            {displayedLots.map((lot) => {
              const cigar = lot.cigarReference;
              const brand = cigar?.brand || lot.customBrand || "Marque personnelle";
              const name = cigar?.name || lot.customName || "Pièce non répertoriée";
              const origin = cigar?.origin || lot.customOrigin || "Origine déclarée";
              const vitola = cigar?.vitola || lot.customVitola || "Module libre";
              const imageUrl = lot.customPhotoUrl || cigar?.defaultImageUrl || "/assets/cigar-behike56.jpg";
              const vintageYear = cigar?.vintageYear || lot.acquisitionDate;

              return (
                <tr key={lot.id} className="hover:bg-[#EEEAE3]/40 transition-colors">
                  {/* Vitole & Terroir */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-11 h-11 rounded-lg object-cover border border-[#D9D2C7] shrink-0"
                      />
                      <div>
                        {cigar ? (
                          <Link 
                            href={`/pieces/${cigar.id}`}
                            className="font-serif font-semibold text-[#211D19] text-sm hover:text-[#6C4935] transition-colors"
                          >
                            {brand} {name}
                          </Link>
                        ) : (
                          <span className="font-serif font-semibold text-[#211D19] text-sm">
                            {brand} {name}
                          </span>
                        )}
                        <div className="text-[11px] text-[#645C54]">
                          {origin} · {vitola} {cigar ? `(Cepo ${cigar.ringGauge} · ${cigar.lengthMm} mm)` : ""}
                        </div>
                        {vintageYear && (
                          <span className="inline-block text-[10px] text-[#6C4935] font-medium">
                            Millésime {vintageYear}
                          </span>
                        )}
                        {lot.isCustomPiece && (
                          <span className="inline-block ml-2 text-[9px] uppercase tracking-wider text-[#A88958] font-bold">
                            · Hors Catalogue
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Conditionnement */}
                  <td className="py-3.5 px-4 font-medium text-[#211D19]">
                    {lot.packaging}
                  </td>

                  {/* Quantité (chiffres tabulaires alignés) */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="font-semibold text-[#6C4935] text-sm">
                      {lot.quantity} {lot.quantity > 1 ? "unités" : "unité"}
                    </div>
                    {lot.reservedQuantity > 0 && (
                      <div className="text-[10px] text-[#365343] font-medium">
                        dont {lot.reservedQuantity} réservée(s)
                      </div>
                    )}
                  </td>

                  {/* Visibilité, disponibilité à l’échange et quantité distinctes (Section 13) */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {/* Statut Visibilité : Cadenas + Texte Privé visible */}
                      <div className="flex items-center gap-1 text-[11px] text-[#645C54]">
                        <Lock className="w-3 h-3 text-[#857A6D]" />
                        <span>Fiche privée</span>
                      </div>

                      {/* Disponibilité Échange */}
                      {lot.isTradeable ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#365343]/10 text-[#365343] border border-[#365343]/30">
                          <ArrowLeftRight className="w-3 h-3" />
                          <span>Ouvert à l'échange</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-[#EEEAE3] text-[#645C54] border border-[#D9D2C7]">
                          <span>Garde personnelle</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Code Boîte & Traçabilité */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="font-mono font-semibold text-[#211D19] text-xs">
                      {lot.boxCode || "—"}
                    </div>
                    {lot.boxCode && (
                      <div className="text-[10px] text-[#365343] flex items-center gap-1 font-medium mt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{lot.boxCodeVerified ? "Authentifié" : "Déclaratif"}</span>
                      </div>
                    )}
                  </td>

                  {/* Conservation HR */}
                  <td className="py-3.5 px-4 tabular-nums">
                    <div className="flex items-center gap-1.5 font-semibold text-[#365343]">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{lot.conditionHr}</span>
                    </div>
                    <div className="text-[11px] text-[#645C54] flex items-center gap-1">
                      <Thermometer className="w-3 h-3" />
                      <span>{lot.conditionTemp}</span>
                    </div>
                  </td>

                  {/* Actions Propriétaire avec libellés explicites */}
                  {!isVisitorMode && (
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleConsume(lot.id, `${brand} ${name}`)}
                          disabled={actionLoadingId === lot.id}
                          className="px-2 py-1 rounded text-[11px] font-medium text-[#6C4935] hover:bg-[#EEEAE3] transition-colors"
                          title="Déguster (-1 unité)"
                        >
                          Déguster
                        </button>
                        <button
                          onClick={() => handleToggleTrade(lot.id, lot.isTradeable)}
                          disabled={actionLoadingId === lot.id}
                          className="px-2 py-1 rounded text-[11px] font-medium text-[#211D19] hover:bg-[#EEEAE3] transition-colors"
                          title="Modifier la disponibilité pour échange"
                        >
                          {lot.isTradeable ? "Réserver" : "Échanger"}
                        </button>
                        <button
                          onClick={() => handleDelete(lot.id, `${brand} ${name}`)}
                          disabled={actionLoadingId === lot.id}
                          className="p-1 rounded text-[#857A6D] hover:text-[#963E38] transition-colors"
                          title="Supprimer du grand livre"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
