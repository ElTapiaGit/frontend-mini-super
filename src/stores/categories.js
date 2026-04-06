import { defineStore } from 'pinia';
import { categoryService } from '../api/categoryService';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categoriesList: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1
    },
    loading: false,
    error: null
  }),

  actions: {
    async fetchCategories(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const queryParams = {
          page: params.page || this.pagination.currentPage,
          pageSize: params.pageSize || this.pagination.pageSize,
          searchTerm: params.searchTerm !== undefined ? params.searchTerm : ''
        };

        const response = await categoryService.getCategories(queryParams);
        
        if (response.success) {
          this.categoriesList = response.data.categories;
          this.pagination = {
            // Mapeamos el "CursorPage" que devuelve tu backend
            currentPage: response.data.CursorPage || 1, 
            pageSize: response.data.pageSize || 10,
            totalItems: response.data.totalItems || 0,
            totalPages: response.data.totalPages || 1
          };
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al cargar categorías';
      } finally {
        this.loading = false;
      }
    },

    async saveCategory(categoryData, categoryId = null) {
      this.loading = true;
      try {
        if (categoryId) {
          await categoryService.updateCategory(categoryId, categoryData);
        } else {
          await categoryService.createCategory(categoryData);
        }
        await this.fetchCategories(); 
        return { success: true };
      } catch (error) {
        // Aquí capturamos el 400 (Duplicados) o el 403 (Rol Empleado)
        return { success: false, message: error.response?.data?.message || 'Error al guardar la categoría' };
      } finally {
        this.loading = false;
      }
    },

    async deleteCategory(categoryId) {
      this.loading = true;
      try {
        await categoryService.deleteCategory(categoryId);
        await this.fetchCategories();
        return { success: true };
      } catch (error) {
        // Captura el error de integridad referencial (ON DELETE RESTRICT) o de roles
        return { success: false, message: error.response?.data?.message || 'Error al eliminar la categoría' };
      } finally {
        this.loading = false;
      }
    }
  }
});