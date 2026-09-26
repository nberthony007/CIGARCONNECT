"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==============================================================================
// 1. ARTICLES DU GUIDE ET BASE DE CONNAISSANCES
// ==============================================================================

export interface HelpArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  actionLabel?: string | null;
  actionUrl?: string | null;
  version: string;
  status: string;
  authorName: string;
  helpfulCount: number;
  unhelpfulCount: number;
  lastReviewedAt: Date;
  updatedAt: Date;
}

const INITIAL_HELP_ARTICLES = [
  {
    slug: "ajouter-piece-absente",
    title: "Ajouter une vitole absente du répertoire patrimonial",
    category: "HUMIDOR",
    summary: "Comment enregistrer un module rare, un millésime ancien ou une édition régionale non encore répertoriée.",
    actionLabel: "Ouvrir mon humidor",
    actionUrl: "/humidor",
    content: `### Enregistrement d'une pièce hors catalogue

Le catalogue CigarConnect réunit les grandes vitoles de référence certifiées par les manufactures historiques. Si vous possédez un flaconnage rare, un cabinet numéroté ou une vitole d'auteur :

1. Accédez à votre **Humidor personnel**.
2. Cliquez sur **« Déposer une vitole »** ou **« Ajouter une pièce »**.
3. Cochez l'option **« Vitole personnalisée ou hors catalogue »**.
4. Renseignez la manufacture (marque), le module (vitole), le terroir d'origine et le millésime exact.
5. Indiquez le code boîte inscrit sous le coffret (ex: *BBM MAY 10*) et l'hygrométrie constatée dans votre cave (recommandé : 68% à 70% HR).

*Remarque :* Vos pièces hors catalogue bénéficient des mêmes outils de traçabilité, de valorisation déclarée et d'ouverture au troc sur Le Cercle.`
  },
  {
    slug: "confidentialite-visibilite-cave",
    title: "Choisir qui a accès à la visibilité de votre collection",
    category: "CONFIDENTIALITE",
    summary: "Règles de discrétion native, séparation cave publique / coffre privé et floutage géographique.",
    actionLabel: "Gérer mes préférences",
    actionUrl: "/humidor",
    content: `### Maîtrise absolue de votre patrimoine

CigarConnect a été conçu selon le principe de **confidentialité native pour collectionneurs d'exception** :

- **Séparation par vitole :** Chaque lot dispose d'un commutateur individuel *« Ouvert à l'échange »* ou *« Privé »*. Les pièces privées ne sont visibles que par vous.
- **Masquage des estimations financières :** Par défaut, la valorisation globale de votre humidor est strictement confidentielle. Vous seul choisissez de l'afficher via l'icône dédiée.
- **Localisation approximative :** Seuls le pays et la métropole (ex: *Genève, Suisse* ou *Paris, France*) sont indiqués aux membres du Cercle. Aucune adresse physique n'est jamais exposée ni enregistrée.
- **Accès équipe d'assistance :** Les conservateurs et agents ne peuvent consulter vos fiches de cave que sur autorisation expresse dans le cadre d'un dossier de médiation lié.`
  },
  {
    slug: "authentification-tracabilite-vitoles",
    title: "Comprendre les critères de traçabilité et de contrôle de cave",
    category: "CATALOGUE",
    summary: "Conservation à 68–70% HR, codes d'usine, bagues inviolées et historique d'acquisition.",
    actionLabel: "Vérifier une référence",
    actionUrl: "/#catalogue",
    content: `### Les piliers d'authenticité CigarConnect

Pour maintenir la dignité du Cercle, chaque pièce documentée s'appuie sur une charte muséale :

1. **Hygrométrie et température :** Les pièces admises au troc doivent être conservées entre 18°C et 20°C sous 68% à 70% d'humidité relative constante.
2. **Code fabrique et boîte :** Les 3 lettres de manufacture et la date d'estampillage garantissent la conformité du millésime.
3. **Bague et cape :** La bague d'origine doit être intacte, sans déchirure, et la cape exempte de moisissure invasive.
4. **Conservation documentée :** L'ancienneté d'acquisition et les conditions de repos enrichissent la cote de confiance de chaque aficionado.`
  },
  {
    slug: "proposer-modifier-echange-cercle",
    title: "Proposer, amender ou négocier un échange dans Le Cercle",
    category: "ECHANGES",
    summary: "Fonctionnement du troc pur de gré à gré, propositions diptyques et réservation atomique.",
    actionLabel: "Accéder au Cercle",
    actionUrl: "/trade",
    content: `### L'art du troc entre pairs

Dans Le Cercle, aucun intermédiaire financier n'intervient :

1. **Initiation :** Cliquez sur **« Échanger »** depuis une vitole du catalogue ou de l'humidor d'un membre.
2. **Constitution du diptyque :** Sélectionnez la pièce de votre cave que vous proposez en regard de la vitole souhaitée.
3. **Négociation bilatérale :** Chaque partie peut formuler une contre-offre (ajustement de module, millésime ou quantité).
4. **Réservation atomique :** Dès qu'un accord mutuel est scellé, les vitoles concernées sont réservées pour empêcher tout double engagement.
5. **Confidentialité des échanges :** Vos négociations sont strictement privées entre vous et votre interlocuteur.`
  },
  {
    slug: "confirmer-reception-echange",
    title: "Confirmer la réception physique et la conformité d'une vitole",
    category: "ECHANGES",
    summary: "Vérification à réception, scellement définitif de l'accord et mise à jour des caves.",
    actionLabel: "Consulter mes échanges",
    actionUrl: "/trade",
    content: `### Étape finale d'une transaction scellée

Lorsque la remise en mains propres ou le transfert sécurisé a eu lieu :

1. Inspectez soigneusement le module : intégrité de la cape, souplesse du tirage à cru et conformité de la bague.
2. Ouvrez votre dossier dans **Le Cercle** (/trade).
3. Cliquez sur **« Confirmer la réception conforme »**.
4. Lorsque les deux parties ont validé la bonne réception, l'accord passe au statut **« Clôturé avec succès »** et vos humidors respectifs sont mis à jour.`
  },
  {
    slug: "signaler-message-comportement",
    title: "Signaler un comportement inapproprié ou un message suspect",
    category: "SIGNALEMENTS",
    summary: "Protection des membres, confidentialité du signalement et procédure de modération discrète.",
    actionLabel: "Créer un signalement",
    actionUrl: "/app/assistance/nouvelle?cat=REPORT_MEMBER",
    content: `### Préservation de la courtoisie et de la confiance

CigarConnect applique une tolérance zéro envers les démarchages agressifs, contrefaçons délibérées et propos injurieux :

- **Confidentialité garantie :** La personne signalée n'est **jamais informée** de l'identité de l'auteur du signalement.
- **Blocage immédiat :** Vous pouvez bloquer un membre directement depuis son profil ou un message dans Le Salon.
- **Examen impartial :** L'équipe de modération analyse les faits sans jugement automatique ni arbitrage hâtif.
- **Aucune médiation forcée :** En cas d'intimidation ou de harcèlement, aucune confrontation directe n'est imposée.`
  },
  {
    slug: "utiliser-le-salon-echanges",
    title: "Guide d'usage et étiquette de conversation dans Le Salon",
    category: "SALON",
    summary: "Partage entre passionnés, respect des terroirs et exclusion de toute transaction mercantile directe.",
    actionLabel: "Rejoindre Le Salon",
    actionUrl: "/salon",
    content: `### Le Salon : L'espace d'échange et d'érudition

Le Salon est un carrefour d'échanges culturels dédié aux vitoles d'exception :

- **Érudition et courtoisie :** Partagez vos impressions de dégustation, avis de millésimes et photos de caves.
- **Pas de petites annonces commerciales :** Les propositions de troc structuré se font exclusivement dans **Le Cercle**.
- **Respect mutuel :** Les débats sur les terroirs sont les bienvenus dans un esprit de confrérie.`
  },
  {
    slug: "retrouver-demande-reexamen",
    title: "Retrouver le suivi d'un dossier et demander un réexamen",
    category: "ASSISTANCE",
    summary: "Consulter l'historique, répondre à un médiateur et contester une décision de clôture.",
    actionLabel: "Voir mes demandes",
    actionUrl: "/app/assistance",
    content: `### Suivi transparent et voies de recours

Toute sollicitation adressée à l'équipe fait l'objet d'un numéro de référence unique (ex: *CC-SUP-2026-0842*) :

1. Rendez-vous dans **« Mes demandes »** (/app/assistance).
2. Retrouvez l'état d'avancement, les messages de l'agent et les propositions de médiation.
3. Si un dossier a été clôturé sans accord satisfaisant, vous disposez d'un bouton **« Demander un réexamen »** avec exposé de vos motifs. Votre recours sera réexaminé par un responsable distinct.`
  }
];

