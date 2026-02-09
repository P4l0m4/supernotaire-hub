<script setup lang="ts">
interface props {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  color: string;
  reverse?: boolean;
}

defineProps<props>();
</script>
<template>
  <div
    class="feature"
    :class="{ reverse: reverse }"
    :style="{ backgroundColor: `${color}10` }"
  >
    <div class="feature__text">
      <h2
        class="feature__text__title"
        :style="{ backgroundColor: `${color}30`, color: color }"
      >
        {{ title }}
      </h2>
      <span class="feature__text__subtitle">{{ subtitle }}</span>
      <p class="feature__text__description">{{ description }}</p>
    </div>
    <img v-if="image" class="feature__image" :src="image" alt="" />
  </div>
</template>
<style lang="scss" scoped>
.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: $radius;
  height: fit-content;

  @media (min-width: $tablet-screen) {
    padding: 2rem;
  }

  @media (min-width: $big-tablet-screen) {
    padding: 2rem;
    align-items: center;
  }

  @media (min-width: $laptop-screen) {
    padding: 2rem 4rem;
    gap: 2rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 40rem;

    @media (min-width: $big-tablet-screen) {
      gap: 2rem;
    }

    @media (min-width: $laptop-screen) {
      align-items: flex-start;
    }

    &__title {
      font-size: 1rem;
      font-weight: $medium;
      background-color: rgba($success-color, 0.3);
      padding: 0.75rem;
      text-align: center;
      width: 100%;
      text-transform: uppercase;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
        max-width: 23rem;
      }
    }

    &__subtitle {
      font-size: 1.5rem;
      font-weight: $semi-bold;
      color: $text-color;
      text-wrap: balance;
      text-align: center;

      @media (min-width: $big-tablet-screen) {
        font-size: 2rem;
      }

      @media (min-width: $laptop-screen) {
        text-align: left;
      }
    }

    &__description {
      margin-top: -0.5rem;
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $regular;
      color: rgba($text-color, 0.7);
      text-align: center;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.35rem;
      }

      @media (min-width: $laptop-screen) {
        text-align: left;
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    max-width: 20rem;

    @media (min-width: $big-tablet-screen) {
      max-width: 25rem;
    }

    @media (min-width: $laptop-screen) {
      max-width: 35rem;
    }
  }
}

.reverse {
  @media (min-width: $laptop-screen) {
    flex-direction: row-reverse;
  }
}
</style>
