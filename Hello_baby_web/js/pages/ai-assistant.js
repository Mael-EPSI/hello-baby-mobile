// AI Assistant screen
let chatMessages = [];

Router.register('/assistant', function (app) {
  if (!Auth.requireAuth()) return;

  chatMessages = [];

  app.innerHTML = `
    <div class="page">
      <div class="chat-container">
        <div class="chat-header-bar">
          <div class="icon"><i class="fas fa-robot"></i></div>
          <div>
            <div style="font-weight:700;font-size:1.05rem;">Assistant Parental IA</div>
            <div style="font-size:0.8rem;color:var(--text-light)">Posez vos questions sur bébé</div>
          </div>
        </div>
        <div class="alert alert-warning">
          <i class="fas fa-exclamation-triangle"></i>
          Cet assistant ne remplace pas un avis médical. En cas d'urgence, appelez le 15.
        </div>
        <div class="chat-messages" id="chat-messages">
          <div class="chat-bubble bot">
            Bonjour ! 👋 Je suis votre assistant parental. Posez-moi vos questions sur bébé : sommeil, alimentation, pleurs, développement…
            <div class="disclaimer">⚠️ Je ne suis pas médecin. Consultez un professionnel de santé pour tout problème médical.</div>
          </div>
        </div>
        <div class="quick-questions" id="quick-questions">
          <button onclick="sendQuickQuestion('Mon bébé pleure beaucoup, que faire ?')">😢 Bébé pleure</button>
          <button onclick="sendQuickQuestion('Comment gérer la diversification alimentaire ?')">🥄 Diversification</button>
          <button onclick="sendQuickQuestion('Mon bébé ne dort pas bien, des conseils ?')">😴 Sommeil</button>
          <button onclick="sendQuickQuestion('Mon bébé a de la fièvre, que faire ?')">🌡️ Fièvre</button>
          <button onclick="sendQuickQuestion('Quels jouets pour stimuler mon bébé ?')">🧸 Éveil</button>
        </div>
        <div class="chat-input-bar">
          <input type="text" id="chat-input" placeholder="Posez votre question..." onkeydown="if(event.key==='Enter') sendChatMessage()">
          <button onclick="sendChatMessage()" id="chat-send-btn">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>`;
});

function sendQuickQuestion(text) {
  document.getElementById('chat-input').value = text;
  sendChatMessage();
  // Hide quick questions after use
  const qqs = document.getElementById('quick-questions');
  if (qqs) qqs.style.display = 'none';
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addChatBubble(text, 'user');
  showTypingIndicator();

  // Simulate AI response after delay
  setTimeout(() => {
    removeTypingIndicator();
    const response = generateBotResponse(text);
    addChatBubble(response, 'bot');
  }, 1500);
}

function addChatBubble(text, sender) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;

  if (sender === 'bot') {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'disclaimer';
    disclaimer.textContent = '⚠️ Réponse générée automatiquement. Consultez un professionnel de santé.';
    bubble.appendChild(disclaimer);
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.id = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function generateBotResponse(question) {
  const q = question.toLowerCase();

  if (q.includes('pleure') || q.includes('pleur') || q.includes('crie')) {
    return `Quand bébé pleure, vérifiez d'abord les besoins de base :

🍼 Faim — Proposez le sein ou le biberon
🩲 Couche — Vérifiez si elle est sale
🌡️ Température — Ni trop chaud, ni trop froid
🤱 Câlin — Bébé a peut-être besoin de réconfort
😴 Fatigue — Essayez de le bercer doucement

Si les pleurs persistent, essayez le peau-à-peau, le bruit blanc, ou le portage. Des pleurs inconsolables prolongés méritent un avis médical.`;
  }

  if (q.includes('diversification') || q.includes('aliment') || q.includes('manger') || q.includes('nourri')) {
    return `La diversification alimentaire se commence généralement vers 6 mois :

🥕 Commencez par les légumes (carottes, courgettes, patates douces)
🍎 Puis introduisez les fruits (pomme, poire, banane)
🥣 Texture lisse au début, puis progressivement en morceaux
⏰ Un nouvel aliment tous les 3-5 jours pour détecter les allergies
🚫 Évitez le sel, le sucre et le miel avant 1 an

Respectez toujours l'appétit de bébé et consultez votre pédiatre.`;
  }

  if (q.includes('sommeil') || q.includes('dort') || q.includes('dodo') || q.includes('nuit')) {
    return `Pour améliorer le sommeil de bébé :

🌙 Instaurez un rituel : bain → histoire → câlin → dodo
🕐 Respectez des horaires réguliers
🌑 Obscurité la nuit, lumière le jour
🤫 Bruit blanc ou berceuse douce
🛏️ Couchez bébé éveillé pour qu'il apprenne à s'endormir seul

Les régressions de sommeil à 4, 8 et 12 mois sont normales. Patience !`;
  }

  if (q.includes('fièvre') || q.includes('température') || q.includes('malade') || q.includes('chaud')) {
    return `⚠️ En cas de fièvre chez bébé :

🌡️ Prenez la température rectale (la plus fiable)
💧 Hydratez bien (tétées ou eau si > 6 mois)
👕 Découvrez légèrement bébé
💊 Paracétamol adapté au poids (sur avis médical)

🚨 URGENCE — Appelez le 15 si :
• Bébé < 3 mois avec fièvre > 38°C
• Fièvre > 40°C à tout âge
• Bébé apathique, difficile à réveiller
• Éruption cutanée, raideur de la nuque`;
  }

  if (q.includes('jouet') || q.includes('éveil') || q.includes('stimul') || q.includes('jeu')) {
    return `Stimuler bébé selon son âge :

0-3 mois : mobiles contrastés, hochets légers, peau-à-peau
3-6 mois : tapis d'éveil, miroir, jouets de dentition
6-9 mois : cubes empilables, livres en tissu, balles
9-12 mois : instruments musicaux, jouets à tirer, puzzles simples

🎵 La musique et les comptines sont excellentes pour le développement !
💬 Parlez-lui beaucoup, narrez vos actions quotidiennes.`;
  }

  return `Merci pour votre question ! Voici quelques conseils généraux :

👶 Chaque bébé est unique et se développe à son propre rythme
📖 N'hésitez pas à consulter les guides dans la section "Conseils"
👩‍⚕️ En cas de doute, votre pédiatre est votre meilleur allié
💬 Le forum est aussi un bon endroit pour échanger avec d'autres parents

Posez-moi une question plus précise sur le sommeil, l'alimentation, les pleurs ou le développement de bébé !`;
}
