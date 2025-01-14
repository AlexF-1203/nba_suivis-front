import axios from 'axios';

export const API_URL = 'https://d114-88-184-112-195.ngrok-free.app/api/v1';

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
  return api.delete('/logout');
};

export const getTeams = () => {
  return api.get('/teams');
};

// Ajoutez d'autres appels API selon vos besoins

export default api;
