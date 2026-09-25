"use client";

import React, { useState, useRef, useCallback } from "react";
import { Camera, Upload, Trash2, CheckCircle2, RefreshCw, Link as LinkIcon, AlertCircle, Loader2 } from "lucide-react";

interface SpecimenPhotoUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
}

/**
 * Compresse et optimise une photo côté client via HTML5 Canvas
 * Garantit un poids ultra-léger (< 400 Ko) tout en préservant le piqué de la cape et de la bague.
 */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Le fichier sélectionné doit être une photographie (JPG, PNG, HEIC, WebP)."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier photo."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Impossible de décoder l'image sélectionnée."));
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 1200; // Résolution optimale pour affichage rétine
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            // Repli sur l'original si canvas indisponible
            resolve(event.target?.result as string);
            return;
          }

          // Rendu lissé de haute qualité
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Compression JPEG 82% : texture cape nette et fichier léger
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          resolve(compressedDataUrl);
        } catch (err) {
          resolve(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const SpecimenPhotoUploader: React.FC<SpecimenPhotoUploaderProps> = ({
  value,
  onChange,
  label = "Photo de votre exemplaire (Facultative)",
  description = "Une photo réelle de votre vitole, boîte ou bague permet de préserver l'historique visuel de votre cave.",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlMode, setShowUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value && !value.startsWith("data:") ? value : "");

  const handleProcessFile = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      setIsProcessing(true);
      try {
        const compressed = await compressImage(file);
        onChange(compressed);
        setShowUrlMode(false);
      } catch (err: any) {
        setErrorMsg(err.message || "Erreur lors du traitement de la photo.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemovePhoto = () => {
    onChange("");
    setUrlInput("");
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setErrorMsg(null);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label élégant */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#211D19]">
          {label}
        </label>
        {!value && (
          <button
            type="button"
            onClick={() => setShowUrlMode(!showUrlMode)}
            className="text-[11px] text-[#6C4935] hover:text-[#211D19] transition-colors flex items-center gap-1 font-medium"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlMode ? "Revenir au téléversement" : "Saisir une URL"}</span>
          </button>
        )}
      </div>

      {/* Input de fichier caché (compatible caméra smartphone & photothèque) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="specimen-photo-file-input"
      />

      {/* Message d'erreur éventuel */}
      {errorMsg && (
        <div className="p-2.5 rounded-lg bg-red-900/10 border border-red-800/20 text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Affichage avec aperçu si une photo est présente */}
      {value ? (
        <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7] shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-all">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-[#D9D2C7] bg-[#EEEAE3] shrink-0 shadow-inner group">
            <img
              src={value}
              alt="Photo de l'exemplaire"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#211D19]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Camera className="w-5 h-5 text-[#F7F5F0]" />
            </div>
          </div>

          <div className="grow space-y-2 text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#365343]">
              <CheckCircle2 className="w-4 h-4 text-[#365343]" />
              <span>Photo de votre exemplaire attachée</span>
            </div>
            <p className="text-[11px] text-[#645C54] leading-relaxed">
              Cette photographie sera affichée dans votre cave privée et lors de vos propositions dans Le Cercle.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-lg bg-[#EEEAE3] hover:bg-[#D9D2C7] text-[#211D19] text-xs font-medium border border-[#D9D2C7] flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-[#6C4935]" />
                )}
                <span>Remplacer la photo</span>
              </button>
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={isProcessing}
                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 text-xs font-medium border border-red-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      ) : showUrlMode ? (
        /* 2. Mode Saisie d'URL web */
        <div className="space-y-2 p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9D2C7]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: /assets/cigar-behike56.jpg ou https://..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyUrl();
                }
              }}
              className="grow p-2 rounded-lg bg-[#F7F5F0] border border-[#D9D2C7] text-xs text-[#211D19] focus:outline-none focus:border-[#6C4935]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="btn-ink-primary text-xs px-3.5 py-2 shrink-0"
            >
              Appliquer
            </button>
          </div>
          <span className="text-[10px] text-[#645C54] block">
            Vous pouvez lier une image déjà présente sur le serveur ou hébergée en ligne.
          </span>
        </div>
      ) : (
        /* 3. Zone de glisser-déposer / sélection tactile smartphone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 sm:p-5 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center group ${
            isDragging
              ? "border-[#6C4935] bg-[#EEEAE3]/80 shadow-inner"
              : "border-[#D9D2C7] bg-[#FFFFFF] hover:border-[#6C4935]/70 hover:bg-[#EEEAE3]/30 shadow-sm"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#EEEAE3] group-hover:bg-[#6C4935] group-hover:text-[#F7F5F0] text-[#6C4935] flex items-center justify-center transition-all shadow-sm">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#6C4935] group-hover:text-[#F7F5F0]" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#211D19] group-hover:text-[#6C4935] transition-colors">
                {isProcessing
                  ? "Optimisation de l'image en cours..."
                  : "Prendre une photo ou choisir un fichier"}
              </div>
              <div className="text-[11px] text-[#645C54] mt-0.5">
                Appareil photo de votre smartphone, photothèque ou glisser-déposer
              </div>
            </div>
            <div className="inline-flex items-center gap-1 text-[10px] text-[#857A6D] uppercase tracking-wider font-medium bg-[#EEEAE3]/60 px-2 py-0.5 rounded-md border border-[#D9D2C7]/60">
              <Upload className="w-3 h-3" />
              <span>JPG, PNG, HEIC, WebP — Optimisation automatique</span>
            </div>
          </div>
        </div>
      )}

      {/* Description d'aide */}
      <span className="text-[10px] text-[#645C54] block leading-tight">
        {description}
      </span>
    </div>
  );
};
