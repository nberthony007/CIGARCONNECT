"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  MapPin, 
  Sparkles, 
  Check, 
  ArrowRight,
  UserCheck
} from "lucide-react";
import { useAuth, PILOT_USERS } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    signup, 
    switchDemoUser 
  } = useAuth();

  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  // Form states for Signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("Paris");
  const [country, setCountry] = useState("France");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [affinity, setAffinity] = useState("Habanos Grands Crus & Millésimes");
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [hygroConfirmed, setHygroConfirmed] = useState(true);
  const [barterConfirmed, setBarterConfirmed] = useState(true);

  // Form states for Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Gérer l'appui sur Échap pour fermer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Autofocus au montage
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage(null);
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 50);
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!ageConfirmed || !hygroConfirmed || !barterConfirmed) {
      setErrorMessage("Veuillez accepter l'ensemble des critères d'admissibilité au Cercle.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        firstName,
        lastName,
        email,
        password,
        city,
        country,
        affinity,
      });

      if (res.success) {
        showToast(
          "Bienvenue dans Le Cercle",
          `Votre profil aficionado au nom de ${firstName} ${lastName} a été créé avec succès.`,
          "success"
        );
      } else {
        setErrorMessage(res.error || "Une erreur est survenue lors de l'inscription.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim()) {
      setErrorMessage("Veuillez renseigner votre adresse e-mail.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        showToast(
          "Connexion réussie",
          "Bienvenue sur votre espace privé CigarConnect.",
          "success"
        );
      } else {
        setErrorMessage(res.error || "Identifiants non reconnus.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1916]/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#D9D2C7] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* En-tête sobre avec bascule Onglets */}
        <div className="p-6 pb-4 border-b border-[#D9D2C7] bg-[#F7F5F0]">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#211D19] text-[#A88958] flex items-center justify-center text-xs font-semibold">
                CC
              </span>
              <span className="text-xs uppercase tracking-widest text-[#6C4935] font-semibold">
                Cercle Privé Aficionados
              </span>
            </div>
            <button
              onClick={closeAuthModal}
              className="w-8 h-8 rounded-full border border-[#D9D2C7] bg-[#FFFFFF] hover:border-[#6C4935] flex items-center justify-center text-[#211D19] transition-colors"
              aria-label="Fermer la fenêtre d'authentification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 id="auth-modal-title" className="font-serif text-2xl font-normal text-[#211D19]">
            {authModalTab === "signup" ? "Créer un compte aficionado" : "Accéder à mon espace"}
          </h2>
          <p className="text-xs text-[#645C54] mt-1 leading-relaxed">
            {authModalTab === "signup"
              ? "Rejoignez le sanctuaire privé pour documenter votre humidor et échanger de gré à gré."
              : "Consultez votre humidor, vos salons de troc et vos alertes de conservation."}
          </p>

          {/* Sélecteur d'onglet Inscription / Connexion */}
          <div className="flex rounded-lg bg-[#EEEAE3] p-1 mt-4 border border-[#D9D2C7]/60">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab("signup");
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                authModalTab === "signup"
                  ? "bg-[#FFFFFF] text-[#211D19] shadow-sm font-semibold"
                  : "text-[#645C54] hover:text-[#211D19]"
              }`}
            >
              Créer un compte
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab("login");
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                authModalTab === "login"
                  ? "bg-[#FFFFFF] text-[#211D19] shadow-sm font-semibold"
                  : "text-[#645C54] hover:text-[#211D19]"
              }`}
            >
              Connexion
            </button>
          </div>
        </div>

        {/* Corps déroulant */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#963E38]/10 border border-[#963E38]/30 text-[#963E38] text-xs font-medium leading-relaxed">
              {errorMessage}
            </div>
          )}

          {/* ================= ONGLET 1 : CRÉATION DE COMPTE ================= */}
          {authModalTab === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Ligne Prénom / Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                    Prénom <span className="text-[#963E38]">*</span>
                  </label>
                  <input
                    ref={initialFocusRef}
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Alexandre"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                    Nom <span className="text-[#963E38]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: de Montmirail"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
              </div>

              {/* Ligne Ville / Pays */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                      Ville
                    </label>
                    <span className="text-[10px] text-[#857A6D]">Floutée par défaut</span>
                  </div>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#857A6D]" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Paris"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="France"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
              </div>

              {/* Adresse e-mail */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                  Adresse e-mail <span className="text-[#963E38]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#857A6D]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.nom@domaine.com"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                  Mot de passe confidentiel
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#857A6D]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
              </div>

              {/* Affinité de collection */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                  Affinité principale de conservation
                </label>
                <select
                  value={affinity}
                  onChange={(e) => setAffinity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                >
                  <option value="Habanos Grands Crus & Millésimes">Habanos Grands Crus & Millésimes</option>
                  <option value="Réserve République Dominicaine & Nouveau Monde">Réserve République Dominicaine & Nouveau Monde</option>
                  <option value="Coffrets Scellés & Pre-Embargo">Coffrets Scellés & Pre-Embargo</option>
                  <option value="Cabinet Cèdre & Dégustation Quotidienne">Cabinet Cèdre & Dégustation Quotidienne</option>
                </select>
              </div>

              {/* Engagements et Critères Déontologiques */}
              <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#D9D2C7] space-y-2.5 text-xs">
                <div className="text-[11px] font-semibold text-[#6C4935] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6C4935]" />
                  <span>Critères d'admissibilité au Cercle</span>
                </div>

                <label className="flex items-start gap-2 cursor-pointer text-[#211D19]">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#211D19] focus:ring-[#71512D]"
                  />
                  <span className="text-[11px] leading-tight">
                    Je certifie avoir l'âge légal requis pour consommer des produits du tabac (18+ ans).
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-[#211D19]">
                  <input
                    type="checkbox"
                    checked={hygroConfirmed}
                    onChange={(e) => setHygroConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#211D19] focus:ring-[#71512D]"
                  />
                  <span className="text-[11px] leading-tight">
                    Je m'engage à préserver mes vitoles dans les normes rigoureuses d'hygrométrie (68–70% HR à 18–20°C).
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer text-[#211D19]">
                  <input
                    type="checkbox"
                    checked={barterConfirmed}
                    onChange={(e) => setBarterConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-[#211D19] focus:ring-[#71512D]"
                  />
                  <span className="text-[11px] leading-tight">
                    J'adhère aux principes du troc pur de gré à gré sans spéculation financière.
                  </span>
                </label>
              </div>

              {/* Bouton de Soumission */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-ink-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Créer mon compte aficionado</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ================= ONGLET 2 : CONNEXION ================= */}
          {authModalTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#857A6D]" />
                  <input
                    ref={initialFocusRef}
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="alexandre.m@cigarconnect.fr"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#211D19] uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <a
                    href="#assistance"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast(
                        "Récupération d'accès",
                        "En phase pilote, connectez-vous directement via les profils de démonstration ci-dessous.",
                        "info"
                      );
                    }}
                    className="text-[10px] text-[#6C4935] hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#857A6D]" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-[#D9D2C7] bg-[#FFFFFF] text-[#211D19] focus:outline-none focus:ring-2 focus:ring-[#71512D]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-ink-primary w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Accéder à mon humidor privé</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Raccourcis de test Démonstration */}
              <div className="pt-4 border-t border-[#D9D2C7]/60 space-y-2.5">
                <div className="text-[11px] font-semibold text-[#857A6D] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#A88958]" />
                  <span>Accès rapide phase pilote</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      switchDemoUser("alexandre");
                      showToast(
                        "Profil activé",
                        "Connecté en tant qu'Alexandre de Montmirail (Paris).",
                        "success"
                      );
                    }}
                    className="p-2.5 rounded-lg border border-[#D9D2C7] bg-[#F7F5F0] hover:border-[#6C4935] hover:bg-[#FFFFFF] transition-all flex items-center gap-2.5 text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#211D19] text-[#F7F5F0] text-xs font-bold flex items-center justify-center shrink-0">
                      AM
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[#211D19] truncate">Alexandre de M.</div>
                      <div className="text-[10px] text-[#645C54]">Paris · 17 vitoles</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      switchDemoUser("jeanmarc");
                      showToast(
                        "Profil activé",
                        "Connecté en tant que Jean-Marc Lambert (Genève).",
                        "success"
                      );
                    }}
                    className="p-2.5 rounded-lg border border-[#D9D2C7] bg-[#F7F5F0] hover:border-[#6C4935] hover:bg-[#FFFFFF] transition-all flex items-center gap-2.5 text-left"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#365343] text-[#F7F5F0] text-xs font-bold flex items-center justify-center shrink-0">
                      JL
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-[#211D19] truncate">Jean-Marc L.</div>
                      <div className="text-[10px] text-[#645C54]">Genève · Conservateur</div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Pied de la modale */}
        <div className="p-4 bg-[#F7F5F0] border-t border-[#D9D2C7] flex items-center justify-between text-[11px] text-[#857A6D]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#A88958]" />
            <span>Chiffrement et discrétion de cave</span>
          </span>
          {authModalTab === "signup" ? (
            <button
              onClick={() => setAuthModalTab("login")}
              className="text-[#6C4935] font-semibold hover:underline"
            >
              Déjà membre ? Se connecter
            </button>
          ) : (
            <button
              onClick={() => setAuthModalTab("signup")}
              className="text-[#6C4935] font-semibold hover:underline"
            >
              Nouveau ? Créer un compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
