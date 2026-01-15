<script setup lang="ts">
interface Feature {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  color: string;
  reverse?: boolean;
}

defineProps<{
  features: Feature[];
}>();
</script>
<template>
  <div id="features" class="features-list">
    <UIFeatureComponent
      v-for="feature in features"
      :key="feature.title"
      :title="feature.title"
      :subtitle="feature.subtitle"
      :description="feature.description"
      :image="feature.image"
      :color="feature.color"
      :reverse="feature.reverse"
    />
  </div>
</template>
<style lang="scss" scoped>
.features-list {
  display: flex;
  width: 100%;
  gap: 2rem;
  height: fit-content;
  flex-direction: column;

  @media (min-width: $big-tablet-screen) {
    gap: 4rem;
  }

  @media (min-width: $desktop-screen) {
    gap: 8rem;
  }
}
</style>
