<script setup lang="ts">
import { stringToSlug } from "@/utils/slugify";
import { colors } from "@/utils/colors";

import type { TutorialOption } from "@/components/jsonLD/HowTo.vue";

defineProps<{
  options: TutorialOption[];
}>();
</script>

<template>
  <ol class="summary">
    <span class="summary__title">Sommaire</span>
    <li
      class="summary__option"
      v-for="(option, i) in options"
      :key="option.name"
    >
      <NuxtLink
        class="summary__option__name"
        :to="`#${stringToSlug(option.name)}`"
        >0{{ i + 1 }}. {{ option.name }}
      </NuxtLink>
      <ul class="summary__option__steps">
        <li
          class="summary__option__steps__step"
          v-for="step in option.steps"
          :key="step.name"
        >
          <NuxtLink
            class="summary__option__steps__step__name"
            :to="`#${stringToSlug(step.name)}`"
            >{{ step.name }}</NuxtLink
          >
        </li>
      </ul>
    </li>
  </ol>
</template>
<style lang="scss" scoped>
.summary {
  padding: 1rem;
  border-radius: $radius;
  border: 1px solid rgba($text-color, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  &__title {
    font-weight: $medium;
    color: $text-color;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  &__option {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    &__name {
      font-weight: $medium;
      color: $text-color;
      font-size: 1rem;
    }

    &__steps {
      list-style-position: inside;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      &__step {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        list-style-type: circle;
        transition: list-style-type 0.3s linear;

        &:hover {
          list-style-type: disc;

          & > .summary__option__steps__step__name {
            font-weight: $medium;
          }
        }

        &__name {
          color: $text-color;
          font-size: $small-text;
          font-weight: $regular;
          padding: 0.5rem 0;
        }
      }
    }
  }
}
</style>
