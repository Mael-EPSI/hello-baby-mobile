import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius, Typography } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import { getEndpoint, Config } from '../config/config';

export default function PostDetailScreen() {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likingPost, setLikingPost] = useState(false);
  const route = useRoute();
  const { postId } = route.params;

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await axios.get(getEndpoint.forumDetail(postId), { headers });
      setPost(res.data);
    } catch (err) {
      console.log('❌ Erreur chargement post', err.message);
      Alert.alert('Erreur', 'Impossible de charger le post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (likingPost) return;
      
      setLikingPost(true);
      
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      if (!token) {
        Alert.alert('Connexion requise', 'Vous devez être connecté pour liker ce post');
        return;
      }

      const response = await axios.post(
        getEndpoint.forumLike(postId),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: Config.APP.TIMEOUT,
        }
      );

      // Mettre à jour le post avec les nouveaux likes
      setPost(prevPost => ({
        ...prevPost,
        likes: response.data.likes,
        isLiked: response.data.isLiked
      }));

      console.log('✅ Like/Unlike successful:', response.data);
    } catch (err) {
      console.log('❌ Erreur like:', err.message);
      Alert.alert('Erreur', 'Impossible de liker ce post');
    } finally {
      setLikingPost(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    if (submitting) return;

    try {
      setSubmitting(true);
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      
      if (!token) {
        Alert.alert('Connexion requise', 'Vous devez être connecté pour commenter');
        return;
      }

      await axios.post(
        getEndpoint.forumComment(postId),
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComment('');
      fetchPost(); // Recharger le post avec les nouveaux commentaires
    } catch (err) {
      console.log('❌ Erreur ajout commentaire', err);
      Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement du post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.centered}>
        <Ionicons name="document-outline" size={64} color={Colors.gray} />
        <Text style={styles.errorText}>Post introuvable</Text>
      </View>
    );
  }

  const isLiked = post.isLiked || false;
  const likesCount = post.likes?.length || 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Post principal */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.authorContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {post.user?.name?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.user?.name || 'Anonyme'}</Text>
                <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Actions Like et Stats */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.likeButton, isLiked && styles.likeButtonActive]}
              onPress={handleLike}
              disabled={likingPost}
              activeOpacity={0.7}
            >
              {likingPost ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={isLiked ? Colors.surface : Colors.primary}
                />
              )}
              <Text style={[
                styles.likeButtonText,
                isLiked && styles.likeButtonTextActive
              ]}>
                {likesCount} {likesCount <= 1 ? 'Like' : 'Likes'}
              </Text>
            </TouchableOpacity>

            <View style={styles.commentCount}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.gray} />
              <Text style={styles.commentCountText}>
                {post.comments?.length || 0} commentaire{(post.comments?.length || 0) !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Commentaires */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>
            💬 Commentaires ({post.comments?.length || 0})
          </Text>
          
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <View key={index} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.commentAuthor}>{comment.user?.name || 'Anonyme'}</Text>
                    <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                  </View>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noComments}>
              <Text style={styles.noCommentsText}>Aucun commentaire pour le moment</Text>
              <Text style={styles.noCommentsSubtext}>Soyez le premier à commenter !</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Zone de commentaire */}
      <View style={styles.commentInputContainer}>
        <TextInput
          placeholder="Écrivez un commentaire..."
          value={comment}
          onChangeText={setComment}
          style={styles.commentInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!comment.trim() || submitting) && styles.sendButtonDisabled]}
          onPress={handleComment}
          disabled={!comment.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.surface} />
          ) : (
            <Ionicons name="send" size={20} color={Colors.surface} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 6, color: '#4A6CF7' },
  meta: { fontSize: 14, color: '#777', marginBottom: 16 },
  content: { fontSize: 16, marginBottom: 30 },
  section: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, color: '#4A6CF7' },
  comment: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  commentAuthor: { fontWeight: 'bold', color: '#333' },
  inputRow: {
    flexDirection: 'row',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16
  },
  sendButton: {
    backgroundColor: '#4A6CF7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  // Styles supplémentaires pour la nouvelle mise en page
  scrollView: {
    flex: 1,
  },
  postContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    color: Colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
  authorInfo: {
    flexDirection: 'column',
  },
  authorName: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  postDate: {
    color: Colors.gray,
    fontSize: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
    color: Colors.primary,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 100,
    justifyContent: 'center',
  },
  likeButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  likeButtonText: {
    marginLeft: Spacing.sm,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  likeButtonTextActive: {
    color: Colors.surface,
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCountText: {
    marginLeft: Spacing.sm,
    color: Colors.gray,
    fontSize: 14,
  },
  commentsSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    elevation: 2,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    color: Colors.primary,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginRight: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  noCommentsText: {
    color: Colors.gray,
    fontSize: 16,
  },
  noCommentsSubtext: {
    color: Colors.gray,
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  errorText: {
    color: Colors.red,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.text,
  },
});
