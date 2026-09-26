import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronLeft, 
  BookOpen, 
  ExternalLink, 
  Clock, 
  UserCheck, 
  ShieldCheck,
  Calendar,
  Share2
} from "lucide-react";
import { getHelpArticleBySlug } from "@/lib/actions/support";
import { ArticleFeedbackWidget } from "@/components/support/ArticleFeedbackWidget";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function HelpArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getHelpArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Formatage de la date
  const reviewDateStr = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(article.lastReviewedAt));

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#241E1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Fil d'ariane & Bouton Retour */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/aide"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71513B] hover:text-[#241E1A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour aux guides d'assistance</span>
          </Link>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#AA8959] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#D9D0C2]">
            {article.category} · v{article.version}
          </span>
        </div>

        {/* Fiche documentaire principale */}
        <article className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#D9D0C2] shadow-sm">
          {/* Métadonnées de l'article */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#71513B] pb-6 border-b border-[#D9D0C2]">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#AA8959]" />
              <span>{article.authorName}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#AA8959]" />
              <span>Dernière révision : {reviewDateStr}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#35483F]" />
              <span>Procédure certifiée conforme</span>
            </div>
          </div>

          {/* Titre & Résumé */}
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#241E1A] mt-6 leading-tight">
            {article.title}
          </h1>

          <div className="mt-4 p-4 rounded-xl bg-[#FAF8F5] border-l-4 border-[#AA8959] text-sm text-[#71513B] leading-relaxed">
            <strong>Synthèse :</strong> {article.summary}
          </div>

          {/* Action directe liée à l'article (ex: Ouvrir mon humidor) */}
          {article.actionUrl && article.actionLabel && (
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={article.actionUrl}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-semibold hover:bg-[#352B24] active:scale-95 transition-all shadow-sm"
              >
                <span>{article.actionLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Corps de l'article */}
          <div className="mt-8 prose prose-stone max-w-none text-sm text-[#241E1A] leading-relaxed space-y-4">
            {article.content.split("\n\n").map((block, idx) => {
              if (block.startsWith("### ")) {
                return (
                  <h2 key={idx} className="font-serif text-xl font-bold text-[#241E1A] mt-8 mb-3">
                    {block.replace("### ", "")}
                  </h2>
                );
              }
              if (block.startsWith("1. ") || block.startsWith("- ")) {
                const lines = block.split("\n");
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#71513B]">
                    {lines.map((l, lIdx) => (
                      <li key={lIdx}>
                        {l.replace(/^[0-9]+\.\s/, "").replace(/^-\s/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="text-xs sm:text-sm text-[#71513B] leading-relaxed">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Widget d'utilité et d'escalade */}
          <ArticleFeedbackWidget
            slug={article.slug}
            initialHelpful={article.helpfulCount}
            initialUnhelpful={article.unhelpfulCount}
          />
        </article>
      </div>
    </div>
  );
}
