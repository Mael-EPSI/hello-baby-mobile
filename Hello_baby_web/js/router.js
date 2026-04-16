// Simple hash-based SPA router
const Router = {
  routes: {},
  currentPage: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  navigate(hash) {
    window.location.hash = hash;
  },

  // Parse hash: "#/post/123" → { path: "/post/:id", params: { id: "123" } }
  matchRoute(hash) {
    const cleanHash = hash.replace('#', '') || '/splash';

    // Try exact match first
    if (this.routes[cleanHash]) {
      return { handler: this.routes[cleanHash], params: {} };
    }

    // Try parameterised routes
    for (const pattern in this.routes) {
      const paramNames = [];
      const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
        paramNames.push(name);
        return '([^/]+)';
      });
      const regex = new RegExp(`^${regexStr}$`);
      const match = cleanHash.match(regex);
      if (match) {
        const params = {};
        paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        return { handler: this.routes[pattern], params };
      }
    }

    return null;
  },

  async handleRoute() {
    const hash = window.location.hash || '#/splash';
    const result = this.matchRoute(hash);

    if (!result) {
      window.location.hash = '#/accueil';
      return;
    }

    const app = document.getElementById('app');
    const navbar = document.getElementById('navbar');

    // Determine if we should show navbar
    const publicPages = ['/splash', '/accueil', '/login', '/register'];
    const currentPath = hash.replace('#', '') || '/splash';
    const isPublic = publicPages.includes(currentPath);

    if (navbar) {
      navbar.classList.toggle('hidden', isPublic);
    }

    // Update active nav link
    if (!isPublic) {
      document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', hash.startsWith(href));
      });
    }

    try {
      await result.handler(app, result.params);
    } catch (err) {
      console.error('Router error:', err);
      app.innerHTML = `
        <div class="page">
          <div class="empty-state">
            <div class="icon">⚠️</div>
            <p>Une erreur est survenue</p>
            <button class="btn btn-primary" style="margin-top:16px" onclick="location.hash='#/forum'">Retour</button>
          </div>
        </div>`;
    }
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },
};

// Toast helper
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
}

// Mobile menu helpers
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('hidden');
  document.getElementById('mobile-menu').classList.toggle('show');
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.add('hidden');
  document.getElementById('mobile-menu').classList.remove('show');
}

// Relative date helper
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

// Initial avatar helper
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
