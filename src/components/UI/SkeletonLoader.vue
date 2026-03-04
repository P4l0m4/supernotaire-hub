<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  borderRadius?: string;
}

withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "2rem",
  borderRadius: "0.5rem",
});
</script>
<template>
  <span
    class="skeleton-loader"
    :style="{ width, height, minHeight: height, borderRadius }"
  ></span>
</template>
<style lang="scss" scoped>
.skeleton-loader {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, $base-color 80%, transparent) 15%,
    color-mix(in srgb, $secondary-color 12%, $primary-color 88%) 50%,
    color-mix(in srgb, $base-color 80%, transparent) 85%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
