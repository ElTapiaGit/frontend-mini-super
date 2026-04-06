import api from './axios';

export const reportService = {
  /**
   * Obtiene el resumen financiero, categorías y alertas de stock bajo.
   */
  async getStockStatus() {
    const response = await api.get('/reports/stock-status');
    return response.data; 
  },

  async getSalesSummary(params) {
    const response = await api.get('/reports/sales-summary', { params });
    return response.data;
  },
  
  async getTopSelling(params) {
    const response = await api.get('/reports/top-selling', { params });
    return response.data;
  },
  
  async getLeastSelling(params) {
    const response = await api.get('/reports/least-selling', { params });
    return response.data;
  },
  
  async getCashierPerformance(params) {
    const response = await api.get('/reports/cashier-performance', { params });
    return response.data;
  }
};