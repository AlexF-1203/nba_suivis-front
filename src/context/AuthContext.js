import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';
import api from '../api/api';
import { registerForPushNotificationsAsync } from '../services/NotificationService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier le token stocké au démarrage
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'auth:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (userData, userToken) => {
    try {
      // Stocker les données de manière atomique
      await Promise.all([
        AsyncStorage.setItem('token', userToken),
        AsyncStorage.setItem('user', JSON.stringify(userData))
      ]);

      // Mettre à jour l'état
      setAuthToken(userToken);
      setUser(userData);
      setToken(userToken);

      // Enregistrer les notifications (avec gestion d'erreur)
      try {
        await registerForPushNotificationsAsync();
      } catch (notifError) {
        console.warn('Erreur lors de l\'enregistrement des notifications:', notifError);
        // Ne pas bloquer la connexion si les notifications échouent
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données d\'auth:', error);
      throw error; // Relancer l'erreur pour permettre une gestion côté appelant
    }
  };
  const logout = async () => {
    try {
      await api.logout();
      await AsyncStorage.multiRemove(['token', 'user']);
      setAuthToken(null);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  if (loading) {
    return null; // Ou un composant de chargement
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
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
