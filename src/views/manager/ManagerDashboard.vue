<template>
  <DashboardLayout>
    <div class="p-8 space-y-8">
      
      <section class="flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Manager Dashboard</h2>
          <p class="text-on-surface-variant mt-1">Real-time analytical overview of store performance.</p>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-surface-container-lowest text-on-surface font-semibold rounded-xl flex items-center gap-2 hover:bg-surface-container-high transition-colors">
            <span class="material-symbols-outlined text-lg">calendar_today</span>
            Last 30 Days
          </button>
          <button class="px-4 py-2 bg-primary text-white font-semibold rounded-xl flex items-center gap-2 active:scale-95 duration-200">
            <span class="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ManagerStatCard 
          title="Total Sales" 
          value="$142,500" 
          subtitle="Growth compared to previous month" 
          bgIcon="payments" 
          iconColor="text-emerald-600" 
          trendValue="12" 
          trendIcon="arrow_upward" 
          trendColor="text-emerald-600" 
        />
        <ManagerStatCard 
          title="Total Costs" 
          value="$84,210" 
          subtitle="Procurement and operating expenses" 
          bgIcon="shopping_bag" 
          iconColor="text-error" 
          trendValue="2" 
          trendIcon="trending_flat" 
          trendColor="text-on-surface-variant" 
        />
        <ManagerStatCard 
          title="Net Profit" 
          value="$58,290" 
          subtitle="Actual margin after all deductions" 
          bgIcon="account_balance_wallet" 
          trendValue="8.5" 
          trendIcon="arrow_upward" 
          :isDark="true"
        />
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-8">
          <SalesChartWidget :chartData="chartData" :labels="chartLabels" />
        </div>
        <div class="lg:col-span-4">
          <TopProductsWidget :products="topProducts" @view-details="handleViewInventory" />
        </div>
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div class="lg:col-span-3">
          <CashierGaugeWidget :performance="cashierPerformance" />
        </div>
        <div class="lg:col-span-4">
          <StockStatusWidget 
            :categories="stockCategories" 
            :hasCritical="criticalCount > 0" 
            :criticalItemsCount="criticalCount" 
          />
        </div>
        <div class="lg:col-span-5">
          <StockMovementsTable :logs="stockLogs" @view-all="handleViewLogs" />
        </div>
      </section>

    </div>

    <button class="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform group z-50">
      <span class="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform">add</span>
      <div class="absolute right-full mr-4 bg-primary-container text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Create Adjustment Log
      </div>
    </button>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';

// Importación de Componentes Tontos (Dumb Components)
import ManagerStatCard from '../../components/manager/ManagerStatCard.vue';
import SalesChartWidget from '../../components/manager/SalesChartWidget.vue';
import TopProductsWidget from '../../components/manager/TopProductsWidget.vue';
import CashierGaugeWidget from '../../components/manager/CashierGaugeWidget.vue';
import StockStatusWidget from '../../components/manager/StockStatusWidget.vue';
import StockMovementsTable from '../../components/manager/StockMovementsTable.vue';

// Datos Gráfico de Ventas
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const chartData = ref([
  { containerHeight: 60, fillHeight: 70, hoverHeight: 80 },
  { containerHeight: 80, fillHeight: 85, hoverHeight: 95 },
  { containerHeight: 50, fillHeight: 60, hoverHeight: 70 },
  { containerHeight: 90, fillHeight: 95, hoverHeight: 100 },
  { containerHeight: 70, fillHeight: 75, hoverHeight: 85 },
  { containerHeight: 85, fillHeight: 90, hoverHeight: 100 },
  { containerHeight: 65, fillHeight: 70, hoverHeight: 80 }
]);

// Datos Productos más Vendidos
const topProducts = ref([
  { id: 1, name: 'Organic Arabica Coffee', sold: 1240, percentage: 85 },
  { id: 2, name: 'Artisanal Sourdough', sold: 982, percentage: 72 },
  { id: 3, name: 'Whole Almond Milk', sold: 856, percentage: 65 },
  { id: 4, name: 'Dark Chocolate 70%', sold: 743, percentage: 58 },
  { id: 5, name: 'Premium Olive Oil', sold: 612, percentage: 45 }
]);

// Datos Rendimiento Cajero
const cashierPerformance = ref({
  efficiency: 75,
  avgTime: '1m 12s',
  targetTime: '<1m 30s'
});

// Datos Estado de Categorías
const stockCategories = ref([
  { name: 'Produce', icon: 'restaurant', level: 42, colorClass: 'bg-tertiary-fixed-dim' },
  { name: 'Beverages', icon: 'liquor', level: 88, colorClass: 'bg-emerald-500' },
  { name: 'Cleaning', icon: 'soap', level: 12, colorClass: 'bg-error' }
]);

const criticalCount = computed(() => {
  return stockCategories.value.filter(cat => cat.level < 20).length;
});

// Datos Movimientos (Logs)
const stockLogs = ref([
  { id: 1, type: 'Entry', product: 'Fresh Milk 1L', sku: 'FM-202', qty: 48, time: '10:24 AM' },
  { id: 2, type: 'Exit', product: 'Avocado Pack', sku: 'FR-501', qty: -12, time: '09:15 AM' },
  { id: 3, type: 'Entry', product: 'Toilet Tissue 12pk', sku: 'CL-109', qty: 120, time: 'Yesterday' },
  { id: 4, type: 'Exit', product: 'Greek Yogurt', sku: 'DY-332', qty: -24, time: 'Yesterday' }
]);

// MÉTODOS (Acciones emitidas desde los Dumb Components)
const handleViewInventory = () => {
  console.log('Navegar a inventario detallado');
};

const handleViewLogs = () => {
  console.log('Navegar a historial de movimientos completos');
};
</script>