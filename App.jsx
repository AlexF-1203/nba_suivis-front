import React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { useAuth } from './src/context/AuthContext';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Home from "./src/screens/Home";
import Favorites from './src/screens/Favorites';
import Profile from './src/screens/Profile.jsx';
import GameStats from './src/screens/GameStats';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#1a1a1a',
        borderTopColor: '#3a3a3a',
        height: 60,
        paddingBottom: 8,
      },
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#9e9e9e',
      // Configuration du header
      headerStyle: {
        backgroundColor: '#1a1a1a',
        elevation: 0, // Pour Android
        shadowOpacity: 0, // Pour iOS
        borderBottomWidth: 0,
      },
      headerTintColor: '#ffffff',
      headerShown: true,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerShadowVisible: false ,// Supprime la ligne de séparation du header
    }}
  >
      {/* <Tab.Screen
        name="Favoris"
        component={Favorites}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Game Day"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    // Gestion des notifications quand l'app est en premier plan
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue:', notification);
    });

    // Gestion des notifications quand on clique dessus
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification cliquée:', response);
      const gameId = response.notification.request.content.data.game_id;
      if (gameId) {
        // Navigation vers les stats du match
        navigation.navigate('GameStats', { gameId });
      }
    });

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);


  return (
    <>
      <StatusBar style="light" backgroundColor="#000000" />
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainApp" component={TabNavigator} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="GameStats" component={GameStats} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}
