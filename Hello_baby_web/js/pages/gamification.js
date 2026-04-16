// Gamification screen
Router.register('/gamification', function (app) {
  if (!Auth.requireAuth()) return;

  const stats = { points: 1250, level: 3, streak: 7, weeklyGoal: 85, monthlyGoal: 60 };
  const xpForNext = 2000;
  const xpPercent = Math.round((stats.points / xpForNext) * 100);

  const achievements = [
    { id: 1, title: '🎉 Premier Post', desc: 'Votre premier post sur le forum', points: 50, unlocked: true, date: '15/01/2024' },
    { id: 2, title: '🔥 Série de 7 jours', desc: 'Connexion pendant 7 jours consécutifs', points: 100, unlocked: true, date: '20/01/2024' },
    { id: 3, title: '💖 Parent Aidant', desc: '10 réponses utiles dans le forum', points: 150, unlocked: true, date: '25/01/2024' },
    { id: 4, title: '📚 Lecteur Assidu', desc: 'Lire 50 conseils', points: 200, unlocked: false, progress: 64 },
    { id: 5, title: '⭐ Membre Premium', desc: '30 jours de connexion consécutifs', points: 300, unlocked: false, progress: 23 },
  ];

  app.innerHTML = `
    <div class="page">
      <div class="page-header">
        <h1>🏆 Récompenses & Défis</h1>
        <p>Gagnez des points et débloquez des badges</p>
      </div>

      <div class="gamification-stats">
        <div class="stat-card">
          <div class="icon">⭐</div>
          <div class="value">${stats.points}</div>
          <div class="label">Points</div>
        </div>
        <div class="stat-card">
          <div class="icon">🎯</div>
          <div class="value">${stats.level}</div>
          <div class="label">Niveau</div>
        </div>
        <div class="stat-card">
          <div class="icon">🔥</div>
          <div class="value">${stats.streak}j</div>
          <div class="label">Série</div>
        </div>
        <div class="stat-card">
          <div class="icon">📊</div>
          <div class="value">${stats.weeklyGoal}%</div>
          <div class="label">Objectif hebdo</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--xl)">
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--sm)">
          <span style="font-weight:600">Niveau ${stats.level} → ${stats.level + 1}</span>
          <span style="font-size:0.85rem;color:var(--text-secondary)">${stats.points} / ${xpForNext} XP</span>
        </div>
        <div class="progress-bar">
          <div class="fill" style="width:${xpPercent}%"></div>
        </div>
      </div>

      <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:var(--md)">🏅 Succès</h2>
      <div class="achievement-list">
        ${achievements.map(a => `
          <div class="achievement-card ${a.unlocked ? '' : 'locked'}">
            <div class="badge-icon" style="background:${a.unlocked ? 'var(--baby-yellow)' : 'var(--surface-secondary)'}">
              ${a.title.split(' ')[0]}
            </div>
            <div class="achievement-info">
              <h3>${escapeHtml(a.title)}</h3>
              <p>${escapeHtml(a.desc)}</p>
              ${!a.unlocked && a.progress ? `
                <div class="progress-bar" style="margin-top:8px;max-width:200px">
                  <div class="fill" style="width:${a.progress}%"></div>
                </div>
                <span style="font-size:0.75rem;color:var(--text-light)">${a.progress}%</span>
              ` : ''}
              ${a.unlocked ? `<span style="font-size:0.75rem;color:var(--success)">✓ Débloqué le ${a.date}</span>` : ''}
            </div>
            <div class="points">+${a.points} pts</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:var(--xl)">
        <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:var(--md)">🚀 Actions rapides</h2>
        <div style="display:flex;gap:var(--md);flex-wrap:wrap">
          <button class="btn btn-primary" onclick="location.hash='#/new-thread'">
            <i class="fas fa-plus"></i> Écrire un post (+20 pts)
          </button>
          <button class="btn btn-secondary" onclick="location.hash='#/conseils'">
            <i class="fas fa-book"></i> Lire un conseil (+5 pts)
          </button>
          <button class="btn btn-outline" onclick="location.hash='#/forum'">
            <i class="fas fa-comment"></i> Aider un parent (+10 pts)
          </button>
        </div>
      </div>
    </div>`;

  // Animate progress bar after render
  setTimeout(() => {
    document.querySelectorAll('.progress-bar .fill').forEach(fill => {
      const w = fill.style.width;
      fill.style.width = '0%';
      setTimeout(() => { fill.style.width = w; }, 50);
    });
  }, 100);
});
