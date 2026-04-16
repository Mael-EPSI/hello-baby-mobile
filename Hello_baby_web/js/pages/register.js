// Register screen
Router.register('/register', function (app) {
  app.innerHTML = `
    <div class="auth-screen no-nav">
      <div class="auth-card">
        <div class="auth-header">
          <div class="icon">👶</div>
          <h1>Inscription</h1>
          <p>Rejoignez la communauté Hello Baby !</p>
        </div>
        <form id="register-form" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label for="reg-name">Nom complet</label>
            <input type="text" id="reg-name" class="form-input" placeholder="Votre nom" required>
          </div>
          <div class="form-group">
            <label for="reg-email">Email</label>
            <input type="email" id="reg-email" class="form-input" placeholder="votre@email.com" required>
          </div>
          <div class="form-group">
            <label for="reg-password">Mot de passe</label>
            <div class="form-input-wrapper">
              <input type="password" id="reg-password" class="form-input" placeholder="Minimum 6 caractères" required minlength="6">
              <button type="button" class="toggle-password" onclick="togglePasswordVisibility('reg-password', this)">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="reg-dob">Date de naissance de l'enfant</label>
            <input type="date" id="reg-dob" class="form-input">
          </div>
          <div class="form-error" id="register-global-error" style="margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="register-btn">
            Créer mon compte
          </button>
        </form>
        <div class="auth-footer">
          Déjà un compte ? <a href="#/login">Se connecter</a>
        </div>
      </div>
    </div>`;
});

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const childDOB = document.getElementById('reg-dob').value;
  const btn = document.getElementById('register-btn');
  const globalErr = document.getElementById('register-global-error');
  globalErr.textContent = '';

  if (!name || name.length < 2) { globalErr.textContent = 'Nom requis'; return; }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { globalErr.textContent = 'Email invalide'; return; }
  if (password.length < 6) { globalErr.textContent = 'Mot de passe : min 6 caractères'; return; }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Inscription...';

  try {
    const body = { name, email, password };
    if (childDOB) body.childDOB = childDOB;
    const data = await Api.post(Config.API_ENDPOINTS.AUTH.REGISTER, body);
    Auth.setToken(data.token);
    if (data.user) Auth.setUser(data.user);
    showToast('Compte créé avec succès !', 'success');
    window.location.hash = '#/forum';
  } catch (err) {
    globalErr.textContent = err.message || 'Erreur lors de l\'inscription';
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Créer mon compte';
  }
}
