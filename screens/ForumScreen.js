import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Colors, Fonts, Spacing, BorderRadius, Shadows, Typography, Inputs, Cards } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { buildUrl, Config, isHtmlResponse, MockData, getEndpoint } from '../config/config';

export default function ForumScreen() {
  const [threads, setThreads] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [likingPosts, setLikingPosts] = useState(new Set()); // Track posts being liked
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    fetchThreads();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchThreads = async () => {
    try {
      setError(null); // Réinitialiser l'erreur au début
      
      if (Config.DEV.SHOW_API_LOGS) {
        console.log('🔄 Fetching threads from:', buildUrl(Config.API_ENDPOINTS.FORUM.BASE));
      }
      
      const res = await axios.get(buildUrl(Config.API_ENDPOINTS.FORUM.BASE), {
        timeout: Config.APP.TIMEOUT,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      // Vérifier si on reçoit du HTML au lieu de JSON
      if (isHtmlResponse(res.data)) {
        console.warn('⚠️ Réponse HTML reçue au lieu de JSON');
        throw new Error('BACKEND_DOWN');
      }
      
      // Ensure we have an array
      if (res.data && Array.isArray(res.data)) {
        console.log('✅ Données forum reçues:', res.data.length, 'threads');
        console.log('📋 Premier thread:', res.data[0]); // Debug : voir la structure des données
        setThreads(res.data);
        setError(null); // S'assurer qu'il n'y a pas d'erreur quand les données arrivent
      } else {
        console.warn('API returned non-array data:', typeof res.data);
        throw new Error('INVALID_DATA');
      }
    } catch (err) {
      console.log('❌ Erreur forum', err.message);
      setError('Impossible de charger le forum');
      setThreads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchThreads();
  };

  const handleLike = async (threadId) => {
    try {
      // Éviter les double clics
      if (likingPosts.has(threadId)) return;
      
      setLikingPosts(prev => new Set(prev).add(threadId));
      
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      if (!token) {
        Alert.alert('Connexion requise', 'Vous devez être connecté pour liker un post');
        return;
      }

      const likeUrl = getEndpoint.forumLike(threadId);
      console.log('🔗 Tentative de like sur:', likeUrl);
      console.log('🎫 Token présent:', !!token);
      console.log('📱 Thread ID:', threadId);

      const response = await axios.post(
        likeUrl,
        {},
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: Config.APP.TIMEOUT,
        }
      );

      console.log('✅ Réponse like reçue:', response.data);

      // Mettre à jour l'état local immédiatement
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread._id === threadId 
            ? { ...thread, likes: response.data.likes, isLiked: response.data.isLiked }
            : thread
        )
      );

      console.log('✅ Like/Unlike successful:', response.data);
    } catch (err) {
      console.log('❌ Erreur like complète:', err);
      console.log('❌ Erreur like message:', err.message);
      console.log('❌ Erreur like response:', err.response?.data);
      console.log('❌ Erreur like status:', err.response?.status);
      console.log('🔗 URL tentée:', getEndpoint.forumLike(threadId));
      
      if (err.response?.status === 404) {
        Alert.alert(
          'Endpoint non trouvé', 
          `L'endpoint ${getEndpoint.forumLike(threadId)} n'existe pas sur le serveur.\n\nVérifiez que le backend est redémarré avec les nouvelles routes.`
        );
      } else if (err.response?.status === 401) {
        Alert.alert('Erreur d\'authentification', 'Token invalide ou expiré');
      } else {
        Alert.alert('Erreur', `Impossible de liker ce post: ${err.message}`);
      }
      
      // Simulation temporaire du like (pour les tests)
      if (Config.DEV.SHOW_API_LOGS) {
        console.log('💡 Simulation du like en local pour les tests');
        setThreads(prevThreads => 
          prevThreads.map(thread => {
            if (thread._id === threadId) {
              const currentLikes = thread.likes || [];
              const isCurrentlyLiked = thread.isLiked || false;
              
              return {
                ...thread,
                likes: isCurrentlyLiked 
                  ? currentLikes.slice(0, -1) // Retirer un like
                  : [...currentLikes, 'temp-user'], // Ajouter un like
                isLiked: !isCurrentlyLiked
              };
            }
            return thread;
          })
        );
      }
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(threadId);
        return newSet;
      });
    }
  };

  const renderItem = ({ item, index }) => {
    // Vérification de sécurité pour éviter les erreurs
    if (!item || typeof item !== 'object') {
      console.warn('⚠️ Item invalide dans renderItem:', item);
      return null;
    }

    console.log('🎨 Rendering thread:', item.title || 'Titre manquant');
    
    const isLiked = item.isLiked || false;
    const likesCount = item.likes?.length || 0;
    const isLikingInProgress = likingPosts.has(item._id);
    
    // Valeurs par défaut pour éviter les erreurs
    const title = item.title || 'Titre non disponible';
    const content = item.content || 'Contenu non disponible';
    const userName = item.user?.name || 'Utilisateur anonyme';
    const createdAt = item.createdAt || new Date().toISOString();
    const commentsCount = item.comments?.length || 0;
    
    return (
      <View style={styles.thread}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PostDetail', { postId: item._id })}
          style={styles.threadContent}
          activeOpacity={0.7}
        >
          <View style={styles.threadHeader}>
            <View style={styles.authorContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.authorName}>{userName}</Text>
                <Text style={styles.timeText}>{formatDate(createdAt)}</Text>
              </View>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={16} color={Colors.gray} />
                <Text style={styles.statText}>{commentsCount}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.statItem, styles.likeButton]}
                onPress={() => handleLike(item._id)}
                disabled={isLikingInProgress}
                activeOpacity={0.7}
              >
                {isLikingInProgress ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Ionicons 
                    name={isLiked ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isLiked ? Colors.accent : Colors.gray}
                  />
                )}
                <Text style={[
                  styles.statText, 
                  isLiked && { color: Colors.accent, fontWeight: '600' }
                ]}>
                  {likesCount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.threadTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.threadPreview} numberOfLines={3}>{content}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Ensure threads is always an array before filtering
  const filteredThreads = Array.isArray(threads) ? threads.filter(t => {
    // Vérification de sécurité renforcée
    if (!t || typeof t !== 'object') {
      console.warn('⚠️ Thread invalide dans filtrage:', t);
      return false;
    }

    // Debug : vérifier la structure de chaque thread
    if (Config.DEV.SHOW_API_LOGS && t) {
      console.log('🔍 Thread structure:', { 
        id: t._id, 
        hasTitle: !!t.title, 
        hasContent: !!t.content,
        title: t.title?.substring(0, 30) + '...' || 'Pas de titre'
      });
    }
    
    // Accepter les threads même s'ils n'ont pas de titre ou contenu
    if (!t._id) {
      console.warn('⚠️ Thread sans ID:', t);
      return false;
    }
    
    // Si pas de recherche, inclure tous les threads valides
    if (!search.trim()) return true;
    
    // Filtrer par recherche avec vérifications de sécurité
    const searchLower = search.toLowerCase();
    const title = t.title || '';
    const content = t.content || '';
    
    return title.toLowerCase().includes(searchLower) ||
           content.toLowerCase().includes(searchLower);
  }) : [];

  // Debug supplémentaire
  if (Config.DEV.SHOW_API_LOGS) {
    console.log('📊 Threads stats:', {
      total: threads.length,
      filtered: filteredThreads.length,
      search: search
    });
  }

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'À l\'instant';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.ceil(diffHours / 24);
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return postDate.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement du forum...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>💬</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Forum Communauté</Text>
            <Text style={styles.headerSubtitle}>Échangez avec d'autres parents</Text>
          </View>
        </View>
        
        {error && (
          <View style={styles.statusBanner}>
            <Ionicons name="warning-outline" size={16} color={Colors.warning} />
            <Text style={[styles.statusText, { color: Colors.warning }]}>
              {error}
            </Text>
          </View>
        )}
        
        {Config.DEV.SHOW_API_LOGS && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Threads chargés: {threads.length} | Filtrés: {filteredThreads.length}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            placeholder="Rechercher un sujet..."
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearIcon}>
              <Ionicons name="close-circle" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredThreads}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        onLayout={() => console.log('📱 FlatList layout')}
        onContentSizeChange={(w, h) => console.log('📏 Content size:', w, h)}
        ListHeaderComponent={() => {
          console.log('📝 FlatList header rendered');
          return null;
        }}
        ListEmptyComponent={() => {
          console.log('🚫 Empty component rendered');
          return (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color={Colors.gray} />
              <Text style={styles.emptyText}>
                {search ? 'Aucun sujet trouvé' : 'Aucun sujet pour le moment'}
              </Text>
              <Text style={styles.emptySubtext}>
                {search ? 'Essayez une autre recherche' : 'Soyez le premier à créer un sujet !'}
              </Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewThread')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={Colors.surface} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingTop: Spacing.xl + 20, // SafeArea
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.babyYellow,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  statusText: {
    marginLeft: Spacing.xs,
    ...Typography.bodySmall,
    fontWeight: '500',
  },
  debugContainer: {
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  debugText: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  searchContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  searchInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.surface,
    ...Shadows.xs,
  },
  clearIcon: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1,
    padding: Spacing.xs,
  },
  listContainer: {
    padding: Spacing.lg,
    paddingBottom: 120, // Pour la TabBar
  },
  thread: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  threadContent: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.xs,
  },
  avatarText: {
    color: Colors.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  authorName: {
    ...Typography.label,
    color: Colors.text,
  },
  timeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  statText: {
    marginLeft: Spacing.xs,
    color: Colors.gray,
    fontSize: 12,
  },
  likeButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: 'transparent',
    minWidth: 60,
  },
  fab: {
    position: 'absolute',
    bottom: 100, // Au-dessus de la TabBar
    right: Spacing.lg,
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xxxl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    margin: Spacing.lg,
  },
  emptyText: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
