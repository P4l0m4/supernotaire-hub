<script setup lang="ts">
interface Props {
  link: string;
  image: string;
  label: string;
  width?: string;
}

withDefaults(defineProps<Props>(), {
  width: "18.75rem",
});
</script>
<template>
  <NuxtLink
    :to="link"
    class="carousel-slide fading"
    :style="{
      backgroundImage: `url(${image})`,
      width,
      minWidth: width,
    }"
    :aria-label="label"
  >
    <span class="carousel-slide__arrow">
      <UIIconComponent icon="arrow_up_right" />
    </span>
    <span class="carousel-slide__label">{{ label }}</span>
  </NuxtLink>
</template>
<style scoped lang="scss">
.carousel-slide {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
  gap: 1rem;
  aspect-ratio: 5 / 4;
  background-size: cover;
  background-position: center;
  padding: 1rem;
  border-radius: $radius;
  position: relative;
  overflow: hidden;
  scroll-snap-align: center;
  transition: filter 0.3s linear, box-shadow 0.3s ease;
  filter: grayscale(30%);

  &:hover {
    filter: grayscale(0%);
    box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);

    & .carousel-slide__arrow {
      transform: rotate(15deg);
    }
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(45deg, $text-color, transparent 60%);
    opacity: 0.8;
  }

  @media (min-width: $big-tablet-screen) {
    width: 360px;
    min-width: 360px;
    height: 280px;
  }

  &__label {
    font-size: 1rem;
    font-weight: $medium;
    background-color: $base-color;
    padding: 0.75rem 0.75rem 0.5rem 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    border-radius: calc($radius * 0.5);
    color: $text-color;
    height: fit-content;
    z-index: 1;
    box-shadow: $shadow-black;
  }

  &__arrow {
    padding: 0.5rem;
    background-color: $base-color;
    border-radius: $radius;
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    z-index: 1;
    box-shadow: $shadow-black;
    width: fit-content;
    margin-bottom: auto;
    transition: transform 0.3s ease;

    & img {
      width: 1rem;
      height: 1rem;
      transform: rotate(45deg);
    }
  }
}
</style>
