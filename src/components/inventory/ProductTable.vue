<template>
    <div class="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-surface-variant/30 h-full">
    
        <div class="p-6 flex flex-wrap justify-between items-center border-b border-surface-variant/30 gap-4 bg-surface">
            <div class="flex-1 min-w-200px">
                <h3 class="text-lg font-bold font-headline">Catálogo de Productos</h3>
                <p class="text-xs text-on-surface-variant">Gestiona el inventario y precios</p>
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
                <span class="material-symbols-outlined text-sm">add_box</span> Nuevo Producto
                </button>
            </div>
        </div>
    
        <div class="overflow-x-auto flex-1">
            <table class="w-full text-left whitespace-nowrap">
                <thead class="bg-surface-container-lowest">
                    <tr>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Código</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Producto</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Precio</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stock</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Estado</th>
                        <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-surface-variant/30 relative">
                    <tr v-if="isLoading">
                        <td colspan="6" class="p-0">
                        <div class="h-1 w-full bg-surface-variant overflow-hidden">
                            <div class="h-full bg-primary w-1/3 animate-pulse rounded-full"></div>
                        </div>
                        </td>
                    </tr>

                    <tr v-for="product in products" :key="product.id" class="hover:bg-surface transition-colors" :class="{'opacity-50 pointer-events-none': isLoading}">
                        <td class="px-6 py-4 text-xs font-mono font-bold text-on-surface-variant">{{ product.sku }}</td>
                        <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-on-surface">{{ product.name }}</span>
                            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">{{ product.category }}</span>
                        </div>
                        </td>
                        <td class="px-6 py-4 text-sm font-semibold text-primary">Bs. {{ product.price }}</td>
                        <td class="px-6 py-4 text-sm font-bold text-on-surface-variant">{{ product.stock }} u.</td>
                        <td class="px-6 py-4">
                        <div class="flex items-center gap-1.5" :class="getStockStatus(product.stock).color">
                            <span class="material-symbols-outlined text-[14px]">{{ getStockStatus(product.stock).icon }}</span>
                            <span class="text-[10px] font-bold uppercase tracking-wider">{{ getStockStatus(product.stock).text }}</span>
                        </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                            <button @click="$emit('edit', product.id)" class="text-slate-400 hover:text-primary mr-3 transition-colors" title="Editar">
                                <span class="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button @click="$emit('delete', product.id)" class="text-slate-400 hover:text-error mr-3 transition-colors" title="Eliminar">
                                <span class="material-symbols-outlined text-lg">delete</span>
                            </button>
                            <button @click="$emit('view', product.id)" class="text-slate-400 hover:text-emerald-500 mr-3 transition-colors" title="Ver Detalles">
                                <span class="material-symbols-outlined text-lg">visibility</span>
                            </button>
                        </td>
                    </tr>
                
                    <tr v-if="products.length === 0 && !isLoading">
                        <td colspan="6" class="px-6 py-12 text-center text-sm text-on-surface-variant">
                        No se encontraron productos.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="p-4 border-t border-surface-variant/30 bg-surface flex justify-between items-center shrink-0">
            <span class="text-xs text-on-surface-variant font-medium">
                Mostrando página <span class="font-bold text-on-surface">{{ pagination.currentPage }}</span> de <span class="font-bold text-on-surface">{{ pagination.totalPages }}</span>
                <span class="ml-2 hidden sm:inline">({{ pagination.totalItems }} registros en total)</span>
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
  products: { type: Array, required: true },
  pagination: { type: Object, required: true },
  isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['create', 'edit', 'delete', 'search', 'change-page', 'view']);

const searchQuery = ref('');
let searchTimeout = null;

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 500); 
};

const getStockStatus = (stock) => {
  const qty = Number(stock);
  if (qty === 0) return { text: 'Agotado', icon: 'block', color: 'text-error bg-error/10 px-2 py-1' };
  if (qty <= 5) return { text: 'Bajo', icon: 'warning', color: 'text-amber-600 bg-amber-100 px-2 py-1' };
  return { text: 'Óptimo', icon: 'check_circle', color: 'text-emerald-600 bg-emerald-100 px-2 py-1' };
};
</script>