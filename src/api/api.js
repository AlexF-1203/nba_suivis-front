import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://a719-88-184-112-195.ngrok-free.app/api/v1';

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

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      user: { email, password }
    });
    return response;
  } catch (error) {
    console.error('API Login Error:', error.response?.data || error.message);
    throw error;
  }
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

export const logout = async () => {
  try {
    const response = await api.delete('/logout');
    return response;
  } catch (error) {
    console.error('API Logout Error:', error.response?.data || error.message);
    throw error;
  }
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

api.interceptors.request.use(request => {
  console.log('Request:', {
    url: request.url,
    method: request.method,
    headers: request.headers,
    data: request.data
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.log('Response Error:', {
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Ajoutez d'autres appels API selon vos besoins

export default api;
