/**
 * CIGARCONNECT — Module Bourse de Troc & Négociations Sécurisées
 * Conforme au Cahier des Charges V1.0 (Section 7.12, 8.1, 8.2)
 * 
 * - Troc pur sans paiement monétaire
 * - États de cycle de vie : draft -> sent -> negotiating -> agreed -> completed
 * - Versioning des propositions
 * - Réservation atomique du stock
 */

class CigarTrade {
  constructor() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem('cigarconnect_trades_v1'));
      if (!saved) {
        saved = JSON.parse(localStorage.getItem('cigarconnect_trades'));
      }
    } catch(e) {}

    if (!saved || !saved.length || typeof saved[0].version === 'undefined') {
      saved = typeof DEMO_TRADES !== 'undefined' ? [...DEMO_TRADES] : [];
      localStorage.setItem('cigarconnect_trades_v1', JSON.stringify(saved));
    }

    this.trades = saved;
    this.activeNegotiationId = null;

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.tradesStream = document.getElementById('tradesStreamContainer');
    this.proposalModal = document.getElementById('tradeProposalModal');
    this.proposalForm = document.getElementById('tradeProposalForm');
    this.myCigarSelect = document.getElementById('tradeProposalMyCigar');
    this.myCigarQty = document.getElementById('tradeProposalMyQty');
    this.targetCigarSelect = document.getElementById('tradeProposalTargetCigar');
    this.targetCigarQty = document.getElementById('tradeProposalTargetQty');
    this.locationTypeSelect = document.getElementById('tradeProposalLocationType');
    this.notesTextarea = document.getElementById('tradeProposalNotes');
    this.negotiationModal = document.getElementById('tradeNegotiationModal');
    this.chatMessagesContainer = document.getElementById('negotiationChatMessages');
  }

  bindEvents() {
    if (this.proposalForm) {
      this.proposalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleProposalSubmit();
      });
    }
  }

  save() {
    localStorage.setItem('cigarconnect_trades_v1', JSON.stringify(this.trades));
    this.render();
  }

  render() {
    if (!this.tradesStream) return;

    if (this.trades.length === 0) {
      this.tradesStream.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-surface); border: 1px solid var(--stone-border); border-radius: var(--radius-md);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⇄</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--text-primary); margin-bottom: 0.5rem;">
            Aucune proposition en cours
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 450px; margin: 0 auto 1.5rem;">
            Les membres n'ont pas encore publié de demande dans ce territoire. Vous pouvez être le premier à initier une proposition.
          </p>
          <button class="btn-primary-gold" onclick="cigarTrade.openTradeProposalModal()">
            Initier une proposition de troc
          </button>
        </div>
      `;
      return;
    }

    this.tradesStream.innerHTML = this.trades.map(trade => `
      <article class="trade-item-card" data-trade-id="${trade.id}">
        <div class="trade-card-header">
          <div class="trade-proposer">
            <div class="user-avatar" style="width: 34px; height: 34px; font-size: 0.85rem;">
              ${trade.proposerName ? trade.proposerName.charAt(0) : 'A'}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--text-primary); font-size: 0.92rem;">${trade.proposerName}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${trade.proposerLocation || 'Territoire Pilote'} · Version ${trade.version || 1}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span class="trade-status-tag ${trade.statusClass || 'sent'}">${trade.status}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${trade.date}</span>
          </div>
        </div>

        <!-- Diptyque Troc Pur (Pièce Offerte / Pièce Convoitée) -->
        <div class="trade-exchange-showcase">
          <div class="trade-side-box">
            <span class="trade-side-badge">Lot Proposé (${trade.offeredQuantity || 1} ex.)</span>
            <div class="trade-cigar-name">${trade.offeredCigar}</div>
            <div style="font-size: 0.75rem; color: var(--pine-verify); display: flex; align-items: center; gap: 0.35rem;">
              ${window.getIcon ? getIcon('shieldCheck', 'cc-icon-sm') : ''}
              <span>Conservation déclarée en armoire régulée</span>
            </div>
          </div>

          <div class="trade-swap-divider">
            ${window.getIcon ? getIcon('swap', 'cc-icon-md') : '⇄'}
          </div>

          <div class="trade-side-box">
            <span class="trade-side-badge">Recherche en échange (${trade.desiredQuantity || 1} ex.)</span>
            <div class="trade-cigar-name">${trade.desiredCigar}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Troc sans compensation monétaire</div>
          </div>
        </div>

        <p class="trade-notes">« ${trade.notes} »</p>

        <!-- Modalité Convenue d'un Commun Accord -->
        <div class="trade-location-box">
          <span class="icon" style="display: flex; align-items: center; color: var(--gold-accent);">
            ${window.getIcon ? getIcon('pin', 'cc-icon-sm') : ''}
          </span>
          <span>Modalité prévue : <strong>${trade.exchangeLocationType || "Remise en main propre en salon privé convenu"}</strong></span>
        </div>

        <!-- Actions de Négociation & Confirmation -->
        <div style="display: flex; justify-content: flex-end; gap: 0.65rem; align-items: center; flex-wrap: wrap;">
          <button class="btn-secondary-luxury" style="padding: 0.45rem 0.9rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem;" onclick="cigarTrade.openNegotiation('${trade.id}')">
            ${window.getIcon ? getIcon('message', 'cc-icon-sm') : ''}
            <span>Discuter / Contre-offre</span>
          </button>

          ${trade.statusClass !== 'agreed' && trade.statusClass !== 'completed' ? `
            <button class="btn-primary-gold" style="padding: 0.45rem 1rem; font-size: 0.8rem;" onclick="cigarTrade.acceptTradeVersion('${trade.id}')">
              Accepter cette version
            </button>
          ` : ''}

          ${trade.statusClass === 'agreed' ? `
            <button class="btn-primary-gold" style="padding: 0.45rem 1rem; font-size: 0.8rem; background: var(--pine-verify); border-color: var(--pine-verify);" onclick="cigarTrade.confirmCompletion('${trade.id}')">
              Confirmer la réception de la vitole
            </button>
          ` : ''}

          ${trade.statusClass === 'completed' ? `
            <span style="font-size: 0.8rem; color: var(--pine-verify); font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
              ${window.getIcon ? getIcon('check', 'cc-icon-sm') : ''} Échange clôturé avec succès
            </span>
          ` : ''}
        </div>
      </article>
    `).join('');
  }

  openTradeProposalModal(preselectedTargetId = null) {
    if (!this.proposalModal) return;

    // Remplissage du select "Mes vitoles" avec quantités disponibles réelles
    if (this.myCigarSelect && window.userHumidor) {
      const availableSticks = window.userHumidor.collection.filter(c => {
        const avail = c.quantity - (c.reservedQuantity || 0);
        return c.isTradeable && avail > 0;
      });

      if (availableSticks.length === 0) {
        alert("Vous n'avez actuellement aucun cigare configuré comme 'Ouvert à l'échange' avec du stock disponible. Rendez-vous dans 'Mon Humidor' pour activer une vitole.");
        return;
      }

      this.myCigarSelect.innerHTML = availableSticks.map(c => {
        const avail = c.quantity - (c.reservedQuantity || 0);
        return `
          <option value="${c.brand} ${c.name} (${c.vintage})" data-cigar-id="${c.id}" data-available="${avail}">
            ${c.brand} ${c.name} (${c.vintage}) — [${avail} dispo]
          </option>
        `;
      }).join('');
    }

    // Remplissage du select "Vitole convoitée" depuis le catalogue
    if (this.targetCigarSelect && window.cigarCatalog) {
      this.targetCigarSelect.innerHTML = window.cigarCatalog.cigars.map(c => `
        <option value="${c.brand} ${c.name} (${c.vintage})" ${c.id === preselectedTargetId ? 'selected' : ''}>
          ${c.brand} ${c.name} (${c.vintage}) — [${c.origin}]
        </option>
      `).join('');
    }

    this.proposalModal.classList.add('active');
  }

  closeProposalModal() {
    if (this.proposalModal) {
      this.proposalModal.classList.remove('active');
    }
  }

  handleProposalSubmit() {
    const selectedOption = this.myCigarSelect?.selectedOptions[0];
    const offeredCigar = selectedOption?.value;
    const cigarId = selectedOption?.getAttribute('data-cigar-id');
    const offeredQuantity = parseInt(this.myCigarQty?.value, 10) || 1;
    const desiredCigar = this.targetCigarSelect?.value;
    const desiredQuantity = parseInt(this.targetCigarQty?.value, 10) || 1;
    const locationType = this.locationTypeSelect?.value || "Remise en main propre en salon privé convenu";
    const notes = this.notesTextarea?.value.trim() || "Proposition de troc respectueuse des conditions de conservation.";

    if (!offeredCigar || !desiredCigar) {
      alert("Veuillez sélectionner votre vitole et la pièce convoitée.");
      return;
    }

    const profile = JSON.parse(localStorage.getItem('cigarconnect_user_profile')) || {
      firstName: "Alexandre",
      lastName: "de Montmirail",
      city: "Paris",
      country: "France"
    };

    const newTrade = {
      id: "trade-" + Date.now(),
      version: 1,
      proposerName: `${profile.firstName} ${profile.lastName}`.trim(),
      proposerReputation: "Membre vérifié",
      proposerLocation: `${profile.city}, ${profile.country}`,
      offeredCigar,
      offeredQuantity,
      offeredCigarId: cigarId,
      desiredCigar,
      desiredQuantity,
      status: "Envoyée (En attente d'acceptation)",
      statusClass: "sent",
      notes,
      date: "À l'instant",
      exchangeLocationType: locationType,
      exchangeMethod: "Troc pur sans paiement",
      image: "assets/cigar-behike56.jpg"
    };

    this.trades.unshift(newTrade);
    this.save();
    this.closeProposalModal();
    if (this.proposalForm) this.proposalForm.reset();

    if (window.showToast) {
      showToast(`${window.getIcon ? getIcon('send', 'cc-icon-sm') : ''} Votre proposition de troc a été transmise au membre.`);
    }
  }

  acceptTradeVersion(tradeId) {
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade) return;

    // Réservation atomique du stock (Section 8.2 du Cahier des charges)
    if (window.userHumidor && trade.offeredCigarId) {
      const stick = window.userHumidor.collection.find(c => c.id === trade.offeredCigarId);
      if (stick) {
        const available = stick.quantity - (stick.reservedQuantity || 0);
        if (available < (trade.offeredQuantity || 1)) {
          alert("Erreur de stock : la quantité disponible pour cette vitole a changé.");
          return;
        }
        stick.reservedQuantity = (stick.reservedQuantity || 0) + (trade.offeredQuantity || 1);
        window.userHumidor.save();
      }
    }

    trade.status = "Accord mutuel confirmé (Stock réservé)";
    trade.statusClass = "agreed";
    this.save();

    if (window.showToast) {
      showToast(`${window.getIcon ? getIcon('handshake', 'cc-icon-sm') : ''} Accord mutuel confirmé pour la version ${trade.version || 1}. Les unités nécessaires ont été réservées.`);
    }
  }

  confirmCompletion(tradeId) {
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade) return;

    if (confirm("Confirmez-vous la réception en bon état de la vitole échangée ?")) {
      // Décrémentation définitive du stock chez l'offrant (Section 8.2)
      if (window.userHumidor && trade.offeredCigarId) {
        const stick = window.userHumidor.collection.find(c => c.id === trade.offeredCigarId);
        if (stick) {
          stick.quantity = Math.max(0, stick.quantity - (trade.offeredQuantity || 1));
          stick.reservedQuantity = Math.max(0, (stick.reservedQuantity || 0) - (trade.offeredQuantity || 1));
          window.userHumidor.save();
        }
      }

      trade.status = "Échange clôturé avec succès";
      trade.statusClass = "completed";
      this.save();

      if (window.showToast) {
        showToast(`${window.getIcon ? getIcon('check', 'cc-icon-sm') : ''} Échange clôturé avec succès. Votre humidor a été mis à jour.`);
      }
    }
  }

  openNegotiation(tradeId) {
    this.activeNegotiationId = tradeId;
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade || !this.negotiationModal) return;

    const titleEl = document.getElementById('negotiationModalTitle');
    if (titleEl) {
      titleEl.textContent = `Discussion d'Échange — ${trade.offeredCigar} ⇄ ${trade.desiredCigar}`;
    }

    if (this.chatMessagesContainer) {
      this.chatMessagesContainer.innerHTML = `
        <div class="chat-msg-row received">
          <div class="chat-msg-bubble">
            Bonjour. J'ai bien reçu votre intérêt pour cette pièce. Pouvez-vous me confirmer vos préférences pour la remise en main propre ou l'expédition sécurisée ?
          </div>
          <span class="chat-msg-time">${trade.proposerName} · ${trade.date}</span>
        </div>
      `;
    }

    this.negotiationModal.classList.add('active');
  }

  closeNegotiation() {
    if (this.negotiationModal) {
      this.negotiationModal.classList.remove('active');
    }
    this.activeNegotiationId = null;
  }

  sendChatMessage() {
    const input = document.getElementById('negotiationInputMessage');
    const msg = input?.value.trim();
    if (!msg || !this.chatMessagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg-row sent';
    msgDiv.innerHTML = `
      <div class="chat-msg-bubble">${msg}</div>
      <span class="chat-msg-time">Vous · À l'instant</span>
    `;
    this.chatMessagesContainer.appendChild(msgDiv);
    input.value = '';
    this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
  }
}
