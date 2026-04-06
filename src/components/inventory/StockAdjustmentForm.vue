<template>
    <div class="bg-white/80 backdrop-blur-xl border border-surface-variant/30 rounded-xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-primary-container rounded-lg text-white">
                <span class="material-symbols-outlined">edit_note</span>
            </div>
            <h2 class="text-lg font-bold font-headline">Ajuste Manual</h2>
        </div>

        <div v-if="errorMessage" class="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg flex gap-2 items-center text-error text-xs font-bold">
            <span class="material-symbols-outlined text-sm">error</span>
            {{ errorMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Producto</label>
                <select v-model="form.productId" required class="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-secondary/20 outline-none cursor-pointer transition-all">
                    <option value="" disabled>Seleccione un producto...</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }} (Stock: {{ product.stock }})
                    </option>
                </select>
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Tipo de Ajuste</label>
                <div class="grid grid-cols-2 gap-2 p-1 bg-surface-container-low rounded-xl">
                    <button type="button" @click="form.type = 'ENTRADA'" :disabled="isLoading" :class="form.type === 'ENTRADA' ? 'bg-secondary text-white shadow-sm' : 'text-on-surface-variant hover:bg-white/50'" class="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50">
                        <span class="material-symbols-outlined text-sm">south_east</span> Entrada
                    </button>
                    <button type="button" @click="form.type = 'SALIDA'" :disabled="isLoading" :class="form.type === 'SALIDA' ? 'bg-error text-white shadow-sm' : 'text-on-surface-variant hover:bg-white/50'" class="flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50">
                        <span class="material-symbols-outlined text-sm">north_east</span> Salida
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Cantidad</label>
                    <input v-model="form.quantity" :disabled="isLoading" type="number" min="1" required class="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all disabled:opacity-50" placeholder="0" />
                </div>
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Unidad</label>
                    <div class="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm text-slate-400 font-medium">Unidades</div>
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Motivo del Ajuste</label>
                <textarea v-model="form.reason" :disabled="isLoading" required class="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none disabled:opacity-50" placeholder="Ej. Mercadería dañada, ajuste..." rows="3"></textarea>
            </div>

            <button type="submit" :disabled="isLoading" class="w-full bg-primary-container text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2 disabled:opacity-50">
                <span v-if="isLoading" class="material-symbols-outlined animate-spin">sync</span>
                <span v-else class="material-symbols-outlined">publish</span>
                {{ isLoading ? 'Procesando...' : 'Ejecutar Ajuste' }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    products: { type: Array, required: true },
    isLoading: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' }
});

const emit = defineEmits(['submit']);

const form = ref({
    productId: '',
    type: 'ENTRADA',
    quantity: '',
    reason: ''
});

const handleSubmit = () => {
    emit('submit', { ...form.value });
    // El formulario lo limpiaremos desde el componente padre si el guardado es exitoso
};

// Función expuesta para limpiar el form desde afuera
const resetForm = () => {
    form.value = { productId: '', type: 'ENTRADA', quantity: '', reason: '' };
};
defineExpose({ resetForm });
</script>