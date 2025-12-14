import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // Alterado fallback para 8080
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: Adiciona o Token em TUDO que sai
api.interceptors.request.use(
  (config) => {
    // Recupera o token salvo no localStorage (vamos persistir ele lá no AuthContext)
    const storedAuth = localStorage.getItem('psicare_auth_v2');
    if (storedAuth) {
      const { token } = JSON.parse(storedAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);