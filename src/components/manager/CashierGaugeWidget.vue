<template>
  <div class="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center gap-4 h-full">
    <h4 class="text-lg font-headline font-bold mb-2">Cashier Performance</h4>
    
    <div class="relative w-40 h-40">
      <svg class="w-full h-full transform -rotate-90">
        <circle class="text-surface-container-high" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" stroke-width="12"></circle>
        <circle 
          class="text-emerald-500 transition-all duration-1000" 
          cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" 
          stroke-dasharray="440" 
          :stroke-dashoffset="440 - (440 * performance.efficiency / 100)" 
          stroke-width="12"
        ></circle>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-extrabold font-headline">{{ performance.efficiency }}%</span>
        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Efficiency</span>
      </div>
    </div>
    
    <div class="space-y-1">
      <p class="font-bold text-sm">Avg. Checkout Time</p>
      <p class="text-2xl font-headline font-bold text-emerald-600">{{ performance.avgTime }}</p>
      <p class="text-xs text-on-surface-variant">Target: {{ performance.targetTime }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  performance: {
    type: Object,
    required: true
  }
});
</script>