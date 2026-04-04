<template>
  <DashboardLayout>
    <div class="space-y-8">
      
      <section v-if="isAdminOrManager" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Valor Total" 
          value="Bs. 48,950.00" 
          icon="payments" 
          colorClass="text-secondary" 
          bgClass="bg-primary-container" 
          badge="+12.5%" 
        />
        <StatCard 
          title="Stock Bajo" 
          value="14" 
          icon="warning" 
          colorClass="text-error" 
          bgClass="bg-error/10" 
          badge="Crítico" 
          borderClass="border-l-4 border-error"
        />
        <StatCard 
          title="Total Categorías" 
          value="86" 
          icon="category" 
        />
        <StatCard 
          title="Usuarios Activos" 
          value="4" 
          icon="bolt" 
          isSpecialCard 
        />
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div v-if="authStore.user?.role === 'Administrador'" class="lg:col-span-2">
          <UserTable 
            :users="usersList" 
            @create="handleCreateUser"
            @edit="handleEditUser"
            @delete="handleDeleteUser"
          />
        </div>

        <div v-if="isAdminOrManager" :class="{'lg:col-span-3': authStore.user?.role !== 'Administrador'}">
           <StockAlerts :alerts="stockAlertsList" />
        </div>

      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import DashboardLayout from '../../layouts/DashboardLayout.vue';

// Importamos los Dumb Components (que crearemos en el Paso 3 real)
import StatCard from '../../components/dashboard/StatCard.vue';
import UserTable from '../../components/admin/UserTable.vue';
import StockAlerts from '../../components/inventory/StockAlerts.vue';

const authStore = useAuthStore();

const isAdminOrManager = computed(() => {
  return authStore.user?.role === 'Administrador' || authStore.user?.role === 'Gerente';
});

// Mock para la tabla de usuarios
const usersList = ref([
  { id: '#USR-8902', name: 'Julian Casablancas', role: 'Admin' }
]);

// Mock para las alertas de stock
const stockAlertsList = ref([
  { id: 1, name: 'Leche Entera PIL', status: 'Agotado', icon: 'inventory_2' }
]);

const handleCreateUser = () => {
  console.log('Abrir modal para crear usuario');
};

const handleEditUser = (userId) => {
  console.log('Editando usuario:', userId);
};

const handleDeleteUser = (userId) => {
  console.log('Eliminando usuario:', userId);
};
</script>