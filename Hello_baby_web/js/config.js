// Configuration centralisée – version web
const Config = {
  API_BASE_URL: 'http://192.168.244.106:5000',

  DEV: {
    USE_MOCK_DATA: false,
    SHOW_API_LOGS: true,
    AUTO_FALLBACK_TO_MOCK: false,
  },

  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
    },
    FORUM: {
      BASE: '/api/forum',
      COMMENTS: (postId) => `/api/forum/${postId}/comment`,
      LIKE: (postId) => `/api/forum/${postId}/like`,
      DETAIL: (postId) => `/api/forum/${postId}`,
    },
    CONSEILS: {
      BASE: '/api/conseils',
      DETAIL: (conseilId) => `/api/conseils/${conseilId}`,
    },
    PROFILE: {
      ME: '/api/profile/me',
      UPDATE: '/api/profile/me',
    },
    GAMIFICATION: {
      STATS: '/api/gamification/stats',
      ACHIEVEMENTS: '/api/gamification/achievements',
      BADGES: '/api/gamification/badges',
      LEADERBOARD: '/api/gamification/leaderboard',
      CLAIM_REWARD: '/api/gamification/claim',
    },
  },

  APP: {
    NAME: 'Hello Baby',
    VERSION: '1.0.0',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },

  ANIMATIONS: {
    SPLASH_DURATION: 2000,
    FADE_DURATION: 800,
  },

  ERROR_MESSAGES: {
    NETWORK: 'Impossible de se connecter au serveur',
    SERVER: 'Le serveur est temporairement indisponible',
    TIMEOUT: 'La requête a pris trop de temps',
    INVALID_DATA: 'Données invalides reçues du serveur',
    BACKEND_DOWN: 'Le serveur backend semble être arrêté',
    USING_MOCK: 'Mode démonstration – Données d\'exemple',
  },
};

// Helpers
function buildUrl(endpoint) {
  return `${Config.API_BASE_URL}${endpoint}`;
}

function isHtmlResponse(data) {
  return typeof data === 'string' && data.trim().startsWith('<!DOCTYPE html>');
}

// Mock data
const MockData = {
  threads: [
    {
      _id: '1',
      title: '🍼 Premier biberon : vos conseils ?',
      content: 'Mon bébé refuse le biberon, avez-vous des astuces ? Il accepte le sein mais pas le biberon, même avec mon lait tiré. Je suis un peu inquiète car je dois reprendre le travail bientôt.',
      user: { name: 'Marie L.' },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      comments: [
        { user: { name: 'Sophie M.' }, content: 'Essayez de réchauffer légèrement la tétine avant de la donner ! Mon petit a eu le même problème.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
        { user: { name: 'Julie P.' }, content: 'Peut-être essayer une tétine différente ? Certains bébés sont très sélectifs sur la forme.', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      ],
      likes: ['user1', 'user2'],
    },
    {
      _id: '2',
      title: '😴 Sommeil perturbé à 3 mois',
      content: 'Bébé se réveille toutes les 2h, est-ce normal ? Avant il faisait des nuits de 4-5h d\'affilée. Régression du sommeil peut-être ?',
      user: { name: 'Thomas D.' },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      comments: [
        { user: { name: 'Anna K.' }, content: 'C\'est tout à fait normal ! Il y a souvent une régression vers 3-4 mois. Ça va passer !', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      ],
      likes: ['user3'],
    },
    {
      _id: '3',
      title: '🥄 Diversification alimentaire : par où commencer ?',
      content: 'Ma pédiatre me dit qu\'on peut commencer la diversification à 6 mois. Quels ont été vos premiers aliments ? J\'ai un peu peur des allergies.',
      user: { name: 'Claire R.' },
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      comments: [],
      likes: [],
    },
    {
      _id: '4',
      title: '🚗 Premier voyage en voiture avec bébé',
      content: 'Conseils pour un trajet de 3h avec un bébé de 2 mois ? Je stresse un peu pour ce premier long voyage.',
      user: { name: 'Marc B.' },
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        { user: { name: 'Laura S.' }, content: 'Prévoyez des pauses toutes les 2h maximum ! Et emportez tout le nécessaire : biberons, couches, changes...', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      ],
      likes: ['user4', 'user5'],
    },
  ],
  conseils: [
    { _id: '1', title: '🛁 Premier bain de bébé', content: 'Conseils pour donner le premier bain en toute sécurité :\n\n• Température de l\'eau à 37°C (utilisez un thermomètre)\n• Préparez tout à l\'avance : serviettes, produits, vêtements\n• Soutenez bien la tête et la nuque\n• Ne laissez jamais bébé seul\n• Commencez par 5-10 minutes maximum\n• Parlez-lui doucement pour le rassurer', ageRange: '0-3 mois' },
    { _id: '2', title: '🍼 Allaitement : les premiers jours', content: 'Les premiers jours d\'allaitement peuvent être difficiles :\n\n• Position confortable pour maman et bébé\n• Allaitement à la demande (8-12 tétées/jour)\n• Surveillez les signes de faim\n• Alternez les seins à chaque tétée\n• Hydratez-vous bien\n• N\'hésitez pas à demander de l\'aide', ageRange: '0-3 mois' },
    { _id: '3', title: '💤 Créer une routine de sommeil', content: 'Instaurer de bonnes habitudes de sommeil :\n\n• Différenciez jour et nuit : lumière le jour, obscurité la nuit\n• Rituel du coucher : bain, histoire, câlin\n• Couchez bébé éveillé pour qu\'il apprenne à s\'endormir seul\n• Respectez ses signaux de fatigue\n• Soyez patient, cela prend du temps', ageRange: '0-6 mois' },
    { _id: '4', title: '🎵 Stimuler le développement par la musique', content: 'La musique favorise le développement cognitif de bébé :\n\n• Chantez des berceuses et comptines\n• Faites écouter différents styles musicaux\n• Utilisez des instruments adaptés (hochets, maracas)\n• Dansez avec bébé dans vos bras\n• Réagissez à ses mouvements et sourires', ageRange: '3-12 mois' },
    { _id: '5', title: '🍎 Introduction des aliments solides', content: 'Guide pour commencer la diversification alimentaire :\n\n• Commencez vers 6 mois, pas avant 4 mois\n• Un aliment à la fois pendant 3-5 jours\n• Commencez par les légumes puis les fruits\n• Texture lisse au début, puis morceaux\n• Respectez l\'appétit de bébé\n• Rendez les repas agréables', ageRange: '6-12 mois' },
  ],
  user: {
    name: 'Utilisateur Demo',
    email: 'demo@hellobaby.com',
    childDOB: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
};
