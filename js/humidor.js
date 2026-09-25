/**
 * CIGARCONNECT — Module Cave Personnelle ("Mon Humidor")
 * Conforme au Cahier des Charges V1.0 (Section 7.7, 7.8, 8.2)
 * 
 * - Quantités strictes : détenues, réservées, disponibles
 * - Formulaire progressif d'ajout avec brouillon automatique (draft)
 * - Valorisation facultative avec source déclarée
 * - Export personnel des données (JSON)
 */

class UserHumidor {
  constructor() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('cigarconnect_humidor_v1'));
      if (!saved) {
        saved = JSON.parse(localStorage.getItem('cigarconnect_humidor'));
      }
    } catch(e) {}

    if (!saved || !saved.length || typeof saved[0].reservedQuantity === 'undefined') {
      saved = typeof DEMO_USER_HUMIDOR !== 'undefined' ? [...DEMO_USER_HUMIDOR] : [];
      localStorage.setItem('cigarconnect_humidor_v1', JSON.stringify(saved));
    }

    this.collection = saved;
    this.currentViewMode = 'gallery'; // 'gallery' ou 'table'
    this.showValuation = JSON.parse(localStorage.getItem('cigarconnect_pref_show_valuation') || 'false');
    
    this.initElements();
    this.bindEvents();
    this.restoreDraft();
    this.render();
  }

  initElements() {
    this.galleryContainer = document.getElementById('humidorGalleryContainer');
    this.tableContainer = document.getElementById('humidorTableContainer');
    this.tableBody = document.getElementById('humidorTableBody');
    this.btnViewGallery = document.getElementById('btnViewGallery');
    this.btnViewTable = document.getElementById('btnViewTable');

    this.totalSticksVal = document.getElementById('humidorTotalSticks');
    this.totalLotsVal = document.getElementById('humidorTotalLots');
    this.availableSticksVal = document.getElementById('humidorAvailableSticks');
    this.totalWorthVal = document.getElementById('humidorTotalWorth');
    this.valuationVisibilityToggle = document.getElementById('humidorValuationToggle');

    this.addCigarModal = document.getElementById('addCigarHumidorModal');
    this.addCigarForm = document.getElementById('addCigarForm');
  }

  bindEvents() {
    if (this.addCigarForm) {
      this.addCigarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddCigarSubmit();
      });

      // Sauvegarde automatique du brouillon pendant la saisie (Section 7.8)
      this.addCigarForm.addEventListener('input', () => {
        this.autoSaveDraft();
      });
    }

    if (this.btnViewGallery) {
      this.btnViewGallery.addEventListener('click', () => this.setViewMode('gallery'));
    }

    if (this.btnViewTable) {
      this.btnViewTable.addEventListener('click', () => this.setViewMode('table'));
    }

    if (this.valuationVisibilityToggle) {
      this.valuationVisibilityToggle.addEventListener('click', () => this.toggleValuationVisibility());
    }
  }

  setViewMode(mode) {
    this.currentViewMode = mode;
    if (this.btnViewGallery && this.btnViewTable) {
      if (mode === 'gallery') {
        this.btnViewGallery.classList.add('active');
        this.btnViewTable.classList.remove('active');
      } else {
        this.btnViewGallery.classList.remove('active');
        this.btnViewTable.classList.add('active');
      }
    }
    this.renderViews();
  }

  toggleValuationVisibility() {
    this.showValuation = !this.showValuation;
    localStorage.setItem('cigarconnect_pref_show_valuation', JSON.stringify(this.showValuation));
    this.render();
  }

  save() {
    localStorage.setItem('cigarconnect_humidor_v1', JSON.stringify(this.collection));
    this.render();
  }

  autoSaveDraft() {
    if (!this.addCigarForm) return;
    const draft = {
      brand: document.getElementById('inputCigarBrand')?.value || '',
      name: document.getElementById('inputCigarName')?.value || '',
      origin: document.getElementById('inputCigarOrigin')?.value || 'Cuba',
      vitola: document.getElementById('inputCigarVitola')?.value || '',
      vintage: document.getElementById('inputCigarVintage')?.value || '',
      quantity: document.getElementById('inputCigarQuantity')?.value || '1',
      packaging: document.getElementById('inputCigarPackaging')?.value || 'Unité individuelle',
      conditionNotes: document.getElementById('inputCigarConditionNotes')?.value || '',
      provenance: document.getElementById('inputCigarProvenance')?.value || '',
      boxCode: document.getElementById('inputCigarBoxCode')?.value || '',
      valuationAmount: document.getElementById('inputCigarValuation')?.value || '',
      valuationSource: document.getElementById('inputCigarValuationSource')?.value || 'Estimation personnelle',
      isTradeable: document.getElementById('inputCigarTradeable')?.checked || false
    };
    localStorage.setItem('cigarconnect_humidor_draft', JSON.stringify(draft));
  }

  restoreDraft() {
    const draftJson = localStorage.getItem('cigarconnect_humidor_draft');
    if (!draftJson) return;
    try {
      const draft = JSON.parse(draftJson);
      if (draft.brand && document.getElementById('inputCigarBrand')) {
        document.getElementById('inputCigarBrand').value = draft.brand;
        document.getElementById('inputCigarName').value = draft.name || '';
        document.getElementById('inputCigarOrigin').value = draft.origin || 'Cuba';
        document.getElementById('inputCigarVitola').value = draft.vitola || '';
        document.getElementById('inputCigarVintage').value = draft.vintage || '';
        document.getElementById('inputCigarQuantity').value = draft.quantity || '1';
        if (document.getElementById('inputCigarPackaging')) document.getElementById('inputCigarPackaging').value = draft.packaging || 'Unité individuelle';
        if (document.getElementById('inputCigarConditionNotes')) document.getElementById('inputCigarConditionNotes').value = draft.conditionNotes || '';
        if (document.getElementById('inputCigarProvenance')) document.getElementById('inputCigarProvenance').value = draft.provenance || '';
        if (document.getElementById('inputCigarBoxCode')) document.getElementById('inputCigarBoxCode').value = draft.boxCode || '';
        if (document.getElementById('inputCigarValuation')) document.getElementById('inputCigarValuation').value = draft.valuationAmount || '';
      }
    } catch(e) {}
  }

  clearDraft() {
    localStorage.removeItem('cigarconnect_humidor_draft');
    if (this.addCigarForm) this.addCigarForm.reset();
  }

  toggleTradeable(cigarId) {
    const cigar = this.collection.find(c => c.id === cigarId);
    if (cigar) {
      cigar.isTradeable = !cigar.isTradeable;
      this.save();
      const txt = cigar.isTradeable ? "ouvert aux propositions d'échange" : "réservé à votre collection privée";
      if (window.showToast) {
        showToast(`${cigar.brand} ${cigar.name} est maintenant ${txt}.`);
      }
    }
  }

  deleteCigar(cigarId) {
    const cigar = this.collection.find(c => c.id === cigarId);
    if (!cigar) return;

    // Protection selon Section 7.7 : pas de suppression d'une pièce engagée dans un échange actif
    if (cigar.reservedQuantity > 0) {
      alert(`Impossible de supprimer cette pièce : ${cigar.reservedQuantity} unité(s) sont actuellement engagées dans une proposition d'échange en cours.`);
      return;
    }

    if (confirm(`Confirmez-vous le retrait de ${cigar.brand} ${cigar.name} de votre humidor ?`)) {
      this.collection = this.collection.filter(c => c.id !== cigarId);
      this.save();
      if (window.showToast) {
        showToast("Pièce retirée de votre humidor.");
      }
    }
  }

  consumeStick(cigarId) {
    const cigar = this.collection.find(c => c.id === cigarId);
    if (!cigar) return;

    const available = cigar.quantity - (cigar.reservedQuantity || 0);
    if (available <= 0) {
      alert("Toutes vos unités de ce lot sont actuellement réservées pour des échanges.");
      return;
    }

    if (confirm(`Enregistrer la dégustation d'une vitole de ${cigar.brand} ${cigar.name} ?`)) {
      cigar.quantity -= 1;
      if (cigar.quantity <= 0) {
        this.collection = this.collection.filter(c => c.id !== cigarId);
      }
      this.save();
      if (window.showToast) {
        showToast(`Dégustation enregistrée. Stock restant : ${cigar.quantity} unité(s).`);
      }
    }
  }

  handleAddCigarSubmit() {
    const brand = document.getElementById('inputCigarBrand')?.value.trim();
    const name = document.getElementById('inputCigarName')?.value.trim();
    const origin = document.getElementById('inputCigarOrigin')?.value || 'Cuba';
    const vitola = document.getElementById('inputCigarVitola')?.value.trim() || 'Robusto';
    const vintage = document.getElementById('inputCigarVintage')?.value.trim() || '2022';
    const quantity = parseInt(document.getElementById('inputCigarQuantity')?.value, 10) || 1;
    const packaging = document.getElementById('inputCigarPackaging')?.value || 'Unité individuelle';
    const conditionNotes = document.getElementById('inputCigarConditionNotes')?.value.trim() || 'Parfait état de conservation';
    const provenance = document.getElementById('inputCigarProvenance')?.value.trim() || 'Collection personnelle';
    const boxCode = document.getElementById('inputCigarBoxCode')?.value.trim() || '';
    const valuationAmount = parseFloat(document.getElementById('inputCigarValuation')?.value) || 0;
    const valuationSource = document.getElementById('inputCigarValuationSource')?.value || 'Estimation personnelle';
    const isTradeable = document.getElementById('inputCigarTradeable')?.checked || false;

    if (!brand || !name) {
      alert("Veuillez renseigner la marque et le nom de la vitole.");
      return;
    }

    // Sélection d'une image réaliste représentative
    let defaultImg = "assets/cigar-behike56.jpg";
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('trinidad')) defaultImg = "assets/cigar-fundadores.jpg";
    else if (brandLower.includes('montecristo')) defaultImg = "assets/cigar-montecristo2.jpg";
    else if (brandLower.includes('partagas') || brandLower.includes('partagás')) defaultImg = "assets/cigar-lusitanias.jpg";
    else if (brandLower.includes('davidoff')) defaultImg = "assets/cigar-oroblanco.jpg";

    const newLot = {
      id: "my-lot-" + Date.now(),
      brand,
      name,
      origin,
      vitola,
      vintage,
      quantity,
      reservedQuantity: 0,
      packaging,
      conditionNotes,
      conditionHr: "69% HR",
      provenance,
      boxCode,
      valuation: {
        amount: valuationAmount,
        currency: "EUR",
        source: valuationSource,
        isPrivate: true
      },
      isTradeable,
      isPublic: isTradeable,
      image: defaultImg,
      dateAdded: new Date().toLocaleDateString('fr-FR')
    };

    this.collection.unshift(newLot);
    this.save();
    this.clearDraft();
    this.closeAddModal();

    if (window.showToast) {
      showToast(`${window.getIcon ? getIcon('check', 'cc-icon-sm') : ''} ${brand} ${name} (${quantity} ex.) enregistré avec succès dans votre humidor.`);
    }
  }

  exportCollectionJson() {
    const dataToExport = {
      platform: "CigarConnect",
      version: "1.0",
      exportDate: new Date().toISOString(),
      memberCollection: this.collection
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cigarconnect-mon-humidor-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.showToast) {
      showToast(`${window.getIcon ? getIcon('download', 'cc-icon-sm') : ''} Export de votre collection téléchargé avec succès.`);
    }
  }

  openAddModal() {
    if (this.addCigarModal) {
      this.addCigarModal.classList.add('active');
    }
  }

  closeAddModal() {
    if (this.addCigarModal) {
      this.addCigarModal.classList.remove('active');
    }
  }

  render() {
    // Calculs conformes à la section 7.7 & 8.2 du cahier des charges
    const totalSticks = this.collection.reduce((acc, c) => acc + (c.quantity || 1), 0);
    const totalLots = this.collection.length;
    const totalReserved = this.collection.reduce((acc, c) => acc + (c.reservedQuantity || 0), 0);
    const totalAvailable = Math.max(0, totalSticks - totalReserved);
    
    // Valeur facultative selon préférence utilisateur
    const totalValuation = this.collection.reduce((acc, c) => {
      const unitVal = (c.valuation && c.valuation.amount) ? c.valuation.amount : (c.valuePerUnit || 0);
      return acc + (unitVal * (c.quantity || 1));
    }, 0);

    if (this.totalSticksVal) this.totalSticksVal.textContent = totalSticks;
    if (this.totalLotsVal) this.totalLotsVal.textContent = totalLots;
    if (this.availableSticksVal) this.availableSticksVal.textContent = totalAvailable;

    if (this.totalWorthVal) {
      if (this.showValuation) {
        this.totalWorthVal.textContent = `€ ${totalValuation.toLocaleString('fr-FR')}`;
        if (this.valuationVisibilityToggle) {
          this.valuationVisibilityToggle.innerHTML = `${window.getIcon ? getIcon('eyeOff', 'cc-icon-sm') : ''} <span>Masquer les valeurs</span>`;
        }
      } else {
        this.totalWorthVal.textContent = "Confidentiel";
        if (this.valuationVisibilityToggle) {
          this.valuationVisibilityToggle.innerHTML = `${window.getIcon ? getIcon('eye', 'cc-icon-sm') : ''} <span>Afficher les valeurs</span>`;
        }
      }
    }

    this.renderViews();
  }

  renderViews() {
    if (this.galleryContainer && this.tableContainer) {
      if (this.currentViewMode === 'gallery') {
        this.galleryContainer.style.display = 'grid';
        this.tableContainer.style.display = 'none';
        this.renderGallery();
      } else {
        this.galleryContainer.style.display = 'none';
        this.tableContainer.style.display = 'block';
        this.renderTable();
      }
    } else {
      this.renderTable();
    }
  }

  renderGallery() {
    if (!this.galleryContainer) return;

    // État vide soigné (Section 15 du Cahier des charges)
    if (this.collection.length === 0) {
      this.galleryContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--stone-border);">
          <div style="margin-bottom: 0.75rem; color: var(--gold-accent); display: flex; justify-content: center;">
            ${window.getIcon ? getIcon('box', 'cc-icon-xl') : ''}
          </div>
          <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--text-primary);">
            Votre collection commence ici.
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Ajoutez une première pièce ; elle restera entièrement privée tant que vous ne choisissez pas de la partager avec d'autres collectionneurs.
          </p>
          <button class="btn-primary-gold" onclick="userHumidor.openAddModal()">
            <span>+</span> Enregistrer ma première pièce
          </button>
        </div>
      `;
      return;
    }

    this.galleryContainer.innerHTML = this.collection.map(cigar => {
      const reserved = cigar.reservedQuantity || 0;
      const available = Math.max(0, cigar.quantity - reserved);
      const photoSrc = cigar.image || 'assets/hero-cigar-library.jpg';
      const unitVal = (cigar.valuation && cigar.valuation.amount) ? cigar.valuation.amount : (cigar.valuePerUnit || 0);

      return `
        <article class="cigar-card">
          <div class="cigar-card-media" style="height: 200px;">
            <img src="${photoSrc}" alt="${cigar.brand} ${cigar.name}" class="cigar-card-img" loading="lazy">
            <div class="cigar-badges-overlay">
              <span class="origin-badge">
                <span>${cigar.quantity} unité${cigar.quantity > 1 ? 's' : ''}</span>
                ${reserved > 0 ? `<span style="color:#AA8959; font-size:0.7rem;">(${reserved} réservée${reserved > 1 ? 's' : ''})</span>` : ''}
              </span>
              <span class="rarity-tag-clean" style="color: ${cigar.isTradeable ? 'var(--pine-verify)' : 'var(--text-muted)'};">
                ${cigar.isTradeable ? '● Ouvert à l\'échange' : '○ Privé'}
              </span>
            </div>
          </div>

          <div class="cigar-card-body">
            <div class="cigar-card-brand">${cigar.brand}</div>
            <h3 class="cigar-card-title">${cigar.name}</h3>

            <div class="cigar-provenance-row">
              <span>${cigar.vitola}</span>
              <span>·</span>
              <span>Millésime ${cigar.vintage}</span>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-top: 1px solid var(--stone-border); border-bottom: 1px solid var(--stone-border); font-size: 0.8rem; margin-bottom: 0.85rem;">
              <div>Disponible : <strong style="color:var(--text-primary);">${available} unité${available > 1 ? 's' : ''}</strong></div>
              <div>Hygro : <strong style="color:var(--pine-verify);">${cigar.conditionHr || '69% HR'}</strong></div>
            </div>

            ${this.showValuation && unitVal > 0 ? `
              <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.75rem;">
                Estimation : <strong style="color:var(--wood-cedar);">€ ${(unitVal * cigar.quantity).toLocaleString('fr-FR')}</strong> (${cigar.valuation?.source || 'Déclarée'})
              </div>
            ` : ''}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.5rem;">
              <label class="trade-switch" title="Activer pour les propositions de troc">
                <input type="checkbox" ${cigar.isTradeable ? 'checked' : ''} onchange="userHumidor.toggleTradeable('${cigar.id}')">
                <span class="slider-pill"></span>
                <span style="font-size: 0.78rem; font-weight: 500; color: ${cigar.isTradeable ? 'var(--pine-verify)' : 'var(--text-muted)'};">
                  ${cigar.isTradeable ? 'Échange' : 'Privé'}
                </span>
              </label>

              <div style="display: flex; gap: 0.35rem;">
                <button onclick="userHumidor.consumeStick('${cigar.id}')" class="btn-card-trade" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" title="Enregistrer une dégustation (-1)">
                  Déguster
                </button>
                <button onclick="userHumidor.deleteCigar('${cigar.id}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:0.8rem; padding: 0.3rem;" title="Retirer ce lot">
                  Retirer
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  renderTable() {
    if (!this.tableBody) return;

    if (this.collection.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            Votre humidor est vide pour l'instant. Enregistrez votre première pièce pour commencer votre inventaire.
          </td>
        </tr>
      `;
      return;
    }

    this.tableBody.innerHTML = this.collection.map(cigar => {
      const reserved = cigar.reservedQuantity || 0;
      const available = Math.max(0, cigar.quantity - reserved);
      const unitVal = (cigar.valuation && cigar.valuation.amount) ? cigar.valuation.amount : (cigar.valuePerUnit || 0);

      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-primary); font-size: 0.92rem;">${cigar.brand} ${cigar.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${cigar.origin} · Millésime ${cigar.vintage}</div>
          </td>
          <td>${cigar.vitola}</td>
          <td>
            <strong>${cigar.quantity}</strong> 
            <span style="font-size: 0.75rem; color: var(--text-muted);">(${available} dispo${reserved > 0 ? `, ${reserved} rés.` : ''})</span>
          </td>
          <td style="color: var(--pine-verify); font-weight: 600;">${cigar.conditionHr || '69% HR'}</td>
          <td>
            ${this.showValuation && unitVal > 0 ? `
              <div style="font-weight: 600; color: var(--wood-cedar);">€ ${(unitVal * cigar.quantity).toLocaleString('fr-FR')}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${cigar.valuation?.source || 'Déclarée'}</div>
            ` : `<span style="font-size: 0.75rem; color: var(--text-muted);">Confidentiel</span>`}
          </td>
          <td>
            <label class="trade-switch" title="Activer pour les propositions de troc">
              <input type="checkbox" ${cigar.isTradeable ? 'checked' : ''} onchange="userHumidor.toggleTradeable('${cigar.id}')">
              <span class="slider-pill"></span>
              <span style="font-size: 0.75rem; font-weight: 500; color: ${cigar.isTradeable ? 'var(--pine-verify)' : 'var(--text-muted)'};">
                ${cigar.isTradeable ? 'Actif' : 'Privé'}
              </span>
            </label>
          </td>
          <td style="text-align: right;">
            <button onclick="userHumidor.consumeStick('${cigar.id}')" style="background: none; border: 1px solid var(--stone-border); border-radius: var(--radius-sm); padding: 0.25rem 0.5rem; font-size: 0.75rem; cursor: pointer; color: var(--text-secondary); margin-right: 0.35rem;" title="Enregistrer une dégustation (-1)">
              Déguster
            </button>
            <button onclick="userHumidor.deleteCigar('${cigar.id}')" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.25rem; font-size: 0.8rem; display: inline-flex; align-items: center;" title="Retirer">
              ${window.getIcon ? getIcon('close', 'cc-icon-sm') : ''}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}
