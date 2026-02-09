<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

type Segment = {
  value: number;
  color?: string;
  label?: string;
  ariaLabel?: string;
};

type Props = {
  segments: Segment[];
  total?: number;
  trackColor?: string;
  height?: number;
  ariaLabel?: string;
};

const props = withDefaults(defineProps<Props>(), {
  segments: () => [],
  trackColor: () => `${colors["text-color"]}0D`, // ~5% opacity
  height: 14,
});

const totalValue = computed(() => {
  const positiveSum = props.segments
    .map((segment) => Math.max(segment.value, 0))
    .reduce((acc, curr) => acc + curr, 0);
  return props.total && props.total > 0 ? props.total : positiveSum || 1;
});

const normalizedSegments = computed(() =>
  props.segments.map((segment) => {
    const clampedValue = Math.max(segment.value, 0);
    return {
      ...segment,
      percent: Math.min((clampedValue / totalValue.value) * 100, 100),
      color: segment.color ?? colors["accent-color"],
    };
  }),
);
</script>

<template>
  <div
    class="segment-progress"
    role="img"
    :aria-label="ariaLabel || 'Barre de progression segmentée'"
  >
    <div
      class="segment-progress__track"
      :style="{
        backgroundColor: trackColor,
        height: `${height}px`,
      }"
    >
      <span
        v-for="(segment, index) in normalizedSegments"
        :key="index"
        class="segment-progress__segment"
        :style="{
          width: `${segment.percent}%`,
          backgroundColor: segment.color,
        }"
        :aria-label="
          segment.ariaLabel || segment.label || `Segment ${index + 1}`
        "
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.segment-progress {
  width: 100%;

  &__track {
    display: flex;
    width: 100%;
    border-radius: 2rem;
    overflow: hidden;
  }

  &__segment {
    display: block;
    height: 100%;
    transition: width 0.4s ease-in-out;
  }
}
</style>
