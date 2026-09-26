"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  X, 
  Search, 
  Layers, 
  Box, 
  ArrowLeftRight, 
  BookOpen, 
  ShieldCheck, 
  User, 
  ChevronRight,
  LogOut,
  UserPlus,
  LogIn
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, onOpenSearch }) => {
  const { user, openAuthModal, logout } = useAuth();
  const pathname = usePathname();
  // Verrouillage du scroll en arrière-plan
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-[#F7F5F0] overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
    >
      {/* Barre d'en-tête mobile (60px) avec logo et bouton Fermer */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#D9D2C7] bg-[#F7F5F0] shrink-0">
        <Link 
          href="/" 
          onClick={(e) => {
            onClose();
            if (window.location.hash) {
              try { history.replaceState(null, "", "/"); } catch {}
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
            setTimeout(resetScroll, 200);
          }} 
          className="block py-1"
        >
          <img
            src="/assets/logo-header-trimmed.png"
            alt="CIGARCONNECT — Cigar Social Networking"
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] flex items-center justify-center text-[#211D19] hover:border-[#6C4935] transition-colors"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Corps du menu avec textes généreux */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Raccourci recherche */}
        <button
          onClick={() => {
            onClose();
            onOpenSearch?.();
          }}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-left text-sm text-[#645C54] hover:border-[#6C4935] transition-colors"
        >
          <Search className="w-4 h-4 text-[#211D19]" />
          <span>Rechercher une pièce ou un article...</span>
        </button>

        {/* Liens de premier niveau amples */}
        <nav className="space-y-1 divide-y divide-[#D9D2C7]/60" aria-label="Menu principal mobile">
          <div className="pb-2">
            <Link
              href="/#catalogue"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#6C4935] transition-colors"
            >
              <span>Collections</span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>

          <div className="py-2">
            <Link
              href="/humidor"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#6C4935] transition-colors"
            >
              <span>Humidor</span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>

          <div className="py-2">
            <Link
              href="/trade"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#6C4935] transition-colors"
            >
              <span>Le Cercle</span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>

          <div className="py-2">
            <Link
              href="/salon"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#6C4935] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#365343] inline-block" />
                <span>Le Salon</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/journal"
              onClick={() => {
                onClose();
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              }}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#6C4935] transition-colors"
            >
              <span>Journal</span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/aide"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#AA8959] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>Centre d'Aide</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>

          <div className="pt-2">
            <Link
              href="/app/assistance"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-lg font-medium text-[#211D19] hover:text-[#AA8959] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>Mes Demandes & Recours</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#857A6D]" />
            </Link>
          </div>
        </nav>

        {/* Espace Membre / Compte */}
        <div className="pt-4 border-t border-[#D9D2C7]">
          {user ? (
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-wider text-[#645C54] font-semibold">
                Mon Espace Privé
              </div>
              <Link
                href="/humidor"
                onClick={onClose}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#6C4935] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#211D19] text-[#F7F5F0] font-semibold flex items-center justify-center text-sm shrink-0">
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#211D19] truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-[#645C54] truncate">
                    {user.city}, {user.country} · {user.role === "connoisseur_vip" ? "Connoisseur VIP" : "Membre Vérifié"}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#857A6D]" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#963E38] hover:bg-[#963E38]/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter (Mode visiteur)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-[11px] uppercase tracking-wider text-[#645C54] font-semibold">
                Adhésion au Cercle
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal("signup");
                }}
                className="btn-ink-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Créer un compte aficionado</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal("login");
                }}
                className="btn-secondary-luxury w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Se connecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
