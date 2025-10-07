<template>
  <div class="dialog" v-if="open">
    <div class="dialog-content sm:max-w-md bg-white border border-gray-200">
      <div class="dialog-header">
        <h2 class="dialog-title">Use {{ props.item.name }}</h2>
        <p class="dialog-description">
          How much of this item did you use? Current amount: {{ props.item.quantity }} {{ props.item.unit }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label for="used-quantity">Quantity Used ({{ props.item.unit }})</label>
          <input
            id="used-quantity"
            type="number"
            min="0.1"
            :max="props.item.quantity"
            step="0.1"
            v-model="inputValue"
            @input="handleInputChange"
            :placeholder="`Max: ${props.item.quantity}`"
          />
          <p class="text-xs text-muted-foreground">
            Remaining: {{ Math.max(0, props.item.quantity - usedQuantity).toFixed(1) }} {{ props.item.unit }}
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <button 
            type="submit" 
            class="w-full button primary"
            :disabled="!inputValue || usedQuantity <= 0 || usedQuantity > props.item.quantity"
          >
            Use Custom Amount ({{ usedQuantity > 0 ? usedQuantity : '?' }} {{ props.item.unit }})
          </button>
          <button 
            type="button" 
            class="w-full button outline"
            @click="handleUseAll"
          >
            Use All ({{ props.item.quantity }} {{ props.item.unit }})
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  item: Object,
  onUseItem: Function
});

const open = ref(false);
const usedQuantity = ref(Math.min(1, props.item.quantity));
const inputValue = ref(Math.min(1, props.item.quantity).toString());

const handleSubmit = () => {
  props.onUseItem(props.item.id, usedQuantity.value);
  open.value = false;
  const resetValue = Math.min(1, props.item.quantity);
  usedQuantity.value = resetValue;
  inputValue.value = resetValue.toString();
};

const handleInputChange = (e) => {
  const value = e.target.value;
  inputValue.value = value;
  
  const numValue = parseFloat(value);
  if (!isNaN(numValue) && numValue > 0) {
    usedQuantity.value = numValue;
  }
};

const handleUseAll = () => {
  props.onUseItem(props.item.id, props.item.quantity);
  open.value = false;
};
</script>