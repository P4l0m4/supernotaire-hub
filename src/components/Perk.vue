<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
}

defineProps<Props>();
</script>
<template>
  <div class="perk">
    <IconComponent :icon size="2rem" />
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
  border-radius: calc($radius/2);
  border: 1px solid rgba($text-color, 0.1);
  transition: transform 0.2s linear;

  &:hover {
    transform: translateY(-3px);
  }

  &__image {
    width: 100%;
    height: 235px;
    border-radius: $radius;
    object-fit: cover;
    object-position: center;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: $medium;
  }

  .paragraphs {
    margin-top: -0.7rem;
    color: $text-color-faded;
  }
}
</style>
