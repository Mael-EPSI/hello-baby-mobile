// About screen
Router.register('/about', function (app) {
  app.innerHTML = `
    <div class="page ${Auth.isAuthenticated() ? '' : 'no-nav'}" style="${Auth.isAuthenticated() ? '' : 'padding-top:var(--xxl)'}">
      <div class="about-container">
        ${!Auth.isAuthenticated() ? '<button class="back-btn" onclick="location.hash=\'#/accueil\'"><i class="fas fa-arrow-left"></i> Retour</button>' : ''}
        <div class="about-icon">👶</div>
        <h1 style="font-size:2rem;font-weight:800;color:var(--primary);margin-bottom:var(--sm)">Hello Baby</h1>
        <p style="font-size:1.1rem;color:var(--text-secondary);margin-bottom:var(--xs)">La notice du bébé</p>
        <p style="font-size:0.85rem;color:var(--text-light)">Version ${Config.APP.VERSION}</p>

        <div class="card" style="margin-top:var(--xl);text-align:left">
          <p style="line-height:1.7;color:var(--text-secondary)">
            Hello Baby est votre compagnon parental au quotidien. Notre mission est d'accompagner les jeunes parents
            avec des conseils bienveillants, un forum d'entraide et un assistant intelligent.
          </p>
        </div>

        <div class="about-features">
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>Forum</h3>
            <p>Échangez avec d'autres parents, posez vos questions et partagez vos expériences.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>Conseils</h3>
            <p>Des guides pratiques classés par tranche d'âge pour chaque étape de bébé.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Assistant IA</h3>
            <p>Un assistant intelligent pour répondre à vos questions sur bébé, 24h/24.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>Gamification</h3>
            <p>Gagnez des points et badges en participant activement à la communauté.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛍️</div>
            <h3>Marketplace</h3>
            <p>Produits recommandés et services pour bébé près de chez vous.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Sécurité</h3>
            <p>Vos données sont protégées et chiffrées. Respect total de votre vie privée.</p>
          </div>
        </div>

        <p style="margin-top:var(--xl);color:var(--text-light);font-size:0.85rem">
          Fait avec ❤️ pour les jeunes parents<br>
          © 2024 Hello Baby — Tous droits réservés
        </p>
      </div>
    </div>`;

  // Show/hide navbar depending on auth
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('hidden', !Auth.isAuthenticated());
});
