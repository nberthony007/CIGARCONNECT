"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle2, Send, Building2 } from "lucide-react";
import { submitSponsorshipInquiry } from "@/lib/actions/sponsors";

export const SponsorsForm: React.FC = () => {
  const [organization, setOrganization] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [activityDomain, setActivityDomain] = useState("Manufacture d'accessoires & humidors");
  const [targetTerritories, setTargetTerritories] = useState("France, Suisse, Monaco");
  const [desiredPlacement, setDesiredPlacement] = useState("HOME_BANNER");
  const [desiredPeriod, setDesiredPeriod] = useState("30 jours (Forfait Pilote)");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await submitSponsorshipInquiry({
      organization,
      contactName,
      contactEmail,
      websiteUrl,
      activityDomain,
      targetTerritories,
      desiredPlacement,
      desiredPeriod,
      message,
    });

    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || "Votre demande de partenariat a été enregistrée avec succès.");
      setOrganization("");
      setContactName("");
      setContactEmail("");
      setWebsiteUrl("");
      setMessage("");
    } else {
      setErrorMsg(res.error || "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  if (successMsg) {
    return (
      <div className="p-6 rounded-2xl bg-[#EEEAE3] border border-[#365343]/30 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#365343] text-[#A88958] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-[#211D19]">
            Demande Transmise avec Succès
          </h3>
          <p className="text-xs text-[#645C54] max-w-lg mx-auto leading-relaxed">
            {successMsg}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSuccessMsg(null)}
          className="btn-ink-primary text-xs px-4 py-2"
        >
          Déposer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-900/10 border border-red-800/20 text-red-900 font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Organisation / Marque *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Maison Elie Bleu, S.T. Dupont..."
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Site Internet Officiel *
          </label>
          <input
            type="url"
            required
            placeholder="https://www.exemple.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Nom du Contact Professionnel *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Jean-Baptiste Garnier"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          />
        </div>

        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Adresse Email Professionnelle *
          </label>
          <input
            type="email"
            required
            placeholder="contact@exemple.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Secteur d'Activité *
          </label>
          <select
            value={activityDomain}
            onChange={(e) => setActivityDomain(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          >
            <option value="Manufacture d'accessoires & humidors">Manufacture d'accessoires & humidors</option>
            <option value="Lounge & Salon Privé de Dégustation">Lounge & Salon Privé de Dégustation</option>
            <option value="Événement culturel ou vente aux enchères">Événement culturel ou vente aux enchères</option>
            <option value="Marque / Distributeur agréé">Marque / Distributeur agréé</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Territoires Souhaités *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: France, Suisse, Belgique, Monaco..."
            value={targetTerritories}
            onChange={(e) => setTargetTerritories(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Emplacement Envisagé
          </label>
          <select
            value={desiredPlacement}
            onChange={(e) => setDesiredPlacement(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          >
            <option value="HOME_BANNER">Bandeau Accueil (Ratio 16:9)</option>
            <option value="CATALOG_CARD">Carte Vitrine Catalogue (Ratio 4:5)</option>
            <option value="JOURNAL_BOX">Encadré sous Article Journal</option>
            <option value="CIRCLE_EVENT">Mise en avant Lieu dans Le Cercle</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
            Durée de Campagne Souhaitée
          </label>
          <input
            type="text"
            value={desiredPeriod}
            onChange={(e) => setDesiredPeriod(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
          Message & Objectifs de Diffusion (Facultatif)
        </label>
        <textarea
          rows={3}
          placeholder="Décrivez brièvement votre projet ou les pièces mises en valeur..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
        />
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-[#857A6D]">
          Données strictement confidentielles réservées à l'équipe CigarConnect.
        </span>
        <button
          type="submit"
          disabled={loading}
          className="btn-ink-primary text-xs px-6 py-2.5 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-[#A88958]" />
          )}
          <span>Transmettre la demande</span>
        </button>
      </div>
    </form>
  );
};
