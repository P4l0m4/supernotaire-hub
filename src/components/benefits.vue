<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
  text: string;
}>();
</script>
<template>
  <div class="benefits">
    <h2 class="benefits__title">{{ title }}</h2>
    <span class="benefits__subtitle">{{ subtitle }}</span>
    <p class="benefits__text">
      {{ text }}
    </p>
  </div>
</template>
<style lang="scss" scoped>
.benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 0;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 0;
    gap: 2rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: $medium;
    color: $accent-color;
    text-transform: uppercase;

    @media (min-width: $big-tablet-screen) {
      font-size: 1.25rem;
    }
  }

  &__subtitle {
    font-size: 1.5rem;
    font-weight: $semi-bold;
    text-wrap: balance;

    @media (min-width: $big-tablet-screen) {
      font-size: 2.5rem;
    }
  }

  &__text {
    font-size: 1rem;
    color: $text-color-faded;
    text-wrap: balance;
    line-height: 1.35;

    @media (min-width: $big-tablet-screen) {
      font-size: 1.25rem;
    }
  }
}
</style>
