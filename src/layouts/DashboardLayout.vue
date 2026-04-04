<!--contiene elementos del Sidebar y Navbar cascaron y padre -->
<template>
  <div class="bg-background text-on-surface min-h-screen flex">
    
    <aside class="flex flex-col fixed left-0 h-screen w-64 bg-[#0F172A] shadow-2xl z-50">
      <div class="p-6 flex flex-col gap-1">
        <h1 class="text-xl font-bold text-white tracking-tight font-headline">MiniSuper ERP</h1>
        <p class="text-slate-400 text-xs font-medium tracking-wide uppercase opacity-70">Sistema POS</p>
      </div>

      <div class="px-4 mb-6">
        <button class="w-full py-3 px-4 bg-secondary text-white rounded-xl flex items-center justify-center gap-2 font-headline font-bold text-sm hover:opacity-90 transition-all">
          <span class="material-symbols-outlined text-lg">add_circle</span>
          Nueva Venta
        </button>
      </div>

      <nav class="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <router-link 
          v-for="item in menuItems" 
          :key="item.name"
          :to="item.route"
          class="flex items-center gap-3 px-4 py-3 rounded-lg font-headline text-sm font-medium tracking-wide transition-colors"
          :class="route.path === item.route ? 'text-white bg-slate-800/50 border-l-4 border-emerald-500' : 'text-slate-400 hover:text-white hover:bg-slate-800/30'"
        >
          <span class="material-symbols-outlined" :class="route.path === item.route ? 'text-emerald-500' : ''">{{ item.icon }}</span>
          {{ item.name }}
        </router-link>
      </nav>

      <div class="p-6 border-t border-slate-800 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-white font-bold">
            {{ userInitials }}
          </div>
          <div class="flex flex-col">
            <span class="text-white text-sm font-bold">{{ authStore.user?.name || 'Usuario' }}</span>
            <span class="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{{ authStore.user?.role }}</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="ml-64 flex-1 flex flex-col min-h-screen">
      
      <header class="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-surface-variant/20">
        <div class="flex items-center gap-4 w-1/3">
          <div class="relative w-full max-w-md focus-within:ring-2 focus-within:ring-secondary/20 transition-all rounded-lg overflow-hidden bg-surface-variant/30 px-4 flex items-center h-10">
            <span class="material-symbols-outlined text-on-surface-variant text-xl">search</span>
            <input type="text" placeholder="Buscar pedidos, inventario o usuarios..." class="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-body w-full px-2" />
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2 px-3 py-1 bg-surface-variant/50 rounded-full">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span class="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">{{ authStore.user?.role }}</span>
          </div>
          
          <div class="flex items-center gap-4">
            <button class="text-slate-500 hover:text-secondary transition-all">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <button @click="handleLogout" class="text-slate-500 hover:text-error transition-all" title="Cerrar Sesión">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </header>

      <div class="p-8 flex-1 flex flex-col">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U';
  return name.charAt(0).toUpperCase();
});

// Lógica de Menú Dinámico
const menuItems = computed(() => {
  const role = authStore.user?.role;
  const menu = [];

  if (role === 'Administrador') {
    menu.push({ name: 'Panel Principal', icon: 'dashboard', route: '/dashboard' });
    menu.push({ name: 'Usuarios', icon: 'group', route: '/users' });
    menu.push({ name: 'Productos', icon: 'inventory_2', route: '/products' });
    menu.push({ name: 'Categorías', icon: 'category', route: '/categories' });
    menu.push({ name: 'Historial', icon: 'history_edu', route: '/stock-logs' });
    menu.push({ name: 'Punto de Venta', icon: 'point_of_sale', route: '/pos' });
    menu.push({ name: 'Reportes', icon: 'analytics', route: '/reports' });
    
  } else if (role === 'Gerente') {
    menu.push({ name: 'Panel Gerencia', icon: 'dashboard', route: '/manager' });
    menu.push({ name: 'Usuarios', icon: 'group', route: '/users' });
    menu.push({ name: 'Productos', icon: 'inventory_2', route: '/products' });
    menu.push({ name: 'Categorías', icon: 'category', route: '/categories' });
    menu.push({ name: 'Historial', icon: 'history_edu', route: '/stock-logs' });
    menu.push({ name: 'Punto de Venta', icon: 'point_of_sale', route: '/pos' });
    menu.push({ name: 'Reportes', icon: 'analytics', route: '/reports' });
    
  } else if (role === 'Empleado') {
    menu.push({ name: 'Punto de Venta', icon: 'point_of_sale', route: '/pos' });
    menu.push({ name: 'Productos', icon: 'inventory_2', route: '/products' });
    menu.push({ name: 'Categorías', icon: 'category', route: '/categories' });
    menu.push({ name: 'Historial', icon: 'history_edu', route: '/stock-logs' });
    menu.push({ name: 'Dashboard', icon: 'dashboard', route: '/dashboard' });
    menu.push({ name: 'Usuarios', icon: 'group', route: '/users' });
    menu.push({ name: 'Reportes', icon: 'analytics', route: '/reports' });
  }

  return menu;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>