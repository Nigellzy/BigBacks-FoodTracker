<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl">Tools</h1>
        <p class="text-muted-foreground">Helpful utilities for food management</p>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <button class="card hover:bg-accent" @click="setActiveTool('chatbot')">
        <div class="card-header">
          <h3 class="card-title flex items-center gap-2">
            <span class="icon">🤖</span> AI Chatbot
          </h3>
          <p class="card-description">Ask about food tips</p>
        </div>
      </button>
      <button class="card hover:bg-accent" @click="setActiveTool('calorie')">
        <div class="card-header">
          <h3 class="card-title flex items-center gap-2">
            <span class="icon">📊</span> Calorie Calculator
          </h3>
          <p class="card-description">Estimate nutrition</p>
        </div>
      </button>
      <button class="card hover:bg-accent" @click="setActiveTool('storage')">
        <div class="card-header">
          <h3 class="card-title flex items-center gap-2">
            <span class="icon">🌡️</span> Storage Guide
          </h3>
          <p class="card-description">Best storage methods</p>
        </div>
      </button>
      <!-- other tool cards -->
    </div>

    <!-- Main Tool Area -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ activeToolTitle }}</h3>
      </div>
      <div class="card-content">
        <div v-if="activeTool === 'chatbot'" class="space-y-4">
          <div class="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-lg">
            <div v-for="message in chatMessages" :key="message.id" :class="{ 'flex flex-row-reverse': !message.isBot }">
              <div class="max-w-[80%] p-3 rounded-lg" :class="{ 'bg-accent': message.isBot, 'bg-primary text-primary-foreground': !message.isBot }">
                <p>{{ message.text }}</p>
                <p class="text-xs opacity-70 mt-1">{{ formatTimestamp(message.timestamp) }}</p>
              </div>
            </div>
          </div>
          <form @submit.prevent="handleChatSubmit" class="flex gap-2">
            <input
              v-model="chatInput"
              placeholder="Ask about food storage, recipes, or nutrition..."
              class="flex-1"
            />
            <button type="submit" class="button primary icon">
              <span class="icon">➤</span>
            </button>
          </form>
        </div>
        <div v-if="activeTool === 'calorie'" class="space-y-4">
          <!-- calorie form -->
        </div>
        <div v-if="activeTool === 'storage'" class="space-y-4">
          <!-- storage form -->
        </div>
      </div>
    </div>

    <!-- Quick Tips -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <span class="icon text-yellow-500">💡</span> Quick Tips
        </h3>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <h4 class="font-medium">Storage Basics</h4>
            <ul class="space-y-1 text-muted-foreground">
              <li>• Keep fridge at 40°F (4°C) or below</li>
              <!-- other tips -->
            </ul>
          </div>
          <div class="space-y-2">
            <h4 class="font-medium">Signs of Spoilage</h4>
            <ul class="space-y-1 text-muted-foreground">
              <li>• Off smells or unusual odors</li>
              <!-- other signs -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  foodItems: Array
});

const activeTool = ref('chatbot');
const chatMessages = ref([
  {
    id: '1',
    text: "Hi! I'm your FoodSaver AI assistant. Ask me anything about food storage, expiration dates, calories, or cooking tips!",
    isBot: true,
    timestamp: new Date()
  }
]);
const chatInput = ref('');
const calorieFood = ref('');
const calorieQuantity = ref(100);
const calorieUnit = ref('grams');
const storageFood = ref('');

// methods for handleChatSubmit, generateBotResponse, etc.
const handleChatSubmit = () => {
  if (!chatInput.value.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    text: chatInput.value,
    isBot: false,
    timestamp: new Date()
  };
  chatMessages.value.push(userMessage);

  setTimeout(() => {
    const botResponse = generateBotResponse(chatInput.value);
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true,
      timestamp: new Date()
    };
    chatMessages.value.push(botMessage);
  }, 1000);

  chatInput.value = '';
};

const generateBotResponse = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('store') || lowercaseInput.includes('storage')) {
    return "Here are some general storage tips:\n\n🥬 Vegetables: Most should be stored in the refrigerator crisper drawer\n🍎 Fruits: Apples, berries in fridge; bananas, citrus at room temp\n🥛 Dairy: Always refrigerate at 40°F or below\n🍞 Bread: Room temp for 2-3 days, freeze for longer storage\n🥩 Meat: Refrigerate immediately, use within 1-2 days or freeze";
  }
  
  // similar for other conditions
  return "I'm sorry, I don't have information about that. Can you ask about food storage, expiration, or nutrition?";
};

// other methods
</script>