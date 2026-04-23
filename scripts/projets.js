// 🔑 CONFIGURATION SUPABASE (Remplace par tes vraies infos)
const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co/rest/v1/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛠️ 1. FONCTION POUR RÉCUPÉRER LES DONNÉES
async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur de récupération:", error);
  } else {
    renderProjects(data);
  }
}

// 🛠️ 2. FONCTION POUR AFFICHER LES DONNÉES
function renderProjects(data) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  container.innerHTML = data.map(proj => `
    <div class="card">
      <div style="width:100%; height:150px; background-image: url('${proj.img || 'https://via.placeholder.com/300x200'}'); background-size: cover; background-position: center; border-radius: 5px; margin-bottom: 10px;"></div>
      <h3>${proj.title}</h3>
      <a href="${proj.link}" target="_blank" class="nav-link" style="padding: 0; color: var(--petrole); font-weight: bold; font-size: 12px;">Voir la source →</a>
    </div>
  `).join('');
}

// ⚡ 3. FORMULAIRE D'ENVOI
const projectForm = document.getElementById('projectForm');
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProject = {
      title: document.getElementById('projTitle').value,
      link: document.getElementById('projLink').value,
      img: document.getElementById('projImg').value
    };

    // Envoi vers Supabase
    const { error } = await supabase.from('projects').insert([newProject]);

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else {
      projectForm.reset();
      fetchProjects(); // On rafraîchit la liste immédiatement
    }
  });
}

// 🚀 4. LANCEMENT
fetchProjects();
