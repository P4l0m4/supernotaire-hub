<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  duration: {
    type: Number,
    default: 4000,
  },
  progressColor: {
    type: String,
    default: "#22262e",
  },
});

const displayModal = ref(true);
const progress = ref(100);
let hideTimeout: ReturnType<typeof setTimeout> | null = null;
let frameId: number | null = null;

const startProgress = () => {
  const safeDuration = Math.max(props.duration, 1);
  const start = performance.now();

  const tick = (now: number) => {
    const elapsed = now - start;
    const remaining = Math.max(safeDuration - elapsed, 0);
    progress.value = (remaining / safeDuration) * 100;

    if (elapsed < safeDuration) {
      frameId = requestAnimationFrame(tick);
    } else {
      displayModal.value = false;
    }
  };

  frameId = requestAnimationFrame(tick);
  hideTimeout = setTimeout(() => {
    displayModal.value = false;
  }, safeDuration);
};

onMounted(() => {
  startProgress();
});

onBeforeUnmount(() => {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
  }
  if (frameId) {
    cancelAnimationFrame(frameId);
  }
});
</script>
<template>
  <Transition>
    <div class="notification-modal" v-if="displayModal">
      <slot />
      <div class="notification-modal__progress">
        <div
          class="notification-modal__progress__color"
          :style="{ width: `${progress}%`, backgroundColor: progressColor }"
        />
      </div></div
  ></Transition>
</template>
<style lang="scss" scoped>
.notification-modal {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: fit-content;
  height: fit-content;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__progress {
    width: 100%;
    height: 0.35rem;
    border-radius: $radius;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;

    &__color {
      height: 100%;
      transition: width 0.4s linear;
    }
  }
}
</style>
