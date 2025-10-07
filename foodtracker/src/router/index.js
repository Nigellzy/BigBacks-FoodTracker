import { createRouter, createWebHistory } from 'vue-router';

// Adjust imports to match your directory structure:
import Dashboard from '@/components/Dashboard.vue';
import Recipes from '@/components/Recipes.vue';
import Community from '@/components/Community.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import Notifications from '@/components/Notifications.vue';
import Profile from '@/components/Profile.vue';
import Analytics from '@/components/Analytics.vue';


const routes = [
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/recipes', name: 'recipes', component: Recipes },
  { path: '/community', name: 'community', component: Community },
  { path: '/analytics', name: 'analytics', component: Analytics },
  { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
  { path: '/notifications', name: 'notifications', component: Notifications },
  { path: '/profile', name: 'profile', component: Profile }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
