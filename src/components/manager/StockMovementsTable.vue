<template>
  <div class="glass-card rounded-xl flex flex-col overflow-hidden h-full">
    <div class="p-8 pb-4 flex justify-between items-center shrink-0">
      <h4 class="text-lg font-headline font-bold">Stock Movements</h4>
      <button @click="$emit('view-all')" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
        View All Logs
      </button>
    </div>
    
    <div class="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8">
      <table class="w-full text-left">
        <thead class="sticky top-0 bg-white z-10">
          <tr>
            <th class="py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Action</th>
            <th class="py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Product</th>
            <th class="py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Qty</th>
            <th class="py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Time</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline-variant/30">
          <tr v-for="log in logs" :key="log.id">
            <td class="py-4">
              <span 
                class="px-2 py-1 text-[10px] font-bold rounded uppercase"
                :class="log.type === 'Entry' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ log.type }}
              </span>
            </td>
            <td class="py-4">
              <p class="text-sm font-bold">{{ log.product }}</p>
              <p class="text-[10px] text-on-surface-variant">SKU: {{ log.sku }}</p>
            </td>
            <td class="py-4 text-sm font-bold" :class="log.type === 'Entry' ? 'text-emerald-600' : 'text-error'">
              {{ log.type === 'Entry' ? '+' : '' }}{{ log.qty }}
            </td>
            <td class="py-4 text-xs text-on-surface-variant text-right">{{ log.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logs: { type: Array, required: true }
});
defineEmits(['view-all']);
</script>