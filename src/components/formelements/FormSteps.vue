<script setup lang="ts">
import { colors } from "@/utils/colors";
import { watch } from "vue";

const props = defineProps<{
  stepsLabels: string[];
  currentStep: number;
}>();

const emit = defineEmits<{
  (e: "changeStep", step: number): void;
}>();

//on mobile and tablet, make shure the current step is visible by scrolling horizontally
watch(
  () => props.currentStep,
  () => {
    const stepElement = document.querySelector(
      `.form-steps__item--active`
    ) as HTMLElement;
    if (stepElement) {
      stepElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }
);
</script>
<template>
  <div class="form-steps">
    <div
      v-for="(stepLabel, index) in stepsLabels"
      :key="index"
      class="form-steps__item"
      :class="{
        'form-steps__item--active': index === currentStep - 1,
        'form-steps__item--completed': index < currentStep - 1,
      }"
      @click="emit('changeStep', index)"
      @keydown.enter="emit('changeStep', index)"
      @keydown.space="emit('changeStep', index)"
    >
      <div class="form-steps__item__circle">
        <UIIconComponent
          v-if="index + 1 < currentStep"
          icon="check_fat_fill"
          size="1rem"
          :color="colors['accent-color']"
        />
        <span v-else class="form-steps__item__circle__number">{{
          index + 1
        }}</span>
      </div>

      <span class="form-steps__item__label">{{ stepLabel }} </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.form-steps {
  display: flex;
  gap: 1rem;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: $desktop-screen) {
    justify-content: space-between;
    position: relative;

    &::after {
      content: "";
      width: 100%;
      display: block;
      height: 1px;
      background-color: rgba($text-color, 0.1);
      position: absolute;
      inset: 0;
      margin: auto;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.5rem;
    width: fit-content;
    background-color: $primary-color;
    border: 1px solid rgba($text-color, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: $radius;
    color: $text-color-faded;
    z-index: 1;

    &--active {
      color: $accent-color;
      background-color: rgba($accent-color, 0.1);
      border: 1px solid rgba($accent-color, 0.1);

      @media (min-width: $desktop-screen) {
        background-color: $primary-color;
        border: none;

        & > .form-steps__item__circle {
          background-color: $accent-color;
          color: $primary-color;
        }
      }
    }

    &--completed {
      color: rgba($accent-color, 0.6);
      background-color: rgba($accent-color, 0.1);
      border: 1px solid rgba($accent-color, 0.1);

      @media (min-width: $desktop-screen) {
        background-color: $primary-color;
        border: none;

        & > .form-steps__item__circle {
          background-color: $accent-color-faded;
          color: $primary-color;
        }
      }
    }

    @media (min-width: $desktop-screen) {
      flex-direction: row;
      border: none;
      padding: 0 1.5rem;
    }

    &__circle {
      display: flex;

      @media (min-width: $desktop-screen) {
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: $text-color-faded;
        padding: 1rem;
        height: 2rem;
        min-height: 2rem;
        width: 2rem;
        min-width: 2rem;
      }

      &__number {
        font-weight: $medium;
        font-size: 1rem;
        display: flex;

        &::after {
          content: ".";
        }

        @media (min-width: $desktop-screen) {
          color: $primary-color;

          &::after {
            content: "";
          }
        }
      }
    }

    &__label {
      font-size: 1rem;
      font-weight: $medium;
      white-space: nowrap;
    }
  }
}
</style>
