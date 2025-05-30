import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../styles/GlobalStyles';
import { buildUrl, Config } from '../config/config';

export default function NewThreadScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert('Champs manquants', 'Merci de remplir tous les champs');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync(Config.STORAGE.TOKEN_KEY);
      await axios.post(
        buildUrl(Config.API_ENDPOINTS.FORUM.BASE),
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigation.goBack();
    } catch (err) {
      console.log('❌ Erreur création post', err);
      Alert.alert('Erreur', 'Impossible de créer la publication');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={Fonts.title}>Nouveau post</Text>

      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        style={Fonts.input}
      />

      <TextInput
        placeholder="Contenu"
        value={content}
        onChangeText={setContent}
        style={[Fonts.input, { height: 120 }]}
        multiline
      />

      <TouchableOpacity style={Fonts.button} onPress={handleSubmit}>
        <Text style={Fonts.buttonText}>Publier</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: Colors.background },
});
