<template>
  <div class="dialog" v-if="open">
    <div class="dialog-content max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="dialog-header">
        <h2 class="dialog-title">Edit Food Item</h2>
        <p class="dialog-description">
          Update the details for {{ props.item.name }}
        </p>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="edit-name">Name</label>
            <input
              id="edit-name"
              v-model="formData.name"
              placeholder="e.g., Apples, Milk, Chicken"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="edit-category">Category</label>
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
              <label for="edit-expiration">Expiration Date</label>
              <input
                id="edit-expiration"
                type="date"
                v-model="formData.expirationDate"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="edit-quantity">Quantity</label>
              <input
                id="edit-quantity"
                type="number"
                min="1"
                v-model="formData.quantity"
              />
            </div>

            <div>
              <label for="edit-unit">Unit</label>
              <select
                v-model="formData.unit"
              >
                <option value="">Select unit</option>
                <template v-if="formData.category">
                  <option disabled>Suggested:</option>
                  <option v-for="unit in getSuggestedUnits(formData.category)" :key="'edit-suggested-' + unit" :value="unit">
                    {{ unit }}
                  </option>
                  <option disabled>All units:</option>
                </template>
                <option v-for="unit in filteredUnits" :key="'edit-all-' + unit" :value="unit">
                  {{ unit }}
                </option>
              </select>
            </div>

            <div>
              <label for="edit-price">Price ($)</label>
              <input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                v-model="formData.price"
              />
            </div>
          </div>

          <div class="flex gap-2 justify-end pt-4">
            <button type="button" class="button outline" @click="open = false">
              Cancel
            </button>
            <button type="submit" class="button primary">
              Update Item
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  item: Object,
  onEditItem: Function
});

const emit = defineEmits(['update:open']);

const open = ref(false);

const formData = ref({
  name: props.item.name,
  expirationDate: props.item.expirationDate.toISOString().split('T')[0],
  quantity: props.item.quantity,
  unit: props.item.unit,
  price: props.item.price,
  category: props.item.category
});

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
  // same as in AddFood
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

  const updatedItem = {
    name: formData.value.name,
    expirationDate: new Date(formData.value.expirationDate),
    quantity: formData.value.quantity,
    unit: formData.value.unit,
    price: formData.value.price,
    category: formData.value.category
  };

  props.onEditItem(props.item.id, updatedItem);
  open.value = false;
};

const resetForm = () => {
  formData.value = {
    name: props.item.name,
    expirationDate: props.item.expirationDate.toISOString().split('T')[0],
    quantity: props.item.quantity,
    unit: props.item.unit,
    price: props.item.price,
    category: props.item.category
  };
};

watch(open, (newOpen) => {
  if (!newOpen) {
    resetForm();
  }
});
</script>