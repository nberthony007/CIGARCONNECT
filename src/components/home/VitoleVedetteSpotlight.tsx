"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Sparkles, 
  Droplets, 
  ShieldCheck, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Eye
} from "lucide-react";
import { WeightlessCard } from "@/components/motion/WeightlessCard";
import { CigarDetailModal, CigarDetailData } from "@/components/catalog/CigarDetailModal";

export interface VedetteVitola {
  id: string;
  brand: string;
  editionLabel: string;
  name: string;
  origin: string;
  vintageYear: string;
  factoryCode: string;
  vitolaModule: string;
  ringGauge: number;
  lengthMm: number;
  specialNote: string;
  humidity: string;
  temperature: string;
  regulationType: string;
  authMethod: string;
  authCondition: string;
  location: string;
  imageUrl: string;
}

const MYTHICAL_VITOLAS: VedetteVitola[] = [
  {
    id: "cohiba-behike-56",
    brand: "Cohiba",
    editionLabel: "Édition Historique",
    name: "Behike BHK 56",
    origin: "Cuba",
    vintageYear: "2010",
    factoryCode: "BBM MAY 10",
    vitolaModule: "Laguito No. 6",
    ringGauge: 56,
    lengthMm: 166,
    specialNote: "Feuille de Medio Tiempo · Premier Millésime",
    humidity: "69.2% HR",
    temperature: "19.4°C",
    regulationType: "Boveda régulée active",
    authMethod: "Sceau Habanos UV",
    authCondition: "Boîte d'origine scellée",
    location: "Genève · Salon Privé",
    imageUrl: "/assets/cigar-behike56.jpg",
  },
  {
    id: "trinidad-fundadores",
    brand: "Trinidad",
    editionLabel: "Millésime Diplomatique",
    name: "Fundadores Millésime 1998",
    origin: "Cuba",
    vintageYear: "1998",
    factoryCode: "CLE DIC 98",
    vitolaModule: "Laguito No. 1",
    ringGauge: 40,
    lengthMm: 192,
    specialNote: "Dotation Diplomatique Exclusive · Cape Claro Dorée",
    humidity: "68.8% HR",
    temperature: "19.1°C",
    regulationType: "Boveda 69 régulée",
    authMethod: "Bague A Pigtail",
    authCondition: "Sceau République d'origine",
    location: "Paris · Réserve Personnelle",
    imageUrl: "/assets/cigar-trinidad.jpg",
  },
  {
    id: "montecristo-no2-reserva",
    brand: "Montecristo",
    editionLabel: "Reserva Cosecha",
    name: "No. 2 Reserva Cosecha 2005",
    origin: "Cuba",
    vintageYear: "2005",
    factoryCode: "OEB NOV 09",
    vitolaModule: "Pirámide",
    ringGauge: 52,
    lengthMm: 156,
    specialNote: "Feuilles vieillies 3 ans minimum · Cape grasse maduro",
    humidity: "69.5% HR",
    temperature: "19.3°C",
    regulationType: "Boveda 72 régulée",
    authMethod: "Double bague Reserva",
    authCondition: "Coffret verni numéroté",
    location: "Londres · Cave St. James",
    imageUrl: "/assets/cigar-montecristo.jpg",
  },
  {
    id: "partagas-lusitanias",
    brand: "Partagás",
    editionLabel: "Gran Reserva Cosecha",
    name: "Lusitanias Gran Reserva 2007",
    origin: "Cuba",
    vintageYear: "2007",
    factoryCode: "TEB SEP 13",
    vitolaModule: "Prominente",
    ringGauge: 49,
    lengthMm: 194,
    specialNote: "Tabacs récoltés en 2007 vieillis 5 ans · Double Couronne",
    humidity: "68.5% HR",
    temperature: "18.9°C",
    regulationType: "Boveda 68 active",
    authMethod: "Bague Gran Reserva Or",
    authCondition: "Coffret laqué 15 unités",
    location: "Milan · Collection Privée",
    imageUrl: "/assets/cigar-partagas.jpg",
  },
  {
    id: "davidoff-oro-blanco",
    brand: "Davidoff",
    editionLabel: "Réserve Spéciale d'Or",
    name: "Oro Blanco Special Reserve 2002",
    origin: "Rép. Dominicaine",
    vintageYear: "2002",
    factoryCode: "DO-OB-2002",
    vitolaModule: "Toro Extra",
    ringGauge: 54,
    lengthMm: 152,
    specialNote: "Tabacs rares vieillis 12 ans · Roulé par le Master Roller",
    humidity: "69.0% HR",
    temperature: "19.2°C",
    regulationType: "Armoire cèdre régulée",
    authMethod: "Bague texturée argentée",
    authCondition: "Coffret individuel cèdre",
    location: "Zurich · Coffre-Fort Privé",
    imageUrl: "/assets/cigar-davidoff.jpg",
  },
];

