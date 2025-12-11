<script setup lang="ts">
import { computed } from "vue";

interface Props {
  icon: string;
  color: string;
  size?: "big" | "small";
}
const props = defineProps<Props>();

const isSmall = computed(() => props.size === "small");
const wrapperClass = computed(() => ({
  "wrapped-icon": true,
  "wrapped-icon--small": isSmall.value,
  "wrapped-icon--big": !isSmall.value,
}));

const iconSize = computed(() => (isSmall.value ? "1.125rem" : "1.875rem"));
</script>

<template>
  <span :class="wrapperClass" :style="{ '--wrapper-color': color }">
    <UIIconComponent :icon="icon" :color="color" :size="iconSize" />
  </span>
</template>

<style lang="scss" scoped>
$size-small: 2.25rem;
$size-big: 3.75rem;

.wrapped-icon {
  --wrapper-size: #{$size-big};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: clamp(var(--wrapper-size), var(--wrapper-size), var(--wrapper-size));
  height: clamp(var(--wrapper-size), var(--wrapper-size), var(--wrapper-size));
  background-color: color-mix(in srgb, var(--wrapper-color) 10%, transparent);
  border-radius: calc($radius / 2);

  &--small {
    --wrapper-size: #{$size-small};
  }
  &--big {
    --wrapper-size: #{$size-big};
  }
}
</style>
