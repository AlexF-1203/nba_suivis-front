// src/services/NotificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import api from '../api/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Les notifications sont nécessaires pour recevoir les mises à jour des matchs.');
      return;
    }

    try {
      const response = await Notifications.getExpoPushTokenAsync({
        projectId: '9673f0c9-f3bb-4c72-b5c2-7f0ba28a2e07' // Votre Expo project ID
      });
      token = response.data;

      // Enregistrer le token
      await api.post('/api/v1/device_tokens', {
        device_token: {
          token: token,
          platform: Platform.OS
        }
      });
      console.log("Token de notification enregistré :", token);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token:', error);
    }
  }

  return token;
}
