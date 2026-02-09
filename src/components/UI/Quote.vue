<script setup lang="ts">
import { colors } from "@/utils/colors";

const props = defineProps<{
  quote: string;
  author?: string;
}>();

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "Quotation" as const,
  spokenByCharacter: {
    "@type": "Person" as const,
    name: props.author || "Anonymous",
  },
  text: props.quote,
}));
</script>
<template>
  <div class="quote">
    <UIIconComponent
      icon="quotes_fill"
      size="6rem"
      :color="colors['primary-color']"
    />
    <p class="quote__text">{{ quote }}</p>
    <span v-if="author" class="quote__author">{{ author }}</span>
  </div>
</template>
<style lang="scss" scoped>
.quote {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 1rem;
  background-color: $secondary-color;
  border-radius: $radius;
  height: fit-content;

  color: $text-color-alt;
  box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    min-height: 40vh;
  }

  @media (min-width: $super-big-screen) {
    min-height: 30vh;
  }

  &__text {
    font-size: 1.5rem;
    font-weight: $regular;
    line-height: 1.6;
    text-shadow: $shadow-text;
  }

  &__author {
    font-weight: $regular;
    font-size: $small-text;
    color: rgba($primary-color, 0.1);
  }
}
</style>
