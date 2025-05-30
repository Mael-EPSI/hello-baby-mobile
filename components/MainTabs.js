import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius } from '../styles/GlobalStyles';

import ForumScreen from '../screens/ForumScreen';
import ConseilScreen from '../screens/ConseilScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AboutScreen from '../screens/AboutScreen';
import GamificationScreen from '../screens/GamificationScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import PrivateScreen from './PrivateScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <PrivateScreen>
      <Tab.Navigator
        initialRouteName="Forum"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textLight,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopWidth: 0,
            height: 85,
            paddingBottom: Spacing.md,
            paddingTop: Spacing.sm,
            borderTopLeftRadius: BorderRadius.lg,
            borderTopRightRadius: BorderRadius.lg,
            ...Shadows.lg,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: Spacing.xs,
          },
          tabBarIconStyle: {
            marginTop: Spacing.xs,
          },
          tabBarItemStyle: {
            paddingVertical: Spacing.xs,
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;
            if (route.name === 'Forum') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            if (route.name === 'Conseils') iconName = focused ? 'book' : 'book-outline';
            if (route.name === 'Assistant') iconName = focused ? 'bulb' : 'bulb-outline';
            if (route.name === 'Récompenses') iconName = focused ? 'trophy' : 'trophy-outline';
            if (route.name === 'Profil') iconName = focused ? 'person' : 'person-outline';

            return (
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? Colors.primary + '15' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Ionicons name={iconName} size={focused ? 24 : 22} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen 
          name="Forum" 
          component={ForumScreen}
          options={{
            tabBarBadge: null,
          }}
        />
        <Tab.Screen 
          name="Conseils" 
          component={ConseilScreen}
          options={{
            tabBarBadge: null,
          }}
        />
        <Tab.Screen 
          name="Assistant" 
          component={AIAssistantScreen}
          options={{
            tabBarBadge: 'IA',
            tabBarBadgeStyle: {
              backgroundColor: Colors.accent,
              color: Colors.surface,
              fontSize: 10,
              fontWeight: '700',
            },
            headerTitle: '🤖 Assistant Parental IA'
          }}
        />
        <Tab.Screen 
          name="Récompenses" 
          component={GamificationScreen}
          options={{
            tabBarBadge: '🎯',
            headerTitle: '🏆 Récompenses & Défis'
          }}
        />
        <Tab.Screen 
          name="Profil" 
          component={ProfileScreen}
          options={{
            tabBarBadge: null,
          }}
        />
      </Tab.Navigator>
    </PrivateScreen>
  );
}
