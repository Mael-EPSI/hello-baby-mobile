// Splash screen
Router.register('/splash', function (app) {
  app.innerHTML = `
    <div class="splash-screen no-nav">
      <div class="splash-logo">👶</div>
      <h1 class="splash-title">Hello Baby</h1>
      <p class="splash-subtitle">La notice du bébé</p>
      <div class="splash-spinner"></div>
    </div>`;

  setTimeout(() => {
    if (Auth.isAuthenticated()) {
      window.location.hash = '#/forum';
    } else {
      window.location.hash = '#/accueil';
    }
  }, Config.ANIMATIONS.SPLASH_DURATION);
});
