import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';
import api from '../api/api';
import { registerForPushNotificationsAsync } from '../services/NotificationService';

const AuthContext = createContext({
  // Valeurs par défaut
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (userData, userToken) => {
    try {
      // Nettoyage complet avant la connexion
      await AsyncStorage.multiRemove(['token', 'user']);
      delete api.defaults.headers.common['Authorization'];

      // Définir le nouveau token pour Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      // Sauvegarder les nouvelles données
      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      try {
        await registerForPushNotificationsAsync();
      } catch (notifError) {
        console.warn('Notification registration error:', notifError);
        // Ne pas bloquer la connexion si l'enregistrement des notifications échoue
      }
      
      setUser(userData);
      setToken(userToken);
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }

  };

  const logout = async () => {
    try {
      // Appeler l'API de déconnexion d'abord
      const token = await AsyncStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await api.delete('/logout');
      }

      // Nettoyer localement
      await AsyncStorage.multiRemove(['token', 'user']);
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erreur logout:', error);
      // Nettoyer quand même en cas d'erreur
      await AsyncStorage.multiRemove(['token', 'user']);
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
