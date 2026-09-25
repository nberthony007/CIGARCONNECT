import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Calendar, ShieldCheck, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { getSponsoredCampaign } from "@/lib/actions/sponsors";
import { SponsoredPlacement } from "@/components/ui/SponsoredPlacement";

export const metadata: Metadata = {
  title: "Le Journal de la Manufacture — Récits & Savoir | CigarConnect",
  description:
    "Articles de fond, rituels de conservation, décodage des codes boîtes de La Havane et chroniques de dégustation rédigés par les conservateurs du cercle CigarConnect.",
};

const articles = [
  {
    id: "art-1",
    title: "L'art de l'hygrométrie : pourquoi la règle des 68–70% protège les huiles essentielles",
    category: "Conservation & Rituels",
    date: "14 Septembre 2026",
    readTime: "7 min de lecture",
    author: "Jean-Marc L.",
    authorRole: "Conservateur de cave (Genève)",
    imageUrl: "/assets/cigar-davidoff.jpg",
    excerpt:
      "Comprendre la tension de vapeur d'eau et son impact sur la capillarité de la cape. Pourquoi un taux inférieur à 65% calcifie le tabac et un taux supérieur à 72% étouffe le tirage et altère les notes de tête.",
    fullContent: [
      "Dans le silence des caves régulées, la vitole respire. Pour l'aficionado exigeant, l'humidité relative n'est pas une simple recommandation technique : c'est le garant biologique de la survie des huiles essentielles de la feuille de tabac.",
      "À 68–70% HR et une température stabilisée entre 18°C et 20°C, les capes grasses conservent une élasticité soyeuse au toucher. La combustion s'effectue à un rythme modéré, libérant les composés aromatiques sans surchauffe de la braise.",
      "Le cèdre d'Espagne (Cedrela odorata), grâce à ses résines naturelles et sa porosité unique, amortit les variations hygrométriques ambiantes tout en éloignant naturellement les parasites sans aucun traitement chimique.",
    ],
  },
  {
    id: "art-2",
    title: "Les secrets des codes usines de La Havane : décoder le mois et la manufacture",
    category: "Traçabilité & Codes Usine",
    date: "02 Août 2026",
    readTime: "9 min de lecture",
    author: "Alexandre de M.",
    authorRole: "Collectionneur aficionado (Paris)",
    imageUrl: "/assets/hero-cigar-library.jpg",
    excerpt:
      "De la codification historique NIVELACUSO aux codes modernes à trois et quatre lettres : méthodologie rigoureuse pour dater précisément vos coffrets scellés et authentifier leur atelier d'origine.",
    fullContent: [
      "Depuis les années 1980, les manufactures cubaines apposent un tampon à chaud et un code encré sous chaque boîte scellée. Déchiffrer ces inscriptions est la première étape de toute expertise patrimoniale.",
      "Le système classique NIVELACUSO attribuait à chaque chiffre de 0 à 9 une lettre du mot-clef (N=1, I=2, V=3, etc.). Les codes modernes adoptent une nomenclature rotative confidentielle pour préserver les ateliers contre les contrefaçons.",
      "Chez CigarConnect, la vérification du code boîte par croisement photographique permet d'assurer une traçabilité irréprochable avant tout accord d'échange dans Le Cercle.",
    ],
  },
  {
    id: "art-3",
    title: "Affinage en cèdre d'Espagne : évolution organoleptique après 15 ans de garde",
    category: "Vieillissement & Terroirs",
    date: "18 Juillet 2026",
    readTime: "6 min de lecture",
    author: "Lord Kensington",
    authorRole: "Membre du Cercle (Londres)",
    imageUrl: "/assets/cigar-montecristo.jpg",
    excerpt:
      "Comment les tanins du tabac se fondent avec les essences du bois au fil des décennies. Analyse comparée d'un millésime 2005 dégusté à la sortie de manufacture versus après 15 années en cabinet fermé.",
    fullContent: [
      "Le vieillissement d'un grand cru de La Havane ressemble à celui d'un premier cru de Bordeaux : l'amertume de jeunesse et la puissance brute des alcaloïdes cèdent la place à une rondeur veloutée.",
      "Après dix ans sous une atmosphère rigoureusement stabilisée à 69% HR, les feuilles de tripe s'harmonisent. Les notes animales et terreuses évoluent vers des nuances de cuir patiné, de sous-bois, de fèves de cacao torréfiées et de cèdre noble.",
    ],
  },
  {
    id: "art-4",
    title: "L'empreinte du Medio Tiempo dans la lignée Behike : histoire d'une récolte d'exception",
    category: "Terroirs de Légende",
    date: "29 Mai 2026",
    readTime: "8 min de lecture",
    author: "Philippe V.",
    authorRole: "Conservateur associé (Bordeaux)",
    imageUrl: "/assets/cigar-behike56.jpg",
    excerpt:
      "Ces deux petites feuilles cueillies au sommet du plant de tabac sous le soleil direct de San Juan y Martínez, qui confèrent à la gamme BHK sa force crémeuse et sa rareté absolue.",
    fullContent: [
      "Toutes les récoltes n'en produisent pas. Le Medio Tiempo n'apparaît que sur les plants les plus vigoureux ayant bénéficié d'une insolation zénithale continue dans les vegas de première classe de la Vuelta Abajo.",
      "Sa présence apporte une densité aromatique incomparable et une longueur en bouche qui défie le temps. C'est la raison pour laquelle les éditions Behike constituent les pièces les plus recherchées du troc entre aficionados avertis.",
    ],
  },
];

