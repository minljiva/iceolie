alert("Le JS est bien chargé !");
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
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const term = searchInput.value.toLowerCase();
  
  const filtered = codexData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(term) || item.note.toLowerCase().includes(term);
    const matchesCat = (currentFilter === 'all') || (item.cat === currentFilter);
    return matchesSearch && matchesCat;
  });
  
  renderCodex(filtered);
}

/* --- 4. ÉCOUTEURS --- */

// On attend que le DOM soit chargé par sécurité
document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', filterAndRender);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterAndRender();
        });
    }

    document.querySelectorAll('.btn-filter[data-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-cat');
            filterAndRender();
        });
    });

    // Lancement initial
    renderCodex(codexData);
});
