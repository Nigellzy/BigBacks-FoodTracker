<template>
  <div class="p-4 sm:p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl">Dashboard</h1>
        <p class="text-muted-foreground">Track your food inventory and reduce waste</p>
      </div>
    </div>

    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Food Score</h3>
          <span class="icon text-muted-foreground">📈</span>
        </div>
        <div class="card-content">
          <div class="text-2xl">{{ props.userScore }}</div>
          <div class="progress" :style="{ width: `${(props.userScore / 3000) * 100}%` }"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Expiring Soon</h3>
          <span class="icon text-muted-foreground">⚠️</span>
        </div>
        <div class="card-content">
          <div class="text-2xl">{{ soonToExpire.length }}</div>
          <p class="text-xs text-muted-foreground">Items to use soon</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Inventory Value</h3>
          <span class="icon text-muted-foreground">$</span>
        </div>
        <div class="card-content">
          <div class="text-2xl">${{ inventoryValue.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">Total tracked</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Waste Prevention</h3>
          <span class="icon text-muted-foreground">🗑️</span>
        </div>
        <div class="card-content">
          <div class="text-2xl">{{ expiredItems.length }}</div>
          <p class="text-xs text-muted-foreground">Expired items</p>
        </div>
      </div>
    </div>

    <!-- Food Inventory -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Food Inventory</h3>
        <p class="card-description">Your tracked food items</p>
      </div>
      <div class="card-content">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div class="relative flex-1 w-full sm:w-auto">
            <span class="absolute left-3 top-2.5 icon">🔍</span>
            <input
              v-model="searchTerm"
              placeholder="Search food items..."
              class="pl-10 w-full"
            />
          </div>
          <select v-model="categoryFilter" class="w-full sm:w-auto">
            <option value="all">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="sortBy" class="w-full sm:w-auto">
            <option value="expiration">Sort by Expiration</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
          <button @click="props.onAddFood" class="button">
            <span class="icon mr-2">+</span> Add Food
          </button>
        </div>
        <div v-if="filteredItems.length === 0" class="text-center py-8">
          <span class="icon h-12 w-12 mx-auto mb-4">🍎</span>
          <p>No items in inventory. Add some food to get started!</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="item in filteredItems" :key="item.id" class="flex items-center justify-between gap-4 p-4 rounded-lg border hover:bg-accent">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-3 flex-wrap">
                <h3 class="font-medium">{{ item.name }}</h3>
                <span class="badge" :class="getUrgencyColor(daysLeft(item))">
                  {{ daysLeft(item) >= 0 ? `${daysLeft(item)} days left` : `Expired ${Math.abs(daysLeft(item))} days ago` }}
                </span>
              </div>
              <div class="text-sm text-muted-foreground space-y-1">
                <div class="flex flex-wrap gap-2 sm:gap-4">
                  <span>Qty: {{ item.quantity }} {{ item.unit }}</span>
                  <span>{{ item.category }}</span>
                  <span>${{ item.price.toFixed(2) }}</span>
                </div>
                <div class="font-medium text-foreground">
                  Expires: {{ item.expirationDate.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                </div>
              </div>
            </div>
            <div class="flex gap-2 sm:flex-col lg:flex-row">
              <button class="button outline" @click="editItem(item)">
                Edit
              </button>
              <button class="button outline" @click="props.onFindRecipe(item)">
                <span class="icon">👨‍🍳</span> Recipe
              </button>
              <button class="button primary" @click="useItem(item)">
                Use
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent Activity</h3>
        <p class="card-description">Your latest food management actions</p>
      </div>
      <div class="card-content">
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center py-2 border-b">
            <span>Added 2 apples to inventory</span>
            <span class="text-muted-foreground">2 hours ago</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b">
            <span class="text-green-600">Used milk before expiration (+50 points)</span>
            <span class="text-muted-foreground">1 day ago</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b">
            <span>Found 3 recipes with your ingredients</span>
            <span class="text-muted-foreground">2 days ago</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  foodItems: Array,
  onUseItem: Function,
  onEditItem: Function,
  onAddFood: Function,
  onFindRecipe: Function,
  userScore: Number
});

const soonToExpire = ref([]);
const searchTerm = ref('');
const categoryFilter = ref('all');
const sortBy = ref('expiration');

const filteredItems = computed(() => {
  return props.foodItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      const matchesCategory = categoryFilter.value === 'all' || item.category === categoryFilter.value;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy.value) {
        case 'expiration':
          return a.expirationDate.getTime() - b.expirationDate.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
});

const categories = computed(() => [...new Set(props.foodItems.map(item => item.category))]);

const inventoryValue = computed(() => props.foodItems.reduce((sum, item) => sum + item.price, 0));

const expiredItems = computed(() => props.foodItems.filter(item => daysLeft(item) < 0));

const getUrgencyColor = (days) => {
  if (days <= 1) return 'destructive';
  if (days <= 3) return 'secondary';
  return 'default';
};

const daysLeft = (item) => {
  return Math.ceil((item.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
};

onMounted(() => {
  const today = new Date();
  const expiringSoon = props.foodItems
    .map(item => ({
      ...item,
      daysLeft: Math.ceil((item.expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      potentialLoss: item.price
    }))
    .filter(item => item.daysLeft <= 7 && item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  soonToExpire.value = expiringSoon;
});
</script>