<script setup lang="ts">
import { colors } from "@/utils/colors";

withDefaults(
  defineProps<{
    color?: string;
  }>(),
  {
    color: colors["accent-color"],
  }
);
</script>
<template>
  <span
    class="tag"
    :style="{
      backgroundColor: `${color}10`,
      color: color,
      border: `1px solid ${color}10`,
    }"
  >
    <slot></slot>
  </span>
</template>
<style scoped lang="scss">
.tag {
  display: inline-block;
  font-size: $small-text;
  padding: 0.1rem 0.25rem;
  border-radius: calc($radius/2.2);
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
