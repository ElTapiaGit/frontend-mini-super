<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-70 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col text-center p-6 border border-white/20">
        
        <div class="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4 text-error">
          <span class="material-symbols-outlined text-3xl">warning</span>
        </div>
        
        <h2 class="font-headline font-extrabold text-xl text-on-surface mb-2">{{ title }}</h2>
        <p class="text-sm text-on-surface-variant mb-6 leading-relaxed">{{ message }}</p>

        <div v-if="errorMessage" class="mb-6 p-3 bg-error/10 border border-error/30 rounded-lg flex gap-2 items-center text-error text-xs font-bold text-left">
          <span class="material-symbols-outlined text-sm shrink-0">error</span>
          <span>{{ errorMessage }}</span>
        </div>

        <div class="flex gap-3">
          <button 
            @click="$emit('cancel')" 
            :disabled="isLoading" 
            class="flex-1 py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-all disabled:opacity-50"
          >
            {{ cancelText || 'Cancelar' }}
          </button>
          <button 
            @click="$emit('confirm')" 
            :disabled="isLoading" 
            class="flex-1 py-3 bg-error text-white font-bold rounded-xl hover:opacity-90 transition-all flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg shadow-error/20"
          >
            <span v-if="isLoading" class="material-symbols-outlined animate-spin text-sm">sync</span>
            {{ confirmText || 'Eliminar' }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
  confirmText: String,
  cancelText: String,
  isLoading: Boolean,
  errorMessage: String
});

defineEmits(['confirm', 'cancel']);
</script>