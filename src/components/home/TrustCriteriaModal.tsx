"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Droplets, 
  ShieldCheck, 
  FileText, 
  Lock, 
  ArrowLeftRight, 
  CheckCircle2, 
  Thermometer, 
  Sparkles,
  Info
} from "lucide-react";

interface TrustCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const TrustCriteriaModal: React.FC<TrustCriteriaModalProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const [activeTab, setActiveTab] = useState<"hygro" | "codes" | "cape" | "troc">("hygro");
  const modalRef = useRef<HTMLDivElement>(null);

  // Gestion de la touche Échap et du verrouillage du scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      triggerRef?.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-modal-title"
    >
      {/* Fond obscurci minéral feutré */}
      <div
        className="fixed inset-0 bg-[#1B1916]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Conteneur principal de la modale */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-3xl bg-[#F7F5F0] border border-[#D9D2C7] rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
      >
        {/* En-tête de la modale */}
        <div className="bg-[#211D19] text-[#F7F5F0] p-6 sm:p-7 flex items-start justify-between border-b border-[#857A6D]/30 shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#A88958] font-medium mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A88958]" />
              <span>Protocole Déontologique</span>
            </div>
            <h2 id="trust-modal-title" className="font-serif text-2xl sm:text-3xl font-normal text-[#F7F5F0] leading-tight">
              Nos Critères de Confiance
            </h2>
            <p className="text-xs sm:text-sm text-[#EEEAE3]/80 mt-1 max-w-xl">
              Toute information de confiance sur CigarConnect correspond à un contrôle réel, mesurable et vérifiable.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFFFFF]/10 text-[#F7F5F0] hover:bg-[#FFFFFF]/20 flex items-center justify-center transition-colors shrink-0"
            aria-label="Fermer la modale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre d'onglets interactive */}
        <div className="p-4 sm:px-6 bg-[#EEEAE3] border-b border-[#D9D2C7] flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("hygro")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "hygro"
                ? "bg-[#211D19] text-[#F7F5F0] shadow-sm"
                : "bg-[#FFFFFF] text-[#645C54] hover:text-[#211D19] border border-[#D9D2C7]"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-[#365343]" />
            <span>1. Hygrométrie 68–70% HR</span>
          </button>

          <button
            onClick={() => setActiveTab("codes")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "codes"
                ? "bg-[#211D19] text-[#F7F5F0] shadow-sm"
                : "bg-[#FFFFFF] text-[#645C54] hover:text-[#211D19] border border-[#D9D2C7]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A88958]" />
            <span>2. Codes Usines & Traçabilité</span>
          </button>

          <button
            onClick={() => setActiveTab("cape")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "cape"
                ? "bg-[#211D19] text-[#F7F5F0] shadow-sm"
                : "bg-[#FFFFFF] text-[#645C54] hover:text-[#211D19] border border-[#D9D2C7]"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#6C4935]" />
            <span>3. Examen Macro & Cape</span>
          </button>

          <button
            onClick={() => setActiveTab("troc")}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "troc"
                ? "bg-[#211D19] text-[#F7F5F0] shadow-sm"
                : "bg-[#FFFFFF] text-[#645C54] hover:text-[#211D19] border border-[#D9D2C7]"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#6C4935]" />
            <span>4. Réservation Atomique</span>
          </button>
        </div>

        {/* Corps des contenus interactifs */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* ONGLET 1 : Hygrométrie */}
          {activeTab === "hygro" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#211D19]">
                  <Droplets className="w-4 h-4 text-[#365343]" />
                  <span>La Règle d'Or : 68% à 70% d'Humidité Relative à 18–20°C</span>
                </div>
                <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
                  Le cigare de grand cru est une matière vivante. En deçà de 64% HR, les huiles essentielles s'évaporent irrémédiablement, tarissant la palette aromatique. Au-delà de 72% HR, le risque de moisissure et d'infestation par le lasioderme devient critique.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="font-semibold text-xs text-[#211D19] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#365343]" />
                    <span>Caves en Cèdre d'Espagne</span>
                  </div>
                  <p className="text-xs text-[#645C54] leading-relaxed">
                    Le bois de cèdre régule naturellement l'humidité ambiante, repousse les parasites et enrichit la patine olfactive des vitoles millésimées.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="font-semibold text-xs text-[#211D19] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#365343]" />
                    <span>Transferts Sous Boveda Scellé</span>
                  </div>
                  <p className="text-xs text-[#645C54] leading-relaxed">
                    Tout acheminement ou remise en main propre dans Le Cercle impose un conditionnement étanche sous sachet régulateur Boveda 69% HR.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 2 : Codes Usines */}
          {activeTab === "codes" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#211D19]">
                  <ShieldCheck className="w-4 h-4 text-[#A88958]" />
                  <span>Traçabilité Rigoureuse des Manufactures de La Havane</span>
                </div>
                <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
                  Chaque boîte originale de vitoles cubaines porte à son verso un tampon usine à froid certifiant la manufacture d'origine (ex. El Laguito, Partagás, H. Upmann) et la date exacte de mise en boîte.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#A88958]">1. Code Manufacture</div>
                  <div className="font-mono text-sm font-bold text-[#211D19]">BBM / CLE / LRE</div>
                  <div className="text-[11px] text-[#645C54]">Identifie la fabrique officielle de roulage.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#A88958]">2. Mois de Mise en Boîte</div>
                  <div className="font-mono text-sm font-bold text-[#211D19]">MAY / DIC / NOV</div>
                  <div className="text-[11px] text-[#645C54]">Aperçu chronologique de la récolte.</div>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                  <div className="text-[10px] uppercase font-bold text-[#A88958]">3. Année de Production</div>
                  <div className="font-mono text-sm font-bold text-[#211D19]">10 (2010) / 98 (1998)</div>
                  <div className="text-[11px] text-[#645C54]">Base de calcul de l'âge de maturation.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EEEAE3] border border-[#D9D2C7] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#6C4935] shrink-0 mt-0.5" />
                <p className="text-xs text-[#211D19] leading-relaxed">
                  <strong>Distinction Déclaré vs Vérifié :</strong> CigarConnect signale distinctement les données déclarées par le collectionneur des contrôles physiques de conformité (sceau de garantie UV Habanos, étiquette république).
                </p>
              </div>
            </div>
          )}

          {/* ONGLET 3 : Examen Macro */}
          {activeTab === "cape" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#211D19]">
                  <FileText className="w-4 h-4 text-[#6C4935]" />
                  <span>Véritables Photographies Studio — Zéro Retouche Trompeuse</span>
                </div>
                <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
                  Les pièces proposées dans nos collections sont représentées par des prises de vue studio nettes. Le grain de la cape, les nervures délicates de la feuille, le gaufrage de la bague et la coiffe (pigtail) sont directement examinables sous tous les angles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="font-semibold text-xs text-[#211D19]">Veinage & Graisse de Cape</div>
                  <p className="text-xs text-[#645C54] leading-relaxed">
                    Une cape bien conservée présente une légère souplesse tactile, un toucher soyeux et un éclat satiné témoignant de la richesse en huiles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="font-semibold text-xs text-[#211D19]">Gaufrage Or & Bague d'Origine</div>
                  <p className="text-xs text-[#645C54] leading-relaxed">
                    Les reliefs d'imprimerie, micro-lettrages et dorures à chaud des grandes marques cubaines servent de rempart contre les imitations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET 4 : Bourse de Gré à Gré */}
          {activeTab === "troc" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#211D19]">
                  <ArrowLeftRight className="w-4 h-4 text-[#6C4935]" />
                  <span>Le Cercle : Troc Pur & Réservation Atomique</span>
                </div>
                <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
                  CigarConnect n'est ni un site de e-commerce ni une maison de commission. Les échanges se concluent de gré à gré entre passionnés adultes avertis, sans flux monétaire intermédiaire.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="font-semibold text-xs text-[#211D19] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#365343]" />
                    <span>Zéro Double Engagement</span>
                  </div>
                  <p className="text-xs text-[#645C54] leading-relaxed">
                    Dès qu'un accord mutuel est scellé sur une version de négociation, les unités de cave sont immédiatement réservées au niveau de la base de données.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="font-semibold text-xs text-[#211D19] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#365343]" />
                    <span>Confidentialité Native</span>
                  </div>
                  <p className="text-xs text-[#645C54] leading-relaxed">
                    Vos valorisations et l'essentiel de votre humidor demeurent strictement privés. Vous seul décidez quelles vitoles sont ouvertes à la discussion.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pied de la modale */}
        <div className="p-4 sm:px-8 bg-[#FFFFFF] border-t border-[#D9D2C7] flex items-center justify-between text-xs shrink-0">
          <span className="text-[#857A6D]">
            Charte déontologique CigarConnect · Version 2.0
          </span>
          <button
            onClick={onClose}
            className="btn-ink-primary text-xs py-2 px-5"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
