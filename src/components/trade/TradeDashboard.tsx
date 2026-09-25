"use client";

import React, { useState } from "react";
import { 
  ArrowLeftRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Filter,
  Layers,
  Sparkles 
} from "lucide-react";
import { TradeWithDetails } from "@/lib/actions/trade";
import { HumidorLotWithCigar } from "@/lib/actions/humidor";
import { TradeDiptychCard } from "./TradeDiptychCard";
import { TradeNegotiationRoom } from "./TradeNegotiationRoom";
import { CreateTradeModal } from "./CreateTradeModal";
import { useRouter } from "next/navigation";
import { MotionReveal } from "@/components/motion/MotionReveal";

interface TradeDashboardProps {
  initialTrades: TradeWithDetails[];
  currentUserId: string;
  userName: string;
  userLots: HumidorLotWithCigar[];
  universalCigars: any[];
  cigarsMap: Record<string, any>;
  partnerUsers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    city: string;
  }>;
  initialTargetId?: string;
  initialOpenTrade?: boolean;
  initialCounterMode?: boolean;
}

export const TradeDashboard: React.FC<TradeDashboardProps> = ({
  initialTrades,
  currentUserId,
  userName,
  userLots,
  universalCigars,
  cigarsMap,
  partnerUsers,
  initialTargetId,
  initialOpenTrade,
  initialCounterMode,
}) => {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("ALL");
  const [selectedTrade, setSelectedTrade] = useState<TradeWithDetails | null>(null);
  const [isNegotiationOpen, setIsNegotiationOpen] = useState<boolean>(false);
  const [initialOpenCounterOffer, setInitialOpenCounterOffer] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Statistiques
  const negotiatingCount = initialTrades.filter(
    (t) => t.status === "SUBMITTED" || t.status === "NEGOTIATING"
  ).length;
  const agreedCount = initialTrades.filter((t) => t.status === "MUTUALLY_AGREED").length;
  const completedCount = initialTrades.filter((t) => t.status === "COMPLETED").length;

  // Prise en charge des paramètres d'initialisation
  React.useEffect(() => {
    if (initialTargetId) {
      setIsCreateModalOpen(true);
    }
    if (initialOpenTrade && initialTrades.length > 0) {
      setSelectedTrade(initialTrades[0]);
      setInitialOpenCounterOffer(initialCounterMode || false);
      setIsNegotiationOpen(true);
    }
  }, [initialTargetId, initialOpenTrade, initialCounterMode, initialTrades]);

  // Filtrage
  const filteredTrades = initialTrades.filter((t) => {
    if (filter === "ALL") return true;
    if (filter === "NEGOTIATING") return t.status === "SUBMITTED" || t.status === "NEGOTIATING";
    if (filter === "MUTUALLY_AGREED") return t.status === "MUTUALLY_AGREED";
    if (filter === "COMPLETED") return t.status === "COMPLETED";
    return true;
  });

  const handleOpenNegotiation = (trade: TradeWithDetails, openCounterOffer: boolean = false) => {
    setSelectedTrade(trade);
    setInitialOpenCounterOffer(openCounterOffer);
    setIsNegotiationOpen(true);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* En-tête du Cercle & Indicateurs Transactionnels */}
      <div className="bg-cigar-ivory-light border border-cigar-stone rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-cigar-stone/80">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cigar-cedar font-bold mb-1">
              <ArrowLeftRight className="w-4 h-4 text-cigar-brass" />
              <span>Bourse de Gré à Gré · Le Cercle</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-cigar-ink">
              Salon d'Échange de Gré à Gré & Négociations
            </h1>
            <p className="text-xs sm:text-sm text-cigar-ink-muted mt-1 max-w-xl">
              Échangez vos pièces de collection entre gentlemen sans intermédiaire financier. Réservation atomique des stocks sous régulation d'hygrométrie 68–70% HR.
            </p>
          </div>

          {/* Bouton Initier un Échange */}
          <div className="shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary-gold text-xs font-semibold"
            >
              <Plus className="w-4 h-4" strokeWidth={1.8} />
              <span>Initier un Échange</span>
            </button>
          </div>
        </div>

        {/* Jauges d'Échange du Cercle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-cigar-ivory border border-cigar-stone/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-cigar-cedar text-xs font-bold mb-1">
              <Clock className="w-4 h-4 text-cigar-brass" />
              <span>Négociations Actives</span>
            </div>
            <div className="text-2xl font-bold text-cigar-cedar font-serif">
              {negotiatingCount}
            </div>
            <div className="text-[10px] text-cigar-ink-muted uppercase tracking-wider mt-0.5">
              Discussions en Salon Privé
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cigar-ivory border border-cigar-stone/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-cigar-pine text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-cigar-pine" />
              <span>Accords Scellés</span>
            </div>
            <div className="text-2xl font-bold text-cigar-pine font-serif">
              {agreedCount}
            </div>
            <div className="text-[10px] text-cigar-ink-muted uppercase tracking-wider mt-0.5">
              Réservation Atomique Active
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cigar-ivory border border-cigar-stone/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-cigar-ink text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-cigar-brass" />
              <span>Échanges Clôturés</span>
            </div>
            <div className="text-2xl font-bold text-cigar-ink font-serif">
              {completedCount}
            </div>
            <div className="text-[10px] text-cigar-ink-muted uppercase tracking-wider mt-0.5">
              Transferts Validés
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'Onglets de Filtrage */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            filter === "ALL"
              ? "bg-cigar-cedar text-[#FAF7F2] shadow-sm"
              : "bg-cigar-ivory-light text-cigar-ink-muted border border-cigar-stone hover:border-cigar-brass hover:text-cigar-ink"
          }`}
        >
          Tous les Échanges ({initialTrades.length})
        </button>

        <button
          onClick={() => setFilter("NEGOTIATING")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            filter === "NEGOTIATING"
              ? "bg-cigar-cedar text-[#FAF7F2] shadow-sm"
              : "bg-cigar-ivory-light text-cigar-ink-muted border border-cigar-stone hover:border-cigar-brass hover:text-cigar-ink"
          }`}
        >
          En Négociation ({negotiatingCount})
        </button>

        <button
          onClick={() => setFilter("MUTUALLY_AGREED")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            filter === "MUTUALLY_AGREED"
              ? "bg-cigar-cedar text-[#FAF7F2] shadow-sm"
              : "bg-cigar-ivory-light text-cigar-ink-muted border border-cigar-stone hover:border-cigar-brass hover:text-cigar-ink"
          }`}
        >
          Accords Scellés ({agreedCount})
        </button>

        <button
          onClick={() => setFilter("COMPLETED")}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            filter === "COMPLETED"
              ? "bg-cigar-cedar text-[#FAF7F2] shadow-sm"
              : "bg-cigar-ivory-light text-cigar-ink-muted border border-cigar-stone hover:border-cigar-brass hover:text-cigar-ink"
          }`}
        >
          Historique Clôturé ({completedCount})
        </button>
      </div>

      {/* Liste des Cartes Diptyques avec animation étagée */}
      {filteredTrades.length > 0 ? (
        <MotionReveal key={filter} className="space-y-6" stagger={0.08}>
          {filteredTrades.map((trade) => (
            <TradeDiptychCard
              key={trade.id}
              trade={trade}
              cigarsMap={cigarsMap}
              currentUserId={currentUserId}
              onOpenNegotiation={handleOpenNegotiation}
            />
          ))}
        </MotionReveal>
      ) : (
        <div className="text-center py-20 bg-cigar-ivory-light rounded-3xl border border-cigar-stone p-8">
          <div className="w-16 h-16 rounded-2xl bg-cigar-stone/40 flex items-center justify-center text-cigar-cedar mx-auto mb-4">
            <ArrowLeftRight className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-cigar-ink mb-2">
            Aucun dossier d'échange dans cette catégorie
          </h3>
          <p className="text-xs text-cigar-ink-muted max-w-md mx-auto leading-relaxed mb-6">
            Déposez une proposition d'échange de gré à gré auprès d'un confrère aficionado pour lancer les pourparlers dans Le Cercle.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-cigar-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Proposer un Échange</span>
          </button>
        </div>
      )}

      {/* Salon de Négociation Privé (Modale) */}
      <TradeNegotiationRoom
        isOpen={isNegotiationOpen}
        onClose={() => setIsNegotiationOpen(false)}
        trade={selectedTrade}
        currentUserId={currentUserId}
        cigarsMap={cigarsMap}
        universalCigars={universalCigars}
        userLots={userLots}
        initialShowCounterOffer={initialOpenCounterOffer}
        onTradeUpdated={handleRefresh}
      />

      {/* Modale de Création d'Échange */}
      <CreateTradeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUserId={currentUserId}
        userLots={userLots}
        universalCigars={universalCigars}
        partnerUsers={partnerUsers}
        initialDesiredCigarId={initialTargetId}
        onTradeCreated={handleRefresh}
      />
    </div>
  );
};
