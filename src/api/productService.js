import api from './axios';

export const productService = {
    // Obtener todos los productos (Inventario General)
    async getProducts() {
        const response = await api.get('/products');
        return response.data;
    },
    // Obtener un producto especifico
    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    }
};