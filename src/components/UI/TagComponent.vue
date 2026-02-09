<script setup lang="ts">
import { colors } from "@/utils/colors";

withDefaults(
  defineProps<{
    color?: string;
    icon?: string;
    size?: "small" | "big";
  }>(),
  {
    color: colors["accent-color"],
    size: "small",
  },
);
</script>
<template>
  <span
    class="tag"
    :style="{
      backgroundColor: `${color}10`,
      color: color,
      border: `1px solid ${color}10`,
      padding: size === 'small' ? '0.25rem 0.5rem' : '1rem 1.25rem',
      fontSize: size === 'small' ? '0.75rem' : '1rem',
    }"
    ><UIIconComponent
      v-if="icon"
      :icon
      :size="size === 'small' ? '0.75rem' : '1rem'"
      :color="color"
      style="margin-right: 0.25rem"
    />
    <slot></slot>
  </span>
</template>
<style scoped lang="scss">
.tag {
  display: inline-block;
  border-radius: calc($radius/2.2);
  width: fit-content;
  max-width: 100%;
  height: fit-content;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: $medium;
}
</style>
