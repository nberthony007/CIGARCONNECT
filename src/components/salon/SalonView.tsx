"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Bell, 
  BellOff, 
  Send, 
  Image as ImageIcon, 
  X, 
  MoreVertical, 
  CornerDownRight, 
  Edit3, 
  Trash2, 
  Flag, 
  UserX, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Lock,
  Eye,
  Maximize2
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  SalonMessageWithDetails, 
  sendSalonMessage, 
  editSalonMessage, 
  retractSalonMessage, 
  reportSalonMessage, 
  blockSalonUser, 
  toggleSalonNotifications 
} from "@/lib/actions/salon";

interface SalonViewProps {
  initialMessages: SalonMessageWithDetails[];
  initialNotificationsEnabled: boolean;
  acceptedCharterVersion?: string | null;
}

export const SalonView: React.FC<SalonViewProps> = ({
  initialMessages,
  initialNotificationsEnabled,
  acceptedCharterVersion,
}) => {
  const { user, openAuthModal } = useAuth();

  // Liste des messages
  const [messages, setMessages] = useState<SalonMessageWithDetails[]>(initialMessages);

  // État du compositeur
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<SalonMessageWithDetails | null>(null);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Notifications du Salon (Section 25.1 : Réglage unique)
  const [notificationsEnabled, setNotificationsEnabled] = useState(initialNotificationsEnabled);
  const [togglingNotifs, setTogglingNotifs] = useState(false);

  // Modales
  const [isCharterOpen, setIsCharterOpen] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<SalonMessageWithDetails | null>(null);
  const [reportReason, setReportReason] = useState("SPAM");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Édition
  const [editingMessage, setEditingMessage] = useState<SalonMessageWithDetails | null>(null);
  const [editContent, setEditContent] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Lightbox photos
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  // Menus d'actions ouverts par message
  const [openMenuMessageId, setOpenMenuMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isInitialMount = useRef(true);

  // Garantir que la page s'ouvre toujours en haut au commencement
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Défilement fluide vers le bas UNIQUEMENT lors de l'ajout actif d'un nouveau message
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".message-action-menu")) {
        setOpenMenuMessageId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Bascule du réglage de notification
  const handleToggleNotifications = async () => {
    if (!user) return;
    setTogglingNotifs(true);
    const newStatus = !notificationsEnabled;
    const res = await toggleSalonNotifications(user.id, newStatus);
    if (res.success && res.replyNotificationsEnabled !== undefined) {
      setNotificationsEnabled(res.replyNotificationsEnabled);
    }
    setTogglingNotifs(false);
  };

  // Ajout d'une photo d'exemple (Section 24.3)
  const handleAddSamplePhoto = () => {
    if (attachments.length >= 4) return;
    const samplePhotos = [
      "/assets/cigar-behike56.jpg",
      "/assets/cigar-trinidad.jpg",
      "/assets/cigar-montecristo.jpg",
      "/assets/hero-cigar-library.jpg",
    ];
    const nextPhoto = samplePhotos[attachments.length % samplePhotos.length];
    setAttachments((prev) => [...prev, nextPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Envoi de message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }

    const trimmed = content.trim();
    if (!trimmed && attachments.length === 0) return;
    if (trimmed.length > 4000) {
      setSendError("Le message dépasse 4 000 caractères.");
      return;
    }

    setSending(true);
    setSendError(null);

    const clientSendId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const res = await sendSalonMessage({
      authorId: user.id,
      content: trimmed,
      replyToId: replyingTo?.id,
      attachmentUrls: attachments,
      clientSendId,
    });

    setSending(false);

    if (res.success) {
      // Ajout optimiste au flux local
      const newMsgObj: SalonMessageWithDetails = {
        id: res.messageId || clientSendId,
        authorId: user.id,
        author: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          city: user.city || "Paris",
          avatarInitials: user.initials || "AM",
          role: user.role || "MEMBER",
        },
        content: trimmed,
        replyToId: replyingTo?.id || null,
        replyTo: replyingTo ? {
          id: replyingTo.id,
          author: {
            firstName: replyingTo.author.firstName,
            lastName: replyingTo.author.lastName,
          },
          content: replyingTo.content,
          isRetracted: replyingTo.isRetracted,
        } : null,
        isEdited: false,
        isRetracted: false,
        retractedAt: null,
        createdAt: new Date(),
        attachments: attachments.map((url, idx) => ({
          id: `att-${idx}-${Date.now()}`,
          url,
          altText: "Photographie partagée dans Le Salon",
        })),
      };

      setMessages((prev) => [...prev, newMsgObj]);
      setContent("");
      setReplyingTo(null);
      setAttachments([]);
    } else {
      setSendError(res.error || "Impossible d'envoyer votre message.");
    }
  };

  // Raccourci clavier desktop : Entrée envoie, Maj+Entrée insère une ligne (Section 24.2)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Retirer son propre message
  const handleRetract = async (msg: SalonMessageWithDetails) => {
    if (!user || user.id !== msg.authorId) return;
    if (!confirm("Confirmez-vous le retrait de votre message ? Son texte et ses images seront masqués pour tous les membres.")) {
      return;
    }

    const res = await retractSalonMessage(msg.id, user.id);
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id
            ? { ...m, isRetracted: true, content: "", attachments: [] }
            : m
        )
      );
    }
  };

  // Soumission de modification
  const handleSaveEdit = async () => {
    if (!user || !editingMessage) return;
    setSubmittingEdit(true);
    const res = await editSalonMessage(editingMessage.id, user.id, editContent);
    setSubmittingEdit(false);

    if (res.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessage.id
            ? { ...m, content: editContent.trim(), isEdited: true }
            : m
        )
      );
      setEditingMessage(null);
      setEditContent("");
    } else {
      alert("Erreur lors de la modification.");
    }
  };

  // Soumission de signalement
  const handleSaveReport = async () => {
    if (!user || !reportingMessage) return;
    setSubmittingReport(true);
    const res = await reportSalonMessage({
      messageId: reportingMessage.id,
      reporterId: user.id,
      reason: reportReason,
      details: reportDetails,
    });
    setSubmittingReport(false);

    if (res.success) {
      setReportSuccess("Votre signalement a été transmis à l'équipe de modération.");
      setTimeout(() => {
        setReportingMessage(null);
        setReportSuccess(null);
        setReportDetails("");
      }, 2000);
    }
  };

  // Blocage d'un membre
  const handleBlock = async (msg: SalonMessageWithDetails) => {
    if (!user) return;
    const authorName = msg.author?.firstName ? `${msg.author.firstName} ${msg.author.lastName || ""}` : "ce membre";
    if (!confirm(`Masquer tous les messages de ${authorName} dans votre salon ?`)) {
      return;
    }

    const res = await blockSalonUser(user.id, msg.author?.id || msg.authorId);
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.authorId !== (msg.author?.id || msg.authorId)));
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-10 bg-[#F7F5F0]">
      {/* Colonne unique centrée de 880px max sur ordinateur (Section 24.1) */}
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 space-y-6">

        {/* ======================================================== */}
        {/* EN-TÊTE ÉPURÉ DU SALON (Section 24.1 & 25.1)            */}
        {/* ======================================================== */}
        <div className="bg-[#FFFFFF] border border-[#D9D2C7] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#365343] inline-block" />
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#211D19] tracking-tight">
                Le Salon
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#EEEAE3] text-[#6C4935] border border-[#D9D2C7]">
                Espace Collectif
              </span>
            </div>
            <p className="text-xs text-[#645C54]">
              Un espace pour échanger entre membres sur les terroirs, la conservation et les grandes vitoles.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bouton Règles du Salon */}
            <button
              type="button"
              onClick={() => setIsCharterOpen(true)}
              className="px-3 py-1.5 rounded-full border border-[#D9D2C7] text-xs font-semibold text-[#645C54] hover:text-[#211D19] hover:bg-[#EEEAE3] transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#A88958]" />
              <span>Règles</span>
            </button>

            {/* Commande Réglage Unique de Notifications (Section 25.1) */}
            {user && (
              <button
                type="button"
                onClick={handleToggleNotifications}
                disabled={togglingNotifs}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  notificationsEnabled
                    ? "border-[#365343] text-[#365343] bg-[#365343]/10 hover:bg-[#365343]/20"
                    : "border-[#D9D2C7] text-[#857A6D] hover:bg-[#EEEAE3]"
                }`}
                title="Notifications uniquement pour les réponses directes à vos messages"
              >
                {notificationsEnabled ? (
                  <>
                    <Bell className="w-3.5 h-3.5 text-[#365343]" />
                    <span className="hidden sm:inline">Notifs :</span> Activées
                  </>
                ) : (
                  <>
                    <BellOff className="w-3.5 h-3.5 text-[#857A6D]" />
                    <span className="hidden sm:inline">Notifs :</span> Désactivées
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* BANNIÈRE POUR VISITEUR NON CONNECTÉ (Section 24.1)      */}
        {/* ======================================================== */}
        {!user && (
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#EEEAE3] flex items-center justify-center mx-auto text-[#6C4935]">
              <Lock className="w-6 h-6 text-[#A88958]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-bold text-[#211D19]">
                Le Salon est réservé aux membres inscrits
              </h2>
              <p className="text-xs text-[#645C54] max-w-md mx-auto leading-relaxed">
                Connectez-vous pour échanger avec la communauté, partager des photographies de vos vitoles et participer aux discussions privées.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="btn-ink-primary text-xs px-5 py-2.5"
              >
                Se connecter au Salon
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#6C4935] hover:bg-[#EEEAE3] transition-colors border border-[#D9D2C7]"
              >
                Créer un compte aficionado
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* FLUX UNIQUE DES MESSAGES (Sections 24.1 à 24.5)          */}
        {/* ======================================================== */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#645C54]">
              Le Salon est ouvert. Soyez le premier aficionado à initier un échange.
            </div>
          ) : (
            messages.map((msg) => {
              const isAuthor = user?.id === msg.authorId;
              const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
              }).format(new Date(msg.createdAt));

              return (
                <article
                  key={msg.id}
                  id={`msg-${msg.id}`}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#D9D2C7] shadow-sm space-y-3 transition-colors hover:border-[#6C4935]/40"
                >
                  {/* En-tête du message */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar initiales élégant */}
                      <div className="w-9 h-9 rounded-full bg-[#211D19] text-[#F7F5F0] flex items-center justify-center text-xs font-serif font-bold border border-[#A88958] shrink-0">
                        {msg.author?.avatarInitials || "AF"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif font-bold text-sm text-[#211D19]">
                            {msg.author?.firstName || "Membre"} {msg.author?.lastName || ""}
                          </span>
                          {msg.author?.city && (
                            <span className="text-[11px] text-[#645C54]">
                              ({msg.author.city})
                            </span>
                          )}
                          {msg.author?.role === "MASTER_COLLECTOR" && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EEEAE3] text-[#6C4935] font-semibold border border-[#D9D2C7]">
                              Conservateur
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#857A6D]" suppressHydrationWarning>
                          {formattedDate}
                          {msg.isEdited && !msg.isRetracted && (
                            <span className="ml-1.5 italic text-[#A88958] font-medium">
                              (modifié)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu accessible d'actions (Section 24.1 : pas uniquement au survol !) */}
                    <div className="relative message-action-menu">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuMessageId(openMenuMessageId === msg.id ? null : msg.id);
                        }}
                        className="w-8 h-8 rounded-lg border border-transparent hover:border-[#D9D2C7] hover:bg-[#EEEAE3] flex items-center justify-center text-[#645C54] transition-colors"
                        aria-label="Actions sur le message"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuMessageId === msg.id && (
                        <div className="absolute right-0 top-9 w-44 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] shadow-lg py-1.5 z-20 text-xs">
                          {/* Option Répondre (pour tous) */}
                          {!msg.isRetracted && user && (
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(msg);
                                setOpenMenuMessageId(null);
                                textareaRef.current?.focus();
                              }}
                              className="w-full px-3.5 py-2 text-left text-[#211D19] hover:bg-[#EEEAE3] flex items-center gap-2"
                            >
                              <CornerDownRight className="w-3.5 h-3.5 text-[#6C4935]" />
                              <span>Répondre</span>
                            </button>
                          )}

                          {/* Options réservées à l'auteur */}
                          {isAuthor && !msg.isRetracted && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMessage(msg);
                                  setEditContent(msg.content);
                                  setOpenMenuMessageId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-[#211D19] hover:bg-[#EEEAE3] flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-[#6C4935]" />
                                <span>Modifier</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleRetract(msg);
                                  setOpenMenuMessageId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-red-800 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-800" />
                                <span>Retirer</span>
                              </button>
                            </>
                          )}

                          {/* Options pour les autres membres */}
                          {!isAuthor && user && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setReportingMessage(msg);
                                  setOpenMenuMessageId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-[#645C54] hover:bg-[#EEEAE3] flex items-center gap-2"
                              >
                                <Flag className="w-3.5 h-3.5 text-[#645C54]" />
                                <span>Signaler</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleBlock(msg);
                                  setOpenMenuMessageId(null);
                                }}
                                className="w-full px-3.5 py-2 text-left text-[#857A6D] hover:bg-[#EEEAE3] flex items-center gap-2 border-t border-[#D9D2C7]/50 mt-1 pt-1"
                              >
                                <UserX className="w-3.5 h-3.5 text-[#857A6D]" />
                                <span>Masquer ce membre</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Citation d'un message parent si c'est une réponse (Section 24.4) */}
                  {msg.replyTo && (
                    <div 
                      onClick={() => {
                        const target = document.getElementById(`msg-${msg.replyTo?.id}`);
                        target?.scrollIntoView({ behavior: "smooth", block: "center" });
                        target?.classList.add("ring-2", "ring-[#A88958]");
                        setTimeout(() => target?.classList.remove("ring-2", "ring-[#A88958]"), 2000);
                      }}
                      className="p-2.5 rounded-xl bg-[#EEEAE3]/60 border-l-2 border-[#6C4935] text-xs text-[#645C54] cursor-pointer hover:bg-[#EEEAE3] transition-colors"
                    >
                      <span className="font-semibold text-[#211D19]">
                        En réponse à {msg.replyTo.author?.firstName || "Membre"} {msg.replyTo.author?.lastName || ""} :
                      </span>{" "}
                      <span className="italic line-clamp-1">
                        {msg.replyTo.isRetracted
                          ? "Message retiré par l'auteur"
                          : msg.replyTo.content}
                      </span>
                    </div>
                  )}

                  {/* Contenu textuel ou boîte de message retiré */}
                  {msg.isRetracted ? (
                    <div className="p-3 rounded-xl bg-[#EEEAE3]/40 border border-[#D9D2C7] text-xs text-[#857A6D] italic">
                      Message retiré par l'auteur.
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm text-[#211D19] leading-relaxed whitespace-pre-wrap font-normal">
                      {msg.content}
                    </div>
                  )}

                  {/* Galerie Photos (Jusqu'à 4 photos, Section 24.3) */}
                  {!msg.isRetracted && msg.attachments && msg.attachments.length > 0 && (
                    <div className={`grid gap-2 pt-1 ${
                      msg.attachments.length === 1
                        ? "grid-cols-1 max-w-sm"
                        : msg.attachments.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2 sm:grid-cols-4"
                    }`}>
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          onClick={() => setActiveLightboxImage(att.url)}
                          className="relative aspect-square rounded-xl overflow-hidden bg-[#211D19] border border-[#D9D2C7] cursor-pointer group"
                        >
                          <img
                            src={att.url}
                            alt={att.altText || "Photo du Salon"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-[#211D19]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#FAF7F2]">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ======================================================== */}
        {/* COMPOSITEUR DE RÉDACTION DU SALON (Section 24.1 & 24.2)  */}
        {/* ======================================================== */}
        {user && (
          <div className="sticky bottom-4 z-30 bg-[#FFFFFF] border border-[#D9D2C7] rounded-2xl shadow-xl p-4 sm:p-5 space-y-3">
            
            {/* Bannière de réponse en cours (Section 24.4) */}
            {replyingTo && (
              <div className="p-2.5 rounded-xl bg-[#EEEAE3] border border-[#D9D2C7] flex items-center justify-between text-xs text-[#211D19]">
                <div className="flex items-center gap-2 truncate pr-2">
                  <CornerDownRight className="w-4 h-4 text-[#6C4935] shrink-0" />
                  <span className="font-semibold">
                    Réponse à {replyingTo.author.firstName} {replyingTo.author.lastName} :
                  </span>
                  <span className="text-[#645C54] italic truncate">
                    {replyingTo.isRetracted ? "Message retiré" : replyingTo.content}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="w-6 h-6 rounded-md hover:bg-[#D9D2C7]/60 flex items-center justify-center text-[#645C54] shrink-0"
                  aria-label="Annuler la réponse"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Vignettes photos avant envoi (Section 24.3) */}
            {attachments.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {attachments.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#D9D2C7] shrink-0 group">
                    <img src={url} alt="Aperçu" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#211D19]/80 text-[#F7F5F0] flex items-center justify-center text-[10px] hover:bg-red-800 transition-colors"
                      title="Retirer cette photo"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Zone de texte 4 000 caractères */}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  maxLength={4000}
                  placeholder="Écrire un message dans Le Salon..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#D9D2C7] text-xs sm:text-sm text-[#211D19] focus:outline-none focus:border-[#A88958] resize-none transition-colors"
                />

                {/* Compteur visible à l'approche de la limite (Section 24.2) */}
                {content.length >= 3500 && (
                  <span className="absolute bottom-2 right-3 text-[10px] font-mono text-[#6C4935] font-semibold">
                    {4000 - content.length} car. restants
                  </span>
                )}
              </div>

              {sendError && (
                <div className="text-xs text-red-800 font-medium">
                  {sendError}
                </div>
              )}

              {/* Barre d'outils du compositeur */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  {/* Bouton Ajouter une photo (max 4) */}
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    disabled={attachments.length >= 4}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9D2C7] text-xs font-semibold text-[#645C54] hover:text-[#211D19] hover:bg-[#EEEAE3] transition-colors disabled:opacity-50"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#6C4935]" />
                    <span>Ajouter photo ({attachments.length}/4)</span>
                  </button>

                  <span className="text-[11px] text-[#857A6D] hidden md:inline">
                    Entrée envoie · Maj+Entrée insère une ligne
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[10px] text-[#857A6D] italic">
                    Visibles par les membres du Salon
                  </span>

                  <button
                    type="submit"
                    disabled={sending || (!content.trim() && attachments.length === 0)}
                    className="btn-ink-primary text-xs px-5 py-2 flex items-center gap-2 disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-[#A88958]" />
                    )}
                    <span>Envoyer</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODALE : RÈGLES DU SALON (Section 25.2)                  */}
      {/* ======================================================== */}
      {isCharterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#211D19]/65 backdrop-blur-sm" onClick={() => setIsCharterOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#F7F5F0] border border-[#D9D2C7] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D2C7]">
              <div className="flex items-center gap-2 text-[#211D19] font-serif font-bold text-lg">
                <ShieldCheck className="w-5 h-5 text-[#365343]" />
                <span>Charte & Règles du Salon</span>
              </div>
              <button onClick={() => setIsCharterOpen(false)} className="text-[#645C54] hover:text-[#211D19]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#211D19] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                <div className="font-bold text-[#6C4935]">1. Dignité & Respect Confraternel</div>
                <p className="text-[#645C54]">
                  Le Salon est un espace de discussion bienveillant. Aucun propos discourtois, diffamatoire ou prosélyte n'est toléré.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                <div className="font-bold text-[#6C4935]">2. Zéro Prospection & Spam Commercial</div>
                <p className="text-[#645C54]">
                  Toute sollicitation commerciale non autorisée, revente pirate ou lien suspect entraîne la suspension immédiate du compte.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                <div className="font-bold text-[#6C4935]">3. Confidentialité des Caves</div>
                <p className="text-[#645C54]">
                  Ne divulguez jamais les adresses personnelles, les factures privées ou les coordonnées d'un autre membre.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-1">
                <div className="font-bold text-[#365343]">4. Avis & Non-Certification</div>
                <p className="text-[#645C54]">
                  Les échanges d'identification sur bague ou code boîte constituent des avis communautaires et ne valent pas certification d'authenticité.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D9D2C7] flex justify-end">
              <button
                type="button"
                onClick={() => setIsCharterOpen(false)}
                className="btn-ink-primary text-xs px-5 py-2"
              >
                J'ai pris connaissance des règles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALE : MODIFICATION D'UN MESSAGE (Section 24.4)        */}
      {/* ======================================================== */}
      {editingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#211D19]/65 backdrop-blur-sm" onClick={() => setEditingMessage(null)} />
          <div className="relative w-full max-w-lg bg-[#FFFFFF] border border-[#D9D2C7] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D2C7]">
              <h3 className="font-serif font-bold text-base text-[#211D19]">
                Modifier votre message
              </h3>
              <button onClick={() => setEditingMessage(null)} className="text-[#645C54] hover:text-[#211D19]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={4}
              maxLength={4000}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#D9D2C7] text-xs text-[#211D19] focus:outline-none focus:border-[#A88958]"
            />

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-[11px] text-[#857A6D]">
                La mention « (modifié) » sera affichée.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMessage(null)}
                  className="px-3 py-1.5 text-[#645C54] hover:text-[#211D19]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={submittingEdit || !editContent.trim()}
                  className="btn-ink-primary text-xs px-4 py-2"
                >
                  {submittingEdit ? "Enregistrement..." : "Mettre à jour"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALE : SIGNALEMENT AUX MODÉRATEURS (Section 25.3)       */}
      {/* ======================================================== */}
      {reportingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#211D19]/65 backdrop-blur-sm" onClick={() => setReportingMessage(null)} />
          <div className="relative w-full max-w-md bg-[#FFFFFF] border border-[#D9D2C7] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9D2C7]">
              <div className="flex items-center gap-2 text-red-900 font-serif font-bold text-base">
                <Flag className="w-4 h-4 text-red-800" />
                <span>Signaler un message</span>
              </div>
              <button onClick={() => setReportingMessage(null)} className="text-[#645C54] hover:text-[#211D19]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-[#365343]/10 border border-[#365343]/30 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-[#365343] mx-auto" />
                <p className="text-xs text-[#211D19] font-medium">{reportSuccess}</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
                    Motif du signalement
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F5F0] border border-[#D9D2C7] text-xs text-[#211D19]"
                  >
                    <option value="SPAM">Spam / Publicité non autorisée</option>
                    <option value="ABUSIVE">Comportement abusif / Harcèlement</option>
                    <option value="PERSONAL_INFO">Divulgation d'informations personnelles</option>
                    <option value="INAPPROPRIATE">Contenu inapproprié ou illicite</option>
                    <option value="OTHER">Autre problème de conformité</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold uppercase tracking-wider text-[#211D19]">
                    Précisions pour les modérateurs (Facultatif)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Détails complémentaires utiles à l'examen..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7F5F0] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>

                <div className="pt-3 border-t border-[#D9D2C7] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReportingMessage(null)}
                    className="px-3 py-1.5 text-[#645C54]"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveReport}
                    disabled={submittingReport}
                    className="px-4 py-2 rounded-full bg-red-900 text-[#FAF7F2] text-xs font-semibold hover:bg-red-800 transition-colors"
                  >
                    {submittingReport ? "Transmission..." : "Confirmer le signalement"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* LIGHTBOX PLEIN ÉCRAN ACCESSIBLE (Section 24.3)           */}
      {/* ======================================================== */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211D19]/90 backdrop-blur-md"
          onClick={() => setActiveLightboxImage(null)}
        >
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFFFFF]/20 text-[#FAF7F2] hover:bg-[#FFFFFF]/40 flex items-center justify-center transition-colors"
            aria-label="Fermer la photographie"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImage}
            alt="Photographie agrandie"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-[#D9D2C7]/30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </div>
  );
};
