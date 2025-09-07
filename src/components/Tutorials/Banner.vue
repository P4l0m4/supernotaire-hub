<script setup lang="ts">
import dayjs from "dayjs";

defineProps<{
  title: string;
  description: string;
  lastUpdate?: string;
  totalTime?: string;
  cost?: string;
}>();

function formatDuration(duration: string) {
  // Simple ISO 8601 duration parser for formats like "PT1H30M" or "PT45M"
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = match[1] ? `${match[1]} h` : "";
  const minutes = match[2] ? `${match[2]} min` : "";

  return [hours, minutes].filter(Boolean).join(" ");
}
</script>
<template>
  <div class="banner">
    <h1 class="banner__title">{{ title }}</h1>
    <p class="banner__description">
      {{ description }}
    </p>
    <div v-if="lastUpdate || totalTime || cost" class="banner__details">
      <span v-if="lastUpdate" class="banner__details__last-update"
        ><UIIconComponent icon="calendar_dots" />{{
          dayjs(lastUpdate).format("DD/MM/YYYY")
        }}</span
      >
      <span v-if="totalTime" class="banner__details__total-time"
        ><UIIconComponent icon="timer" />{{ formatDuration(totalTime) }}</span
      >
      <span v-if="cost" class="banner__details__cost"
        ><UIIconComponent icon="hand_coins" />{{ cost }} €</span
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.banner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  background-color: $secondary-color;
  color: $text-color-alt;
  padding: 2rem 1rem 4rem 1rem;
  border-radius: calc($radius / 2);
  position: relative;

  @media (min-width: $big-tablet-screen) {
    padding: 2rem 2rem 4rem 2rem;
    min-height: 60vh;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: $bold;
    text-wrap: balance;

    @media (min-width: $tablet-screen) {
      font-size: 3rem;
    }

    @media (min-width: $big-tablet-screen) {
      font-size: 4rem;
    }
  }

  &__description {
    text-wrap: balance;
    color: $text-color-alt;

    @media (min-width: $desktop-screen) {
      max-width: 60%;
    }
  }

  &__details {
    display: flex;
    gap: 1.5rem;
    height: fit-content;
    position: absolute;
    right: 1rem;
    bottom: 1rem;

    @media (min-width: $big-tablet-screen) {
      right: 2rem;
      bottom: 2rem;
    }

    &__last-update,
    &__total-time,
    &__cost {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: $small-text;
      font-weight: $medium;
    }
  }
}
</style>
