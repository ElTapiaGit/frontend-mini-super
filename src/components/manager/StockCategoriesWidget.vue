<template>
  <div class="glass-card p-8 rounded-xl flex flex-col gap-6 border border-surface-variant/20 shadow-sm h-full">
    <h4 class="text-lg font-headline font-bold">Estado del Inventario</h4>
    <div class="space-y-6">
      <div v-for="cat in categories" :key="cat.name" class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg bg-surface-variant/40 flex items-center justify-center">
          <span class="material-symbols-outlined text-on-surface-variant">{{ cat.icon }}</span>
        </div>
        <div class="flex-1">
          <div class="flex justify-between text-xs font-bold mb-1">
            <span>{{ cat.name }}</span>
            <span class="text-on-surface-variant">{{ cat.level }}%</span>
          </div>
          <div class="h-1.5 bg-surface-variant/50 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000" :class="cat.colorClass" :style="`width: ${cat.level}%`"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasCritical" class="mt-2 p-3 bg-tertiary-fixed-dim/10 border border-tertiary-fixed-dim/30 rounded-lg flex items-start gap-3">
      <span class="material-symbols-outlined text-on-tertiary-container">warning</span>
      <p class="text-xs text-on-tertiary-container font-medium">Hay categorías que requieren reabastecimiento inmediato para evitar quiebres.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ categories: Array, hasCritical: Boolean });
</script>
