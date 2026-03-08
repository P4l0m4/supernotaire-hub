<script setup lang="ts">
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title?: string;
    color: string;
    icon?: string;
    height?: string;
  }>(),
  {
    color: colors["accent-color"],
    height: "fit-content",
  },
);
</script>
<template>
  <div class="header-card" :style="{ height: props.height }">
    <div class="header-card__header">
      <UIIconComponent
        v-if="props.icon"
        :color="props.color"
        :icon="props.icon"
        size="2rem"
      />
      {{ props.title }}
    </div>
    <div class="header-card__body">
      <slot />
    </div>
  </div>
</template>
<style scoped lang="scss">
.header-card {
  display: flex;
  flex-direction: column;
  border-radius: calc($radius/2);
  width: 100%;
  height: 100%;
  max-width: 30rem;
  grid-column: 1;
  grid-row: 2;
  position: relative;
  background-color: $base-color;

  &::after {
    content: "";
    background-color: rgba($secondary-color, 0.1);
    border-radius: calc($radius / 2);
    bottom: -0.75rem;
    right: -0.75rem;
    top: 0.75rem;
    left: 0.75rem;
    position: absolute;
    width: 100%;
    z-index: -1;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba($accent-color, 0.1);
    border-bottom: 1px solid rgba($text-color, 0.1);
    border-radius: calc($radius / 2) calc($radius / 2) 0 0;
    font-weight: $regular;
    color: $text-color;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
      gap: 1rem;
      font-size: 1.25rem;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.75rem;
    border-radius: 0 0 calc($radius / 2) calc($radius / 2);

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
    }
  }
}
</style>
