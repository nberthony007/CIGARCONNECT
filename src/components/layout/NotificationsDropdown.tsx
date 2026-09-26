"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  ArrowLeftRight, 
  Droplets, 
  ShieldCheck, 
  CheckCheck,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "trade" | "humidor" | "auth";
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  linkUrl: string;
  linkLabel: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "trade",
    title: "Proposition d'échange reçue",
    description: "Jean-Marc (Paris) souhaite échanger 1x Cohiba Behike 56 contre votre Trinidad Fundadores 1998.",
    timestamp: "Il y a 14 min",
    unread: true,
    linkUrl: "/trade",
    linkLabel: "Examiner l'offre",
  },
  {
    id: "notif-2",
    type: "humidor",
    title: "Humidor Principal stabilisé",
    description: "Hygrométrie régulée à 69.2% HR (19.4°C). Sachets Boveda 72 conformes.",
    timestamp: "Il y a 2h",
    unread: true,
    linkUrl: "/humidor",
    linkLabel: "Voir les capteurs",
  },
  {
    id: "notif-3",
    type: "auth",
    title: "Sceau Habanos UV archivé",
    description: "Le certificat d'origine de votre boîte BBM MAY 10 a été documenté avec succès.",
    timestamp: "Hier à 17:40",
    unread: false,
    linkUrl: "/humidor",
    linkLabel: "Consulter la fiche",
  },
];

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // Fermeture au clic extérieur et touche Échap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "trade":
        return <ArrowLeftRight className="w-4 h-4 text-[#AA8959]" strokeWidth={1.8} />;
      case "humidor":
        return <Droplets className="w-4 h-4 text-[#35483F]" strokeWidth={1.8} />;
      case "auth":
        return <ShieldCheck className="w-4 h-4 text-[#71513B]" strokeWidth={1.8} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton Cloche de Notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
          isOpen
            ? "border-[#71513B] bg-[#F4F0E7] text-[#241E1A] shadow-inner"
            : "border-[#D9D0C2] bg-[#FFFFFF] text-[#5E534D] hover:border-[#AA8959] hover:text-[#241E1A] shadow-sm"
        }`}
        id="notificationBellBtn"
        title="Notifications du Cercle & Humidor"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" strokeWidth={1.6} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#8E6D3B] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#FFFFFF] shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Volet Déroulant des Notifications */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-[320px] sm:w-[380px] rounded-xl border border-[#D9D0C2] bg-[#FFFFFF] shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
          {/* En-tête du volet */}
          <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border-b border-[#D9D0C2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8E6D3B]" />
              <h3 className="font-serif text-sm font-semibold text-[#241E1A]">
                Notifications du Cercle
              </h3>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#8E6D3B]/10 text-[#8E6D3B] border border-[#8E6D3B]/25">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-[10px] text-[#8D8078]">À jour</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#71513B] hover:text-[#241E1A] transition-colors cursor-pointer"
                title="Marquer toutes les notifications comme lues"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#AA8959]" />
                <span>Tout marquer lu</span>
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          <div className="divide-y divide-[#D9D0C2]/60 max-h-[380px] overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 sm:p-4 transition-colors ${
                  notif.unread
                    ? "bg-[#FAF7F2]/80 hover:bg-[#F4F0E7]"
                    : "bg-[#FFFFFF] hover:bg-[#FAF7F2]/50 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#D9D0C2] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-semibold text-[#241E1A] truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-[#8D8078] shrink-0 font-light">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#5E534D] leading-relaxed line-clamp-2">
                      {notif.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between">
                      <Link
                        href={notif.linkUrl}
                        onClick={() => {
                          markSingleAsRead(notif.id);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8E6D3B] hover:text-[#71513B] transition-colors group"
                      >
                        <span>{notif.linkLabel}</span>
                        <ChevronRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>

                      {notif.unread && (
                        <button
                          onClick={() => markSingleAsRead(notif.id)}
                          className="text-[9px] text-[#8D8078] hover:text-[#241E1A] transition-colors cursor-pointer"
                        >
                          Marquer lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pied du volet avec raccourcis */}
          <div className="p-3 bg-[#FAF7F2] border-t border-[#D9D0C2] flex items-center justify-between text-[11px]">
            <Link
              href="/trade"
              onClick={() => setIsOpen(false)}
              className="text-[#71513B] hover:text-[#241E1A] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Salon Le Cercle</span>
              <ExternalLink className="w-3 h-3 text-[#AA8959]" />
            </Link>
            <Link
              href="/humidor"
              onClick={() => setIsOpen(false)}
              className="text-[#71513B] hover:text-[#241E1A] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Mon Humidor</span>
              <ExternalLink className="w-3 h-3 text-[#AA8959]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
