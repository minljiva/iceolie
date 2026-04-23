const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛠️ 1. FONCTION DE RÉCUPÉRATION
async function fetchProjects() {
    const { data, error } = await _supabase
        .from('iceolie_projets') 
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erreur Supabase :", error);
        return; // Ici le return est autorisé car on est DANS une fonction async
    }
    
    renderProjects(data);
} // <--- IL MANQUAIT CETTE ACCOLADE ICI !

// 🛠️ 2. FONCTION D'AFFICHAGE
function renderProjects(data) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    
    container.className = "projects-grid"; 
    
    if (!data || data.length === 0) {
        container.innerHTML = "<p>Aucun projet trouvé. Soyez le premier à contribuer !</p>";
        return;
    }

    container.innerHTML = data.map(proj => `
        <div class="project-card">
<div class="project-image" style="background-image: url('${proj.projInfos || 'https://via.placeholder.com/300x200'}')"></div>
<small>${proj.projCat || 'Inspiration'}</small>
<h3>${proj.projTitle || 'Sans titre'}</h3>
<a href="${proj.projLink}" target="_blank" class="project-link">Ouvrir le lien →</a>
            </div>
        </div>
    `).join('');
}

// ⚡ 3. FORMULAIRE D'ENVOI
const projectForm = document.getElementById('projectForm');
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

 const newProject = {
    projTitle: document.getElementById('projTitle').value,
    projLink:  document.getElementById('projLink').value,
    projInfos: document.getElementById('projImg').value,
    projCat:   'Inspiration'
};

        const { error } = await _supabase.from('iceolie_projets').insert([newProject]);

        if (error) {
            alert("Erreur lors de l'envoi : " + error.message);
        } else {
            projectForm.reset();
            fetchProjects(); // Rafraîchit la liste
        }
    });
}

// 🚀 LANCEMENT
fetchProjects();
