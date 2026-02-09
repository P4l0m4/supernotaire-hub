<script setup lang="ts">
import { colors } from "@/utils/colors";

interface Props {
  variant?:
    | "secondary-color"
    | "accent-color"
    | "text-color"
    | "primary-color"
    | "error-color"
    | "warning-color"
    | "success-color"
    | "purple-color";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  icon?: string;
  iconSize?: string;
  fontSize?: string;
  reverse?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "accent-color",
  direction: "row",
  fontSize: "1rem",
  iconSize: "1.25rem",
  radius: "",
  reverse: false,
  disabled: false,
});
</script>
<template>
  <span
    role="button"
    tabindex="0"
    class="button noselect"
    :class="[variant, { disabled: disabled }]"
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
  max-width: 30rem;
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
    transition:
      background-color 0.3s linear,
      color 0.3s linear,
      border-color 0.3s linear,
      box-shadow 0.2s linear,
      gap 0.2s linear;

    &:hover {
      box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);
      gap: 1rem;

      & .icon {
        transform: translateX(0.25rem);
      }

      & .icon--reverse {
        transform: translateX(-0.25rem);
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
  background-color: rgba($secondary-color, 0.1);
  color: $secondary-color;
  border: 2px solid $secondary-color;
}

.accent-color {
  background-color: rgba($accent-color, 0.1);
  color: $accent-color;
  border: 2px solid $accent-color;
}

.text-color {
  background-color: rgba($text-color, 0.1);
  color: $text-color;
  border: 2px solid $text-color;
}

.primary-color {
  background-color: rgba($primary-color, 0.1);
  color: $primary-color;
  border: 2px solid $primary-color;
}

.error-color {
  background-color: rgba($error-color, 0.1);
  color: $error-color;
  border: 2px solid $error-color;
}

.warning-color {
  background-color: rgba($warning-color, 0.1);
  color: $warning-color;
  border: 2px solid $warning-color;
}

.success-color {
  background-color: rgba($success-color, 0.1);
  color: $success-color;
  border: 2px solid $success-color;
}

.purple-color {
  background-color: rgba($purple-color, 0.1);
  color: $purple-color;
  border: 2px solid $purple-color;
}
</style>
