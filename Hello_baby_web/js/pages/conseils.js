// Conseils screen
let allConseils = [];

Router.register('/conseils', async function (app) {
  if (!Auth.requireAuth()) return;

  app.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>📚 Conseils</h1>
        <p>Guides et astuces pour les jeunes parents</p>
      </div>
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Rechercher un conseil..." id="conseil-search" oninput="filterConseils()">
      </div>
      <div class="marketplace-categories" id="conseil-filters">
        <button class="category-chip active" onclick="filterConseilsByAge('all', this)">Tous</button>
        <button class="category-chip" onclick="filterConseilsByAge('0-3 mois', this)">0-3 mois</button>
        <button class="category-chip" onclick="filterConseilsByAge('0-6 mois', this)">0-6 mois</button>
        <button class="category-chip" onclick="filterConseilsByAge('3-12 mois', this)">3-12 mois</button>
        <button class="category-chip" onclick="filterConseilsByAge('6-12 mois', this)">6-12 mois</button>
      </div>
      <div id="conseils-grid" class="conseils-grid">
        <div class="loading-container"><div class="spinner-lg"></div><p>Chargement...</p></div>
      </div>
    </div>`;

  await loadConseils();
});

async function loadConseils() {
  try {
    const data = await Api.get(Config.API_ENDPOINTS.CONSEILS.BASE);
    allConseils = Array.isArray(data) ? data : (data.conseils || []);
    renderConseils(allConseils);
  } catch (err) {
    console.warn('Conseils API error, using mock data:', err.message);
    allConseils = MockData.conseils;
    renderConseils(allConseils);
    showToast(Config.ERROR_MESSAGES.NETWORK, 'warning');
  }
}

function getAgeBadgeClass(range) {
  if (!range) return 'badge-blue';
  if (range.includes('0-3')) return 'badge-pink';
  if (range.includes('0-6')) return 'badge-blue';
  if (range.includes('3-12')) return 'badge-green';
  if (range.includes('6-12')) return 'badge-yellow';
  return 'badge-blue';
}

function renderConseils(list) {
  const grid = document.getElementById('conseils-grid');
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">📚</div><p>Aucun conseil trouvé</p></div>`;
    return;
  }

  grid.innerHTML = list.map(c => `
    <div class="conseil-card" onclick="showConseilDetail('${escapeHtml(c._id)}')">
      <span class="badge ${getAgeBadgeClass(c.ageRange)}">${escapeHtml(c.ageRange || 'Tous âges')}</span>
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.content)}</p>
    </div>
  `).join('');
}

function filterConseils() {
  const q = document.getElementById('conseil-search').value.toLowerCase();
  const filtered = allConseils.filter(c =>
    c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q)
  );
  renderConseils(filtered);
}

let currentAgeFilter = 'all';
function filterConseilsByAge(age, btn) {
  currentAgeFilter = age;
  document.querySelectorAll('#conseil-filters .category-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const q = (document.getElementById('conseil-search')?.value || '').toLowerCase();
  let filtered = allConseils;
  if (age !== 'all') filtered = filtered.filter(c => c.ageRange === age);
  if (q) filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || c.content.toLowerCase().includes(q));
  renderConseils(filtered);
}

function showConseilDetail(id) {
  const conseil = allConseils.find(c => c._id === id);
  if (!conseil) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
        <i class="fas fa-times"></i>
      </button>
      <span class="badge ${getAgeBadgeClass(conseil.ageRange)}" style="margin-bottom:var(--md)">${escapeHtml(conseil.ageRange || 'Tous âges')}</span>
      <h2 style="font-size:1.35rem;font-weight:700;margin-bottom:var(--md)">${escapeHtml(conseil.title)}</h2>
      <div style="white-space:pre-wrap;line-height:1.7;color:var(--text-secondary)">${escapeHtml(conseil.content)}</div>
    </div>`;
  document.body.appendChild(overlay);
}
