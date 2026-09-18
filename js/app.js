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

  // Initialisation des modules métiers
  window.cigarCatalog = new CigarCatalog();
  window.userHumidor = new UserHumidor();
  window.cigarTrade = new CigarTrade();
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
}

function switchView(viewId) {
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const sections = document.querySelectorAll('.view-section');

  navTabs.forEach(t => {
    t.classList.toggle('active', t.dataset.view === viewId);
  });

  sections.forEach(sec => {
    sec.classList.toggle('active', sec.id === viewId);
  });

  // Scroll doux vers le haut de la section active
  window.scrollTo({ top: 400, behavior: 'smooth' });
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
      statusLabel.textContent = "✓ Pièce Hautement Authentique";
      statusLabel.style.color = "var(--emerald-authentic)";
      sealIcon.textContent = "🎖️";
    } else if (percentage >= 60) {
      statusLabel.textContent = "⚠️ Présomption Forte (Examen UV Recommandé)";
      statusLabel.style.color = "var(--amber-limited)";
      sealIcon.textContent = "🔍";
    } else {
      statusLabel.textContent = "❌ Risque Élevé de Contrefaçon";
      statusLabel.style.color = "var(--ruby-rare)";
      sealIcon.textContent = "⚠️";
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
        <div style="display: flex; gap: 1rem;">
          <span style="cursor: pointer;" onclick="showToast('Vous avez aimé ce fil de discussion')">👍 ${th.likes}</span>
          <span>💬 ${th.replies} réponses</span>
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
    showToast("🎉 Votre sujet a été publié dans le Lounge CigarConnect !");
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
    showToast(`💎 Bienvenue dans le rang ${tierName} de CigarConnect ! Vos privilèges sont actifs.`);
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
    <span style="color:var(--gold-light); font-size:1.2rem;">⚜️</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Exports explicites sur l'objet window
window.switchView = switchView;
window.showToast = showToast;
window.openNewThreadModal = openNewThreadModal;
