import axios from 'axios';

const API_URL = 'https://6b91-88-184-112-195.ngrok-free.app/api/v1';

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
  return api.post('/login', { email, password });
};

export const signup = (email, password, passwordConfirmation) => {
  return api.post('/signup', { user: { email, password, password_confirmation: passwordConfirmation } });
};

export const logout = () => {
  return api.delete('/logout');
};

export const getTeams = () => {
  return api.get('/teams');
};

// Ajoutez d'autres appels API selon vos besoins

export default api;
