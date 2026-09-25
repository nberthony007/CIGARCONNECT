"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "info" | "error";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Disparition automatique après 4.5 secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div 
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-md w-full pointer-events-none p-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
              toast.type === "success"
                ? "bg-[#241E1A] text-[#FAF7F2] border-[#AA8959]"
                : toast.type === "error"
                ? "bg-[#3D1414] text-[#FAF7F2] border-red-500"
                : "bg-[#241E1A] text-[#FAF7F2] border-[#D9D0C2]"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#AA8959]" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}
              {toast.type === "info" && <Info className="w-5 h-5 text-[#AA8959]" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-serif font-bold text-sm text-[#FAF7F2]">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-xs text-[#D9D0C2] mt-0.5 leading-relaxed font-light">
                  {toast.message}
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#D9D0C2]/60 hover:text-white transition-colors shrink-0 p-1"
              aria-label="Fermer la notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback gracieux si utilisé hors du provider
    return {
      showToast: (title: string, message?: string) => {
        console.log(`[Toast] ${title}: ${message || ""}`);
      },
    };
  }
  return context;
};
