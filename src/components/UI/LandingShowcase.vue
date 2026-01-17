<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

const props = withDefaults(
  defineProps<{
    title: string;
    highlightedTitle: string;
    subtitle: string;
    imagePath: string;
    highlightColor?: string;
    reversed?: boolean;
  }>(),
  {
    highlightColor: colors["text-color"],
  }
);

const titleParts = computed(() => {
  const { title, highlightedTitle } = props;
  if (!title || !highlightedTitle) {
    return { before: "", highlighted: "", after: "" };
  }
  const startIndex = title.indexOf(highlightedTitle);
  if (startIndex === -1) {
    return { before: "", highlighted: "", after: title };
  }
  const before = title.slice(0, startIndex);
  const after = title.slice(startIndex + highlightedTitle.length);
  return { before, highlighted: highlightedTitle, after };
});
</script>
<template>
  <div
    class="landing-showcase"
    :class="{ 'landing-showcase--reversed': props.reversed }"
  >
    <div class="landing-showcase__text">
      <h2 class="landing-showcase__text__title">
        {{ titleParts.before }}
        <span class="italic" :style="{ color: props.highlightColor }">{{
          titleParts.highlighted
        }}</span>
        {{ titleParts.after }}
      </h2>
      <p class="landing-showcase__text__subtitle">
        {{ props.subtitle }}
      </p>
      <div class="landing-showcase__text__stamps"></div>
    </div>
    <div class="landing-showcase__interface">
      <img class="landing-showcase__interface__image" :src="props.imagePath" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.landing-showcase {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $laptop-screen) {
    flex-direction: row;
    align-items: center;
    gap: 4rem;
  }

  &--reversed {
    @media (min-width: $laptop-screen) {
      flex-direction: row-reverse;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    text-wrap: balance;
    line-height: 1.1;

    &__title {
      font-size: 2rem;
      font-weight: $semi-bold;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 3rem;
      }

      .italic {
        font-family: "Fitree-Italic";
        font-style: italic;
        font-weight: $medium;
        position: relative;
        width: fit-content;
      }
    }

    &__subtitle {
      font-size: 1.25rem;
      line-height: 1.25;
    }
  }

  &__interface {
    width: 100%;

    &__image {
      width: 100%;
      height: auto;
      max-height: 400px;
      object-fit: cover;
      border-radius: calc($radius / 2);
    }
  }
}
</style>
