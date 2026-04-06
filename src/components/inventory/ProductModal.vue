<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-60 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm transition-all">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
                <div class="p-6 border-b border-surface-variant/30 flex justify-between items-center bg-surface">
                    <h2 class="font-headline font-bold text-lg text-on-surface">
                        {{ mode === 'create' ? 'Crear Nuevo Producto' : mode === 'edit' ? 'Editar Producto' : 'Detalles del Producto' }}
                    </h2>
                    <button @click="$emit('close')" class="text-on-surface-variant hover:text-error transition-colors">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <div v-if="errorMessage" class="p-3 bg-error/10 border border-error/30 rounded-lg flex gap-2 items-center text-error text-xs font-bold">
                        <span class="material-symbols-outlined text-sm">error</span>
                        {{ errorMessage }}
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Nombre</label>
                            <input v-model="formData.name" :disabled="isReadOnly" type="text" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-60" placeholder="Ej. Pepsi 3L" />
                        </div>
            
                        <div>
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Categoría</label>
                            <select v-model="formData.category_id" :disabled="isReadOnly || mode === 'edit'" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                                <option value="" disabled>Seleccione...</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                    {{ cat.name }}
                                </option>
                            </select>
                            <span v-if="mode === 'edit'" class="text-[9px] text-on-surface-variant font-medium mt-1">No modificable</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Descripción</label>
                        <textarea v-model="formData.description" :disabled="isReadOnly || mode === 'edit'" rows="2" class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none disabled:opacity-60" placeholder="Ej. Bebida gaseosa..."></textarea>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Stock</label>
                            <input v-model="formData.stock" :disabled="isReadOnly" type="number" min="0" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-60" placeholder="0" />
                            <span v-if="mode === 'edit'" class="text-[9px] text-on-surface-variant font-medium">Editar desde módulo de ajustes</span>
                        </div>
            
                        <div>
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Costo (Bs.)</label>
                            <input v-model="formData.cost" :disabled="isReadOnly || mode === 'edit'" type="number" step="0.01" min="0.01" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-60" placeholder="0.00" />
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Precio (Bs.)</label>
                            <input v-model="formData.price" :disabled="isReadOnly" type="number" step="0.01" min="0.01" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-60" placeholder="0.00" />
                        </div>
                    </div>

                    <div class="pt-4 flex gap-3 mt-4">
                        <button type="button" @click="$emit('close')" class="flex-1 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-all">
                            {{ isReadOnly ? 'Cerrar' : 'Cancelar' }}
                        </button>
                        <button v-if="!isReadOnly" type="submit" :disabled="isLoading" class="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                            <span v-if="isLoading" class="material-symbols-outlined animate-spin text-sm">sync</span>
                            {{ mode === 'edit' ? 'Guardar Cambios' : 'Crear Producto' }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    mode: { type: String, default: 'create' }, // 'create', 'edit', 'view'
    product: Object, // Datos del producto para llenar el form
    categories: Array, // Lista de categorias para el <select>
    isLoading: Boolean,
    errorMessage: String
});

const emit = defineEmits(['close', 'save']);

// Variable computada para bloquear inputs fácilmente
const isReadOnly = computed(() => props.mode === 'view');

const formData = ref({
    name: '',
    description: '',
    category_id: '',
    stock: '',
    price: '',
    cost: ''
});

// Vigilar cuando se abre el modal para rellenar datos
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        if (props.product && (props.mode === 'edit' || props.mode === 'view')) {
        formData.value = {
            name: props.product.name || '',
            description: props.product.description || '',
            category_id: props.product.category_id || '',
            stock: props.product.stock || 0,
            price: parseFloat(props.product.price) || '',
            cost: parseFloat(props.product.cost) || ''
        };
        } else {
            // Limpiar para crear
            formData.value = { name: '', description: '', category_id: '', stock: '', price: '', cost: '' };
        }
    }
});

const handleSubmit = () => {
    if (isReadOnly.value) return;

    let payload = {};
  
    if (props.mode === 'create') {
        // Al crear, enviamos todo
        payload = {
            name: formData.value.name,
            description: formData.value.description,
            category_id: parseInt(formData.value.category_id),
            stock: parseInt(formData.value.stock),
            price: parseFloat(formData.value.price),
            cost: parseFloat(formData.value.cost)
        };
    } else if (props.mode === 'edit') {
        // Al editar, SOLO enviamos lo que la API permite (name, price, stock)
        payload = {
            name: formData.value.name,
            price: parseFloat(formData.value.price),
            stock: parseInt(formData.value.stock)
        };
    }
    
    emit('save', payload);
};
</script>