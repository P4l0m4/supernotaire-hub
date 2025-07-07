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
    <slot />

    <IconComponent
      v-if="icon"
      :icon
      :size="iconSize || undefined"
      :color="iconColor"
    />
  </span>
</template>
<style scoped lang="scss">
.button {
  width: 100%;
  max-width: 375px;
  padding: 0;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-weight: $regular;
  font-size: 0.75rem;
  text-decoration: underline;
  margin-top: auto;
  transition: transform 0.2s linear;

  @media (min-width: $big-tablet-screen) {
    &:hover {
      transform: translateY(-3px);
    }
  }
}
</style>
