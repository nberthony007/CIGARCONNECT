import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début de l'initialisation de la base de données CigarConnect...");

  // Nettoyage préalable pour garantir l'idempotence
  await prisma.salonModerationRecord.deleteMany();
  await prisma.salonAttachment.deleteMany();
  await prisma.salonMessage.deleteMany();
  await prisma.salonPreference.deleteMany();
  await prisma.blockedUser.deleteMany();
  await prisma.catalogContribution.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.sponsorshipRequest.deleteMany();
  await prisma.referenceVariant.deleteMany();
  await prisma.tradeMessage.deleteMany();
  await prisma.tradeVersion.deleteMany();
  await prisma.tradeProposal.deleteMany();
  await prisma.humidorLot.deleteMany();
  await prisma.cigarReference.deleteMany();
  await prisma.privacySettings.deleteMany();
  await prisma.user.deleteMany();

  // 1. Création des utilisateurs Aficionados
  const alexandre = await prisma.user.create({
    data: {
      email: "alexandre.montmirail@cigarconnect.fr",
      firstName: "Alexandre",
      lastName: "de Montmirail",
      city: "Paris",
      country: "France",
      avatarInitials: "AM",
      role: "MASTER_COLLECTOR",
      bio: "Aficionado et conservateur de pièces d'exception cubaines pré-embargo, réservas et éditions limitées de prestige.",
      privacySettings: {
        create: {
          showLocation: true,
          showValuation: false, // Discrétion absolue par défaut
          allowDirectMessages: true,
        },
      },
    },
  });

  const jeanMarc = await prisma.user.create({
    data: {
      email: "jean.marc@cigarconnect.ch",
      firstName: "Jean-Marc",
      lastName: "de V.",
      city: "Genève",
      country: "Suisse",
      avatarInitials: "JM",
      role: "VIP_CONNOISSEUR",
      bio: "Collectionneur axé sur les longs formats diplomatiques et les millésimes rares des années 1990-2005.",
      privacySettings: {
        create: {
          showLocation: true,
          showValuation: false,
          allowDirectMessages: true,
        },
      },
    },
  });

  console.log("✓ Aficionados créés : Alexandre de Montmirail (Paris) et Jean-Marc de V. (Genève)");

  // 2. Création du Catalogue Patrimonial de Référence (5 Vitoles Légendaires)
  const behike = await prisma.cigarReference.create({
    data: {
      brand: "Cohiba",
      name: "Behike BHK 56",
      origin: "Cuba",
      countryCode: "CU",
      vitola: "Laguito No. 6",
      ringGauge: 56,
      lengthMm: 166,
      vintageYear: "2010",
      rarityGrade: "ULTRA_RARE",
      rarityLabel: "Édition Historique — Premier Millésime",
      defaultImageUrl: "/assets/cigar-behike56.jpg",
      factoryNotes:
        "Intègre la rarissime feuille de Medio Tiempo cueillie au sommet du plant de tabac sous le soleil direct. Richesse aromatique exceptionnelle, cèdre noble, café torréfié et cuir patiné.",
      strength: "Moyenne à Forte",
    },
  });

  const trinidad = await prisma.cigarReference.create({
    data: {
      brand: "Trinidad",
      name: "Fundadores Millésime 1998",
      origin: "Cuba",
      countryCode: "CU",
      vitola: "Laguito No. 1",
      ringGauge: 40,
      lengthMm: 192,
      vintageYear: "1998",
      rarityGrade: "VINTAGE",
      rarityLabel: "Millésime Diplomatique",
      defaultImageUrl: "/assets/cigar-trinidad.jpg",
      factoryNotes:
        "Format légendaire réservé aux réceptions d'État et aux ambassadeurs avant sa commercialisation confidentielle. Arômes de fleurs sauvages, miel de châtaignier et cèdre doux.",
      strength: "Moyenne",
    },
  });

  const montecristo = await prisma.cigarReference.create({
    data: {
      brand: "Montecristo",
      name: "No. 2 Reserva Cosecha 2005",
      origin: "Cuba",
      countryCode: "CU",
      vitola: "Pirámide",
      ringGauge: 52,
      lengthMm: 156,
      vintageYear: "2005",
      rarityGrade: "RESERVA",
      rarityLabel: "Reserva Cosecha 2005",
      defaultImageUrl: "/assets/cigar-montecristo.jpg",
      factoryNotes:
        "Feuilles de cape et de tripe vieillies pendant au moins 3 années rigoureusement contrôlées en cave. Fèves de cacao, torréfaction, poivre blanc et équilibre impérial.",
      strength: "Moyenne à Forte",
    },
  });

  const partagas = await prisma.cigarReference.create({
    data: {
      brand: "Partagás",
      name: "Lusitanias Gran Reserva Cosecha 2007",
      origin: "Cuba",
      countryCode: "CU",
      vitola: "Prominente",
      ringGauge: 49,
      lengthMm: 194,
      vintageYear: "2007",
      rarityGrade: "GRAN_RESERVA",
      rarityLabel: "Gran Reserva Cosecha 2007",
      defaultImageUrl: "/assets/cigar-partagas.jpg",
      factoryNotes:
        "Sélection des meilleurs tabacs de San Juan y Martínez et San Luis, vieillis 5 ans. Puissance racée légendaire, notes de sous-bois humide, chocolat noir et musc.",
      strength: "Forte",
    },
  });

  const davidoff = await prisma.cigarReference.create({
    data: {
      brand: "Davidoff",
      name: "Oro Blanco Special Reserve 2002",
      origin: "République Dominicaine",
      countryCode: "DO",
      vitola: "Toro Extra",
      ringGauge: 54,
      lengthMm: 152,
      vintageYear: "2002",
      rarityGrade: "ULTRA_RARE",
      rarityLabel: "Réserve Spéciale 2002",
      defaultImageUrl: "/assets/cigar-davidoff.jpg",
      factoryNotes:
        "Tabacs de la récolte 2002 vieillis 12 ans puis roulés par les maîtres rouleurs les plus expérimentés. Chaque vitole est inspectée et contresignée personnellement par le Master Blender.",
      strength: "Moyenne",
    },
  });

  const kashimboNobleOrigins = await prisma.cigarReference.create({
    data: {
      id: "kashimbo-heritage-noble-origins",
      brand: "Kashimbo",
      name: "Heritage Noble Origins (Silver Band)",
      origin: "Haïti (Maison d'Auteur) · Terroirs d'Exception",
      countryCode: "HT",
      vitola: "Toro 6x54",
      ringGauge: 54,
      lengthMm: 152,
      vintageYear: "2021",
      rarityGrade: "LIMITED_EDITION",
      rarityLabel: "Bague Argentée · Boîte de 20",
      defaultImageUrl: "/assets/cigar-kashimbo-noble-origins.jpg",
      factoryNotes:
        "Maison d'auteur fièrement enracinée en Haïti (Ayiti), berceau historique de la culture du tabac dans les Caraïbes. Kashimbo signe une création où l'âme et la direction artistique haïtiennes s'allient à une sélection transnationale des plus nobles terroirs : cape grasse San Andrés (Mexique), sous-cape et tripe 100% nicaraguayennes (Estelí & Jalapa), roulées à la main par des maîtres torcedores chevronnés. Profil complexe : chocolat noir amer, poivre vif, cuir patiné et noisettes grillées, le tout lié par une texture crémeuse et une bague de pied en ruban de soie argenté.",
      strength: "Moyenne",
    },
  });

  const kashimboMajestic = await prisma.cigarReference.create({
    data: {
      id: "kashimbo-heritage-majestic",
      brand: "Kashimbo",
      name: "Heritage Majestic (Gold Band)",
      origin: "Haïti (Maison d'Auteur) · Multi-Terroirs",
      countryCode: "HT",
      vitola: "Gordo 6x60",
      ringGauge: 60,
      lengthMm: 152,
      vintageYear: "2021",
      rarityGrade: "EXCLUSIVE",
      rarityLabel: "Bague Dorée Impériale · Boîte de 20",
      defaultImageUrl: "/assets/cigar-kashimbo-majestic.jpg",
      factoryNotes:
        "Portée par la vision et l'héritage d'Haïti (Ayiti — « Timeless Enjoyment »), la maison Kashimbo transcende les frontières en confiant son assemblage signature à un dialogue caribéen et international d'exception. Sous la cape sombre et huileuse San Andrés (Mexique), la sous-cape indonésienne orchestre une tripe mariant la rondeur aromatique de la République Dominicaine à la vivacité du Nicaragua, roulée en un majestueux module Gordo (cepo 60). Notes opulentes de cacao intense, épices chaudes, café torréfié et cèdre noble, couronnées d'une bague de pied en ruban de satin doré.",
      strength: "Moyenne",
    },
  });

  const kashimboYearOfTheHorse = await prisma.cigarReference.create({
    data: {
      id: "kashimbo-year-of-the-horse-2026",
      brand: "Kashimbo",
      name: "Year of the Horse — Limited Edition 2026",
      origin: "Haïti (Maison d'Auteur) · Édition Limitée 2026",
      countryCode: "HT",
      vitola: "Toro 5x56",
      ringGauge: 56,
      lengthMm: 127,
      vintageYear: "2026",
      rarityGrade: "LIMITED_EDITION",
      rarityLabel: "Édition Limitée 2026 · Boîte Signée de 10",
      defaultImageUrl: "/assets/cigar-kashimbo-year-of-the-horse-2026.jpg",
      factoryNotes:
        "Maison d'auteur fièrement enracinée en Haïti (Ayiti). Édition commémorative 'Year of the Horse 2026' célébrant la puissance, la liberté et l'élégance du cheval. Module Toro 5x56 au cepo généreux de 56, affiné à la perfection et présenté en boîte de 10 pièces contresignée à la main sur le couvercle par les propriétaires fondateurs. Profil corsé et racé (Medium-Full to Full) : cèdre, cuir noble, café torréfié, cacao noir intense et épices de pâtisserie sur une finale persistante et soyeuse.",
      strength: "Moyenne à Forte",
    },
  });

  const kashimboYearOfTheSnake = await prisma.cigarReference.create({
    data: {
      id: "kashimbo-year-of-the-snake-2025",
      brand: "Kashimbo",
      name: "Year of the Snake — Limited Edition 2025",
      origin: "Haïti (Maison d'Auteur) · Édition Limitée 2025",
      countryCode: "HT",
      vitola: "Figurado 6x56",
      ringGauge: 56,
      lengthMm: 152,
      vintageYear: "2025",
      rarityGrade: "LIMITED_EDITION",
      rarityLabel: "Édition Limitée 2025 · Figurado 6x56",
      defaultImageUrl: "/assets/cigar-kashimbo-year-of-the-snake-2025.jpg",
      factoryNotes:
        "Maison d'auteur fièrement enracinée en Haïti (Ayiti). Édition commémorative 'Year of the Snake 2025' dédiée aux connaisseurs les plus exigeants. Module d'exception Figurado 6x56 (double perfecto biseauté de 152 mm, cepo 56) habillé d'une cape Habano sun-grown sans défaut et d'une sous-cape Habano. La tripe réunit un assemblage prestigieux multi-terroirs : tabacs volcaniques de l'île d'Ometepe, Condega, Estelí (Nicaragua) et République Dominicaine, vieillis et liés à la perfection. Profil d'une grande complexité : espresso noir, noisettes grillées, vanille crémeuse, touches de chêne noble et douceur caramélisée, sur une finale poivrée raffinée et persistante.",
      strength: "Moyenne à Forte",
    },
  });

  console.log("✓ Vitoles créées dans le catalogue universel (dont Kashimbo Heritage, Year of the Horse 2026 et Year of the Snake 2025)");

  // 3. Création des Lots en Cave (Mon Humidor d'Alexandre de Montmirail)
  await prisma.humidorLot.createMany({
    data: [
      {
        userId: alexandre.id,
        cigarReferenceId: behike.id,
        quantity: 3,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "19°C",
        conditionNotes: "Cave de vieillissement en cèdre massif, contrôle électronique Boveda 69% en continu.",
        packaging: "Boîte laquée de 10",
        boxCode: "BBM MAY 10",
        boxCodeVerified: true,
        provenanceDeclared: "Acquisition directe chez distributeur officiel agréé (Paris)",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 4800,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: trinidad.id,
        quantity: 5,
        reservedQuantity: 0,
        conditionHr: "68% HR",
        conditionTemp: "18.5°C",
        conditionNotes: "Conservation diplomatique continue, cape soyeuse et grasse sans imperfection.",
        packaging: "Cabinet verni de 24",
        boxCode: "VC-EPO-01",
        boxCodeVerified: true,
        provenanceDeclared: "Collection privée diplomatique européenne",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 3500,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: montecristo.id,
        quantity: 2,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "19°C",
        conditionNotes: "Conditionné sous film respirant en étui cèdre, maturation optimale.",
        packaging: "Coffret numéroté 5000 ex.",
        boxCode: "LUB NOV 09",
        boxCodeVerified: true,
        provenanceDeclared: "Achat direct en vente privée aficionado Genève",
        isTradeable: false, // Réservé pour dégustation privée
        isPublic: true,
        valuationAmount: 2200,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: partagas.id,
        quantity: 4,
        reservedQuantity: 0,
        conditionHr: "70% HR",
        conditionTemp: "19°C",
        conditionNotes: "Grand format conservé à 70% HR pour préserver l'élasticité et le gras de la cape.",
        packaging: "Boîte noire laquée de 15",
        boxCode: "TEB OCT 13",
        boxCodeVerified: true,
        provenanceDeclared: "Distribution officielle suisse Habanos S.A.",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 4100,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: davidoff.id,
        quantity: 1,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "18°C",
        conditionNotes: "Pièce unique conservée dans son coffret individuel d'origine en bois précieux.",
        packaging: "Coffret individuel bois noble",
        boxCode: "OB-2002-774",
        boxCodeVerified: true,
        provenanceDeclared: "Boutique historique Davidoff Genève",
        isTradeable: false,
        isPublic: true,
        valuationAmount: 950,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: kashimboNobleOrigins.id,
        quantity: 10,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "19°C",
        conditionNotes: "Vitoles Toro 6x54 bague argentée sous contrôle Boveda 69% HR en cave de cèdre massif.",
        packaging: "Boîte verte de 20",
        boxCode: "KSH-NO-21",
        boxCodeVerified: true,
        provenanceDeclared: "Maison Kashimbo (Haïti / Ayiti) — Boîte verte officielle de 20 scellée en manufacture dédiée",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 350,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: kashimboMajestic.id,
        quantity: 5,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "19°C",
        conditionNotes: "Format Gordo 6x60 bague dorée impériale. Maturation sous 69% HR, cape San Andrés très aromatique.",
        packaging: "Boîte verte de 20",
        boxCode: "KSH-MJ-21",
        boxCodeVerified: true,
        provenanceDeclared: "Maison Kashimbo (Haïti / Ayiti) — Boîte verte officielle de 20 scellée en manufacture dédiée",
        isTradeable: false,
        isPublic: true,
        valuationAmount: 240,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: kashimboYearOfTheHorse.id,
        quantity: 10,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "19°C",
        conditionNotes: "Boîte de 10 signée par les propriétaires fondateurs sur le couvercle. Vitoles Toro 5x56 avec double bague rouge/or et noire/or sous contrôle Boveda 69% HR.",
        packaging: "Boîte de 10 signée par les propriétaires",
        boxCode: "KSH-YOTH-26",
        boxCodeVerified: true,
        provenanceDeclared: "Maison Kashimbo (Haïti / Ayiti) — Coffret officiel numéroté et signé par les fondateurs",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 480,
      },
      {
        userId: alexandre.id,
        cigarReferenceId: kashimboYearOfTheSnake.id,
        quantity: 5,
        reservedQuantity: 0,
        conditionHr: "69% HR",
        conditionTemp: "19°C",
        conditionNotes: "Format Figurado 6x56 double perfecto biseauté, double bague rouge/or et bordeaux/or serpent infini. Conservation sous contrôle Boveda 69% HR.",
        packaging: "Boîte officielle scellée",
        boxCode: "KSH-YOTS-25",
        boxCodeVerified: true,
        provenanceDeclared: "Maison Kashimbo (Haïti / Ayiti) — Édition limitée officielle 2025 certifiée manufacture",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 520,
      },
      {
        userId: jeanMarc.id,
        cigarReferenceId: trinidad.id,
        quantity: 2,
        reservedQuantity: 0,
        conditionHr: "68% HR",
        conditionTemp: "19°C",
        conditionNotes: "Vitole diplomatique scellée",
        packaging: "Cabinet verni",
        boxCode: "VC-EPO-02",
        boxCodeVerified: true,
        provenanceDeclared: "Genève",
        isTradeable: true,
        isPublic: true,
        valuationAmount: 1800,
      },
    ],
  });

  console.log("✓ Lots de cave initialisés pour Alexandre de Montmirail (Norme 68–70% HR respectée)");

  // 4. Initialisation d'un échange prototype dans Le Cercle
  const proposal = await prisma.tradeProposal.create({
    data: {
      proposerId: alexandre.id,
      recipientId: jeanMarc.id,
      status: "NEGOTIATING",
      currentVersion: 1,
      exchangeLocationType: "Salon privé de l'Hôtel de Crillon (Paris) ou Genève",
      notes: "Proposition d'échange entre gentlemen : un cabinet de Trinidad Fundadores 1998 contre un lot de Cohiba Behike 56.",
      versions: {
        create: {
          versionNumber: 1,
          offeredLotId: behike.id, // référence proposée
          offeredQuantity: 1,
          desiredLotId: trinidad.id, // référence demandée
          desiredQuantity: 1,
          notes: "Condition de conservation sous hygrométrie 68-70% garantie.",
          signedByProposer: true,
          signedByRecipient: false,
        },
      },
      messages: {
        create: [
          {
            senderId: alexandre.id,
            content:
              "Cher Jean-Marc, je serais ravi de vous proposer cet échange pour compléter ma verticale Trinidad. Vos pièces sont-elles toujours sous 69% HR ?",
          },
          {
            senderId: jeanMarc.id,
            content:
              "Bonjour Alexandre. Absolument, mes vitoles reposent en cabinet d'acajou avec sondes calibrées au sel. Votre proposition retient toute mon attention.",
          },
        ],
      },
    },
  });

  console.log(`✓ Proposition de troc n°${proposal.id.slice(0, 8)} créée dans Le Cercle`);

  // 5. Lot personnel non répertorié au catalogue (Étape 2B - Enregistrement immédiat)
  await prisma.humidorLot.create({
    data: {
      userId: alexandre.id,
      isCustomPiece: true,
      customBrand: "San Cristóbal de la Habana",
      customName: "El Morro Millésime 2003",
      customVitola: "Paco (180 mm · Cepo 49)",
      customOrigin: "Cuba",
      humidorLocation: "Armoire Cèdre Salon — Tiroir supérieur gauche",
      quantity: 3,
      reservedQuantity: 0,
      conditionHr: "69% HR",
      conditionTemp: "19°C",
      conditionNotes: "Vitole rare hors catalogue officiel, cape maduro grasse conservée sous cèdre d'Espagne.",
      packaging: "Boîte vernie de 25",
      boxCode: "EOG NOV 03",
      boxCodeVerified: true,
      provenanceDeclared: "Collection privée Maître d'Hôtel La Havane",
      isTradeable: true,
      isPublic: true,
      valuationAmount: 1650,
      valuationSource: "Estimation déclarée par l'aficionado",
      privateNotes: "Dégusté en 2021 : notes de café torréfié, cacao amer et tirage impeccable.",
    },
  });

  console.log("✓ Lot personnel hors catalogue initialisé (Étape 2B)");

  // 6. Campagnes partenaires sélectionnées par la rédaction (Section 10 & 14) — 3 Partenaires Officiels :
  // 1. Kashimbo Cigars (www.kashimbocigars.com)
  // 2. Fermin Perez Cigars (ferminperez.com)
  // 3. Maison Elie Bleu Paris (www.eliebleu.com)
  await prisma.campaign.create({
    data: {
      sponsorName: "Kashimbo Cigars",
      placement: "HOME_BANNER",
      title: "Manufacture Artisanale & Cigares d'Exception Roulés Main",
      description: "Cigares d'auteur roulés en tripa larga par des maîtres torcedores chevronnés. Sélection rigoureuse de feuilles nobles, équilibre aromatique parfait et tirage irréprochable.",
      imageUrl: "/assets/kashimbo-cigars-banner.jpg",
      destinationUrl: "https://www.kashimbocigars.com",
      altText: "Manufacture artisanale de cigares faits main Kashimbo Cigars",
      status: "active",
      territories: "ALL",
      impressions: 480,
      clicks: 42,
      isEmergencyStopped: false,
    },
  });

  await prisma.campaign.create({
    data: {
      sponsorName: "Fermin Perez Cigars",
      placement: "HOME_BANNER",
      title: "Terroirs d'Estelí — De la Graine à la Vitole de Maître",
      description: "Maison boutique d'Estelí (Nicaragua) et Little Havana. Maîtrise intégrale de la culture à l'affinage, capes San Andrés Maduro d'une richesse aromatique intense et subtile.",
      imageUrl: "/assets/fermin-perez-banner.jpg",
      destinationUrl: "https://ferminperez.com",
      altText: "Cigares de terroir nicaraguayen faits main Fermin Perez Cigars",
      status: "active",
      territories: "ALL",
      impressions: 395,
      clicks: 31,
      isEmergencyStopped: false,
    },
  });

  await prisma.campaign.create({
    data: {
      sponsorName: "Maison Elie Bleu Paris",
      placement: "HOME_BANNER",
      title: "Écrins d'Exception & Caves en Cèdre d'Espagne depuis 1976",
      description: "Manufacture d'art française mondialement reconnue pour ses humidors de prestige. Marqueterie d'essences précieuses, intérieurs en cèdre d'Espagne et conservation hygrométrique absolue.",
      imageUrl: "/assets/elie-bleu-paris-banner.jpg",
      destinationUrl: "https://www.eliebleu.com",
      altText: "Humidors et caves à cigares de prestige en marqueterie d'art Elie Bleu Paris",
      status: "active",
      territories: "ALL",
      impressions: 560,
      clicks: 58,
      isEmergencyStopped: false,
    },
  });

  // Campagnes complémentaires pour catalogue et journal
  await prisma.campaign.create({
    data: {
      sponsorName: "Maison Elie Bleu Paris",
      placement: "JOURNAL_BOX",
      title: "Haute Ébénisterie & Conservation des Grands Millésimes",
      description: "L'artisanat français d'exception au service de la préservation optimale de vos vitoles de collection.",
      imageUrl: "/assets/elie-bleu-paris-banner.jpg",
      destinationUrl: "https://www.eliebleu.com",
      altText: "Cave en cèdre et marqueterie Elie Bleu Paris",
      status: "active",
      territories: "ALL",
      impressions: 210,
      clicks: 19,
      isEmergencyStopped: false,
    },
  });

  await prisma.campaign.create({
    data: {
      sponsorName: "Kashimbo Cigars",
      placement: "CATALOG_CARD",
      title: "Vitoles Roulées Main en Série Limitée",
      description: "Découvrez les assemblages signature et modules d'exception de la manufacture Kashimbo.",
      imageUrl: "/assets/kashimbo-cigars-banner.jpg",
      destinationUrl: "https://www.kashimbocigars.com",
      altText: "Cigares signature Kashimbo Cigars",
      status: "active",
      territories: "ALL",
      impressions: 175,
      clicks: 14,
      isEmergencyStopped: false,
    },
  });

  console.log("✓ 3 Partenaires officiels créés avec succès (Kashimbo, Fermin Perez, Elie Bleu)");

  // 7. Initialisation de la conversation collective dans Le Salon Unique (/app/salon) (Section 23-27)
  const salonMsg1 = await prisma.salonMessage.create({
    data: {
      authorId: alexandre.id,
      content:
        "Bienvenue dans Le Salon. Avec l'arrivée de l'automne, comment vos humidors réagissent-ils aux premières baisses de température extérieure ? Ici à Paris, mon armoire stabilisée reste constante à 69% HR avec les sachets Boveda renouvelés début septembre.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 4), // 4 heures avant
      attachments: {
        create: [
          {
            url: "/assets/cigar-behike56.jpg",
            altText: "Inspection de la cape et du pied d'une vitole sous hygrométrie contrôlée",
          },
        ],
      },
    },
  });

  const salonMsg2 = await prisma.salonMessage.create({
    data: {
      authorId: jeanMarc.id,
      replyToId: salonMsg1.id,
      content:
        "Bonjour Alexandre. À Genève, l'air ambiant commence à s'assécher avec le chauffage des résidences. J'ai légèrement augmenté la ventilation passive des cabinets. Les capes grasses de la cosecha 2010 conservent une souplesse remarquable. Prenez soin de vos tirages !",
      createdAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 heures avant
    },
  });

  await prisma.salonPreference.create({
    data: {
      userId: alexandre.id,
      replyNotificationsEnabled: true,
      acceptedCharterVersion: "v2.0",
    },
  });

  await prisma.salonPreference.create({
    data: {
      userId: jeanMarc.id,
      replyNotificationsEnabled: true,
      acceptedCharterVersion: "v2.0",
    },
  });

  console.log("✓ Le Salon unique initialisé avec fil collectif et charte acceptée");
  console.log("✅ Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
