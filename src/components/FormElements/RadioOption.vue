<script setup lang="ts">
import { computed, ref } from "vue";
import { colors } from "@/utils/colors";

export interface RadioOption {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked?: boolean;
  icon?: string;
}

// const props = defineProps<RadioOption>();

const props = withDefaults(
  defineProps<{
    radioOption: RadioOption;
    error?: string;
    size?: "small" | "big";
  }>(),
  {
    size: "big",
  },
);

const inputRef = ref<HTMLInputElement | null>(null);

const model = defineModel<string | number | boolean>();
const isSelected = computed(() => model.value === props.radioOption.value);

function simulateClick() {
  if (inputRef.value) {
    inputRef.value.click();
  }
}
</script>
<template>
  <label
    :for="radioOption.id"
    class="radio-option"
    :class="{
      'radio-option--checked': isSelected,
      'radio-option--error': error,
    }"
    :style="{
      padding: size === 'small' ? '1rem' : '1.5rem',
      gap: size === 'small' ? '1rem' : '1.5rem',
      flexDirection: size === 'small' ? 'column' : 'row',
    }"
    tabindex="0"
    @keydown.enter="simulateClick"
    @keydown.space="simulateClick"
  >
    <UIWrappedIcon
      v-if="radioOption.icon"
      :icon="radioOption.icon"
      :color="colors['accent-color']"
      size="big"
    />

    <div class="radio-option__text">
      <span
        class="radio-option__text__fake-label"
        :style="{
          textAlign: size === 'small' ? 'center' : 'left',
        }"
        >{{ radioOption.label }}</span
      >
      <p
        v-if="radioOption.description && props.size === 'big'"
        class="radio-option__text__description"
      >
        {{ radioOption.description }}
      </p>
    </div>
    <input
      ref="inputRef"
      class="radio-option__input"
      :class="{ 'sr-only': size === 'small' }"
      type="radio"
      v-model="model"
      :id="radioOption.id"
      :name="radioOption.name"
      :value="radioOption.value"
    />
  </label>
</template>

<style lang="scss" scoped>
.radio-option {
  display: flex;
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

    .radio-option__text__fake-label {
      color: $accent-color;
    }

    .radio-option__input {
      background: radial-gradient(
        $accent-color,
        $accent-color 49%,
        $base-color 50%,
        $base-color
      );
      border: 1px solid $accent-color;
    }
  }

  &--error {
    border-color: $error-color;
    background-color: rgba($error-color, 0.1);

    .radio-option__text__fake-label {
      color: $error-color;
    }

    .radio-option__input {
      background: radial-gradient(
        $error-color,
        $error-color 49%,
        $base-color 50%,
        $base-color
      );
      border: 1px solid $error-color;
    }
  }

  &__input {
    min-width: 2rem;
    max-width: 2rem;
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

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;

    &__fake-label {
      font-weight: $medium;
      font-size: 1rem;
      transition: color 0.3s ease;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
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