export async function seedInitialHelpArticles() {
  try {
    for (const art of INITIAL_HELP_ARTICLES) {
      await prisma.helpArticle.upsert({
        where: { slug: art.slug },
        update: {
          title: art.title,
          category: art.category,
          summary: art.summary,
          content: art.content,
          actionLabel: art.actionLabel,
          actionUrl: art.actionUrl,
        },
        create: {
          slug: art.slug,
          title: art.title,
          category: art.category,
          summary: art.summary,
          content: art.content,
          actionLabel: art.actionLabel,
          actionUrl: art.actionUrl,
          version: "1.0",
          status: "PUBLISHED",
          authorName: "Direction de la Conservation",
        }
      });
    }
  } catch (err) {
    console.error("Erreur lors de l'initialisation des articles d'aide:", err);
  }
}

export async function getHelpArticles(category?: string, query?: string): Promise<HelpArticleItem[]> {
  try {
    // S'assurer de la présence des articles fondamentaux
    const count = await prisma.helpArticle.count();
    if (count === 0) {
      await seedInitialHelpArticles();
    }

    const whereClause: any = { status: "PUBLISHED" };
    if (category && category !== "ALL") {
      whereClause.category = category;
    }
    if (query && query.trim().length > 0) {
      whereClause.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } }
      ];
    }

    const articles = await prisma.helpArticle.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" }
    });

    return articles.map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      summary: a.summary,
      content: a.content,
      actionLabel: a.actionLabel,
      actionUrl: a.actionUrl,
      version: a.version,
      status: a.status,
      authorName: a.authorName,
      helpfulCount: a.helpfulCount,
      unhelpfulCount: a.unhelpfulCount,
      lastReviewedAt: a.lastReviewedAt,
      updatedAt: a.updatedAt,
    }));
  } catch (err) {
    console.error("Erreur getHelpArticles:", err);
    return [];
  }
}

