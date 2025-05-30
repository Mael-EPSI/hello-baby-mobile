import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Config } from '../config/config';

export default function AccueilScreen() {
  const [checking, setChecking] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      if (token) {
        navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
      } else {
        setChecking(false);
      }
    };
    checkToken();
  }, []);

  if (checking) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A6CF7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonOutlineText}>Créer un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#4A6CF7',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: '#4A6CF7',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonOutlineText: {
    color: '#4A6CF7',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
