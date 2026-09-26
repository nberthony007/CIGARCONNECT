"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { voteArticleHelpful } from "@/lib/actions/support";

interface ArticleFeedbackWidgetProps {
  slug: string;
  initialHelpful: number;
  initialUnhelpful: number;
}

export const ArticleFeedbackWidget: React.FC<ArticleFeedbackWidgetProps> = ({
  slug,
  initialHelpful,
  initialUnhelpful,
}) => {
  const [voted, setVoted] = useState<boolean>(false);
  const [helpfulCount, setHelpfulCount] = useState<number>(initialHelpful);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleVote = async (isHelpful: boolean) => {
    if (voted || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await voteArticleHelpful(slug, isHelpful);
      setVoted(true);
      if (isHelpful) setHelpfulCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-[#D9D0C2] flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Vote d'utilité */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-[#71513B]">
          Cette réponse vous a-t-elle aidé ?
        </span>
        {voted ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#35483F] bg-[#FAF8F5] px-3 py-1.5 rounded-full border border-[#D9D0C2]">
            <CheckCircle2 className="w-4 h-4 text-[#35483F]" />
            <span>Merci pour votre retour</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D9D0C2] text-xs font-medium text-[#241E1A] hover:border-[#AA8959] hover:bg-[#FAF8F5] active:scale-95 transition-all"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-[#AA8959]" />
              <span>Oui ({helpfulCount})</span>
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D9D0C2] text-xs font-medium text-[#241E1A] hover:border-[#AA8959] hover:bg-[#FAF8F5] active:scale-95 transition-all"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-[#71513B]" />
              <span>Non</span>
            </button>
          </div>
        )}
      </div>

      {/* Escalade vers contact humain avec rattachement du slug */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#71513B]">J'ai encore besoin d'aide :</span>
        <Link
          href={`/app/assistance/nouvelle?cat=GENERAL&art=${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#241E1A] bg-[#FFFFFF] border border-[#241E1A] hover:bg-[#241E1A] hover:text-[#F4F0E7] px-4 py-2 rounded-full transition-all shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Poser ma question à l'équipe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
