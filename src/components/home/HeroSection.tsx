"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Box } from "lucide-react";
import { VitoleVedetteSpotlight } from "./VitoleVedetteSpotlight";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#F7F5F0] pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Colonne Gauche : Titre, sous-titre & les 2 actions claires (Section 10 A) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Titre Principal — Vrai texte, pas d'image */}
            <h1 className="font-sans text-5xl sm:text-6xl lg:text-[5rem] xl:text-[5.35rem] font-semibold text-[#211D19] tracking-tight leading-[1.04]">
              Votre collection.
              <br />
              <span className="font-serif italic font-medium text-[#6C4935]">
                Toute une histoire.
              </span>
            </h1>

            {/* Sous-titre officiel */}
            <p className="text-lg sm:text-xl lg:text-[1.3rem] text-[#3D352E] max-w-2xl leading-relaxed font-normal">
              Un espace pour documenter vos pièces et rencontrer ceux qui partagent votre passion.
            </p>

            {/* Deux Actions Distinctes : Action dominante et Découverte */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <a
                href="#catalogue"
                className="btn-ink-primary"
              >
                <span>Explorer les collections</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <Link
                href="/humidor"
                className="btn-secondary-luxury"
              >
                <span>Découvrir l'humidor</span>
              </Link>
            </div>

            {/* 3 repères de déontologie concrets */}
            <div className="pt-4 border-t border-[#D9D2C7]/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#645C54]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365343]" />
                Privé par défaut
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365343]" />
                Normes 68–70% HR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#365343]" />
                Échanges purs de gré à gré
              </span>
            </div>
          </div>

          {/* Colonne Droite : Photographie précise de la pièce mise en scène */}
          <div className="lg:col-span-5">
            <VitoleVedetteSpotlight />
          </div>
        </div>
      </div>
    </section>
  );
};
