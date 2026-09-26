"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  LifeBuoy, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  FileText, 
  Lock, 
  ArrowLeftRight, 
  ShieldAlert, 
  Wrench, 
  MessageSquare,
  HelpCircle,
  RotateCcw,
  Ban,
  Scale
} from "lucide-react";
import { 
  replyToSupportCase, 
  withdrawSupportCase, 
  requestCaseReview,
  submitProposalDecision 
} from "@/lib/actions/support";

interface CaseDetailViewProps {
  caseData: any;
  currentUserId?: string;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({ caseData, currentUserId }) => {
  const [replyText, setReplyText] = useState<string>("");
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);
  const [reviewReason, setReviewReason] = useState<string>("");
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [withdrawReason, setWithdrawReason] = useState<string>("");
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const activeProposal = caseData.mediationProposals?.find((p: any) => p.status === "PENDING" || p.status === "ACCEPTED");

  // Décision actuelle de l'utilisateur sur la proposition active
  const myDecision = activeProposal?.decisions?.find((d: any) => d.userId === currentUserId)?.decision;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      const res = await replyToSupportCase(caseData.id, replyText.trim(), currentUserId, caseData.requesterName);
      if (res.success) {
        setReplyText("");
        setActionSuccess("Votre message a été transmis à l'équipe.");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert(res.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDecision = async (decision: "ACCEPTED" | "MODIFICATION_REQUESTED" | "REJECTED") => {
    if (!activeProposal) return;
    const confirmText = decision === "ACCEPTED" 
      ? "Confirmez-vous votre acceptation de cette proposition de médiation ?" 
      : "Voulez-vous notifier le médiateur de votre refus ou demande de modification ?";
    if (!confirm(confirmText)) return;

    try {
      const res = await submitProposalDecision(activeProposal.id, currentUserId || caseData.requesterId, decision);
      if (res.success) {
        setActionSuccess("Votre décision a été formellement enregistrée.");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert(res.error || "Impossible d'enregistrer votre décision.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await withdrawSupportCase(caseData.id, withdrawReason);
      if (res.success) {
        setShowWithdrawModal(false);
        window.location.reload();
      } else {
        alert(res.error || "Erreur");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestReview = async () => {
    if (!reviewReason.trim()) {
      alert("Veuillez indiquer le motif de contestation.");
      return;
    }
    try {
      const res = await requestCaseReview(caseData.id, currentUserId || caseData.requesterId, reviewReason);
      if (res.success) {
        setShowReviewModal(false);
        window.location.reload();
      } else {
        alert(res.error || "Erreur");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#241E1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Fil d'ariane & Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/app/assistance"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71513B] hover:text-[#241E1A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour à mes demandes</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#AA8959] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#D9D0C2]">
              {caseData.reference}
            </span>
            <span className="text-xs font-bold text-[#35483F] bg-[#EBF0EC] px-3 py-1 rounded-full border border-[#35483F]/30 uppercase tracking-wider">
              {caseData.status}
            </span>
          </div>
        </div>

        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-[#EBF0EC] border border-[#35483F] text-xs font-bold text-[#35483F] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne Principale (2/3) : Objet, Messages & Propositions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte Objet du dossier */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#71513B] pb-4 mb-4 border-b border-[#D9D0C2]">
                <span className="font-bold text-[#AA8959] uppercase tracking-wider">
                  Catégorie : {caseData.category}
                </span>
                <span>
                  Ouvert le {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(caseData.createdAt))}
                </span>
              </div>

              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#241E1A] leading-tight">
                {caseData.subject}
              </h1>

              <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs sm:text-sm text-[#71513B] leading-relaxed whitespace-pre-wrap">
                {caseData.description}
              </div>

              {/* Pièces jointes initiales */}
              {caseData.attachments && caseData.attachments.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {caseData.attachments.map((att: any, i: number) => (
                    <a
                      key={i}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0C2] text-xs font-medium text-[#241E1A] hover:border-[#AA8959] transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#AA8959]" />
                      <span>{att.fileName}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* ================================================================
                PROPOSITION DE MÉDIATION VERSIONNÉE (SECTION CRUCIALE)
                ================================================================ */}
            {activeProposal && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border-2 border-[#AA8959] shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D9D0C2]">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#AA8959]" />
                    <h2 className="font-serif text-lg font-bold text-[#241E1A]">
                      Proposition de Résolution · Version v{activeProposal.version}
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#241E1A] text-[#F4F0E7]">
                    {activeProposal.status}
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#241E1A]">
                  <div>
                    <span className="font-bold text-[#71513B] uppercase tracking-wider text-[11px] block mb-1">
                      1. Problème traité :
                    </span>
                    <p className="bg-[#FFFFFF] p-3 rounded-lg border border-[#D9D0C2] leading-relaxed">
                      {activeProposal.problemSummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-[#71513B] uppercase tracking-wider text-[11px] block mb-1">
                        2. Actions attendues de vous :
                      </span>
                      <p className="bg-[#FFFFFF] p-3 rounded-lg border border-[#D9D0C2] leading-relaxed">
                        {activeProposal.requesterObligations}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[#71513B] uppercase tracking-wider text-[11px] block mb-1">
                        3. Actions attendues de l'autre partie :
                      </span>
                      <p className="bg-[#FFFFFF] p-3 rounded-lg border border-[#D9D0C2] leading-relaxed">
                        {activeProposal.otherPartyObligations}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-[#71513B] uppercase tracking-wider text-[11px] block mb-1">
                        4. Échéances convenues :
                      </span>
                      <p className="bg-[#FFFFFF] p-3 rounded-lg border border-[#D9D0C2] leading-relaxed">
                        {activeProposal.deadlines}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[#71513B] uppercase tracking-wider text-[11px] block mb-1">
                        5. Conséquences sur le dossier :
                      </span>
                      <p className="bg-[#FFFFFF] p-3 rounded-lg border border-[#D9D0C2] leading-relaxed">
                        {activeProposal.consequences}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Avis déontologique : le silence ne vaut pas acceptation */}
                <div className="mt-4 p-3 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-[11px] text-[#71513B] leading-relaxed">
                  <strong>Règle d'or de la médiation :</strong> L'arrangement n'est scellé que si les deux parties acceptent formellement la <strong>même version</strong>. Une proposition d'agent ne vaut pas accord ; le silence ne vaut pas acceptation.
                </div>

                {/* Contrôles de décision pour le membre */}
                <div className="mt-6 pt-4 border-t border-[#D9D0C2] flex flex-wrap items-center justify-between gap-3">
                  {myDecision ? (
                    <div className="text-xs font-bold text-[#35483F] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#35483F]" />
                      <span>Votre décision a été enregistrée : {myDecision}</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => handleDecision("ACCEPTED")}
                        className="px-5 py-2.5 rounded-full bg-[#35483F] text-[#F4F0E7] text-xs font-bold hover:bg-[#2B3B33] active:scale-95 transition-all shadow-sm"
                      >
                        Accepter formellement la proposition
                      </button>
                      <button
                        onClick={() => handleDecision("MODIFICATION_REQUESTED")}
                        className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#D9D0C2] text-xs font-semibold text-[#241E1A] hover:bg-[#FAF8F5] transition-colors"
                      >
                        Demander un ajustement
                      </button>
                      <button
                        onClick={() => handleDecision("REJECTED")}
                        className="px-4 py-2 rounded-full bg-[#FFFFFF] border border-[#E8B4B4] text-xs font-semibold text-[#8A2B2B] hover:bg-[#FDF2F2] transition-colors"
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Correspondance écrite avec l'équipe */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D9D0C2]">
                <h3 className="font-serif text-lg font-bold text-[#241E1A]">
                  Correspondances & Échanges écrits
                </h3>
                <span className="text-[11px] text-[#71513B] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#35483F]" />
                  <span>Confidentialité bilatérale</span>
                </span>
              </div>

              {/* Historique des messages */}
              <div className="space-y-4 mb-6">
                {caseData.messages && caseData.messages.length > 0 ? (
                  caseData.messages.map((msg: any) => {
                    const isStaff = msg.senderRole === "AGENT" || msg.senderRole === "MEDIATOR" || msg.senderRole === "SYSTEM";
                    const formattedMsgDate = new Intl.DateTimeFormat("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    }).format(new Date(msg.createdAt));

                    return (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                          isStaff
                            ? "bg-[#FAF8F5] border-[#AA8959]/50 text-[#241E1A] ml-2 sm:ml-6"
                            : "bg-[#FFFFFF] border-[#D9D0C2] text-[#241E1A] mr-2 sm:mr-6"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 text-[11px] text-[#71513B]">
                          <span className="font-bold text-[#241E1A]">
                            {msg.senderName} {isStaff && <span className="text-[#AA8959]">(Conservateur)</span>}
                          </span>
                          <span>{formattedMsgDate}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#71513B] italic py-4 text-center">
                    Aucun message échangé pour l'instant. Votre dossier est en file d'attente d'instruction.
                  </p>
                )}
              </div>

              {/* Formulaire de réponse (si le dossier n'est pas clos) */}
              {caseData.status !== "closed" ? (
                <form onSubmit={handleReply} className="pt-4 border-t border-[#D9D0C2]">
                  <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-2">
                    Répondre à l'équipe
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Écrivez votre message ou précisez un nouvel élément..."
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs sm:text-sm text-[#241E1A] placeholder-[#71513B]/60 focus:outline-none focus:border-[#AA8959] focus:bg-[#FFFFFF] transition-all"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#71513B]">
                      Les réponses sont asynchrones. Vous recevrez une alerte lors de la réponse de l'agent.
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingReply}
                      className="px-5 py-2.5 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-bold hover:bg-[#352B24] active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 text-[#AA8959]" />
                      <span>{isSubmittingReply ? "Envoi..." : "Envoyer ma réponse"}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs text-[#71513B] text-center">
                  Ce dossier est actuellement clôturé (Issue : {caseData.outcomeCode || "Conclue"}). Vous pouvez demander un réexamen ci-contre si vous estimez qu'un élément fondamental a été omis.
                </div>
              )}
            </div>
          </div>

          {/* Colonne Latérale (1/3) : Statut, Contexte & Timeline */}
          <div className="space-y-6">
            {/* Responsable & Informations Clés */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#241E1A] mb-4 pb-2 border-b border-[#D9D0C2]">
                Interlocuteur Responsable
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#241E1A] text-[#F4F0E7] flex items-center justify-center font-bold text-xs">
                  {caseData.assignedAgent?.avatarInitials || "CC"}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#241E1A]">
                    {caseData.assignedAgent 
                      ? `${caseData.assignedAgent.firstName} ${caseData.assignedAgent.lastName}` 
                      : "Pôle Médiation & Conservation"}
                  </div>
                  <div className="text-[11px] text-[#AA8959]">
                    {caseData.assignedAgent?.role || "Collège des Conservateurs"}
                  </div>
                </div>
              </div>

              {/* Rattachement contextuel */}
              {caseData.contextLinks && caseData.contextLinks.length > 0 && (
                <div className="pt-3 border-t border-[#D9D0C2] text-xs">
                  <span className="text-[11px] font-bold text-[#71513B] uppercase tracking-wider block mb-1">
                    Contexte lié :
                  </span>
                  {caseData.contextLinks.map((link: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0C2] text-xs font-medium text-[#241E1A] flex items-center gap-2">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-[#AA8959] shrink-0" />
                      <span>{link.summary}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions de clôture ou réexamen */}
              <div className="mt-6 pt-4 border-t border-[#D9D0C2] flex flex-col gap-2">
                {caseData.status !== "closed" ? (
                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="w-full py-2 text-xs font-semibold text-[#8A2B2B] hover:bg-[#FDF2F2] rounded-lg transition-colors text-center"
                  >
                    Retirer ma demande
                  </button>
                ) : (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="w-full py-2 text-xs font-semibold text-[#AA8959] border border-[#AA8959] hover:bg-[#FAF8F5] rounded-lg transition-colors text-center flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Demander un réexamen</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chronologie des événements officiels */}
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#241E1A] mb-4 pb-2 border-b border-[#D9D0C2]">
                Historique du Dossier
              </h3>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#D9D0C2] pl-6 text-xs">
                {caseData.events && caseData.events.length > 0 ? (
                  caseData.events.map((ev: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#AA8959] ring-4 ring-[#FFFFFF]" />
                      <div className="font-semibold text-[#241E1A]">{ev.description}</div>
                      <div className="text-[10px] text-[#71513B] mt-0.5">
                        {new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(ev.createdAt))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#71513B] italic">Aucun événement enregistré.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modale de confirmation de retrait */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#D9D0C2] shadow-xl">
              <h3 className="font-serif text-lg font-bold text-[#241E1A]">Retirer cette demande ?</h3>
              <p className="text-xs text-[#71513B] mt-2 leading-relaxed">
                Le retrait mettra fin à l'instruction en cours. Les éléments enregistrés sont conservés à des fins d'audit conformément à notre charte de médiation.
              </p>
              <textarea
                rows={3}
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                placeholder="Motif facultatif..."
                className="w-full mt-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs text-[#241E1A] focus:outline-none"
              />
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#71513B] hover:bg-[#FAF8F5]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleWithdraw}
                  className="px-4 py-2 rounded-full bg-[#8A2B2B] text-white text-xs font-bold hover:bg-[#722323]"
                >
                  Confirmer le retrait
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de demande de réexamen */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-[#FFFFFF] rounded-2xl max-w-md w-full p-6 border border-[#D9D0C2] shadow-xl">
              <h3 className="font-serif text-lg font-bold text-[#241E1A]">Demande de réexamen</h3>
              <p className="text-xs text-[#71513B] mt-2 leading-relaxed">
                Votre dossier sera transmis à un responsable de la conservation distinct de l'agent initial. Veuillez exposer les faits nouveaux ou les erreurs matérielles contestées.
              </p>
              <textarea
                rows={4}
                required
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                placeholder="Exposez vos motifs de réexamen..."
                className="w-full mt-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs text-[#241E1A] focus:outline-none"
              />
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#71513B] hover:bg-[#FAF8F5]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRequestReview}
                  className="px-4 py-2 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-bold hover:bg-[#352B24]"
                >
                  Déposer le recours
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
