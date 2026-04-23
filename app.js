const codexData = [
  { title: "Sunlu ABS-Like Grey", cat: "Résine", details: "Expo: 2.5s | Bottom: 5 | Temp: 22°C+", note: "Super solide, idéale pour les figurines articulées." },
  { title: "Tilt Release (Saturn 4)", cat: "Technique", details: "Vitesse : Haute | Force : Faible", note: "Le bac bascule pour décoller la pièce. Réduit le risque d'échec." },
  { title: "Lavage Isopropanol (IPA)", cat: "Maintenance", details: "Temps: 5-10min", note: "Nettoyer soigneusement avant polymérisation pour éviter les traces blanches." }
];

function renderCodex(data) {
  const container = document.getElementById('lexiqueContainer');
  container.innerHTML = data.map(item => `
    <div class="card">
      <h3 style="border-left-color: ${item.cat === 'Résine' ? 'var(--lilas)' : item.cat === 'Technique' ? 'var(--givre)' : 'var(--tempete)'}">${item.title}</h3>
      <h5>${item.cat}</h5>
      <p style="font-size: 13px; font-weight: bold; color: var(--petrole);">${item.details}</p>
      <p style="font-size: 12px; color: var(--texte-muted); font-style: italic;">${item.note}</p>
    </div>
  `).join('');
}

// Logique de recherche
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = codexData.filter(item => 
    item.title.toLowerCase().includes(term) || item.note.toLowerCase().includes(term)
  );
  renderCodex(filtered);
});

// Affichage initial
renderCodex(codexData);
