import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 🔓 PUBLIC
import SplashScreen from './screens/SplashScreen';
import AccueilScreen from './screens/AccueilScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// 🔐 PRIVÉ
import NewThreadScreen from './screens/NewThreadScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import MainTabs from './components/MainTabs'; // Forum, Profil, Conseils

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        
        {/* 🔄 Splash loader */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* 🔓 Public */}
        <Stack.Screen name="Accueil" component={AccueilScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* 🔐 Onglets : Forum / Profil / Conseils */}
        <Stack.Screen
          name="HomeTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* 🔐 Navigation interne */}
        <Stack.Screen name="NewThread" component={NewThreadScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
