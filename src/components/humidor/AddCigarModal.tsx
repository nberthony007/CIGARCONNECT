"use client";

import React, { useState, useMemo } from "react";
import { 
  X, 
  Box, 
  Droplets, 
  ShieldCheck, 
  ArrowLeftRight, 
  Award, 
  Sparkles,
  Loader2,
  Search,
  PlusCircle,
  CheckCircle2,
  Info,
  HelpCircle,
  Send,
  Upload,
  Eye,
  Lock
} from "lucide-react";
import { addHumidorLot, submitCatalogContribution } from "@/lib/actions/humidor";
import { SpecimenPhotoUploader } from "./SpecimenPhotoUploader";

interface AddCigarModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  universalCigars: Array<{
    id: string;
    brand: string;
    name: string;
    origin: string;
    vitola: string;
    ringGauge: number;
    lengthMm: number;
    vintageYear: string | null;
    defaultImageUrl: string;
    rarityLabel?: string;
  }>;
  onLotAdded?: () => void;
}

type AddFlowStep = "search" | "fill_referenced" | "fill_custom" | "contribute_preview";

export const AddCigarModal: React.FC<AddCigarModalProps> = ({
  isOpen,
  onClose,
  userId,
  universalCigars,
  onLotAdded,
}) => {
  // Navigation dans le parcours hybride
  const [step, setStep] = useState<AddFlowStep>("search");

  // Étape 1 : Recherche tolérante
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCigarId, setSelectedCigarId] = useState<string>("");

  // Étape 2A : Référence sélectionnée
  const [quantity, setQuantity] = useState<number>(1);
  const [packaging, setPackaging] = useState<string>("Boîte de 10");
  const [boxCode, setBoxCode] = useState<string>("");
  const [provenance, setProvenance] = useState<string>("");
  const [humidorLocation, setHumidorLocation] = useState<string>("Humidor Principal — Tiroir supérieur");
  const [conditionHr, setConditionHr] = useState<string>("69% HR");
  const [conditionTemp, setConditionTemp] = useState<string>("19°C");
  const [conditionNotes, setConditionNotes] = useState<string>("");
  const [acquisitionDate, setAcquisitionDate] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [privateNotes, setPrivateNotes] = useState<string>("");
  const [isTradeable, setIsTradeable] = useState<boolean>(false); // Privé par défaut (Section 3.3)

  // Étape 2B : Pièce non répertoriée / Hors catalogue
  const [customDesignation, setCustomDesignation] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [unknownBrandOrModel, setUnknownBrandOrModel] = useState(false);
  const [customVitola, setCustomVitola] = useState("");
  const [customOrigin, setCustomOrigin] = useState("Cuba");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");

  // État UI & notifications
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Recherche tolérante (accents, minuscules, ponctuation)
  const filteredCigars = useMemo(() => {
    if (!searchQuery.trim()) return universalCigars;
    const q = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return universalCigars.filter((c) => {
      const brand = c.brand
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const name = c.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const vitola = c.vitola
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return brand.includes(q) || name.includes(q) || vitola.includes(q);
    });
  }, [searchQuery, universalCigars]);

  const selectedCigar = universalCigars.find((c) => c.id === selectedCigarId);

  if (!isOpen) return null;

  // Réinitialisation lors de la fermeture
  const handleModalClose = () => {
    setStep("search");
    setSearchQuery("");
    setSelectedCigarId("");
    setCustomPhotoUrl("");
    setErrorMsg(null);
    setSuccessBanner(null);
    onClose();
  };

  // Soumission Étape 2A (Pièce référencée)
  const handleSubmitReferenced = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCigarId) {
      setErrorMsg("Veuillez sélectionner une référence du catalogue.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await addHumidorLot({
      userId,
      cigarReferenceId: selectedCigarId,
      quantity: Number(quantity) || 1,
      packaging,
      boxCode: boxCode.trim() || undefined,
      boxCodeVerified: Boolean(boxCode.trim()),
      provenanceDeclared: provenance.trim() || undefined,
      humidorLocation: humidorLocation.trim() || undefined,
      conditionHr: conditionHr.trim() || "69% HR",
      conditionTemp: conditionTemp.trim() || "19°C",
      conditionNotes: conditionNotes.trim() || undefined,
      acquisitionDate: acquisitionDate.trim() || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      privateNotes: privateNotes.trim() || undefined,
      customPhotoUrl: customPhotoUrl.trim() || undefined,
      isTradeable,
      isPublic: isTradeable,
    });

    setLoading(false);

    if (res.success) {
      if (onLotAdded) onLotAdded();
      handleModalClose();
    } else {
      setErrorMsg(res.error || "Erreur lors de l'enregistrement de la vitole.");
    }
  };

  // Soumission Étape 2B (Pièce non répertoriée / Ajout instantané sans blocage)
  const handleSubmitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDesignation.trim()) {
      setErrorMsg("Veuillez renseigner une désignation pour votre pièce.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await addHumidorLot({
      userId,
      isCustomPiece: true,
      customBrand: unknownBrandOrModel ? "Marque à identifier" : (customBrand.trim() || "Marque à identifier"),
      customName: customDesignation.trim(),
      customVitola: customVitola.trim() || "Module à déterminer",
      customOrigin: customOrigin.trim() || "Cuba",
      customPhotoUrl: customPhotoUrl.trim() || undefined,
      quantity: Number(quantity) || 1,
      packaging,
      boxCode: boxCode.trim() || undefined,
      boxCodeVerified: Boolean(boxCode.trim()),
      provenanceDeclared: provenance.trim() || undefined,
      humidorLocation: humidorLocation.trim() || undefined,
      conditionHr: conditionHr.trim() || "69% HR",
      conditionTemp: conditionTemp.trim() || "19°C",
      conditionNotes: conditionNotes.trim() || undefined,
      acquisitionDate: acquisitionDate.trim() || undefined,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined,
      privateNotes: privateNotes.trim() || undefined,
      isTradeable,
      isPublic: isTradeable,
    });

    setLoading(false);

    if (res.success) {
      if (onLotAdded) onLotAdded();
      // Message exact prescrit par la spécification (Section 4 & 19)
      setSuccessBanner("Pièce ajoutée à votre humidor privé. Vous pourrez compléter son identification plus tard.");
      setTimeout(() => {
        handleModalClose();
      }, 1500);
    } else {
      setErrorMsg(res.error || "Impossible d'enregistrer la pièce en cave.");
    }
  };

  // Soumission Étape 4 (Contribution volontaire au catalogue)
  const handleVoluntaryContribution = async () => {
    setLoading(true);
    setErrorMsg(null);

    const res = await submitCatalogContribution({
      userId,
      brand: unknownBrandOrModel ? "Inconnue" : (customBrand.trim() || "Marque proposée"),
      name: customDesignation.trim() || "Modèle proposé",
      format: customVitola.trim() || "Module à définir",
      originCountry: customOrigin,
      shareableImageUrl: customPhotoUrl.trim() || undefined,
    });

    setLoading(false);

    if (res.success) {
      setSuccessBanner(res.message || "Votre proposition a été transmise avec succès.");
      setTimeout(() => {
        handleModalClose();
      }, 2000);
    } else {
      setErrorMsg(res.error || "Échec de transmission de la contribution.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Arrière-plan feutré */}
      <div
        className="fixed inset-0 bg-[#211D19]/70 backdrop-blur-md transition-opacity"
        onClick={handleModalClose}
        aria-hidden="true"
      />

      {/* Conteneur principal */}
      <div className="relative w-full max-w-2xl bg-[#F7F5F0] border border-[#D9D2C7] rounded-2xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]">
        
        {/* En-tête raffiné Apple/CigarConnect */}
        <div className="bg-[#211D19] text-[#F7F5F0] p-4 sm:p-5 flex items-center justify-between border-b border-[#D9D2C7]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C4935] flex items-center justify-center text-[#F7F5F0] border border-[#A88958]/50 shadow-inner shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide">
                {step === "search" && "Ajouter une pièce en cave"}
                {step === "fill_referenced" && "Consigner une vitole de référence"}
                {step === "fill_custom" && "Consigner une pièce personnelle"}
                {step === "contribute_preview" && "Proposer au catalogue commun"}
              </h3>
              <p className="text-xs text-[#EEEAE3]/80 font-light">
                {step === "search" && "Recherche dans le catalogue ou enregistrement direct"}
                {step === "fill_referenced" && "Conservation 68–70% HR & traçabilité Boveda"}
                {step === "fill_custom" && "Enregistrement privé immédiat sans blocage"}
                {step === "contribute_preview" && "Revue éditoriale sans divulgation de données privées"}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="w-8 h-8 rounded-lg border border-[#D9D2C7]/40 flex items-center justify-center text-[#EEEAE3] hover:text-[#FFFFFF] hover:bg-[#6C4935] transition-colors"
            aria-label="Fermer la boîte de dialogue"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bannière de notification / confirmation */}
        {successBanner && (
          <div className="p-3.5 bg-[#365343] text-[#F7F5F0] text-xs font-medium flex items-center gap-2 border-b border-[#365343]/30">
            <CheckCircle2 className="w-4 h-4 text-[#A88958] shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Message d'erreur */}
        {errorMsg && (
          <div className="p-3 bg-red-900/10 border-b border-red-800/20 text-xs text-red-900 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Corps avec défilement fluide */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 grow">

          {/* ======================================================== */}
          {/* ÉTAPE 1 — RECHERCHER DANS LE CATALOGUE (Section 4)       */}
          {/* ======================================================== */}
          {step === "search" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                  Marque, nom ou référence
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#645C54]" />
                  <input
                    type="text"
                    placeholder="Ex: Cohiba Behike, Trinidad, Montecristo No. 2..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19] font-medium placeholder-[#857A6D] focus:outline-none focus:border-[#A88958] shadow-sm transition-colors"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#645C54]">
                  La recherche tolère accents, majuscules et variantes d'orthographe.
                </p>
              </div>

              {/* Bouton permanent Étape 2B : « Je ne trouve pas ma pièce » (Section 4 & 19) */}
              <div className="p-3.5 rounded-xl bg-[#EEEAE3]/60 border border-[#D9D2C7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-semibold text-[#211D19] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#6C4935]" />
                    Votre pièce est absente ou le modèle est inconnu ?
                  </div>
                  <div className="text-[11px] text-[#645C54] mt-0.5">
                    Enregistrez-la immédiatement dans votre humidor privé sans être bloqué.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCustomPhotoUrl("");
                    setStep("fill_custom");
                  }}
                  className="btn-ink-primary text-xs px-3.5 py-1.5 shrink-0 flex items-center gap-1.5 justify-center"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#A88958]" />
                  <span>Je ne trouve pas ma pièce</span>
                </button>
              </div>

              {/* Résultats du catalogue de référence */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#645C54] uppercase tracking-wider">
                  Références documentées ({filteredCigars.length})
                </div>

                <div className="divide-y divide-[#D9D2C7] max-h-72 overflow-y-auto rounded-xl border border-[#D9D2C7] bg-[#FFFFFF]">
                  {filteredCigars.length === 0 ? (
                    <div className="p-6 text-center space-y-3">
                      <p className="text-xs text-[#645C54]">
                        « Votre pièce n’est pas encore référencée. Ajoutez-la à votre humidor. »
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep("fill_custom")}
                        className="btn-ink-primary text-xs px-4 py-2"
                      >
                        Consigner ma pièce hors catalogue
                      </button>
                    </div>
                  ) : (
                    filteredCigars.map((cigar) => (
                      <div
                        key={cigar.id}
                        onClick={() => {
                          setSelectedCigarId(cigar.id);
                          setCustomPhotoUrl("");
                          setStep("fill_referenced");
                        }}
                        className="p-3 hover:bg-[#EEEAE3]/50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={cigar.defaultImageUrl}
                            alt={cigar.name}
                            className="w-12 h-12 rounded-lg object-cover border border-[#D9D2C7] shrink-0"
                          />
                          <div>
                            <div className="font-serif font-semibold text-xs sm:text-sm text-[#211D19] group-hover:text-[#6C4935] transition-colors">
                              {cigar.brand} {cigar.name}
                            </div>
                            <div className="text-[11px] text-[#645C54]">
                              {cigar.origin} · {cigar.vitola} · {cigar.lengthMm} mm (Cepo {cigar.ringGauge})
                            </div>
                            {/* Libellé obligatoire Section 4 & 19 */}
                            <div className="text-[10px] text-[#857A6D] italic mt-0.5">
                              Photo de référence — ne représente pas votre exemplaire.
                            </div>
                          </div>
                        </div>

                        <span className="text-xs font-semibold text-[#6C4935] group-hover:underline shrink-0">
                          Choisir →
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* ÉTAPE 2A — FORMULAIRE RÉFÉRENCE DOCUMENTÉE (Section 4)   */}
          {/* ======================================================== */}
          {step === "fill_referenced" && selectedCigar && (
            <form onSubmit={handleSubmitReferenced} className="space-y-4">
              {/* Carte récapitulative du modèle choisi */}
              <div className="p-3.5 rounded-xl bg-[#EEEAE3]/70 border border-[#D9D2C7] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCigar.defaultImageUrl}
                    alt={selectedCigar.name}
                    className="w-14 h-14 rounded-lg object-cover border border-[#D9D2C7] shrink-0"
                  />
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#A88958]">
                      Modèle Sélectionné
                    </div>
                    <div className="font-serif font-bold text-sm text-[#211D19]">
                      {selectedCigar.brand} {selectedCigar.name}
                    </div>
                    <div className="text-[11px] text-[#645C54]">
                      {selectedCigar.origin} · {selectedCigar.vitola} ({selectedCigar.lengthMm} mm · Cepo {selectedCigar.ringGauge})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("search")}
                  className="text-xs text-[#6C4935] hover:underline font-semibold"
                >
                  Changer
                </button>
              </div>

              {/* Quantité & Format de boîte */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Quantité possédée (Unités)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs font-semibold text-[#211D19]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Format de Conditionnement
                  </label>
                  <select
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs font-medium text-[#211D19]"
                  >
                    <option value="Boîte de 10">Boîte de 10</option>
                    <option value="Cabinet verni de 25">Cabinet verni de 25</option>
                    <option value="Cabinet verni de 50">Cabinet verni de 50</option>
                    <option value="Coffret numéroté">Coffret numéroté</option>
                    <option value="Boîte de 15 laquée">Boîte de 15 laquée</option>
                    <option value="Unité individuelle sous étui cèdre">Unité sous étui cèdre</option>
                    <option value="Unité individuelle">Unité individuelle</option>
                  </select>
                </div>
              </div>

              {/* Emplacement privé & Code usine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Emplacement privé dans l'humidor
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Armoire Cèdre — Tiroir B"
                    value={humidorLocation}
                    onChange={(e) => setHumidorLocation(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Code Boîte / Sceau de Manufacture
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: BBM MAY 10"
                    value={boxCode}
                    onChange={(e) => setBoxCode(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19] font-mono"
                  />
                </div>
              </div>

              {/* Conservation Boveda 68-70% HR */}
              <div className="p-3.5 rounded-xl bg-[#EEEAE3]/60 border border-[#D9D2C7] space-y-2">
                <div className="text-xs font-semibold text-[#365343] flex items-center gap-1.5 uppercase tracking-wider">
                  <Droplets className="w-3.5 h-3.5 text-[#365343]" />
                  <span>Mesures de conservation (68–70% HR recommandés)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={conditionHr}
                    onChange={(e) => setConditionHr(e.target.value)}
                    className="p-2 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs font-medium"
                    placeholder="Hygrométrie (ex: 69% HR)"
                  />
                  <input
                    type="text"
                    value={conditionTemp}
                    onChange={(e) => setConditionTemp(e.target.value)}
                    className="p-2 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs font-medium"
                    placeholder="Température (ex: 19°C)"
                  />
                </div>
              </div>

              {/* Données privées de collection (Section 3.3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#D9D2C7]">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#211D19] flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#645C54]" />
                    Prix d'acquisition privé (€)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 850 (strictement confidentiel)"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#211D19]">
                    Date d'acquisition
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Vente privée mai 2021"
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>
              </div>

              {/* Photographie personnelle facultative de votre exemplaire */}
              <div className="pt-2 border-t border-[#D9D2C7]">
                <SpecimenPhotoUploader
                  value={customPhotoUrl}
                  onChange={setCustomPhotoUrl}
                  label="Photo de votre exemplaire ou boîte (Facultative)"
                  description="Par défaut, l'illustration officielle du catalogue est utilisée. Vous pouvez joindre la photo réelle de votre boîte ou de vos vitoles pour attester de leur patine, état et bague."
                />
              </div>

              {/* Disponibilité pour l'échange dans Le Cercle */}
              <div className="p-3 rounded-xl bg-[#EEEAE3]/60 border border-[#D9D2C7] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#211D19] flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-[#6C4935]" />
                    Rendre cette pièce disponible à l'échange
                  </div>
                  <div className="text-[11px] text-[#645C54]">
                    Par défaut : pièce privée et indisponible à l'échange.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isTradeable}
                  onChange={(e) => setIsTradeable(e.target.checked)}
                  className="w-4 h-4 accent-[#6C4935]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#D9D2C7]">
                <button
                  type="button"
                  onClick={() => setStep("search")}
                  className="px-3 py-2 text-xs font-medium text-[#645C54] hover:text-[#211D19]"
                >
                  ← Retour au catalogue
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ink-primary text-xs px-5 py-2.5 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#A88958]" />
                  )}
                  <span>Consigner dans mon Humidor</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* ÉTAPE 2B — FORMULAIRE PIÈCE ABSENTE / HORS CATALOGUE     */}
          {/* ======================================================== */}
          {step === "fill_custom" && (
            <form onSubmit={handleSubmitCustom} className="space-y-4">
              <div className="p-3 bg-[#EEEAE3] rounded-xl border border-[#D9D2C7] text-xs text-[#211D19] space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#365343]" />
                  Enregistrement immédiat dans votre humidor personnel
                </div>
                <p className="text-[11px] text-[#645C54]">
                  Vous pouvez enregistrer cette pièce même si le modèle exact ou la bague sont inconnus. Vous pourrez compléter son identification ultérieurement.
                </p>
              </div>

              {/* Désignation libre & Marque */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                  Désignation de la pièce *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cabinet de mon grand-père - La Havane 1980, ou Vitole anonyme achetée à Vuelta Abajo"
                  value={customDesignation}
                  onChange={(e) => setCustomDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19] font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Marque (si connue)
                  </label>
                  <input
                    type="text"
                    disabled={unknownBrandOrModel}
                    placeholder={unknownBrandOrModel ? "Modèle non identifié" : "Ex: San Cristóbal, Partagas, Diplomaticos..."}
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19] disabled:bg-[#EEEAE3] disabled:text-[#857A6D]"
                  />
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-[#645C54] cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={unknownBrandOrModel}
                      onChange={(e) => setUnknownBrandOrModel(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#6C4935]"
                    />
                    <span>Je ne connais pas le modèle ou la marque</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Format / Vitole (si connu)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Robusto, Corona Gorda, Churchill, ou Inconnu"
                    value={customVitola}
                    onChange={(e) => setCustomVitola(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>
              </div>

              {/* Quantité & Origine */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Quantité possédée
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs font-semibold text-[#211D19]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
                    Origine présumée
                  </label>
                  <select
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  >
                    <option value="Cuba">Cuba</option>
                    <option value="République Dominicaine">République Dominicaine</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Autre / Non déterminée">Autre / Non déterminée</option>
                  </select>
                </div>
              </div>

              {/* Photo personnelle facultative */}
              <SpecimenPhotoUploader
                value={customPhotoUrl}
                onChange={setCustomPhotoUrl}
                label="Photo de votre exemplaire (Facultative)"
                description="Une photo réelle de votre vitole, boîte ou bague permet de préserver l'historique visuel de votre cave."
              />

              {/* Emplacement privé & Notes secrètes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#211D19]">
                    Emplacement privé en humidor
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cave cèdre salon — Étage 2"
                    value={humidorLocation}
                    onChange={(e) => setHumidorLocation(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#211D19]">
                    Notes privées de conservation
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Gardé sous 69% HR, cape grasse et intacte"
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#FFFFFF] border border-[#D9D2C7] text-xs text-[#211D19]"
                  />
                </div>
              </div>

              {/* Option Étape 4 : Proposer au catalogue commun */}
              <div className="p-3.5 rounded-xl bg-[#EEEAE3]/60 border border-[#D9D2C7] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#211D19]">
                    Souhaitez-vous proposer cette pièce au catalogue commun ?
                  </div>
                  <div className="text-[11px] text-[#645C54]">
                    Permet au comité éditorial d'enrichir le catalogue pour toute la communauté.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("contribute_preview")}
                  className="px-3 py-1.5 rounded-lg border border-[#A88958] text-xs font-semibold text-[#6C4935] hover:bg-[#EEEAE3] transition-colors"
                >
                  Prévisualiser l'envoi
                </button>
              </div>

              {/* Actions de sauvegarde immédiate */}
              <div className="flex items-center justify-between pt-3 border-t border-[#D9D2C7]">
                <button
                  type="button"
                  onClick={() => setStep("search")}
                  className="px-3 py-2 text-xs font-medium text-[#645C54] hover:text-[#211D19]"
                >
                  ← Retour à la recherche
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-ink-primary text-xs px-5 py-2.5 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#A88958]" />
                  )}
                  <span>Enregistrer dans mon Humidor</span>
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* ÉTAPE 4 — CONTRIBUTION VOLONTAIRE AU CATALOGUE           */}
          {/* ======================================================== */}
          {step === "contribute_preview" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#EEEAE3] rounded-xl border border-[#D9D2C7] space-y-1.5">
                <div className="text-xs font-bold text-[#211D19] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#365343]" />
                  Aperçu transparent de la proposition au catalogue (Section 4 & 5)
                </div>
                <p className="text-[11px] text-[#645C54]">
                  CigarConnect protège rigoureusement la vie privée de votre collection. Seules les caractéristiques génériques du modèle sont transmises.
                </p>
              </div>

              {/* Comparatif Ce qui est partagé VS Ce qui reste strictement privé */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Données publiques transmises */}
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="text-[11px] font-bold text-[#365343] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#365343]" />
                    Données transmises pour revue :
                  </div>
                  <ul className="text-xs text-[#211D19] space-y-1 list-disc list-inside">
                    <li>Marque : <strong>{customBrand || "Inconnue"}</strong></li>
                    <li>Désignation : <strong>{customDesignation || "Modèle proposé"}</strong></li>
                    <li>Format / Vitole : <strong>{customVitola || "Non précisé"}</strong></li>
                    <li>Origine : <strong>{customOrigin}</strong></li>
                    <li className="flex items-center gap-1.5">
                      <span>Photographie du modèle :</span>
                      {customPhotoUrl ? (
                        <span className="text-[#365343] font-semibold">Jointe (optimisée)</span>
                      ) : (
                        <span className="text-[#857A6D]">Non fournie</span>
                      )}
                    </li>
                  </ul>
                  {customPhotoUrl && (
                    <div className="mt-2 pt-2 border-t border-[#D9D2C7]/60 flex items-center gap-2">
                      <img
                        src={customPhotoUrl}
                        alt="Aperçu photo"
                        className="w-12 h-12 object-cover rounded-lg border border-[#D9D2C7] shadow-sm"
                      />
                      <span className="text-[10px] text-[#645C54]">
                        Cette photo illustrera la fiche catalogue proposée.
                      </span>
                    </div>
                  )}
                </div>

                {/* Données de cave exclues par défaut */}
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] space-y-2">
                  <div className="text-[11px] font-bold text-red-900 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-red-800" />
                    Exclues formellement (Strictement Privées) :
                  </div>
                  <ul className="text-xs text-[#645C54] space-y-1 list-disc list-inside">
                    <li>Votre stock possédé ({quantity} unités)</li>
                    <li>Prix d'achat & devise</li>
                    <li>Emplacement de stockage ({humidorLocation})</li>
                    <li>Vos notes personnelles de dégustation</li>
                    <li>Identité du vendeur ou de provenance</li>
                  </ul>
                </div>
              </div>

              <div className="text-[11px] text-[#857A6D] italic">
                En transmettant cette proposition, vous autorisez le comité éditorial de CigarConnect à étudier la création d'une fiche commune dans le catalogue patrimonial.
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-between pt-3 border-t border-[#D9D2C7]">
                <button
                  type="button"
                  onClick={() => setStep("fill_custom")}
                  className="px-3 py-2 text-xs font-medium text-[#645C54] hover:text-[#211D19]"
                >
                  ← Modifier les informations
                </button>

                <button
                  type="button"
                  onClick={handleVoluntaryContribution}
                  disabled={loading}
                  className="btn-ink-primary text-xs px-5 py-2.5 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-[#A88958]" />
                  )}
                  <span>Confirmer & Proposer au catalogue</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
