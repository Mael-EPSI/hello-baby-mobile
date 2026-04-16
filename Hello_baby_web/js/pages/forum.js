// Forum screen
let forumThreads = [];

Router.register('/forum', async function (app) {
  if (!Auth.requireAuth()) return;

  app.innerHTML = `
    <div class="page">
      <div class="forum-header">
        <div class="page-header">
          <h1>💬 Forum</h1>
          <p>Échangez avec d'autres parents</p>
        </div>
        <button class="btn btn-primary" onclick="location.hash='#/new-thread'">
          <i class="fas fa-plus"></i> Nouveau sujet
        </button>
      </div>
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Rechercher un sujet..." id="forum-search" oninput="filterForumThreads()">
      </div>
      <div id="forum-list" class="thread-list">
        <div class="loading-container"><div class="spinner-lg"></div><p>Chargement...</p></div>
      </div>
    </div>
    <button class="fab" onclick="location.hash='#/new-thread'" title="Nouveau sujet">
      <i class="fas fa-plus"></i>
    </button>`;

  await loadForumThreads();
});

async function loadForumThreads() {
  try {
    const data = await Api.get(Config.API_ENDPOINTS.FORUM.BASE);
    forumThreads = Array.isArray(data) ? data : (data.threads || data.posts || []);
    renderForumThreads(forumThreads);
  } catch (err) {
    console.warn('Forum API error, using mock data:', err.message);
    forumThreads = MockData.threads;
    renderForumThreads(forumThreads);
    showToast(Config.ERROR_MESSAGES.NETWORK, 'warning');
  }
}

function renderForumThreads(threads) {
  const container = document.getElementById('forum-list');
  if (!container) return;

  if (!threads.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">💬</div>
        <p>Aucun sujet pour le moment. Soyez le premier !</p>
      </div>`;
    return;
  }

  container.innerHTML = threads.map(t => `
    <div class="thread-card" onclick="location.hash='#/post/${escapeHtml(t._id)}'">
      <div class="thread-card-header">
        <div class="avatar">${getInitials(t.user?.name)}</div>
        <div class="thread-meta">
          <div class="name">${escapeHtml(t.user?.name || 'Anonyme')}</div>
          <div class="date">${timeAgo(t.createdAt)}</div>
        </div>
      </div>
      <h3>${escapeHtml(t.title)}</h3>
      <p>${escapeHtml(t.content)}</p>
      <div class="thread-card-footer">
        <div class="thread-stat">
          <button onclick="event.stopPropagation(); toggleForumLike('${escapeHtml(t._id)}')">
            <i class="fas fa-heart"></i> ${(t.likes || []).length}
          </button>
        </div>
        <div class="thread-stat">
          <i class="fas fa-comment"></i> ${(t.comments || []).length}
        </div>
      </div>
    </div>
  `).join('');
}

function filterForumThreads() {
  const q = document.getElementById('forum-search').value.toLowerCase();
  const filtered = forumThreads.filter(t =>
    t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q)
  );
  renderForumThreads(filtered);
}

async function toggleForumLike(postId) {
  try {
    await Api.post(Config.API_ENDPOINTS.FORUM.LIKE(postId));
    await loadForumThreads();
  } catch (err) {
    showToast('Erreur lors du like', 'error');
  }
}
