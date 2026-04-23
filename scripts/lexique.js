/* --- 1. DONNÉES --- */
const codexData = [
    { title: "Configuration Saturn 4 Ultra", cat: "Machine", isHero: true, details: ["Écran : 10\" 12K Mono", "Volume : 218x122x220mm"], note: "Paramètres matériels." },
    { title: "Sunlu ABS-Like Grey", cat: "Résine", details: "Expo: 2.5s | Bottom: 5", note: "Idéale pour les figurines." }
];

/* --- 2. ÉTAT (Ce qui change) --- */
let currentFilter = 'all';

/* --- 3. FONCTIONS (Les outils) --- */
function renderCodex(data) {
    const container = document.getElementById('lexiqueContainer');
    if (!container) return; // Sécurité si on n'est pas sur la bonne page

    container.innerHTML = data.map(item => {
        if (item.isHero) {
            return `<div class="card card-hero">...</div>`;
        }
        return `<div class="card">...</div>`;
    }).join('');
}

function filterAndRender() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = codexData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(term) || item.note.toLowerCase().includes(term);
        const matchesCat = currentFilter === 'all' || item.cat === currentFilter;
        return matchesSearch && matchesCat;
    });
    renderCodex(filtered);
}

/* --- 4. ÉCOUTEURS (Les branchements) --- */
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', filterAndRender);
}

document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-cat');
        filterAndRender();
    });
});

/* --- 5. LANCEMENT --- */
renderCodex(codexData);
