"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  User, 
  ShieldCheck, 
  Archive, 
  ArrowLeftRight, 
  LogOut, 
  Sparkles, 
  ChevronRight,
  Eye,
  Check
} from "lucide-react";
import { useAuth, PILOT_USERS } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export const AccountDropdown: React.FC = () => {
  const router = useRouter();
  const { user, logout, switchDemoUser, isVisitorPreviewMode, toggleVisitorPreviewMode } = useAuth();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Permet d'ouvrir dans un nouvel onglet avec Cmd/Ctrl/Shift ou clic molette
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      setIsOpen(false);
      return;
    }
    e.preventDefault();
    setIsOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    router.push(href);
  };

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Fermeture avec Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast(
      "Déconnexion",
      "Vous naviguez maintenant en mode visiteur.",
      "info"
    );
  };

  return (
    <div ref={dropdownRef} className="relative hidden md:block">
      {/* Bouton Pill "Compte AM" */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 p-1 pl-2.5 pr-1.5 rounded-full border border-[#D9D2C7] bg-[#FFFFFF] hover:border-[#6C4935] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#71512D] transition-all shadow-sm group active:scale-[0.98]"
        title="Menu de mon compte & inventaire"
      >
        <span className="text-xs font-medium text-[#211D19] group-hover:text-[#6C4935]">
          Compte
        </span>
        <div className="w-7 h-7 rounded-full bg-[#211D19] text-[#F7F5F0] font-sans text-xs font-semibold flex items-center justify-center transition-transform group-hover:scale-105">
          {user.initials}
        </div>
      </button>

      {/* Menu Déroulant Luxe */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-[#D9D2C7] bg-[#FFFFFF] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
        >
          {/* En-tête profil */}
          <div className="p-3.5 bg-[#F7F5F0] rounded-xl border border-[#D9D2C7]/60 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#211D19] text-[#F7F5F0] font-semibold flex items-center justify-center text-sm shrink-0">
                {user.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#211D19] truncate">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[11px] text-[#645C54] truncate">
                  {user.city}, {user.country}
                </div>
                <div className="text-[10px] text-[#A88958] font-medium tracking-wide mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#365343]" />
                  <span>{user.role === "connoisseur_vip" ? "Connoisseur VIP" : "Membre Vérifié"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Liens de navigation */}
          <div className="space-y-0.5 text-xs text-[#211D19]">
            <Link
              href="/humidor"
              onClick={(e) => handleNavigate(e, "/humidor")}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#EEEAE3] transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-2.5 font-medium">
                <Archive className="w-4 h-4 text-[#6C4935]" />
                <span>Mon Humidor Privé</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#857A6D] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/trade"
              onClick={(e) => handleNavigate(e, "/trade")}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#EEEAE3] transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-2.5 font-medium">
                <ArrowLeftRight className="w-4 h-4 text-[#6C4935]" />
                <span>Mes Salons de Troc (Le Cercle)</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#857A6D] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/salon"
              onClick={(e) => handleNavigate(e, "/salon")}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#EEEAE3] transition-colors group cursor-pointer"
            >
              <span className="flex items-center gap-2.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#365343] inline-block shrink-0" />
                <span>Le Salon (Espace Collectif)</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#857A6D] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Bascule Mode Visiteur */}
            <button
              type="button"
              onClick={() => {
                toggleVisitorPreviewMode();
                setIsOpen(false);
                showToast(
                  isVisitorPreviewMode ? "Mode Propriétaire" : "Mode Visiteur Actif",
                  isVisitorPreviewMode 
                    ? "Toutes vos vitoles et valorisations sont de nouveau visibles."
                    : "Aperçu public : vos pièces privées et valorisations sont masquées.",
                  "info"
                );
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#EEEAE3] transition-colors group text-left"
            >
              <span className="flex items-center gap-2.5 font-medium">
                <Eye className="w-4 h-4 text-[#6C4935]" />
                <span>{isVisitorPreviewMode ? "Désactiver mode visiteur" : "Aperçu profil public"}</span>
              </span>
              {isVisitorPreviewMode && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#365343] text-white">Actif</span>
              )}
            </button>
          </div>

          <div className="my-2 border-t border-[#D9D2C7]/60" />

          {/* Démonstration : Changer d'utilisateur */}
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#857A6D] font-semibold">
            Changer de profil (Démo)
          </div>
          <div className="grid grid-cols-2 gap-1 px-1 mb-2">
            <button
              type="button"
              onClick={() => {
                switchDemoUser("alexandre");
                setIsOpen(false);
                showToast(
                  "Profil activé",
                  "Connecté : Alexandre de M. (Paris)",
                  "success"
                );
              }}
              className={`p-1.5 rounded-lg border text-left text-[11px] transition-all ${
                user.id === PILOT_USERS.alexandre.id
                  ? "border-[#6C4935] bg-[#F7F5F0] font-semibold text-[#211D19]"
                  : "border-[#D9D2C7] bg-[#FFFFFF] text-[#645C54] hover:bg-[#F7F5F0]"
              }`}
            >
              Alexandre (AM)
            </button>
            <button
              type="button"
              onClick={() => {
                switchDemoUser("jeanmarc");
                setIsOpen(false);
                showToast(
                  "Profil activé",
                  "Connecté : Jean-Marc L. (Genève)",
                  "success"
                );
              }}
              className={`p-1.5 rounded-lg border text-left text-[11px] transition-all ${
                user.id === PILOT_USERS.jeanmarc.id
                  ? "border-[#6C4935] bg-[#F7F5F0] font-semibold text-[#211D19]"
                  : "border-[#D9D2C7] bg-[#FFFFFF] text-[#645C54] hover:bg-[#F7F5F0]"
              }`}
            >
              Jean-Marc (JL)
            </button>
          </div>

          <div className="my-1 border-t border-[#D9D2C7]/60" />

          {/* Déconnexion */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#963E38] hover:bg-[#963E38]/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter (Mode visiteur)</span>
          </button>
        </div>
      )}
    </div>
  );
};
