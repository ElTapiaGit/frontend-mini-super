<template>
  <DashboardLayout>
    <div class="flex-1 flex w-full h-full min-h-0 bg-white rounded-2xl overflow-hidden border border-surface-variant/30 shadow-sm">
      
      <section class="flex-1 flex flex-col bg-surface-container-low min-w-0">
        
        <div class="p-6 shrink-0 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <div class="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
              <button 
                v-for="cat in categories" 
                :key="cat"
                @click="activeCategory = cat"
                :class="activeCategory === cat ? 'bg-primary text-white' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-white'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                {{ cat }}
              </button>
            </div>
            <span class="text-xs font-medium text-on-surface-variant shrink-0 ml-4">{{ filteredProducts.length }} Items Available</span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id" 
              :product="product"
              :cartQty="getCartQty(product.id)"
              :isSelected="getCartQty(product.id) > 0"
              @add="addToCart"
            />
            
            <div class="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:ring-2 hover:ring-secondary transition-all cursor-pointer group flex flex-col items-center justify-center text-center min-h-[180px]">
              <div class="aspect-square rounded-lg mb-3 overflow-hidden bg-surface-container-low flex items-center justify-center w-16 h-16 group-hover:bg-secondary/10 transition-colors">
                <span class="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-secondary transition-colors">category</span>
              </div>
              <h3 class="text-sm font-bold text-on-surface mb-1">Custom Item</h3>
              <span class="text-xs text-on-surface-variant">Manual Input</span>
            </div>
          </div>
        </div>
      </section>

      <aside class="w-[320px] lg:w-[400px] bg-white border-l border-surface-container flex flex-col shadow-xl z-10 shrink-0">
        
        <div class="p-6 border-b border-surface-container flex justify-between items-center shrink-0">
          <h2 class="font-headline font-extrabold text-xl tracking-tight">Current Order</h2>
          <button @click="clearCart" class="text-on-surface-variant hover:text-error transition-colors">
            <span class="material-symbols-outlined">delete_sweep</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          <div v-if="cart.length === 0" class="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-60">
            <span class="material-symbols-outlined text-6xl mb-4">shopping_cart</span>
            <p class="font-bold text-sm">Cart is empty</p>
          </div>

          <CartItem 
            v-for="(item, index) in cart" 
            :key="item.id" 
            :item="item" 
            @increase="increaseQty(index)"
            @decrease="decreaseQty(index)"
          />
        </div>

        <div class="p-6 bg-surface-container-low shrink-0">
          <div class="space-y-2 mb-6">
            <div class="flex justify-between text-sm text-on-surface-variant">
              <span>Subtotal</span><span>{{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm text-on-surface-variant">
              <span>Tax (8%)</span><span>{{ formatCurrency(tax) }}</span>
            </div>
            <div class="pt-4 flex justify-between items-end border-t border-surface-variant/30 mt-2">
              <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Amount</span>
              <span class="text-3xl font-headline font-black text-primary">{{ formatCurrency(total) }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button @click="paymentMethod = 'cash'" :class="paymentMethod === 'cash' ? 'ring-2 ring-primary bg-white shadow-md' : 'bg-surface-container-highest hover:bg-white'" class="py-4 text-on-surface font-bold rounded-xl flex flex-col items-center gap-1 transition-all">
              <span class="material-symbols-outlined">payments</span>
              <span class="text-[10px]">Cash</span>
            </button>
            <button @click="paymentMethod = 'qr'" :class="paymentMethod === 'qr' ? 'ring-2 ring-secondary bg-secondary-container text-on-secondary-container shadow-md' : 'bg-surface-container-highest hover:bg-white text-on-surface'" class="py-4 font-bold rounded-xl flex flex-col items-center gap-1 transition-all">
              <span class="material-symbols-outlined">qr_code_2</span>
              <span class="text-[10px]">QR / Digital</span>
            </button>
          </div>

          <button @click="processPayment" :disabled="cart.length === 0" class="w-full mt-3 py-5 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Process Payment
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </aside>

      <PaymentModal 
        :isOpen="isQrModalOpen" 
        :total="total" 
        :isSuccess="paymentSuccess"
        @close="closeQrModal" 
        @success="simulatePaymentSuccess"
      />

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../../layouts/DashboardLayout.vue';
import ProductCard from '../../components/pos/ProductCard.vue';
import CartItem from '../../components/pos/CartItem.vue';
import PaymentModal from '../../components/pos/PaymentModal.vue';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

// MOCKS & ESTADO
const categories = ref(['All Items', 'Beverages', 'Snacks', 'Fresh Produce', 'Bakery']);
const activeCategory = ref('All Items');
const searchQuery = ref('');

// Extraído de tu HTML
const allProducts = ref([
  { id: 1, name: 'Whole Organic Milk', category: 'Beverages', size: '1 Gallon', price: 4.99, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Sourdough Loaf', category: 'Bakery', size: '500g', price: 6.50, image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Valencia Oranges', category: 'Fresh Produce', size: 'Per lb', price: 1.25, image: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Guatemala Roast', category: 'Beverages', size: '12oz Bag', price: 14.00, image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&auto=format&fit=crop&q=60' },
  { id: 5, name: 'Greek Yogurt', category: 'Snacks', size: 'Plain 32oz', price: 5.99, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60' },
  { id: 6, name: 'Linguine Pasta', category: 'Snacks', size: '16oz Box', price: 3.49, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&auto=format&fit=crop&q=60' },
  { id: 7, name: 'Hass Avocado', category: 'Fresh Produce', size: 'Each', price: 1.99, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60' },
]);

const filteredProducts = computed(() => {
  let result = allProducts.value;
  if (activeCategory.value !== 'All Items') {
    result = result.filter(p => p.category === activeCategory.value);
  }
  return result;
});

// LÓGICA DE CARRITO
const cart = ref([]);
const taxRate = 0.08;
const paymentMethod = ref('cash');

const getCartQty = (id) => {
  const item = cart.value.find(i => i.id === id);
  return item ? item.qty : 0;
};

const addToCart = (product) => {
  const item = cart.value.find(i => i.id === product.id);
  if (item) item.qty++;
  else cart.value.push({ ...product, qty: 1 });
};

const increaseQty = (index) => cart.value[index].qty++;
const decreaseQty = (index) => {
  if (cart.value[index].qty > 1) cart.value[index].qty--;
  else cart.value.splice(index, 1);
};
const clearCart = () => cart.value = [];

const subtotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0));
const tax = computed(() => subtotal.value * taxRate);
const total = computed(() => subtotal.value + tax.value);

// LÓGICA DE PAGO
const isQrModalOpen = ref(false);
const paymentSuccess = ref(false);

const processPayment = () => {
  if (paymentMethod.value === 'qr') {
    isQrModalOpen.value = true;
    paymentSuccess.value = false;
  } else {
    alert(`Cash payment registered: ${formatCurrency(total.value)}`);
    clearCart();
  }
};

const closeQrModal = () => isQrModalOpen.value = false;
const simulatePaymentSuccess = () => {
  paymentSuccess.value = true;
  setTimeout(() => {
    closeQrModal();
    clearCart();
  }, 1500);
};
</script>