<template>
    <DashboardLayout>
        <div class="space-y-8 h-full flex flex-col">
        
            <section class="shrink-0">
                <h2 class="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Categorías</h2>
                <p class="text-on-surface-variant mt-1">Organiza tu inventario en grupos para facilitar las ventas.</p>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <StatCard 
                    title="Total de Categorías" 
                    :value="categoriesStore.pagination.totalItems.toString()" 
                    icon="category" 
                    colorClass="text-primary" 
                    bgClass="bg-primary-container" 
                />
                <StatCard 
                    title="Estado del Sistema" 
                    value="Sincronizado" 
                    icon="cloud_done" 
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-100"
                />
                <StatCard 
                    title="Categorías Vacías" 
                    value="1" 
                    icon="info" 
                    borderClass="border-l-4 border-surface-variant"
                />
            </section>

            <section class="flex-1 min-h-400px"> 
                <CategoryTable 
                    :categories="formattedCategories"
                    :pagination="categoriesStore.pagination"
                    :isLoading="categoriesStore.loading"
                    @create="handleCreate"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @search="handleSearch"
                    @change-page="handlePageChange"
                />
            </section>

            <CategoryModal
                :isOpen="isModalOpen"
                :category="selectedCategory"
                :isLoading="categoriesStore.loading"
                :errorMessage="modalError"
                @close="closeModal"
                @save="handleSave"
            />

            <ConfirmModal
                :isOpen="isConfirmOpen"
                title="Eliminar Categoría"
                :message="confirmMessage"
                confirmText="Eliminar permanentemente"
                :isLoading="isDeleting"
                :errorMessage="confirmError"
                @confirm="executeDelete"
                @cancel="cancelDelete"
            />

        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import StatCard from '../../components/dashboard/StatCard.vue';
import CategoryTable from '../../components/inventory/CategoryTable.vue';
import CategoryModal from '../../components/inventory/CategoryModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';
import { useCategoriesStore } from '../../stores/categories';

const categoriesStore = useCategoriesStore();

// MAPEO AL DISEÑO
const formattedCategories = computed(() => {
    return categoriesStore.categoriesList.map(cat => ({
        id: cat.id, // Para el v-for y los botones
        rawId: cat.id, 
        displayId: `#CAT-${cat.id.toString().padStart(4, '0')}`,
        name: cat.name
    }));
});

onMounted(() => {
    categoriesStore.fetchCategories({ page: 1, searchTerm: '' });
});

// PAGINACION Y BUSQUEDA
const handleSearch = (term) => {
    categoriesStore.fetchCategories({ searchTerm: term, page: 1 });
};

const handlePageChange = (newPage) => {
    categoriesStore.fetchCategories({ page: newPage });
};

// ESTADO Y METODOS DEL MODAL DE EDICION
const isModalOpen = ref(false);
const selectedCategory = ref(null);
const modalError = ref('');

const handleCreate = () => {
    selectedCategory.value = null;
    modalError.value = '';
    isModalOpen.value = true;
};

const handleEdit = (id) => {
    const category = formattedCategories.value.find(c => c.id === id);
    if (!category) return;
    selectedCategory.value = category;
    modalError.value = '';
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedCategory.value = null;
};

const handleSave = async (data) => {
    modalError.value = '';
    const categoryId = selectedCategory.value ? selectedCategory.value.rawId : null;
    
    // Llama a la API (Crear o Actualizar)
    const result = await categoriesStore.saveCategory(data, categoryId);
    
    if (result.success) {
        closeModal();
    } else {
        // "Acceso denegado. Rol (Empleado)..." o "La categoría ya existe"
        modalError.value = result.message; 
    }
};

// METODOS DE ELIMINACION SEGURA
const isConfirmOpen = ref(false);
const confirmMessage = ref('');
const categoryToDelete = ref(null);
const confirmError = ref('');
const isDeleting = ref(false);

const handleDelete = (id) => {
    const category = formattedCategories.value.find(c => c.id === id);
    if (!category) return;

    categoryToDelete.value = category;
    confirmMessage.value = `¿Estás seguro de eliminar la categoría "${category.name}"? Si tiene productos asociados, la base de datos bloqueará esta acción.`;
    confirmError.value = '';
    isConfirmOpen.value = true;
};

const executeDelete = async () => {
    if (!categoryToDelete.value) return;
    isDeleting.value = true;
    confirmError.value = '';

    const result = await categoriesStore.deleteCategory(categoryToDelete.value.rawId);

    isDeleting.value = false;
    if (result.success) {
        cancelDelete();
    } else {
        // Si la BD devuelve "Error de restricción de llave foránea" aparecerá aquí.
        confirmError.value = result.message; 
    }
};

const cancelDelete = () => {
    isConfirmOpen.value = false;
    setTimeout(() => {
        categoryToDelete.value = null;
        confirmError.value = '';
    }, 300);
};
</script>