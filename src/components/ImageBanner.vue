<script setup lang="ts">
import { colors } from "@/utils/colors";
</script>
<template>
  <picture class="image-banner">
    <source
      srcset="@/assets/images/accompagnement-vente-immo.webp"
      media="(min-width: 1024px)"
    />
    <img
      src="@/assets/images/accompagnement-vente-immo-mobile.webp"
      alt="Bannière image Accélérer les transactions immobilières"
    />
    <div class="image-banner__overlay">
      <span class="image-banner__overlay__title"
        >Accélérez vos transactions immobilières</span
      >
      <span class="subtitles"
        >Simplifiez la collaboration notaires-clients et réduisez le délai de
        vente de plusieurs semaines.</span
      >
      <NuxtLink to="/inscription"
        ><UIPrimaryButton variant="accent-color"
          >Découvrir la solution</UIPrimaryButton
        ></NuxtLink
      >
      <div class="image-banner__overlay__info">
        <span class="image-banner__overlay__info__item"
          ><UIIconComponent
            icon="sparkle"
            :color="colors['primary-color']"
            size="1rem"
          />Automatisations intelligentes</span
        >
        <span class="image-banner__overlay__info__item"
          ><UIIconComponent
            icon="list_checks"
            :color="colors['primary-color']"
            size="1rem"
          />Dossiers complets et organisés</span
        >
        <span class="image-banner__overlay__info__item"
          ><UIIconComponent
            icon="clock_countdown"
            :color="colors['primary-color']"
            size="1rem"
          />Gain de temps immédiat</span
        >
      </div>
    </div>
  </picture>
</template>
<style scoped lang="scss">
.image-banner {
  width: 100%;
  height: fit-content;
  display: flex;
  position: relative;

  @media (min-width: $big-tablet-screen) {
    max-height: 100vh;
  }

  & img {
    filter: brightness(0.5);
    object-fit: cover;
    width: 100%;
    height: auto;
    border-radius: calc($radius / 2);
  }

  &__overlay {
    position: absolute;
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    inset: 0;
    color: $primary-color;

    @media (min-width: $big-tablet-screen) {
      gap: 2rem;
      padding: 2rem;
    }

    &__title {
      font-size: 2.25rem;
      font-weight: $bold;
      text-align: center;
      text-wrap: balance;
      line-height: 0.9;
      color: $primary-color;

      @media (min-width: $tablet-screen) {
        font-size: 3rem;
      }

      @media (min-width: $big-tablet-screen) {
        font-size: 4rem;
        max-width: 84%;
      }
    }
    .subtitles {
      color: $primary-color;
      text-align: center;
      text-wrap: balance;
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;

      @media (min-width: $big-tablet-screen) {
        font-size: 1rem;
        flex-direction: row;
      }

      &__item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: $primary-color;
        font-size: 0.85rem;
        font-weight: $regular;

        @media (min-width: $big-tablet-screen) {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
