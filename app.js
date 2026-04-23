// 1. Tes données : l'imprimante est le premier objet
const codexData = [
  { 
    title: "Configuration Saturn 4 Ultra", 
    cat: "Machine", 
    isHero: true, 
    details: ["Écran : 10\" 12K Mono", "Volume : 218x122x220mm", "Release : Tilt Tech", "Z-Axis : 0.02mm"], 
    note: "Paramètres matériels par défaut." 
  },
  { 
    title: "Sunlu ABS-Like Grey", 
    cat: "Résine", 
    details: "Expo: 2.5s | Bottom: 5", 
    note: "Idéale pour les figurines solides." 
  },
  { 
    title: "Anti-Aliasing", 
    cat: "Technique", 
    details: "Niveau : 4 | Gris : 0", 
    note: "Lissage des pixels sur les surfaces courbes." 
  }
];

// 2. Ta fonction de rendu (mise à jour pour gérer le cas isHero)
function renderCodex(data) {
  const container = document.getElementById('lexiqueContainer');
  
  // Si le tableau est vide (recherche infructueuse)
  if (data.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texte-muted);">Aucun résultat trouvé...</p>`;
    return;
  }

  container.innerHTML = data.map(item => {
    // Cas de la grande carte Machine
    if (item.isHero) {
      return `
        <div class="card card-hero">
          <div class="hero-header">
            <h3>${item.title}</h3>
            <span class="badge-tech">Hardware</span>
          </div>
          <div class="hero-content">
            ${item.details.map(stat => `<div class="hero-stat">${stat}</div>`).join('')}
          </div>
        </div>`;
    }
    // Cas des fiches classiques
    return `
      <div class="card">
        <h3>${item.title}</h3>
        <h5>${item.cat}</h5>
        <p style="font-size: 13px; font-weight: bold; color: var(--petrole);">${item.details}</p>
        <p style="font-size: 12px; color: var(--texte-muted); font-style: italic;">${item.note}</p>
      </div>`;
  }).join('');
}

// 3. Logique de recherche (reste identique)
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = codexData.filter(item => 
    item.title.toLowerCase().includes(term) || 
    item.cat.toLowerCase().includes(term) ||
    item.note.toLowerCase().includes(term)
  );
  renderCodex(filtered);
});

// 4. Premier affichage au chargement
renderCodex(codexData);
