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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
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

  // Modification ici pour garantir la méthode de login
  const login = async (userData, userToken) => {
    try {
      // Vérifiez que le token et les données utilisateur ne sont pas undefined
      if (!userToken || !userData) {
        throw new Error('Token ou données utilisateur manquants');
      }

      // Stocker les données de manière atomique
      await Promise.all([
        AsyncStorage.setItem('token', userToken || ''),
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
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données d\'auth:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      setAuthToken(null);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  // Retournez un composant de chargement ou null pendant le chargement initial
  if (loading) {
    return null; // Ou un composant de chargement personnalisé
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
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
