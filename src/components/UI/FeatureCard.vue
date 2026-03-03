<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  icon: string;
  title: string;
  description: string;
}>();

const iconRenderKey = ref(0);

const reloadIconAnimation = () => {
  iconRenderKey.value += 1;
};
</script>
<template>
  <div
    class="feature-card"
    @focusin="reloadIconAnimation"
    @mouseenter="reloadIconAnimation"
  >
    <div class="feature-card__content">
      <span
        class="feature-card__content__icon"
        aria-label="Illustration animée"
        role="img"
        :key="iconRenderKey"
        v-html="icon"
      ></span>
      <h2 class="feature-card__content__title">{{ title }}</h2>
      <p class="paragraphs">{{ description }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: $accent-color;
  background-color: rgba($primary-color, 1);
  border: 1px solid transparent;
  width: 100%;
  border-radius: calc($radius / 2);
  box-shadow: 20px 40px 40px -30px rgba($text-color, 0.03);
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;

  @starting-style {
    background-color: $base-color;
  }

  ::v-deep svg {
    height: 2rem;
    width: auto;
    transition:
      fill 0.2s ease,
      stroke 0.2s ease;
    stroke: currentColor;
    fill: none !important;
  }

  ::v-deep svg path {
    transition: fill 0.2s ease;
    stroke: currentColor !important;
    fill: none !important;
  }

  &__content {
    display: flex;
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    border-radius: calc($radius / 2);
    transition:
      transform 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
    }

    &::before {
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

    &__title {
      font-size: 1.25rem;
      font-weight: $medium;
    }

    .paragraphs {
      margin-top: -0.7rem;
      color: $text-color;
    }

    &__icon {
      width: 4rem;
      height: 4rem;
      min-height: 4rem;
      min-width: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: calc($radius / 2);
      background-color: rgba($accent-color, 0.1);
      border: 1px solid transparent;
      transition:
        background-color 0.2s ease,
        border 0.2s ease;
    }
  }
}
</style>
