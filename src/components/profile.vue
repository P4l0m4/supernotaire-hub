<script setup lang="ts">
type Decoration = "left" | "right";

defineProps<{
  image: string;
  title: string;
  subtitle: string;
  link?: string;
  linkText?: string;
  decoration: Decoration;
}>();
</script>
<template>
  <NuxtLink
    class="profile"
    :class="{
      'profile--left': decoration === 'left',
      'profile--right': decoration === 'right',
    }"
    :to="link"
    aria-label="montrez-moi comment"
  >
    <img class="profile__image" :src="image" :alt="`image de ${title}`" />
    <h2 class="profile__title">{{ title }}</h2>
    <p class="profile__subtitle">{{ subtitle }}</p>

    <TertiaryButton
      class="profile__link"
      variant="text-color-faded"
      icon="arrow_right"
      >{{ linkText }}</TertiaryButton
    >
  </NuxtLink>
</template>
<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  justify-content: center;
  border-radius: $radius;
  border: 1px solid rgba($text-color, 0.1);
  width: 100%;
  background-color: $base-color;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    background-image: url("@/assets/images/dots.svg");
    height: 8.56rem;
    width: 4rem;
    z-index: -1;
    opacity: 0.3;
  }

  &--left {
    &::before {
      left: -2rem;
      bottom: -2rem;
    }
  }

  &--right {
    &::before {
      right: -2rem;
      top: -2rem;
    }
  }

  @media (min-width: $big-tablet-screen) {
    gap: 2rem;
    padding: 2rem;
  }

  &__image {
    height: 21.25rem;
    width: fit-content;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: $bold;
    color: $text-color;
  }

  &__subtitle {
    font-size: 1.25rem;
    font-weight: $regular;
    color: $text-color;
    margin-top: -1rem;
  }

  &__link {
    margin-left: auto;
  }
}
</style>
