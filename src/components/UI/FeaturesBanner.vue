<script lang="ts" setup>
import { colors } from "@/utils/colors";

interface Feature {
  name: string;
  icon: string;
  path: string;
}

defineProps<{
  features: Feature[];
}>();
</script>
<template>
  <div class="features-banner">
    <NuxtLink
      v-for="feature in features"
      :key="feature.name"
      class="features-banner__feature"
      :to="feature.path"
    >
      <UIIconComponent
        :icon="feature.icon"
        size="1.5rem"
        :color="colors['primary-color']"
      />
      <span class="features-banner__feature__name">
        {{ feature.name }}
      </span>
    </NuxtLink>
  </div>
</template>
<style lang="scss" scoped>
.features-banner {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  background-color: $secondary-color;
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
  border-radius: calc($radius / 2);
  position: relative;
  @media (min-width: $tablet-screen) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: $laptop-screen) {
    display: flex;
    justify-content: center;
    width: fit-content;
    padding: 2rem;
  }

  &::after {
    content: "";
    background-color: $accent-color;
    border-radius: calc($radius / 2);
    bottom: -0.75rem;
    right: -0.75rem;
    top: 0.75rem;
    left: 0.75rem;
    position: absolute;
    width: 100%;
    z-index: -1;
  }

  &__feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.8;
    color: $primary-color;
    transition:
      color 0.1s linear,
      opacity 0.1s linear;

    &__name {
      font-size: 1rem;
      font-weight: $semi-bold;
      text-align: center;
    }

    &:hover {
      color: $accent-color;
      opacity: 1;

      & span.icon {
        color: $accent-color !important;
      }
    }
  }
}
</style>
