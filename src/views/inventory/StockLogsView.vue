<template>
    <DashboardLayout>
        <div class="space-y-8">
        
            <section>
                <h1 class="text-3xl font-extrabold font-headline text-on-surface tracking-tight">Centro Logístico</h1>
                <p class="text-on-surface-variant mt-1">Gestión y auditoría de fluctuaciones de inventario.</p>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div class="lg:col-span-4 space-y-6">
                    <StockAdjustmentForm 
                        ref="adjustmentForm"
                        :products="productsStore.productsList"
                        :isLoading="inventoryStore.loading"
                        :errorMessage="formError"
                        @submit="handleAdjustment"
                    />

                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white/80 backdrop-blur-xl border border-surface-variant/30 rounded-xl p-5 shadow-sm">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Entradas</p>
                            <p class="text-2xl font-extrabold font-headline mt-1 text-secondary">+{{ totalEntradas }}</p>
                        </div>
                        <div class="bg-white/80 backdrop-blur-xl border border-surface-variant/30 rounded-xl p-5 shadow-sm">
                            <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total Salidas</p>
                            <p class="text-2xl font-extrabold font-headline mt-1 text-error">-{{ totalSalidas }}</p>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-8 h-600px">
                    <StockLogsTable 
                        :logs="formattedLogs"
                    />
                </div>

            </div>

        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import StockAdjustmentForm from '../../components/inventory/StockAdjustmentForm.vue';
import StockLogsTable from '../../components/inventory/StockLogsTable.vue';
import { useProductsStore } from '../../stores/products';
import { useInventoryStore } from '../../stores/inventory';

const productsStore = useProductsStore();
const inventoryStore = useInventoryStore();

const adjustmentForm = ref(null); // Referencia al componente hijo
const formError = ref('');

// INICIALIZACION
onMounted(() => {
    // Pedimos productos (con un pageSize grande para asegurar que salgan todos en el select)
    productsStore.fetchProducts({ page: 1, pageSize: 1000, searchTerm: '' });
    // Pedimos el historial
    inventoryStore.fetchMovements();
});

// PROCESAMIENTO DE DATOS (Mapeo a la Tabla)
const formattedLogs = computed(() => {
    return inventoryStore.movements.map(log => {
        const d = new Date(log.created_at);
        // Formato de fecha: "24 Oct, 2025"
        const dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        // Formato de hora: "14:22:10"
        const timeStr = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
            id: log.id,
            date: dateStr,
            time: timeStr,
            productName: log.product?.name || 'Producto Desconocido',
            type: log.movement_type.toUpperCase(), // La BD manda 'entrada', lo pasamos a 'ENTRADA'
            quantity: log.quantity,
            userName: log.recorder?.username || 'Sistema'
        };
    });
});

// Calculos dinamicos para las tarjetitas
const totalEntradas = computed(() => {
    return formattedLogs.value
        .filter(log => log.type === 'ENTRADA')
        .reduce((acc, curr) => acc + curr.quantity, 0);
});

const totalSalidas = computed(() => {
    return formattedLogs.value
        .filter(log => log.type === 'SALIDA')
        .reduce((acc, curr) => acc + curr.quantity, 0);
});

// REGISTRO DE AJUSTE (POST)
const handleAdjustment = async (formData) => {
    formError.value = '';

    // 1. Armamos el Payload exactamente como pide tu Backend
    const payload = {
        product_id: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        movement_type: formData.type.toLowerCase(), // 'ENTRADA' -> 'entrada'
        reason: formData.reason
    };

    // 2. Enviamos al Store
    const result = await inventoryStore.createMovement(payload);

    if (result.success) {
        // 3. Limpiamos el form
        if (adjustmentForm.value) adjustmentForm.value.resetForm();
        
        // 4. Actualizamos la lista de productos para que el <select> muestre el nuevo stock
        productsStore.fetchProducts({ page: 1, pageSize: 1000, searchTerm: '' });
    } else {
        // 5. Mostramos el error (Ej: "No puedes sacar más stock del que tienes")
        formError.value = result.message;
    }
};
</script>