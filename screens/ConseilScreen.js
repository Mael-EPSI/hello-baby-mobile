import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { buildUrl, Config, MockData } from '../config/config';

// Couleurs et styles locaux pour éviter les conflits
const conseilColors = {
  primary: '#6366F1',
  accent: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  gray: '#6B7280',
  babyPink: '#FDF2F8',
  babyBlue: '#EFF6FF',
  babyYellow: '#FFFBEB',
  babyGreen: '#F0FDF4',
};

const conseilSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const conseilBorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
};

export default function ConseilScreen() {
  const [conseils, setConseils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous', icon: 'apps', color: conseilColors.primary },
    { id: 'sommeil', name: 'Sommeil', icon: 'moon', color: conseilColors.babyBlue },
        console.log('✅ Conseils reçus:', res.data.length, 'conseils');
        setConseils(res.data);
      } else {
        console.warn('API returned non-array data:', typeof res.data);
        throw new Error('INVALID_DATA');
      }
    } catch (err) {
      console.log('❌ Erreur chargement conseils', err.message);
      
      // Fallback automatique vers les données mockées
      if (Config.DEV.AUTO_FALLBACK_TO_MOCK) {
        console.log('📋 Fallback automatique vers les données mockées pour les conseils');
        setConseils(MockData.conseils);
        setError('Mode démonstration - Serveur indisponible');
      } else {
        setError('Impossible de charger les conseils');
        setConseils([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConseils();
  };

  // Ensure conseils is always an array before filtering
  const filtered = Array.isArray(conseils) ? conseils.filter(c =>
    c && c.title && c.content &&
    (c.title.toLowerCase().includes(search.toLowerCase()) ||
     c.content.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      {item.ageRange && (
        <Text style={styles.ageRange}>👶 {item.ageRange}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement des conseils...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {error && (
        <View style={styles.statusBanner}>
          <Ionicons 
            name={error.includes('démonstration') ? 'eye-outline' : 'warning-outline'} 
            size={16} 
            color={error.includes('démonstration') ? Colors.primary : Colors.warning} 
          />
          <Text style={[styles.statusText, { 
            color: error.includes('démonstration') ? Colors.primary : Colors.warning 
          }]}
          >
            {error}
          </Text>
        </View>
      )}

      <TextInput
        placeholder="🔍 Rechercher un conseil..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={Colors.gray} />
            <Text style={styles.emptyText}>
              {search ? 'Aucun conseil trouvé' : 'Aucun conseil disponible'}
            </Text>
            <Text style={styles.emptySubtext}>
              {search ? 'Essayez une autre recherche' : 'Les conseils seront bientôt disponibles !'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 12,
    borderRadius: 10,
    margin: 12,
    fontSize: 16
  },
  card: {
    backgroundColor: Colors.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  ageRange: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
