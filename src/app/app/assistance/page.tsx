import React from "react";
import Link from "next/link";
import { 
  LifeBuoy, 
  Plus, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeftRight, 
  ShieldAlert, 
  Wrench, 
  MessageSquare,
  HelpCircle
} from "lucide-react";
import { getUserSupportCases } from "@/lib/actions/support";

export const dynamic = "force-dynamic";

export default async function MemberAssistanceDashboardPage() {
  // En phase pilote ou avec utilisateur de test, récupère les demandes existantes
  const cases = await getUserSupportCases("usr_alexandre_01");

  const getStatusBadge = (status: string, needsAction: boolean) => {
    if (needsAction) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF2DE] text-[#8C6D23] border border-[#E8D49E] animate-pulse">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Votre réponse est attendue</span>
        </span>
      );
    }

    switch (status) {
      case "new":
      case "triage":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#71513B] border border-[#D9D0C2]">
            <Clock className="w-3.5 h-3.5" />
            <span>Demande reçue</span>
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#EBF0EC] text-[#35483F] border border-[#35483F]/30">
            <Clock className="w-3.5 h-3.5" />
            <span>En cours d'examen</span>
          </span>
        );
      case "waiting_other_party":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#71513B] border border-[#D9D0C2]">
            <span>Examen auprès de l'autre partie</span>
          </span>
        );
      case "proposal_pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FAF2DE] text-[#8C6D23] border border-[#AA8959]">
            <span>Résolution proposée</span>
          </span>
        );
      case "agreement_follow_up":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF0EC] text-[#35483F] border border-[#35483F]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accord en cours de suivi</span>
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#71513B]/70 border border-[#D9D0C2]">
            <span>Demande clôturée</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FAF8F5] text-[#71513B] border border-[#D9D0C2]">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "TRADE_ISSUE":
        return { label: "Médiation Échange", icon: ArrowLeftRight };
      case "REPORT_MEMBER":
        return { label: "Signalement", icon: ShieldAlert };
      case "TECHNICAL":
        return { label: "Assistance Technique", icon: Wrench };
      default:
        return { label: "Demande Générale", icon: MessageSquare };
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#241E1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête de section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-[#D9D0C2] gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#AA8959] font-bold">
              <LifeBuoy className="w-4 h-4" />
              <span>Espace Personnel de Médiation</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#241E1A] mt-1">
              Mes Demandes d'Assistance
            </h1>
            <p className="text-xs sm:text-sm text-[#71513B] mt-1.5 max-w-xl">
              Retrouvez l'historique de vos requêtes écrites, l'état d'instruction de vos dossiers et les échanges confidentiels avec nos conservateurs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/app/assistance/nouvelle"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-semibold hover:bg-[#352B24] active:scale-95 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#AA8959]" />
              <span>Nouvelle demande</span>
            </Link>
          </div>
        </div>

        {/* Liste des dossiers ou état vide */}
        {cases.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cases.map((c) => {
              const { label: catLabel, icon: CatIcon } = getCategoryLabel(c.category);
              const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              }).format(new Date(c.updatedAt));

              return (
                <Link
                  key={c.id}
                  href={`/app/assistance/${c.id}`}
                  className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9D0C2] hover:border-[#AA8959] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#D9D0C2] flex items-center justify-center text-[#71513B] shrink-0 group-hover:bg-[#241E1A] group-hover:text-[#F4F0E7] transition-colors mt-0.5">
                      <CatIcon className="w-5 h-5" strokeWidth={1.8} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-[#AA8959] bg-[#FAF8F5] px-2.5 py-0.5 rounded border border-[#D9D0C2]">
                          {c.reference}
                        </span>
                        <span className="text-xs text-[#71513B] font-semibold">
                          {catLabel}
                        </span>
                        <span>·</span>
                        {getStatusBadge(c.status, c.needsActionFromUser)}
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#241E1A] group-hover:text-[#71513B] transition-colors">
                        {c.subject}
                      </h3>

                      <p className="text-xs text-[#71513B] mt-1 line-clamp-1">
                        Dernière note : {c.lastActivityText}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[#D9D0C2]/50 text-xs text-[#71513B] shrink-0">
                    <span className="text-[11px] text-[#71513B]/80">{formattedDate}</span>
                    <span className="mt-1 font-semibold text-[#241E1A] group-hover:text-[#AA8959] flex items-center gap-1 transition-colors">
                      <span>Consulter le dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2]">
            <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#D9D0C2] flex items-center justify-center text-[#AA8959] mx-auto mb-4">
              <HelpCircle className="w-7 h-7 stroke-1" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#241E1A]">
              Aucune demande enregistrée pour le moment
            </h3>
            <p className="text-xs sm:text-sm text-[#71513B] mt-2 max-w-md mx-auto leading-relaxed">
              Vous n'avez aucun dossier d'assistance ou de médiation ouvert. Si vous rencontrez une difficulté sur un échange ou souhaitez signaler un fait, notre équipe reste à votre écoute.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app/assistance/nouvelle"
                className="px-6 py-2.5 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-semibold hover:bg-[#352B24] transition-colors"
              >
                Déposer une nouvelle demande
              </Link>
              <Link
                href="/aide"
                className="px-6 py-2.5 rounded-full bg-[#FFFFFF] border border-[#D9D0C2] text-[#241E1A] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
              >
                Consulter les guides du Cercle
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
