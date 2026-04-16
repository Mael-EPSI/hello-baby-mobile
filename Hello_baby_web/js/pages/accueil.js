// Accueil / Welcome screen
Router.register('/accueil', function (app) {
  app.innerHTML = `
    <div class="accueil-screen no-nav">
      <div class="accueil-logo">👶</div>
      <h1 class="accueil-title">Hello Baby</h1>
      <p class="accueil-subtitle">Bienvenue dans votre application parentale ! Conseils, forum et assistant IA pour accompagner les premiers mois de bébé.</p>
      <div class="accueil-actions">
        <button class="btn btn-primary btn-lg btn-block" onclick="location.hash='#/login'">
          <i class="fas fa-sign-in-alt"></i> Se connecter
        </button>
        <button class="btn btn-secondary btn-lg btn-block" onclick="location.hash='#/register'">
          <i class="fas fa-user-plus"></i> Créer un compte
        </button>
        <button class="btn btn-ghost btn-block" onclick="location.hash='#/about'" style="margin-top:8px">
          <i class="fas fa-info-circle"></i> À propos
        </button>
      </div>
    </div>`;
});