export default async function JournalPage() {
  const sponsoredCampaign = await getSponsoredCampaign("JOURNAL_BOX");

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Fil d'Ariane & Retour */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C4935] hover:text-[#211D19] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#857A6D]">
            <BookOpen className="w-3.5 h-3.5 text-[#6C4935]" />
            <span>Édition de référence · 2026</span>
          </div>
        </div>

        {/* En-tête éditorial souverain */}
        <div className="space-y-4 border-b border-[#D9D2C7] pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEEAE3] border border-[#D9D2C7] text-[11px] font-semibold text-[#6C4935] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#A88958]" />
            Transmission & Savoir Partagé
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#211D19] tracking-tight">
            Le Journal de la Manufacture.
          </h1>
          <p className="text-sm sm:text-base text-[#645C54] leading-relaxed max-w-3xl">
            Chroniques d'experts, règles de régulation en cabinet de cèdre et guides d'authentification rédigés par les collectionneurs et conservateurs de CigarConnect.
          </p>
        </div>

        {/* Article Vedette (Grand Format 16:9) */}
        <article className="rounded-3xl border border-[#D9D2C7] bg-[#FFFFFF] overflow-hidden shadow-sm hover:border-[#6C4935] transition-all grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#211D19]">
            <img
              src={articles[0].imageUrl}
              alt={articles[0].title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#6C4935] font-semibold uppercase tracking-wider">
                <span>{articles[0].category}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#857A6D]">
                  <Clock className="w-3.5 h-3.5" />
                  {articles[0].readTime}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211D19] leading-snug">
                {articles[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
                {articles[0].excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[#D9D2C7] flex items-center justify-between text-xs text-[#857A6D]">
              <div>
                Par <strong className="text-[#211D19]">{articles[0].author}</strong>
                <div className="text-[11px] text-[#857A6D]">{articles[0].authorRole}</div>
              </div>
              <span className="text-[11px]">{articles[0].date}</span>
            </div>
          </div>
        </article>

        {/* Grille des Récits d'Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(1).map((article) => (
            <article
              key={article.id}
              className="rounded-2xl border border-[#D9D2C7] bg-[#FFFFFF] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#6C4935] transition-all group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#211D19]">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#6C4935] uppercase tracking-wider">
                    <span>{article.category}</span>
                    <span className="text-[#857A6D] flex items-center gap-1 font-normal">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#211D19] group-hover:text-[#6C4935] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#645C54] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#D9D2C7]/60 mt-4 flex items-center justify-between text-xs text-[#857A6D]">
                <span>
                  Par <strong className="text-[#211D19]">{article.author}</strong>
                </span>
                <span>{article.date}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Espace Sponsorisé Discret sous les articles */}
        {sponsoredCampaign && (
          <div className="pt-6">
            <SponsoredPlacement campaign={sponsoredCampaign} format="banner_16_9" />
          </div>
        )}

        {/* Passerelle vers Le Salon Collectif */}
        <div className="rounded-2xl border border-[#D9D2C7] bg-[#FFFFFF] p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#365343]">
              <span className="w-2 h-2 rounded-full bg-[#365343]" />
              <span>Conversation Collective</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#211D19]">
              Une question sur la conservation de vos pièces ?
            </h3>
            <p className="text-xs sm:text-sm text-[#645C54] leading-relaxed">
              Rejoignez Le Salon pour débattre de ces rituels, partager des photographies de vos cabinets et échanger avec les conservateurs de la communauté.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/salon"
              className="btn-ink-primary flex items-center gap-2 px-6 py-3"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Entrer dans Le Salon</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
