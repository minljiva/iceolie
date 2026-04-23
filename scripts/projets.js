// 1. Vérification du chargement du SDK
if (typeof supabase === 'undefined') {
    alert("ERREUR : Le SDK Supabase n'est pas chargé. Vérifie ta connexion internet et la balise script dans le HTML.");
}

const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY";

// Création du client (Attention au 'S' majuscule de Supabase.createClient)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const statusMsg = document.getElementById('status-msg');

// 🛠️ RÉCUPÉRER LES PROJETS
async function fetchProjects() {
    if(statusMsg) statusMsg.innerText = "Chargement des projets...";
    
    const { data, error } = await _supabase
        .from('iceolie_projets')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erreur Supabase:", error);
        if(statusMsg) statusMsg.innerText = "Erreur : " + error.message;
    } else {
        if(statusMsg) statusMsg.innerText = "Projets synchronisés ✅";
        renderProjects(data);
    }
}

// 🛠️ AFFICHER LES CARTES
function renderProjects(data) {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    container.className = "projects-grid"; 
    
    if (!data || data.length === 0) {
        container.innerHTML = "<p>Aucun projet trouvé dans la base.</p>";
        return;
    }

    container.innerHTML = data.map(proj => `
        <div class="project-card">
            <div class="project-image" style="background-image: url('${proj.infos || 'https://via.placeholder.com/300x200'}')"></div>
            <div class="project-info">
                <small>${proj.cat || 'Inspiration'}</small>
                <h3>${proj.title || 'Sans titre'}</h3>
                <a href="${proj.link}" target="_blank" class="project-link">Ouvrir le lien →</a>
            </div>
        </div>
    `).join('');
}

// ⚡ ENVOYER UN PROJET
const projectForm = document.getElementById('projectForm');
if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(statusMsg) statusMsg.innerText = "Envoi en cours...";

        const newProject = {
            title: document.getElementById('projTitle').value,
            link: document.getElementById('projLink').value,
            infos: document.getElementById('projImg').value,
            cat: 'Inspiration'
        };

        const { error } = await _supabase.from('iceolie_projets').insert([newProject]);

        if (error) {
            alert("Erreur d'insertion : " + error.message);
            console.error(error);
        } else {
            projectForm.reset();
            fetchProjects();
        }
    });
}

// Lancement au démarrage
fetchProjects();
