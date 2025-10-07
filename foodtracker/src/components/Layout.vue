<template>
  <div class="flex h-screen">
    <!-- Desktop Sidebar -->
    <div class="hidden w-64 flex-col border-r lg:flex">
      <div class="flex h-16 items-center justify-between border-b px-4">
        <h1 class="text-xl gradient-text font-semibold">🥬 FoodSaver</h1>
      </div>
      <nav class="flex-1 space-y-2 p-4">
        <button
          v-for="item in navigation"
          :key="item.id"
          @click="handleTabChange(item.id)"
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent"
          :class="{ 'bg-accent text-accent-foreground': props.activeTab === item.id, 'text-muted-foreground hover:text-foreground': props.activeTab !== item.id }"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.name }}
        </button>
      </nav>
      <div class="border-t p-4 space-y-2">
        <button 
          class="w-full justify-start relative button ghost"
          @click="handleTabChange('notifications')"
        >
          <span class="icon mr-3">🔔</span>
          Notifications
          <span v-if="unreadCount > 0" class="badge ml-auto">
            {{ unreadCount }}
          </span>
        </button>
        <button 
          class="w-full justify-start button ghost"
          @click="handleTabChange('profile')"
        >
          <span class="icon mr-3">👤</span>
          Profile
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Mobile Header -->
      <header class="lg:hidden flex h-16 items-center justify-justify-between gap-4 border-b px-4">
        <div class="flex items-center gap-3">
          <button class="button ghost icon" @click="mobileMenuOpen = true">
            <span class="icon">☰</span>
          </button>
          <h1 class="text-lg gradient-text font-semibold">🥬 FoodSaver</h1>
        </div>
        <div class="flex items-center gap-2">
          <button 
            class="button ghost icon relative"
            @click="handleTabChange('notifications')"
          >
            <span class="icon">🔔</span>
            <span v-if="unreadCount > 0" class="badge absolute -top-1 -right-1">
              {{ unreadCount }}
            </span>
          </button>
          <button 
            class="button ghost icon"
            @click="handleTabChange('profile')"
          >
            <div class="avatar">
              <span class="fallback">{{ props.userProfile.name.split(' ').map(n => n[0]).join('') }}</span>
            </div>
          </button>
        </div>
      </header>

      <!-- Desktop Header -->
      <header class="hidden lg:flex h-16 items-center justify-end gap-4 border-b px-6">
        <button 
          class="button ghost icon relative"
          @click="handleTabChange('notifications')"
        >
          <span class="icon">🔔</span>
          <span v-if="unreadCount > 0" class="badge absolute -top-1 -right-1">
            {{ unreadCount }}
          </span>
        </button>
        <button 
          class="button ghost flex items-center gap-2"
          @click="handleTabChange('profile')"
        >
          <div class="avatar">
            <span class="fallback">{{ props.userProfile.name.split(' ').map(n => n[0]).join('') }}</span>
          </div>
          <span class="hidden md:block">{{ props.userProfile.name }}</span>
        </button>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <slot></slot>
      </main>
    </div>

    <!-- Mobile Menu Sheet -->
    <div v-if="mobileMenuOpen" class="sheet">
      <div class="sheet-content left">
        <div class="flex h-16 items-center border-b px-4">
          <h1 class="text-xl gradient-text font-semibold">🥬 FoodSaver</h1>
        </div>
        <nav class="flex-1 space-y-2 p-4">
          <button
            v-for="item in navigation"
            :key="item.id"
            @click="handleTabChange(item.id)"
            class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent w-full"
            :class="{ 'bg-accent text-accent-foreground': props.activeTab === item.id, 'text-muted-foreground hover:text-foreground': props.activeTab !== item.id }"
          >
            <component :is="item.icon" class="h-4 w-4" />
            {{ item.name }}
          </button>
        </nav>
        <div class="border-t p-4 space-y-2">
          <button 
            class="w-full justify-start relative button ghost"
            @click="handleTabChange('notifications')"
          >
            <span class="icon mr-3">🔔</span>
            Notifications
            <span v-if="unreadCount > 0" class="badge ml-auto">
              {{ unreadCount }}
            </span>
          </button>
          <button 
            class="w-full justify-start button ghost"
            @click="handleTabChange('profile')"
          >
            <span class="icon mr-3">👤</span>
            Profile
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  activeTab: String,
  onTabChange: Function,
  notifications: Array,
  userProfile: Object
});

const mobileMenuOpen = ref(false);

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: 'HomeIcon' },
  { id: 'recipes', name: 'Recipes', icon: 'ChefHatIcon' },
  { id: 'community', name: 'Community', icon: 'UsersIcon' },
  // { id: 'analytics', name: 'Analytics', icon: 'BarChartIcon' },
  { id: 'leaderboard', name: 'Leaderboard', icon: 'TrophyIcon' },
];

const unreadCount = computed(() => props.notifications.filter(n => !n.isRead).length);

const handleTabChange = (tab) => {
  props.onTabChange(tab);
  mobileMenuOpen.value = false;
};
</script>