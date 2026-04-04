<template>
  <div class="flex items-center gap-4 group hover:bg-surface-container-low p-2 rounded-lg transition-colors">
    <div class="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
    </div>
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-bold text-on-surface truncate">{{ item.name }}</h4>
      <p class="text-xs text-on-surface-variant">{{ formatCurrency(item.price) }} x {{ item.qty }}</p>
    </div>
    <div class="text-right flex flex-col items-end">
      <p class="text-sm font-bold">{{ formatCurrency(item.price * item.qty) }}</p>
      
      <div class="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="$emit('decrease')" class="w-5 h-5 bg-surface-container-high rounded flex items-center justify-center hover:bg-error hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[14px]">remove</span>
        </button>
        <span class="text-xs font-bold w-3 text-center">{{ item.qty }}</span>
        <button @click="$emit('increase')" class="w-5 h-5 bg-surface-container-high rounded flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
          <span class="material-symbols-outlined text-[14px]">add</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object });
defineEmits(['increase', 'decrease']);

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
</script>