<template>
  <div class="p-6 rounded-xl relative overflow-hidden group" :class="isPrimary ? 'bg-linear-to-br from-primary to-primary-container text-white' : 'glass-card border border-surface-variant/20 shadow-sm'">
    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" :class="isPrimary ? 'bottom-0 top-auto right-auto' : ''">
      <span class="material-symbols-outlined text-6xl" :class="isPrimary ? 'text-8xl' : iconColor">{{ icon }}</span>
    </div>
    <p class="text-sm font-label uppercase tracking-widest mb-2" :class="isPrimary ? 'text-surface-variant' : 'text-on-surface-variant'">{{ title }}</p>
    <div class="flex items-baseline gap-2">
      <h3 class="text-4xl font-headline font-extrabold" :class="isPrimary ? 'text-secondary-container' : ''">{{ value }}</h3>
      <span class="text-sm font-bold flex items-center" :class="isPrimary ? 'text-secondary-container' : trendColor">
        <span class="material-symbols-outlined text-sm">{{ trendIcon }}</span> {{ trendValue }}%
      </span>
    </div>
    <p class="text-xs mt-4" :class="isPrimary ? 'text-surface-variant' : 'text-on-surface-variant'">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  subtitle: String,
  icon: String,
  iconColor: String,
  trendValue: [String, Number],
  trendIcon: String,
  trendColor: String,
  isPrimary: { type: Boolean, default: false }
});
</script>