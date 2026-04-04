<template>
  <div class="bg-white rounded-xl shadow-sm flex flex-col border border-surface-variant/30 h-full">
    <div class="p-6 border-b border-surface-variant/30">
      <h3 class="text-lg font-bold font-headline">Control de Inventario</h3>
      <p class="text-xs text-on-surface-variant">Alertas de stock</p>
    </div>
    
    <div class="p-4 space-y-4 overflow-y-auto custom-scrollbar">
      <div 
        v-for="alert in alerts" 
        :key="alert.id" 
        class="flex items-center gap-4 p-3 rounded-lg border-l-4 border-error bg-error/10"
      >
        <div class="w-12 h-12 rounded bg-white flex items-center justify-center shrink-0 shadow-sm">
          <span class="material-symbols-outlined text-error">{{ alert.icon || 'inventory_2' }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold truncate">{{ alert.name }}</p>
          <p class="text-[10px] font-bold text-error uppercase">{{ alert.status }}</p>
        </div>
      </div>

      <div v-if="alerts.length === 0" class="text-center p-6 text-on-surface-variant text-sm">
        El inventario está en niveles óptimos.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  alerts: {
    type: Array,
    required: true
  }
});
</script>