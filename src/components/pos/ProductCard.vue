<template>
  <div 
    @click="$emit('add', product)"
    class="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:ring-2 hover:ring-secondary transition-all cursor-pointer group"
    :class="{'border-2 border-secondary/20 bg-secondary-container/10': isSelected}"
  >
    <div class="aspect-square rounded-lg mb-3 overflow-hidden bg-surface-container-low relative">
      <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      
      <div v-if="cartQty > 0" class="absolute top-2 right-2 bg-secondary text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10">
        {{ cartQty }}
      </div>
    </div>
    <div class="flex gap-2 items-center mb-1">
      <h3 class="text-sm font-bold text-on-surface line-clamp-1">{{ product.name }}</h3>
    </div>
    <div class="flex justify-between items-center">
      <span class="text-xs text-on-surface-variant">{{ product.size }}</span>
      <span class="text-sm font-bold text-secondary">{{ formatCurrency(product.price) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object,
  cartQty: { type: Number, default: 0 },
  isSelected: { type: Boolean, default: false }
});
defineEmits(['add']);

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
</script>