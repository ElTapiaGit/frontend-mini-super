<template>
  <div v-if="isSpecialCard" class="p-6 bg-primary-container rounded-xl shadow-sm space-y-4 text-white relative overflow-hidden">
    <div class="absolute -right-4 -bottom-4 opacity-10">
      <span class="material-symbols-outlined text-8xl">groups</span>
    </div>
    <div class="flex justify-between items-start">
      <div class="p-2 bg-white/10 rounded-lg">
        <span class="material-symbols-outlined text-white">{{ icon }}</span>
      </div>
    </div>
    <div class="relative z-10">
      <p class="text-xs font-bold uppercase tracking-widest text-white/60">{{ title }}</p>
      <h2 class="text-2xl font-extrabold font-headline">{{ value }}</h2>
    </div>
  </div>

  <div v-else class="p-6 bg-white rounded-xl shadow-sm space-y-4" :class="borderClass">
    <div class="flex justify-between items-start">
      <div class="p-2 rounded-lg" :class="iconBgClass">
        <span class="material-symbols-outlined" :class="iconColorClass">{{ icon }}</span>
      </div>
      <span v-if="badge" class="text-xs font-bold" :class="badgeColorClass">{{ badge }}</span>
    </div>
    <div>
      <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{{ title }}</p>
      <h2 class="text-2xl font-extrabold font-headline" :class="valueColorClass">{{ value }}</h2>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true },
  iconColorClass: { type: String, default: 'text-on-surface' },
  iconBgClass: { type: String, default: 'bg-surface-variant' },
  badge: { type: String, default: '' },
  badgeColorClass: { type: String, default: 'text-secondary' },
  valueColorClass: { type: String, default: 'text-on-surface' },
  borderClass: { type: String, default: '' },
  isSpecialCard: { type: Boolean, default: false }
});
</script>