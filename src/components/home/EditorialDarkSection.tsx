"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { TrustCriteriaModal } from "./TrustCriteriaModal";

export const EditorialDarkSection: React.FC = () => {
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("trust") === "1" || params.get("confiance") === "1") {
        setIsTrustModalOpen(true);
      }
    }
  }, []);

  return (
    <>
      <section className="bg-[#1B1916] text-[#F7F5F0] py-16 sm:py-24 my-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Photographie Macro Haute Résolution (Section 10 D) */}
            <div className="lg:col-span-7">
              <div 
                onClick={() => setIsTrustModalOpen(true)}
                className="relative rounded-2xl overflow-hidden border border-[#857A6D]/30 shadow-2xl bg-[#161311] cursor-pointer group"
                title="Cliquer pour explorer les critères de contrôle et d'authenticité"
              >
                <img
                  src="/assets/cigar-macro-detail.jpg"
                  alt="Macro photographie d'une cape maduro d'exception et de sa bague gaufrée sur cèdre"
                  className="w-full h-[320px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-3 bg-[#1B1916]/85 backdrop-blur-md px-3 py-1 rounded-md text-[10px] uppercase tracking-wider text-[#A88958] font-medium border border-[#857A6D]/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A88958] animate-pulse" />
                  <span>Prise de vue macro réelle · Veinage & Bague d'origine</span>
                </div>
              </div>
            </div>

            {/* Texte Éditorial Ponctuel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#A88958] font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A88958]" />
                <span>Précision documentaire</span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#F7F5F0] tracking-tight leading-[1.15]">
                Le détail mérite
                <br />
                <span className="font-serif italic font-normal text-[#A88958]">
                  votre attention.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#EEEAE3]/80 leading-relaxed font-normal">
                Texture de la cape, état de la bague, patine du cèdre et code usine imprimé à chaud : chaque détail raconte la véritable histoire de votre vitole. Documenter précisément l'hygrométrie et la provenance, c'est honorer le travail des maîtres torcedores et garantir des échanges en toute confiance.
              </p>

              {/* Bouton Interactif ouvrant la Charte de Confiance */}
              <div className="pt-2">
                <button
                  ref={buttonRef}
                  onClick={() => setIsTrustModalOpen(true)}
                  className="btn-night-primary group cursor-pointer"
                  title="Ouvrir les critères de contrôle et la charte de confiance"
                  aria-haspopup="dialog"
                >
                  <span>Comprendre nos critères de confiance</span>
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modale Interactive des Critères de Confiance */}
      <TrustCriteriaModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
        triggerRef={buttonRef}
      />
    </>
  );
};
