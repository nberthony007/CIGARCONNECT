import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");

// Chargement des scripts JS pour vérifier les fonctions définies
const jsFiles = ["js/data.js", "js/catalog.js", "js/humidor.js", "js/trade.js", "js/profile.js", "js/app.js", "js/icons.js"];
let combinedJs = "";
jsFiles.forEach(f => {
  combinedJs += "\n" + fs.readFileSync(path.resolve(process.cwd(), f), "utf-8");
});

console.log("=== AUDIT STATIQUE DE TOUS LES BOUTONS & ONCLICKS DANS INDEX.HTML ===");

// Extraction de toutes les balises button et liens onclick
const buttonRegex = /<(button|a|div|span)[^>]*?(onclick=["'][^"']*?["']|id=["'][^"']*?["']|class=["'][^"']*?["'])[^>]*?>/gi;
const lines = html.split("\n");

interface ButtonIssue {
  lineNum: number;
  tag: string;
  id?: string | null;
  cls?: string | null;
  onclick?: string | null;
  issue: string;
}
const buttonIssues: ButtonIssue[] = [];
let totalButtons = 0;

lines.forEach((line, lineIdx) => {
  const lineNum = lineIdx + 1;
  const matches = line.matchAll(/<(button|a|div|span)\s+([^>]*?)>/gi);
  for (const m of matches) {
    const tag = m[1];
    const attrs = m[2];

    if (tag === "button" || attrs.includes("onclick") || attrs.includes("nav-tab-btn") || attrs.includes("view-mode-btn")) {
      totalButtons++;
      const onclickMatch = attrs.match(/onclick=["']([^"']*)["']/i);
      const idMatch = attrs.match(/id=["']([^"']*)["']/i);
      const classMatch = attrs.match(/class=["']([^"']*)["']/i);
      const typeMatch = attrs.match(/type=["']([^"']*)["']/i);
      const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
      const dataViewMatch = attrs.match(/data-view=["']([^"']*)["']/i);

      const onclick = onclickMatch ? onclickMatch[1] : null;
      const id = idMatch ? idMatch[1] : null;
      const cls = classMatch ? classMatch[1] : null;
      const type = typeMatch ? typeMatch[1] : null;
      const href = hrefMatch ? hrefMatch[1] : null;
      const dataView = dataViewMatch ? dataViewMatch[1] : null;

      // Si c'est un bouton sans onclick, sans type submit, sans id écouté
      if (tag === "button" && !onclick && type !== "submit") {
        let isHandled = false;
        if (id && combinedJs.includes(id)) isHandled = true;
        if (cls) {
          const classes = cls.split(/\s+/);
          for (const c of classes) {
            if (combinedJs.includes(`.${c}`) || combinedJs.includes(`'${c}'`) || combinedJs.includes(`"${c}"`)) {
              isHandled = true;
              break;
            }
          }
        }
        if (dataView) isHandled = true;

        if (!isHandled) {
          buttonIssues.push({
            lineNum,
            tag,
            id,
            cls,
            issue: "Bouton sans gestionnaire détecté (pas de onclick, pas d'ID ou de classe écoutée dans JS)"
          });
        }
      }

      // Si c'est un onclick, vérifier si la fonction appelée existe
      if (onclick) {
        // Exemples: switchView('...'), userHumidor.openAddModal(), openVipModal()
        const fnCallMatch = onclick.match(/([a-zA-Z0-9_$.]+)\s*\(/);
        if (fnCallMatch) {
          const fnName = fnCallMatch[1];
          // Vérification de l'existence
          let exists = false;
          if (fnName.includes(".")) {
            const [obj, method] = fnName.split(".");
            // Ex: userHumidor.openAddModal, cigarTrade.closeProposalModal, document.getElementById
            if (obj === "document" || obj === "window" || obj === "history") exists = true;
            else if (combinedJs.includes(method)) exists = true;
          } else {
            if (combinedJs.includes(`function ${fnName}`) || combinedJs.includes(`${fnName} =`) || combinedJs.includes(`window.${fnName}`)) {
              exists = true;
            }
          }

          if (!exists) {
            buttonIssues.push({
              lineNum,
              tag,
              onclick,
              issue: `Fonction '${fnName}' introuvable dans les scripts JS !`
            });
          }
        }
      }
    }
  }
});

console.log(`Total boutons / éléments cliquables audités : ${totalButtons}`);
console.log(`Problèmes ou anomalies détectées : ${buttonIssues.length}`);
buttonIssues.forEach((issue) => {
  console.log(`  Ligne ${issue.lineNum} [${issue.tag}]: ${issue.issue} (onclick: ${issue.onclick || 'none'}, id: ${issue.id || 'none'}, class: ${issue.cls || 'none'})`);
});
