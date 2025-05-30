import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
  TextInput,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../styles/GlobalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      // Simuler le chargement des données
      const mockProducts = [
        {
          id: 1,
          name: 'Poussette 3-en-1 Premium',
          price: '399€',
          originalPrice: '599€',
          discount: '33%',
          rating: 4.8,
          reviews: 245,
          image: '🛒',
          category: 'transport',
          description: 'Poussette évolutive de la naissance à 4 ans',
          affiliate: true,
          url: 'https://example.com/poussette'
        },
        {
          id: 2,
          name: 'Siège Auto Groupe 0+/1',
          price: '249€',
          originalPrice: '329€',
          discount: '24%',
          rating: 4.6,
          reviews: 189,
          image: '🚗',
          category: 'transport',
          description: 'Sécurité maximale de 0 à 4 ans',
          affiliate: true,
          url: 'https://example.com/siege-auto'
        },
        {
          id: 3,
          name: 'Kit Alimentation Bébé',
          price: '45€',
          originalPrice: '65€',
          discount: '31%',
          rating: 4.7,
          reviews: 156,
          image: '🍼',
          category: 'alimentation',
          description: 'Set complet pour la diversification',
          affiliate: true,
          url: 'https://example.com/kit-alimentation'
        },
        {
          id: 4,
          name: 'Moniteur Bébé Connecté',
          price: '199€',
          originalPrice: '289€',
          discount: '31%',
          rating: 4.5,
          reviews: 203,
          image: '📱',
          category: 'tech',
          description: 'Surveillance intelligente jour et nuit',
          affiliate: true,
          url: 'https://example.com/moniteur'
        }
      ];

      const mockServices = [
        {
          id: 1,
          name: 'Baby-sitting à domicile',
          price: 'À partir de 12€/h',
          rating: 4.9,
          reviews: 127,
          image: '👶',
          category: 'garde',
          description: 'Garde d\'enfants qualifiée et vérifiée',
          location: 'Paris et région',
          available: true
        },
        {
          id: 2,
          name: 'Cours de Portage',
          price: '60€/séance',
          rating: 4.8,
          reviews: 89,
          image: '🤱',
          category: 'formation',
          description: 'Apprenez les techniques de portage',
          location: 'À domicile ou en atelier',
          available: true
        },
        {
          id: 3,
          name: 'Consultation Lactation',
          price: '80€/consultation',
          rating: 4.9,
          reviews: 156,
          image: '🤱',
          category: 'sante',
          description: 'Conseillère en lactation certifiée',
          location: 'Téléconsultation disponible',
          available: true
        },
        {
          id: 4,
          name: 'Ménage Post-Accouchement',
          price: '25€/h',
          rating: 4.7,
          reviews: 94,
          image: '🏠',
          category: 'aide',
          description: 'Aide ménagère spécialisée jeunes parents',
          location: 'Service à domicile',
          available: false
        }
      ];

      setProducts(mockProducts);
      setServices(mockServices);
    } catch (error) {
      console.log('Erreur chargement marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Tout', icon: 'apps' },
    { id: 'transport', name: 'Transport', icon: 'car' },
    { id: 'alimentation', name: 'Repas', icon: 'restaurant' },
    { id: 'tech', name: 'Tech', icon: 'phone-portrait' },
    { id: 'garde', name: 'Garde', icon: 'people' },
    { id: 'formation', name: 'Formation', icon: 'school' },
    { id: 'sante', name: 'Santé', icon: 'medical' },
  ];

  const filteredProducts = products.filter(product => 
    (selectedCategory === 'all' || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredServices = services.filter(service => 
    (selectedCategory === 'all' || service.category === selectedCategory) &&
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleProductPress = (product) => {
    Alert.alert(
      product.name,
      `${product.description}\n\nPrix: ${product.price}\nNote: ${product.rating}/5 (${product.reviews} avis)`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Voir le produit', 
          onPress: () => {
            if (product.affiliate && product.url) {
              Linking.openURL(product.url);
            }
          }
        }
      ]
    );
  };

  const handleServicePress = (service) => {
    Alert.alert(
      service.name,
      `${service.description}\n\nPrix: ${service.price}\nZone: ${service.location}\nNote: ${service.rating}/5 (${service.reviews} avis)`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: service.available ? 'Contacter' : 'Liste d\'attente',
          onPress: () => {
            Alert.alert('Contact', 'Fonctionnalité en développement');
          }
        }
      ]
    );
  };

  const renderCategory = (category) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons 
        name={category.icon} 
        size={20} 
        color={selectedCategory === category.id ? Colors.surface : Colors.primary} 
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.id && styles.categoryButtonTextActive
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = (product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.productImageContainer}>
        <Text style={styles.productImage}>{product.image}</Text>
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={1}>
          {product.description}
        </Text>
        
        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color={Colors.warning} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviews})</Text>
        </View>
        
        <View style={styles.productPricing}>
          <Text style={styles.currentPrice}>{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>{product.originalPrice}</Text>
          )}
        </View>
        
        {product.affiliate && (
          <View style={styles.affiliateTag}>
            <Ionicons name="link" size={12} color={Colors.primary} />
            <Text style={styles.affiliateText}>Lien partenaire</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderService = (service) => (
    <TouchableOpacity
      key={service.id}
      style={[styles.serviceCard, !service.available && styles.serviceUnavailable]}
      onPress={() => handleServicePress(service)}
    >
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceImage}>{service.image}</Text>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
          <Text style={styles.servicePrice}>{service.price}</Text>
          <Text style={styles.serviceLocation} numberOfLines={1}>{service.location}</Text>
        </View>
        <View style={styles.serviceRating}>
          <Ionicons name="star" size={14} color={Colors.warning} />
          <Text style={styles.ratingText}>{service.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.serviceDescription} numberOfLines={2}>
        {service.description}
      </Text>
      
      <View style={styles.serviceFooter}>
        <Text style={styles.serviceReviews}>{service.reviews} avis</Text>
        <View style={[
          styles.availabilityBadge,
          service.available ? styles.availableBadge : styles.unavailableBadge
        ]}>
          <Text style={[
            styles.availabilityText,
            service.available ? styles.availableText : styles.unavailableText
          ]}>
            {service.available ? 'Disponible' : 'Complet'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement de la marketplace...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛍️ Marketplace</Text>
        <Text style={styles.headerSubtitle}>Produits et services pour parents</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher produits ou services..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategory)}
      </ScrollView>

      {/* Products Section */}
      {filteredProducts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Produits Recommandés</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {filteredProducts.map(renderProduct)}
          </ScrollView>
        </View>
      )}

      {/* Services Section */}
      {filteredServices.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤝 Services Locaux</Text>
          {filteredServices.map(renderService)}
        </View>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && filteredServices.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="storefront-outline" size={64} color={Colors.gray} />
          <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
          <Text style={styles.emptySubtext}>Essayez une autre recherche ou catégorie</Text>
        </View>
      )}

      {/* Affiliate Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Ionicons name="information-circle" size={16} color={Colors.gray} />
        <Text style={styles.disclaimerText}>
          Certains liens sont des liens d'affiliation. Hello Baby peut recevoir une commission.
        </Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.surface,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.surface,
    textAlign: 'center',
    marginTop: Spacing.xs,
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingLeft: Spacing.lg,
  },
  categoriesContent: {
    paddingRight: Spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    marginLeft: Spacing.xs,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryButtonTextActive: {
    color: Colors.surface,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  productsContainer: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
  },
  productCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    width: 180,
    ...Shadows.sm,
  },
  productImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  productImage: {
    fontSize: 40,
  },
  discountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
  },
  discountText: {
    color: Colors.surface,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  productDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: Spacing.xs,
  },
  productPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.gray,
    textDecorationLine: 'line-through',
    marginLeft: Spacing.sm,
  },
  affiliateTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  affiliateText: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  serviceUnavailable: {
    opacity: 0.7,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  serviceImage: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  servicePrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  serviceLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceReviews: {
    fontSize: 12,
    color: Colors.gray,
  },
  availabilityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  availableBadge: {
    backgroundColor: Colors.success + '20',
  },
  unavailableBadge: {
    backgroundColor: Colors.error + '20',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: Colors.success,
  },
  unavailableText: {
    color: Colors.error,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.gray,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.lightGray,
    padding: Spacing.md,
    margin: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.gray,
    marginLeft: Spacing.sm,
    lineHeight: 16,
    flex: 1,
  },
});
