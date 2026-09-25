/**
 * CIGARCONNECT — Module Catalogue & Galerie de Cigares Rares
 * "Where Cigars Connect" — www.cigarconnect.net
 * Direction : Galerie Photographique de Maître & Dossier d'Expertise
 */

class CigarCatalog {
  constructor() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('cigarconnect_catalog'));
    } catch(e) {}

    if (!saved || !saved.length || !saved[0].image || !saved[0].harvestYear) {
      saved = typeof DEMO_CATALOG_CIGARS !== 'undefined' ? [...DEMO_CATALOG_CIGARS] : (typeof INITIAL_CIGARS !== 'undefined' ? [...INITIAL_CIGARS] : []);
      localStorage.setItem('cigarconnect_catalog', JSON.stringify(saved));
    }

    this.cigars = saved;
    this.filteredCigars = [...this.cigars];
    this.activeOriginFilter = 'all';
    this.activeRarityFilter = 'all';
    this.searchQuery = '';
    
    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.gridContainer = document.getElementById('catalogGridContainer');
    this.searchInput = document.getElementById('catalogSearchInput');
    this.originPills = document.querySelectorAll('.filter-pill-origin');
    this.raritySelect = document.getElementById('rarityFilterSelect');
    this.resultsCount = document.getElementById('catalogResultsCount');
    
    // Modal Dossier de Collection
    this.detailModal = document.getElementById('cigarDetailModal');
    this.modalBody = document.getElementById('cigarDetailModalBody');
    this.newArrivalsGrid = document.getElementById('newArrivalsGrid');
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    if (this.originPills) {
      this.originPills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.originPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.activeOriginFilter = pill.dataset.origin;
          this.applyFilters();
        });
      });
    }

    if (this.raritySelect) {
      this.raritySelect.addEventListener('change', (e) => {
        this.activeRarityFilter = e.target.value;
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    this.filteredCigars = this.cigars.filter(cigar => {
      // Recherche textuelle
      const matchesSearch = 
        cigar.name.toLowerCase().includes(this.searchQuery) ||
        cigar.brand.toLowerCase().includes(this.searchQuery) ||
        cigar.origin.toLowerCase().includes(this.searchQuery) ||
        cigar.vitola.toLowerCase().includes(this.searchQuery) ||
        (cigar.aromas && cigar.aromas.some(a => a.toLowerCase().includes(this.searchQuery)));

      // Terroir / Origine
      const matchesOrigin = 
        this.activeOriginFilter === 'all' || 
        cigar.origin.toLowerCase() === this.activeOriginFilter.toLowerCase();

      // Rareté
      const matchesRarity = 
        this.activeRarityFilter === 'all' || 
        cigar.rarity === this.activeRarityFilter;

      return matchesSearch && matchesOrigin && matchesRarity;
    });

    this.render();
  }

  renderNewArrivals() {
    if (!this.newArrivalsGrid) return;
    
    let arrivals = null;
    try {
      arrivals = JSON.parse(localStorage.getItem('cigarconnect_new_arrivals'));
    } catch(e) {}

    if (!arrivals || !arrivals.length || !arrivals[0].image) {
      arrivals = typeof DEMO_NEW_ARRIVALS !== 'undefined' ? [...DEMO_NEW_ARRIVALS] : (typeof INITIAL_NEW_ARRIVALS !== 'undefined' ? [...INITIAL_NEW_ARRIVALS] : []);
      localStorage.setItem('cigarconnect_new_arrivals', JSON.stringify(arrivals));
    }

    this.newArrivalsGrid.innerHTML = arrivals.map(item => `
      <article class="new-arrival-card" data-arrival-id="${item.id}">
        <div class="arrival-media-wrap">
          <img src="${item.image || 'assets/hero-cigar-library.jpg'}" alt="${item.brand} ${item.name}" class="arrival-img" loading="lazy">
          <span class="arrival-time-tag">${item.timeAgo || 'Récent'}</span>
        </div>

        <div class="arrival-content-box">
          <div class="arrival-brand-tag">${item.brand}</div>
          <h4 class="arrival-cigar-title">${item.name}</h4>

          <div class="arrival-owner-row">
            <div class="arrival-avatar-mini">${item.ownerAvatar || 'AM'}</div>
            <div style="flex:1; min-width:0;">
              <strong style="color:var(--text-primary); font-size:0.82rem;">${item.owner}</strong>
              <div style="font-size:0.72rem; color:var(--text-muted); display:flex; align-items:center; gap:0.25rem;">
                <svg class="cc-icon cc-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${item.ownerLocation || 'Cercle Privé'}
              </div>
            </div>
          </div>

          <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom: 0.75rem;">
            ${item.vitola} · <em>${item.harvestYear || item.vintage || ''}</em>
          </div>

          <div class="arrival-footer-bar">
            <div class="arrival-price" style="font-size:0.82rem; font-weight:600; color: ${item.isTradeable ? 'var(--pine-verify)' : 'var(--wood-cedar)'};">
              ${item.estimatedValue || (item.isTradeable ? '● Ouvert au troc' : '○ Collection privée')}
            </div>
            <button class="btn-arrival-inspect" onclick="cigarCatalog.openDetailModal('${item.cigarId || item.id}')">
              Consulter le dossier
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  render() {
    this.renderNewArrivals();

    if (!this.gridContainer) return;

    if (this.resultsCount) {
      this.resultsCount.textContent = `${this.filteredCigars.length} pièce${this.filteredCigars.length > 1 ? 's' : ''} d'exception`;
    }

    if (this.filteredCigars.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-md); border: 1px solid var(--stone-border);">
          <h3 style="font-family: var(--font-serif); margin-bottom: 0.5rem; color:var(--text-primary);">Aucune vitole ne correspond à ces critères</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Ajustez vos filtres de terroirs ou votre mot-clé de recherche.</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = this.filteredCigars.map(cigar => {
      const photoSrc = cigar.image || 'assets/hero-cigar-library.jpg';

      return `
        <article class="cigar-card" data-cigar-id="${cigar.id}">
          <div class="cigar-card-media">
            <img src="${photoSrc}" alt="${cigar.brand} ${cigar.name}" class="cigar-card-img" loading="lazy">
            <div class="cigar-badges-overlay">
              <span class="origin-tag-minimal">${cigar.origin}</span>
              <span class="rarity-tag-clean">${cigar.rarityLabel || 'Collection'}</span>
            </div>
          </div>

          <div class="cigar-card-body">
            <div class="cigar-card-brand">${cigar.brand}</div>
            <h3 class="cigar-card-title">${cigar.name}</h3>

            <div class="cigar-provenance-row">
              <span>${cigar.harvestYear || ('Millésime ' + cigar.vintage)}</span>
              <span>·</span>
              <span>${cigar.boxYear || 'Bague d\'Origine'}</span>
            </div>

            <!-- Caractéristiques précises -->
            <div class="cigar-specs-grid">
              <div class="spec-cell">
                <span class="lbl">Module</span>
                <span class="val">${cigar.vitola}</span>
              </div>
              <div class="spec-cell">
                <span class="lbl">Calibre</span>
                <span class="val">${cigar.ringGauge} (${cigar.lengthMm || 150}mm)</span>
              </div>
              <div class="spec-cell">
                <span class="lbl">Conservation</span>
                <span class="val">69% HR</span>
              </div>
            </div>

            <!-- Détenteur vérifié de la vitole -->
            <div class="cigar-owner-bar">
              <div class="cigar-owner-avatar">${cigar.ownerAvatar || 'AM'}</div>
              <div class="cigar-owner-info">
                <div class="cigar-owner-name">${cigar.owner || 'Aficionado Anonyme'}</div>
                <div class="cigar-owner-loc" style="display:flex; align-items:center; gap:0.35rem;">
                  <svg class="cc-icon cc-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  ${cigar.ownerLocation || 'Cercle Privé'}
                </div>
              </div>
            </div>

            <!-- Pied de carte -->
            <div class="cigar-card-footer">
              <div class="cigar-price-val">${(cigar.valuation && cigar.valuation.amount) ? `€ ${cigar.valuation.amount.toLocaleString('fr-FR')}` : (cigar.estimatedValue || 'Cote indicative')}</div>
              <div class="cigar-actions-group">
                <button class="btn-card-inspect" onclick="cigarCatalog.openDetailModal('${cigar.id}')">
                  Dossier
                </button>
                <button class="btn-card-trade" onclick="cigarTrade.openTradeProposalModal('${cigar.id}')" title="Proposer un échange">
                  Échanger
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  openDetailModal(cigarId) {
    let cigar = this.cigars.find(c => c.id === cigarId);
    if (!cigar) {
      const arrivals = JSON.parse(localStorage.getItem('cigarconnect_new_arrivals')) || [];
      cigar = arrivals.find(a => a.id === cigarId || a.cigarId === cigarId);
    }
    if (!cigar || !this.detailModal || !this.modalBody) return;

    const photoSrc = cigar.image || 'assets/hero-cigar-library.jpg';

    this.modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 2.5rem; align-items: start;">
        <!-- Colonne Gauche : Photographie & Authentification -->
        <div>
          <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--stone-border); margin-bottom: 1.25rem; background: #241E1A;">
            <img src="${photoSrc}" alt="${cigar.brand} ${cigar.name}" style="width: 100%; height: 360px; object-fit: cover; display: block;">
          </div>

          <!-- Encadré Traçabilité & Conservation -->
          <div style="background: var(--bg-card-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--stone-border); font-size: 0.85rem;">
            <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wood-cedar); font-weight: 600; margin-bottom: 0.6rem;">
              Traçabilité & Conservation Déclarée
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-secondary);">
              <div style="display: flex; align-items: flex-start; gap: 0.45rem;">
                <svg class="cc-icon cc-icon-sm" style="margin-top: 3px; color: var(--wood-cedar);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div><strong>Provenance :</strong> ${cigar.provenance || 'Manufacture officielle et collection privée.'}</div>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 0.45rem;">
                <svg class="cc-icon cc-icon-sm" style="margin-top: 3px; color: var(--wood-cedar);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                <div><strong>Humidor :</strong> ${cigar.declaredConservation || cigar.condition || 'Armoire tempérée 18.5°C / 69% HR'}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.45rem;">
                <svg class="cc-icon cc-icon-sm" style="color: var(--wood-cedar);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <div><strong>Code Boîte :</strong> <code style="background:#FFFFFF; padding: 2px 6px; border:1px solid var(--stone-border); border-radius:3px; font-weight:600; color:var(--text-primary);">${cigar.boxCode || 'Fabrique certifiée'}</code></div>
              </div>
              <div style="color: var(--pine-verify); font-weight: 600; display:flex; align-items:center; gap: 0.35rem; margin-top: 0.25rem;">
                <svg class="cc-icon cc-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Déclaration membre : Bague et boîte d'origine déclarées intactes</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne Droite : Fiche d'Expertise & Échange -->
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--wood-cedar); font-weight: 600; margin-bottom: 0.3rem;">
            ${cigar.brand} · <span class="origin-tag-minimal">${cigar.origin}</span>
          </div>
          <h2 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--text-primary); margin-bottom: 0.75rem; line-height: 1.2;">
            ${cigar.name}
          </h2>

          <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--stone-border);">
            <span style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 600; color: var(--wood-cedar);">${cigar.estimatedValue}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">(Estimation indicative déclarée)</span>
          </div>

          <!-- Dates Qualifiées -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; background: var(--bg-card-elevated); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--stone-border); margin-bottom: 1.5rem; font-size: 0.8rem;">
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Récolte</div>
              <strong style="color:var(--text-primary);">${cigar.harvestYear || 'Cosecha ' + cigar.vintage}</strong>
            </div>
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Mise en boîte</div>
              <strong style="color:var(--text-primary);">${cigar.boxYear || cigar.vintage}</strong>
            </div>
            <div>
              <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase;">Acquisition</div>
              <strong style="color:var(--text-primary);">${cigar.acquisitionDate ? cigar.acquisitionDate.split('(')[0].trim() : '2020'}</strong>
            </div>
          </div>

          <!-- Notes de dégustation -->
          <div style="margin-bottom: 1.5rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--wood-cedar); font-weight: 600; margin-bottom: 0.4rem;">
              Notes du Conservateur
            </div>
            <p style="font-size: 0.92rem; line-height: 1.65; color: var(--text-secondary); margin-bottom: 1rem;">
              ${cigar.description || 'Vitole conservée dans des conditions muséales irréprochables. Cape huileuse et arômes tertiaires épanouis.'}
            </p>
            
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${(cigar.aromas || ['Cuir', 'Cèdre', 'Cacao', 'Terre']).map(a => `
                <span style="background: #FFFFFF; border: 1px solid var(--stone-border); padding: 0.25rem 0.65rem; border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--text-primary);">
                  ${a}
                </span>
              `).join('')}
            </div>
          </div>

          <!-- Carte Détenteur & Action -->
          <div style="background: #FFFFFF; border: 1px solid var(--stone-border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.75rem;">
            <div style="display: flex; align-items: center; gap: 0.85rem;">
              <div class="cigar-owner-avatar" style="width: 40px; height: 40px; font-size: 0.95rem;">
                ${cigar.ownerAvatar || 'AM'}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${cigar.owner || 'Aficionado Anonyme'}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted); display:flex; align-items:center; gap:0.35rem;">
                  <svg class="cc-icon cc-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  ${cigar.ownerLocation || 'Cercle Privé'} · Réputation ${cigar.ownerReputation || '5.0'}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions avec appel discret -->
          <div style="display: flex; gap: 0.85rem;">
            <button class="btn-primary-gold" style="flex: 1; padding: 0.85rem 1.25rem;" onclick="cigarDetailModalClose(); cigarTrade.openTradeProposalModal('${cigar.id}')">
              Discuter de cette pièce
            </button>
            <button class="btn-secondary-luxury" style="padding: 0.85rem 1.25rem;" onclick="cigarDetailModalClose()">
              Fermer le dossier
            </button>
          </div>
        </div>
      </div>
    `;

    this.detailModal.classList.add('active');
  }
}

function cigarDetailModalClose() {
  const modal = document.getElementById('cigarDetailModal');
  if (modal) modal.classList.remove('active');
}
