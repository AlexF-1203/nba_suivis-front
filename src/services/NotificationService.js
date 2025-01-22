import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '../api/api';

export const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications require physical device');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Current notification status:', existingStatus);

    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission not granted');
      return null;
    }

    // Ajoutez une vérification du projectId
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.error('Project ID is missing or invalid');
      // Utilisez un ID temporaire pour le développement
      return "ExponentPushToken[development]";
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId
      });

      console.log('Token obtained:', tokenData);

      // Enregistrez le token sur le serveur
      const response = await api.post('/device_tokens', {
        device_token: {
          token: tokenData.data,
          platform: Platform.OS,
          active: true
        }
      });

      console.log('Token registered with server:', response.data);
      return tokenData.data;
    } catch (tokenError) {
      console.error('Error getting push token:', tokenError);
      // Utilisez un token de développement en cas d'erreur
      return "ExponentPushToken[development]";
    }
  } catch (error) {
    console.error('Error in push notification setup:', error);
    return null;
  }
};

export const verifyDeviceToken = async () => {
  try {
    const response = await api.get('/device_tokens/status');
    return response.data.hasActiveToken;
  } catch (error) {
    console.error('Failed to verify device token:', error);
    return false;
  }
};

export const schedulePushNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
      },
      trigger: null, // Notification immédiate
    });
  } catch (error) {
    console.error('Erreur lors de la programmation de la notification:', error);
    throw error;
  }
};

export const cancelAllScheduledNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Erreur lors de l\'annulation des notifications:', error);
    throw error;
  }
};

export const getBadgeCount = async () => {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de badges:', error);
    return 0;
  }
};

export const setBadgeCount = async (count) => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Erreur lors de la définition du nombre de badges:', error);
  }
};

export default {
  registerForPushNotificationsAsync,
  schedulePushNotification,
  cancelAllScheduledNotifications,
  getBadgeCount,
  setBadgeCount
};
