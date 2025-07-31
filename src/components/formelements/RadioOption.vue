<script setup lang="ts">
import { ref } from "vue";

interface Props {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
}

defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);

const model = defineModel<string>();

function simulateClick() {
  if (inputRef.value) {
    inputRef.value.click();
  }
}
</script>
<template>
  <label
    :for="id"
    class="radio-option"
    tabindex="0"
    @keydown.enter="simulateClick"
    @keydown.space="simulateClick"
  >
    <input
      ref="inputRef"
      class="radio-option__input"
      type="radio"
      v-model="model"
      :id
      :name
      :value
    />
    <div class="radio-option__text">
      <span class="radio-option__text__fake-label">{{ label }}</span>
      <p v-if="description" class="radio-option__text__description">
        {{ description }}
      </p>
    </div>
  </label>
</template>

<style lang="scss" scoped>
.radio-option {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  color: $text-color;
  border: 1px solid rgba($secondary-color, 0.1);
  border-radius: $radius;
  width: fit-content;
  align-items: center;
  width: 100%;
  cursor: pointer;

  &__input {
    width: 24px;
    height: 24px;
    accent-color: $accent-color-faded;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;

    &__fake-label {
      font-weight: $bold;
      font-size: 1.25rem;
    }

    &__description {
      font-size: 1rem;
      font-weight: $regular;
      color: $secondary-color;
    }
  }
}
</style>
