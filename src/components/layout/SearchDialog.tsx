"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Layers, BookOpen, ArrowRight, ShieldCheck, Box } from "lucide-react";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

interface SearchItem {
  id: string;
  category: "reference" | "piece" | "article";
  title: string;
  subtitle: string;
  url: string;
  meta?: string;
}

const mockSearchDataset: SearchItem[] = [
  // Références
  {
    id: "cohiba-behike-56",
    category: "reference",
    title: "Cohiba Behike BHK 56",
    subtitle: "Laguito No. 6 · Cepo 56 · Cuba",
    url: "/#catalogue",
    meta: "Édition Historique · 2010",
  },
  {
    id: "trinidad-fundadores",
    category: "reference",
    title: "Trinidad Fundadores",
    subtitle: "Laguito No. 1 · Cepo 40 · Cuba",
    url: "/#catalogue",
    meta: "Millésime Diplomatique · 1998",
  },
  {
    id: "montecristo-no2",
    category: "reference",
    title: "Montecristo No. 2 Reserva",
    subtitle: "Pirámide · Cepo 52 · Cuba",
    url: "/#catalogue",
    meta: "Cosecha 2005",
  },
  {
    id: "partagas-lusitanias",
    category: "reference",
    title: "Partagás Lusitanias Gran Reserva",
    subtitle: "Prominente · Cepo 49 · Cuba",
    url: "/#catalogue",
    meta: "Cosecha 2007",
  },
  {
    id: "davidoff-oroblanco",
    category: "reference",
    title: "Davidoff Oro Blanco",
    subtitle: "Toro · Cepo 54 · République Dominicaine",
    url: "/#catalogue",
    meta: "Millésime 2002",
  },
  // Pièces de collection accessibles
  {
    id: "lot-behike-geneve",
    category: "piece",
    title: "Behike 56 — Coffret BBM MAY 10",
    subtitle: "Alexandre de M. (Genève) · 69.2% HR",
    url: "/trade?target=cohiba-behike-56",
    meta: "Disponible à l'échange",
  },
  {
    id: "lot-trinidad-paris",
    category: "piece",
    title: "Trinidad Fundadores — Boîte CLE DIC 98",
    subtitle: "Jean-Marc L. (Paris) · 68.8% HR",
    url: "/trade?target=trinidad-fundadores",
    meta: "Disponible à l'échange",
  },
  // Articles du Journal
  {
    id: "art-hygrometrie",
    category: "article",
    title: "L'art de l'hygrométrie : pourquoi la règle des 68–70% protège les huiles",
    subtitle: "Guide de conservation et dégustation par Jean-Marc L.",
    url: "/#journal",
    meta: "Conservation",
  },
  {
    id: "art-codes-usine",
    category: "article",
    title: "Décoder les codes usines et millésimes de La Havane",
    subtitle: "Traçabilité des boîtes et identification des manufactures",
    url: "/#journal",
    meta: "Expertise",
  },
];