export async function getHelpArticleBySlug(slug: string): Promise<HelpArticleItem | null> {
  try {
    let article = await prisma.helpArticle.findUnique({
      where: { slug }
    });

    if (!article) {
      await seedInitialHelpArticles();
      article = await prisma.helpArticle.findUnique({
        where: { slug }
      });
    }

    if (!article) return null;

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      category: article.category,
      summary: article.summary,
      content: article.content,
      actionLabel: article.actionLabel,
      actionUrl: article.actionUrl,
      version: article.version,
      status: article.status,
      authorName: article.authorName,
      helpfulCount: article.helpfulCount,
      unhelpfulCount: article.unhelpfulCount,
      lastReviewedAt: article.lastReviewedAt,
      updatedAt: article.updatedAt,
    };
  } catch (err) {
    console.error("Erreur getHelpArticleBySlug:", err);
    return null;
  }
}

export async function voteArticleHelpful(slug: string, helpful: boolean) {
  try {
    await prisma.helpArticle.update({
      where: { slug },
      data: helpful 
        ? { helpfulCount: { increment: 1 } }
        : { unhelpfulCount: { increment: 1 } }
    });
    revalidatePath(`/aide/${slug}`);
    return { success: true };
  } catch (err) {
    console.error("Erreur voteArticleHelpful:", err);
    return { success: false };
  }
}

// ==============================================================================
// 2. CRÉATION ET SUIVI DES DEMANDES (CÔTÉ MEMBRE)
// ==============================================================================

export interface CreateCaseParams {
  category: "GENERAL" | "TRADE_ISSUE" | "REPORT_MEMBER" | "TECHNICAL";
  subject: string;
  description: string;
  contextType?: "TRADE" | "MESSAGE" | "PROFILE" | "TECHNICAL_ERROR";
  contextId?: string;
  contextSummary?: string;
  requesterId?: string;
  requesterEmail?: string;
  requesterName?: string;
  associatedArticleSlug?: string;
  clientMetadata?: {
    appVersion?: string;
    route?: string;
    browser?: string;
    errorCode?: string;
  };
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSizeBytes: number;
    mimeType: string;
  }>;
}

