import { useAuth } from './src/context/AuthContext';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { setupNotificationListener } from './src/services/NotificationService';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import Constants from 'expo-constants';

import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Home from "./src/screens/Home";
import Profile from './src/screens/Profile.jsx';
import GameStats from './src/screens/GameStats';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: "stats-balls.firebaseapp.com",
  projectId: "stats-balls",
  storageBucket: "stats-balls.appspot.com",
  messagingSenderId: "816198453182",
  appId: Constants.expoConfig?.extra?.firebaseAppId
};

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
 handleNotification: async () => ({
   shouldShowAlert: true,
   shouldPlaySound: true,
   shouldSetBadge: true,
 }),
});

function NotificationHandler() {
 const navigation = useNavigation();

 useEffect(() => {
   return setupNotificationListener(navigation);
 }, [navigation]);

 return null;
}

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
       headerStyle: {
         backgroundColor: '#1a1a1a',
         elevation: 0,
         shadowOpacity: 0,
         borderBottomWidth: 0,
       },
       headerTintColor: '#ffffff',
       headerShown: true,
       headerTitleStyle: {
         fontWeight: 'bold',
       },
       headerShadowVisible: false,
     }}
   >
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

function AppContent() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!app) {
      console.error('Firebase not initialized');
    }
  }, []);

  return (
    <NavigationContainer>
      <NotificationHandler />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        ) : (
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        )}
        <Stack.Screen name="GameStats" component={GameStats} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
 return (
   <>
     <StatusBar style="light" backgroundColor="#000000" />
     <AuthProvider>
       <AppContent />
     </AuthProvider>
   </>
 );
}
