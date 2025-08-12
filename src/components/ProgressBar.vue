<script lang="ts" setup>
import { colors } from "@/utils/colors";
import { computed } from "vue";

interface Props {
  progress: number;
  error?: string;
}
const props = defineProps<Props>();

const bgColor = computed(() =>
  props.error
    ? colors["error-color"]
    : props.progress > 0
    ? colors["success-color"]
    : "transparent"
);
</script>

<template>
  <div class="progress-bar">
    <span
      class="progress-bar__fill"
      :style="{
        width: progress + '%',
        backgroundImage: `repeating-linear-gradient(
          45deg,
          ${bgColor},
          ${bgColor} 1rem,
          ${colors['success-color-faded']} 1rem,
          ${colors['success-color-faded']} 2rem
        )`,
        backgroundSize: '2rem 2rem',
      }"
      >{{ progress }}%</span
    >
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  display: flex;
  width: 100%;
  height: 2rem;
  border-radius: calc($radius/2);
  overflow: hidden;
  border: 1px solid rgba($secondary-color, 0.1);

  &__fill {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: $semi-bold;
    border-radius: calc($radius/2);
    animation: barberpole 1s linear infinite;
    background-position: 0 0;
  }
}

@keyframes barberpole {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 2rem 0;
  }
}
</style>
