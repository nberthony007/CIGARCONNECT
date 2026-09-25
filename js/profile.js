/**
 * CIGARCONNECT — Module Mon Profil & Paramètres de Confidentialité
 * Conforme au Cahier des Charges V1.0 (Section 7.9 & 10)
 * 
 * - Identité publique distincte des données privées
 * - Mode aperçu : "Voir mon profil comme un visiteur"
 * - Export personnel et droit à l'effacement
 */

const DEFAULT_USER_PROFILE = {
  firstName: "Alexandre",
  lastName: "de Montmirail",
  city: "Paris",
  country: "France",
  bio: "Amateur attentif de vitoles cubaines et dominicaines de conservation soignée. Collection axée sur les grands formats et tirages limités.",
  avatar: "AM",
  badge: "Membre du Cercle",
  reputation: "Profil vérifié",
  joinedDate: "Membre depuis 2024",
  privacy: {
    showLocation: true,
    showBio: true,
    isCollectionPublic: false // Collection privée par défaut (Section 3.1)
  }
};

class UserProfileManager {
  constructor() {
    this.profile = this.loadProfile();
    this.isVisitorPreview = false;
    this.initElements();
    this.bindEvents();
    this.updateHeaderPill();
  }

  loadProfile() {
    const saved = localStorage.getItem('cigarconnect_user_profile_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    localStorage.setItem('cigarconnect_user_profile_v1', JSON.stringify(DEFAULT_USER_PROFILE));
    return { ...DEFAULT_USER_PROFILE };
  }

  saveProfile(updatedData) {
    this.profile = { ...this.profile, ...updatedData };
    
    const fn = (this.profile.firstName || "").trim();
    const ln = (this.profile.lastName || "").trim();
    if (fn || ln) {
      this.profile.avatar = ((fn.charAt(0) || "") + (ln.charAt(0) || "")).toUpperCase() || "AM";
    }

    localStorage.setItem('cigarconnect_user_profile_v1', JSON.stringify(this.profile));
    this.updateHeaderPill();
    this.render();

    if (window.showToast) {
      showToast(`${window.getIcon ? getIcon('check', 'cc-icon-sm') : ''} Vos préférences d'aficionado ont été enregistrées.`);
    }
  }

  initElements() {
    this.editModal = document.getElementById('editProfileModal');
    this.editForm = document.getElementById('editProfileForm');
    this.visitorPreviewModal = document.getElementById('visitorProfileModal');
  }

  bindEvents() {
    if (this.editForm) {
      this.editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProfileSubmit();
      });
    }
  }

  updateHeaderPill() {
    const nameEl = document.getElementById('headerUserName');
    const avatarEl = document.getElementById('headerUserAvatar');
    const locEl = document.getElementById('headerUserLocation');

    const fullName = `${this.profile.firstName} ${this.profile.lastName}`.trim() || "Membre du Cercle";
    if (nameEl) nameEl.textContent = fullName;
    if (avatarEl) avatarEl.textContent = this.profile.avatar || "AM";
    if (locEl) locEl.textContent = `${this.profile.city}, ${this.profile.country}`;
  }

  openEditModal() {
    if (!this.editModal) return;

    const fnInput = document.getElementById('inputProfileFirstName');
    const lnInput = document.getElementById('inputProfileLastName');
    const cityInput = document.getElementById('inputProfileCity');
    const countryInput = document.getElementById('inputProfileCountry');
    const bioInput = document.getElementById('inputProfileBio');
    const showLocCheck = document.getElementById('inputProfileShowLoc');

    if (fnInput) fnInput.value = this.profile.firstName || "";
    if (lnInput) lnInput.value = this.profile.lastName || "";
    if (cityInput) cityInput.value = this.profile.city || "";
    if (countryInput) countryInput.value = this.profile.country || "";
    if (bioInput) bioInput.value = this.profile.bio || "";
    if (showLocCheck) showLocCheck.checked = this.profile.privacy?.showLocation ?? true;

    this.editModal.classList.add('active');
  }

  closeEditModal() {
    if (this.editModal) {
      this.editModal.classList.remove('active');
    }
  }

  handleProfileSubmit() {
    const firstName = document.getElementById('inputProfileFirstName')?.value.trim();
    const lastName = document.getElementById('inputProfileLastName')?.value.trim();
    const city = document.getElementById('inputProfileCity')?.value.trim();
    const country = document.getElementById('inputProfileCountry')?.value.trim();
    const bio = document.getElementById('inputProfileBio')?.value.trim();
    const showLoc = document.getElementById('inputProfileShowLoc')?.checked ?? true;

    if (!firstName || !lastName || !city || !country) {
      alert("Veuillez renseigner votre prénom, votre nom, votre ville et votre pays.");
      return;
    }

    this.saveProfile({
      firstName,
      lastName,
      city,
      country,
      bio,
      privacy: {
        ...this.profile.privacy,
        showLocation: showLoc
      }
    });

    this.closeEditModal();
  }

  // Aperçu "Voir mon profil comme un visiteur" (Section 7.9)
  openVisitorPreview() {
    if (!this.visitorPreviewModal) return;

    const body = document.getElementById('visitorProfileModalBody');
    if (body) {
      const fullName = `${this.profile.firstName} ${this.profile.lastName}`.trim();
      const pinSvg = window.getIcon ? getIcon('pin', 'cc-icon-sm') : '';
      const lockSvg = window.getIcon ? getIcon('lock', 'cc-icon-sm') : '';
      const locationStr = this.profile.privacy?.showLocation 
        ? `<span style="display:inline-flex; align-items:center; gap:0.25rem;">${pinSvg} ${this.profile.city}, ${this.profile.country}</span>` 
        : `<span style="display:inline-flex; align-items:center; gap:0.25rem;">${lockSvg} Localisation confidentielle</span>`;
      
      const publicSticks = window.userHumidor ? 
        window.userHumidor.collection.filter(c => c.isPublic || c.isTradeable) : [];

      body.innerHTML = `
        <div style="background: var(--bg-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--stone-border); margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="user-avatar" style="width: 50px; height: 50px; font-size: 1.2rem;">
              ${this.profile.avatar}
            </div>
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-primary); margin: 0;">${fullName}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 3px; display: flex; align-items: center; gap: 0.4rem;">
                ${locationStr} · ${this.profile.joinedDate}
              </div>
            </div>
          </div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem; line-height: 1.6;">
            ${this.profile.bio || 'Aucune biographie rédigée.'}
          </p>
        </div>

        <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.75rem;">
          Vitoles Publiquement Partagées (${publicSticks.length})
        </h4>

        ${publicSticks.length === 0 ? `
          <div style="text-align: center; padding: 2rem; background: var(--bg-card-elevated); border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
            ${window.getIcon ? getIcon('lock', 'cc-icon-lg') : ''}
            <div>Ce membre n'a partagé aucune vitole publiquement. Sa collection reste privée.</div>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
            ${publicSticks.map(s => `
              <div style="background: var(--bg-surface); border: 1px solid var(--stone-border); border-radius: var(--radius-sm); padding: 1rem;">
                <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--wood-cedar); font-weight: 600;">${s.brand}</div>
                <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${s.name}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${s.vitola} · ${s.vintage}</div>
                <div style="font-size: 0.75rem; color: var(--pine-verify); font-weight: 600; margin-top: 6px; display: flex; align-items: center; gap: 0.25rem;">
                  ${window.getIcon ? getIcon('check', 'cc-icon-sm') : ''}
                  <span>${s.quantity} unité(s) en cave</span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      `;
    }

    this.visitorPreviewModal.classList.add('active');
  }

  closeVisitorPreview() {
    if (this.visitorPreviewModal) {
      this.visitorPreviewModal.classList.remove('active');
    }
  }

  // Droit à l'effacement / Réinitialisation des données (Section 4.1 & 12)
  resetAccountData() {
    if (confirm("ATTENTION : Cette action effacera l'ensemble de votre humidor et vos propositions de démonstration en local. Voulez-vous continuer ?")) {
      localStorage.removeItem('cigarconnect_humidor_v1');
      localStorage.removeItem('cigarconnect_trades_v1');
      localStorage.removeItem('cigarconnect_user_profile_v1');
      localStorage.removeItem('cigarconnect_humidor_draft');
      alert("Vos données locales ont été réinitialisées.");
      window.location.reload();
    }
  }

  render() {
    this.updateHeaderPill();
  }
}

window.UserProfileManager = UserProfileManager;
