import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { Colors, Fonts, Spacing, BorderRadius, Typography, Shadows } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Config } from '../config/config';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function GamificationScreen() {
  const [userStats, setUserStats] = useState({
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    weeklyGoal: 0,
    monthlyGoal: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    loadGamificationData();
    animateProgress();
  }, []);

  const loadGamificationData = async () => {
    try {
      // Simuler le chargement des données de gamification
      const mockData = {
        points: 1250,
        level: 3,
        badges: ['first_post', 'week_streak', 'helpful_parent'],
        streak: 7,
        weeklyGoal: 85,
        monthlyGoal: 60,
        achievements: [
          {
            id: 1,
            title: '🎉 Premier Post',
            description: 'Votre premier post sur le forum',
            points: 50,
            unlocked: true,
            date: '2024-01-15'
          },
          {
            id: 2,
            title: '🔥 Série de 7 jours',
            description: 'Connexion pendant 7 jours consécutifs',
            points: 100,
            unlocked: true,
            date: '2024-01-20'
          },
          {
            id: 3,
            title: '💖 Parent Aidant',
            description: '10 réponses utiles dans le forum',
            points: 150,
            unlocked: true,
            date: '2024-01-25'
          },
          {
            id: 4,
            title: '📚 Lecteur Assidu',
            description: 'Lire 50 conseils',
            points: 200,
            unlocked: false,
            progress: 32
          },
          {
            id: 5,
            title: '🌟 Expert Parental',
            description: 'Atteindre le niveau 5',
            points: 500,
            unlocked: false,
            progress: 60
          }
        ]
      };
      
      setUserStats(mockData);
      setAchievements(mockData.achievements);
    } catch (error) {
      console.log('Erreur chargement gamification:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const calculateLevelProgress = () => {
    const pointsForCurrentLevel = (userStats.level - 1) * 500;
    const pointsForNextLevel = userStats.level * 500;
    const progress = (userStats.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel);
    return Math.max(0, Math.min(1, progress));
  };

  const renderBadge = (badgeId) => {
    const badges = {
      first_post: { icon: '🎉', name: 'Premier Post' },
      week_streak: { icon: '🔥', name: 'Série 7 jours' },
      helpful_parent: { icon: '💖', name: 'Parent Aidant' },
    };
    
    const badge = badges[badgeId];
    if (!badge) return null;
    
    return (
      <View key={badgeId} style={styles.badge}>
        <Text style={styles.badgeIcon}>{badge.icon}</Text>
        <Text style={styles.badgeName}>{badge.name}</Text>
      </View>
    );
  };

  const renderAchievement = (achievement) => (
    <TouchableOpacity 
      key={achievement.id} 
      style={[styles.achievementCard, !achievement.unlocked && styles.achievementLocked]}
      onPress={() => achievement.unlocked && Alert.alert(achievement.title, achievement.description)}
    >
      <View style={styles.achievementHeader}>
        <Text style={[styles.achievementTitle, !achievement.unlocked && styles.textMuted]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementPoints, !achievement.unlocked && styles.textMuted]}>
          +{achievement.points} pts
        </Text>
      </View>
      
      <Text style={[styles.achievementDescription, !achievement.unlocked && styles.textMuted]}>
        {achievement.description}
      </Text>
      
      {achievement.unlocked ? (
        <View style={styles.achievementUnlocked}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
          <Text style={styles.achievementDate}>
            Débloqué le {new Date(achievement.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      ) : (
        <View style={styles.achievementProgress}>
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${achievement.progress || 0}%`]
                  })
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress || 0}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleQuickAction = (action) => {
    switch (action) {
      case 'create_post':
        navigation.navigate('NewThread');
        break;
      case 'help_parent':
        navigation.navigate('Forum');
        break;
      case 'read_advice':
        navigation.navigate('Conseils');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement de vos récompenses...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec niveau et points */}
      <View style={styles.header}>
        <View style={styles.levelContainer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{userStats.level}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Niveau {userStats.level}</Text>
            <Text style={styles.pointsText}>{userStats.points} points</Text>
          </View>
        </View>

        {/* Barre de progression vers le niveau suivant */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Progression vers le niveau {userStats.level + 1}</Text>
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${calculateLevelProgress() * 100}%`]
                  })
                }
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(calculateLevelProgress() * 100)}%
          </Text>
        </View>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color={Colors.accent} />
          <Text style={styles.statNumber}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>Jours consécutifs</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color={Colors.primary} />
          <Text style={styles.statNumber}>{userStats.weeklyGoal}%</Text>
          <Text style={styles.statLabel}>Objectif semaine</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color={Colors.warning} />
          <Text style={styles.statNumber}>{userStats.badges.length}</Text>
          <Text style={styles.statLabel}>Badges obtenus</Text>
        </View>
      </View>

      {/* Badges obtenus */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Vos Badges</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesContainer}>
          {userStats.badges.map(renderBadge)}
          {/* Badge placeholder pour encourager */}
          <TouchableOpacity style={[styles.badge, styles.badgePlaceholder]}>
            <Ionicons name="add" size={20} color={Colors.gray} />
            <Text style={styles.badgeNamePlaceholder}>Prochain badge</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Défis et Récompenses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Défis & Récompenses</Text>
        {achievements.map(renderAchievement)}
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Actions Rapides</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleQuickAction('create_post')}
        >
          <Ionicons name="create" size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Créer un post (+20 pts)</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleQuickAction('help_parent')}
        >
          <Ionicons name="heart" size={20} color={Colors.accent} />
          <Text style={styles.actionText}>Aider un parent (+10 pts)</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleQuickAction('read_advice')}
        >
          <Ionicons name="book" size={20} color={Colors.warning} />
          <Text style={styles.actionText}>Lire des conseils (+5 pts)</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
        </TouchableOpacity>

        {/* Leaderboard */}
        <TouchableOpacity style={[styles.actionButton, styles.specialAction]}>
          <Ionicons name="podium" size={20} color={Colors.warning} />
          <Text style={styles.actionText}>Voir le classement 🏆</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.gray} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.surface,
  },
  pointsText: {
    fontSize: 16,
    color: Colors.surface,
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: Spacing.md,
  },
  progressLabel: {
    color: Colors.surface,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  progressPercentage: {
    color: Colors.surface,
    fontSize: 12,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    ...Shadows.sm,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  badgesContainer: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginRight: Spacing.md,
    minWidth: 80,
    ...Shadows.sm,
  },
  badgePlaceholder: {
    backgroundColor: Colors.lightGray,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  badgeName: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.text,
  },
  badgeNamePlaceholder: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.gray,
  },
  achievementCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  achievementLocked: {
    backgroundColor: Colors.lightGray,
    opacity: 0.7,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  achievementPoints: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  textMuted: {
    color: Colors.gray,
  },
  achievementUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    minWidth: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  specialAction: {
    backgroundColor: '#FFF3E0', // Couleur dorée légère
    borderWidth: 1,
    borderColor: Colors.warning,
  },
});
