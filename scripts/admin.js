console.log("Le script admin est bien chargé !");
function openOverlay() {
    console.log("Tentative d'ouverture de l'overlay");
    document.getElementById('adminOverlay').classList.add('active');
}

const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. CHARGER ──
async function fetchTasks() {
  const { data, error } = await _supabase
    .from('iceolie_admin')
    .select('*')
    .order('adminDate', { ascending: true });

  if (error) console.error("Erreur:", error);
  else renderTasks(data);
}

// ── 2. AFFICHER ──
function renderTasks(tasks) {
  const container = document.getElementById('adminTasks');
  if (!container) return;

  if (tasks.length === 0) {
    container.innerHTML = "<p>Aucune tâche en cours. C'est le moment de se reposer !</p>";
    return;
  }

  container.innerHTML = tasks.map(task => `
    <div class="card admin-task ${task.adminDone ? 'done' : ''}" style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
      <input type="checkbox" ${task.adminDone ? 'checked' : ''} 
             onclick="toggleTask('${task.id}', ${task.adminDone})" 
             style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--petrole);">
      <div style="flex-grow: 1;">
        <div style="font-weight: bold; font-size: 14px;">${task.adminTitle}</div>
        <div style="font-size: 11px; color: var(--texte-muted);">📅 ${task.adminDate} • ${task.adminCat}</div>
      </div>
    </div>
  `).join('');
}

// ── 3. CHANGER STATUT ──
async function toggleTask(id, currentStatus) {
  const { error } = await _supabase
    .from('iceolie_admin')
    .update({ adminDone: !currentStatus })
    .eq('id', id);

  if (!error) fetchTasks();
}

// ── 4. AJOUTER ──
const adminForm = document.getElementById('adminForm');
if (adminForm) {
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newTask = {
      adminTitle: document.getElementById('adminTitle').value,
      adminDate:  document.getElementById('adminDate').value,
      adminCat:   document.getElementById('adminCat').value,
      adminDone:  false
    };

    const { error } = await _supabase.from('iceolie_admin').insert([newTask]);

    if (error) alert("Erreur d'envoi : " + error.message);
    else {
      closeOverlay();
      adminForm.reset();
      fetchTasks();
    }
  });
}

// ── 5. OVERLAY ──
function openOverlay() {
  const overlay = document.getElementById('adminOverlay');
  if (overlay) {
    overlay.classList.add('open'); // On utilise .open comme dans ton CSS
    console.log("L'overlay est maintenant ouvert");
  } else {
    console.error("L'élément adminOverlay est introuvable");
  }
}
function closeOverlay() {
  const overlay = document.getElementById('adminOverlay');
  if (overlay) {
    overlay.classList.remove('open');
  }
}
// Lancement
document.addEventListener('DOMContentLoaded', fetchTasks);
