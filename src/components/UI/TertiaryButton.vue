<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  variant?:
    | "secondary-color"
    | "accent-color"
    | "base-color"
    | "text-color"
    | "text-color-faded"
    | "primary-color"
    | "error-color";
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  icon?: string;
  iconSize?: string;
  fontSize?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "text-color",
  direction: "row",
  fontSize: "1rem",
  iconSize: "1.25rem",
  radius: "",
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
    case "text-color-faded":
      return colors["text-color-faded"];
    case "accent-color":
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
    :style="{
      flexDirection: direction,
      fontSize,
      color: variant ? colors[variant] : colors['text-color'],
    }"
  >
    <span class="button__text"><slot /></span>

    <UIIconComponent
      v-if="icon"
      class="icon"
      :icon
      :size="iconSize || undefined"
      :color="iconColor"
    />
  </span>
</template>
<style scoped lang="scss">
.button {
  width: fit-content;
  max-width: 375px;
  padding: 0;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-weight: $regular;
  font-size: 0.875rem;
  margin-top: auto;
  transition: transform 0.2s linear, color 0.2s linear;

  @media (min-width: $big-tablet-screen) {
    &:hover {
      & .icon {
        transform: translateX(0.5rem);
      }
    }
  }

  &__text {
    text-decoration: underline;
  }
}

.icon {
  transition: transform 0.4s ease;
}
</style>
