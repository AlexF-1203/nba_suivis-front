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
        console.log('Loading stored token:', storedToken);

        if (storedToken) {
          const storedUser = await AsyncStorage.getItem('user');
          console.log('Loading stored user:', storedUser);

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          }
        }
      } catch (error) {
        console.error('Auth loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);
  
  const login = async (userData, userToken) => {
    try {
      // Nettoyons d'abord
      await AsyncStorage.multiRemove(['token', 'user']);
      delete api.defaults.headers.common['Authorization'];

      // Puis configurons le nouveau token
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      // Sauvegardons les nouvelles données
      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setToken(userToken);
    } catch (error) {
      console.error('Erreur login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      delete api.defaults.headers.common['Authorization'];
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
