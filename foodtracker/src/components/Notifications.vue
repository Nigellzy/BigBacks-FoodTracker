<template>
  <div class="p-6 space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button v-if="props.onBack" class="button ghost icon shrink-0" @click="props.onBack">
          <span class="icon">←</span>
        </button>
        <div>
          <h1 class="text-2xl">Notifications</h1>
          <p class="text-muted-foreground">Stay updated on your food and achievements</p>
        </div>
      </div>
      <span class="badge secondary">{{ unreadNotifications.length }} unread</span>
    </div>

    <!-- Unread Notifications -->
    <div v-if="unreadNotifications.length > 0" class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <span class="icon">🔔</span> Unread ({{ unreadNotifications.length }})
        </h3>
      </div>
      <div class="card-content space-y-4">
        <div v-for="notification in unreadNotifications" :key="notification.id" class="flex items-start gap-4 p-4 rounded-lg border-l-4" :class="getNotificationColor(notification.type)">
          <div class="flex-shrink-0">
            {{ getNotificationIcon(notification.type) }}
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-medium">{{ notification.title }}</h3>
                <p class="text-sm text-muted-foreground mt-1">{{ notification.message }}</p>
              </div>
              <p class="text-xs text-muted-foreground whitespace-nowrap">{{ formatTimeAgo(notification.date) }}</p>
            </div>
          </div>
          
          <button class="button ghost icon flex-shrink-0" @click="props.onMarkAsRead(notification.id)">
            <span class="icon">✓</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent Activity</h3>
        <p class="card-description">Your latest notifications and updates</p>
      </div>
      <div class="card-content space-y-4">
        <div v-if="readNotifications.length > 0">
          <div v-for="(notification, index) in readNotifications" :key="notification.id">
            <div class="flex items-start gap-4 p-3 rounded-lg hover:bg-accent">
              <div class="flex-shrink-0 opacity-60">
                {{ getNotificationIcon(notification.type) }}
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-sm opacity-80">{{ notification.title }}</h3>
                <p class="text-sm text-muted-foreground mt-1">{{ notification.message }}</p>
                <p class="text-xs text-muted-foreground mt-2">{{ formatTimeAgo(notification.date) }}</p>
              </div>
            </div>
            <div v-if="index < readNotifications.length - 1" class="separator my-2"></div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-muted-foreground">
          <span class="icon h-12 w-12 mx-auto mb-4">🔔</span>
          <p>No previous notifications</p>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Quick Actions</h3>
        <p class="card-description">Manage your notification preferences</p>
      </div>
      <div class="card-content space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 border rounded-lg">
            <div class="flex items-center gap-3 mb-2">
              <span class="icon text-orange-500">⚠️</span>
              <h3 class="font-medium">Expiration Alerts</h3>
            </div>
            <p class="text-sm text-muted-foreground mb-3">Get notified when food is about to expire</p>
            <span class="badge text-xs">Daily at 9 AM</span>
          </div>
          <!-- other actions -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  notifications: Array,
  onMarkAsRead: Function,
  foodItems: Array,
  onBack: Function,
  previousTab: String
});

const unreadNotifications = computed(() => props.notifications.filter(n => !n.isRead));
const readNotifications = computed(() => props.notifications.filter(n => n.isRead));

const getNotificationIcon = (type) => {
  switch (type) {
    case 'expiration': return '⚠️';
    case 'achievement': return '🏆';
    case 'reminder': return '💡';
    default: return '🔔';
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'expiration': return 'border-l-orange-500 bg-orange-50';
    case 'achievement': return 'border-l-yellow-500 bg-yellow-50';
    case 'reminder': return 'border-l-blue-500 bg-blue-50';
    default: return 'border-l-gray-500 bg-gray-50';
  }
};

const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  return `${diffInDays} days ago`;
};
</script>