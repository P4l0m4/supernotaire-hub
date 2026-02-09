<script setup lang="ts">
import { colors } from "@/utils/colors";

const features = ref([
  {
    text: "1 an de EasyCase Premium dès sa sortie",
  },
  {
    text: "-30% à vie sur EasyCase Premium",
  },
  {
    text: "Accès anticipé aux nouvelles fonctionnalités",
  },
  {
    text: "Influence directe sur la feuille de route du produit",
  },
]);
</script>
<template>
  <div id="founder-promo" class="founder-promo">
    <div class="founder-promo__text">
      <h2 class="founder-promo__text__title">
        Devenez un Fondateur d'EasyCase
      </h2>
      <p class="founder-promo__text__subtitle">
        Bénéficiez de notre offre exclusive limitée aux 100 premiers
        adoptants.<br />
        Profitez d'avantages uniques et contribuez à façonner l'avenir de la
        profession notariale.
      </p>
    </div>
    <ul class="founder-promo__list">
      <li
        v-for="feature in features"
        :key="feature.text"
        class="founder-promo__list__item"
      >
        <UIIconComponent
          icon="check_circle"
          :color="colors['accent-color']"
          size="1.21rem"
        />
        {{ feature.text }}
      </li>
    </ul>
    <NuxtLink
      to="https://buy.stripe.com/dRm00k7vu51N6jBgKobV600"
      target="_blank"
      class="founder-promo__link"
    >
      <UIPrimaryButton variant="accent-color" icon="hand_heart_fill">
        Devenir Notaire Fondateur
      </UIPrimaryButton>
    </NuxtLink>
  </div>
</template>
<style lang="scss" scoped>
.founder-promo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  color: $text-color;
  width: 100%;
  background-color: $primary-color;
  border-radius: calc($radius/2);
  padding: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    gap: 3rem;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 49rem;
    text-align: center;
    align-items: center;

    @media (min-width: $big-tablet-screen) {
      gap: 1.5rem;
    }

    &__title {
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      font-weight: $semi-bold;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 2.5rem;
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $regular;
      color: rgba($text-color, 0.7);

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      font-weight: $regular;

      &:nth-of-type(1) {
        font-weight: $semi-bold;
      }

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }
  }

  &__link {
    width: 100%;
    max-width: 24rem;
  }
}
</style>
