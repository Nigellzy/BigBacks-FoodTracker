<template>
  <div class="p-6 space-y-6 max-w-4xl mx-auto">
    <!-- Back Button Header -->
    <div v-if="props.onBack" class="flex items-center gap-4 mb-6">
      <button class="button ghost flex items-center gap-2 hover:bg-accent" @click="props.onBack">
        <span class="icon">←</span> Back to Dashboard
      </button>
    </div>

    <!-- Profile Header -->
    <div class="card relative overflow-hidden">
      <div class="absolute inset-0 gradient opacity-10"></div>
      <div class="card-content relative pt-6">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div class="avatar h-24 w-24">
            <span class="fallback text-2xl">{{ props.userProfile?.name?.split(' ').map(n => n[0]).join('') || '' }}</span>
          </div>
          
          <div class="flex-1 space-y-4">
            <div v-if="isEditing" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name">Name</label>
                  <input
                    id="name"
                    v-model="editData.name"
                  />
                </div>
                <div>
                  <label for="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    v-model="editData.email"
                  />
                </div>
              </div>
              <div class="flex gap-2">
                <button class="button outline" @click="isEditing = false">Cancel</button>
                <button class="button primary" @click="handleSave">Save</button>
              </div>
            </div>
            <div v-else>
              <div class="flex items-center justify-between">
                <h2 class="text-2xl">{{ props.userProfile.name }}</h2>
                <button class="button ghost" @click="startEditing">
                  <span class="icon">✏️</span> Edit
                </button>
              </div>
              <p class="text-muted-foreground">{{ props.userProfile.email }}</p>
              <div class="flex gap-4 mt-4">
                <div class="flex items-center gap-2">
                  <span class="icon">🔥</span> {{ props.userProfile.streakDays }} day streak
                </div>
                <div class="flex items-center gap-2">
                  <span class="icon">$</span> ${{ props.userProfile.totalSaved.toFixed(2) }} saved
                </div>
                <div class="flex items-center gap-2">
                  <span class="icon">📉</span> {{ props.userProfile.wasteReduction }}% waste reduction
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress to Next Level -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <span class="icon text-blue-500">📈</span> Level Progress
        </h3>
        <p class="card-description">Your journey to the next level</p>
      </div>
      <div class="card-content space-y-4">
        <div class="flex justify-between items-center">
          <span>Current Score: {{ props.userScore }}</span>
          <span>Next Level: {{ nextLevelScore }}</span>
        </div>
        <div class="progress" :style="{ width: `${progressToNext}%` }"></div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- stat cards -->
    </div>

    <!-- Achievements -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <span class="icon text-yellow-500">🏅</span> Achievements
        </h3>
        <p class="card-description">Your food-saving milestones and badges</p>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="achievement in achievements" :key="achievement.id" class="p-4 rounded-lg border" :class="{ 'bg-green-50 border-green-200': achievement.completed }">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full" :class="{ 'bg-green-100 text-green-600': achievement.completed, 'bg-gray-100 text-gray-600': !achievement.completed }">
                  <span class="icon">{{ achievement.icon }}</span>
                </div>
                <div>
                  <h3 class="font-medium">{{ achievement.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ achievement.description }}</p>
                </div>
              </div>
              <span class="badge" :class="{ 'default': achievement.completed, 'secondary': !achievement.completed }">
                {{ achievement.points }}pts
              </span>
            </div>
            <div v-if="achievement.completed" class="flex items-center gap-2 text-sm text-green-600">
              <span class="icon">✓</span> Completed!
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Goals -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <span class="icon text-blue-500">🎯</span> Monthly Goals
        </h3>
      </div>
      <div class="card-content space-y-4">
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm">Save $200 this month</span>
            <span class="text-sm text-muted-foreground">${{ props.userProfile.totalSaved.toFixed(0) }} / $200</span>
          </div>
          <div class="progress" :style="{ width: `${(props.userProfile.totalSaved / 200) * 100}%` }"></div>
        </div>
        <!-- other goals -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  userProfile: Object,
  onUpdateProfile: Function,
  userScore: Number,
  onBack: Function
});

const isEditing = ref(false);
const editData = ref({ ...props.userProfile });

const handleSave = () => {
  props.onUpdateProfile(editData.value);
  isEditing.value = false;
};

const startEditing = () => {
  editData.value = { ...props.userProfile };
  isEditing.value = true;
};

const achievements = [
  // sample data
];

const nextLevelScore = Math.ceil(props.userScore / 1000) * 1000;
const progressToNext = ((props.userScore % 1000) / 1000) * 100;
</script>