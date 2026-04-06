import { defineStore } from 'pinia';
import { categoryService } from '../api/categoryService';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categoriesList: [],
    loading: false
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await categoryService.getCategories();
        if (response.success) {
          // Asumo que tu backend devuelve la lista dentro de data o data.categories
          this.categoriesList = response.data.categories || response.data; 
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});