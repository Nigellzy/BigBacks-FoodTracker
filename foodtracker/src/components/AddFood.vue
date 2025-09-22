<template>
  <div class="space-y-6">
    <!-- Manual Entry Form -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title flex items-center gap-2">
          <span class="icon">+</span> Add Food Item
        </h3>
        <p class="card-description">
          Manually enter food details or scan a barcode
        </p>
      </div>
      <div class="card-content">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="flex gap-2">
            <div class="flex-1">
              <label for="name">Food Name</label>
              <input
                id="name"
                v-model="formData.name"
                placeholder="e.g., Apples, Milk, Chicken"
                required
              />
            </div>
            <div class="flex-1">
              <label for="category">Category</label>
              <select
                v-model="formData.category"
              >
                <option value="">Select category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div>
              <label for="expiration">Expiration Date</label>
              <input
                id="expiration"
                type="date"
                v-model="formData.expirationDate"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                v-model="formData.quantity"
              />
            </div>

            <div>
              <label for="unit">Unit</label>
              <select
                v-model="formData.unit"
              >
                <option value="">Select unit</option>
                <template v-if="formData.category">
                  <option disabled>Suggested:</option>
                  <option v-for="unit in getSuggestedUnits(formData.category)" :key="'suggested-' + unit" :value="unit">
                    {{ unit }}
                  </option>
                  <option disabled>All units:</option>
                </template>
                <option v-for="unit in filteredUnits" :key="'all-' + unit" :value="unit">
                  {{ unit }}
                </option>
              </select>
            </div>

            <div>
              <label for="price">Price ($)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                v-model="formData.price"
              />
            </div>
          </div>

          <button type="submit" class="w-full button">
            <span class="icon mr-2">+</span> Add Food Item
          </button>
        </form>
      </div>
    </div>

    <!-- Recently Added -->
    <div v-if="recentlyAdded.length > 0" class="card">
      <div class="card-header">
        <h3 class="card-title">Recently Added</h3>
      </div>
      <div class="card-content">
        <div class="flex flex-wrap gap-2">
          <span v-for="(item, index) in recentlyAdded" :key="index" class="badge">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  onAddFood: {
    type: Function,
    required: true
  }
});

const formData = ref({
  name: '',
  expirationDate: '',
  quantity: 1,
  unit: '',
  price: 0,
  category: ''
});

const recentlyAdded = ref([]);

const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Seafood',
  'Pantry Items',
  'Frozen Foods',
  'Beverages',
  'Snacks',
  'Bakery',
  'Other'
];

const units = [
  'pieces',
  'grams',
  'kilograms',
  'milliliters',
  'liters',
  'slices',
  'cups',
  'tablespoons',
  'teaspoons',
  'ounces',
  'pounds',
  'cans',
  'bottles',
  'packages',
  'loaves',
  'bunches',
  'heads',
  'cloves'
];

const getSuggestedUnits = (category) => {
  switch (category) {
    case 'Fruits & Vegetables':
      return ['pieces', 'grams', 'kilograms', 'bunches', 'heads'];
    case 'Dairy & Eggs':
      return ['liters', 'milliliters', 'pieces', 'cups', 'grams'];
    case 'Meat & Poultry':
      return ['grams', 'kilograms', 'pounds', 'pieces'];
    case 'Seafood':
      return ['grams', 'kilograms', 'pounds', 'pieces'];
    case 'Beverages':
      return ['liters', 'milliliters', 'bottles', 'cans'];
    case 'Bakery':
      return ['slices', 'loaves', 'pieces', 'grams'];
    case 'Pantry Items':
      return ['grams', 'kilograms', 'cups', 'tablespoons', 'teaspoons', 'cans', 'packages'];
    default:
      return ['pieces', 'grams', 'cups'];
  }
};

const filteredUnits = computed(() => {
  if (!formData.value.category) return units;
  return units.filter(unit => !getSuggestedUnits(formData.value.category).includes(unit));
});

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.expirationDate || !formData.value.category || !formData.value.unit) {
    return;
  }

  const newFood = {
    name: formData.value.name,
    expirationDate: new Date(formData.value.expirationDate),
    quantity: formData.value.quantity,
    unit: formData.value.unit,
    price: formData.value.price,
    category: formData.value.category
  };

  props.onAddFood(newFood);
  recentlyAdded.value = [formData.value.name, ...recentlyAdded.value.slice(0, 4)];

  formData.value = {
    name: '',
    expirationDate: '',
    quantity: 1,
    unit: '',
    price: 0,
    category: ''
  };
};

const barcodeScanning = ref(false);

const handleBarcodeClick = () => {
  barcodeScanning.value = true;
  setTimeout(() => {
    formData.value.name = 'Organic Bananas';
    formData.value.category = 'Fruits & Vegetables';
    formData.value.price = 2.99;
    barcodeScanning.value = false;
  }, 2000);
};
</script>