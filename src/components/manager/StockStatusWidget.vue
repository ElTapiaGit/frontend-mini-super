<template>
  <div class="glass-card p-8 rounded-xl flex flex-col gap-6 h-full">
    <h4 class="text-lg font-headline font-bold">Stock Status</h4>
    
    <div class="space-y-6 flex-1">
      <div v-for="category in categories" :key="category.name" class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
          <span class="material-symbols-outlined text-on-surface-variant">{{ category.icon }}</span>
        </div>
        <div class="flex-1">
          <div class="flex justify-between text-xs font-bold mb-1">
            <span>{{ category.name }}</span>
            <span class="text-on-surface-variant">{{ category.level }}%</span>
          </div>
          <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000" :class="category.colorClass" :style="`width: ${category.level}%`"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="hasCritical" class="mt-2 p-3 bg-tertiary-fixed/10 border border-tertiary-fixed/30 rounded-lg flex items-start gap-3">
      <span class="material-symbols-outlined text-on-tertiary-fixed-variant">warning</span>
      <p class="text-xs text-on-tertiary-fixed-variant font-medium">
        {{ criticalItemsCount }} categories require immediate restocking to avoid stockouts.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
  hasCritical: { type: Boolean, default: false },
  criticalItemsCount: { type: Number, default: 0 }
});
</script>