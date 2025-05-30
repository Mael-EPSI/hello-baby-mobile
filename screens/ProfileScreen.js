import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../styles/GlobalStyles';
import { buildUrl, Config, MockData } from '../config/config';

export default function ProfileScreen() {
  const [user, setUser] = useState({ name: '', email: '', childDOB: '' });
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      // Si le mode mock est activé, utiliser les données mockées
      if (Config.DEV.USE_MOCK_DATA) {
        console.log('📋 Utilisation du profil mocké');
        setUser(MockData.user);
        return;
      }

      try {
        const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
        const res = await axios.get(buildUrl(Config.API_ENDPOINTS.PROFILE.ME), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
        // Fallback vers les données mockées en cas d'erreur
        if (Config.DEV.AUTO_FALLBACK_TO_MOCK) {
          console.log('📋 Fallback vers le profil mocké');
          setUser(MockData.user);
        } else {
          Alert.alert('Erreur', 'Impossible de charger le profil');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      await axios.patch(buildUrl(Config.API_ENDPOINTS.PROFILE.UPDATE), user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('✅ Profil mis à jour');
    } catch (err) {
      console.log(err);
      Alert.alert('Erreur', 'Impossible de modifier le profil');
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(Config.STORAGE.TOKEN_KEY);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={Fonts.title}>👤 Mon Profil</Text>

      <TextInput
        placeholder="Nom"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        style={Fonts.input}
      />

      <TextInput
        placeholder="Email"
        value={user.email}
        editable={false}
        style={[Fonts.input, { backgroundColor: '#eee' }]}
      />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={Fonts.input}>
        <Text style={{ color: user.childDOB ? Colors.text : Colors.gray }}>
          {user.childDOB ? user.childDOB.split('T')[0] : 'Date naissance bébé'}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={user.childDOB ? new Date(user.childDOB) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              setUser({ ...user, childDOB: selectedDate.toISOString() });
            }
          }}
        />
      )}

      <TouchableOpacity style={Fonts.button} onPress={handleSave}>
        <Text style={Fonts.buttonText}>💾 Sauvegarder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[Fonts.button, styles.logout]} onPress={handleLogout}>
        <Text style={Fonts.buttonText}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  logout: {
    backgroundColor: '#E24E4E',
    marginTop: 12,
  }
});
