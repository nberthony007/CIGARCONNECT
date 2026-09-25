"use client";

import React, { useState } from "react";
import { ShieldCheck, Search } from "lucide-react";

export const AuthenticityChecker: React.FC = () => {
  const [checks, setChecks] = useState([true, true, true, false]);

  const toggleCheck = (index: number) => {
    setChecks((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const count = checks.filter(Boolean).length;
  const percentage = Math.round((count / checks.length) * 100);

  const getStatus = (pct: number) => {
    if (pct === 100) return { label: "Authenticité Certifiée 100%", color: "text-[#35483F]" };
    if (pct >= 75) return { label: "Présomption d'Authenticité Forte", color: "text-[#35483F]" };
    if (pct >= 50) return { label: "Contrôle Complémentaire Requis", color: "text-[#9E5B21]" };
    return { label: "Vigilance : Anomalies Détectées", color: "text-[#8C2B2B]" };
  };

  const status = getStatus(percentage);

  return (
    <div className="bg-[#FFFFFF] border border-[#D9D0C2] rounded-lg p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[#71513B] font-semibold mb-1">
          Protocole de Diagnostic
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#241E1A] mb-2">
          Contrôle de Conformité d'une Vitole Rare
        </h3>
        <p className="text-xs sm:text-sm text-[#5E534D]">
          Cochez les points de contrôle observés sur votre cigare (hologrammes Habanos, micro-inscriptions, triple perilla) pour évaluer l'indice de certitude :
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3.5">
          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#D9D0C2]/70 hover:border-[#AA8959] bg-[#FAF7F2]/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checks[0]}
              onChange={() => toggleCheck(0)}
              className="mt-0.5 accent-[#241E1A] w-4 h-4 rounded"
            />
            <div className="text-xs sm:text-sm">
              <strong className="text-[#241E1A] block font-semibold">
                Bague holographique en relief & micro-motifs
              </strong>
              <span className="text-[11px] sm:text-xs text-[#8D8078] block mt-0.5">
                Les têtes de profil et damiers présentent un relief net sans bavure.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#D9D0C2]/70 hover:border-[#AA8959] bg-[#FAF7F2]/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checks[1]}
              onChange={() => toggleCheck(1)}
              className="mt-0.5 accent-[#241E1A] w-4 h-4 rounded"
            />
            <div className="text-xs sm:text-sm">
              <strong className="text-[#241E1A] block font-semibold">
                Sceau de garantie Habanos sous lampe UV
              </strong>
              <span className="text-[11px] sm:text-xs text-[#8D8078] block mt-0.5">
                Le code-barres réagit sous rayons UV avec les armoiries invisibles à l'œil nu.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#D9D0C2]/70 hover:border-[#AA8959] bg-[#FAF7F2]/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checks[2]}
              onChange={() => toggleCheck(2)}
              className="mt-0.5 accent-[#241E1A] w-4 h-4 rounded"
            />
            <div className="text-xs sm:text-sm">
              <strong className="text-[#241E1A] block font-semibold">
                Cape soyeuse, huileuse & veinage fin
              </strong>
              <span className="text-[11px] sm:text-xs text-[#8D8078] block mt-0.5">
                Feuille de cape sans nervures épaisses et couleur parfaitement homogène.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-lg border border-[#D9D0C2]/70 hover:border-[#AA8959] bg-[#FAF7F2]/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={checks[3]}
              onChange={() => toggleCheck(3)}
              className="mt-0.5 accent-[#241E1A] w-4 h-4 rounded"
            />
            <div className="text-xs sm:text-sm">
              <strong className="text-[#241E1A] block font-semibold">
                Triple calotte (Perilla) parfaitement posée
              </strong>
              <span className="text-[11px] sm:text-xs text-[#8D8078] block mt-0.5">
                La tête est scellée par trois couches de tabac distinctes taillées au millimètre.
              </span>
            </div>
          </label>
        </div>

        {/* Score Card */}
        <div className="lg:col-span-4 bg-[#FAF7F2] border border-[#D9D0C2] rounded-lg p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#AA8959]/15 text-[#AA8959] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" strokeWidth={1.8} />
          </div>
          <div className="font-display text-4xl sm:text-5xl font-bold text-[#71513B] leading-none mb-2">
            {percentage}%
          </div>
          <div className={`text-xs font-semibold uppercase tracking-wider ${status.color}`}>
            {status.label}
          </div>
          <p className="text-[11px] text-[#8D8078] leading-relaxed mt-4 pt-3 border-t border-[#D9D0C2]">
            Sur CigarConnect, chaque échange s'appuie sur le protocole de courtoisie et la vérification visuelle attentive des signes distinctifs.
          </p>
        </div>
      </div>
    </div>
  );
};
