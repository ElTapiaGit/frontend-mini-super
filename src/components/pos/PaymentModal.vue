<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm transition-all">
      <div class="bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center border border-white/20 relative">
        
        <div class="flex justify-between items-center mb-8">
          <span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-[10px] font-bold uppercase tracking-tighter flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant animate-pulse"></span>
            Waiting for Payment
          </span>
          <button @click="$emit('close')" class="text-on-surface-variant hover:text-error bg-surface rounded-full p-1 transition-colors">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        
        <div class="mb-8">
          <h2 class="font-headline text-2xl font-black text-on-surface mb-2">Scan QR Code</h2>
          <p class="text-sm text-on-surface-variant">Total to pay: <span class="font-bold text-primary">{{ formatCurrency(total) }}</span></p>
        </div>

        <div class="relative inline-block p-6 bg-white rounded-3xl shadow-inner mb-8 group cursor-pointer" @click="$emit('success')">
          <div class="w-48 h-48 bg-tertiary-fixed-dim rounded-xl flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-80">
              <div class="bg-on-tertiary-fixed-variant rounded-sm col-span-2 row-span-2"></div>
              <div class="bg-on-tertiary-fixed-variant rounded-sm col-start-5 col-span-2 row-span-2"></div>
              <div class="bg-on-tertiary-fixed-variant rounded-sm row-start-5 col-span-2 row-span-2"></div>
              <div class="bg-on-tertiary-fixed-variant rounded-sm col-start-3 row-start-3 w-4 h-4"></div>
              <div class="bg-on-tertiary-fixed-variant rounded-sm col-start-4 row-start-4 w-4 h-4"></div>
              <div class="bg-on-tertiary-fixed-variant rounded-sm col-start-3 row-start-5 w-4 h-4"></div>
              <div class="bg-on-tertiary-fixed-variant rounded-sm col-start-5 row-start-4 w-4 h-4"></div>
            </div>
            <span class="material-symbols-outlined text-on-tertiary-fixed-variant text-5xl z-10">contactless</span>
          </div>

          <div 
            class="absolute inset-0 bg-secondary rounded-3xl flex flex-col items-center justify-center transition-all duration-500"
            :class="isSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
          >
            <span class="material-symbols-outlined text-white text-6xl mb-2">check_circle</span>
            <span class="text-white font-bold text-sm">Approved</span>
          </div>
        </div>

        <button @click="$emit('close')" class="w-full mt-2 py-4 bg-surface text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
          Cancel Transaction
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({ isOpen: Boolean, total: Number, isSuccess: Boolean });
defineEmits(['close', 'success']);

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
</script>