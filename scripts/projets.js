// 🔑 CONFIGURATION (URL corrigée : on retire /rest/v1/)
const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_Ua00MHBo7_LG7EfDZiP7sA_wHa0fCCT"

// On utilise supabase.createClient (attention, pas de minuscule au début pour la librairie)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function fetchProjects() {
  const { data, error } = await _supabase // Utilisation du client créé
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erreur de récupération:", error);
  } else {
    renderProjects(data);
  }
}

function renderProjects(data) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  container.className = "projects-grid"; 
  
  if (data.length === 0) {
    container.innerHTML = "<p>Aucun projet pour le moment.</p>";
    return;
  }

  container.innerHTML = data.map(proj => `
    <div class="project-card">
      <div class="project-image" style="background-image: url('${proj.img || 'https://via.placeholder.com/300x200'}')"></div>
      <div class="project-info">
        <h3>${proj.title}</h3>
        <a href="${proj.link}" target="_blank" class="project-link">Ouvrir le lien →</a>
      </div>
    </div>
  `).join('');
}

const projectForm = document.getElementById('projectForm');
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProject = {
      title: document.getElementById('title').value,
      link: document.getElementById('link').value,
      infos: document.getElementById('infos').value
      cat: document.getElementById('cat').value
    };

    const { error } = await _supabase.from('projects').insert([newProject]);

    if (error) {
      alert("Erreur lors de l'ajout : " + error.message);
    } else {
      projectForm.reset();
      fetchProjects();
    }
  });
}

fetchProjects();
