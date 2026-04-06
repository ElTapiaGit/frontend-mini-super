<template>
    <div class="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-surface-variant/30 h-full">
            
        <div class="p-6 flex flex-wrap justify-between items-center border-b border-surface-variant/30 gap-4 bg-surface">
            <div class="flex-1 min-w-200px">
                <h3 class="text-lg font-bold font-headline">Gestión de Categorías</h3>
                <p class="text-xs text-on-surface-variant">Agrupa y organiza tu inventario</p>
            </div>
                
            <div class="flex items-center gap-3 w-full md:w-auto">
                <div class="relative w-full md:w-64 shrink-0">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                    <input 
                        type="text" 
                        v-model="searchQuery"
                        @input="handleSearch"
                        placeholder="Buscar por nombre..." 
                        class="w-full pl-9 pr-4 py-2 bg-surface-container-highest border border-surface-variant/50 rounded-lg text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                </div>
                    
                <button @click="$emit('create')" class="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary transition-all shrink-0">
                    <span class="material-symbols-outlined text-sm">add_box</span> Nueva Categoría
                </button>
            </div>
        </div>
            
        <div class="overflow-x-auto flex-1">
            <table class="w-full text-left whitespace-nowrap">
                <thead class="bg-surface-container-lowest">
                    <tr>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">ID</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant w-full">Nombre de la Categoría</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-variant/30 relative">
                    <tr v-if="isLoading">
                        <td colspan="3" class="p-0">
                            <div class="h-1 w-full bg-surface-variant overflow-hidden">
                                <div class="h-full bg-primary w-1/3 animate-pulse rounded-full"></div>
                            </div>
                        </td>
                    </tr>

                    <tr v-for="category in categories" :key="category.id" class="hover:bg-surface transition-colors" :class="{'opacity-50 pointer-events-none': isLoading}">
                        <td class="px-6 py-4 text-xs font-mono font-bold text-on-surface-variant">{{ category.displayId }}</td>
                        <td class="px-6 py-4 text-sm font-bold text-on-surface">{{ category.name }}</td>
                        <td class="px-6 py-4 text-right">
                            <button @click="$emit('edit', category.id)" class="text-slate-400 hover:text-primary mr-3 transition-colors" title="Editar">
                                <span class="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button @click="$emit('delete', category.id)" class="text-slate-400 hover:text-error transition-colors" title="Eliminar">
                                <span class="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </td>
                    </tr>
                        
                    <tr v-if="categories.length === 0 && !isLoading">
                        <td colspan="3" class="px-6 py-12 text-center text-sm text-on-surface-variant">
                            No se encontraron categorías.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="p-4 border-t border-surface-variant/30 bg-surface flex justify-between items-center shrink-0">
            <span class="text-xs text-on-surface-variant font-medium">
                Mostrando página <span class="font-bold text-on-surface">{{ pagination.currentPage }}</span> de <span class="font-bold text-on-surface">{{ pagination.totalPages }}</span>
                <span class="ml-2 hidden sm:inline">({{ pagination.totalItems }} en total)</span>
            </span>
            <div class="flex gap-2">
                <button 
                    @click="$emit('change-page', pagination.currentPage - 1)" 
                    :disabled="pagination.currentPage <= 1 || isLoading"
                    class="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                    <span class="material-symbols-outlined text-sm">chevron_left</span> Anterior
                </button>
                <button 
                    @click="$emit('change-page', pagination.currentPage + 1)" 
                    :disabled="pagination.currentPage >= pagination.totalPages || isLoading"
                    class="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                    Siguiente <span class="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    categories: { type: Array, required: true },
    pagination: { type: Object, required: true },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['create', 'edit', 'delete', 'search', 'change-page']);

const searchQuery = ref('');
let searchTimeout = null;

const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        emit('search', searchQuery.value);
    }, 500); 
};
</script>