/**
 * CIGARCONNECT — Module Catalogue & Galerie de Cigares Rares
 * "Where Cigars Connect" — www.cigarconnect.net
 */

class CigarCatalog {
  constructor() {
    this.cigars = JSON.parse(localStorage.getItem('cigarconnect_catalog')) || INITIAL_CIGARS;
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
    
    // Modal Détail
    this.detailModal = document.getElementById('cigarDetailModal');
    this.modalBody = document.getElementById('cigarDetailModalBody');
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
      // Filtre Recherche
      const matchesSearch = 
        cigar.name.toLowerCase().includes(this.searchQuery) ||
        cigar.brand.toLowerCase().includes(this.searchQuery) ||
        cigar.origin.toLowerCase().includes(this.searchQuery) ||
        cigar.vitola.toLowerCase().includes(this.searchQuery) ||
        cigar.aromas.some(a => a.toLowerCase().includes(this.searchQuery));

      // Filtre Terroir / Origine
      const matchesOrigin = 
        this.activeOriginFilter === 'all' || 
        cigar.origin.toLowerCase() === this.activeOriginFilter.toLowerCase();

      // Filtre Rareté
      const matchesRarity = 
        this.activeRarityFilter === 'all' || 
        cigar.rarity === this.activeRarityFilter;

      return matchesSearch && matchesOrigin && matchesRarity;
    });

    this.render();
  }

  render() {
    if (!this.gridContainer) return;

    if (this.resultsCount) {
      this.resultsCount.textContent = `${this.filteredCigars.length} pièce${this.filteredCigars.length > 1 ? 's' : ''} d'exception`;
    }

    if (this.filteredCigars.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-gold);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">🍂</div>
          <h3 style="font-family: var(--font-serif); margin-bottom: 0.5rem;">Aucun cigare ne correspond à ces critères</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Modifiez vos filtres ou effectuez une recherche plus large.</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = this.filteredCigars.map(cigar => {
      const strengthDots = Array.from({ length: 5 }).map((_, i) => 
        `<span style="display:inline-block; width:7px; height:7px; border-radius:50%; margin-right:3px; background:${i < cigar.strength ? 'var(--gold-primary)' : 'rgba(255,255,255,0.15)'};"></span>`
      ).join('');

      return `
        <article class="cigar-card" data-cigar-id="${cigar.id}">
          <div class="cigar-card-media">
            <div class="cigar-media-bg-pattern"></div>
            
            <div class="cigar-badges-overlay">
              <span class="origin-badge">
                <span>${cigar.countryFlag}</span>
                <span>${cigar.origin}</span>
              </span>
              <span class="rarity-pill ${cigar.rarity}">${cigar.rarityLabel}</span>
            </div>

            <div class="cigar-visual-art">
              <div class="cigar-band-ring" style="border-color:${cigar.ringColor || 'var(--gold-primary)'}">
                ${cigar.brand.substring(0, 2).toUpperCase()}
              </div>
              <div class="cigar-body-stick"></div>
            </div>
          </div>

          <div class="cigar-card-body">
            <div class="cigar-card-brand">${cigar.brand} · ${cigar.vintage}</div>
            <h3 class="cigar-card-title">${cigar.name}</h3>

            <div class="cigar-specs-row">
              <span>Module : <strong>${cigar.vitola}</strong></span>
              <span>Bague : <strong>${cigar.ringGauge}</strong></span>
              <span>Puissance : ${strengthDots}</span>
            </div>

            <div class="cigar-aromas-list">
              ${cigar.aromas.map(a => `<span class="aroma-tag">${a}</span>`).join('')}
            </div>

            <div class="cigar-humidor-status">
              <div class="condition-pill">
                <span>${cigar.condition}</span>
              </div>
              <div class="estimated-value-text">${cigar.estimatedValue}</div>
            </div>

            <div class="cigar-card-actions">
              <button class="btn-inspect" onclick="cigarCatalog.openDetailModal('${cigar.id}')">
                Examiner
              </button>
              <button class="btn-trade" onclick="cigarTrade.openTradeProposalModal('${cigar.id}')">
                Proposer un échange
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  openDetailModal(cigarId) {
    const cigar = this.cigars.find(c => c.id === cigarId);
    if (!cigar || !this.detailModal || !this.modalBody) return;

    const strengthText = ['Très Doux', 'Doux à Moyen', 'Moyen', 'Moyen à Fort', 'Pleine Puissance'][cigar.strength - 1];

    this.modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
        <div>
          <div style="background: linear-gradient(135deg, #221812, #140e0a); border-radius: var(--radius-lg); padding: 2rem; text-align: center; border: 1px solid var(--border-gold); margin-bottom: 1.5rem;">
            <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold-primary); margin-bottom: 0.5rem;">
              Pièce de Collection Certifiée
            </div>
            <h2 style="font-family: var(--font-serif); font-size: 1.6rem; margin-bottom: 0.5rem;">${cigar.brand} ${cigar.name}</h2>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(46, 160, 104, 0.15); border: 1px solid var(--emerald-authentic); color: var(--emerald-authentic); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">
              ✓ Authenticité Vérifiée par Expert
            </div>
          </div>

          <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
            <h4 style="font-family: var(--font-display); font-size: 0.82rem; text-transform: uppercase; color: var(--gold-light); margin-bottom: 0.75rem;">
              Caractéristiques Techniques
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.85rem;">
              <div>Terroir : <strong style="color:var(--text-primary);">${cigar.countryFlag} ${cigar.origin}</strong></div>
              <div>Vitola : <strong style="color:var(--text-primary);">${cigar.vitola}</strong></div>
              <div>Bague / Calibre : <strong style="color:var(--text-primary);">${cigar.ringGauge} (Ø ${(cigar.ringGauge * 0.397).toFixed(1)}mm)</strong></div>
              <div>Longueur : <strong style="color:var(--text-primary);">${cigar.lengthMm} mm</strong></div>
              <div>Millésime : <strong style="color:var(--text-primary);">${cigar.vintage}</strong></div>
              <div>Puissance : <strong style="color:var(--text-primary);">${strengthText}</strong></div>
              <div>Code Boîte : <strong style="color:var(--gold-light); font-family: monospace;">${cigar.boxCode || 'Vérifié'}</strong></div>
              <div>Valeur estimée : <strong style="color:var(--gold-light);">${cigar.estimatedValue}</strong></div>
            </div>
          </div>

          <div style="background: var(--bg-surface); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <h4 style="font-family: var(--font-display); font-size: 0.82rem; text-transform: uppercase; color: var(--gold-light); margin-bottom: 0.5rem;">
              Propriétaire & Garantie de Conservation
            </h4>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${cigar.owner}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${cigar.ownerReputation}</div>
              </div>
              <div style="text-align: right; font-size: 0.8rem; color: var(--emerald-authentic);">
                ${cigar.condition}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="font-family: var(--font-display); font-size: 0.82rem; text-transform: uppercase; color: var(--gold-light); margin-bottom: 0.75rem;">
            Histoire & Notes de Dégustation
          </h4>
          <p style="font-size: 0.95rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 1.5rem;">
            ${cigar.description}
          </p>

          <h4 style="font-family: var(--font-display); font-size: 0.82rem; text-transform: uppercase; color: var(--gold-light); margin-bottom: 1rem;">
            Pyramide Aromatique & Signature Gustative
          </h4>
          
          <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                <span>Bois Précieux & Cèdre Espagnol</span>
                <span style="color:var(--gold-light);">95%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: 95%; background: var(--gold-gradient);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                <span>Cuir de Russie & Terre Minérale</span>
                <span style="color:var(--gold-light);">90%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: 90%; background: var(--gold-gradient);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                <span>Cacao Noir & Torréfaction</span>
                <span style="color:var(--gold-light);">85%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: 85%; background: var(--gold-gradient);"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                <span>Épices Douces & Poivre Blanc</span>
                <span style="color:var(--gold-light);">78%</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: 78%; background: var(--gold-gradient);"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button class="btn-primary-gold" style="flex:1;" onclick="cigarDetailModalClose(); cigarTrade.openTradeProposalModal('${cigar.id}');">
              Proposer un Échange Sécurisé
            </button>
            <button class="btn-secondary-luxury" onclick="showToast('Cigare ajouté à vos favoris secrets !')">
              ♡ Enregistrer
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
window.cigarDetailModalClose = cigarDetailModalClose;
