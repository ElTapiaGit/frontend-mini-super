<template>
  <div class="glass-card p-8 rounded-xl flex flex-col gap-6 h-full">
    <h4 class="text-lg font-headline font-bold">Top-selling products</h4>
    
    <div class="space-y-6 flex-1">
      <div v-for="product in products" :key="product.id" class="space-y-2">
        <div class="flex justify-between items-center text-sm">
          <span class="font-bold">{{ product.name }}</span>
          <span class="text-on-surface-variant">{{ product.sold.toLocaleString() }} Sold</span>
        </div>
        <div class="h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 rounded-full transition-all duration-1000" :style="`width: ${product.percentage}%`"></div>
        </div>
      </div>
    </div>

    <button @click="$emit('view-details')" class="mt-4 text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1 w-fit">
      View Detailed Inventory
      <span class="material-symbols-outlined text-sm">arrow_forward</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  products: { type: Array, required: true }
});
defineEmits(['view-details']);
</script>