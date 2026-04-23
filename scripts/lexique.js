// 📦 BLOC 1 : LES DONNÉES (Le frigo)
// Ici on met tout ce qui est brut : tes tableaux, tes objets, tes réglages.
const codexData = [...];

// ⚙️ BLOC 2 : LES VARIABLES D'ÉTAT (Le plan de travail)
// Ici on stocke ce qui change pendant qu'on utilise la page.
let currentFilter = 'all';

// 🛠️ BLOC 3 : LES OUTILS (Les fonctions)
// Ce sont tes "robots". Ils ne font rien tant qu'on ne les appelle pas.
// Ils prennent des données et les transforment en HTML.
function renderCodex(data) { ... }
function filterAndRender() { ... }

// ⚡ BLOC 4 : LES ÉCOUTEURS (Les interrupteurs)
// C'est ici qu'on branche le JS sur le HTML. 
// "Quand je clique ici, lance tel robot".
document.getElementById('searchInput').addEventListener('input', ...);

// 🚀 BLOC 5 : LE DÉPART (Le lancement)
// On dit au JS d'afficher quelque chose dès que la page s'ouvre.
renderCodex(codexData);
