<script setup lang="ts">
import { colors } from "@/utils/colors";
import { computed } from "vue";

import type { Review } from "@/utils/reviews";

const props = defineProps<{
  reviews: Review[];
}>();

const pushChecklistStart = (ctaLocation: "reviews") => {
  if (!process.client) return;
  if (window.location.hostname === "localhost") return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: "checklist_start",
    page_type: "landing_liste_documents_vente_immo",
    cta_location: ctaLocation,
  });
};

const totalReviews = computed(() => props.reviews.length);

const average = computed(() => {
  if (!totalReviews.value) return 0;

  const sum = props.reviews.reduce((acc, review) => acc + review.score, 0);
  return sum / totalReviews.value;
});

const averageRating = computed(() => average.value.toFixed(1));

const distribution = computed(() => {
  return [5, 4, 3, 2, 1].map((score) => {
    const count = props.reviews.filter(
      (review) => review.score === score,
    ).length;
    const percentage = totalReviews.value
      ? Math.round((count / totalReviews.value) * 100)
      : 0;

    return {
      score,
      count,
      percentage,
    };
  });
});
</script>
<template>
  <div id="already-used-by" class="already-used-by">
    <div class="secondary-headlines">
      <h2 class="secondary-headlines__title">
        Déjà utilisé par
        <span
          :style="{
            color: `${colors['accent-color']}`,
            fontFamily: 'Fitree-Italic',
            fontStyle: 'italic',
          }"
          >+1250</span
        >
        vendeurs français
      </h2>
      <NuxtLink
        to="/outils/checklist-dossier-vente-notaire"
        @click.prevent="pushChecklistStart('reviews')"
      >
        <UIPrimaryButton
          variant="accent-color"
          icon="file_text_fill"
          style="max-width: none"
        >
          Créer ma liste personnalisée
        </UIPrimaryButton>
      </NuxtLink>

      <div class="already-used-by__info">
        <span class="already-used-by__info__item"
          ><UIIconComponent
            icon="seal_percent_fill"
            size="1.5rem"
            :color="`${colors['text-color']}60`"
          />Gratuit</span
        >
        <span class="already-used-by__info__item"
          ><UIIconComponent
            icon="bell_slash_fill"
            size="1.5rem"
            :color="`${colors['text-color']}60`"
          />Sans inscription</span
        >
        <span class="already-used-by__info__item"
          ><UIIconComponent
            icon="clock_countdown_fill"
            size="1.5rem"
            :color="`${colors['text-color']}60`"
          />Gain de temps immédiat</span
        >
      </div>
    </div>
    <div class="already-used-by__card">
      <span class="already-used-by__card__title"
        >Évitez des semaines d’attente, préparez votre dossier complet en
        quelques minutes.</span
      >

      <div class="already-used-by__card__header">
        <div class="already-used-by__card__header__rating-block">
          <div class="already-used-by__card__header__rating-block__rating">
            {{ averageRating }}
          </div>

          <div class="already-used-by__card__header__rating-block__meta">
            <div
              class="already-used-by__card__header__rating-block__meta__stars"
              :aria-label="`Note moyenne de ${averageRating} sur 5`"
            >
              <UIIconComponent
                icon="star_four_fill"
                size="1.75rem"
                v-for="star in 5"
                :key="star"
                :color="colors['warning-color']"
              />
            </div>

            <div
              class="already-used-by__card__header__rating-block__meta__count"
            >
              {{ totalReviews }} AVIS
            </div>
          </div>
        </div>

        <p class="already-used-by__card__header__subtitle">
          Note moyenne des utilisateurs
        </p>
      </div>

      <div class="already-used-by__card__distribution">
        <div
          v-for="row in distribution"
          :key="row.score"
          class="already-used-by__card__distribution__row"
        >
          <span class="already-used-by__card__distribution__row__label">{{
            row.score
          }}</span>

          <div class="already-used-by__card__distribution__row__bar">
            <div
              class="already-used-by__card__distribution__row__bar-fill"
              :style="{ width: `${row.percentage}%` }"
              :aria-label="`${row.percentage}% des avis ont la note de ${row.score}`"
            />
          </div>

          <span class="already-used-by__card__distribution__row__percent"
            >{{ row.percentage }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.already-used-by {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  align-items: center;
  height: fit-content;
  width: 100%;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 4.5rem 2rem;
    gap: 3rem;
    justify-content: center;
    align-items: center;
  }

  @media (min-width: $desktop-screen) {
    flex-direction: row;
    gap: 4rem;
    padding: 4.5rem 4rem;
    max-width: 2064px;
  }

  & .secondary-headlines {
    @media (min-width: $desktop-screen) {
      max-width: 35rem;
      width: fit-content;
    }

    &__title {
      margin-bottom: 1rem;
      width: fit-content;
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;

    @media (min-width: $big-tablet-screen) {
      font-size: 1rem;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: rgba($text-color, 0.5);
      font-size: 1rem;
      font-weight: $semi-bold;
      width: fit-content;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: calc($radius/2);
    background-color: $primary-color;
    position: relative;
    padding: 2rem 1rem;
    gap: 2rem;

    @media (min-width: $big-tablet-screen) {
      padding: 4rem 2rem;
      gap: 2rem;
      max-width: 35rem;
    }

    &::after {
      content: "";
      background-color: rgba($secondary-color, 0.1);
      border-radius: calc($radius / 2);
      bottom: -0.75rem;
      right: -0.75rem;
      top: 0.75rem;
      left: 0.75rem;
      position: absolute;
      width: 100%;
      z-index: -1;
    }

    &__title {
      font-size: 1rem;
      line-height: 1.5;
      font-weight: $regular;
      color: rgba($text-color, 0.7);
      text-align: center;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      &__rating-block {
        display: flex;
        align-items: flex-start;
        gap: 1rem;

        &__rating {
          font-size: 5rem;
          line-height: 1;
          font-weight: $bold;
        }

        &__meta {
          display: flex;
          flex-direction: column;
          text-align: right;
          gap: 0.4rem;
          padding-top: 0.4rem;

          &__count {
            font-size: 1rem;
            font-weight: $medium;
            color: rgba($text-color, 0.6);
            text-transform: uppercase;
          }
        }
      }

      &__subtitle {
        font-size: 1.2rem;
        color: rgba($text-color, 0.6);
      }
    }

    &__distribution {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;

      &__row {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 1rem;

        &__bar {
          position: relative;
          width: 100%;
          height: 0.75rem;
          background: rgba($text-color, 0.05);
          border-radius: $radius;
          overflow: hidden;
        }

        &__label {
          font-size: 1rem;
          font-weight: $medium;
          color: $text-color;
        }

        &__percent {
          font-size: 1rem;
          color: rgba($text-color, 0.6);
          text-align: right;
        }

        &__bar-fill {
          height: 100%;
          background: $accent-color;
          border-radius: 999px;
          transition: width 0.25s ease;
        }
      }
    }
  }
}
</style>
