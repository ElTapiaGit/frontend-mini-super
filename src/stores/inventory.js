import { defineStore } from 'pinia';
import { inventoryService } from '../api/inventoryService';

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        summary: {
            lowStockThreshold: 5, // umbral dinamico del backend
            totalInventoryValue: "0.00",
            totalProducts: 0
        },
        valuationByCategory: [],
        lowStockItems: [],  // Solo contendra productos con stock <= 5
        movements: [],     // Historial de auditoria
        loading: false,
        error: null
    }),

    actions: {
        async fetchStockStatus() {
            this.loading = true;
            this.error = null;
            try {
                const response = await inventoryService.getStockStatus();
                if (response.success) {
                    this.summary = response.data.summary;
                    this.valuationByCategory = response.data.valuationByCategory;
                    this.lowStockItems = response.data.lowStockItems;
                }
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al cargar el estado del inventario';
                console.error('Error en inventario:', this.error);
            } finally {
                this.loading = false;
            }
        },

        async fetchMovements() {
            try {
                const response = await inventoryService.getStockMovements();
                if (response.success) {
                    this.movements = response.data;
                }
            } catch (error) {
                console.error("Error en auditoría:", error);
            }
        }
    }
});