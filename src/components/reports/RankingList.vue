<template>
  <div class="bg-white border border-surface-variant/30 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
    <div class="p-5 border-b border-surface-variant/30 bg-surface flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div :class="`p-1.5 rounded-lg text-white ${iconBgClass}`">
          <span class="material-symbols-outlined text-[16px]">{{ icon }}</span>
        </div>
        <h3 class="font-bold font-headline text-sm text-on-surface">{{ title }}</h3>
      </div>
    </div>
    
    <div class="flex-1 p-0 overflow-y-auto max-h-300px">
      <ul class="divide-y divide-surface-variant/30">
        <li v-for="(item, index) in items" :key="index" class="p-4 hover:bg-surface-container-lowest transition-colors flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold text-on-surface-variant w-4">{{ index + 1 }}</span>
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-on-surface">{{ item.name }}</span>
              <span class="text-[10px] text-on-surface-variant">{{ item.subtitle }}</span>
            </div>
          </div>
          <div class="text-right flex flex-col">
            <span class="text-sm font-bold text-primary">{{ item.primaryValue }}</span>
            <span class="text-[10px] font-medium text-secondary">{{ item.secondaryValue }}</span>
          </div>
        </li>
        <li v-if="items.length === 0" class="p-6 text-center text-xs text-on-surface-variant">
          No hay datos disponibles para este periodo.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
    title: String,
    icon: String,
    iconBgClass: { type: String, default: 'bg-primary' },
    items: { type: Array, required: true }
});
</script>