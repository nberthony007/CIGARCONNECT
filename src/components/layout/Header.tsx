"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  Search, 
  ShieldCheck, 
  User
} from "lucide-react";
import { MobileDrawer } from "./MobileDrawer";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { SearchDialog } from "./SearchDialog";
import { AccountDropdown } from "./AccountDropdown";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { user, openAuthModal } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 w-full site-header">
        {/* Bandeau d'information sobre — Phase Pilote */}
        <div className="bg-[#211D19] text-[#F7F5F0] flex items-center justify-center gap-2 px-3 py-1 text-[11px] font-normal tracking-wide">
          <span className="inline-flex items-center gap-1 font-medium text-[#A88958] shrink-0">
            <ShieldCheck className="w-3 h-3 text-[#A88958]" strokeWidth={2} />
            Phase Pilote
          </span>
          <span className="text-[#857A6D] hidden sm:inline">·</span>
          <span className="text-[#EEEAE3] truncate">
            Where Cigars Connect — Inventaires privés & échanges de gré à gré.
          </span>
        </div>

        {/* Barre de navigation principale — 72px desktop / 60px mobile pour une présence de marque noble */}
        <div className="cigar-glass bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#D9D2C7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* Logo officiel CigarConnect (retour accueil public) — agrandi et parfaitement détouré */}
            <Link 
              href="/" 
              onClick={(e) => {
                if (window.location.hash) {
                  try {
                    history.replaceState(null, "", "/");
                  } catch {}
                }
                const resetScroll = () => {
                  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                };
                if (pathname === "/") {
                  e.preventDefault();
                }
                resetScroll();
                requestAnimationFrame(resetScroll);
                setTimeout(resetScroll, 20);
                setTimeout(resetScroll, 80);
                setTimeout(resetScroll, 250);
              }}
              className="brand-logo flex items-center shrink-0 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#71512D] rounded-md transition-transform active:scale-[0.99]" 
              title="CigarConnect — Retour au commencement"
            >
              <img
                src="/assets/logo-header-trimmed.png"
                alt="CIGARCONNECT — Cigar Social Networking"
                style={{ height: "48px", maxHeight: "48px", width: "auto" }}
                className="h-10 sm:h-12 md:h-13 w-auto object-contain transition-opacity hover:opacity-90"
              />
            </Link>

            {/* Les Destinations Minimalistes & Épurées */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
              <Link
                href="/#catalogue"
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  pathname === "/" ? "text-[#211D19] font-semibold bg-[#EEEAE3]/60" : "text-[#645C54] hover:text-[#211D19]"
                }`}
              >
                Collections
              </Link>
              <Link
                href="/humidor"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  pathname === "/humidor" ? "text-[#211D19] font-semibold bg-[#EEEAE3]/60" : "text-[#645C54] hover:text-[#211D19]"
                }`}
              >
                Humidor
              </Link>
              <Link
                href="/trade"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  pathname === "/trade" ? "text-[#211D19] font-semibold bg-[#EEEAE3]/60" : "text-[#645C54] hover:text-[#211D19]"
                }`}
              >
                Le Cercle
              </Link>
              <Link
                href="/salon"
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  pathname === "/salon" || pathname === "/app/salon" ? "text-[#211D19] font-semibold bg-[#EEEAE3]/60" : "text-[#645C54] hover:text-[#211D19]"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#365343] inline-block shrink-0" />
                <span>Le Salon</span>
              </Link>
              <Link
                href="/journal"
                onClick={() => {
                  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                }}
                className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  pathname === "/journal" ? "text-[#211D19] font-semibold bg-[#EEEAE3]/60" : "text-[#645C54] hover:text-[#211D19]"
                }`}
              >
                Journal
              </Link>
            </nav>

            {/* Actions à droite : Recherche & Compte */}
            <div className="header-actions flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Bouton Recherche Globale (Déclencheur SearchDialog Apple-like) */}
              <button
                ref={searchTriggerRef}
                onClick={() => setSearchDialogOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-[#645C54] hover:text-[#211D19] hover:bg-[#EEEAE3] transition-colors border border-transparent hover:border-[#D9D2C7]"
                aria-label="Rechercher dans CigarConnect"
                title="Rechercher une pièce, référence ou article (Échap pour fermer)"
              >
                <Search className="w-4 h-4 text-[#211D19]" strokeWidth={1.8} />
                <span className="hidden sm:inline">Recherche</span>
              </button>

              {/* Cloche de notifications interactive */}
              <NotificationsDropdown />

              {/* Accès Compte aficionado ou boutons Inscription / Connexion */}
              {user ? (
                <AccountDropdown />
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAuthModal("login")}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-[#645C54] hover:text-[#211D19] hover:bg-[#EEEAE3] transition-colors"
                  >
                    Connexion
                  </button>
                  <button
                    type="button"
                    onClick={() => openAuthModal("signup")}
                    className="btn-ink-primary text-xs px-3.5 py-1.5 shadow-sm"
                  >
                    Créer un compte
                  </button>
                </div>
              )}

              {/* Bouton Menu Téléphone */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden w-9 h-9 rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] flex items-center justify-center text-[#211D19] hover:border-[#6C4935] transition-colors"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dialogue de Recherche Globale */}
      <SearchDialog
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        triggerRef={searchTriggerRef}
      />

      {/* Panneau Mobile Plein Écran */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onOpenSearch={() => {
          setMobileDrawerOpen(false);
          setSearchDialogOpen(true);
        }}
      />
    </>
  );
};
