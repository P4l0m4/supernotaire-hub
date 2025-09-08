<!-- <script setup lang="ts">
defineProps<{
  title: string;
  scrollPercentage?: number;
}>();

//if the user clicks or drags the scrollbar, emit the scroll corresponding scroll percentage where the user clicked
const emit = defineEmits<{
  (e: "scroll", value: number): void;
}>();
</script>
<template>
  <div class="sticky-banner">
    <h1 class="sticky-banner__title">{{ title }}</h1>
    <div class="sticky-banner__progress">
      <div
        class="sticky-banner__progress__fill"
        :style="{ width: `${scrollPercentage}%` }"
      ></div>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ title: string; scrollPercentage?: number }>();
const emit = defineEmits<{ (e: "scroll", value: number): void }>();

const bar = ref<HTMLElement | null>(null);
let dragging = false;

function pctFromX(clientX: number) {
  const el = bar.value!;
  const rect = el.getBoundingClientRect();
  const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
  return Math.round((x / rect.width) * 100);
}

function handleDown(e: MouseEvent | TouchEvent) {
  dragging = true;
  const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  emit("scroll", pctFromX(x));
  e.preventDefault();
}

function handleMove(e: MouseEvent | TouchEvent) {
  if (!dragging) return;
  const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  emit("scroll", pctFromX(x));
}

function handleUp() {
  dragging = false;
}

onMounted(() => {
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", handleUp);
});
onBeforeUnmount(() => {
  window.removeEventListener("mousemove", handleMove);
  window.removeEventListener("mouseup", handleUp);
  window.removeEventListener("touchmove", handleMove);
  window.removeEventListener("touchend", handleUp);
});
</script>

<template>
  <div class="sticky-banner">
    <h1 class="sticky-banner__title">{{ title }}</h1>

    <div
      ref="bar"
      class="sticky-banner__progress"
      role="slider"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="scrollPercentage ?? 0"
      @mousedown="handleDown"
      @touchstart="handleDown"
    >
      <div
        class="sticky-banner__progress__fill"
        :style="{ width: `${scrollPercentage ?? 0}%` }"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.sticky-banner {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: $secondary-color;
  color: $text-color-alt;
  padding: 1rem 4.5rem 1.5rem 1rem;
  height: 5rem;
  z-index: 2;
  position: sticky;
  top: 0;

  @media (min-width: $big-tablet-screen) {
    padding: 2rem 4rem 2rem 2rem;
  }

  @media (min-width: $laptop-screen) {
    top: 4.4375rem;
    padding: 1rem 2rem 1.5rem 2rem;
    height: fit-content;
  }

  @media (min-width: $desktop-screen) {
    padding: 1rem 4rem 1.5rem 4rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: $medium;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    max-width: 100%;
    text-shadow: 0 0 10px rgba($primary-color, 0.25);
  }

  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-top: 1rem solid $secondary-color;
    height: 1.5rem;
    background-color: rgba($primary-color, 0.25);
    cursor: pointer;

    &__fill {
      height: 100%;
      background-color: $accent-color;
      transition: width 0.25s ease-out;
    }
  }
}
</style>
