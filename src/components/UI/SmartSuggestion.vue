<script setup lang="ts">
import { colors } from "@/utils/colors";
defineProps<{
  suggestion: string;
}>();
</script>
<template>
  <div
    class="smart-suggestion"
    v-tooltip="{ content: 'Cliquer pour appliquer la suggestion' }"
  >
    <UIIconComponent
      icon="lightbulb_fill"
      size="0.85rem"
      :color="colors['purple-color']"
    />
    <span class="smart-suggestion__text">{{ suggestion }}</span>
  </div>
</template>
<style scoped lang="scss">
.smart-suggestion {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: $purple-color;
  font-size: $small-text;
  font-weight: $regular;
  border: 1px solid $purple-color-faded;
  width: fit-content;
  border-radius: calc($radius / 2);
  padding: 0.5rem 0.5rem;
  cursor: pointer;
  max-width: 100%;
  transition: transform 0.2s linear, color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    color: $purple-color;
    background-color: rgba($purple-color, 0.1);
    border: 1px solid transparent;
    box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);
  }

  &__text {
    max-width: 100%;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
