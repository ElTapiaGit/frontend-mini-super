<template>
    <DashboardLayout>
        <div class="space-y-6 pb-8">
        
            <section class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight">Reportes y Analíticas</h1>
                    <p class="text-on-surface-variant mt-1 text-sm">Indicadores clave de rendimiento (KPIs) y finanzas.</p>
                </div>

                <div class="flex items-end gap-3 bg-white p-3 rounded-xl border border-surface-variant/30 shadow-sm">
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Desde</label>
                        <input v-model="filters.startDate" type="date" class="bg-surface border border-surface-variant/50 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Hasta</label>
                        <input v-model="filters.endDate" type="date" class="bg-surface border border-surface-variant/50 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <button @click="generateReport" class="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1 h-34px">
                        <span class="material-symbols-outlined text-sm">refresh</span> Actualizar
                    </button>
                </div>
            </section>

            <section>
                <h2 class="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">payments</span> Resumen Financiero
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div v-if="reportsStore.loading" class="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-xl"></div>
          
                        <StatCard 
                            title="Ingresos Brutos" 
                            :value="`Bs. ${reportsStore.salesSummary.totalRevenue || '0.00'}`" 
                            icon="account_balance_wallet" 
                            colorClass="text-primary" 
                            bgClass="bg-primary-container" 
                        />
                        <StatCard 
                            title="Costos Operativos" 
                            :value="`Bs. ${reportsStore.salesSummary.totalCost || '0.00'}`" 
                            icon="trending_down" 
                            colorClass="text-error" 
                            bgClass="bg-error/10" 
                        />
                        <StatCard 
                            title="Utilidad Neta" 
                            :value="`Bs. ${reportsStore.salesSummary.netProfit || '0.00'}`" 
                            icon="trending_up" 
                            colorClass="text-secondary" 
                            bgClass="bg-secondary-container" 
                            borderClass="border-l-4 border-secondary"
                        />
                        <StatCard 
                            title="Total Ventas" 
                            :value="reportsStore.salesSummary.numSales?.toString() || '0'" 
                            icon="receipt_long" 
                        />
                </div>
            </section>

            <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-white border border-surface-variant/30 rounded-xl p-6 shadow-sm flex flex-col">
                    <div class="flex justify-between items-start mb-6">
                        <div>
                            <h3 class="font-bold font-headline text-lg text-on-surface">Valuación por Categoría</h3>
                            <p class="text-xs text-on-surface-variant">Valor del inventario actual en Bs.</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Valor Total</p>
                            <p class="text-xl font-extrabold text-primary">Bs. {{ inventoryStore.summary.totalInventoryValue || '0.00' }}</p>
                        </div>
                    </div>
                
                    <div class="flex-1 flex items-end gap-4 h-48 mt-4 pt-4 border-b border-surface-variant/50 relative">
                        <div v-for="cat in inventoryStore.valuationByCategory" :key="cat.categoryId" class="flex-1 flex flex-col justify-end items-center gap-2 group h-full">
                            <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 bg-inverse-surface text-inverse-on-surface text-[10px] py-1 px-2 rounded font-bold pointer-events-none">
                                Bs. {{ cat.inventoryValue }}
                            </div>
                            <div 
                                class="w-full max-w-15 bg-primary-container rounded-t-sm transition-all duration-500 group-hover:bg-primary" 
                                :style="`height: ${Math.min((parseFloat(cat.inventoryValue) / 15000) * 100, 100)}%`"
                            ></div>
                            <span class="text-[10px] font-semibold text-on-surface-variant truncate w-full text-center">{{ cat.categoryName }}</span>
                        </div>
                    </div>
                </div>

                <div class="bg-error/5 border border-error/20 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                    <div class="h-16 w-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-3xl">warning</span>
                    </div>
                    <h3 class="font-bold font-headline text-xl text-error mb-1">{{ inventoryStore.lowStockItems.length }} Alertas</h3>
                    <p class="text-xs text-on-surface-variant mb-6">Productos con stock crítico detectados.</p>
                
                    <div v-if="inventoryStore.lowStockItems.length > 0" class="w-full bg-white rounded-lg p-3 border border-error/10 flex justify-between items-center">
                        <div class="text-left">
                            <p class="text-sm font-bold text-on-surface truncate max-w-120px">{{ inventoryStore.lowStockItems[0].name || inventoryStore.lowStockItems[0].productName }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-extrabold text-error">{{ inventoryStore.lowStockItems[0].currentStock || inventoryStore.lowStockItems[0].stock }} u. restantes</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-if="reportsStore.loading" class="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 rounded-xl"></div>
        
                <RankingList 
                    title="Top Más Vendidos" 
                    icon="trending_up" 
                    iconBgClass="bg-secondary"
                    :items="formattedTopSelling" 
                />
                <RankingList 
                    title="Menos Vendidos" 
                    icon="trending_down" 
                    iconBgClass="bg-error"
                    :items="formattedLeastSelling" 
                />
                <RankingList 
                    title="Rendimiento (Personal/Items)" 
                    icon="badge" 
                    iconBgClass="bg-primary"
                    :items="formattedCashierPerformance" 
                />
            </section>

        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import StatCard from '../../components/dashboard/StatCard.vue';
import RankingList from '../../components/reports/RankingList.vue';
import { useReportsStore } from '../../stores/reports';
import { useInventoryStore } from '../../stores/inventory';

const reportsStore = useReportsStore();
const inventoryStore = useInventoryStore();

// CONFIGURACION DE FECHAS
const today = new Date().toISOString().split('T')[0];
//const lastMonth = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
const defaultStartDate = '2024-01-01';

const filters = ref({
    startDate: defaultStartDate,
    endDate: today
});

const generateReport = () => {
    reportsStore.fetchAllReports({
        startDate: filters.value.startDate,
        endDate: filters.value.endDate
    });
};

onMounted(() => {
    // Carga inicial de datos
    generateReport();
    inventoryStore.fetchStockStatus(); // El reporte general de inventario no depende de las fechas de ventas
});

// MAPEO DE DATOS PARA RANKINGS

const formattedTopSelling = computed(() => {
    return reportsStore.topSelling.map(item => ({
        name: item.name || item.productName || 'Producto',
        subtitle: 'Ventas Activas',
        primaryValue: `${item.totalSold} u.`,
        secondaryValue: `Bs. ${item.totalRevenue}`
    }));
});

const formattedLeastSelling = computed(() => {
    return reportsStore.leastSelling.map(item => ({
        name: item.name || item.productName || 'Producto',
        subtitle: 'Baja Rotación',
        primaryValue: `${item.totalSold} u.`,
        secondaryValue: `Bs. ${item.totalRevenue}`
    }));
});

// Adaptación defensiva: Si la API de cajeros devuelve productos (como indica el doc), lo mapeamos igual sin romper el UI.
const formattedCashierPerformance = computed(() => {
    return reportsStore.cashierPerformance.map(item => ({
        name: item.fullName || item.productName || 'Usuario Desconocido',
        subtitle: `@${item.username}`,
        primaryValue: `Bs. ${item.totalRevenue || '0.00'}`,
        secondaryValue: `${item.totalSalesCount || 0} u. / transacciones`
    }));
});
</script>