<script setup lang="ts">
import { colors } from "@/utils/colors";

withDefaults(
  defineProps<{
    color?: string;
    icon?: string;
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
    ><UIIconComponent
      v-if="icon"
      :icon
      size="0.75rem"
      :color="color"
      style="margin-right: 0.25rem"
    />
    <slot></slot>
  </span>
</template>
<style scoped lang="scss">
.tag {
  display: inline-block;
  font-size: $small-text;
  padding: 0.15rem 0.25rem;
  border-radius: calc($radius/2.2);
  width: fit-content;
  max-width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
