import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, role: 'Administrador' }
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import('../views/manager/ManagerDashboard.vue'),
      meta: { requiresAuth: true, role: 'Gerente' }
    },
    {
      path: '/pos',
      name: 'pos',
      component: () => import('../views/pos/PosView.vue'),
      meta: { requiresAuth: true, role: 'Empleado' }
    }
  ]
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  // Si la ruta requiere auth y NO esta logueado 
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/login';
  }

  // Si ya esta logueado e intenta entrar al Login 
  if (to.path === '/login' && isAuthenticated) { 
    if (userRole === 'Empleado') return '/pos';
    if (userRole === 'Gerente') return '/manager';
    return '/dashboard';
  }

  // 3. Protección de rutas por Rol (Seguridad extra)
  // Si un Empleado intenta entrar a /dashboard o /manager, lo mandamos a su POS
  if (to.meta.role && to.meta.role !== userRole) {
    if (userRole === 'Empleado') return '/pos';
    if (userRole === 'Gerente') return '/manager';
    if (userRole === 'Administrador') return '/dashboard';
  }

  return true;
})

export default router