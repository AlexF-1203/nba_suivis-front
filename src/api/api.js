import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://1d19-88-184-112-195.ngrok-free.app/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
  
export const login = (email, password) => {
  const data = { user: { email, password } };
  console.log('Login data being sent:', data);
  return api.post('/login', data);
};

export const signup = (email, password, passwordConfirmation, username) => {
  return api.post('/signup', {
    user: {
      email,
      password,
      password_confirmation: passwordConfirmation,
      username
    }
  });
};

export const logout = () => {
  return api.delete('/logout', {
    headers: {
      'Authorization': `Bearer ${api.defaults.headers.common['Authorization']}`
    }
  });
};

export const getTeams = () => {
  return api.get('/teams');
};

export const getFavoriteTeams = () => {
  return api.get('/favorite_teams');
};

export const addFavoriteTeam = (teamId) => {
  return api.post('/favorite_teams', { team_id: teamId });
};

export const removeFavoriteTeam = (teamId) => {
  return api.delete(`/favorite_teams/${teamId}`);
};

export const getFavoritePlayers = () => {
  return api.get('/favorite_players');
};

export const addFavoritePlayer = (playerId) => {
  return api.post('/favorite_players', { player_id: playerId });
};

export const removeFavoritePlayer = (playerId) => {
  return api.delete(`/favorite_players/${playerId}`);
};

export const getGames = (date) => {
  return api.get('/games', {
    params: { date: date }
  });
};

export const getAvailableDates = () => {
  return api.get('/games/available_dates');
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      try {
        await AsyncStorage.multiRemove(['token', 'user']);
        // Vérifiez que 'navigation' est disponible
        if (navigation) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (storageError) {
        console.error('Erreur lors de la suppression des données de connexion:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(config => {
  console.log('Request headers:', config.headers);
  return config;
});

// Ajoutez d'autres appels API selon vos besoins

export default api;
