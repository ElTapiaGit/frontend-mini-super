<template>
    <DashboardLayout>
        <div class="space-y-8">
      
            <section>
                <h2 class="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Inventario</h2>
                <p class="text-on-surface-variant mt-1">Administración general de productos y existencias.</p>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                <StatCard 
                    title="Total Productos" 
                    :value="inventoryStore.summary.totalProducts?.toString() || '0'" 
                    icon="inventory_2" 
                    colorClass="text-primary" 
                    bgClass="bg-primary-container" 
                />
                <StatCard 
                    title="Valor del Inventario" 
                    :value="`Bs. ${inventoryStore.summary.totalInventoryValue || '0.00'}`" 
                    icon="payments" 
                />
                <StatCard 
                    title="Alertas de Stock" 
                    :value="inventoryStore.lowStockItems.length.toString()" 
                    icon="warning" 
                    colorClass="text-error" 
                    bgClass="bg-error/10" 
                    badge="Revisar" 
                    borderClass="border-l-4 border-error" 
                />
            </section>

            <section class="flex-1 min-h-600px"> 
                <ProductTable 
                    :products="formattedProducts"
                    :pagination="productsStore.pagination"
                    :isLoading="productsStore.loading"
                    @create="handleCreate"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @view="handleView"
                    @search="handleSearch"
                    @change-page="handlePageChange"
                />
            </section>

            <ProductModal
                :isOpen="isModalOpen"
                :mode="modalMode"
                :product="selectedProduct"
                :categories="categoriesStore.categoriesList" 
                :isLoading="productsStore.loading"
                :errorMessage="modalError"
                @close="closeModal"
                @save="handleSaveProduct"
            />

            <ConfirmModal
                :isOpen="isConfirmOpen"
                title="Eliminar Producto"
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
import ProductTable from '../../components/inventory/ProductTable.vue';
import ProductModal from '../../components/inventory/ProductModal.vue';
import ConfirmModal from '../../components/admin/ConfirmModal.vue';
import StatCard from '../../components/dashboard/StatCard.vue';
import { productService } from '../../api/productService';
import { useProductsStore } from '../../stores/products';
import { useInventoryStore } from '../../stores/inventory';
import { useCategoriesStore } from '../../stores/categories';

const productsStore = useProductsStore();
const inventoryStore = useInventoryStore();
const categoriesStore = useCategoriesStore();

// MAPEO DE DATOS AL DISEÑO
const formattedProducts = computed(() => {
    return productsStore.productsList.map(product => ({
        rawId: product.id,
        id: product.id,
        sku: `PRD-${product.id.toString().padStart(4, '0')}`,
        name: product.name,
        category: product.category?.name || 'Sin Categoría',
        price: parseFloat(product.price).toFixed(2),
        stock: product.stock
    }));
});

// Carga Inicial
onMounted(() => {
    productsStore.fetchProducts({ page: 1, searchTerm: '' });
    inventoryStore.fetchStockStatus();
    categoriesStore.fetchCategories();
});

// PAGINACIÓN Y BÚSQUEDA
const handleSearch = (term) => {
    productsStore.fetchProducts({ searchTerm: term, page: 1 });
};

const handlePageChange = (newPage) => {
    productsStore.fetchProducts({ page: newPage });
};

// ESTADO DEL MODAL (CRUD y VIEW)
const isModalOpen = ref(false);
const modalMode = ref('create'); // 'create', 'edit', 'view'
const selectedProduct = ref(null);
const modalError = ref('');

const openModal = (mode) => {
    modalMode.value = mode;
    modalError.value = '';
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedProduct.value = null;
};

const handleCreate = () => {
    selectedProduct.value = null;
    openModal('create');
};

// Función maestra para obtener detalle y abrir modal (usada por Ver y Editar)
const fetchAndOpenProduct = async (formattedId, mode) => {
    const productInfo = formattedProducts.value.find(p => p.sku === formattedId || p.rawId === formattedId);
    if (!productInfo) return;

    productsStore.loading = true; // Reutilizamos el spinner del store
    try {
        // 🎯 Consumiendo: GET /api/products/:id
        const response = await productService.getProductById(productInfo.rawId);
        if (response.success) {
        selectedProduct.value = response.data;
        openModal(mode);
        }
    } catch (error) {
        alert("Error al cargar los detalles del producto.");
    } finally {
        productsStore.loading = false;
    }
};

const handleView = (id) => fetchAndOpenProduct(id, 'view');
const handleEdit = (id) => fetchAndOpenProduct(id, 'edit');

const handleSaveProduct = async (productData) => {
    modalError.value = '';
    const productId = selectedProduct.value ? selectedProduct.value.id : null;
    
    // 🎯 Consumiendo: POST /api/products o PUT /api/products/:id
    const result = await productsStore.saveProduct(productData, productId);
    
    if (result.success) {
        closeModal();
        inventoryStore.fetchStockStatus(); // Actualizamos resumen
    } else {
        modalError.value = result.message; 
    }
};

// LÓGICA DE ELIMINACIÓN SEGURA
const isConfirmOpen = ref(false);
const confirmMessage = ref('');
const productToDelete = ref(null);
const confirmError = ref('');
const isDeleting = ref(false);

const handleDelete = (formattedId) => {
    // El ID que viene de la tabla tiene formato "PRD-0008", buscamos el rawId en el computed
    const product = formattedProducts.value.find(p => p.sku === formattedId || p.rawId === formattedId);
    if (!product) return;

    productToDelete.value = product;
    confirmMessage.value = `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción borrará permanentemente sus datos (Requiere rol Administrador).`;
    confirmError.value = '';
    isConfirmOpen.value = true;
};

const executeDelete = async () => {
    if (!productToDelete.value) return;
    isDeleting.value = true;
    confirmError.value = '';

    const result = await productsStore.deleteProduct(productToDelete.value.rawId);

    isDeleting.value = false;
    if (result.success) {
        cancelDelete();
        // Actualizamos las tarjetas después de eliminar un producto
        inventoryStore.fetchStockStatus();
    } else {
        // Si eres empleado/gerente, aquí se mostrará el error 403 del backend
        confirmError.value = result.message; 
    }
};

const cancelDelete = () => {
    isConfirmOpen.value = false;
    setTimeout(() => {
        productToDelete.value = null;
        confirmError.value = '';
    }, 300);
};
</script>