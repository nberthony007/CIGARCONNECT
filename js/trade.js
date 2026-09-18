/**
 * CIGARCONNECT — Module Bourse d'Échange & Négociations Sécurisées
 * "Where Cigars Connect" — www.cigarconnect.net
 */

class CigarTrade {
  constructor() {
    this.trades = JSON.parse(localStorage.getItem('cigarconnect_trades')) || INITIAL_TRADES;
    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.tradesStream = document.getElementById('tradesStreamContainer');
    this.proposalModal = document.getElementById('tradeProposalModal');
    this.proposalForm = document.getElementById('tradeProposalForm');
    this.myCigarSelect = document.getElementById('tradeProposalMyCigar');
    this.targetCigarSelect = document.getElementById('tradeProposalTargetCigar');
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
    localStorage.setItem('cigarconnect_trades', JSON.stringify(this.trades));
    this.render();
  }

  render() {
    if (!this.tradesStream) return;

    this.tradesStream.innerHTML = this.trades.map(trade => `
      <article class="trade-item-card" data-trade-id="${trade.id}">
        <div class="trade-card-header">
          <div class="trade-proposer">
            <div class="user-avatar" style="width: 38px; height: 38px; font-size: 0.9rem;">
              ${trade.proposerName.charAt(0)}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${trade.proposerName}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${trade.proposerReputation} · ${trade.proposerLocation}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="trade-status-tag ${trade.statusClass}">${trade.status}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${trade.date}</span>
          </div>
        </div>

        <div class="trade-exchange-showcase">
          <div class="trade-side-box">
            <span class="trade-side-badge">Proposé par le membre</span>
            <div class="trade-cigar-name">${trade.offeredCigar}</div>
            <div style="font-size: 0.78rem; color: var(--emerald-authentic);">✓ Certifié conservé en armoire régulée</div>
          </div>

          <div class="trade-swap-divider">⇄</div>

          <div class="trade-side-box">
            <span class="trade-side-badge">Convoité en échange</span>
            <div class="trade-cigar-name">${trade.desiredCigar}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">Ou équivalent millésimé vérifié</div>
          </div>
        </div>

        <p class="trade-notes">"${trade.notes}"</p>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; align-items: center;">
          <button class="btn-secondary-luxury" style="padding: 0.5rem 1rem; font-size: 0.82rem;" onclick="cigarTrade.openNegotiation('${trade.id}')">
            💬 Entrer en négociation
          </button>
          <button class="btn-primary-gold" style="padding: 0.5rem 1.2rem; font-size: 0.82rem;" onclick="cigarTrade.acceptDirectTrade('${trade.id}')">
            Valider l'échange sécurisé
          </button>
        </div>
      </article>
    `).join('');
  }

  openTradeProposalModal(preselectedTargetId = null) {
    if (!this.proposalModal) return;

    // Remplissage du select "Mes cigares" depuis l'Humidor
    if (this.myCigarSelect && window.userHumidor) {
      const tradeableSticks = window.userHumidor.collection.filter(c => c.isTradeable);
      if (tradeableSticks.length === 0) {
        alert("Vous n'avez actuellement aucun cigare configuré comme 'Disponible à l'échange' dans votre Humidor. Rendez-vous dans 'Mon Humidor' pour activer une vitole.");
        return;
      }

      this.myCigarSelect.innerHTML = tradeableSticks.map(c => `
        <option value="${c.brand} ${c.name} (${c.vintage})">
          ${c.brand} ${c.name} (${c.vintage}) — Valeur: €${c.valuePerUnit}
        </option>
      `).join('');
    }

    // Remplissage du select "Cigare convoité" depuis le Catalogue
    if (this.targetCigarSelect && window.cigarCatalog) {
      this.targetCigarSelect.innerHTML = window.cigarCatalog.cigars.map(c => `
        <option value="${c.brand} ${c.name} (${c.vintage})" ${c.id === preselectedTargetId ? 'selected' : ''}>
          ${c.brand} ${c.name} (${c.vintage}) [${c.origin}]
        </option>
      `).join('');
    }

    this.proposalModal.classList.add('active');
  }

  closeProposalModal() {
    if (this.proposalModal) this.proposalModal.classList.remove('active');
  }

