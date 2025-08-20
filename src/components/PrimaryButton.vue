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
    | "success-color"
    | "purple-color"
    | "error-color";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  icon?: string;
  iconSize?: string;
  fontSize?: string;
  reverse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary-color",
  direction: "row",
  fontSize: "1rem",
  iconSize: "1.25rem",
  radius: "",
  reverse: false,
});

const iconColor = computed(() => {
  switch (props.variant) {
    case "base-color":
      return colors["secondary-color-faded"];
    case "primary-color":
      return colors["accent-color"];
    case "secondary-color":
      return colors["primary-color"];
    case "text-color":
      return colors["primary-color"];
    case "accent-color":
      return colors["primary-color"];
    case "purple-color":
      return colors["primary-color"];
    case "success-color":
      return colors["primary-color"];
    case "error-color":
      return colors["primary-color"];
    default:
      return colors["base-color-faded"];
  }
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
      class="icon"
      :class="{ 'icon--reverse': reverse }"
      :icon
      :size="iconSize || undefined"
      :color="iconColor"
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
      border-color 0.3s linear, box-shadow 0.2s linear;

    &:hover {
      box-shadow: $shadow-black;

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
  background-color: $secondary-color;
  color: $base-color;
  border: 2px solid $secondary-color;
}

.accent-color {
  background-color: $accent-color;
  color: $primary-color;
  border: 2px solid $accent-color;
}

.base-color {
  background-color: $base-color;
  color: $secondary-color;
  border: 2px solid $base-color;
}

.text-color {
  background-color: $text-color;
  color: $primary-color;
  border: 2px solid $text-color;
}

.primary-color {
  background-color: $primary-color;
  color: $accent-color;
  border: 2px solid $primary-color;
}

.success-color {
  background-color: $success-color;
  color: $primary-color;
  border: 2px solid $success-color;
}

.purple-color {
  background-color: $purple-color;
  color: $primary-color;
  border: 2px solid $purple-color;
}

.error-color {
  background-color: $error-color;
  color: $primary-color;
  border: 2px solid $error-color;
}
</style>
