<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  variant?:
    | "secondary-color"
    | "accent-color"
    | "base-color"
    | "text-color"
    | "primary-color"
    | "error-color";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  icon?: string;
  iconSize?: string;
  fontSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary-color",
  direction: "row",
  fontSize: "1rem",
  iconSize: "1.25rem",
  radius: "",
});
</script>
<template>
  <span
    role="button"
    tabindex="0"
    class="button noselect"
    :class="variant"
    :style="{ flexDirection: direction, fontSize }"
  >
    <slot />

    <IconComponent
      v-if="icon"
      :icon
      :size="iconSize || undefined"
      :color="variant ? colors[variant] : colors['text-color']"
    />
  </span>
</template>
<style scoped lang="scss">
.button {
  width: 100%;
  max-width: 400px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  border-radius: calc($radius/2);
  font-weight: $regular;

  @media (min-width: $big-tablet-screen) {
    transition: background-color 0.3s linear, color 0.3s linear,
      border-color 0.3s linear, transform 0.2s linear, box-shadow 0.2s linear;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-black;
    }
  }
}

.secondary-color {
  background-color: transparent;
  color: $secondary-color;
  border: 2px solid $secondary-color;
}

.accent-color {
  background-color: transparent;
  color: $accent-color;
  border: 2px solid $accent-color;
}

.base-color {
  background-color: transparent;
  color: $base-color;
  border: 2px solid $base-color;
}

.text-color {
  background-color: transparent;
  color: $text-color;
  border: 2px solid $text-color;
}

.primary-color {
  background-color: transparent;
  color: $primary-color;
  border: 2px solid $primary-color;
}

.error-color {
  background-color: transparent;
  color: $error-color;
  border: 2px solid $error-color;
}

//hover animation that will make buttons shiny
</style>
