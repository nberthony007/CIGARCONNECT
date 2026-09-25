"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Composant ScrollToTop global :
 * Garantit que lors de tout changement de page ou de route sur CigarConnect,
 * le défilement est réinitialisé immédiatement au sommet absolu (top: 0, left: 0),
 * immédiatement et lors des frames suivantes pour contrer tout décalage DOM.
 */
export const ScrollToTop: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Si l'utilisateur clique spécifiquement sur une ancre (ex: #catalogue) présente dans le DOM
    if (window.location.hash && document.querySelector(window.location.hash)) {
      return;
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
    const t1 = setTimeout(resetScroll, 30);
    const t2 = setTimeout(resetScroll, 100);
    const t3 = setTimeout(resetScroll, 250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return null;
};

