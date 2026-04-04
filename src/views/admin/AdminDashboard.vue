<template>
  <DashboardLayout>
    <div class="space-y-8">
      
      <section class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Valor Total" 
          :value="`Bs. ${inventoryStore.summary.totalInventoryValue}`" 
          icon="payments" 
          colorClass="text-secondary" 
          bgClass="bg-primary-container" 
        />
        <StatCard 
          title="Stock Bajo" 
          :value="inventoryStore.lowStockItems.length.toString()" 
          icon="warning" 
          colorClass="text-error" 
          bgClass="bg-error/10" 
          badge="Crítico" 
          borderClass="border-l-4 border-error" 
        />
        <StatCard 
          title="Total Categorías" 
          :value="inventoryStore.valuationByCategory.length.toString()" 
          icon="category" 
        />
        <StatCard 
          title="Usuarios Activos" 
          :value="usersStore.pagination.totalItems.toString()" 
          icon="bolt" 
          isSpecialCard 
        />
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 relative">
          <div v-if="usersStore.loading" class="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <span class="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
          </div>
          <UserTable 
            :users="formattedUsers" 
            @search="handleSearchUsers"
            @create="handleCreateUser"
            @edit="handleEditUser"
            @delete="handleDeleteUser"
          />
        </div>

        <div class="lg:col-span-1">
           <StockAlerts :alerts="stockAlertsList" />
        </div>
      </div>

    </div>
    
    <UserModal 
      :isOpen="isModalOpen" 
      :user="selectedUser" 
      :isLoading="usersStore.loading"
      :errorMessage="modalError"
      @close="closeModal"
      @save="handleSaveUser"
    />

    <ConfirmModal
      :isOpen="isConfirmOpen"
      title="Eliminar Usuario"
      :message="confirmMessage"
      confirmText="Eliminar permanentemente"
      :isLoading="isDeleting"
      :errorMessage="confirmError"
      @confirm="executeDelete"
      @cancel="cancelDelete"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import StatCard from '../../components/dashboard/StatCard.vue';
import UserTable from '../../components/admin/UserTable.vue';
import StockAlerts from '../../components/inventory/StockAlerts.vue';
import UserModal from '../../components/admin/UserModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';
import { useUsersStore } from '../../stores/users';
import { useInventoryStore } from '../../stores/inventory';
import { useProductsStore } from '../../stores/products'; 

const usersStore = useUsersStore();
const inventoryStore = useInventoryStore();
const productsStore = useProductsStore();

// LOGICA DE INVENTARIO (Conectado a /api/products)
const stockAlertsList = computed(() => {
  // Filtramos nosotros mismos los productos con stock menor o igual a 5
  const umbral = 5;
  const productosEnAlerta = productsStore.productsList.filter(p => Number(p.stock) <= umbral);

  // Mapeamos para el componente visual
  return productosEnAlerta.map(item => {
    const stockActual = Number(item.stock);
    const isAgotado = stockActual === 0;

    return {
      id: item.id,
      name: item.name, 
      status: isAgotado ? 'Agotado' : `Stock Bajo: ${stockActual} Unidades`,
      icon: isAgotado ? 'block' : 'warning'
    };
  });
});

// LOGICA DE USUARIOS
const formattedUsers = computed(() => {
  return usersStore.usersList.map(user => ({
    rawId: user.id,
    username: user.username,
    id: `#USR-${user.id.toString().padStart(4, '0')}`,
    name: user.full_name,
    role: user.role?.name || 'Sin Rol'
  }));
});

// INICIALIZACION
onMounted(() => {
  usersStore.fetchUsers();
  inventoryStore.fetchStockStatus(); 
  productsStore.fetchProducts();     
});

// ESTADO DEL MODAL DE USUARIOS
const isModalOpen = ref(false);
const selectedUser = ref(null);
const modalError = ref('');

const openCreateModal = () => {
  selectedUser.value = null;
  modalError.value = '';
  isModalOpen.value = true;
};

const openEditModal = (formattedId) => {
  const user = formattedUsers.value.find(u => u.id === formattedId);
  selectedUser.value = user;
  modalError.value = '';
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSaveUser = async (userData) => {
  modalError.value = '';
  const userId = selectedUser.value ? selectedUser.value.rawId : null;
  const result = await usersStore.saveUser(userData, userId);
  
  if (result.success) {
    closeModal();
  } else {
    modalError.value = result.message; 
  }
};

// ESTADO DEL MODAL DE CONFIRMACION (DELETE)
const isConfirmOpen = ref(false);
const confirmMessage = ref('');
const userToDelete = ref(null);
const confirmError = ref('');
const isDeleting = ref(false);

const handleDeleteUser = (formattedId) => {
  const user = formattedUsers.value.find(u => u.id === formattedId);
  if (!user) return;

  userToDelete.value = user;
  confirmMessage.value = `¿Estás seguro de que deseas eliminar a ${user.name}? Esta acción no se puede deshacer y borrará permanentemente sus credenciales.`;
  confirmError.value = '';
  isConfirmOpen.value = true;
};

const executeDelete = async () => {
  if (!userToDelete.value) return;
  isDeleting.value = true;
  confirmError.value = '';

  const result = await usersStore.deleteUser(userToDelete.value.rawId);

  isDeleting.value = false;

  if (result.success) {
    cancelDelete();
  } else {
    confirmError.value = result.message; 
  }
};

const cancelDelete = () => {
  isConfirmOpen.value = false;
  setTimeout(() => {
    userToDelete.value = null;
    confirmError.value = '';
  }, 300); 
};

// Vinculacion de eventos de la tabla
const handleCreateUser = openCreateModal;
const handleEditUser = openEditModal;
const handleSearchUsers = (searchTerm) => {
  usersStore.fetchUsers({ searchTerm: searchTerm, page: 1 });
};

</script>