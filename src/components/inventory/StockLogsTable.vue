<template>
  <div class="bg-white/80 backdrop-blur-xl border border-surface-variant/30 rounded-xl overflow-hidden shadow-sm h-full flex flex-col">
    
    <div class="p-6 border-b border-surface-variant/30 flex justify-between items-center bg-surface">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-secondary-container rounded-lg text-on-secondary-container">
          <span class="material-symbols-outlined">history</span>
        </div>
        <h2 class="text-lg font-bold font-headline">Historial de Movimientos</h2>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">filter_list</span> Filtrar
        </button>
        <button class="px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-xs font-bold rounded-lg transition-colors flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">download</span> CSV
        </button>
      </div>
    </div>

    <div class="overflow-x-auto flex-1">
      <table class="w-full text-left whitespace-nowrap">
        <thead class="bg-surface-container-low/50">
          <tr>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fecha y Hora</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Producto</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tipo</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Cantidad</th>
            <th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Usuario</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-variant/30">
          <tr v-for="log in logs" :key="log.id" class="hover:bg-surface transition-colors">
            <td class="px-6 py-4">
              <p class="text-sm font-medium">{{ log.date }}</p>
              <p class="text-[10px] text-slate-400 font-mono">{{ log.time }}</p>
            </td>
            
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span class="material-symbols-outlined text-sm">inventory_2</span>
                </div>
                <span class="text-sm font-bold">{{ log.productName }}</span>
              </div>
            </td>
            
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 text-[10px] font-bold rounded-full"
                :class="log.type === 'ENTRADA' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-error'"
              >
                {{ log.type }}
              </span>
            </td>
            
            <td class="px-6 py-4">
              <span class="text-sm font-extrabold" :class="log.type === 'ENTRADA' ? 'text-secondary' : 'text-error'">
                {{ log.type === 'ENTRADA' ? '+' : '-' }}{{ log.quantity }}
              </span>
            </td>
            
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <div class="h-6 w-6 rounded-full bg-primary-container text-white flex items-center justify-center text-[10px] font-bold">
                  {{ log.userName.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs font-semibold text-on-surface-variant">{{ log.userName }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="p-6 bg-surface flex items-center justify-between border-t border-surface-variant/30 shrink-0">
      <span class="text-xs text-on-surface-variant">Mostrando 1 a {{ logs.length }} de 128 resultados</span>
      <div class="flex items-center gap-2">
        <button class="h-8 w-8 rounded-lg flex items-center justify-center bg-white border border-surface-variant hover:bg-surface-container-high transition-all">
          <span class="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <button class="h-8 w-8 rounded-lg flex items-center justify-center bg-primary text-white font-bold text-xs">1</button>
        <button class="h-8 w-8 rounded-lg flex items-center justify-center bg-white border border-surface-variant hover:bg-surface-container-high transition-all text-xs">2</button>
        <button class="h-8 w-8 rounded-lg flex items-center justify-center bg-white border border-surface-variant hover:bg-surface-container-high transition-all text-xs">3</button>
        <button class="h-8 w-8 rounded-lg flex items-center justify-center bg-white border border-surface-variant hover:bg-surface-container-high transition-all">
          <span class="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  logs: { type: Array, required: true }
});
</script>