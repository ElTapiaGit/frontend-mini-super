<template>
  <div class="glass-card p-8 rounded-xl flex flex-col gap-6 h-full">
    <div class="flex justify-between items-center">
      <h4 class="text-lg font-headline font-bold">Sales Summary & Financial Growth</h4>
      <div class="flex gap-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span class="text-xs font-semibold text-on-surface-variant">Revenue</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-slate-300"></div>
          <span class="text-xs font-semibold text-on-surface-variant">Cost</span>
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-75 flex items-end justify-between px-4 pb-4 border-b border-outline-variant relative">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" alt="Chart Background" class="w-full h-full object-contain opacity-5 grayscale" />
      </div>
      
      <div 
        v-for="(day, index) in chartData" 
        :key="index" 
        class="w-12 bg-emerald-500/20 rounded-t-lg relative group cursor-pointer hover:bg-emerald-500/40 transition-all z-10" 
        :style="`height: ${day.containerHeight}%`"
      >
        <div class="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all" :style="`height: ${day.fillHeight}%`" :class="`group-hover:h-[${day.hoverHeight}%]`"></div>
      </div>
    </div>
    
    <div class="flex justify-between px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
      <span v-for="label in labels" :key="label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  chartData: { type: Array, required: true },
  labels: { type: Array, required: true }
});
</script>