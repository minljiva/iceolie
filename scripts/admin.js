const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co/iceolie_admin";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY"; // Utilise la même clé que dans projets.js
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 1. CHARGER LES TÂCHES ──
async function fetchTasks() {
  const { data, error } = await _supabase
    .from('iceolie_admin')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) console.error(error);
  else renderTasks(data);
}

// ── 2. AFFICHER LES TÂCHES ──
function renderTasks(tasks) {
  const container = document.getElementById('adminTasks');
  if (!container) return;

  container.innerHTML = tasks.map(task => `
    <div class="admin-task ${task.is_done ? 'done' : ''}">
      <input type="checkbox" ${task.is_done ? 'checked' : ''} 
             onclick="toggleTask('${task.id}', ${task.is_done})">
      <div style="flex-grow:1">
        <div>${task.text}</div>
        <small style="color: var(--texte-muted); font-size: 11px;">${task.due_date}</small>
      </div>
    </div>
  `).join('');
}

// ── 3. COCHER / DÉCOCHER (Update) ──
async function toggleTask(id, currentStatus) {
  const { error } = await _supabase
    .from('iceolie_admin')
    .update({ is_done: !currentStatus })
    .eq('id', id);

  if (!error) fetchTasks();
}

// ── 4. AJOUTER UNE TÂCHE ──
// Tu peux lier ça à un petit formulaire plus tard
async function addTask(text, date) {
  const { error } = await _supabase
    .from('iceolie_admin')
    .insert([{ text, due_date: date, is_done: false }]);
  
  if (!error) fetchTasks();
}

document.addEventListener('DOMContentLoaded', fetchTasks);

const adminTasks = [
  { id: 1, text: "Déclaration CA trimestriel", done: false, date: "Avant le 31/03" },
  { id: 2, text: "Renouveler assurance pro", done: true, date: "Fait" },
  { id: 3, text: "Mise à jour du livre des recettes", done: false, date: "Hebdomadaire" }
];

function renderAdmin() {
  const container = document.getElementById('adminTasks');
  if (!container) return;

  container.innerHTML = adminTasks.map(task => `
    <div class="admin-task ${task.done ? 'done' : ''}">
      <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
      <div style="flex-grow:1">
        <div>${task.text}</div>
        <small style="color: var(--texte-muted); font-size: 11px;">${task.date}</small>
      </div>
    </div>
  `).join('');
}

function toggleTask(id) {
  const task = adminTasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    renderAdmin();
  }
}

document.addEventListener('DOMContentLoaded', renderAdmin);
