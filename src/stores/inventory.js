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
        movements: [],     // Historial de auditoria movimientos
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
        
        // obtener movimientos
        async fetchMovements() {
            this.loading = true;
            try {
                const response = await inventoryService.getStockMovements();
                if (response.success) {
                    this.movements = response.data;
                }
            } catch (error) {
                console.error("Error al cargar historial:", error);
            } finally {
                this.loading = false;
            }
        },

        // Guardar ajuste manual
        async createMovement(payload) {
            this.loading = true;
            try {
                const response = await inventoryService.createStockMovement(payload);
                // Si fue exitoso, recargamos el historial automáticamente
                await this.fetchMovements(); 
                return { success: true };
            } catch (error) {
                // Capturamos el error (ej. "No puedes sacar más de lo que existe en bodega")
                return { success: false, message: error.response?.data?.message || 'Error al registrar el ajuste.' };
            } finally {
                this.loading = false;
            }
        }
    }
});