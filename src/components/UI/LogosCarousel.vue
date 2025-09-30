<template>
  <div class="logos-carousel">
    <div class="logos-carousel__elements">
      <NuxtLink
        class="logos-carousel__elements__element"
        to="https://www.unit-academie.fr/"
        target="_blank"
        aria-label="Unit Académie"
        ><img
          src="@/assets/images/logo-unit-academie.webp"
          alt="logo unit academie"
          width="150"
          height="50"
      /></NuxtLink>
      <NuxtLink
        class="logos-carousel__elements__element"
        to="https://www.incubateur-savoietechnolac.com/"
        target="_blank"
        aria-label="Incubateur savoie technolac"
        ><img
          src="@/assets/images/logo-incubateur.webp"
          alt="logo incubateur savoie technolac"
          width="150"
          height="50"
      /></NuxtLink>
      <NuxtLink
        class="logos-carousel__elements__element"
        to="https://startupandgo-auvergnerhonealpes.fr/"
        target="_blank"
        ><img
          src="@/assets/images/logo-start-up-go.webp"
          alt="logo incubateur start up go"
          width="150"
          height="50"
      /></NuxtLink>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.logos-carousel {
  width: 100%;
  height: fit-content;

  &__elements {
    display: grid;
    grid-template-columns: 1fr;
    padding: 2rem 0;
    width: 100%;
    gap: 2rem;
    place-items: center;
    height: fit-content;

    @media (min-width: $big-tablet-screen) {
      display: flex;
      gap: 3rem;
      justify-content: center;
    }

    &__element {
      height: fit-content;
      width: fit-content;

      & img {
        object-fit: contain;
        width: 100%;
        max-width: 15rem;
        height: auto;
        filter: grayscale(100%);
        opacity: 0.7;
        transition: transform 0.3s ease-in-out;

        @media (min-width: $tablet-screen) {
          width: 10rem;
        }

        @media (min-width: $laptop-screen) {
          width: 12rem;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>
