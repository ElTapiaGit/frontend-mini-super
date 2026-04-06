import { defineStore } from 'pinia';
import { reportService } from '../api/reportService';

export const useReportsStore = defineStore('reports', {

    state: () => ({
        salesSummary: { totalRevenue: "0.00", totalCost: "0.00", netProfit: "0.00", numSales: 0 },
        topSelling: [],
        leastSelling: [],
        cashierPerformance: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllReports(params = {}) {
            this.loading = true;
            this.error = null;
            try {
                // Ejecutamos las 4 peticiones en paralelo para optimizar tiempo
                const [salesRes, topRes, leastRes, cashierRes] = await Promise.all([
                    reportService.getSalesSummary(params),
                    reportService.getTopSelling(params),
                    reportService.getLeastSelling(params),
                    reportService.getCashierPerformance(params)
                ]);

                if (salesRes.success) this.salesSummary = salesRes.data;
                if (topRes.success) this.topSelling = topRes.data;
                if (leastRes.success) this.leastSelling = leastRes.data;
                if (cashierRes.success) this.cashierPerformance = cashierRes.data;

            } catch (error) {
                this.error = 'Error al generar los reportes.';
                console.error("Error fetching reports:", error);
            } finally {
                this.loading = false;
            }
        }
    }
});