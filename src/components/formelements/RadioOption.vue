<script setup lang="ts">
import { computed, ref } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  icon?: string;
}

const props = defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);

const model = defineModel<string | number | boolean>();
const isSelected = computed(() => model.value === props.value);

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
    :class="{ 'radio-option--checked': isSelected }"
    tabindex="0"
    @keydown.enter="simulateClick"
    @keydown.space="simulateClick"
  >
    <UIWrappedIcon
      v-if="icon"
      :icon="icon"
      :color="colors['accent-color']"
      size="big"
    />

    <div class="radio-option__text">
      <span class="radio-option__text__fake-label">{{ label }}</span>
      <p v-if="description" class="radio-option__text__description">
        {{ description }}
      </p>
    </div>
    <input
      ref="inputRef"
      class="radio-option__input"
      type="radio"
      v-model="model"
      :id
      :name
      :value
    />
  </label>
</template>

<style lang="scss" scoped>
.radio-option {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  color: $text-color;
  border: 1px solid rgba($secondary-color, 0.1);
  border-radius: calc($radius / 2);
  width: fit-content;
  align-items: center;
  width: 100%;
  cursor: pointer;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;

  &--checked {
    border-color: $accent-color;
    background-color: rgba($accent-color, 0.1);
  }

  &__input {
    width: clamp(2rem, 2rem, 2rem);
    height: clamp(2rem, 2rem, 2rem);
    accent-color: $accent-color;
    margin-left: auto;
    background-color: $base-color;
    appearance: none;
    border: 1px solid rgba($text-color, 0.1);
    transition:
      border-color 0.3s ease,
      background-color 0.3s ease;
  }

  &--checked &__input {
    background: radial-gradient(
      $accent-color,
      $accent-color 49%,
      $base-color 50%,
      $base-color
    );
    border: 1px solid $accent-color;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: calc(100% - 8rem);

    &__fake-label {
      font-weight: $medium;
      font-size: 1.25rem;
    }

    &__description {
      font-size: 1rem;
      font-weight: $regular;
      color: rgba($secondary-color, 0.6);
      text-wrap: balance;
    }
  }
}
</style>
