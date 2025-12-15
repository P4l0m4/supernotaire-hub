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
      <UICarouselSlide
        v-for="(slide, index) in props.carouselElements"
        :key="index"
        :link="slide.link!"
        :image="slide.image!"
        :label="slide.label!"
      />
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
  overflow-x: hidden;
  width: 100%;
  position: relative;
  background-color: $base-color;

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

  &__container {
    display: flex;
    gap: 1rem;
    width: fit-content;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
