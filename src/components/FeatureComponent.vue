<script setup lang="ts">
interface props {
  title: string;
  subtitle: string;
  description: string;
  video?: string;
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
    <video v-if="video" class="feature__video" autoplay loop muted playsinline>
      <source :src="video" type="video/mp4" />
    </video>
  </div>
</template>
<style lang="scss" scoped>
.feature {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  border-radius: $radius;
  height: fit-content;

  @media (min-width: $tablet-screen) {
    padding: 2rem;
  }

  @media (min-width: $big-tablet-screen) {
    padding: 8rem 4rem;
    flex-direction: row;
    justify-content: space-between;
    min-height: 600px;
    align-items: center;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 525px;

    @media (min-width: $big-tablet-screen) {
      gap: 3rem;
    }

    &__title {
      font-size: 1rem;
      font-weight: $medium;
      background-color: $success-color-faded;
      padding: 0.75rem;
      text-align: center;
      width: 100%;
      max-width: 350px;
      text-transform: uppercase;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }

    &__subtitle {
      font-size: 1.5rem;
      font-weight: $semi-bold;
      color: $text-color;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 2rem;
      }
    }

    &__description {
      margin-top: -0.5rem;
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $regular;
      color: $text-color-faded;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.35rem;
      }
    }
  }

  &__video {
    width: 100%;
    height: 100%;
    background-color: $base-color;
    padding: 1rem;
    border-radius: $radius;
    outline: none;
    border: none;
    filter: grayscale(0);

    @media (min-width: $big-tablet-screen) {
      max-width: 500px;
    }
  }
}

.reverse {
  @media (min-width: $big-tablet-screen) {
    flex-direction: row-reverse;
  }
}
</style>