export const VitoleVedetteSpotlight: React.FC = () => {
  // Sélection aléatoire à chaque chargement / refresh pour ne jamais rester statique
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialisation aléatoire côté client après montage pour éviter les désynchronisations SSR
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MYTHICAL_VITOLAS.length);
    setCurrentIndex(randomIndex);
  }, []);

  const changeVitola = useCallback((nextIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 220);
  }, []);

  const handleNext = useCallback(() => {
    const next = (currentIndex + 1) % MYTHICAL_VITOLAS.length;
    changeVitola(next);
  }, [currentIndex, changeVitola]);

  const handlePrev = useCallback(() => {
    const prev = (currentIndex - 1 + MYTHICAL_VITOLAS.length) % MYTHICAL_VITOLAS.length;
    changeVitola(prev);
  }, [currentIndex, changeVitola]);

  // Rotation automatique feutrée toutes les 9 secondes (mise en pause si survolé ou en pause)
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 9000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, isPaused]);

  const currentVitola = MYTHICAL_VITOLAS[currentIndex];

  return (
    <>
      <WeightlessCard className="cigar-floating rounded-xl shadow-cigar-card">
      <div 
        className="relative rounded-xl overflow-hidden border border-[#D9D0C2] bg-[#FFFFFF] p-2.5 sm:p-3 shadow-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* En-tête de la Vitrine avec Télémétrie en Direct & Navigation de la Réserve */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#D9D0C2]/80 px-1">
          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-[#35483F]/10 text-[#35483F] border border-[#35483F]/25 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35483F] animate-pulse" />
            <span><span className="hidden sm:inline">En Cave · </span>{currentVitola.humidity} Stable</span>
          </div>

          {/* Navigation feutrée entre les 5 pièces mythiques */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-medium text-[#8D8078] hidden xs:inline">
              {currentIndex + 1}/{MYTHICAL_VITOLAS.length}
            </span>
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-0.5 rounded-md border border-[#D9D0C2]">
              <button
                onClick={handlePrev}
                className="w-6 h-6 rounded flex items-center justify-center text-[#5E534D] hover:text-[#241E1A] hover:bg-[#FFFFFF] transition-all cursor-pointer"
                title="Vitole mythique précédente"
                aria-label="Pièce précédente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="w-6 h-6 rounded flex items-center justify-center text-[#5E534D] hover:text-[#241E1A] hover:bg-[#FFFFFF] transition-all cursor-pointer"
                title="Vitole mythique suivante"
                aria-label="Pièce suivante"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#8E6D3B] shrink-0 ml-1">
              <Sparkles className="w-3 h-3 text-[#AA8959]" />
              <span>Pièce Mythique</span>
            </div>
          </div>
        </div>

        {/* Cadre Photographique Muséal Macro avec Clic Interactif & Transition Fluide */}
        <div 
          onClick={() => setIsDetailOpen(true)}
          className="relative h-64 sm:h-72 md:h-[280px] w-full rounded-lg overflow-hidden bg-[#241E1A] group cursor-pointer"
          title="Cliquer pour examiner la fiche complète de cette vitole"
        >
          <img
            src={currentVitola.imageUrl}
            alt={`${currentVitola.brand} ${currentVitola.name} — Millésime ${currentVitola.vintageYear}`}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isTransitioning ? "opacity-30 scale-95" : "opacity-100 scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241E1A]/90 via-[#241E1A]/20 to-black/30 pointer-events-none" />

          {/* Pastille au survol */}
          <div className="absolute bottom-16 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[10px] font-bold text-[#FAF7F2] bg-[#241E1A]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#AA8959]/50 shadow-xs z-10">
            <Eye className="w-3.5 h-3.5 text-[#AA8959]" />
            <span>Examiner la vitole</span>
          </div>

          {/* Badges Flottants Supérieurs */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
            <span className="px-2.5 py-0.5 rounded bg-[#241E1A]/85 backdrop-blur-md text-[#FAF7F2] text-[10px] font-bold tracking-widest uppercase border border-[#FAF7F2]/20 shadow-xs">
              {currentVitola.origin} · {currentVitola.vintageYear}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#AA8959]/90 text-[#FAF7F2] text-[9px] font-bold tracking-wider uppercase shadow-xs">
              Code {currentVitola.factoryCode}
            </span>
          </div>

          {/* Indicateurs de progression discrets en haut à droite */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#241E1A]/60 backdrop-blur-md px-1.5 py-1 rounded-full border border-white/10">
            {MYTHICAL_VITOLAS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => changeVitola(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex 
                    ? "w-4 bg-[#AA8959]" 
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Aller à la vitole ${idx + 1}`}
              />
            ))}
          </div>

          {/* Cartouche d'Identification en Bas d'Image */}
          <div className={`absolute bottom-3 left-3 right-3 text-[#FAF7F2] transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}>
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#AA8959]">
              {currentVitola.brand} · {currentVitola.editionLabel}
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-normal tracking-wide text-[#FFFFFF] drop-shadow-sm truncate">
              {currentVitola.name}
            </h3>
            <div className="text-[11px] text-[#FAF7F2]/80 font-light mt-0.5 truncate">
              {currentVitola.vitolaModule} · Cepo {currentVitola.ringGauge} · {currentVitola.lengthMm} mm · {currentVitola.specialNote}
            </div>
          </div>
        </div>

        {/* Fiche de Télémétrie & Traçabilité */}
        <div className={`mt-3 pt-3 border-t border-[#D9D0C2]/80 space-y-2.5 px-1 transition-opacity duration-300 ${
          isTransitioning ? "opacity-40" : "opacity-100"
        }`}>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2 rounded bg-[#FAF7F2] border border-[#D9D0C2]/70">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#71513B] font-semibold">
                <Droplets className="w-3 h-3 text-[#35483F]" />
                <span>Hygrométrie Cave</span>
              </div>
              <div className="font-serif text-xs font-bold text-[#241E1A] mt-0.5">
                {currentVitola.humidity} <span className="text-[10px] font-sans font-normal text-[#8D8078]">· {currentVitola.temperature}</span>
              </div>
              <div className="text-[9px] text-[#5E534D] truncate">{currentVitola.regulationType}</div>
            </div>

            <div className="p-2 rounded bg-[#FAF7F2] border border-[#D9D0C2]/70">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#71513B] font-semibold">
                <ShieldCheck className="w-3 h-3 text-[#AA8959]" />
                <span>Authenticité</span>
              </div>
              <div className="font-serif text-xs font-bold text-[#241E1A] mt-0.5 truncate">
                {currentVitola.authMethod}
              </div>
              <div className="text-[9px] text-[#5E534D] truncate">{currentVitola.authCondition}</div>
            </div>
          </div>

          {/* Bouton d'Action Directe vers la fiche vitole */}
          <div className="pt-1 flex items-center justify-between">
            <div className="text-[10px] text-[#8D8078] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AA8959]" />
              <span className="truncate">{currentVitola.location}</span>
            </div>
            <button
              onClick={() => setIsDetailOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E6D3B] hover:text-[#71513B] transition-colors group cursor-pointer"
            >
              <span>Inspecter la vitole</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
            </button>
          </div>
        </div>

      </div>
    </WeightlessCard>

    {/* Modale d'Expertise Détaillée */}
    <CigarDetailModal
      isOpen={isDetailOpen}
      onClose={() => setIsDetailOpen(false)}
      cigar={{
        id: currentVitola.id,
        brand: currentVitola.brand,
        name: currentVitola.name,
        origin: currentVitola.origin,
        vitola: currentVitola.vitolaModule,
        ringGauge: currentVitola.ringGauge,
        lengthMm: currentVitola.lengthMm,
        vintageYear: currentVitola.vintageYear,
        rarityLabel: currentVitola.editionLabel,
        defaultImageUrl: currentVitola.imageUrl,
        factoryNotes: currentVitola.specialNote,
        strength: "Moyenne à Forte",
        conditionHr: currentVitola.humidity,
        conditionTemp: currentVitola.temperature,
        packaging: currentVitola.authCondition,
        boxCode: currentVitola.factoryCode,
        boxCodeVerified: true,
        provenanceDeclared: `${currentVitola.location} · Authentifié par ${currentVitola.authMethod}`,
      }}
    />
    </>
  );
};
