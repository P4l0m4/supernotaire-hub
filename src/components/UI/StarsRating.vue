<script setup lang="ts">
interface Props {
  rating: number;
  totalRatings?: number;
  color?: string;
}

defineProps<Props>();
</script>
<template>
  <div
    class="stars-rating"
    aria-label="Note Google"
    :style="{ color: color || '' }"
  >
    <UIIconComponent icon="star_four_fill" size="1rem" />{{
      Number(rating).toFixed(1)
    }}
    <span v-if="totalRatings !== undefined && totalRatings !== null"
      >({{ totalRatings }} avis)</span
    >
  </div>
</template>
<style scoped lang="scss">
.stars-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: $small-text;
  color: $accent-color;
  white-space: nowrap;
}
</style>
