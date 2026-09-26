import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeftRight, 
  Lock, 
  Wrench, 
  MessageSquare, 
  ExternalLink,
  LifeBuoy
} from "lucide-react";
import { getHelpArticles } from "@/lib/actions/support";

export const dynamic = "force-dynamic";

interface AidePageProps {
  searchParams: Promise<{ cat?: string; q?: string }>;
}

export default async function AidePage({ searchParams }: AidePageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.cat || "ALL";
  const currentQuery = resolvedParams.q || "";

  const articles = await getHelpArticles(currentCategory, currentQuery);

  const categories = [
    { id: "ALL", label: "Tous les guides" },
    { id: "HUMIDOR", label: "Humidor & Cave" },
    { id: "ECHANGES", label: "Le Cercle & Troc" },
    { id: "CATALOGUE", label: "Traçabilité & Codes" },
    { id: "CONFIDENTIALITE", label: "Confidentialité" },
    { id: "SIGNALEMENTS", label: "Signalements" },
    { id: "SALON", label: "Le Salon" },
    { id: "ASSISTANCE", label: "Recours & Médiation" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#241E1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête héro sobre et patrimonial */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#D9D0C2] text-xs uppercase tracking-widest text-[#AA8959] font-bold mb-4">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Base de Connaissances & Médiation</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#241E1A] tracking-tight">
            Centre d'Aide & d'Érudition
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#71513B] leading-relaxed">
            Consultez les guides officiels sur la conservation muséale, la traçabilité des vitoles, les règles du Cercle et nos protocoles de médiation écrite.
          </p>

          {/* Formulaire de recherche */}
          <form method="GET" action="/aide" className="mt-8 relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71513B]/70" />
            <input
              type="text"
              name="q"
              defaultValue={currentQuery}
              placeholder="Rechercher une vitole, une règle de cave, un terme..."
              className="w-full pl-12 pr-28 py-3.5 rounded-full bg-[#FFFFFF] border border-[#D9D0C2] text-sm text-[#241E1A] placeholder-[#71513B]/60 shadow-sm focus:outline-none focus:border-[#AA8959] focus:ring-1 focus:ring-[#AA8959] transition-all"
            />
            {currentCategory !== "ALL" && (
              <input type="hidden" name="cat" value={currentCategory} />
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-semibold hover:bg-[#352B24] transition-colors"
            >
              Rechercher
            </button>
          </form>
        </div>

        {/* Barre de filtres par catégories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 text-xs scrollbar-none border-b border-[#D9D0C2]">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/aide?cat=${cat.id}${currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""}`}
                className={`px-4 py-2 rounded-full font-semibold transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#241E1A] text-[#F4F0E7] shadow-sm"
                    : "bg-[#FFFFFF] text-[#71513B] border border-[#D9D0C2] hover:border-[#AA8959] hover:text-[#241E1A]"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Grille des articles */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Link
                key={art.slug}
                href={`/aide/${art.slug}`}
                className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#D9D0C2] hover:border-[#AA8959] hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#AA8959] mb-2.5">
                    <span>{art.category}</span>
                    <span className="text-[#71513B]/70 font-mono">v{art.version}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#241E1A] group-hover:text-[#71513B] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-[#71513B] leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#D9D0C2]/50 flex items-center justify-between text-xs font-semibold text-[#241E1A] group-hover:text-[#AA8959] transition-colors">
                  <span>Lire la notice complète</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] border border-[#D9D0C2]">
            <BookOpen className="w-12 h-12 text-[#AA8959] mx-auto mb-4 stroke-1" />
            <h3 className="font-serif text-xl font-bold text-[#241E1A]">Aucun guide ne correspond à votre recherche</h3>
            <p className="text-xs text-[#71513B] mt-2 max-w-md mx-auto">
              Essayez d'autres mots-clés ou sélectionnez une autre catégorie pour consulter nos fiches documentaires.
            </p>
            <div className="mt-6">
              <Link
                href="/aide"
                className="px-5 py-2.5 rounded-full bg-[#241E1A] text-[#F4F0E7] text-xs font-semibold hover:bg-[#352B24] transition-colors inline-block"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          </div>
        )}

        {/* Bannière d'accès direct au support humain */}
        <div className="mt-16 p-8 rounded-2xl bg-[#241E1A] text-[#F4F0E7] border border-[#D9D0C2]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-[#AA8959] font-bold">
              Assistance & Médiation Asynchrone
            </span>
            <h3 className="font-serif text-2xl font-bold mt-1 text-[#F4F0E7]">
              Besoin d'un accompagnement personnalisé ou d'une médiation ?
            </h3>
            <p className="text-xs text-[#D9D0C2] mt-2 leading-relaxed">
              Nos agents et médiateurs examinent chaque situation de manière écrite, documentée et impartiale. Sans délai artificiel ni chatbot automatisé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/app/assistance/nouvelle"
              className="px-6 py-3 rounded-full bg-[#AA8959] text-[#241E1A] text-xs font-bold hover:bg-[#C2A373] active:scale-95 transition-all shadow-md"
            >
              Déposer une demande écrite
            </Link>
            <Link
              href="/app/assistance"
              className="px-6 py-3 rounded-full bg-transparent border border-[#D9D0C2]/40 text-[#F4F0E7] text-xs font-semibold hover:bg-[#FFFFFF]/10 transition-colors"
            >
              Mes demandes en cours
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
