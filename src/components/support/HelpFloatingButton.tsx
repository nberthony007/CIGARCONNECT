"use client";

import React, { useState, useEffect } from "react";
import { 
  HelpCircle, 
  X, 
  BookOpen, 
  ArrowLeftRight, 
  ShieldAlert, 
  Wrench, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  LifeBuoy
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export const HelpFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  // Verrouillage du scroll en arrière-plan sur mobile uniquement
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fermeture automatique lors d'un changement de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Écoute de l'événement global pour ouvrir le panneau avec contexte
  useEffect(() => {
    const handleOpenQuickHelp = (e: CustomEvent) => {
      setIsOpen(true);
    };
    window.addEventListener("cigarconnect:open-help" as any, handleOpenQuickHelp);
    return () => {
      window.removeEventListener("cigarconnect:open-help" as any, handleOpenQuickHelp);
    };
  }, []);

  return (
    <>
      {/* ====================================================================
          BOUTON PRINCIPAL D'ACCÈS FLOTTANT (Bas-droite desktop, adapté mobile)
          ==================================================================== */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-3 min-h-[44px] min-w-[44px] rounded-full bg-[#241E1A] text-[#F4F0E7] border border-[#D9D2C7]/30 shadow-xl hover:bg-[#352B24] hover:border-[#AA8959] active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#AA8959] focus:ring-offset-2"
          aria-label="Ouvrir le centre d'aide et d'assistance"
          aria-expanded={isOpen}
          title="Aide & assistance CigarConnect"
        >
          <HelpCircle className="w-5 h-5 text-[#AA8959] shrink-0" strokeWidth={2} />
          <span className="text-xs sm:text-sm font-medium tracking-wide">Aide & assistance</span>
        </button>
      </div>

      {/* ====================================================================
          PANNEAU D'ACCUEIL D'ASSISTANCE (Drawer 440px desktop, plein écran mobile)
          ==================================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop estompé */}
          <div 
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
            aria-hidden="true"
          />

          {/* Tiroir d'assistance */}
          <div 
            className="relative w-full md:w-[440px] h-full bg-[#F4F0E7] text-[#241E1A] flex flex-col shadow-2xl border-l border-[#D9D0C2] overflow-y-auto animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Centre d'aide et d'assistance CigarConnect"
          >
            {/* En-tête du panneau */}
            <div className="p-6 border-b border-[#D9D0C2] bg-[#FAF8F5] sticky top-0 z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#AA8959]">
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>Support & Médiation</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#241E1A] mt-1">
                  Bonjour, comment pouvons-nous vous aider ?
                </h2>
                <p className="text-xs text-[#71513B] mt-1">
                  Retrouvez une réponse ou contactez l'équipe CigarConnect.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-[#D9D0C2] flex items-center justify-center text-[#241E1A] hover:bg-[#D9D0C2]/40 transition-colors shrink-0 ml-3"
                aria-label="Fermer le panneau d'assistance"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corps du panneau : 4 choix structurés */}
            <div className="p-6 flex-1 flex flex-col gap-4">
              <span className="text-xs font-semibold text-[#71513B] uppercase tracking-wider">
                Parcours recommandés
              </span>

              {/* 1. Comprendre CigarConnect */}
              <Link
                href="/aide"
                onClick={() => setIsOpen(false)}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] hover:border-[#AA8959] hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F4F0E7] border border-[#D9D0C2] flex items-center justify-center text-[#71513B] shrink-0 group-hover:bg-[#241E1A] group-hover:text-[#F4F0E7] transition-colors">
                  <BookOpen className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#241E1A] flex items-center justify-between">
                    <span>Comprendre CigarConnect</span>
                    <ChevronRight className="w-4 h-4 text-[#71513B] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-[#71513B] mt-1 line-clamp-2">
                    Guides de conservation, traçabilité, codes de bagues, gestion de l'humidor et règles du Cercle.
                  </p>
                </div>
              </Link>

              {/* 2. Un problème avec un échange */}
              <Link
                href="/app/assistance/nouvelle?cat=TRADE_ISSUE"
                onClick={() => setIsOpen(false)}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] hover:border-[#AA8959] hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F4F0E7] border border-[#D9D0C2] flex items-center justify-center text-[#71513B] shrink-0 group-hover:bg-[#241E1A] group-hover:text-[#F4F0E7] transition-colors">
                  <ArrowLeftRight className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#241E1A] flex items-center justify-between">
                    <span>Un problème avec un échange</span>
                    <ChevronRight className="w-4 h-4 text-[#71513B] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-[#71513B] mt-1 line-clamp-2">
                    Demander une médiation écrite : non-conformité, absence de réponse ou difficulté de réception.
                  </p>
                </div>
              </Link>

              {/* 3. Signaler un comportement */}
              <Link
                href="/app/assistance/nouvelle?cat=REPORT_MEMBER"
                onClick={() => setIsOpen(false)}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] hover:border-[#AA8959] hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F4F0E7] border border-[#D9D0C2] flex items-center justify-center text-[#71513B] shrink-0 group-hover:bg-[#241E1A] group-hover:text-[#F4F0E7] transition-colors">
                  <ShieldAlert className="w-5 h-5 text-[#8A2B2B]" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#241E1A] flex items-center justify-between">
                    <span>Signaler un comportement</span>
                    <ChevronRight className="w-4 h-4 text-[#71513B] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-[#71513B] mt-1 line-clamp-2">
                    Signalement anonyme et confidentiel : propos inappropriés, contrefaçon présumée ou spam.
                  </p>
                </div>
              </Link>

              {/* 4. Un problème technique ou autre */}
              <Link
                href="/app/assistance/nouvelle?cat=TECHNICAL"
                onClick={() => setIsOpen(false)}
                className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] hover:border-[#AA8959] hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F4F0E7] border border-[#D9D0C2] flex items-center justify-center text-[#71513B] shrink-0 group-hover:bg-[#241E1A] group-hover:text-[#F4F0E7] transition-colors">
                  <Wrench className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#241E1A] flex items-center justify-between">
                    <span>Problème technique ou autre question</span>
                    <ChevronRight className="w-4 h-4 text-[#71513B] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-[#71513B] mt-1 line-clamp-2">
                    Accès à votre compte, affichage de l'inventaire ou suggestion d'amélioration.
                  </p>
                </div>
              </Link>

              {/* Notification déontologique */}
              <div className="mt-2 p-3.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0C2] text-[11px] text-[#71513B] leading-relaxed">
                <strong>Principe d'asynchronisme :</strong> Les demandes sont instruites par notre collège de conservateurs. Les échanges sont écrits et documentés pour préserver l'équité entre membres.
              </div>
            </div>

            {/* Pied du panneau : Liens permanents */}
            <div className="p-6 border-t border-[#D9D0C2] bg-[#FAF8F5] flex flex-col gap-2.5 shrink-0">
              <Link
                href="/app/assistance/nouvelle?cat=GENERAL"
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-lg bg-[#241E1A] text-[#F4F0E7] text-xs font-semibold text-center hover:bg-[#352B24] transition-colors shadow-sm"
              >
                Contacter directement l'équipe
              </Link>
              
              <Link
                href="/app/assistance"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-[#241E1A] text-xs font-semibold text-center hover:bg-[#F4F0E7] transition-colors"
              >
                Mes demandes en cours
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
