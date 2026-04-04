import api from './axios';

export const userService = {
    /**
     * Obtiene la lista de usuarios paginada y filtrada.
     * @param {Object} params - { page, pageSize, searchTerm }
     */
    async getUsers(params = { page: 1, pageSize: 10, searchTerm: '' }) {
        const response = await api.get('/users', { params });
        return response.data; 
    },

    async createUser(userData) {
        const response = await api.post('/users', userData);
        return response.data;
    },

    async updateUser(id, userData) {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    async deleteUser(id) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};