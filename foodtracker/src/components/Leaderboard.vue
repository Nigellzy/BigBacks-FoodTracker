<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl">Leaderboard</h1>
        <p class="text-muted-foreground">See how you rank in food saving</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <div class="tabs-list">
        <button :class="{ active: activeTab === 'global' }" @click="activeTab = 'global'">Global</button>
        <button :class="{ active: activeTab === 'friends' }" @click="activeTab = 'friends'">Friends</button>
        <button :class="{ active: activeTab === 'achievements' }" @click="activeTab = 'achievements'">Achievements</button>
      </div>
      <div v-if="activeTab === 'global'" class="tabs-content space-y-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title flex items-center gap-2">
              <span class="icon text-yellow-500">🏆</span> Global Leaderboard
            </h3>
            <p class="card-description">Top food savers worldwide</p>
          </div>
          <div class="card-content">
            <div class="space-y-3">
              <div v-for="(user, index) in globalLeaderboard" :key="user.id" class="flex items-center justify-between p-4 rounded-lg border hover:bg-accent">
                <div class="flex items-center gap-4">
                  <span class="rank">{{ getRankIcon(index + 1) }}</span>
                  <div class="avatar">
                    <span class="fallback">{{ user.name.split(' ').map(n => n[0]).join('') }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ user.name }}</h4>
                    <span class="badge" :class="getBadgeColor(user.badge)">{{ user.badge }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-semibold">{{ user.score }}</div>
                  <p class="text-xs text-muted-foreground">🔥 {{ user.streak }} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'friends'" class="tabs-content space-y-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title flex items-center gap-2">
              <span class="icon text-blue-500">👥</span> Friends Leaderboard
            </h3>
            <p class="card-description">Compete with your friends and family</p>
          </div>
          <div class="card-content">
            <div class="space-y-3">
              <div v-for="(user, index) in friendsLeaderboard" :key="user.id" class="flex items-center justify-between p-4 rounded-lg border hover:bg-accent">
                <div class="flex items-center gap-4">
                  <span class="rank">{{ getRankIcon(index + 1) }}</span>
                  <div class="avatar">
                    <span class="fallback">{{ user.name.split(' ').map(n => n[0]).join('') }}</span>
                  </div>
                  <div>
                    <h4 class="font-medium">{{ user.name }}</h4>
                    <span class="badge" :class="getBadgeColor(user.badge)">{{ user.badge }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-semibold">{{ user.score }}</div>
                  <p class="text-xs text-muted-foreground">🔥 {{ user.streak }} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'achievements'" class="tabs-content space-y-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title flex items-center gap-2">
              <span class="icon text-purple-500">🏅</span> Achievements
            </h3>
            <p class="card-description">Unlock badges and earn points for your food-saving actions</p>
          </div>
          <div class="card-content">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="achievement in achievements" :key="achievement.id" class="p-4 rounded-lg border" :class="{ 'bg-green-50 border-green-200': achievement.completed }">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="p-2 rounded-full" :class="{ 'bg-green-100 text-green-600': achievement.completed, 'bg-gray-100 text-gray-600': !achievement.completed }">
                      <span class="icon h-4 w-4">{{ achievement.icon }}</span>
                    </div>
                    <div>
                      <h3 class="font-medium">{{ achievement.title }}</h3>
                      <p class="text-sm text-muted-foreground">{{ achievement.description }}</p>
                    </div>
                  </div>
                  <span class="badge" :class="{ 'default': achievement.completed, 'secondary': !achievement.completed }">
                    {{ achievement.points }} pts
                  </span>
                </div>
                
                <div v-if="!achievement.completed" class="space-y-1">
                  <div class="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{{ Math.round(achievement.progress) }}%</span>
                  </div>
                  <div class="progress" :style="{ width: `${achievement.progress}%` }"></div>
                </div>
                
                <div v-if="achievement.completed" class="flex items-center gap-2 text-sm text-green-600">
                  <span class="icon">⭐</span>
                  <span>Completed!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  userScore: Number,
  userRank: Number
});

const activeTab = ref('global');

const globalLeaderboard = [
  { id: 1, name: 'Sarah Chen', score: 2850, streak: 15, badge: 'Food Saver Master', avatar: '' },
  // ... other sample data
];

const friendsLeaderboard = [
  { id: 1, name: 'Sarah Chen', score: 2850, streak: 15, badge: 'Food Saver Master', avatar: '' },
  // ... other sample data
];

const achievements = [
  { 
    id: 1, 
    title: 'First Steps', 
    description: 'Add your first 5 food items', 
    icon: '🎯', 
    completed: true, 
    progress: 100,
    points: 50 
  },
  // ... other achievements
];

const getRankIcon = (position) => {
  switch (position) {
    case 1: return '👑';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return `#${position}`;
  }
};

const getBadgeColor = (badge) => {
  // return class based on badge
  return 'bg-purple-100 text-purple-800';
};
</script>