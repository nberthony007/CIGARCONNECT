"use client";

import React, { useState } from "react";
import { 
  ArrowLeftRight, 
  ShieldAlert, 
  Wrench, 
  MessageSquare, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Lock, 
  Send,
  HelpCircle,
  EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createSupportCase } from "@/lib/actions/support";

interface CreateCaseFormProps {
  initialCategory?: string;
  initialTradeId?: string;
  initialArticleSlug?: string;
}

export const CreateCaseForm: React.FC<CreateCaseFormProps> = ({
  initialCategory = "GENERAL",
  initialTradeId,
  initialArticleSlug,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const [category, setCategory] = useState<string>(initialCategory);
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>(user?.email || "");
  const [contactName, setContactName] = useState<string>(
    user ? `${user.firstName} ${user.lastName}` : ""
  );
  const [tradeId, setTradeId] = useState<string>(initialTradeId || "");
  const [blockUserImmediately, setBlockUserImmediately] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<{ name: string; size: number; url: string; type: string }>>([]);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  // Simulation d'ajout de fichier (limité à 5 fichiers de 10 Mo)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 5) {
      alert("Vous ne pouvez pas joindre plus de 5 fichiers.");
      return;
    }

    const newFiles = selected.map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      type: file.type || "application/octet-stream"
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!subject.trim()) {
      setErrorMessage("Veuillez indiquer un sujet concis (max 120 caractères).");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Veuillez décrire précisément les faits et le problème rencontré.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createSupportCase({
        category: category as any,
        subject: subject.trim(),
        description: description.trim(),
        requesterId: user?.id,
        requesterEmail: contactEmail.trim(),
        requesterName: contactName.trim() || undefined,
        associatedArticleSlug: initialArticleSlug,
        contextType: category === "TRADE_ISSUE" && tradeId ? "TRADE" : undefined,
        contextId: tradeId || undefined,
        contextSummary: tradeId ? `Dossier lié à l'échange #${tradeId}` : undefined,
        clientMetadata: {
          route: window.location.pathname,
          browser: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : undefined,
          appVersion: "1.0.0"
        },
        attachments: files.map((f) => ({
          fileName: f.name,
          fileUrl: f.url,
          fileSizeBytes: f.size,
          mimeType: f.type
        }))
      });

      if (res.success && res.reference) {
        setSuccessReference(res.reference);
        // Redirection après 2 secondes vers le dossier
        setTimeout(() => {
          if (res.caseId) {
            router.push(`/app/assistance/${res.caseId}`);
          } else {
            router.push("/app/assistance");
          }
        }, 1800);
      } else {
        setErrorMessage(res.error || "Une erreur est survenue lors de l'enregistrement.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Impossible de joindre le serveur. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  if (successReference) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] text-center shadow-lg animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-[#EBF0EC] border border-[#35483F] flex items-center justify-center text-[#35483F] mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#AA8959] font-bold">
          Demande Enregistrée
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#241E1A] mt-1">
          Votre dossier a été transmis avec succès
        </h2>
        <div className="mt-4 inline-block font-mono text-base font-bold text-[#241E1A] bg-[#FAF8F5] border border-[#D9D0C2] px-4 py-2 rounded-xl">
          Référence publique : {successReference}
        </div>
        <p className="text-xs sm:text-sm text-[#71513B] mt-4 max-w-md mx-auto leading-relaxed">
          Un accusé de réception a été généré. Votre demande est désormais placée dans la file d'instruction de nos conservateurs. Redirection vers votre dossier en cours...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] shadow-sm">
      {/* 1. Sélection de la catégorie */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-3">
          1. Motif de votre demande
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              id: "GENERAL",
              label: "Assistance Générale",
              desc: "Question d'usage, cave ou traçabilité",
              icon: MessageSquare
            },
            {
              id: "TRADE_ISSUE",
              label: "Problème avec un Échange",
              desc: "Médiation écrite sur une transaction",
              icon: ArrowLeftRight
            },
            {
              id: "REPORT_MEMBER",
              label: "Signaler un Comportement",
              desc: "Propos inappropriés, contrefaçon",
              icon: ShieldAlert
            },
            {
              id: "TECHNICAL",
              label: "Problème Technique",
              desc: "Accès, connexion, bug d'affichage",
              icon: Wrench
            },
          ].map((item) => {
            const isSelected = category === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                  isSelected
                    ? "bg-[#FAF8F5] border-[#241E1A] ring-1 ring-[#241E1A]"
                    : "bg-[#FFFFFF] border-[#D9D0C2] hover:border-[#AA8959]"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-[#241E1A] text-[#F4F0E7]" : "bg-[#FAF8F5] text-[#71513B]"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#241E1A]">{item.label}</div>
                  <div className="text-[11px] text-[#71513B] mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Spécificité Échange ou Signalement */}
      {category === "TRADE_ISSUE" && (
        <div className="mb-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2]">
          <label className="block text-xs font-bold text-[#241E1A] mb-1">
            Référence de l'échange concerné (facultatif si unique) :
          </label>
          <input
            type="text"
            value={tradeId}
            onChange={(e) => setTradeId(e.target.value)}
            placeholder="Ex : trade-001 ou laisser vide"
            className="w-full px-3.5 py-2 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A] focus:outline-none focus:border-[#AA8959]"
          />
          <p className="text-[11px] text-[#71513B] mt-1.5">
            L'ouverture de cette demande n'annule pas automatiquement votre accord ni vos réservations de cave. Seuls les éléments strictement liés à cet échange seront consultables par le médiateur.
          </p>
        </div>
      )}

      {category === "REPORT_MEMBER" && (
        <div className="mb-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2]">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="blockUserCheck"
              checked={blockUserImmediately}
              onChange={(e) => setBlockUserImmediately(e.target.checked)}
              className="mt-1 rounded border-[#D9D0C2] text-[#241E1A] focus:ring-[#AA8959]"
            />
            <label htmlFor="blockUserCheck" className="text-xs text-[#241E1A] leading-relaxed">
              <strong>Bloquer immédiatement cette personne</strong> pour l'empêcher d'interagir avec vous dans Le Salon et Le Cercle.
              <span className="block text-[11px] text-[#71513B] mt-0.5">
                La personne signalée ne sera <strong>jamais informée</strong> de votre identité ni des détails transmis.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* 3. Coordonnées de contact si invité / hors connexion */}
      {!user && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-1.5">
              Votre adresse e-mail *
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="aficionado@cigarconnect.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A] focus:outline-none focus:border-[#AA8959]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-1.5">
              Votre nom ou pseudonyme
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Ex : Alexandre de M."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] text-xs text-[#241E1A] focus:outline-none focus:border-[#AA8959]"
            />
          </div>
        </div>
      )}

      {/* 4. Sujet court (max 120 chars) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider">
            2. Objet de la demande *
          </label>
          <span className={`text-[11px] ${subject.length > 110 ? "text-[#8A2B2B]" : "text-[#71513B]"}`}>
            {subject.length} / 120
          </span>
        </div>
        <input
          type="text"
          required
          maxLength={120}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex : Différence de millésime constatée lors de la réception du coffret Cohiba"
          className="w-full px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] text-sm text-[#241E1A] placeholder-[#71513B]/60 focus:outline-none focus:border-[#AA8959] focus:ring-1 focus:ring-[#AA8959] shadow-sm transition-all"
        />
      </div>

      {/* 5. Description détaillée des faits (max 10 000 chars) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider">
            3. Exposé factuel des éléments *
          </label>
          <span className="text-[11px] text-[#71513B]">
            {description.length} / 10 000
          </span>
        </div>
        <textarea
          required
          rows={6}
          maxLength={10000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez ce que vous essayiez de faire, ce qui a été convenu, et ce qui a été constaté..."
          className="w-full px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#D9D0C2] text-xs sm:text-sm text-[#241E1A] placeholder-[#71513B]/60 focus:outline-none focus:border-[#AA8959] focus:ring-1 focus:ring-[#AA8959] shadow-sm transition-all leading-relaxed"
        />
      </div>

      {/* 6. Pièces jointes sécurisées (max 5 fichiers, 10Mo) */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-[#71513B] uppercase tracking-wider mb-2">
          4. Pièces justificatives ou photographies (facultatif, max 5)
        </label>
        
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] hover:border-[#AA8959] text-xs font-semibold text-[#241E1A] transition-all">
            <Upload className="w-4 h-4 text-[#AA8959]" />
            <span>Joindre un document ou une photo</span>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-[11px] text-[#71513B]">
            PNG, JPEG, WebP ou PDF (10 Mo max par fichier). Pensez à masquer les coordonnées privées superflues.
          </span>
        </div>

        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#D9D0C2] text-xs text-[#241E1A]"
              >
                <FileText className="w-3.5 h-3.5 text-[#AA8959]" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <span className="text-[10px] text-[#71513B]">
                  ({Math.round(file.size / 1024)} Ko)
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="hover:text-[#8A2B2B] ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Récapitulatif de transmission déontologique */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] text-xs text-[#71513B] mb-8 leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-[#241E1A] mb-1">
          <Lock className="w-3.5 h-3.5 text-[#35483F]" />
          <span>Ce qui sera transmis à l'équipe CigarConnect :</span>
        </div>
        <p>
          Votre sujet, votre description, les pièces jointes sélectionnées et la route consultée. Vos notes de cave privées, autres conversations et coordonnées non nécessaires restent protégées. Les correspondances de médiation sont recueillies séparément.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#E8B4B4] text-xs text-[#8A2B2B] mb-6 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Bouton de soumission */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D9D0C2]">
        <p className="text-[11px] text-[#71513B]">
          En envoyant cette demande, vous acceptez l'instruction écrite selon la charte du Cercle.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-bold hover:bg-[#352B24] active:scale-95 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Enregistrement en cours...</span>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#AA8959]" />
              <span>Envoyer ma demande</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
