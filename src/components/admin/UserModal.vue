<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-60 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div class="p-6 border-b border-surface-variant/30 flex justify-between items-center bg-surface">
          <h2 class="font-headline font-bold text-lg text-on-surface">
            {{ isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
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

          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Nombre Completo</label>
            <input v-model="formData.full_name" type="text" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Ej. Juan Perez" />
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Nombre de Usuario</label>
            <input v-model="formData.username" type="text" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Ej. jperez" />
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Rol</label>
            <select v-model="formData.roleName" required class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer">
              <option value="" disabled>Seleccione un rol...</option>
              <option value="Administrador">Administrador</option>
              <option value="Gerente">Gerente</option>
              <option value="Empleado">Empleado</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">
              Contraseña <span v-if="isEditing" class="text-[10px] font-normal lowercase text-outline">(Dejar en blanco para mantener actual)</span>
            </label>
            <input v-model="formData.password" type="password" :required="!isEditing" class="w-full bg-surface-container-highest border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" />
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" @click="$emit('close')" class="flex-1 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-all">
              Cancelar
            </button>
            <button type="submit" :disabled="isLoading" class="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
              <span v-if="isLoading" class="material-symbols-outlined animate-spin text-sm">sync</span>
              {{ isEditing ? 'Guardar Cambios' : 'Crear Usuario' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  user: Object, // Si viene null es creación, si trae datos es edicion
  isLoading: Boolean,
  errorMessage: String
});

const emit = defineEmits(['close', 'save']);

const isEditing = ref(false);
const formData = ref({
  full_name: '',
  username: '',
  roleName: '',
  password: ''
});

// Cuando el modal se abre, llenamos los datos si estamos editando
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.user) {
      isEditing.value = true;
      formData.value = {
        full_name: props.user.name, // mapeamos full_name como 'name' en la tabla
        username: props.user.username,
        roleName: props.user.role,
        password: '' 
      };
    } else {
      isEditing.value = false;
      formData.value = { full_name: '', username: '', roleName: '', password: '' };
    }
  }
});

const handleSubmit = () => {
  // Limpiamos la password si está vacía en modo edición para que el backend no falle
  const payload = { ...formData.value };
  if (isEditing.value && !payload.password) {
    delete payload.password;
  }
  emit('save', payload);
};
</script>