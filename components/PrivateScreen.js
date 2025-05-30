import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PrivateScreen({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          return;
        }
        setIsAuth(true);
      } catch (e) {
        console.log('🔐 Error checking token:', e);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#f06292" />
      </View>
    );
  }

  return isAuth ? children : null;
}
