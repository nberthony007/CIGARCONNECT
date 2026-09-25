"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  initials: string;
  role: "aficionado" | "conservateur" | "connoisseur_vip";
  memberSince: string;
  affinity?: string;
  bio?: string;
  isVerified: boolean;
  privacy: {
    showLocation: boolean;
    showBio: boolean;
    isCollectionPublic: boolean;
  };
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  city: string;
  country: string;
  affinity?: string;
}

export const PILOT_USERS: Record<string, UserProfile> = {
  alexandre: {
    id: "usr_alexandre_01",
    firstName: "Alexandre",
    lastName: "de Montmirail",
    email: "alexandre.m@cigarconnect.fr",
    city: "Paris",
    country: "France",
    initials: "AM",
    role: "connoisseur_vip",
    memberSince: "Membre depuis 2024",
    affinity: "Habanos Grands Crus & Millésimes de collection",
    bio: "Amateur attentif de vitoles cubaines et dominicaines de conservation soignée. Collection axée sur les grands formats et tirages limités.",
    isVerified: true,
    privacy: {
      showLocation: true,
      showBio: true,
      isCollectionPublic: false,
    },
  },
  jeanmarc: {
    id: "usr_jeanmarc_02",
    firstName: "Jean-Marc",
    lastName: "Lambert",
    email: "jm.lambert@cigarconnect.ch",
    city: "Genève",
    country: "Suisse",
    initials: "JL",
    role: "conservateur",
    memberSince: "Membre depuis 2025",
    affinity: "Terroirs Vuelta Abajo & Pre-Embargo",
    bio: "Spécialiste de la régulation d'hygrométrie en armoire de cèdre massif. Focus sur les millésimes 1998–2010.",
    isVerified: true,
    privacy: {
      showLocation: true,
      showBio: true,
      isCollectionPublic: false,
    },
  },
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signup" | "login";
  isVisitorPreviewMode: boolean;
  openAuthModal: (tab?: "signup" | "login") => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: "signup" | "login") => void;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (presetKey: "alexandre" | "jeanmarc" | "visitor") => void;
  toggleVisitorPreviewMode: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "cigarconnect_auth_user_v2";
const PREVIEW_KEY = "cigarconnect_visitor_preview_v2";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signup" | "login">("signup");
  const [isVisitorPreviewMode, setIsVisitorPreviewMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation à partir du stockage local
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Profil pilote actif par défaut pour faciliter la navigation
        setUser(PILOT_USERS.alexandre);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PILOT_USERS.alexandre));
      }

      const previewStored = localStorage.getItem(PREVIEW_KEY);
      if (previewStored === "true") {
        setIsVisitorPreviewMode(true);
      }
    } catch {
      setUser(PILOT_USERS.alexandre);
    }

    // Détection des liens profonds (?auth=signup, ?register=1, ?auth=login)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authParam = params.get("auth") || (params.get("register") ? "signup" : null) || (params.get("login") ? "login" : null);
      if (authParam === "signup" || authParam === "login") {
        setAuthModalTab(authParam);
        setIsAuthModalOpen(true);
      }
    }

    setIsInitialized(true);
  }, []);

  const openAuthModal = (tab: "signup" | "login" = "signup") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    // Si l'e-mail correspond à l'un de nos utilisateurs pilotes
    const cleanEmail = email.trim().toLowerCase();
    let foundUser: UserProfile | null = null;

    if (cleanEmail.includes("jeanmarc") || cleanEmail.includes("lambert")) {
      foundUser = PILOT_USERS.jeanmarc;
    } else {
      foundUser = PILOT_USERS.alexandre;
    }

    setUser(foundUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foundUser));
    closeAuthModal();
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    const fn = data.firstName.trim();
    const ln = data.lastName.trim();

    if (!fn || !ln || !data.email.trim()) {
      return { success: false, error: "Veuillez renseigner votre prénom, nom et adresse e-mail." };
    }

    const initials = `${fn.charAt(0)}${ln.charAt(0)}`.toUpperCase() || "AF";

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      firstName: fn,
      lastName: ln,
      email: data.email.trim(),
      city: data.city.trim() || "Paris",
      country: data.country.trim() || "France",
      initials,
      role: "aficionado",
      memberSince: "Membre depuis 2026",
      affinity: data.affinity || "Grands crus de collection",
      bio: "Nouvel aficionado membre du Cercle CigarConnect.",
      isVerified: true,
      privacy: {
        showLocation: true,
        showBio: true,
        isCollectionPublic: false,
      },
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    closeAuthModal();
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchDemoUser = (presetKey: "alexandre" | "jeanmarc" | "visitor") => {
    if (presetKey === "visitor") {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    } else {
      const selected = PILOT_USERS[presetKey];
      setUser(selected);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    }
    closeAuthModal();
  };

  const toggleVisitorPreviewMode = () => {
    setIsVisitorPreviewMode((prev) => {
      const next = !prev;
      localStorage.setItem(PREVIEW_KEY, String(next));
      return next;
    });
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isInitialized && user !== null,
        isAuthModalOpen,
        authModalTab,
        isVisitorPreviewMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        login,
        signup,
        logout,
        switchDemoUser,
        toggleVisitorPreviewMode,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
