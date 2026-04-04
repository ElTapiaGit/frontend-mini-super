<template>
  <div 
    class="p-6 rounded-xl relative overflow-hidden group" 
    :class="isDark ? 'bg-gradient-to-br from-primary to-primary-container text-white' : 'glass-card'"
  >
    <div 
      class="absolute p-4 opacity-10 group-hover:opacity-20 transition-opacity"
      :class="isDark ? '-right-4 -bottom-4 opacity-20' : 'top-0 right-0'"
    >
      <span class="material-symbols-outlined" :class="[isDark ? 'text-8xl' : 'text-6xl', iconColor]">{{ bgIcon }}</span>
    </div>
    
    <p class="label-sm font-label uppercase tracking-widest mb-2" :class="isDark ? 'text-primary-fixed-dim' : 'text-on-surface-variant'">
      {{ title }}
    </p>
    
    <div class="flex items-baseline gap-2">
      <h3 class="text-4xl font-headline font-extrabold" :class="isDark ? 'text-secondary-fixed' : ''">
        {{ value }}
      </h3>
      <span class="text-sm font-bold flex items-center" :class="trendColor">
        <span class="material-symbols-outlined text-sm">{{ trendIcon }}</span> {{ trendValue }}%
      </span>
    </div>
    
    <p class="text-xs mt-4" :class="isDark ? 'text-primary-fixed-dim' : 'text-on-surface-variant'">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  subtitle: String,
  bgIcon: String,
  iconColor: String,
  trendValue: [String, Number],
  trendIcon: String,
  trendColor: String,
  isDark: { type: Boolean, default: false }
});
</script>