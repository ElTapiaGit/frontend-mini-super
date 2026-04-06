import api from './axios';

export const categoryService = {
  // Obtener todas las categorías para los selectores (dropdowns)
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  }
};