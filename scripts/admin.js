const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. CHARGER ──
async function fetchTasks() {
    const { data, error } = await _supabase
        .from('iceolie_admin')
        .select('*')
        .order('adminDate', { ascending: true });

    if (error) console.error("Erreur Supabase:", error);
    else renderTasks(data);
}

// ── 2. AFFICHER (Nettoyé) ──
function renderTasks(tasks) {
    const container = document.getElementById('adminTasks');
    if (!container) return;

    if (!tasks || tasks.length === 0) {
        container.innerHTML = "<p class='empty-msg'>Aucune tâche en cours.</p>";
        return;
    }

    container.innerHTML = tasks.map(task => `
    <div class="card admin-task ${task.adminDone ? 'done' : ''}" 
         style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px; opacity: ${task.adminDone ? '0.6' : '1'}">
      
      <input type="checkbox" 
             ${task.adminDone ? 'checked' : ''} 
             onclick="toggleTaskStatus('${task.id}', ${task.adminDone})" 
             style="width: 22px; height: 22px; cursor: pointer; accent-color: var(--petrole); flex-shrink: 0;">
      
      <div style="flex-grow: 1; cursor: pointer;" onclick="toggleTaskStatus('${task.id}', ${task.adminDone})">
        <div style="font-weight: bold; font-size: 14px; text-decoration: ${task.adminDone ? 'line-through' : 'none'}">
            ${task.adminTitle}
        </div>
        <div style="font-size: 11px; color: var(--texte-muted);">
            📅 ${task.adminDate || 'Pas de date'} • ${task.adminCat || 'Général'}
        </div>
      </div>
    </div>
  `).join('');
}

// ── 3. CHANGER STATUT (Unifié) ──
async function toggleTaskStatus(id, currentStatus) {
    console.log("Clic sur la tâche ID:", id, "Statut actuel:", currentStatus);
    
    const { error } = await _supabase
        .from('iceolie_admin')
        .update({ adminDone: !currentStatus }) // On inverse le booléen
        .eq('id', id);

    if (error) {
        console.error("Erreur lors de la mise à jour :", error.message);
    } else {
        console.log("Mise à jour réussie !");
        fetchTasks(); // On recharge la liste pour voir le changement
    }
}
// ── 4. AJOUTER ──
// On attend que le DOM soit prêt pour lier le formulaire
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks(); // On lance le chargement au démarrage

    const adminForm = document.getElementById('adminForm');
    if (adminForm) {
        adminForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const newTask = {
                adminTitle: document.getElementById('adminTitle').value,
                adminDate: document.getElementById('adminDate').value,
                adminCat: document.getElementById('adminCat').value,
                adminDone: false
            };

            const { error } = await _supabase.from('iceolie_admin').insert([newTask]);

            if (error) {
                alert("Erreur d'envoi : " + error.message);
            } else {
                closeOverlay();
                adminForm.reset();
                fetchTasks();
            }
        });
    }
});

// ── 5. OVERLAY (FONCTIONS GLOBALES) ──
function openOverlay() {
    const overlay = document.getElementById('adminOverlay');
    if (overlay) {
        overlay.classList.add('open');
        console.log("Overlay ouvert");
    }
}

function closeOverlay() {
    const overlay = document.getElementById('adminOverlay');
    if (overlay) {
        overlay.classList.remove('open');
    }
}
