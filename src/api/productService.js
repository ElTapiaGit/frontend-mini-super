import api from './axios';

export const productService = {
    // GET con paginación y búsqueda
    async getProducts(params = { page: 1, pageSize: 10, searchTerm: '' }) {
        const response = await api.get('/products', { params });
        return response.data;
    },
    // Obtener un producto especifico
    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    // para /products
    async createProduct(productData) {
        const response = await api.post('/products', productData);
        return response.data;
    },

    async updateProduct(id, productData) {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    async deleteProduct(id) {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};