import api from './axios';

export const categoryService = {
  // Listado paginado y con búsqueda
  async getCategories(params = { page: 1, pageSize: 10, searchTerm: '' }) {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  async getCategoryById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(data) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async updateCategory(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};