import { defineStore } from 'pinia';
import { productService } from '../api/productService';

export const useProductsStore = defineStore('products', {
    state: () => ({
        productsList: [],
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
        async fetchProducts(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                const queryParams = {
                    page: params.page || this.pagination.currentPage,
                    pageSize: params.pageSize || this.pagination.pageSize,
                    searchTerm: params.searchTerm !== undefined ? params.searchTerm : ''
                };
                const response = await productService.getProducts(queryParams);
                if (response.success) {
                    this.productsList = response.data.products;
                    this.pagination = {
                        currentPage: response.data.currentPage,
                        pageSize: response.data.pageSize || 10, // Backup por si el backend no lo envia
                        totalItems: response.data.totalItems,
                        totalPages: response.data.totalPages
                    };
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar productos';
            } finally {
                this.loading = false;
            }
        },

        async saveProduct(productData, productId = null) {
            this.loading = true;
            try {
                if (productId) {
                    await productService.updateProduct(productId, productData);
                } else {
                    await productService.createProduct(productData);
                }
                await this.fetchProducts(); // Recargar lista actual
                return { success: true };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Error al guardar el producto' };
            } finally {
                this.loading = false;
            }
        },

        async deleteProduct(productId) {
            this.loading = true;
            try {
                await productService.deleteProduct(productId);
                await this.fetchProducts();
                return { success: true };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Error al eliminar el producto' };
            } finally {
                this.loading = false;
            }
        }
    }
});