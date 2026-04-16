// New Thread screen
Router.register('/new-thread', function (app) {
  if (!Auth.requireAuth()) return;

  app.innerHTML = `
    <div class="page">
      <div class="post-detail">
        <button class="back-btn" onclick="location.hash='#/forum'">
          <i class="fas fa-arrow-left"></i> Retour au forum
        </button>
        <div class="card-elevated" style="padding:var(--xl);">
          <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:var(--lg);">✏️ Nouveau sujet</h1>
          <form onsubmit="handleNewThread(event)">
            <div class="form-group">
              <label for="thread-title">Titre</label>
              <input type="text" id="thread-title" class="form-input" placeholder="Titre de votre sujet" required maxlength="120">
            </div>
            <div class="form-group">
              <label for="thread-content">Contenu</label>
              <textarea id="thread-content" class="form-textarea" placeholder="Décrivez votre question ou partagez votre expérience..." required rows="6"></textarea>
            </div>
            <div class="form-error" id="thread-error" style="margin-bottom:12px"></div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" id="thread-btn">
              <i class="fas fa-paper-plane"></i> Publier
            </button>
          </form>
        </div>
      </div>
    </div>`;
});

async function handleNewThread(e) {
  e.preventDefault();
  const title = document.getElementById('thread-title').value.trim();
  const content = document.getElementById('thread-content').value.trim();
  const btn = document.getElementById('thread-btn');
  const errEl = document.getElementById('thread-error');
  errEl.textContent = '';

  if (!title || !content) { errEl.textContent = 'Titre et contenu requis'; return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Publication...';

  try {
    await Api.post(Config.API_ENDPOINTS.FORUM.BASE, { title, content });
    showToast('Sujet publié !', 'success');
    window.location.hash = '#/forum';
  } catch (err) {
    errEl.textContent = err.message || 'Erreur lors de la publication';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publier';
  }
}
