import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Image, Text, Animated } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography, Spacing } from '../styles/GlobalStyles';
import { Config } from '../config/config';

export default function SplashScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
        
        setTimeout(() => {
          if (token) {
            navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'Accueil' }] });
          }
        }, Config.ANIMATIONS.SPLASH_DURATION);
      } catch (error) {
        console.log('Error checking token:', error);
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'Accueil' }] });
        }, Config.ANIMATIONS.SPLASH_DURATION);
      }
    };
    
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={styles.appName}>Hello Baby</Text>
          <Text style={styles.tagline}>Votre compagnon parentalité</Text>
        </Animated.View>
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: Spacing.lg,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: Spacing.xxl * 2,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
