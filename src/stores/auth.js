import { defineStore } from 'pinia';
import { authService } from '../api/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Cargamos datos iniciales del localStorage si existen
    token: localStorage.getItem('jwt_token') || null,
    user: JSON.parse(localStorage.getItem('user_data')) || null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      try {
        const data = await authService.login(credentials);
        if (data.success) {
          this.token = data.token;
          this.user = data.user;
          //almacenamos en localStorage para persistencia
          localStorage.setItem('jwt_token', data.token);
          localStorage.setItem('user_data', JSON.stringify(data.user));
          return true;
        }
      } catch (error) {
        throw error.response?.data?.message || 'Error de autenticación';
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data'); 
      window.location.href = '/login';
    }
  }
});