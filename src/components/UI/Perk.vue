<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>
<template>
  <div class="perk">
    <span
      class="perk__icon"
      aria-label="Illustration animée"
      role="img"
      v-html="icon"
    ></span>
    <h2 class="perk__title">{{ title }}</h2>
    <p class="paragraphs">{{ description }}</p>
  </div>
</template>
<style lang="scss" scoped>
.perk {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  color: $text-color;
  width: 100%;
  border-radius: calc($radius / 2);
  border: 1px solid rgba($text-color, 0.1);
  transition: transform 0.2s linear, color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    color: $success-color;
    background-color: rgba($success-color, 0.1);
    border: 1px solid transparent;
    box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);

    .perk__icon {
      background-color: rgba($success-color, 0.1);
      border: 1px solid transparent;
    }

    .paragraphs {
      color: $text-color;
    }
  }

  ::v-deep svg {
    height: 2rem;
    width: auto;
    transition: fill 0.2s ease, stroke 0.2s ease;
    stroke: currentColor;
    fill: none !important;
  }

  ::v-deep svg path {
    transition: fill 0.2s ease;
    stroke: currentColor !important;
    fill: none !important;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: $medium;
  }

  .paragraphs {
    margin-top: -0.7rem;
    color: $text-color-faded;
  }

  &__icon {
    width: 4rem;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc($radius / 2);
    border: 1px solid rgba($text-color, 0.1);
    transition: background-color 0.2s ease, border 0.2s ease;
  }
}
</style>
