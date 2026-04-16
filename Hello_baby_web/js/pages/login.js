// Login screen
Router.register('/login', function (app) {
  app.innerHTML = `
    <div class="auth-screen no-nav">
      <div class="auth-card">
        <div class="auth-header">
          <div class="icon">🔐</div>
          <h1>Connexion</h1>
          <p>Heureux de vous revoir !</p>
        </div>
        <form id="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" class="form-input" placeholder="votre@email.com" required>
            <div class="form-error" id="login-email-error"></div>
          </div>
          <div class="form-group">
            <label for="login-password">Mot de passe</label>
            <div class="form-input-wrapper">
              <input type="password" id="login-password" class="form-input" placeholder="Votre mot de passe" required minlength="6">
              <button type="button" class="toggle-password" onclick="togglePasswordVisibility('login-password', this)">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div class="form-error" id="login-password-error"></div>
          </div>
          <div class="form-error" id="login-global-error" style="margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">
            Se connecter
          </button>
        </form>
        <div class="alert alert-info" style="margin-top:var(--md);font-size:0.85rem">
          <i class="fas fa-info-circle"></i>
          Compte test : <strong>test@hellobaby.com</strong> / <strong>test123</strong>
        </div>
        <div class="auth-footer">
          Pas encore de compte ? <a href="#/register">S'inscrire</a>
        </div>
      </div>
    </div>`;
});

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const icon = btn.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn = document.getElementById('login-btn');
  const globalErr = document.getElementById('login-global-error');

  // Reset errors
  globalErr.textContent = '';
  document.getElementById('login-email-error').textContent = '';
  document.getElementById('login-password-error').textContent = '';

  // Validate
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById('login-email-error').textContent = 'Email invalide';
    document.getElementById('login-email').classList.add('error');
    return;
  }
  if (password.length < 6) {
    document.getElementById('login-password-error').textContent = 'Minimum 6 caractères';
    document.getElementById('login-password').classList.add('error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Connexion...';

  // Compte test en dur
  const TEST_ACCOUNT = { email: 'test@hellobaby.com', password: 'test123' };

  if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
    Auth.setToken('test-token-hello-baby');
    Auth.setUser({ name: 'Parent Test', email: TEST_ACCOUNT.email, childDOB: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() });
    showToast('Connexion réussie !', 'success');
    btn.disabled = false;
    btn.innerHTML = 'Se connecter';
    window.location.hash = '#/forum';
    return;
  }

  try {
    const data = await Api.post(Config.API_ENDPOINTS.AUTH.LOGIN, { email, password });
    Auth.setToken(data.token);
    if (data.user) Auth.setUser(data.user);
    showToast('Connexion réussie !', 'success');
    window.location.hash = '#/forum';
  } catch (err) {
    globalErr.textContent = err.message || 'Erreur de connexion';
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Se connecter';
  }
}