export async function createSupportCase(params: CreateCaseParams) {
  try {
    // 1. Validation stricte côté serveur
    if (!params.subject || params.subject.trim().length === 0) {
      return { success: false, error: "Le sujet de la demande est requis." };
    }
    if (params.subject.length > 120) {
      return { success: false, error: "Le sujet ne peut excéder 120 caractères." };
    }
    if (!params.description || params.description.trim().length === 0) {
      return { success: false, error: "La description des faits est requise." };
    }
    if (params.description.length > 10000) {
      return { success: false, error: "La description ne peut excéder 10 000 caractères." };
    }

    // 2. Génération de référence publique non prédictible (ex: CC-SUP-2026-0419)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `CC-SUP-2026-${randomSuffix}`;

    // 3. Détection de priorité initiale
    let initialPriority = "NORMAL";
    if (params.category === "TRADE_ISSUE") initialPriority = "HIGH";
    if (params.category === "REPORT_MEMBER") initialPriority = "HIGH";
    if (params.clientMetadata?.errorCode === "SECURITY_EXPOSURE") initialPriority = "URGENT";

    // 4. Résolution de l'utilisateur si authentifié
    let validRequesterId = params.requesterId;
    if (validRequesterId) {
      const u = await prisma.user.findUnique({ where: { id: validRequesterId } });
      if (!u) validRequesterId = undefined;
    }

    // 5. Création persistée atomique
    const newCase = await prisma.supportCase.create({
      data: {
        reference,
        category: params.category,
        subject: params.subject.trim(),
        description: params.description.trim(),
        status: "new",
        priority: initialPriority,
        requesterId: validRequesterId,
        requesterEmail: params.requesterEmail,
        requesterName: params.requesterName || "Membre CigarConnect",
        associatedArticleSlug: params.associatedArticleSlug,
        clientMetadata: params.clientMetadata ? JSON.stringify(params.clientMetadata) : null,
        events: {
          create: {
            eventType: "STATUS_CHANGE",
            authorName: params.requesterName || "Système",
            description: `Demande enregistrée sous la référence ${reference}. En attente de qualification.`,
            isPublicToRequester: true
          }
        },
        participants: validRequesterId ? {
          create: {
            userId: validRequesterId,
            role: "REQUESTER",
            canViewProposals: true,
            canMessage: true
          }
        } : undefined,
        contextLinks: params.contextType && params.contextId ? {
          create: {
            entityType: params.contextType,
            entityId: params.contextId,
            summary: params.contextSummary || "Élément rattaché à la demande",
            accessScope: "SCOPED_EXCHANGE_ONLY"
          }
        } : undefined,
        attachments: params.attachments && params.attachments.length > 0 ? {
          create: params.attachments.slice(0, 5).map(att => ({
            fileName: att.fileName,
            fileUrl: att.fileUrl,
            fileSizeBytes: att.fileSizeBytes,
            mimeType: att.mimeType,
            visibilityScope: "PUBLIC_TO_CASE",
            uploadedByUserId: validRequesterId
          }))
        } : undefined
      }
    });

    revalidatePath("/app/assistance");
    revalidatePath("/admin/assistance");

    return {
      success: true,
      caseId: newCase.id,
      reference: newCase.reference
    };
  } catch (err: any) {
    console.error("Erreur createSupportCase:", err);
    return { success: false, error: "Impossible d'enregistrer la demande pour l'instant." };
  }
}

export async function getUserSupportCases(userId?: string) {
  try {
    if (!userId) return [];

    const cases = await prisma.supportCase.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { participants: { some: { userId } } }
        ]
      },
      include: {
        assignedAgent: {
          select: { firstName: true, lastName: true, avatarInitials: true }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" }
        },
        events: {
          take: 1,
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return cases.map(c => ({
      id: c.id,
      reference: c.reference,
      category: c.category,
      subject: c.subject,
      status: c.status,
      priority: c.priority,
      outcomeCode: c.outcomeCode,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      assignedAgentName: c.assignedAgent 
        ? `${c.assignedAgent.firstName} ${c.assignedAgent.lastName}` 
        : "Équipe CigarConnect",
      needsActionFromUser: c.status === "waiting_requester" || c.status === "proposal_pending",
      lastActivityText: c.messages[0]?.content.slice(0, 80) || c.events[0]?.description || "Dossier ouvert"
    }));
  } catch (err) {
    console.error("Erreur getUserSupportCases:", err);
    return [];
  }
}

