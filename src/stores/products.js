import { defineStore } from 'pinia';
import { productService } from '../api/productService';

export const useProductsStore = defineStore('products', {
    state: () => ({
        productsList: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await productService.getProducts();
                if (response.success) {
                    // La documentación indica que viene en data.products
                    this.productsList = response.data.products;
                }
            } catch (error) {
                this.error = 'Error al cargar los productos';
                console.error("Error fetching products:", error);
            } finally {
                this.loading = false;
            }
        }
    }
});