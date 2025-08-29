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
    <!-- first and last step should not have a left and right padding -->
    <div
      v-for="(stepLabel, index) in stepsLabels"
      :key="index"
      class="form-steps__item"
      :class="{
        'form-steps__item--active': index === currentStep - 1,
        'form-steps__item--completed': index < currentStep - 1,
      }"
      :style="{
        paddingLeft: index === 0 ? '0' : '',
        paddingRight: index === stepsLabels.length - 1 ? '0' : '',
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
        <span v-else class="form-steps__item__circle__number"
          >0{{ index + 1 }}</span
        >
      </div>
      <Transition>
        <span class="form-steps__item__label"
          >{{ stepLabel }}
        </span></Transition
      >
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
    border-radius: $radius;
    color: $text-color-faded;
    z-index: 1;
    transition: color linear 0.3s, background-color linear 0.3s,
      border linear 0.3s;

    &--active {
      color: $accent-color;
      background-color: $primary-color;
      border: none;

      & > .form-steps__item__circle {
        background-color: $accent-color;
        border-color: $accent-color;

        & > .form-steps__item__circle__number {
          color: $primary-color;
        }
      }

      & > .form-steps__item__label {
        display: flex;
      }
    }

    &--completed {
      color: rgba($accent-color, 0.6);
      background-color: $primary-color;
      border: none;

      & > .form-steps__item__circle {
        background-color: $accent-color-faded;
        color: $primary-color;
      }
    }

    @media (min-width: $desktop-screen) {
      flex-direction: row;
      border: none;
      padding: 0 1.5rem;
    }

    &__circle {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: rgba($accent-color, 0.1);
      padding: 1rem;
      height: 2.75rem;
      min-height: 2.75rem;
      width: 2.75rem;
      min-width: 2.75rem;
      transition: background-color linear 0.3s, border-color linear 0.3s,
        color linear 0.3s;

      &__number {
        font-weight: $regular;
        font-size: 1.25rem;
        display: flex;
        color: $accent-color;
      }
    }

    &__label {
      font-size: 1.25rem;
      font-weight: $regular;
      white-space: nowrap;
      display: none;
    }
  }
}
</style>