export async function getSupportCaseDetails(caseIdOrRef: string, currentUserId?: string, asStaff: boolean = false) {
  try {
    const c = await prisma.supportCase.findFirst({
      where: {
        OR: [
          { id: caseIdOrRef },
          { reference: caseIdOrRef }
        ]
      },
      include: {
        requester: {
          select: { id: true, firstName: true, lastName: true, city: true, country: true, avatarInitials: true }
        },
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true, avatarInitials: true, role: true }
        },
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatarInitials: true } }
          }
        },
        contextLinks: true,
        events: {
          where: asStaff ? undefined : { isPublicToRequester: true },
          orderBy: { createdAt: "asc" }
        },
        messages: {
          include: {
            attachments: true
          },
          orderBy: { createdAt: "asc" }
        },
        internalNotes: asStaff ? {
          orderBy: { createdAt: "asc" }
        } : false,
        mediationProposals: {
          include: {
            decisions: {
              include: {
                user: { select: { id: true, firstName: true, lastName: true } }
              }
            }
          },
          orderBy: { version: "asc" }
        },
        followUps: true,
        reviewRequests: true
      }
    });

    if (!c) return null;

    // Contrôle d'accès strict
    const isRequester = currentUserId && c.requesterId === currentUserId;
    const isParticipant = currentUserId && c.participants.some(p => p.userId === currentUserId);
    
    if (!asStaff && !isRequester && !isParticipant) {
      return null; // Accès refusé
    }

    // Filtrage des messages pour respecter le recueil séparé des parties en médiation
    let visibleMessages = c.messages;
    if (!asStaff) {
      const myRole = isRequester ? "REQUESTER" : "OTHER_PARTY";
      visibleMessages = c.messages.filter(m => {
        if (m.audience === "ALL") return true;
        if (myRole === "REQUESTER" && m.audience === "REQUESTER_ONLY") return true;
        if (myRole === "OTHER_PARTY" && m.audience === "OTHER_PARTY_ONLY") return true;
        return false;
      });
    }

    return {
      id: c.id,
      reference: c.reference,
      category: c.category,
      subject: c.subject,
      description: c.description,
      status: c.status,
      priority: c.priority,
      outcomeCode: c.outcomeCode,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      closedAt: c.closedAt,
      requester: c.requester,
      requesterEmail: c.requesterEmail,
      requesterName: c.requesterName,
      assignedAgent: c.assignedAgent,
      participants: c.participants,
      contextLinks: c.contextLinks,
      events: c.events,
      messages: visibleMessages,
      internalNotes: asStaff ? c.internalNotes : [],
      mediationProposals: c.mediationProposals,
      followUps: c.followUps,
      reviewRequests: c.reviewRequests
    };
  } catch (err) {
    console.error("Erreur getSupportCaseDetails:", err);
    return null;
  }
}

