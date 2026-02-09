<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";
import type { Review } from "@/utils/reviews";

const props = defineProps<{
  reviews: Review[];
}>();

const usersCount = 1250;

const averageScore = computed(() => {
  const total = reviews.reduce((sum, review) => sum + review.score, 0);
  return total / reviews.length;
});
</script>
<template>
  <div class="review-score">
    <span class="review-score__text"
      >+{{ usersCount }} utilisateurs satisfaits</span
    >
    <div class="review-score__stars">
      <UIIconComponent
        icon="star_four_fill"
        v-for="star in 5"
        :key="star"
        :color="colors['warning-color']"
      />
    </div>
    <span class="review-score__text">{{ averageScore.toFixed(1) }}/5</span>
  </div>
</template>
<style lang="scss" scoped>
.review-score {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: rgba($text-color, 0.7);

  @media (min-width: $big-tablet-screen) {
    font-size: 1rem;
  }
}
</style>
