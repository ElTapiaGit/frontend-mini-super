import api from './axios';

export const reportService = {
  /**
   * Obtiene el resumen financiero, categorías y alertas de stock bajo.
   */
  async getStockStatus() {
    const response = await api.get('/reports/stock-status');
    return response.data; 
  }
};