const SUPABASE_URL = "https://ljkaqpgpfczqvpobwzoo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqa2FxcGdwZmN6cXZwb2J3em9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Mjg4ODYsImV4cCI6MjA5MjUwNDg4Nn0.N813WeFmHTGJvgAcSgRMTSYmog21fJn979OU__urZjY";
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allProjects = [];
let currentCat = 'tous';

// ── STATUT COULEURS ──
const statusColors = {
  'idée':      { bg: 'var(--lilas-pale)',  color: 'var(--rose)' },
  'en cours':  { bg: 'var(--givre-pale)',  color: 'var(--petrole)' },
  'terminé':   { bg: 'var(--terre-pale)',  color: 'var(--terre)' },
  'en pause':  { bg: 'var(--bg-outer)',    color: 'var(--texte-muted)' },
};

// ── 1. FETCH ──
async function fetchProjects() {
  setStatus('Chargement...');
  const { data, error } = await _supabase
    .from('iceolie_projets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    setStatus('Erreur de chargement : ' + error.message);
    console.error(error);
    return;
  }
  allProjects = data || [];
  setStatus('');
  renderProjects(filterProjects());
}

// ── 2. FILTRE ──
function filterProjects() {
  if (currentCat === 'tous') return allProjects;
  return allProjects.filter(p => p.projCat === currentCat);
}

// ── 3. RENDER ──
function renderProjects(data) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="empty-msg">Aucun projet dans cette catégorie.</p>';
    return;
  }

  container.innerHTML = data.map(proj => {
    const status = proj.projStatus || 'idée';
    const sc = statusColors[status] || statusColors['idée'];
    const hasImg = proj.projInfos && proj.projInfos.startsWith('http');
    const isImpression = proj.projCat === 'Impression 3D';

    return `
    <div class="project-card" id="card-${proj.id}">

      ${hasImg ? `<div class="project-image" style="background-image: url('${proj.projInfos}')"></div>` : ''}

      <div class="project-body">
        <div class="project-meta">
          <span class="project-cat">${proj.projCat || 'Inspiration'}</span>
          <span class="project-status" style="background:${sc.bg}; color:${sc.color};">${status}</span>
        </div>

        <h3 class="project-title">${proj.projTitle || 'Sans titre'}</h3>

        ${proj.projDesc ? `<p class="project-desc">${proj.projDesc}</p>` : ''}

        ${isImpression && (proj.projResine || proj.projTemps || proj.projConfig) ? `
        <div class="project-tech">
          ${proj.projResine  ? `<span class="tech-tag">🧪 ${proj.projResine}</span>`  : ''}
          ${proj.projTemps   ? `<span class="tech-tag">⏱ ${proj.projTemps}</span>`    : ''}
          ${proj.projConfig  ? `<span class="tech-tag">⚙️ ${proj.projConfig}</span>`  : ''}
        </div>` : ''}

        <div class="project-footer">
          ${proj.projLink ? `<a href="${proj.projLink}" target="_blank" class="project-link">Voir la source →</a>` : '<span></span>'}
          <div class="project-actions">
            <button class="btn-action" onclick="editProject('${proj.id}')" title="Modifier">✎</button>
            <button class="btn-action btn-delete" onclick="deleteProject('${proj.id}')" title="Supprimer">✕</button>
          </div>
        </div>
      </div>

    </div>`;
  }).join('');
}

// ── 4. OVERLAY ──
function openOverlay(proj = null) {
  const overlay = document.getElementById('overlay');
  const form    = document.getElementById('projectForm');
  form.reset();
  document.getElementById('impressionFields').style.display = 'none';

  if (proj) {
    document.getElementById('overlayTitle').textContent = 'Modifier le projet';
    document.getElementById('submitBtn').textContent    = 'Enregistrer';
    document.getElementById('projId').value      = proj.id;
    document.getElementById('projTitle').value   = proj.projTitle  || '';
    document.getElementById('projCat').value     = proj.projCat    || 'Inspiration';
    document.getElementById('projLink').value    = proj.projLink   || '';
    document.getElementById('projInfos').value   = proj.projInfos  || '';
    document.getElementById('projDesc').value    = proj.projDesc   || '';
    document.getElementById('projStatus').value  = proj.projStatus || 'idée';
    document.getElementById('projResine').value  = proj.projResine || '';
    document.getElementById('projTemps').value   = proj.projTemps  || '';
    document.getElementById('projConfig').value  = proj.projConfig || '';
    if (proj.projCat === 'Impression 3D') {
      document.getElementById('impressionFields').style.display = 'block';
    }
  } else {
    document.getElementById('overlayTitle').textContent = 'Nouveau projet';
    document.getElementById('submitBtn').textContent    = 'Ajouter';
    document.getElementById('projId').value = '';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOverlay() {
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeOverlayOutside(e) {
  if (e.target === document.getElementById('overlay')) closeOverlay();
}

function toggleImpressionFields() {
  const cat = document.getElementById('projCat').value;
  document.getElementById('impressionFields').style.display =
    cat === 'Impression 3D' ? 'block' : 'none';
}

// ── 5. EDIT ──
function editProject(id) {
  const proj = allProjects.find(p => p.id == id);
  if (proj) openOverlay(proj);
}

// ── 6. DELETE ──
async function deleteProject(id) {
  if (!confirm('Supprimer ce projet ?')) return;
  const { error } = await _supabase.from('iceolie_projets').delete().eq('id', id);
  if (error) { alert('Erreur : ' + error.message); return; }
  fetchProjects();
}

// ── 7. SUBMIT (création + édition) ──
const projectForm = document.getElementById('projectForm');
if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('projId').value;
    const payload = {
      projTitle:  document.getElementById('projTitle').value,
      projCat:    document.getElementById('projCat').value,
      projLink:   document.getElementById('projLink').value,
      projInfos:  document.getElementById('projInfos').value,
      projDesc:   document.getElementById('projDesc').value,
      projStatus: document.getElementById('projStatus').value,
      projResine: document.getElementById('projResine').value,
      projTemps:  document.getElementById('projTemps').value,
      projConfig: document.getElementById('projConfig').value,
    };

    let error;
    if (id) {
      ({ error } = await _supabase.from('iceolie_projets').update(payload).eq('id', id));
    } else {
      ({ error } = await _supabase.from('iceolie_projets').insert([payload]));
    }

    if (error) { alert('Erreur : ' + error.message); return; }

    closeOverlay();
    fetchProjects();
  });
}

// ── 8. FILTRES ──
document.getElementById('filterGroup').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-filter');
  if (!btn) return;
  document.querySelectorAll('#filterGroup .btn-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentCat = btn.dataset.cat;
  renderProjects(filterProjects());
});

// ── 9. STATUS MSG ──
function setStatus(msg) {
  const el = document.getElementById('status-msg');
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

// ── LANCEMENT ──
fetchProjects();
