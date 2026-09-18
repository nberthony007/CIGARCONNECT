/**
 * CIGARCONNECT — Module Cave Virtuelle ("Mon Humidor")
 * "Where Cigars Connect" — www.cigarconnect.net
 */

class UserHumidor {
  constructor() {
    this.collection = JSON.parse(localStorage.getItem('cigarconnect_humidor')) || INITIAL_USER_HUMIDOR;
    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.tableBody = document.getElementById('humidorTableBody');
    this.totalSticksVal = document.getElementById('humidorTotalSticks');
    this.totalWorthVal = document.getElementById('humidorTotalWorth');
    this.tradeableCountVal = document.getElementById('humidorTradeableCount');
    this.addCigarModal = document.getElementById('addCigarHumidorModal');
    this.addCigarForm = document.getElementById('addCigarForm');
  }

  bindEvents() {
    if (this.addCigarForm) {
      this.addCigarForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddCigarSubmit();
      });
    }
  }

  save() {
    localStorage.setItem('cigarconnect_humidor', JSON.stringify(this.collection));
    this.render();
  }

  toggleTradeable(cigarId) {
    const cigar = this.collection.find(c => c.id === cigarId);
    if (cigar) {
      cigar.isTradeable = !cigar.isTradeable;
      this.save();
      const statusText = cigar.isTradeable ? "marqué comme disponible à l'échange" : "réservé à votre collection privée";
      showToast(`${cigar.brand} ${cigar.name} est maintenant ${statusText}.`);
    }
  }

  deleteCigar(cigarId) {
    if (confirm("Confirmez-vous le retrait de cette vitole de votre humidor ?")) {
      this.collection = this.collection.filter(c => c.id !== cigarId);
      this.save();
      showToast("Vitole retirée de votre humidor.");
    }
  }

  handleAddCigarSubmit() {
    const brand = document.getElementById('inputCigarBrand').value.trim();
    const name = document.getElementById('inputCigarName').value.trim();
    const origin = document.getElementById('inputCigarOrigin').value;
    const vitola = document.getElementById('inputCigarVitola').value.trim();
    const vintage = document.getElementById('inputCigarVintage').value.trim();
    const quantity = parseInt(document.getElementById('inputCigarQuantity').value, 10) || 1;
    const valuePerUnit = parseFloat(document.getElementById('inputCigarValue').value) || 50;
    const isTradeable = document.getElementById('inputCigarTradeable').checked;

    if (!brand || !name) {
      alert("Veuillez renseigner la marque et le nom de la vitole.");
      return;
    }

    const newStick = {
      id: "my-cig-" + Date.now(),
      brand,
      name,
      origin,
      vitola: vitola || "Robusto",
      vintage: vintage || "2023",
      quantity,
      valuePerUnit,
      isTradeable,
      conditionHr: "69% HR",
      dateAdded: new Date().toLocaleDateString('fr-FR')
    };

    this.collection.unshift(newStick);
    this.save();
    this.closeAddModal();
    this.addCigarForm.reset();
    showToast(`🎉 Félicitations ! ${brand} ${name} a rejoint votre cave.`);
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
    // Calculs statistiques
    const totalSticks = this.collection.reduce((acc, c) => acc + c.quantity, 0);
    const totalWorth = this.collection.reduce((acc, c) => acc + (c.quantity * c.valuePerUnit), 0);
    const tradeableCount = this.collection.filter(c => c.isTradeable).reduce((acc, c) => acc + c.quantity, 0);

    if (this.totalSticksVal) this.totalSticksVal.textContent = totalSticks;
    if (this.totalWorthVal) this.totalWorthVal.textContent = `€ ${totalWorth.toLocaleString('fr-FR')}`;
    if (this.tradeableCountVal) this.tradeableCountVal.textContent = tradeableCount;

    if (!this.tableBody) return;

    if (this.collection.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
            Votre humidor est actuellement vide. Ajoutez votre premier trésor pour commencer !
          </td>
        </tr>
      `;
      return;
    }

    this.tableBody.innerHTML = this.collection.map(cigar => {
      const subtotal = cigar.quantity * cigar.valuePerUnit;
      return `
        <tr>
          <td>
            <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${cigar.brand} ${cigar.name}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">${cigar.origin} · Millésime ${cigar.vintage}</div>
          </td>
          <td>${cigar.vitola}</td>
          <td>
            <span style="display: inline-block; padding: 0.2rem 0.6rem; background: var(--bg-surface); border-radius: var(--radius-full); font-weight: 600; color: var(--gold-light);">
              ${cigar.quantity} unité${cigar.quantity > 1 ? 's' : ''}
            </span>
          </td>
          <td style="color: var(--emerald-authentic); font-weight: 600;">${cigar.conditionHr}</td>
          <td>
            <div style="font-weight: 700; color: var(--gold-light);">€ ${subtotal.toLocaleString('fr-FR')}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">(€ ${cigar.valuePerUnit}/u)</div>
          </td>
          <td>
            <label class="trade-switch" title="Activer ou désactiver pour les propositions d'échange">
              <input type="checkbox" ${cigar.isTradeable ? 'checked' : ''} onchange="userHumidor.toggleTradeable('${cigar.id}')">
              <span class="slider-pill"></span>
              <span style="font-size: 0.78rem; font-weight: 600; color: ${cigar.isTradeable ? 'var(--emerald-authentic)' : 'var(--text-muted)'};">
                ${cigar.isTradeable ? 'Actif' : 'Privé'}
              </span>
            </label>
          </td>
          <td style="text-align: right;">
            <button onclick="userHumidor.deleteCigar('${cigar.id}')" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0.4rem; font-size: 0.9rem;" title="Retirer de l'humidor">
              ✕
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}
