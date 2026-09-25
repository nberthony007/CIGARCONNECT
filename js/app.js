/**
 * CIGARCONNECT — Application Principale & Orchestration
 * "Where Cigars Connect" — www.cigarconnect.net
 */

// Initialisation globale
document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initAuthenticityChecker();
  initLoungeThreads();
  initNotifications();
  initMembershipModal();
  initBrandModal();

  // Initialisation des modules métiers
  window.cigarCatalog = new CigarCatalog();
  window.userHumidor = new UserHumidor();
  window.cigarTrade = new CigarTrade();
  window.userProfile = new UserProfileManager();
});

/* ==========================================================================
   NAVIGATION PAR ONGLETS (SPA)
   ========================================================================== */
function initTabNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const sections = document.querySelectorAll('.view-section');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetView = tab.dataset.view;
      switchView(targetView);
    });
  });

  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    if (hash === 'open-add-cigar') {
      switchView('view-humidor');
      if (window.userHumidor) window.userHumidor.openAddModal();
    } else if (hash === 'open-visitor-preview') {
      switchView('view-humidor');
      if (window.userProfile) window.userProfile.openVisitorPreview();
    } else if (document.getElementById(hash)) {
      switchView(hash);
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  setTimeout(handleHashRoute, 100);
}

function navigateToHome() {
  switchView('view-catalog');
  try {
    history.replaceState(null, null, window.location.pathname + window.location.search);
  } catch(e) {}

  const resetScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  resetScroll();
  requestAnimationFrame(resetScroll);
  setTimeout(resetScroll, 25);
  setTimeout(resetScroll, 80);
  setTimeout(resetScroll, 200);
}
window.navigateToHome = navigateToHome;

function switchView(viewId) {
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const sections = document.querySelectorAll('.view-section');

  navTabs.forEach(t => {
    t.classList.toggle('active', t.dataset.view === viewId);
  });

  const mobileTabs = document.querySelectorAll('.mobile-nav-item-btn');
  mobileTabs.forEach(t => {
    t.classList.toggle('active', t.dataset.view === viewId);
  });

  sections.forEach(sec => {
    sec.classList.toggle('active', sec.id === viewId);
  });

  const heroSection = document.querySelector('.hero-section');
  const pillarsSection = document.querySelector('.pillars-grid')?.closest('section');
  const newArrivalsSection = document.querySelector('.new-arrivals-section')?.closest('section');

  const isHomeCatalog = (viewId === 'view-catalog');
  if (heroSection) heroSection.style.display = isHomeCatalog ? 'block' : 'none';
  if (pillarsSection) pillarsSection.style.display = isHomeCatalog ? 'block' : 'none';
  if (newArrivalsSection) newArrivalsSection.style.display = isHomeCatalog ? 'block' : 'none';

  if (isHomeCatalog) {
    try {
      history.replaceState(null, null, window.location.pathname + window.location.search);
    } catch(e) {}
  } else if (window.location.hash !== '#' + viewId) {
    try {
      history.replaceState(null, null, '#' + viewId);
    } catch(e) {}
  }

  // Scroll garanti tout en haut immédiatement et après le recalcul de rendu
  const resetScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  resetScroll();
  requestAnimationFrame(resetScroll);
  setTimeout(resetScroll, 30);
  setTimeout(resetScroll, 100);
}

/* ==========================================================================
   VÉRIFICATEUR D'AUTHENTICITÉ INTERACTIF
   ========================================================================== */
