import api from './axios';

export const inventoryService = {
    // Alertas y Valuacion
    async getStockStatus() {
        const response = await api.get('/reports/stock-status');
        return response.data;
    },
    // Historial de Movimientos (Auditoria)
    async getStockMovements() {
        const response = await api.get('/stock');
        return response.data;
    },

    // Registrar un ajuste manual
    async createStockMovement(data) {
        const response = await api.post('/stock', data);
        return response.data;
    }
};