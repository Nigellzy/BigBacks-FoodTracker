<template>
  <div id="app">
    <Layout 
      :active-tab="activeTab" 
      @tab-change="handleTabChange"
      :notifications="notifications"
      :user-profile="userProfile"
    >
      <component :is="currentComponent" 
        :food-items="foodItems"
        :custom-recipes="customRecipes"
        :bookmarked-recipes="bookmarkedRecipes"
        :waste-history="wasteHistory"
        :usage-history="usage-history"
        :user-score="userScore"
        :user-rank="5"
        :initial-search-term="recipeSearchTerm"
        @use-item="handleUseItem"
        @edit-item="handleEditItem"
        @add-food="handleAddFood"
        @add-custom-recipe="handleAddCustomRecipe"
        @bookmark-recipe="handleBookmarkRecipe"
        @mark-as-read="handleMarkNotificationRead"
        @update-profile="handleUpdateProfile"
        @find-recipe="handleFindRecipe"
      />
    </Layout>

    <!-- Floating Add Food Button - Only show on dashboard -->
    <button
      v-if="activeTab === 'dashboard'"
      @click="showAddFoodModal = true"
      class="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white z-50 transition-all duration-200 hover:scale-105 whitespace-nowrap"
    >
      <span class="mr-2">+</span> Add Food
    </button>

    <!-- Add Food Modal -->
    <div v-if="showAddFoodModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-4">Add Food Item</h2>
        <p class="mb-4 text-gray-600">Log your groceries to track expiration and reduce waste</p>
        <AddFood @add-food="handleAddFoodFromModal" @close="showAddFoodModal = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Layout from './components/Layout.vue';
import Dashboard from './components/Dashboard.vue';
import AddFood from './components/AddFood.vue';
import Recipes from './components/Recipes.vue';
import Analytics from './components/Analytics.vue';
import Leaderboard from './components/Leaderboard.vue';
import Profile from './components/Profile.vue';
import Notifications from './components/Notifications.vue';
import Tools from './components/Tools.vue';
import Community from './components/Community.vue';

// State
const activeTab = ref('dashboard');
const previousTab = ref('dashboard');
const showAddFoodModal = ref(false);
const recipeSearchTerm = ref('');
const foodItems = ref([]);
const userScore = ref(1950);
const wasteHistory = ref([]);
const usageHistory = ref([]);
const customRecipes = ref([]);
const bookmarkedRecipes = ref([]);
const notifications = ref([]);
const userProfile = ref({
  name: 'Alex Smith',
  email: 'alex@example.com',
  streakDays: 4,
  totalSaved: 156.78,
  wasteReduction: 73
});

// Initial Data
onMounted(() => {
  const sampleItems = [
    {
      id: '1',
      name: 'Apples',
      expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      quantity: 6,
      unit: 'pieces',
      price: 3.99,
      category: 'Fruits & Vegetables'
    },
    {
      id: '2',
      name: 'Milk',
      expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      quantity: 1,
      unit: 'liter',
      price: 2.49,
      category: 'Dairy & Eggs'
    },
    {
      id: '3',
      name: 'Chicken Breast',
      expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      quantity: 500,
      unit: 'grams',
      price: 8.99,
      category: 'Meat & Poultry'
    },
    {
      id: '4',
      name: 'Bread',
      expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      quantity: 1,
      unit: 'loaf',
      price: 2.99,
      category: 'Bakery'
    },
    {
      id: '5',
      name: 'Yogurt',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      quantity: 4,
      unit: 'cups',
      price: 4.99,
      category: 'Dairy & Eggs'
    }
  ];
  foodItems.value = sampleItems;

  const sampleWaste = [
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      itemName: 'Lettuce',
      value: 2.99,
      category: 'Fruits & Vegetables'
    },
    {
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      itemName: 'Bananas',
      value: 1.99,
      category: 'Fruits & Vegetables'
    }
  ];
  wasteHistory.value = sampleWaste;

  const sampleUsage = [
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      itemName: 'Eggs',
      value: 3.49,
      category: 'Dairy & Eggs'
    },
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      itemName: 'Tomatoes',
      value: 4.99,
      category: 'Fruits & Vegetables'
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      itemName: 'Ground Beef',
      value: 6.99,
      category: 'Meat & Poultry'
    }
  ];
  usageHistory.value = sampleUsage;

  const sampleNotifications = [
    {
      id: '1',
      title: 'Food Expiring Soon!',
      message: 'Your milk expires in 1 day',
      type: 'expiration',
      date: new Date(),
      isRead: false,
      foodItemId: '2'
    },
    {
      id: '2',
      title: 'Achievement Unlocked!',
      message: 'You saved $50 this month',
      type: 'achievement',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false
    },
    {
      id: '3',
      title: 'Recipe Suggestion',
      message: 'Try apple pie with your expiring apples',
      type: 'reminder',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true
    }
  ];
  notifications.value = sampleNotifications;
});

