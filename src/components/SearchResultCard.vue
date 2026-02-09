<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  cornerColor?: string;
  cornerIcon?: string;
}

defineProps<Props>();
</script>
<template>
  <div
    class="search-result-card"
    :style="{
      backgroundImage: `linear-gradient(45deg, ${cornerColor}20, #ffffff 70%, ${cornerColor}10)`,
      borderColor: cornerColor ? `${cornerColor}10` : '',
    }"
  >
    <div class="search-result-card__header">
      <h3 class="search-result-card__header__title">{{ title }}</h3>
      <h4 v-if="subtitle" class="search-result-card__header__subtitle">
        {{ subtitle }}
      </h4>
    </div>
    <div class="search-result-card__body">
      <slot />
    </div>
    <span
      v-if="cornerIcon && cornerColor"
      class="corner"
      :style="{ backgroundColor: `${cornerColor}10` }"
      ><UIIconComponent :icon="cornerIcon" :color="cornerColor" size="1.5rem"
    /></span>
  </div>
</template>
<style scoped lang="scss">
.search-result-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: calc($radius / 2);
  border: 1px solid rgba($text-color, 0.1);
  background-position: top right;
  background-size: 200% 200%;
  position: relative;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 1.5rem;

    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease,
      background-color 0.3s linear,
      color 0.3s linear,
      border-color 0.3s linear,
      filter 0.3s linear,
      background-position 0.3s linear;

    &:hover {
      background-color: $primary-color;
      box-shadow: $shadow-black;
      background-position: top left;
      transform: translateY(-3px);
      border-color: $primary-color;
      cursor: pointer;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: fit-content;

    &__title {
      font-size: 1.25rem;
      font-weight: $semi-bold;
      color: $text-color;
      line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      -webkit-line-clamp: 3;
      -moz-line-clamp: 3;
      overflow: hidden;
    }

    &__subtitle {
      font-size: $small-text;
      font-weight: $regular;
      color: rgba($text-color, 0.7);
      line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      -webkit-line-clamp: 3;
      -moz-line-clamp: 3;
      overflow: hidden;
    }
  }

  &__body {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: fit-content;
  }
}

.corner {
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0 calc($radius / 2) 0 50%;
  padding: 0.5rem;
  height: clamp(2.5rem, 2.5rem, 2.5rem);
  width: clamp(2.5rem, 2.5rem, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
</style>
