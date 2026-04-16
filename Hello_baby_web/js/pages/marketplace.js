// Marketplace screen
Router.register('/marketplace', function (app) {
  if (!Auth.requireAuth()) return;

  const products = [
    { id: 1, emoji: '🍼', name: 'Kit Biberon Premium', price: '34,99 €', rating: '⭐ 4.8 (245)', desc: 'Anti-colique, BPA free' },
    { id: 2, emoji: '🚗', name: 'Siège Auto i-Size', price: '189,00 €', rating: '⭐ 4.9 (523)', desc: 'Groupe 0+/1, ISOFIX' },
    { id: 3, emoji: '🛒', name: 'Poussette Compacte', price: '249,00 €', rating: '⭐ 4.7 (189)', desc: 'Pliage une main, 6kg' },
    { id: 4, emoji: '📱', name: 'Babyphone Vidéo', price: '79,99 €', rating: '⭐ 4.6 (312)', desc: 'Vision nocturne, berceuses' },
    { id: 5, emoji: '🧸', name: 'Tapis d\'Éveil Musical', price: '45,00 €', rating: '⭐ 4.8 (167)', desc: '12 activités sensorielles' },
  ];

  const services = [
    { id: 1, emoji: '👩‍👧', name: 'Baby-sitting à domicile', price: '12-18 €/h', rating: '⭐ 4.9', desc: 'Baby-sitters vérifiés dans votre quartier', available: true },
    { id: 2, emoji: '🤱', name: 'Atelier Portage', price: '35 €/séance', rating: '⭐ 4.8', desc: 'Apprenez les techniques de portage', available: true },
    { id: 3, emoji: '🍼', name: 'Consultante en lactation', price: '60 €/consultation', rating: '⭐ 4.9', desc: 'Accompagnement allaitement personnalisé', available: true },
    { id: 4, emoji: '🏠', name: 'Aide ménagère post-natal', price: '15-22 €/h', rating: '⭐ 4.7', desc: 'Service d\'aide à domicile après la naissance', available: false },
  ];

  app.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>🛍️ Marketplace</h1>
        <p>Produits recommandés et services près de chez vous</p>
      </div>

      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Rechercher un produit ou service..." id="market-search" oninput="filterMarketplace()">
      </div>

      <div class="marketplace-categories" id="market-cats">
        <button class="category-chip active" onclick="filterMarketCategory('all', this)">Tout</button>
        <button class="category-chip" onclick="filterMarketCategory('products', this)">🍼 Produits</button>
        <button class="category-chip" onclick="filterMarketCategory('services', this)">👩‍👧 Services</button>
      </div>

      <div id="market-content">
        <div class="marketplace-section" id="products-section">
          <h2><i class="fas fa-star" style="color:var(--accent)"></i> Produits recommandés</h2>
          <div class="products-scroll">
            ${products.map(p => `
              <div class="product-card">
                <div class="product-emoji">${p.emoji}</div>
                <h3>${escapeHtml(p.name)}</h3>
                <p style="font-size:0.8rem;color:var(--text-light);margin-bottom:var(--sm)">${escapeHtml(p.desc)}</p>
                <div class="price">${escapeHtml(p.price)}</div>
                <div class="rating">${p.rating}</div>
                <button class="btn btn-primary btn-sm btn-block" onclick="showToast('Lien affilié bientôt disponible', 'warning')">
                  <i class="fas fa-external-link-alt"></i> Voir le produit
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="marketplace-section" id="services-section" style="margin-top:var(--xl)">
          <h2><i class="fas fa-hands-helping" style="color:var(--primary)"></i> Services près de chez vous</h2>
          <div class="services-grid">
            ${services.map(s => `
              <div class="service-card ${s.available ? '' : 'unavailable'}">
                <div class="service-emoji">${s.emoji}</div>
                <h3>
                  ${escapeHtml(s.name)}
                  ${!s.available ? '<span class="unavailable-badge">Indisponible</span>' : ''}
                </h3>
                <p class="service-desc">${escapeHtml(s.desc)}</p>
                <div class="service-meta">
                  <span class="service-price">${escapeHtml(s.price)}</span>
                  <span class="service-rating">${s.rating}</span>
                </div>
                ${s.available ? `
                  <button class="btn btn-outline btn-sm btn-block" style="margin-top:var(--md)" onclick="showToast('Prise de contact bientôt disponible', 'warning')">
                    <i class="fas fa-phone"></i> Contacter
                  </button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="alert alert-info" style="margin-top:var(--xl)">
          <i class="fas fa-info-circle"></i>
          Certains liens sont des liens affiliés. Hello Baby peut percevoir une commission sans surcoût pour vous.
        </div>
      </div>
    </div>`;
});

let marketCategory = 'all';

function filterMarketCategory(cat, btn) {
  marketCategory = cat;
  document.querySelectorAll('#market-cats .category-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const prods = document.getElementById('products-section');
  const servs = document.getElementById('services-section');
  if (prods) prods.style.display = (cat === 'all' || cat === 'products') ? '' : 'none';
  if (servs) servs.style.display = (cat === 'all' || cat === 'services') ? '' : 'none';
}
