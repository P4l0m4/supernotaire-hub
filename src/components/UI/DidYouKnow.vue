<script setup lang="ts">
import image from "/creative-process-11.svg?url";
defineProps<{
  title: string;
}>();
</script>
<template>
  <div class="did-you-know">
    <div class="did-you-know__content">
      <h2 class="did-you-know__content__title titles">Le saviez-vous ?</h2>
      <h3 class="did-you-know__content__subtitle subtitles">{{ title }}</h3>
      <p class="did-you-know__content__text paragraphs"><slot name="text" /></p>
      <div class="did-you-know__content__cta"><slot name="cta" /></div>
    </div>
    <div class="did-you-know__illustration">
      <img
        class="did-you-know__illustration__image"
        :src="image"
        alt="Le saviez-vous ?"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.did-you-know {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;
  width: 100%;
  min-width: 280px;
  min-height: 21.87rem;
  position: relative;
  overflow: hidden;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 3rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 28rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    min-height: 100%;
    position: relative;

    @media (min-width: $laptop-screen) {
      min-height: 27rem;
      max-width: 50rem;
      justify-content: center;
    }

    &__title {
      font-weight: $semi-bold;
      text-wrap: balance;
      max-width: 600px;
      z-index: 1;
    }

    &__subtitle {
      font-weight: $regular;
      color: $text-color;
      text-wrap: balance;
      margin-top: -1rem;
      z-index: 1;
    }

    &__text {
      text-wrap: balance;
      max-width: 35rem;
      color: $text-color;
      z-index: 1;
    }

    &__cta {
      z-index: 1;
    }
  }

  &__illustration {
    display: flex;
    width: 100%;
    max-width: 350px;
    height: 100%;
    position: relative;

    @media (min-width: $big-tablet-screen) {
      order: -1;
    }

    @media (min-width: $laptop-screen) {
      max-width: 400px;
    }

    &__image {
      width: 100%;
      height: 100%;
    }

    &::before {
      content: "";
      position: absolute;
      background-color: rgba($accent-color, 0.1);
      width: 12rem;
      height: 12rem;
      border-radius:  /* horizontal */ 80% 50% 70% 70% / /* vertical */ 100% 30%
        60% 70%;
      z-index: -1;
      top: 10%;
      bottom: 0;
      left: 0;

      @media (min-width: $tablet-screen) {
        width: 14rem;
        height: 14rem;
      }

      @media (min-width: $big-tablet-screen) {
        width: 16rem;
        height: 16rem;
      }

      @media (min-width: $laptop-screen) {
        width: 20rem;
        height: 20rem;
        bottom: 0;
        left: -10%;
        margin: auto;
      }
    }
  }
}
</style>
