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
