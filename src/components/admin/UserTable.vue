<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col border border-surface-variant/30 h-full">
    <div class="p-6 flex justify-between items-center border-b border-surface-variant/30 gap-4">
      <div class="flex-1">
        <h3 class="text-lg font-bold font-headline">Gestión de Usuarios</h3>
        <p class="text-xs text-on-surface-variant">Administrar cuentas del personal</p>
      </div>
      
      <div class="relative w-64 shrink-0">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Buscar por nombre o usuario..." 
          class="w-full pl-9 pr-4 py-2 bg-surface border border-surface-variant/50 rounded-lg text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      <button 
        @click="$emit('create')" 
        class="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary transition-all shrink-0"
      >
        <span class="material-symbols-outlined text-sm">person_add</span> Crear Usuario
      </button>
    </div>
    
    <div class="overflow-x-auto flex-1">
      <table class="w-full text-left">
        <thead class="bg-surface">
          <tr>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">ID</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nombre</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Rol</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/30">
          <tr v-for="user in users" :key="user.id" class="hover:bg-surface transition-colors">
            <td class="px-6 py-4 text-xs font-mono font-bold text-on-surface-variant">{{ user.id }}</td>
            <td class="px-6 py-4 text-sm font-semibold">{{ user.name }}</td>
            <td class="px-6 py-4">
              <span 
                class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider"
                :class="getRoleBadgeClass(user.role)"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="$emit('edit', user.id)" class="text-slate-400 hover:text-primary mr-2 transition-colors" title="Editar">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button @click="$emit('delete', user.id)" class="text-slate-400 hover:text-error transition-colors" title="Eliminar">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="px-6 py-8 text-center text-sm text-on-surface-variant">No hay usuarios que coincidan con la búsqueda.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  users: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['create', 'edit', 'delete', 'search']);

// LOGICA DE BUSQUEDA (Debounce)
const searchQuery = ref('');
let searchTimeout = null;

const handleSearch = () => {
  // Limpiamos el temporizador anterior si el usuario sigue escribiendo
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value);
  }, 500); 
};

// ESTILOS DE ROLES
const getRoleBadgeClass = (role) => {
  const normalizedRole = role?.toLowerCase() || '';
  if (normalizedRole === 'administrador') return 'bg-primary-container text-white';
  if (normalizedRole === 'gerente') return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
  if (normalizedRole === 'empleado') return 'bg-slate-100 text-slate-700 border border-slate-200';
  return 'bg-surface-variant text-on-surface-variant';
};
</script>