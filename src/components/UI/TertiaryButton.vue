<script setup lang="ts">
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
  iconSize: "1rem",
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
      :color="variant ? colors[variant] : colors['text-color']"
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
  gap: 0.25rem;
  align-items: center;
  font-weight: $medium;
  font-size: 0.875rem;
  margin-top: auto;
  transition: color 0.2s linear;

  @media (min-width: $big-tablet-screen) {
    &:hover > .button__text {
      text-decoration-color: currentColor;
      -webkit-text-decoration-color: currentColor;
      -moz-text-decoration-color: currentColor;
    }
  }

  &__text {
    text-decoration: underline;
    text-decoration-color: transparent;
    -webkit-text-decoration-color: transparent;
    -moz-text-decoration-color: transparent;
    transition: text-decoration-color 0.2s linear;
  }
}
</style>
