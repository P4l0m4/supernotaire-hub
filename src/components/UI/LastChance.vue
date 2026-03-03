<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>
<template>
  <div id="last-chance" class="last-chance">
    <div class="last-chance__text">
      <h2 class="last-chance__text__title">
        {{ title }}
      </h2>
      <p class="last-chance__text__subtitle">
        {{ subtitle }}
      </p>
    </div>
    <div class="last-chance__links">
      <slot name="links" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.last-chance {
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
  position: relative;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    gap: 3rem;
  }

  &::after {
    content: "";
    background-color: rgba($accent-color, 0.1);
    border-radius: calc($radius / 2);
    bottom: -0.75rem;
    right: -0.75rem;
    top: 0.75rem;
    left: 0.75rem;
    position: absolute;
    width: 100%;
    z-index: -1;
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

  &__links {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      gap: 1.5rem;
    }

    &__link {
      width: 100%;
      max-width: 24rem;
    }
  }
}
</style>
