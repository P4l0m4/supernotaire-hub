<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { colors } from "@/utils/colors";
import type { Review } from "@/utils/reviews";

const props = defineProps<{
  reviews: Review[];
}>();

const filteredReviews = computed(() =>
  props.reviews.filter((review) => review.text && review.text.length > 0),
);

const loopedReviews = computed(() => {
  const base = filteredReviews.value;
  return base.length ? [...base, ...base] : [];
});

const toIsoDate = (date: string) => {
  const [day, month, year] = date.split("-");
  if (!day || !month || !year) return date;
  const iso = new Date(`${year}-${month}-${day}`);
  return Number.isNaN(iso.getTime()) ? date : iso.toISOString().split("T")[0];
};

const averageScore = computed(() => {
  if (!filteredReviews.value.length) return null;
  const total = filteredReviews.value.reduce(
    (sum, review) => sum + (review.score || 0),
    0,
  );
  return Number((total / filteredReviews.value.length).toFixed(1));
});

const jsonLdReviews = computed(() =>
  filteredReviews.value.slice(0, 20).map((review) => ({
    "@type": "Review",
    reviewBody: review.text,
    author: { "@type": "Person", name: review.name },
    datePublished: toIsoDate(review.date),
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.score,
      bestRating: 5,
      worstRating: 1,
    },
  })),
);

const jsonLd = computed(() => {
  if (!filteredReviews.value.length || !averageScore.value) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EasyCase",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageScore.value,
      reviewCount: filteredReviews.value.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: jsonLdReviews.value,
  } as const;
});

watchEffect(() => {
  if (jsonLd.value) {
    useJsonld(jsonLd.value as any);
  }
});
</script>
<template>
  <div class="reviews-carousel">
    <ul class="reviews-carousel__cards">
      <li
        class="reviews-carousel__cards__card"
        v-for="(review, i) in loopedReviews"
        :key="`${review.name}-${i}`"
      >
        <div class="reviews-carousel__cards__card__stars">
          <UIIconComponent
            icon="star_four_fill"
            size="1.25rem"
            v-for="star in review.score"
            :key="star"
            :color="colors['warning-color']"
          />
        </div>
        <h3 class="reviews-carousel__cards__card__summary">
          {{ review.text.slice(0, 60)
          }}{{ review.text.length > 60 ? "..." : "" }}
        </h3>
        <p class="reviews-carousel__cards__card__content">
          "{{ review.text }}"
        </p>
        <div class="reviews-carousel__cards__card__author">
          <span class="reviews-carousel__cards__card__author__profile">{{
            `${review.name.split(" ")[0].charAt(0)} ${review.name
              .split(" ")[1]
              .charAt(0)}`
          }}</span>
          <span class="reviews-carousel__cards__card__author__name">{{
            review.name
          }}</span>
          <span class="reviews-carousel__cards__card__author__date">{{
            review.date
          }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.reviews-carousel {
  display: flex;
  gap: 2rem;
  height: fit-content;
  overflow: hidden;

  &__cards {
    display: flex;
    gap: 1.5rem;
    height: fit-content;
    max-height: 500px;
    list-style: none;
    padding: 0;
    margin: 0;
    width: max-content;
    animation: reviews-marquee 120s linear infinite;
    will-change: transform;

    &:hover {
      animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }

    &__card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: clamp(280px, 30vw, 370px);
      height: auto;
      border-radius: calc($radius / 2);
      padding: 1rem;
      background-color: $primary-color;
      box-shadow: $shadow-black;

      @media (min-width: $big-tablet-screen) {
        padding: 1.5rem;
      }

      &__stars {
        display: flex;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
      }

      &__summary {
        font-size: 1.25rem;
        font-weight: $bold;
        color: $text-color;
      }

      &__content {
        font-size: 1rem;
        color: $text-color;
      }

      &__author {
        margin-top: auto;
        display: grid;
        column-gap: 0.75rem;
        grid-template-columns: 1fr 100%;
        grid-template-rows: 1fr 1fr;
        color: rgba($text-color, 0.7);

        &__profile {
          display: flex;
          width: clamp(2.5rem, 2.5rem, 2.5rem);
          height: clamp(2.5rem, 2.5rem, 2.5rem);
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgba($warning-color, 0.1);
          color: $warning-color;
          font-weight: $semi-bold;
          grid-column: 1;
          grid-row: 1 / span 2;
          letter-spacing: -2px;
        }

        &__name {
          font-weight: $semi-bold;
          font-size: 1rem;
        }

        &__date {
          font-size: 0.85rem;
        }
      }
    }
  }
}

@keyframes reviews-marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
