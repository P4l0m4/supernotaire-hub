<script setup lang="ts">
import { colors } from "@/utils/colors";

const pushChecklistStart = (ctaLocation: "warning") => {
  if (!process.client) return;
  if (window.location.hostname === "localhost") return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: "checklist_start",
    page_type: "landing_vendeur_acheteur_trouve",
    cta_location: ctaLocation,
  });
};
</script>
<template>
  <div class="warning-section">
    <span class="big-icon">
      <UIIconComponent
        icon="folder_open"
        :color="`${colors['text-color']}30`"
        size="4rem"
      />
      <span class="big-icon__dot"
        ><UIIconComponent
          icon="alert_circle"
          :color="colors['primary-color']"
          size="1.25rem"
      /></span>
    </span>
    <div class="secondary-headlines">
      <h2 class="secondary-headlines__title">
        Un oubli peut
        <span
          :style="{
            color: `${colors['warning-color']}`,
            fontFamily: 'Fitree-Italic',
            fontStyle: 'italic',
          }"
          >retarder</span
        >
        ou
        <span
          :style="{
            color: `${colors['error-color']}`,
            fontFamily: 'Fitree-Italic',
            fontStyle: 'italic',
          }"
          >bloquer</span
        >
        la vente
      </h2>
      <span class="secondary-headlines__subtitle"
        >Évitez les mauvaises surprises chez le notaire en préparant un dossier
        complet et conforme, en toute sérénité.</span
      >
    </div>
    <NuxtLink
      to="/outils/checklist-dossier-vente-notaire"
      @click="pushChecklistStart('warning')"
    >
      <UIPrimaryButton
        variant="accent-color"
        icon="clock_countdown_fill"
        style="max-width: none"
      >
        Créer ma liste en 5 minutes
      </UIPrimaryButton>
    </NuxtLink>

    <div class="warning-section__info">
      <span class="warning-section__info__item"
        ><UIIconComponent icon="check_circle" size="0.85rem" />Gratuit et sans
        inscription</span
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.warning-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(rgba($warning-color, 0.1), transparent);
  padding: 2rem 1rem;
  height: fit-content;
  width: 100%;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 4.5rem 2rem;
  }

  @media (min-width: $desktop-screen) {
    justify-content: center;
    padding: 4.5rem 4rem;
    gap: 2.5rem;
    max-width: 2064px;
  }

  .big-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    border-radius: calc($radius / 2);
    background-color: $primary-color;
    box-shadow: 0.75rem 0.75rem 0 rgba($warning-color, 0.2);
    position: relative;

    &__dot {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -1rem;
      right: -1rem;
      border: 2px solid $primary-color;
      width: clamp(2.5rem, 2.5rem, 2.5rem);
      height: clamp(2.5rem, 2.5rem, 2.5rem);
      border-radius: 50%;
      background-color: $warning-color;
      animation: notification-shake 2s infinite;

      @keyframes notification-shake {
        0%,
        90%,
        100% {
          transform: translateX(0);
        }

        92% {
          transform: translateX(-3px);
        }
        94% {
          transform: translateX(3px);
        }
        96% {
          transform: translateX(-3px);
        }
        98% {
          transform: translateX(3px);
        }
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: -1rem;

    @media (min-width: $big-tablet-screen) {
      font-size: 1rem;
      flex-direction: row;
      margin-top: -1.5rem;
    }

    &__item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: rgba($text-color, 0.7);
      font-size: 0.85rem;
      font-weight: $regular;

      @media (min-width: $big-tablet-screen) {
        font-size: 1rem;
      }
    }
  }
}
</style>
