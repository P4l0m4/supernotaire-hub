<script setup lang="ts">
import { colors } from "@/utils/colors";

interface Props {
  variant?:
    | "secondary-color"
    | "accent-color"
    | "text-color"
    | "primary-color"
    | "error-color";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  icon?: string;
  iconSize?: string;
  fontSize?: string;
  reverse?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "accent-color",
  direction: "row",
  fontSize: "1rem",
  iconSize: "1.25rem",
  radius: "",
  reverse: false,
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

    <UIIconComponent
      v-if="icon"
      class="icon"
      :class="{ 'icon--reverse': reverse }"
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
      border-color 0.3s linear, box-shadow 0.2s linear, gap 0.2s linear;

    &:hover {
      box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);
      gap: 1rem;

      & .icon {
        transform: translateX(0.5rem);
      }

      & .icon--reverse {
        transform: translateX(-0.5rem);
      }
    }
  }
}

.icon {
  transition: transform 0.4s ease;

  &--reverse {
    order: -1;
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
</style>
