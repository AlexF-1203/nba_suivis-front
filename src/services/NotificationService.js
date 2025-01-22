import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import api from '../api/api';

export const registerForPushNotificationsAsync = async () => {
  let token;

  if (!Device.isDevice) {
    alert('Les notifications push nécessitent un appareil physique');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Impossible d\'obtenir la permission pour les notifications push!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra?.eas?.projectId,
    })).data;

    // Enregistrer le token sur le serveur
    await api.post('/device_tokens', {
      device_token: {
        token: token,
        platform: Platform.OS,
        active: true
      }
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des notifications:', error);
    throw error;
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
