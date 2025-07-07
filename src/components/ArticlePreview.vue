<script setup lang="ts">
interface Props {
  image: string;
  title: string;
  description: string;
  link: string;
}

defineProps<Props>();
</script>
<template>
  <NuxtLink class="article-preview" :to="link">
    <img class="article-preview__image" :src="image" :alt="title" />
    <h2 class="article-preview__title">{{ title }}</h2>
    <p class="paragraphs">{{ description }}</p>
    <TertiaryButton>En savoir plus</TertiaryButton>
  </NuxtLink>
</template>
<style lang="scss" scoped>
.article-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: $text-color;
  width: 100%;
  border-radius: $radius;
  transition: transform 0.2s linear;

  &:hover {
    transform: translateY(-3px);
  }

  &__image {
    width: 100%;
    height: 235px;
    border-radius: $radius;
    object-fit: cover;
    object-position: center;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: $medium;
  }

  .paragraphs {
    margin-top: -0.7rem;
    color: $text-color-faded;
  }
}
</style>
