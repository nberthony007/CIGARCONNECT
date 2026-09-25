import React from "react";
import Link from "next/link";
import { Box, Layers, ArrowLeftRight, ArrowRight } from "lucide-react";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { WeightlessCard } from "@/components/motion/WeightlessCard";

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      icon: Box,
      title: "Conserver",
      subtitle: "Haute Précision de Cave",
      description:
        "Documentez vos vitoles, modules, millésimes et conditions de conservation (hygrométrie 68–70% HR). Gardez le contrôle total sur votre inventaire privé.",
      badge: "Norme 68–70% HR",
      linkText: "Ouvrir mon humidor →",
      href: "/humidor",
    },
    {
      icon: Layers,
      title: "Découvrir",
      subtitle: "Patrimoine & Raretés",
      description:
        "Explorez des pièces d'exception, vitoles historiques et éditions limitées conservées avec rigueur par d'autres collectionneurs passionnés.",
      badge: "Photographies Réelles",
      linkText: "Explorer les collections →",
      href: "#catalogue",
    },
    {
      icon: ArrowLeftRight,
      title: "Rencontrer",
      subtitle: "Salon d'Échange de Gré à Gré",
      description:
        "Proposez des échanges de pair-à-pair dans le respect des règles et de l'art de vivre. Négociation directe entre collectionneurs sans intermédiaire financier.",
      badge: "Zéro Commission",
      linkText: "Accéder au Cercle →",
      href: "/trade",
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#F4F0E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grille des 3 Piliers avec cartes blanches minérales */}
        <MotionReveal className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" stagger={0.1}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <WeightlessCard key={pillar.title} className="rounded-xl h-full">
                <Link
                  href={pillar.href}
                  className="cigar-card-surface rounded-xl p-6 sm:p-7 flex flex-col justify-between h-full group text-left block"
                >
                  <div>
                    {/* Cadre d'icône minimaliste */}
                    <div className="w-11 h-11 rounded-lg bg-[#71513B]/[0.08] border border-[#AA8959]/30 flex items-center justify-center text-[#71513B] mb-5 shadow-sm group-hover:bg-[#241E1A] group-hover:text-[#FAF7F2] group-hover:border-[#241E1A] transition-all">
                      <Icon className="w-5 h-5" strokeWidth={1.6} />
                    </div>

                    {/* Titre */}
                    <h3 className="font-serif text-2xl font-normal text-[#241E1A] mb-1">
                      {pillar.title}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#AA8959] uppercase tracking-wider mb-3">
                      {pillar.subtitle}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-[#5E534D] leading-relaxed font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Lien d'accès */}
                  <div className="mt-6 pt-4 border-t border-[#D9D0C2] flex items-center justify-between text-xs font-semibold text-[#71513B] group-hover:text-[#241E1A] transition-colors">
                    <span>{pillar.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </WeightlessCard>
            );
          })}
        </MotionReveal>
      </div>
    </section>
  );
};
