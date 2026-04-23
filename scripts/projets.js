// 🔑 CONFIGURATION
const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY"; // Vérifie bien cette clé dans Supabase

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛠️ 1. RÉCUPÉRER
async function fetchProjects() {
  const { data, error } = await _supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur de récupération:", error);
  } else {
    renderProjects(data);
  }
}

// 🛠️ 2. AFFICHER
function renderProjects(data) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  container.className = "projects-grid"; 
  
  if (!data || data.length === 0) {
    container.innerHTML = "<p>Aucun projet pour le moment.</p>";
    return;
  }

  container.innerHTML = data.map(proj => `
    <div class="project-card">
      <div class="project-image" style="background-image: url('${proj.infos || 'https://via.placeholder.com/300x200'}')"></div>
      <div class="project-info">
        <span style="font-size: 10px; color: var(--petrole); text-transform: uppercase; font-weight: bold;">${proj.cat || 'Général'}</span>
        <h3>${proj.title}</h3>
        <a href="${proj.link}" target="_blank" class="project-link">Ouvrir le lien →</a>
      </div>
    </div>
  `).join('');
}

// ⚡ 3. ENVOYER
const projectForm = document.getElementById('projectForm');
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // On crée l'objet avec les noms EXACTS de tes colonnes Supabase
    const projectToAdd = {
      title: document.getElementById('projTitle').value,
      link: document.getElementById('projLink').value,
      infos: document.getElementById('projImg').value, // On utilise le champ image pour 'infos'
      cat: "Inspiration" // Valeur par défaut ou tu peux ajouter un champ
    };

    const { error } = await _supabase.from('projects').insert([projectToAdd]);

    if (error) {
      console.error("Détails erreur:", error);
      alert("Erreur lors de l'ajout : " + error.message);
    } else {
      projectForm.reset();
      fetchProjects();
    }
  });
}

fetchProjects();