// Methods
const handleTabChange = (newTab) => {
  if (newTab === 'notifications' && activeTab.value !== 'notifications') {
    previousTab.value = activeTab.value;
  }
  if (newTab !== 'recipes') {
    recipeSearchTerm.value = '';
  }
  activeTab.value = newTab;
};

const handleAddFood = (newFood) => {
  const foodWithId = {
    ...newFood,
    id: Math.random().toString(36).substr(2, 9)
  };
  foodItems.value = [...foodItems.value, foodWithId];
  userScore.value += 25;
  showAddFoodModal.value = false;
};

const handleUseItem = (itemId, usedQuantity) => {
  const item = foodItems.value.find(f => f.id === itemId);
  if (item) {
    const quantityUsed = usedQuantity || item.quantity;
    const proportionalValue = (item.price * quantityUsed) / item.quantity;

    const usageEntry = {
      date: new Date(),
      itemName: item.name,
      value: proportionalValue,
      category: item.category
    };
    usageHistory.value = [...usageHistory.value, usageEntry];

    if (quantityUsed >= item.quantity) {
      foodItems.value = foodItems.value.filter(f => f.id !== itemId);
    } else {
      foodItems.value = foodItems.value.map(f =>
        f.id === itemId ? { ...f, quantity: f.quantity - quantityUsed } : f
      );
    }

    userScore.value += Math.floor(proportionalValue);
  }
};

const handleEditItem = (itemId, updatedItem) => {
  foodItems.value = foodItems.value.map(f =>
    f.id === itemId ? { ...f, ...updatedItem } : f
  );
};

const handleAddFoodFromModal = (newFood) => {
  handleAddFood(newFood);
};

const handleAddCustomRecipe = (recipe) => {
  const newRecipe = {
    ...recipe,
    id: Math.random().toString(36).substr(2, 9),
    isCustom: true
  };
  customRecipes.value = [...customRecipes.value, newRecipe];
  userScore.value += 25;
};

const handleBookmarkRecipe = (recipeId) => {
  bookmarkedRecipes.value = bookmarkedRecipes.value.includes(recipeId)
    ? bookmarkedRecipes.value.filter(id => id !== recipeId)
    : [...bookmarkedRecipes.value, recipeId];
};

const handleMarkNotificationRead = (notificationId) => {
  notifications.value = notifications.value.map(n =>
    n.id === notificationId ? { ...n, isRead: true } : n
  );
};

const handleUpdateProfile = (updatedProfile) => {
  userProfile.value = { ...userProfile.value, ...updatedProfile };
};

const handleFindRecipe = (item) => {
  recipeSearchTerm.value = item.name;
  activeTab.value = 'recipes';
};

// Computed property for dynamic component
const currentComponent = computed(() => {
  const components = {
    dashboard: Dashboard,
    recipes: Recipes,
    analytics: Analytics,
    leaderboard: Leaderboard,
    profile: Profile,
    tools: Tools,
    community: Community,
    notifications: Notifications
  };
  return components[activeTab.value] || Dashboard;
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.fixed {
  position: fixed;
}

.bottom-6 {
  bottom: 1.5rem;
}

.right-6 {
  right: 1.5rem;
}

.h-14 {
  height: 3.5rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, #3b82f6, #9333ea);
}

.text-white {
  color: #ffffff;
}

.z-50 {
  z-index: 50;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.whitespace-nowrap {
  white-space: nowrap;
}

.inset-0 {
  inset: 0px;
}

.bg-black {
  background-color: #000000;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.max-w-2xl {
  max-width: 42rem;
}

.max-h-\[90vh\] {
  max-height: 90vh;
}

.overflow-y-auto {
  overflow-y: auto;
}

.p-6 {
  padding: 1.5rem;
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.text-gray-600 {
  color: #4b5563;
}
</style>

<!-- <template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="We will change this file" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template> -->

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
