<template>
    <div class="min-h-screen flex items-stretch overflow-hidden bg-surface font-body antialiased">
        
        <div class="hidden lg:flex lg:w-1/2 relative bg-primary-container items-center justify-center p-12">
            <div class="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?q=80&w=2070&auto=format&fit=crop" 
                    alt="Supermercado Moderno" 
                    class="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />
                <div class="absolute inset-0 bg-linear-to-tr from-primary-container via-transparent to-transparent opacity-80"></div>
            </div>

            <div class="relative z-10 max-w-lg">
                <div class="mb-8 flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
                        <span class="material-symbols-outlined text-on-secondary-container text-3xl">architecture</span>
                    </div>
                    <h2 class="text-on-primary font-headline font-extrabold text-2xl tracking-tighter">ERP MiniSuper</h2>
                </div>
                <h1 class="text-on-primary font-headline font-extrabold text-5xl leading-tight mb-6">
                    Gestione su tienda con precisión.
                </h1>
                <p class="text-on-primary-container text-lg max-w-md font-medium leading-relaxed">
                    La interfaz de próxima generación para la gestión de datos minoristas de alta densidad y operaciones en tiempo real.
                </p>
            </div>

            <div class="absolute bottom-8 left-12 flex items-center gap-4 text-on-primary-container text-xs font-label tracking-widest uppercase opacity-60">
                <span>v1.0.0 Edición Profesional</span>
                <span class="w-1 h-1 rounded-full bg-on-primary-container"></span>
                <span>Cochabamba, Bolivia</span>
            </div>
        </div>

        <div class="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 md:px-12 relative bg-surface">
        
            <div class="absolute top-8 right-8 flex gap-6 text-on-surface-variant text-xs tracking-wide uppercase">
                <button class="hover:text-primary transition-colors flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">language</span> Español
                </button>
                <button class="hover:text-primary transition-colors flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">help</span> Soporte
                </button>
            </div>

            <div class="w-full max-w-md">
                <div class="lg:hidden mb-12 flex flex-col items-center">
                    <div class="w-16 h-16 rounded-xl bg-primary-container flex items-center justify-center mb-4">
                        <span class="material-symbols-outlined text-on-primary text-4xl">architecture</span>
                    </div>
                    <h1 class="text-primary font-headline font-extrabold text-2xl tracking-tighter">MiniSuper ERP</h1>
                </div>

                <div class="mb-10">
                    <h2 class="text-on-surface font-headline font-extrabold text-3xl tracking-tight mb-2">Bienvenido</h2>
                    <p class="text-on-surface-variant">Inicie sesión para acceder a su panel</p>
                </div>

                <div class="glass-panel p-8 md:p-10 rounded-xl border border-white/40 shadow-2xl relative overflow-visible">
                    <form @submit.prevent="handleLogin" class="space-y-8">
                    
                        <div class="relative floating-label-group">
                            <div class="absolute inset-y-0 left-0 flex items-center text-on-surface-variant">
                                <span class="material-symbols-outlined">mail</span>
                            </div>
                            <input 
                                v-model="form.username"
                                type="text"
                                id="username" 
                                placeholder=" "
                                class="peer block w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 focus:outline-none  transition-all text-on-surface"
                                :class="[errors.username ? 'border-error' : 'border-surface-variant']"
                            />
                           <label for="username" class="absolute left-8 top-3 text-on-surface-variant pointer-events-none text-sm">
                                Nombre de Usuario
                            </label>
                            <p v-if="errors.username" class="text-[10px] text-error mt-1 uppercase font-bold tracking-wider">{{ errors.username }}</p>
                        </div>

                        <div class="relative">
                            <div class="relative floating-label-group">
                                <div class="absolute inset-y-0 left-0 flex items-center text-on-surface-variant">
                                    <span class="material-symbols-outlined">lock</span>
                                </div>
                                <input 
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'" 
                                    id="password" 
                                    placeholder=" "
                                    class="peer block w-full pl-8 pr-12 py-3 bg-transparent border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 focus:outline-none  transition-all text-on-surface"
                                    :class="[errors.password ? 'border-error' : 'border-surface-variant']"
                                />
                                <label for="password" class="absolute left-8 top-3 text-on-surface-variant pointer-events-none text-sm">
                                    Contraseña
                                </label>
                                <button type="button" @click="showPassword = !showPassword" class="absolute right-0 top-3 text-on-surface-variant hover:text-primary">
                                    <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                                </button>
                            </div>
                            <p v-if="errors.password" class="text-[10px] text-error mt-1 uppercase font-bold tracking-wider">{{ errors.password }}</p>

                            <div v-if="authErrorMessage" class="absolute -bottom-10 left-0 bg-error text-on-error px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                                <span class="material-symbols-outlined text-sm">error</span>
                                {{ authErrorMessage }}
                            </div>
                        </div>

                        <div class="flex items-center justify-between pt-4">
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" v-model="form.remember" class="w-5 h-5 rounded border-surface-variant text-secondary focus:ring-secondary"/>
                                <span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Recordarme</span>
                            </label>
                            <a href="#" class="text-sm font-semibold text-primary hover:text-secondary transition-colors">¿Olvidó su contraseña?</a>
                        </div>

                        <button 
                            type="submit"
                            :disabled="loading"
                            class="w-full bg-secondary hover:bg-primary text-on-primary py-4 rounded-xl font-headline font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span v-if="loading" class="animate-spin material-symbols-outlined">sync</span>
                            <template v-else>
                                Ingresar al ERP
                                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </template>
                        </button>
                    </form>
                </div>

                <div class="mt-10 flex items-center gap-4">
                    <div class="h-px flex-1 bg-surface-variant"></div>
                    <span class="text-on-surface-variant text-[10px] tracking-widest uppercase">O usar llave de seguridad</span>
                    <div class="h-px flex-1 bg-surface-variant"></div>
                </div>

                <div class="mt-6">
                    <button class="w-full bg-surface-variant/20 hover:bg-surface-variant/40 text-on-surface py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 border border-outline-variant">
                        <span class="material-symbols-outlined">key</span>
                        Ingresar con Biometría o Yubikey
                    </button>
                </div>
            </div>

            <div class="absolute bottom-6 w-full px-12 flex justify-between items-center text-[10px] text-on-surface-variant tracking-wide uppercase">
                <span>© 2026 MiniSuper Precisión. Todos los derechos reservados.</span>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-primary">Privacidad</a>
                    <a href="#" class="hover:text-primary">Términos</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore} from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const loading = ref(false);
