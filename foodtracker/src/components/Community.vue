<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl">Community</h1>
        <p class="text-muted-foreground">Share and discover food items in your area</p>
      </div>
      <button class="button primary" @click="showCreateDialog = true">
        <span class="icon mr-2">+</span> Share Food
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1">
        <span class="absolute left-3 top-2.5 icon">🔍</span>
        <input
          v-model="searchTerm"
          placeholder="Search listings..."
          class="pl-10 w-full"
        />
      </div>
      <select v-model="filterCategory" class="w-full sm:w-auto">
        <option value="all">All Categories</option>
        <option value="Fruits & Vegetables">Fruits & Vegetables</option>
        <option value="Dairy & Eggs">Dairy & Eggs</option>
        <option value="Bakery">Bakery</option>
      </select>
      <button class="button outline w-full sm:w-auto">
        <span class="icon mr-2">📍</span> Near Me
      </button>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <div class="tabs-list">
        <button :class="{ active: activeTab === 'browse' }" @click="activeTab = 'browse'">Browse Listings</button>
        <button :class="{ active: activeTab === 'my-listings' }" @click="activeTab = 'my-listings'">My Listings</button>
      </div>
      <div v-if="activeTab === 'browse'" class="tabs-content space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="listing in filteredListings" :key="listing.id" class="card">
            <div class="card-header">
              <h3 class="card-title">{{ listing.title }}</h3>
              <p class="card-description">{{ listing.description }}</p>
            </div>
            <div class="card-content">
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="item in listing.foodItems" :key="item" class="badge">
                  {{ item }}
                </span>
              </div>
              <div class="space-y-3 text-sm text-muted-foreground">
                <div class="flex items-center gap-2">
                  <span class="icon">📍</span>
                  {{ listing.location }} ({{ listing.distance }} km)
                </div>
                <div class="flex items-center gap-2">
                  <span class="icon">⏰</span>
                  Expires in {{ listing.expiresIn }} hours
                </div>
              </div>
              <div class="flex items-center gap-3 mt-6">
                <div class="avatar">
                  <span class="fallback">{{ listing.user.name.split(' ').map(n => n[0]).join('') }}</span>
                </div>
                <div>
                  <h4 class="font-medium">{{ listing.user.name }}</h4>
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>⭐ {{ listing.user.rating }}</span>
                    <span>• {{ listing.user.totalShared }} shares</span>
                  </div>
                </div>
              </div>
              <button class="button primary mt-4 w-full" @click="openContactDialog(listing)">
                Contact
              </button>
              <button class="button outline mt-2" @click="toggleLike(listing.id)">
                <span class="icon">{{ likedListings.includes(listing.id) ? '❤️' : '♡' }}</span> Like
              </button>
            </div>
          </div>
        </div>
        <div v-if="filteredListings.length === 0" class="card text-center py-8">
          <span class="icon h-12 w-12 mx-auto mb-4">👥</span>
          <h3 class="font-medium mb-2">No listings found</h3>
          <p class="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      </div>
      <div v-if="activeTab === 'my-listings'" class="tabs-content">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Your Active Listings</h3>
            <p class="card-description">Manage your shared food items</p>
          </div>
          <div class="card-content text-center py-8 text-muted-foreground">
            <span class="icon h-12 w-12 mx-auto mb-4">👥</span>
            <p>You haven't shared any food items yet</p>
            <button class="button outline mt-4" @click="showCreateDialog = true">
              Share Your First Item
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Community Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card text-center pt-6">
        <div class="text-2xl font-semibold text-green-600">1,247</div>
        <p class="text-sm text-muted-foreground">Items Shared</p>
      </div>
      <div class="card text-center pt-6">
        <div class="text-2xl font-semibold text-blue-600">856</div>
        <p class="text-sm text-muted-foreground">Active Members</p>
      </div>
      <div class="card text-center pt-6">
        <div class="text-2xl font-semibold text-purple-600">$8,432</div>
        <p class="text-sm text-muted-foreground">Total Value Saved</p>
      </div>
    </div>

    <!-- Create Listing Dialog -->
    <div v-if="showCreateDialog" class="dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h2 class="dialog-title">Create New Listing</h2>
          <p class="dialog-description">Share your excess food with the community</p>
        </div>
        <form @submit.prevent="handleCreateListing">
          <!-- form fields -->
          <button type="submit" class="button primary">Create Listing</button>
        </form>
      </div>
    </div>

    <!-- Contact Dialog -->
    <div v-if="showContactDialog" class="dialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h2 class="dialog-title">Contact {{ selectedContactUser.name }}</h2>
          <p class="dialog-description">Get in touch to arrange pickup</p>
        </div>
        <!-- contact info -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  foodItems: Array,
  userProfile: Object
});

const searchTerm = ref('');
const filterCategory = ref('all');
const activeTab = ref('browse');
const showCreateDialog = ref(false);
const showContactDialog = ref(false);
const selectedContactUser = ref(null);
const likedListings = ref([]);

const newListing = ref({
  title: '',
  description: '',
  selectedItems: [],
  location: 'Downtown Singapore'
});

const listings = ref([
  // sample data from React
]);

const filteredListings = computed(() => {
  return listings.value.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      listing.foodItems.some(item => item.toLowerCase().includes(searchTerm.value.toLowerCase()));
    const matchesCategory = filterCategory.value === 'all' || listing.category === filterCategory.value;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.distance - b.distance);
});

// methods for handleCreateListing, openContactDialog, toggleLike, etc.
</script>