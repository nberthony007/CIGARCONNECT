import { spawn } from "child_process";
import WebSocket from "ws";

async function main() {
  console.log("=== TEST DE BOUTONS E2E CHROME HEADLESS POUR CIGARCONNECT ===");

  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
    "--headless",
    "--remote-debugging-port=9222",
    "--no-first-run",
    "--no-default-browser-check"
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  // Créer directement la page sur http://127.0.0.1:3000/
  const newPageRes = await fetch("http://127.0.0.1:9222/json/new?http://127.0.0.1:3000/", { method: "PUT" });
  const newPage = await newPageRes.json();

  const ws = new WebSocket(newPage.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = id++;
      pending.set(curId, { resolve, reject });
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  const logs = [];
  const errors = [];

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.method === "Runtime.consoleAPICalled") {
      logs.push(data.params);
    } else if (data.method === "Runtime.exceptionThrown") {
      errors.push(data.params);
    }
    if (data.id && pending.has(data.id)) {
      const p = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) p.reject(data.error);
      else p.resolve(data.result);
    }
  });

  await new Promise((r) => ws.on("open", r));
  await send("Page.enable");
  await send("Runtime.enable");
  await send("DOM.enable");

  // Attendre le chargement complet
  await new Promise((r) => setTimeout(r, 2000));

  // Vérification de l'environnement de base
  const checkEnv = await send("Runtime.evaluate", {
    expression: `(() => {
      return {
        title: document.title,
        hasCatalog: typeof window.cigarCatalog !== 'undefined',
        hasHumidor: typeof window.userHumidor !== 'undefined',
        hasTrade: typeof window.cigarTrade !== 'undefined',
        hasProfile: typeof window.userProfile !== 'undefined',
        hasSwitchView: typeof window.switchView === 'function',
        hasNavigateToHome: typeof window.navigateToHome === 'function',
        totalButtons: document.querySelectorAll('button').length
      };
    })()`,
    returnByValue: true
  });

  console.log("État de l'application :", checkEnv.result?.value);

  // Scénarios de tests de tous les boutons clés
  const tests = [
    {
      name: "Onglet Humidor (Bouton Navigation)",
      test: `(() => {
        const btn = document.querySelector('.nav-tab-btn[data-view="view-humidor"]');
        btn.click();
        const section = document.getElementById('view-humidor');
        return section.classList.contains('active');
      })()`
    },
    {
      name: "Onglet Le Cercle (Bouton Navigation)",
      test: `(() => {
        const btn = document.querySelector('.nav-tab-btn[data-view="view-trade"]');
        btn.click();
        const section = document.getElementById('view-trade');
        return section.classList.contains('active');
      })()`
    },
    {
      name: "Onglet Journal & Savoir (Bouton Navigation)",
      test: `(() => {
        const btn = document.querySelector('.nav-tab-btn[data-view="view-academy"]');
        btn.click();
        const section = document.getElementById('view-academy');
        return section.classList.contains('active');
      })()`
    },
    {
      name: "Onglet Comment ça marche",
      test: `(() => {
        const btn = document.querySelector('.nav-tab-btn[data-view="view-how-it-works"]');
        btn.click();
        const section = document.getElementById('view-how-it-works');
        return section.classList.contains('active');
      })()`
    },
    {
      name: "Onglet Confiance & Déontologie",
      test: `(() => {
        const btn = document.querySelector('.nav-tab-btn[data-view="view-trust"]');
        btn.click();
        const section = document.getElementById('view-trust');
        return section.classList.contains('active');
      })()`
    },
    {
      name: "Retour à l'accueil Collections (Logo/Bouton)",
      test: `(() => {
        window.navigateToHome();
        const section = document.getElementById('view-catalog');
        return section.classList.contains('active');
      })()`
    },
    {
      name: "Bouton Cloche Notifications (Ouverture & Fermeture)",
      test: `(() => {
        const btn = document.getElementById('notificationBellBtn');
        const drawer = document.getElementById('notificationsDrawer');
        btn.click();
        const opened = drawer.classList.contains('active') || drawer.style.display === 'block';
        btn.click();
        const closed = !drawer.classList.contains('active') && drawer.style.display === 'none';
        return opened && closed;
      })()`
    },
    {
      name: "Bouton Déposer une vitole (Modale Humidor)",
      test: `(() => {
        const modal = document.getElementById('addCigarHumidorModal');
        userHumidor.openAddModal();
        const opened = modal.classList.contains('active');
        userHumidor.closeAddModal();
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Bouton Profil Aficionado (Modale Profil)",
      test: `(() => {
        const modal = document.getElementById('editProfileModal');
        userProfile.openEditModal();
        const opened = modal.classList.contains('active');
        userProfile.closeEditModal();
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Bouton Mode Visiteur (Modale Confidentialité)",
      test: `(() => {
        const modal = document.getElementById('visitorProfileModal');
        userProfile.openVisitorPreview();
        const opened = modal.classList.contains('active');
        userProfile.closeVisitorPreview();
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Bouton Adhésion VIP (Modale Club)",
      test: `(() => {
        const modal = document.getElementById('vipClubModal');
        openVipModal();
        const opened = modal.classList.contains('active');
        closeVipModal();
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Bouton Charte & Nuancier (Modale Brand)",
      test: `(() => {
        const modal = document.getElementById('brandCharterModal');
        openBrandModal();
        const opened = modal.classList.contains('active');
        closeBrandModal();
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Boutons Bascule Humidor (Galerie vs Inventaire)",
      test: `(() => {
        const btnGallery = document.getElementById('btnViewGallery');
        const btnTable = document.getElementById('btnViewTable');
        const gallery = document.getElementById('humidorGalleryContainer');
        const table = document.getElementById('humidorTableContainer');
        
        btnTable.click();
        const tableActive = table.style.display !== 'none' && gallery.style.display === 'none';
        
        btnGallery.click();
        const galleryActive = gallery.style.display !== 'none' && table.style.display === 'none';
        
        return tableActive && galleryActive;
      })()`
    },
    {
      name: "Bouton Masquer/Afficher Valorisation Humidor",
      test: `(() => {
        const toggle = document.getElementById('humidorValuationToggle');
        const valEl = document.getElementById('humidorTotalWorth');
        const initial = valEl.textContent;
        toggle.click();
        const changed = valEl.textContent !== initial;
        toggle.click(); // Rétablir
        return changed;
      })()`
    },
    {
      name: "Boutons Filtres Terroirs (Catalogue)",
      test: `(() => {
        const cubaPill = document.querySelector('.filter-pill-origin[data-origin="Cuba"]');
        const allPill = document.querySelector('.filter-pill-origin[data-origin="all"]');
        if (!cubaPill || !allPill) return false;
        cubaPill.click();
        const cubaActive = cubaPill.classList.contains('active');
        allPill.click();
        const allActive = allPill.classList.contains('active');
        return cubaActive && allActive;
      })()`
    },
    {
      name: "Bouton Examiner Vitole (Dossier de Collection)",
      test: `(() => {
        const firstCardBtn = document.querySelector('#catalogGridContainer .btn-card-inspect, .cigar-card-modern button');
        const modal = document.getElementById('cigarDetailModal');
        if (!firstCardBtn) return false;
        firstCardBtn.click();
        const opened = modal.classList.contains('active');
        cigarDetailModalClose();
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Fermeture Modale via Clic Backdrop (Fond obscurci)",
      test: `(() => {
        const modal = document.getElementById('vipClubModal');
        openVipModal();
        modal.click(); // Clic direct sur l'overlay
        return !modal.classList.contains('active');
      })()`
    },
    {
      name: "Fermeture Modale via Touche Échap (Keyboard)",
      test: `(() => {
        const modal = document.getElementById('brandCharterModal');
        openBrandModal();
        const opened = modal.classList.contains('active');
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        const closed = !modal.classList.contains('active');
        return opened && closed;
      })()`
    },
    {
      name: "Bouton Export Collection JSON",
      test: `(() => {
        return typeof userHumidor.exportCollectionJson === 'function';
      })()`
    }
  ];

  console.log("\n--- EXÉCUTION DES TESTS DES BOUTONS ---");
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      const evalRes = await send("Runtime.evaluate", {
        expression: t.test,
        returnByValue: true
      });
      if (evalRes.exceptionDetails) {
        console.error(`❌ ÉCHEC [${t.name}]:`, evalRes.exceptionDetails.text, evalRes.exceptionDetails.exception?.description);
        failed++;
      } else if (evalRes.result?.value === true) {
        console.log(`✅ SUCCÈS [${t.name}]`);
        passed++;
      } else {
        console.warn(`⚠️ RÉSULTAT NON CONFORME [${t.name}]:`, evalRes.result?.value);
        failed++;
      }
    } catch (err) {
      console.error(`❌ ERREUR D'EXÉCUTION [${t.name}]:`, err);
      failed++;
    }
  }

  console.log(`\n=== BILAN : ${passed}/${tests.length} tests réussis (${failed} échecs) ===`);

  if (errors.length > 0) {
    console.error(`\n❌ ERREURS RUNTIME JAVASCRIPT CAPTURÉES :`, errors);
  } else {
    console.log(`✅ ZÉRO ERREUR JAVASCRIPT DÉTECTÉE DANS LA CONSOLE !`);
  }

  ws.close();
  chrome.kill();
}

main().catch(console.error);
