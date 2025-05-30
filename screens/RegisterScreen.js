import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../styles/GlobalStyles';
import { buildUrl, Config } from '../config/config';

export default function RegisterScreen() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    childDOB: ''
  });
  const [showPicker, setShowPicker] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const res = await axios.post(buildUrl(Config.API_ENDPOINTS.AUTH.REGISTER), user);
      const token = res.data.token;
      await SecureStore.setItemAsync(Config.STORAGE.TOKEN_KEY, token);
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    } catch (err) {
      console.log(err);
      Alert.alert('Erreur', 'Inscription impossible');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={Fonts.title}>Créer un compte</Text>

      <TextInput
        placeholder="Nom"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        style={Fonts.input}
      />

      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
        keyboardType="email-address"
        style={Fonts.input}
      />

      <TextInput
        placeholder="Mot de passe"
        value={user.password}
        onChangeText={(text) => setUser({ ...user, password: text })}
        secureTextEntry
        style={Fonts.input}
      />

      <TouchableOpacity onPress={() => setShowPicker(true)} style={Fonts.input}>
        <Text style={{ color: user.childDOB ? Colors.text : Colors.gray }}>
          {user.childDOB ? user.childDOB.split('T')[0] : 'Date de naissance du bébé'}
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

      <TouchableOpacity style={Fonts.button} onPress={handleRegister}>
        <Text style={Fonts.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