const authErrorMessage = ref('');

const form = reactive({
  username: '',
  password: ''
});

const errors = reactive({
  username: '',
  password: ''
});

const handleLogin = async () => {
  errors.username = '';
  errors.password = '';
  authErrorMessage.value = '';

  // 1. Validaciones de Frontend
  let hasError = false;
  
  if (!form.username) {
    errors.username = 'El nombre de usuario es obligatorio';
    hasError = true;
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria';
    hasError = true;
  } else if (form.password.length < 3) {
    errors.password = 'Mínimo 3 caracteres';
    hasError = true;
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria';
    hasError = true;
  } else if (form.password.length < 3) {
    errors.password = 'Mínimo 3 caracteres';
    hasError = true;
  }

  if (hasError) return;

  // 2. Llamada a API
  loading.value = true;
  
  try {
    const success = await authStore.login({
      username: form.username,
      password: form.password
    });
    
    if (success) {
      router.push('/dashboard');
    } else {
      // Este caso suele ser el 401 (Credenciales invalidas)
      authErrorMessage.value = 'Usuario o contraseña incorrectos.';
    }
  } catch (error) {
    console.error('Error de red:', error);
    authErrorMessage.value = error;
    authErrorMessage.value = 'Error de conexión. Verifique su internet o el estado del servidor.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.fill-icon {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* 💡 Lógica de los Labels Flotantes (Replicada de tu Mockup) */
.floating-label-group:focus-within label,
.floating-label-group input:not(:placeholder-shown) + label {
  transform: translateY(-1.5rem) scale(0.85);
  color: #006c49; /* Color 'secondary' de tu paleta */
  font-weight: 700;
}

.error-tooltip::after {
  content: '';
  position: absolute;
  top: -6px;
  left: 20px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #ba1a1a; /* Color 'error' */
}

/* Asegurar que el input no oculte el label al inicio */
input::placeholder {
  color: transparent;
}
</style>