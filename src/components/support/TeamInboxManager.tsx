"use client";

import React, { useState } from "react";
import { 
  Inbox, 
  UserCheck, 
  LifeBuoy, 
  Scale, 
  ShieldAlert, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Send, 
  Lock, 
  FileText, 
  AlertCircle, 
  ArrowLeftRight, 
  Users, 
  Search, 
  Filter, 
  ChevronRight,
  Sparkles,
  Plus
} from "lucide-react";
import { 
  assignCaseToAgent, 
  addCaseInternalNote, 
  sendAgentMessage, 
  createCaseMediationProposal, 
  updateCaseStatus 
} from "@/lib/actions/support";

interface TeamInboxManagerProps {
  initialCases: any[];
  currentStaffRole?: string;
}

export const TeamInboxManager: React.FC<TeamInboxManagerProps> = ({
  initialCases,
  currentStaffRole = "Médiateur du Cercle"
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    initialCases.length > 0 ? initialCases[0].id : null
  );
  const [staffRole, setStaffRole] = useState<string>(currentStaffRole);
  const [staffName, setStaffName] = useState<string>("Alexandre de Montmirail");

  // Filtre et recherche
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Onglet d'action active pour le dossier sélectionné : "REPLY" ou "INTERNAL_NOTE" ou "PROPOSAL"
  const [actionTab, setActionTab] = useState<"REPLY" | "INTERNAL_NOTE" | "PROPOSAL">("REPLY");

  // Formulaire de réponse membre
  const [replyContent, setReplyContent] = useState<string>("");
  const [audience, setAudience] = useState<"ALL" | "REQUESTER_ONLY" | "OTHER_PARTY_ONLY">("ALL");

  // Formulaire de note interne
  const [internalNoteText, setInternalNoteText] = useState<string>("");

  // Formulaire de proposition de médiation
  const [proposalProblem, setProposalProblem] = useState<string>("");
  const [proposalReqObligations, setProposalReqObligations] = useState<string>("");
  const [proposalOtherObligations, setProposalOtherObligations] = useState<string>("");
  const [proposalDeadlines, setProposalDeadlines] = useState<string>("7 jours ouvrés à compter de la confirmation mutuelle");
  const [proposalConsequences, setProposalConsequences] = useState<string>("Restitution de la vitole réservée en cave et clôture du litige");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtrage des dossiers
  const filteredCases = initialCases.filter((c) => {
    if (activeTab === "unassigned" && c.assignedAgent) return false;
    if (activeTab === "mediations" && c.category !== "TRADE_ISSUE") return false;
    if (activeTab === "reports" && c.category !== "REPORT_MEMBER") return false;
    if (activeTab === "review_queue" && !c.hasPendingReview) return false;
    if (activeTab === "closed" && c.status !== "closed") return false;
    if (activeTab === "in_progress" && (c.status === "closed" || !c.assignedAgent)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = c.reference.toLowerCase().includes(q) || 
                    c.subject.toLowerCase().includes(q) || 
                    (c.requesterName && c.requesterName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const selectedCase = initialCases.find((c) => c.id === selectedCaseId);

  const handleAssignToMe = async () => {
    if (!selectedCase) return;
    setIsProcessing(true);
    try {
      await assignCaseToAgent(selectedCase.id, "usr_alexandre_01", "Prise en charge directe par l'agent", staffName);
      setToastMessage("Dossier pris en charge avec succès.");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !replyContent.trim()) return;
    setIsProcessing(true);
    try {
      await sendAgentMessage(
        selectedCase.id,
        replyContent.trim(),
        audience,
        "usr_alexandre_01",
        staffName,
        staffRole === "Médiateur du Cercle" ? "MEDIATOR" : "AGENT"
      );
      setReplyContent("");
      setToastMessage("Message formel envoyé au(x) membre(s).");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !internalNoteText.trim()) return;
    setIsProcessing(true);
    try {
      await addCaseInternalNote(selectedCase.id, internalNoteText.trim(), "usr_alexandre_01", staffName);
      setInternalNoteText("");
      setToastMessage("Note interne enregistrée dans l'audit.");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublishProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !proposalProblem.trim()) return;
    setIsProcessing(true);
    try {
      await createCaseMediationProposal(selectedCase.id, {
        problemSummary: proposalProblem.trim(),
        requesterObligations: proposalReqObligations.trim() || "Conserver le module intact dans l'attente du retour",
        otherPartyObligations: proposalOtherObligations.trim() || "Expédier le millésime convenu ou annuler la réservation",
        deadlines: proposalDeadlines.trim(),
        consequences: proposalConsequences.trim(),
        authorName: staffName
      });
      setToastMessage("Proposition de médiation émise aux deux parties.");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseCase = async (outcomeCode: string) => {
    if (!selectedCase) return;
    const confirmClose = confirm(`Clôturer ce dossier avec l'issue "${outcomeCode}" ?`);
    if (!confirmClose) return;

    setIsProcessing(true);
    try {
      await updateCaseStatus(selectedCase.id, "closed", outcomeCode, staffName);
      setToastMessage(`Dossier clôturé : ${outcomeCode}.`);
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#241E1A] py-8 px-4 sm:px-6 lg:px-8">
      {/* 1. Barre de Rôle Simulateur pour l'équipe */}
      <div className="max-w-7xl mx-auto mb-6 p-4 rounded-2xl bg-[#241E1A] text-[#F4F0E7] flex flex-wrap items-center justify-between gap-4 shadow-lg border border-[#D9D0C2]/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#AA8959] text-[#241E1A] flex items-center justify-center font-bold text-xs">
            CC
          </div>
          <div>
            <div className="text-xs font-bold text-[#F4F0E7]">{staffName}</div>
            <div className="text-[11px] text-[#AA8959] font-medium">Poste actif : {staffRole}</div>
          </div>
        </div>

        {/* Sélecteur de rôle d'équipe */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#D9D0C2] uppercase tracking-wider font-semibold">
            Changer d'habilitation :
          </span>
          {[
            "Agent assistance",
            "Médiateur du Cercle",
            "Modérateur",
            "Responsable Support",
            "Éditeur Aide"
          ].map((role) => (
            <button
              key={role}
              onClick={() => setStaffRole(role)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                staffRole === role
                  ? "bg-[#AA8959] text-[#241E1A] font-bold"
                  : "bg-[#352B24] text-[#D9D0C2] hover:bg-[#45372F]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="max-w-7xl mx-auto mb-4 p-4 rounded-xl bg-[#EBF0EC] border border-[#35483F] text-xs font-bold text-[#35483F] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Boîte de Réception & Panneau Split View */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne Gauche (4/12) : Liste des Dossiers et Vues */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#D9D0C2] p-5 shadow-sm">
          {/* Titre & Barre de recherche */}
          <div className="pb-4 border-b border-[#D9D0C2]">
            <h2 className="font-serif text-xl font-bold text-[#241E1A]">Boîte de Réception Équipe</h2>
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71513B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher réf, membre, mot..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs text-[#241E1A] focus:outline-none focus:border-[#AA8959]"
              />
            </div>
          </div>

          {/* Vues de Filtrage */}
          <div className="py-3 flex flex-wrap gap-1.5 border-b border-[#D9D0C2] text-[11px]">
            {[
              { id: "all", label: "Tous" },
              { id: "unassigned", label: "Non attribués" },
              { id: "mediations", label: "Médiations" },
              { id: "reports", label: "Signalements" },
              { id: "review_queue", label: "Réexamens" },
              { id: "closed", label: "Clôturés" }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveTab(v.id)}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                  activeTab === v.id
                    ? "bg-[#241E1A] text-[#F4F0E7]"
                    : "bg-[#FAF8F5] text-[#71513B] border border-[#D9D0C2] hover:border-[#AA8959]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Liste des cartes de dossiers */}
          <div className="mt-4 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredCases.length > 0 ? (
              filteredCases.map((c) => {
                const isSelected = c.id === selectedCaseId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#FAF8F5] border-[#AA8959] ring-1 ring-[#AA8959]"
                        : "bg-[#FFFFFF] border-[#D9D0C2] hover:border-[#AA8959]/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className="font-mono font-bold text-[#AA8959]">{c.reference}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                        c.priority === "URGENT" || c.priority === "HIGH" ? "bg-[#FDF2F2] text-[#8A2B2B]" : "bg-[#FAF8F5] text-[#71513B]"
                      }`}>
                        {c.priority}
                      </span>
                    </div>

                    <h4 className="font-serif text-xs font-bold text-[#241E1A] line-clamp-1">
                      {c.subject}
                    </h4>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#71513B]">
                      <span>{c.requesterName || "Membre"}</span>
                      <span className="font-medium text-[#241E1A]">{c.status}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-[#71513B] text-center py-8 italic">
                Aucun dossier dans cette vue.
              </p>
            )}
          </div>
        </div>

        {/* Colonne Droite (8/12) : Fiche de Traitement & Espace d'Action de l'Agent */}
        <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl border border-[#D9D0C2] p-6 sm:p-8 shadow-sm">
          {selectedCase ? (
            <div>
              {/* En-tête du dossier sélectionné */}
              <div className="flex flex-wrap items-start justify-between pb-6 mb-6 border-b border-[#D9D0C2] gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[#AA8959] bg-[#FAF8F5] px-3 py-0.5 rounded border border-[#D9D0C2]">
                      {selectedCase.reference}
                    </span>
                    <span className="text-xs font-semibold text-[#71513B]">
                      {selectedCase.category}
                    </span>
                    <span className="text-xs font-bold text-[#35483F] bg-[#EBF0EC] px-2.5 py-0.5 rounded-full uppercase">
                      {selectedCase.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#241E1A]">
                    {selectedCase.subject}
                  </h3>
                  <div className="text-xs text-[#71513B] mt-1">
                    Demandeur : <strong>{selectedCase.requesterName}</strong> ({selectedCase.requesterEmail || "Identifiant lié"})
                  </div>
                </div>

                {/* Attribution atomique */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {selectedCase.assignedAgent ? (
                    <div className="text-xs text-right">
                      <span className="text-[11px] text-[#71513B] block">Responsable attribué :</span>
                      <strong className="text-[#241E1A]">
                        {selectedCase.assignedAgent.firstName} {selectedCase.assignedAgent.lastName}
                      </strong>
                    </div>
                  ) : (
                    <button
                      onClick={handleAssignToMe}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-bold hover:bg-[#352B24] transition-all shadow-sm"
                    >
                      Prendre en charge ce dossier
                    </button>
                  )}
                </div>
              </div>

              {/* Indicateur de Co-présence / Anti-collision */}
              <div className="mb-6 p-3 rounded-xl bg-[#FAF8F5] border border-[#AA8959]/40 text-xs text-[#71513B] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#AA8959]" />
                <span>
                  <strong>Avertissement co-présence :</strong> Vous avez la main sur ce dossier en tant que {staffRole}. Les modifications sont journalisées de manière atomique.
                </span>
              </div>

              {/* Description initiale du membre */}
              <div className="mb-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#D9D0C2]">
                <span className="text-[11px] font-bold text-[#71513B] uppercase tracking-wider block mb-1">
                  Exposé initial des faits (par le demandeur) :
                </span>
                <p className="text-xs sm:text-sm text-[#241E1A] leading-relaxed whitespace-pre-wrap">
                  {selectedCase.description || "Aucune description détaillée."}
                </p>
              </div>

              {/* Sélecteur d'action de l'agent */}
              <div className="mb-6 flex items-center gap-2 border-b border-[#D9D0C2] pb-3">
                <button
                  type="button"
                  onClick={() => setActionTab("REPLY")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    actionTab === "REPLY"
                      ? "bg-[#241E1A] text-[#F4F0E7]"
                      : "bg-[#FFFFFF] text-[#71513B] border border-[#D9D0C2] hover:border-[#AA8959]"
                  }`}
                >
                  Répondre au membre
                </button>
                <button
                  type="button"
                  onClick={() => setActionTab("INTERNAL_NOTE")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    actionTab === "INTERNAL_NOTE"
                      ? "bg-[#D97706] text-white"
                      : "bg-[#FFFFFF] text-[#71513B] border border-[#D9D0C2] hover:border-[#D97706]"
                  }`}
                >
                  Ajouter une note interne (Audit équipe)
                </button>
                <button
                  type="button"
                  onClick={() => setActionTab("PROPOSAL")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    actionTab === "PROPOSAL"
                      ? "bg-[#AA8959] text-[#241E1A]"
                      : "bg-[#FFFFFF] text-[#71513B] border border-[#D9D0C2] hover:border-[#AA8959]"
                  }`}
                >
                  Formuler une proposition de médiation
                </button>
              </div>

              {/* 1. Formulaire de Réponse Membre */}
              {actionTab === "REPLY" && (
                <form onSubmit={handleSendReply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-1">
                      Destinataire(s) du message (Séparation stricte des parties) :
                    </label>
                    <select
                      value={audience}
                      onChange={(e) => setAudience(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs font-medium text-[#241E1A]"
                    >
                      <option value="ALL">Partage commun (Demandeur et Autre partie)</option>
                      <option value="REQUESTER_ONLY">Demandeur uniquement (Privé et confidentiel)</option>
                      <option value="OTHER_PARTY_ONLY">Autre partie uniquement (Privé et confidentiel)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-1">
                      Texte de la réponse officielle :
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Formulez votre réponse avec courtoisie, neutralité et précision..."
                      className="w-full p-4 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs sm:text-sm text-[#241E1A] focus:outline-none focus:border-[#AA8959] focus:bg-[#FFFFFF]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-bold hover:bg-[#352B24] transition-all shadow-sm"
                    >
                      Transmettre au(x) membre(s)
                    </button>
                  </div>
                </form>
              )}

              {/* 2. Formulaire de Note Interne */}
              {actionTab === "INTERNAL_NOTE" && (
                <form onSubmit={handleAddInternalNote} className="space-y-4 p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#92400E]">
                    <Lock className="w-4 h-4" />
                    <span>Note interne confidentielle (JAMAIS visible par les membres)</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={internalNoteText}
                    onChange={(e) => setInternalNoteText(e.target.value)}
                    placeholder="Consignez votre analyse des faits, vos doutes, ou la consigne pour le passage de relais..."
                    className="w-full p-3 rounded-xl bg-[#FFFFFF] border border-[#FCD34D] text-xs text-[#241E1A] focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2 rounded-full bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309] transition-colors"
                    >
                      Enregistrer la note interne
                    </button>
                  </div>
                </form>
              )}

              {/* 3. Constructeur de Proposition de Médiation */}
              {actionTab === "PROPOSAL" && (
                <form onSubmit={handlePublishProposal} className="space-y-4 p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#AA8959]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#AA8959]">
                    <Scale className="w-4 h-4" />
                    <span>Nouvelle version de proposition de médiation (Accord explicite exigé)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#71513B] mb-1">1. Problème traité :</label>
                    <input
                      type="text"
                      required
                      value={proposalProblem}
                      onChange={(e) => setProposalProblem(e.target.value)}
                      placeholder="Ex : Incompatibilité du millésime livré par rapport à l'accord initial"
                      className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#71513B] mb-1">2. Actions demandeur :</label>
                      <textarea
                        rows={3}
                        value={proposalReqObligations}
                        onChange={(e) => setProposalReqObligations(e.target.value)}
                        placeholder="Ex : Retourner le cabinet scellé sous 5 jours ouvrés"
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#71513B] mb-1">3. Actions autre partie :</label>
                      <textarea
                        rows={3}
                        value={proposalOtherObligations}
                        onChange={(e) => setProposalOtherObligations(e.target.value)}
                        placeholder="Ex : Annuler la réservation et réintégrer le lot original"
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#71513B] mb-1">4. Échéances convenues :</label>
                      <input
                        type="text"
                        value={proposalDeadlines}
                        onChange={(e) => setProposalDeadlines(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#71513B] mb-1">5. Conséquences sur le dossier :</label>
                      <input
                        type="text"
                        value={proposalConsequences}
                        onChange={(e) => setProposalConsequences(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 rounded-full bg-[#AA8959] text-[#241E1A] text-xs font-bold hover:bg-[#C2A373] transition-colors shadow-sm"
                    >
                      Émettre cette proposition aux deux parties
                    </button>
                  </div>
                </form>
              )}

              {/* Boutons de clôture avec issue formelle */}
              {selectedCase.status !== "closed" && (
                <div className="mt-8 pt-6 border-t border-[#D9D0C2] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-[#71513B] font-semibold">
                    Clôturer ce dossier avec motif officiel :
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCloseCase("RESOLVED_ARRANGEMENT")}
                      className="px-3 py-1.5 rounded-lg bg-[#EBF0EC] border border-[#35483F] text-xs font-bold text-[#35483F] hover:bg-[#35483F] hover:text-white transition-all"
                    >
                      Arrangement mis en œuvre
                    </button>
                    <button
                      onClick={() => handleCloseCase("NO_AGREEMENT")}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0C2] text-xs font-semibold text-[#71513B] hover:bg-[#D9D0C2]"
                    >
                      Aucun accord possible
                    </button>
                    <button
                      onClick={() => handleCloseCase("ADMINISTRATIVE_CLOSURE")}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0C2] text-xs font-semibold text-[#71513B] hover:bg-[#D9D0C2]"
                    >
                      Clôture administrative
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-[#71513B]">
              Sélectionnez un dossier à gauche pour consulter les détails et agir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
