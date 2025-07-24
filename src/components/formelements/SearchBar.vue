<script setup lang="ts">
import { computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { colors } from "@/utils/colors";

interface Props {
  modelValue: string;
  placeholder?: string;
  delay?: number;
}

const props = defineProps<Props>();
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
  props.delay ?? 350
);

watch(
  () => props.modelValue,
  () => debouncedSearch()
);
</script>

<template>
  <div
    class="search-bar"
    tabindex="0"
    @click="debouncedSearch()"
    @keyup.enter="debouncedSearch()"
  >
    <IconComponent icon="search" :color="colors['text-color-faded']" />
    <input
      type="search"
      v-model="local"
      :placeholder="placeholder"
      class="search-bar__input"
    />
  </div>
</template>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 1.5rem;
  background-color: $primary-color;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius / 2);

  &__input {
    width: 100%;
    height: 100%;
    caret-color: $text-color;
    color: $text-color;
    font-size: 1rem;
    font-family: inherit;
  }
}
</style>