export async function replyToSupportCase(caseId: string, content: string, senderId?: string, senderName?: string) {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Le message ne peut être vide." };
    }

    const c = await prisma.supportCase.findUnique({
      where: { id: caseId }
    });
    if (!c) return { success: false, error: "Dossier introuvable." };
    if (c.status === "closed") {
      return { success: false, error: "Ce dossier est clôturé. Veuillez demander un réexamen si nécessaire." };
    }

    await prisma.caseMessage.create({
      data: {
        caseId,
        senderId,
        senderName: senderName || "Membre",
        senderRole: "MEMBER",
        audience: "ALL",
        content: content.trim()
      }
    });

    // Mise à jour de l'état si l'agent attendait la réponse
    let nextStatus = c.status;
    if (c.status === "waiting_requester") {
      nextStatus = "in_progress";
    }

    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        status: nextStatus,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/app/assistance/${caseId}`);
    revalidatePath(`/admin/assistance`);

    return { success: true };
  } catch (err) {
    console.error("Erreur replyToSupportCase:", err);
    return { success: false, error: "Impossible d'envoyer votre réponse." };
  }
}

export async function withdrawSupportCase(caseId: string, reason?: string) {
  try {
    const c = await prisma.supportCase.findUnique({ where: { id: caseId } });
    if (!c) return { success: false, error: "Dossier introuvable." };

    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        status: "closed",
        outcomeCode: "WITHDRAWN_BY_REQUESTER",
        closedAt: new Date(),
        events: {
          create: {
            eventType: "CLOSED",
            authorName: "Demandeur",
            description: `Demande retirée par son auteur${reason ? ` : ${reason}` : ""}.`,
            isPublicToRequester: true
          }
        }
      }
    });

    revalidatePath(`/app/assistance/${caseId}`);
    return { success: true };
  } catch (err) {
    console.error("Erreur withdrawSupportCase:", err);
    return { success: false, error: "Erreur lors du retrait de la demande." };
  }
}

export async function requestCaseReview(caseId: string, requesterId: string, reason: string) {
  try {
    if (!reason || reason.trim().length === 0) {
      return { success: false, error: "Veuillez préciser le motif de contestation." };
    }

    await prisma.caseReviewRequest.create({
      data: {
        caseId,
        requesterId,
        reason: reason.trim(),
        status: "PENDING"
      }
    });

    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        status: "triage",
        events: {
          create: {
            eventType: "REVIEW_REQUESTED",
            authorName: "Demandeur",
            description: `Demande de réexamen déposée : « ${reason.slice(0, 100)} ». Transmis à un responsable distinct.`,
            isPublicToRequester: true
          }
        }
      }
    });

    revalidatePath(`/app/assistance/${caseId}`);
    revalidatePath(`/admin/assistance`);
    return { success: true };
  } catch (err) {
    console.error("Erreur requestCaseReview:", err);
    return { success: false, error: "Impossible de déposer la demande de réexamen." };
  }
}

// ==============================================================================
// 3. GESTION DES PROPOSITIONS DE MÉDIATION (ACCORD EXPLICITE DES DEUX PARTIES)
// ==============================================================================

export async function submitProposalDecision(proposalId: string, userId: string, decision: "ACCEPTED" | "MODIFICATION_REQUESTED" | "REJECTED", feedback?: string) {
  try {
    const proposal = await prisma.mediationProposal.findUnique({
      where: { id: proposalId },
      include: {
        supportCase: {
          include: { participants: true }
        },
        decisions: true
      }
    });

    if (!proposal) return { success: false, error: "Proposition introuvable." };
    if (proposal.status !== "PENDING") {
      return { success: false, error: "Cette version de proposition n'est plus active." };
    }

    // Enregistrement de la décision du membre
    await prisma.proposalDecision.upsert({
      where: {
        proposalId_userId: { proposalId, userId }
      },
      update: {
        decision,
        feedback: feedback || null,
        decidedAt: new Date()
      },
      create: {
        proposalId,
        userId,
        decision,
        feedback: feedback || null
      }
    });

    // Journalisation de l'événement
    await prisma.caseEvent.create({
      data: {
        caseId: proposal.caseId,
        eventType: "PROPOSAL_DECISION",
        authorName: "Participant",
        description: `Décision sur la version v${proposal.version} : ${decision}${feedback ? ` (${feedback})` : ""}.`,
        isPublicToRequester: true
      }
    });

    // Vérifier si toutes les parties ont accepté la MÊME version
    const allDecisions = await prisma.proposalDecision.findMany({
      where: { proposalId }
    });

    const isRejected = allDecisions.some(d => d.decision === "REJECTED");
    const isModRequested = allDecisions.some(d => d.decision === "MODIFICATION_REQUESTED");

    if (isRejected) {
      await prisma.mediationProposal.update({
        where: { id: proposalId },
        data: { status: "REJECTED" }
      });
      await prisma.supportCase.update({
        where: { id: proposal.caseId },
        data: { status: "in_progress" }
      });
    } else if (isModRequested) {
      await prisma.mediationProposal.update({
        where: { id: proposalId },
        data: { status: "MODIFICATION_REQUESTED" }
      });
      await prisma.supportCase.update({
        where: { id: proposal.caseId },
        data: { status: "in_progress" }
      });
    } else {
      // Si au moins 2 participants ont formellement accepté
      const acceptedCount = allDecisions.filter(d => d.decision === "ACCEPTED").length;
      if (acceptedCount >= 2) {
        await prisma.mediationProposal.update({
          where: { id: proposalId },
          data: { status: "ACCEPTED" }
        });
        await prisma.supportCase.update({
          where: { id: proposal.caseId },
          data: { status: "agreement_follow_up" }
        });
        await prisma.caseEvent.create({
          data: {
            caseId: proposal.caseId,
            eventType: "PROPOSAL_CREATED",
            authorName: "Système de Médiation",
            description: `Accord scellé sur la proposition v${proposal.version}. Début du suivi des actions convenues.`,
            isPublicToRequester: true
          }
        });
      }
    }

    revalidatePath(`/app/assistance/${proposal.caseId}`);
    revalidatePath(`/admin/assistance`);
    return { success: true };
  } catch (err) {
    console.error("Erreur submitProposalDecision:", err);
    return { success: false, error: "Impossible d'enregistrer votre décision." };
  }
}

// ==============================================================================
// 4. BOÎTE DE RÉCEPTION ET GESTION ÉQUIPE MULTI-AGENTS (/admin/assistance)
// ==============================================================================

export async function getTeamCases(filterView: string = "unassigned", category?: string, priority?: string, search?: string) {
  try {
    const where: any = {};

    switch (filterView) {
      case "unassigned":
        where.assignedAgentId = null;
        where.status = { not: "closed" };
        break;
      case "my_cases":
        // Filter by assigned agent or in_progress
        where.status = { not: "closed" };
        break;
      case "needs_reply":
        where.status = { in: ["new", "triage", "in_progress"] };
        break;
      case "waiting_member":
        where.status = { in: ["waiting_requester", "waiting_other_party", "proposal_pending"] };
        break;
      case "mediations":
        where.category = "TRADE_ISSUE";
        break;
      case "reports":
        where.category = "REPORT_MEMBER";
        break;
      case "review_queue":
        where.reviewRequests = { some: { status: "PENDING" } };
        break;
      case "closed":
        where.status = "closed";
        break;
      case "all":
      default:
        break;
    }

    if (category && category !== "ALL") where.category = category;
    if (priority && priority !== "ALL") where.priority = priority;
    if (search && search.trim().length > 0) {
      where.OR = [
        { reference: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { requesterEmail: { contains: search, mode: "insensitive" } },
        { requesterName: { contains: search, mode: "insensitive" } }
      ];
    }

    const cases = await prisma.supportCase.findMany({
      where,
      include: {
        assignedAgent: {
          select: { id: true, firstName: true, lastName: true, avatarInitials: true }
        },
        participants: {
          include: { user: { select: { firstName: true, lastName: true } } }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" }
        },
        reviewRequests: {
          where: { status: "PENDING" }
        }
      },
      orderBy: [
        { priority: "asc" },
        { updatedAt: "desc" }
      ]
    });

    return cases.map(c => ({
      id: c.id,
      reference: c.reference,
      category: c.category,
      subject: c.subject,
      status: c.status,
      priority: c.priority,
      outcomeCode: c.outcomeCode,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      requesterName: c.requesterName,
      requesterEmail: c.requesterEmail,
      assignedAgent: c.assignedAgent,
      hasPendingReview: c.reviewRequests.length > 0,
      participantCount: c.participants.length
    }));
  } catch (err) {
    console.error("Erreur getTeamCases:", err);
    return [];
  }
}

export async function assignCaseToAgent(caseId: string, agentId: string, reason?: string, currentStaffName: string = "Responsable Support") {
  try {
    const agent = await prisma.user.findUnique({ where: { id: agentId } });
    const agentName = agent ? `${agent.firstName} ${agent.lastName}` : "Agent";

    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        assignedAgentId: agentId,
        status: "in_progress",
        assignments: {
          create: {
            assignedToId: agentId,
            reason: reason || "Attribution du dossier",
          }
        },
        events: {
          create: {
            eventType: "ASSIGNED",
            authorName: currentStaffName,
            description: `Dossier assigné à ${agentName}${reason ? ` (Motif : ${reason})` : ""}.`,
            isPublicToRequester: true
          }
        }
      }
    });

    revalidatePath(`/admin/assistance`);
    revalidatePath(`/app/assistance/${caseId}`);
    return { success: true };
  } catch (err) {
    console.error("Erreur assignCaseToAgent:", err);
    return { success: false, error: "Impossible d'assigner le dossier." };
  }
}

export async function addCaseInternalNote(caseId: string, content: string, authorId: string, authorName: string) {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "La note ne peut être vide." };
    }

    await prisma.caseInternalNote.create({
      data: {
        caseId,
        authorId,
        authorName,
        content: content.trim()
      }
    });

    revalidatePath(`/admin/assistance`);
    return { success: true };
  } catch (err) {
    console.error("Erreur addCaseInternalNote:", err);
    return { success: false, error: "Impossible d'enregistrer la note interne." };
  }
}

export async function sendAgentMessage(
  caseId: string,
  content: string,
  audience: "ALL" | "REQUESTER_ONLY" | "OTHER_PARTY_ONLY" = "ALL",
  agentId?: string,
  agentName: string = "Agent CigarConnect",
  role: string = "AGENT"
) {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Le message ne peut être vide." };
    }

    await prisma.caseMessage.create({
      data: {
        caseId,
        senderId: agentId,
        senderName: agentName,
        senderRole: role,
        audience,
        content: content.trim()
      }
    });

    // Mettre à jour l'état vers attente de réponse du membre
    let newStatus = "waiting_requester";
    if (audience === "OTHER_PARTY_ONLY") newStatus = "waiting_other_party";

    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        status: newStatus,
        updatedAt: new Date()
      }
    });

    revalidatePath(`/admin/assistance`);
    revalidatePath(`/app/assistance/${caseId}`);
    return { success: true };
  } catch (err) {
    console.error("Erreur sendAgentMessage:", err);
    return { success: false, error: "Impossible d'envoyer le message." };
  }
}

export async function createCaseMediationProposal(
  caseId: string,
  data: {
    problemSummary: string;
    requesterObligations: string;
    otherPartyObligations: string;
    deadlines: string;
    consequences: string;
    authorName: string;
  }
) {
  try {
    // Calcul de la version suivante
    const existing = await prisma.mediationProposal.findMany({
      where: { caseId },
      orderBy: { version: "desc" },
      take: 1
    });

    const nextVersion = existing.length > 0 ? existing[0].version + 1 : 1;

    // Rendre obsolètes les anciennes versions
    await prisma.mediationProposal.updateMany({
      where: { caseId, status: "PENDING" },
      data: { status: "SUPERSEDED" }
    });

    // Création de la nouvelle proposition
    const proposal = await prisma.mediationProposal.create({
      data: {
        caseId,
        version: nextVersion,
        problemSummary: data.problemSummary.trim(),
        requesterObligations: data.requesterObligations.trim(),
        otherPartyObligations: data.otherPartyObligations.trim(),
        deadlines: data.deadlines.trim(),
        consequences: data.consequences.trim(),
        status: "PENDING"
      }
    });

    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        status: "proposal_pending",
        updatedAt: new Date(),
        events: {
          create: {
            eventType: "PROPOSAL_CREATED",
            authorName: data.authorName,
            description: `Nouvelle proposition de médiation (version v${nextVersion}) soumise aux deux parties.`,
            isPublicToRequester: true
          }
        }
      }
    });

    revalidatePath(`/admin/assistance`);
    revalidatePath(`/app/assistance/${caseId}`);
    return { success: true, proposalId: proposal.id, version: nextVersion };
  } catch (err) {
    console.error("Erreur createCaseMediationProposal:", err);
    return { success: false, error: "Impossible de créer la proposition de médiation." };
  }
}

export async function updateCaseStatus(caseId: string, status: string, outcomeCode?: string, authorName: string = "Équipe Support") {
  try {
    await prisma.supportCase.update({
      where: { id: caseId },
      data: {
        status,
        outcomeCode: outcomeCode || null,
        closedAt: status === "closed" ? new Date() : null,
        updatedAt: new Date(),
        events: {
          create: {
            eventType: status === "closed" ? "CLOSED" : "STATUS_CHANGE",
            authorName,
            description: `Statut modifié en « ${status} »${outcomeCode ? ` (Issue : ${outcomeCode})` : ""}.`,
            isPublicToRequester: true
          }
        }
      }
    });

    revalidatePath(`/admin/assistance`);
    revalidatePath(`/app/assistance/${caseId}`);
    return { success: true };
  } catch (err) {
    console.error("Erreur updateCaseStatus:", err);
    return { success: false, error: "Impossible de mettre à jour le statut du dossier." };
  }
}
