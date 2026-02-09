<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

type Props = {
  value: number;
};

const props = defineProps<Props>();

const size = 100;

const center = computed(() => size / 2);
const radius = computed(() => (size - 16) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(
  () => circumference.value * (1 - props.value / 100),
);

const currentColor = computed(() => {
  if (props.value === 0) return colors["text-color"];
  if (props.value === 100) return colors["success-color"];
  return colors["warning-color"];
});
</script>

<template>
  <figure
    class="donut"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="img"
    :aria-label="`${value}%`"
  >
    <svg :viewBox="`0 0 ${size} ${size}`" class="donut__svg">
      <circle
        class="donut__track"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="`${colors['text-color']}20`"
        :stroke-width="8"
      />
      <circle
        class="donut__value"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="currentColor"
        :stroke-width="8"
        stroke-linecap="round"
        :style="{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: dashOffset,
          transform: `rotate(-90deg)`,
          transformOrigin: `${center}px ${center}px`,
        }"
      />
    </svg>
    <figcaption class="donut__label"">
      {{ value }}%
    </figcaption>
  </figure>
</template>

<style scoped lang="scss">
.donut {
  display: inline-grid;
  place-items: center;
  position: relative;

  &__svg {
    display: block;
  }

  &__track {
    fill: none;
    opacity: 0.3;
  }

  &__value {
    fill: none;
    transition:
      stroke-dashoffset 0.4s ease,
      stroke 0.2s linear;
  }

  &__label {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-weight: $extra-bold;
    font-size: 1.5rem;
    user-select: none;
    color: $text-color;
  }
}
</style>
