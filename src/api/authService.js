import api from './axios';

export const authService = {
    /**
   * Envia las credenciales al backend
   * @param {Object} credentials - { username, password }
   */
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data; 
    },
    
    async logout() {
        // Logica backend endpoint de blacklist
    }
};