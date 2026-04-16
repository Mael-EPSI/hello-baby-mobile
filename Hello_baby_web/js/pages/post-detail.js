// Post detail screen
Router.register('/post/:id', async function (app, params) {
  if (!Auth.requireAuth()) return;

  app.innerHTML = `
    <div class="page">
      <div class="post-detail">
        <button class="back-btn" onclick="location.hash='#/forum'">
          <i class="fas fa-arrow-left"></i> Retour au forum
        </button>
        <div id="post-content-area">
          <div class="loading-container"><div class="spinner-lg"></div><p>Chargement...</p></div>
        </div>
      </div>
    </div>`;

  await loadPostDetail(params.id);
});

async function loadPostDetail(postId) {
  const area = document.getElementById('post-content-area');
  if (!area) return;

  try {
    let post;
    try {
      post = await Api.get(Config.API_ENDPOINTS.FORUM.DETAIL(postId));
    } catch {
      // Fallback to mock
      post = MockData.threads.find(t => t._id === postId);
    }

    if (!post) {
      area.innerHTML = `<div class="empty-state"><div class="icon">🔍</div><p>Post introuvable</p></div>`;
      return;
    }

    const comments = post.comments || [];

    area.innerHTML = `
      <div class="post-content">
        <div class="thread-card-header">
          <div class="avatar">${getInitials(post.user?.name)}</div>
          <div class="thread-meta">
            <div class="name">${escapeHtml(post.user?.name || 'Anonyme')}</div>
            <div class="date">${timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <h1>${escapeHtml(post.title)}</h1>
        <div class="body">${escapeHtml(post.content)}</div>
        <div class="post-actions">
          <button class="btn btn-outline btn-sm" onclick="likePost('${escapeHtml(post._id)}')">
            <i class="fas fa-heart"></i> ${(post.likes || []).length} J'aime
          </button>
          <span class="thread-stat"><i class="fas fa-comment"></i> ${comments.length} commentaire${comments.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div class="comments-section">
        <h2>Commentaires (${comments.length})</h2>
        ${comments.length === 0 ? '<p style="color:var(--text-light);font-size:0.9rem;">Aucun commentaire. Soyez le premier !</p>' : ''}
        ${comments.map(c => `
          <div class="comment-card">
            <div class="comment-header">
              <div class="avatar sm">${getInitials(c.user?.name)}</div>
              <div class="thread-meta">
                <div class="name">${escapeHtml(c.user?.name || 'Anonyme')}</div>
                <div class="date">${timeAgo(c.createdAt)}</div>
              </div>
            </div>
            <div class="comment-body">${escapeHtml(c.content)}</div>
          </div>
        `).join('')}
      </div>

      <div class="comment-form">
        <input type="text" id="comment-input" placeholder="Écrire un commentaire..." onkeydown="if(event.key==='Enter') submitComment('${escapeHtml(post._id)}')">
        <button class="btn btn-primary btn-sm" onclick="submitComment('${escapeHtml(post._id)}')">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>`;
  } catch (err) {
    area.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> ${escapeHtml(err.message)}</div>`;
  }
}

async function likePost(postId) {
  try {
    await Api.post(Config.API_ENDPOINTS.FORUM.LIKE(postId));
    await loadPostDetail(postId);
    showToast('❤️', 'success');
  } catch (err) {
    showToast('Erreur', 'error');
  }
}

async function submitComment(postId) {
  const input = document.getElementById('comment-input');
  const content = input.value.trim();
  if (!content) return;

  try {
    await Api.post(Config.API_ENDPOINTS.FORUM.COMMENTS(postId), { content });
    input.value = '';
    await loadPostDetail(postId);
    showToast('Commentaire ajouté !', 'success');
  } catch (err) {
    showToast(err.message || 'Erreur', 'error');
  }
}