function initAuthenticityChecker() {
  const checkboxes = document.querySelectorAll('.auth-check-input');
  const scoreVal = document.getElementById('authScoreValue');
  const statusLabel = document.getElementById('authStatusLabel');
  const sealIcon = document.getElementById('authSealIcon');

  function updateScore() {
    const checkedCount = document.querySelectorAll('.auth-check-input:checked').length;
    const total = checkboxes.length;
    const percentage = Math.round((checkedCount / total) * 100);

    if (scoreVal) scoreVal.textContent = `${percentage}%`;

    if (percentage === 100) {
      statusLabel.textContent = "Conformité Maximale Détectée";
      statusLabel.style.color = "var(--pine-verify)";
      sealIcon.innerHTML = `<svg class="cc-icon cc-icon-xl" viewBox="0 0 24 24" fill="none" stroke="var(--pine-verify)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`;
    } else if (percentage >= 60) {
      statusLabel.textContent = "Présomption Forte (Examen UV Recommandé)";
      statusLabel.style.color = "var(--wood-cedar)";
      sealIcon.innerHTML = `<svg class="cc-icon cc-icon-xl" viewBox="0 0 24 24" fill="none" stroke="var(--wood-cedar)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
    } else {
      statusLabel.textContent = "Vigilance : Éléments Non Détectés";
      statusLabel.style.color = "var(--ruby-rare)";
      sealIcon.innerHTML = `<svg class="cc-icon cc-icon-xl" viewBox="0 0 24 24" fill="none" stroke="var(--ruby-rare)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
  }

  checkboxes.forEach(chk => {
    chk.addEventListener('change', updateScore);
  });
}

/* ==========================================================================
   LOUNGE & FORUMS
   ========================================================================== */
function initLoungeThreads() {
  const container = document.getElementById('loungeThreadsContainer');
  if (!container) return;

  container.innerHTML = INITIAL_THREADS.map(th => `
    <article style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1rem; transition: border-color 0.2s ease;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
        <span class="gold-badge" style="font-size: 0.68rem;">${th.category}</span>
        <span style="font-size: 0.78rem; color: var(--text-muted);">${th.time}</span>
      </div>
      <h3 style="font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 0.5rem; color: var(--text-primary);">
        ${th.title}
      </h3>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 1rem;">
        ${th.snippet}
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
        <span>Par <strong>${th.author}</strong></span>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <span style="cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem;" onclick="showToast('Vous avez apprécié ce sujet')">
            <svg class="cc-icon cc-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            ${th.likes}
          </span>
          <span style="display: inline-flex; align-items: center; gap: 0.35rem;">
            <svg class="cc-icon cc-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ${th.replies} réponses
          </span>
        </div>
      </div>
    </article>
  `).join('');
}

function openNewThreadModal() {
  const title = prompt("Titre de votre sujet de discussion :");
  if (title) {
    INITIAL_THREADS.unshift({
      id: "th-" + Date.now(),
      author: "Lord Cohiba (Vous)",
      title,
      category: "Dégustation & Découvertes",
      replies: 0,
      likes: 1,
      time: "À l'instant",
      snippet: "Nouveau sujet ouvert par Lord Cohiba. Venez partager vos impressions et vos conseils avec la communauté !"
    });
    initLoungeThreads();
    showToast("Votre sujet a été publié dans le Lounge CigarConnect !");
  }
}

/* ==========================================================================
   NOTIFICATIONS INTERACTIVES
   ========================================================================== */
function initNotifications() {
  const notifBtn = document.getElementById('notificationBellBtn');
  const notifDrawer = document.getElementById('notificationsDrawer');

  if (notifBtn && notifDrawer) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDrawer.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notifDrawer.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDrawer.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   MODALE ADHÉSION & CLUB PRIVÉ (MONÉTISATION)
   ========================================================================== */
function initMembershipModal() {
  window.openVipModal = function() {
    const modal = document.getElementById('vipClubModal');
    if (modal) modal.classList.add('active');
  };

  window.closeVipModal = function() {
    const modal = document.getElementById('vipClubModal');
    if (modal) modal.classList.remove('active');
  };

  window.subscribeTier = function(tierName) {
    closeVipModal();
    showToast(`Bienvenue dans le rang ${tierName} de CigarConnect ! Vos privilèges sont actifs.`);
  };
}

/* ==========================================================================
   TOAST FEEDBACK RAPIDE
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('globalToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color:var(--wood-cedar); display:inline-flex; align-items:center;">
      <svg class="cc-icon cc-icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
    </span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   MODALE CHARTE GRAPHIQUE & IDENTITÉ OFFICIELLE
   ========================================================================== */
function initBrandModal() {
  window.openBrandModal = function() {
    const modal = document.getElementById('brandCharterModal');
    if (modal) modal.classList.add('active');
  };

  window.closeBrandModal = function() {
    const modal = document.getElementById('brandCharterModal');
    if (modal) modal.classList.remove('active');
  };

  window.copyHex = function(hex, name) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(() => {
        showToast(`Code couleur ${name} (${hex}) copié !`);
      }).catch(() => {
        showToast(`Couleur : ${hex}`);
      });
    } else {
      showToast(`Couleur : ${hex}`);
    }
  };
}

// Fonctions de Navigation Mobile
window.toggleMobileNav = function(open) {
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('mobileNavBackdrop');
  if (drawer) drawer.classList.toggle('active', open);
  if (backdrop) backdrop.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

window.selectMobileView = function(viewId) {
  window.toggleMobileNav(false);
  switchView(viewId);
};

// Exports explicites sur l'objet window
window.switchView = switchView;
window.showToast = showToast;
window.openNewThreadModal = openNewThreadModal;
window.initBrandModal = initBrandModal;

