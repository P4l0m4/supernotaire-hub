<script setup lang="ts">
import { ref } from "vue";

type CarouselElement = {
  link?: string;
  image?: string;
  label?: string;
};

interface Props {
  carouselElements: CarouselElement[];
}

const props = withDefaults(defineProps<Props>(), {
  carouselElements: () => [
    {
      link: "/aircraft/phenom-100",
      image: "/assets/images/100.webp",
      label: "Phenom 100",
    },
    {
      link: "/aircraft/phenom-300",
      image: "/assets/images/300.webp",
      label: "Phenom 300",
    },
    {
      link: "/aircraft/pc12",
      image: "/assets/images/12.webp",
      label: "Pilatus PC 12",
    },
  ],
});
const leftArrowRef = ref<HTMLButtonElement | null>(null);
const rightArrowRef = ref<HTMLButtonElement | null>(null);
const showArrows = ref(false);
const scrollableContainerRef = ref<HTMLDivElement | null>(null);
const scrollAmount = 300;

const scroll = (direction: "left" | "right") => {
  if (scrollableContainerRef.value) {
    if (direction === "left") {
      scrollableContainerRef.value.scrollTo({
        left: scrollableContainerRef.value.scrollLeft - scrollAmount,
        behavior: "smooth",
      });
    } else {
      scrollableContainerRef.value.scrollTo({
        left: scrollableContainerRef.value.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  }
};
</script>
<template>
  <section class="carousel">
    <Transition>
      <button
        class="carousel__button"
        ref="leftArrowRef"
        v-show="
          showArrows &&
          props.carouselElements.length > 4 &&
          scrollableContainerRef &&
          scrollableContainerRef.scrollLeft > 0
        "
        @click="scroll('left')"
        @mouseenter="showArrows = true"
      >
        <UIIconComponent icon="caret_left_bold" /></button
    ></Transition>

    <div
      class="carousel__container"
      ref="scrollableContainerRef"
      @mouseenter="showArrows = true"
      @mouseleave="showArrows = false"
    >
      <NuxtLink
        :to="slide.link"
        class="carousel__container__slide fading"
        :style="{ backgroundImage: `url(${slide.image})` }"
        v-for="slide in props.carouselElements"
        ><span class="carousel__container__slide__arrow">
          <UIIconComponent icon="arrow_up_right"
        /></span>
        <span class="carousel__container__slide__label">{{ slide.label }}</span>
      </NuxtLink>
    </div>
    <Transition>
      <button
        class="carousel__button"
        ref="rightArrowRef"
        v-show="showArrows && props.carouselElements.length > 4"
        @click="scroll('right')"
        @mouseenter="showArrows = true"
      >
        <UIIconComponent icon="caret_right_bold" /></button
    ></Transition>
  </section>
</template>
<style lang="scss" scoped>
.carousel {
  display: flex;
  align-items: center;
  padding: 0 0 0 1rem;
  overflow-x: hidden;
  width: 100%;
  position: relative;
  background-color: $base-color;

  @media (min-width: $big-tablet-screen) {
    padding: 0 0 0 1rem;
  }

  &__button {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 12rem;
    margin: auto;
    width: 40px;
    height: 40px;
    padding: 20px;
    background-color: $base-color;
    z-index: 1;
    border: none;
    display: none;
    justify-content: center;
    align-items: center;
    border-radius: 100%;
    cursor: pointer;

    & img {
      transform: rotate(90deg);
      width: 1rem;
    }

    @media (min-width: $big-tablet-screen) {
      display: flex;
    }

    &:nth-of-type(2) {
      left: auto;
      right: 12rem;

      & img {
        transform: rotate(-90deg);
      }
    }
  }

  @media (min-width: $big-tablet-screen) {
    padding: 0 2rem;
    padding-right: 0;
  }

  &__container {
    display: flex;
    gap: 1rem;
    width: fit-content;
    overflow-x: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    &__slide {
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: end;
      gap: 1rem;
      width: 300px;
      min-width: 300px;
      height: 240px;
      background-size: cover;
      background-position: center;
      padding: 1rem;
      border-radius: $radius;
      position: relative;
      overflow: hidden;
      transition: filter 0.3s linear, box-shadow 0.3s ease;
      filter: grayscale(30%);

      &:hover {
        filter: grayscale(0%);
        box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);

        & .carousel__container__slide__arrow {
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
  }
}
</style>
