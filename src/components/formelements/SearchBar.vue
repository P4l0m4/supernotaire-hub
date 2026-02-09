<script setup lang="ts">
import { computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { colors } from "@/utils/colors";

interface Props {
  modelValue: string;
  placeholder?: string;
  delay?: number;
  error?: string;
  autocomplete?: "on" | "off";
}
const props = withDefaults(defineProps<Props>(), {
  autocomplete: "off",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search", value: string): void;
}>();

const local = computed({
  get: () => props.modelValue,
  set: (v: string) => emit("update:modelValue", v),
});

const debouncedSearch = useDebounceFn(
  () => emit("search", props.modelValue),
  props.delay ?? 350,
);

watch(
  () => props.modelValue,
  () => debouncedSearch(),
);
</script>

<template>
  <div
    class="search-bar"
    :class="{ shake: error, 'search-bar--has-error': error }"
    tabindex="0"
    @click="debouncedSearch()"
    @keyup.enter="debouncedSearch()"
  >
    <UIIconComponent icon="search" :color="`${colors['text-color']}70`" />

    <input
      type="search"
      v-model="local"
      :placeholder="placeholder"
      class="search-bar__input"
      :autocomplete="autocomplete"
      :class="{ 'search-bar__input--has-error': error }"
    />
    <span class="search-bar__error" v-if="error">{{ error }}</span>
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  background-color: $primary-color;
  border-radius: calc($radius/2);
  border: 1px solid rgba($text-color, 0.1);
  padding: 0 0.75rem;
  box-shadow: $shadow-black;
  position: relative;
  height: 55px;

  &--has-error {
    border: 1px solid rgba($error-color, 0.1);
    background-color: rgba($error-color, 0.1);
  }

  &:focus-within {
    border: 1px solid $accent-color;
    box-shadow: 0 0px 6px 0px rgba($accent-color, 0.1);
  }

  &__input {
    font-size: 1rem;
    padding: 0.65rem 0;
    border: none;
    color: $text-color;
    background-color: transparent !important;
    width: 100% !important;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    caret-color: $text-color;
    font-family: inherit;
    display: inline-block;

    &::placeholder {
      color: rgba($text-color, 0.7);
      font-size: 1rem;
      font-weight: $regular;
    }

    &--has-error {
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 20px #fae3e1 inset !important;
        //the color cannot have transparency, need to update this in case the error background color changes
      }
    }
  }

  &__error {
    display: inline-block;
    position: absolute;
    color: $error-color;
    font-size: $small-text;
    bottom: 0rem;
    right: 0;
    padding: 0.1rem 0.25rem;
    border: 1px solid rgba($error-color, 0.1);
    background-color: rgba($error-color, 0.1);
    border-radius: calc($radius/2.2);
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
