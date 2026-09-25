"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ShieldCheck, Lock } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  // Gestion des accordéons sur mobile
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <footer className="bg-[#1B1916] text-[#F7F5F0] border-t border-[#857A6D]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Signature & Logo CigarConnect en pied de page */}
        <div className="pb-12 mb-12 border-b border-[#857A6D]/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Link 
              href="/" 
              onClick={(e) => {
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
              className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A88958] rounded" 
              title="CigarConnect — Retour au commencement"
            >
              <img
                src="/assets/logo-luxury-dark.png"
                alt="CIGARCONNECT — Cigar Social Networking"
                style={{ height: "48px", maxHeight: "48px", width: "auto" }}
                className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
            </Link>
            <p className="text-xs sm:text-sm text-[#EEEAE3]/70 max-w-lg leading-relaxed">
              Where Cigars Connect — La plateforme de référence pour les inventaires privés de grands crus et les échanges de gré à gré entre collectionneurs d'exception.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-full border border-[#857A6D]/40 bg-[#211D19] text-[#A88958] text-xs font-mono tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#365343] inline-block" />
              <span>Sanctuaire Privé · Phase Pilote</span>
            </div>
          </div>
        </div>

        {/* Les 4 Groupes Autorisés (Section 10 H) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#857A6D]/20">
          {/* Groupe 1 : Découvrir */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("decouvrir")}
              className="w-full flex items-center justify-between text-left font-serif text-sm font-semibold tracking-wider text-[#A88958] md:cursor-default"
            >
              <span>Découvrir</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections["decouvrir"] ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs text-[#EEEAE3]/80 ${
                openSections["decouvrir"] ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link href="/#catalogue" className="hover:text-[#FFFFFF] transition-colors">
                  Grandes Vitoles de Cuba
                </Link>
              </li>
              <li>
                <Link 
                  href="/trade" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Le Cercle & Échanges de Gré à Gré
                </Link>
              </li>
              <li>
                <Link 
                  href="/salon" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#365343] inline-block" />
                  <span>Le Salon (Espace Collectif)</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/journal" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Journal & Récits de Collectionneurs
                </Link>
              </li>
              <li>
                <Link href="/#confiance" className="hover:text-[#FFFFFF] transition-colors">
                  Critères de Contrôle & Authenticité
                </Link>
              </li>
            </ul>
          </div>

          {/* Groupe 2 : Mon Espace */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("espace")}
              className="w-full flex items-center justify-between text-left font-serif text-sm font-semibold tracking-wider text-[#A88958] md:cursor-default"
            >
              <span>Mon Espace</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections["espace"] ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs text-[#EEEAE3]/80 ${
                openSections["espace"] ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <Link 
                  href="/humidor" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Mon Humidor Privé
                </Link>
              </li>
              <li>
                <Link 
                  href="/humidor" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Déposer une vitole en cave
                </Link>
              </li>
              <li>
                <Link 
                  href="/trade" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Mes salons de négociation
                </Link>
              </li>
              <li>
                <Link 
                  href="/humidor" 
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                  className="hover:text-[#FFFFFF] transition-colors"
                >
                  Sauvegarde & Export des données
                </Link>
              </li>
            </ul>
          </div>

          {/* Groupe 3 : Assistance */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("assistance")}
              className="w-full flex items-center justify-between text-left font-serif text-sm font-semibold tracking-wider text-[#A88958] md:cursor-default"
            >
              <span>Assistance</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections["assistance"] ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs text-[#EEEAE3]/80 ${
                openSections["assistance"] ? "block" : "hidden md:block"
              }`}
            >
              <li>
                <a href="#confiance" className="hover:text-[#FFFFFF] transition-colors">
                  Guide des normes 68–70% HR
                </a>
              </li>
              <li>
                <a href="#confiance" className="hover:text-[#FFFFFF] transition-colors">
                  Résolution des conflits d'échange
                </a>
              </li>
              <li>
                <a href="mailto:support@cigarconnect.fr" className="hover:text-[#FFFFFF] transition-colors">
                  Contacter le support privé
                </a>
              </li>
              <li>
                <span className="text-[#857A6D]">Disponibilité : Aficionados certifiés</span>
              </li>
            </ul>
          </div>

          {/* Groupe 4 : Informations & Déontologie */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("infos")}
              className="w-full flex items-center justify-between text-left font-serif text-sm font-semibold tracking-wider text-[#A88958] md:cursor-default"
            >
              <span>Informations</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections["infos"] ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`space-y-2 text-xs text-[#EEEAE3]/70 ${
                openSections["infos"] ? "block" : "hidden md:block"
              }`}
            >
              <p className="leading-relaxed">
                Plateforme de gré à gré réservée aux collectionneurs majeurs. Aucun intermédiaire financier ni commission de vente.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A88958] pt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Confidentialité native par défaut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mentions légales, accessibilité & copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#857A6D] gap-4">
          <div>
            © {new Date().getFullYear()} CigarConnect. Tous droits réservés.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/#confiance" className="hover:text-[#EEEAE3] transition-colors">
              Règles du Cercle
            </Link>
            <Link href="/#confiance" className="hover:text-[#EEEAE3] transition-colors">
              Protection de la vie privée
            </Link>
            <Link 
              href="/sponsors" 
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
              className="hover:text-[#EEEAE3] transition-colors"
            >
              Partenariats & Sponsoring
            </Link>
            <span className="text-[#A88958]">
              Norme d'accessibilité WCAG 2.2 AA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
