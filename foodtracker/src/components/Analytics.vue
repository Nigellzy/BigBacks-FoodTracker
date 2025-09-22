<template>
  <div class="p-6 space-y-6">
    <!-- Header with Time Range Selector -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl">Analytics Dashboard</h1>
        <p class="text-muted-foreground">Track your food waste patterns and savings</p>
      </div>
      <select v-model="timeRange" class="w-[180px]">
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="365">Last year</option>
      </select>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Total Waste</h3>
          <span class="icon text-red-500">🗑️</span>
        </div>
        <div class="card-content">
          <div class="text-2xl text-red-600">${{ totalWaste.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">From expired items</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Money Saved</h3>
          <span class="icon text-green-500">$</span>
        </div>
        <div class="card-content">
          <div class="text-2xl text-green-600">${{ totalSaved.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">From used items</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Waste Reduction</h3>
          <span class="icon text-blue-500">📉</span>
        </div>
        <div class="card-content">
          <div class="text-2xl text-blue-600">{{ wasteReduction.toFixed(1) }}%</div>
          <p class="text-xs text-muted-foreground">Efficiency rate</p>
        </div>
      </div>
      <div class="card">
        <div class="card-header flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 class="card-title text-sm">Inventory Value</h3>
          <span class="icon text-purple-500">$</span>
        </div>
        <div class="card-content">
          <div class="text-2xl text-purple-600">${{ inventoryValue.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">Current stock</p>
        </div>
      </div>
    </div>

    <!-- Tabs for Charts -->
    <div class="tabs">
      <div class="tabs-list">
        <button :class="{ active: activeTab === 'waste' }" @click="activeTab = 'waste'">Waste Trends</button>
        <button :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Category Breakdown</button>
        <button :class="{ active: activeTab === 'monthly' }" @click="activeTab = 'monthly'">Monthly Spending</button>
      </div>
      <div v-if="activeTab === 'waste'" class="tabs-content">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Waste vs Saved</h3>
            <p class="card-description">Weekly breakdown of food usage and waste</p>
          </div>
          <div class="card-content">
            <!-- Placeholder for BarChart -->
            <div class="chart-placeholder">BarChart: Waste vs Saved</div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'categories'" class="tabs-content">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Category Breakdown</h3>
            <p class="card-description">Waste and savings by food category</p>
          </div>
          <div class="card-content">
            <!-- Placeholder for PieChart -->
            <div class="chart-placeholder">PieChart: Category Breakdown</div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="card-title">Category Waste vs Saved</h3>
          </div>
          <div class="card-content">
            <!-- Placeholder for horizontal BarChart -->
            <div class="chart-placeholder">Horizontal BarChart: Waste vs Saved by Category</div>
          </div>
        </div>
      </div>
      <div v-if="activeTab === 'monthly'" class="tabs-content">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Monthly Spending Trend</h3>
            <p class="card-description">Track your total food spending and waste patterns over time</p>
          </div>
          <div class="card-content">
            <!-- Placeholder for LineChart -->
            <div class="chart-placeholder">LineChart: Monthly Spending</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Insights & Recommendations</h3>
      </div>
      <div class="card-content">
        <div class="space-y-4">
          <div v-if="wasteReduction > 75" class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <span class="icon text-green-600">📈</span>
            <div>
              <p class="text-green-800">Excellent waste reduction! You're saving {{ wasteReduction.toFixed(1) }}% of your food.</p>
            </div>
          </div>
          
          <div v-if="wasteReduction < 50" class="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <span class="icon text-yellow-600">📉</span>
            <div>
              <p class="text-yellow-800">Consider setting more expiration reminders to improve your {{ wasteReduction.toFixed(1) }}% save rate.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 class="font-medium mb-2">This Month:</h4>
              <ul class="space-y-1 text-muted-foreground">
                <li>• Total items tracked: {{ props.foodItems.length }}</li>
                <li>• Money saved: ${{ totalSaved.toFixed(2) }}</li>
                <li>• Waste prevented: {{ props.usageHistory.length }} items</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium mb-2">Tips:</h4>
              <ul class="space-y-1 text-muted-foreground">
                <li>• Check expiration dates daily</li>
                <li>• Use recipe suggestions for expiring items</li>
                <li>• Track items with shorter shelf lives more carefully</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  foodItems: Array,
  wasteHistory: Array,
  usageHistory: Array
});

const timeRange = ref('30');
const activeTab = ref('waste');

const wasteData = computed(() => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange.value));

  const filteredWaste = props.wasteHistory.filter(item => item.date >= cutoffDate);
  const filteredUsage = props.usageHistory.filter(item => item.date >= cutoffDate);

  const weeklyData = new Map();
  
  [...filteredWaste, ...filteredUsage].forEach(item => {
    const weekStart = new Date(item.date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, { week: weekKey, waste: 0, saved: 0, spending: 0 });
    }
    
    const week = weeklyData.get(weekKey);
    if (filteredWaste.includes(item)) {
      week.waste += item.value;
    } else {
      week.saved += item.value;
    }
    week.spending += item.value;
  });

  return Array.from(weeklyData.values()).sort((a, b) => a.week.localeCompare(b.week));
});

const categoryData = computed(() => {
  const categories = new Map();
  
  [...props.wasteHistory, ...props.usageHistory].forEach(item => {
    if (!categories.has(item.category)) {
      categories.set(item.category, { category: item.category, waste: 0, saved: 0, total: 0 });
    }
    
    const cat = categories.get(item.category);
    if (props.wasteHistory.includes(item)) {
      cat.waste += item.value;
    } else {
      cat.saved += item.value;
    }
    cat.total += item.value;
  });

  return Array.from(categories.values());
});

const totalWaste = computed(() => props.wasteHistory.reduce((sum, item) => sum + item.value, 0));

const totalSaved = computed(() => props.usageHistory.reduce((sum, item) => sum + item.value, 0));

const wasteReduction = computed(() => totalSaved.value > 0 ? ((totalSaved.value / (totalWaste.value + totalSaved.value)) * 100) : 0);

const inventoryValue = computed(() => props.foodItems.reduce((sum, item) => sum + item.price, 0));
</script>