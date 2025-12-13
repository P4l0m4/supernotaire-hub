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
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
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
