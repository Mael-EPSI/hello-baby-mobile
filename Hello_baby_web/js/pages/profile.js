// Profile screen
Router.register('/profile', async function (app) {
  if (!Auth.requireAuth()) return;

  app.innerHTML = `
    <div class="page">
      <div class="profile-container">
        <div id="profile-area">
          <div class="loading-container"><div class="spinner-lg"></div><p>Chargement du profil...</p></div>
        </div>
      </div>
    </div>`;

  await loadProfile();
});

async function loadProfile() {
  const area = document.getElementById('profile-area');
  if (!area) return;

  let user;
  try {
    user = await Api.get(Config.API_ENDPOINTS.PROFILE.ME);
  } catch (err) {
    console.warn('Profile API error, using fallback:', err.message);
    user = Auth.getUser() || MockData.user;
  }

  const childAge = user.childDOB ? getChildAge(user.childDOB) : 'Non renseigné';
  const dobValue = user.childDOB ? new Date(user.childDOB).toISOString().split('T')[0] : '';

  area.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${getInitials(user.name)}</div>
      <h1 style="font-size:1.5rem;font-weight:700">${escapeHtml(user.name)}</h1>
      <p style="color:var(--text-secondary)">${escapeHtml(user.email)}</p>
      ${user.childDOB ? `<p style="color:var(--text-light);font-size:0.9rem;margin-top:4px">👶 Bébé : ${childAge}</p>` : ''}
    </div>

    <div class="profile-form">
      <h2 style="font-size:1.15rem;font-weight:600;margin-bottom:var(--md)">Modifier le profil</h2>
      <form onsubmit="handleUpdateProfile(event)">
        <div class="form-group">
          <label for="profile-name">Nom</label>
          <input type="text" id="profile-name" class="form-input" value="${escapeHtml(user.name)}" required>
        </div>
        <div class="form-group">
          <label for="profile-email">Email</label>
          <input type="email" id="profile-email" class="form-input" value="${escapeHtml(user.email)}" readonly style="background:var(--surface-secondary);cursor:not-allowed">
        </div>
        <div class="form-group">
          <label for="profile-dob">Date de naissance de l'enfant</label>
          <input type="date" id="profile-dob" class="form-input" value="${dobValue}">
        </div>
        <div class="form-error" id="profile-error" style="margin-bottom:12px"></div>
        <button type="submit" class="btn btn-primary btn-block" id="profile-btn">
          <i class="fas fa-save"></i> Enregistrer
        </button>
      </form>

      <hr style="margin:var(--lg) 0;border:none;border-top:1px solid var(--border)">

      <button class="btn btn-danger btn-block" onclick="handleLogout()">
        <i class="fas fa-sign-out-alt"></i> Se déconnecter
      </button>
    </div>`;
}

function getChildAge(dob) {
  const diff = Date.now() - new Date(dob).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 30) return `${days} jour${days > 1 ? 's' : ''}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years} an${years > 1 ? 's' : ''} ${remainingMonths > 0 ? `et ${remainingMonths} mois` : ''}`;
}

async function handleUpdateProfile(e) {
  e.preventDefault();
  const name = document.getElementById('profile-name').value.trim();
  const childDOB = document.getElementById('profile-dob').value;
  const btn = document.getElementById('profile-btn');
  const errEl = document.getElementById('profile-error');
  errEl.textContent = '';

  if (!name) { errEl.textContent = 'Nom requis'; return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Enregistrement...';

  try {
    const body = { name };
    if (childDOB) body.childDOB = childDOB;
    await Api.patch(Config.API_ENDPOINTS.PROFILE.UPDATE, body);
    showToast('Profil mis à jour !', 'success');
    await loadProfile();
  } catch (err) {
    errEl.textContent = err.message || 'Erreur lors de la mise à jour';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-save"></i> Enregistrer';
  }
}

function handleLogout() {
  Auth.logout();
  showToast('Déconnexion réussie', 'success');
}