  handleProposalSubmit() {
    const offered = this.myCigarSelect.value;
    const desired = this.targetCigarSelect.value;
    const notes = document.getElementById('tradeProposalNotes').value.trim();
    const cashAdjustment = document.getElementById('tradeProposalAdjustment').value.trim();

    let fullDesiredText = desired;
    if (cashAdjustment && parseInt(cashAdjustment) !== 0) {
      fullDesiredText += ` (avec compensation de ${cashAdjustment} €)`;
    }

    const newTrade = {
      id: "trade-" + Date.now(),
      proposerName: "Lord Cohiba (Vous)",
      proposerReputation: "5.0 ★ (Membre VIP)",
      proposerLocation: "Monaco / Paris",
      offeredCigar: offered,
      desiredCigar: fullDesiredText,
      status: "Ouvert",
      statusClass: "open",
      notes: notes || "Conservé avec soin dans mon humidor régulé. Bague et boîte intactes.",
      date: "À l'instant"
    };

    this.trades.unshift(newTrade);
    this.save();
    this.closeProposalModal();
    this.proposalForm.reset();

    showToast("✨ Votre proposition d'échange a été publiée sur la Bourse !");
  }

  openNegotiation(tradeId) {
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade || !this.negotiationModal) return;

    const modalTitle = document.getElementById('negotiationModalTitle');
    if (modalTitle) modalTitle.textContent = `Négociation avec ${trade.proposerName}`;

    if (this.chatMessagesContainer) {
      this.chatMessagesContainer.innerHTML = `
        <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid var(--border-gold); padding: 1rem; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1rem;">
          <strong>Objet de l'échange :</strong><br>
          • Proposé : <span style="color:var(--gold-light);">${trade.offeredCigar}</span><br>
          • Convoité : <span style="color:var(--text-primary);">${trade.desiredCigar}</span>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
          <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${trade.proposerName.charAt(0)}</div>
          <div style="background: var(--bg-surface); padding: 0.85rem 1rem; border-radius: var(--radius-md); max-width: 80%; font-size: 0.88rem;">
            <strong>${trade.proposerName} :</strong><br>
            "Bonjour cher aficionado ! Je suis ouvert aux discussions. Mon cigare a été vérifié au code barre Habanos et scellé sous Boveda 69%. Quel arrangement proposez-vous ?"
          </div>
        </div>
      `;
    }

    this.negotiationModal.classList.add('active');
  }

  sendChatMessage() {
    const input = document.getElementById('negotiationInputMessage');
    const msg = input.value.trim();
    if (!msg) return;

    const userBubble = document.createElement('div');
    userBubble.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 1rem;";
    userBubble.innerHTML = `
      <div style="background: linear-gradient(135deg, #733917, #5c2c10); border: 1px solid var(--gold-primary); color: #fff; padding: 0.85rem 1rem; border-radius: var(--radius-md); max-width: 80%; font-size: 0.88rem;">
        <strong>Vous (Lord Cohiba) :</strong><br>
        ${msg}
      </div>
    `;
    this.chatMessagesContainer.appendChild(userBubble);
    input.value = '';

    // Scroll to bottom
    this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;

    // Simulation de réponse automatique du membre après 1 seconde
    setTimeout(() => {
      const replyBubble = document.createElement('div');
      replyBubble.style.cssText = "display: flex; gap: 0.75rem; margin-bottom: 1rem;";
      replyBubble.innerHTML = `
        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">P</div>
        <div style="background: var(--bg-surface); padding: 0.85rem 1rem; border-radius: var(--radius-md); max-width: 80%; font-size: 0.88rem;">
          <strong>Partenaire d'échange :</strong><br>
          "Votre proposition me semble très juste. L'expédition sous boîte étanche avec humidipack et certificat d'authenticité vous convient-elle ?"
        </div>
      `;
      this.chatMessagesContainer.appendChild(replyBubble);
      this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    }, 1200);
  }

  closeNegotiation() {
    if (this.negotiationModal) this.negotiationModal.classList.remove('active');
  }

  acceptDirectTrade(tradeId) {
    const trade = this.trades.find(t => t.id === tradeId);
    if (!trade) return;

    if (confirm(`Souhaitez-vous déclencher la procédure d'échange sécurisé pour : ${trade.offeredCigar} ?`)) {
      trade.status = "Conclu & Sécurisé";
      trade.statusClass = "concluded";
      this.save();
      showToast("🤝 Échange validé ! Le protocole d'authentification et de tiers de confiance est enclenché.");
    }
  }
}
