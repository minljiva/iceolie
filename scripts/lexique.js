/* --- 1. DONNÉES --- */
const codexData = [
  { title: "Configuration Saturn 4 Ultra", cat: "Machine", isHero: true, details: ["Écran : 10\" 12K Mono", "Volume : 218x122x220mm"], note: "Hardware" },
  { title: "Sunlu ABS-Like Grey", cat: "Résine", details: "Expo: 2.5s", note: "Figurines" },
  { title: "Supports Fins", cat: "Technique", details: "0.30mm", note: "Précision" }
];

/* --- 2. ÉTAT --- */
let currentFilter = 'all';

/* --- 3. FONCTIONS --- */
function renderCodex(data) {
  const container = document.getElementById('lexiqueContainer');
  if (!container) return;

  container.innerHTML = data.map(item => {
    if (item.isHero) {
      return `<div class="card card-hero"><div class="hero-header"><h3>${item.title}</h3></div><div class="hero-content">${item.details.map(d => `<div class="hero-stat">${d}</div>`).join('')}</div></div>`;
    }
    return `<div class="card"><h3>${item.title}</h3><h5>${item.cat}</h5><p>${item.details}</p></div>`;
  }).join('');
}

function filterAndRender() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  
  const filtered = codexData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(term) || item.note.toLowerCase().includes(term);
    const matchesCat = (currentFilter === 'all') || (item.cat === currentFilter);
    return matchesSearch && matchesCat;
  });
  
  renderCodex(filtered);
}

/* --- 4. ÉCOUTEURS --- */

// Recherche
document.getElementById('searchInput').addEventListener('input', filterAndRender);

// Bouton Effacer
document.getElementById('clearSearch').addEventListener('click', () => {
  document.getElementById('searchInput').value = ''; // Vide l'input
  filterAndRender(); // Relance le rendu
});

// Boutons de Filtres
document.querySelectorAll('.btn-filter[data-cat]').forEach(btn => {
  btn.addEventListener('click', () => {
    // Visuel : on change la classe active
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Logique : on change le filtre
    currentFilter = btn.getAttribute('data-cat');
    console.log("Filtre sélectionné :", currentFilter); // Pour debugger
    filterAndRender();
  });
});

/* --- 5. LANCEMENT --- */
renderCodex(codexData);