export const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose, triggerRef }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus automatique à l'ouverture & gestion du clavier
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // Touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtrage avec temporisation
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const filtered = mockSearchDataset.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.subtitle.toLowerCase().includes(trimmed) ||
          (item.meta && item.meta.toLowerCase().includes(trimmed))
      );
      setResults(filtered);
      setSelectedIndex(-1);
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Navigation au clavier dans les résultats
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      const target = results[selectedIndex];
      onClose();
      router.push(target.url);
    }
  };

  if (!isOpen) return null;

  const references = results.filter((r) => r.category === "reference");
  const pieces = results.filter((r) => r.category === "piece");
  const articles = results.filter((r) => r.category === "article");

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-start"
      role="dialog"
      aria-modal="true"
      aria-label="Recherche globale CigarConnect"
    >
      {/* Fond flouté opaque minéral */}
      <div
        className="fixed inset-0 bg-[#211D19]/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panneau de recherche discret déroulé sous le header */}
      <div className="relative z-10 w-full bg-[#F7F5F0] border-b border-[#D9D2C7] shadow-xl pt-3 pb-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Ligne de recherche & bouton Fermer */}
          <div className="flex items-center gap-3 border-b border-[#857A6D]/40 pb-3 pt-2">
            <Search className="w-5 h-5 text-[#645C54] shrink-0" strokeWidth={1.75} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Rechercher une vitole, une bague, un millésime ou un article..."
              className="w-full bg-transparent text-base sm:text-lg text-[#211D19] placeholder-[#857A6D] focus:outline-none"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded text-[#645C54] hover:text-[#211D19]"
                aria-label="Effacer le texte"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs font-semibold text-[#645C54] hover:text-[#211D19] px-2.5 py-1 rounded-md border border-[#D9D2C7] bg-[#FFFFFF] transition-colors"
            >
              Fermer
            </button>
          </div>

          {/* Contenu : Accès rapides à champ vide OU Résultats groupés */}
          <div className="pt-6 max-h-[65vh] overflow-y-auto">
            {!query.trim() ? (
              <div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-[#645C54] font-semibold mb-3">
                  Accès rapides
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Link
                    href="/#catalogue"
                    onClick={onClose}
                    className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#6C4935] transition-all group flex items-start gap-3"
                  >
                    <Layers className="w-4 h-4 text-[#6C4935] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[#211D19] group-hover:text-[#6C4935]">
                        Catalogue des vitoles
                      </div>
                      <div className="text-[11px] text-[#645C54] mt-0.5">
                        Cohiba, Trinidad, Montecristo...
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/humidor"
                    onClick={onClose}
                    className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#6C4935] transition-all group flex items-start gap-3"
                  >
                    <Box className="w-4 h-4 text-[#6C4935] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[#211D19] group-hover:text-[#6C4935]">
                        Mon Humidor
                      </div>
                      <div className="text-[11px] text-[#645C54] mt-0.5">
                        Inventaire privé sous 68–70% HR
                      </div>
                    </div>
                  </Link>

                  <Link
                    href="/trade"
                    onClick={onClose}
                    className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] hover:border-[#6C4935] transition-all group flex items-start gap-3"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#365343] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-[#211D19] group-hover:text-[#6C4935]">
                        Le Cercle d'Échange
                      </div>
                      <div className="text-[11px] text-[#645C54] mt-0.5">
                        Troc pur sans commission
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-[#645C54]">
                <p className="text-sm font-medium">Aucun résultat trouvé pour « {query} »</p>
                <p className="text-xs mt-1 text-[#857A6D]">
                  Vérifiez l'orthographe de la marque (ex. Cohiba, Partagás) ou du millésime.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 1. Références */}
                {references.length > 0 && (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.1em] text-[#645C54] font-semibold mb-2">
                      Références officielles ({references.length})
                    </div>
                    <div className="space-y-1.5">
                      {references.map((item, idx) => (
                        <Link
                          key={item.id}
                          href={item.url}
                          onClick={onClose}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            selectedIndex === idx
                              ? "bg-[#EEEAE3] border-[#6C4935]"
                              : "bg-[#FFFFFF] border-[#D9D2C7] hover:bg-[#EEEAE3]"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#211D19]">{item.title}</div>
                            <div className="text-[11px] text-[#645C54]">{item.subtitle}</div>
                          </div>
                          {item.meta && (
                            <span className="text-[10px] font-medium text-[#6C4935] bg-[#EEEAE3] px-2 py-0.5 rounded">
                              {item.meta}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Pièces disponibles */}
                {pieces.length > 0 && (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.1em] text-[#645C54] font-semibold mb-2">
                      Pièces de collectionneurs ({pieces.length})
                    </div>
                    <div className="space-y-1.5">
                      {pieces.map((item, idx) => {
                        const globalIdx = references.length + idx;
                        return (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={onClose}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              selectedIndex === globalIdx
                                ? "bg-[#EEEAE3] border-[#6C4935]"
                                : "bg-[#FFFFFF] border-[#D9D2C7] hover:bg-[#EEEAE3]"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold text-[#211D19]">{item.title}</div>
                              <div className="text-[11px] text-[#645C54]">{item.subtitle}</div>
                            </div>
                            <span className="text-[10px] font-semibold text-[#365343] bg-[#365343]/10 px-2 py-0.5 rounded">
                              {item.meta}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Articles */}
                {articles.length > 0 && (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.1em] text-[#645C54] font-semibold mb-2">
                      Articles & Récits ({articles.length})
                    </div>
                    <div className="space-y-1.5">
                      {articles.map((item, idx) => {
                        const globalIdx = references.length + pieces.length + idx;
                        return (
                          <Link
                            key={item.id}
                            href={item.url}
                            onClick={onClose}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                              selectedIndex === globalIdx
                                ? "bg-[#EEEAE3] border-[#6C4935]"
                                : "bg-[#FFFFFF] border-[#D9D2C7] hover:bg-[#EEEAE3]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <BookOpen className="w-3.5 h-3.5 text-[#6C4935] shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-[#211D19]">{item.title}</div>
                                <div className="text-[11px] text-[#645C54]">{item.subtitle}</div>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#645C54]" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
