<script setup lang="ts">
import { colors } from "@/utils/colors";
import { watch } from "vue";

interface StepsState {
  index: number;
  label: string;
  isCurrentStep: boolean;
  isValid: boolean;
  isVisited: boolean;
}

const props = defineProps<{
  stepsState: StepsState[];
}>();

const emit = defineEmits<{
  (e: "changeStep", step: number): void;
}>();

watch(
  () => props.stepsState.find((s) => s.isCurrentStep),
  () => {
    const stepElement = document.querySelector(
      `.form-steps__item--active`,
    ) as HTMLElement;
    if (stepElement) {
      stepElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  },
);
</script>
<template>
  <div class="form-steps">
    <div
      v-for="step in stepsState"
      :key="step.index"
      class="form-steps__item"
      :class="{
        'form-steps__item--active': step.isCurrentStep,
        'form-steps__item--completed':
          step.isValid && step.isVisited && !step.isCurrentStep,
        'form-steps__item--error':
          !step.isValid && step.isVisited && !step.isCurrentStep,
      }"
      :style="{
        paddingLeft: step.index === 0 ? '0' : '',
        paddingRight: step.index === stepsState.length - 1 ? '0' : '',
      }"
      @click="emit('changeStep', step.index - 1)"
      @keydown.enter="emit('changeStep', step.index - 1)"
      @keydown.space="emit('changeStep', step.index - 1)"
    >
      <div class="form-steps__item__circle">
        <!-- Étape active : toujours numéro -->
        <span
          v-if="step.isCurrentStep"
          class="form-steps__item__circle__number"
        >
          {{ `0${step.index}` }}
        </span>

        <UIIconComponent
          v-else-if="step.isVisited && step.isValid"
          icon="check_fat_fill"
          size="1rem"
          :color="colors['accent-color']"
        />

        <UIIconComponent
          v-else-if="step.isVisited && !step.isValid"
          icon="x_bold"
          size="1.25rem"
          :color="colors['error-color']"
        />

        <span v-else class="form-steps__item__circle__number">
          {{ `0${step.index}` }}
        </span>
      </div>

      <Transition>
        <span class="form-steps__item__label"
          >{{ step.label }}
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
    background-color: $base-color;
    border-radius: $radius;
    color: rgba($text-color, 0.7);
    z-index: 1;
    transition:
      color linear 0.3s,
      background-color linear 0.3s,
      border linear 0.3s;

    &--active {
      color: $accent-color;
      background-color: $base-color;
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
      background-color: $base-color;
      border: none;

      & > .form-steps__item__circle {
        background-color: rgba($accent-color, 0.1);
        color: $primary-color;
      }
    }

    &--error {
      color: rgba($error-color, 0.6);
      background-color: $base-color;
      border: none;

      & > .form-steps__item__circle {
        background-color: rgba($error-color, 0.1);
        color: $primary-color;
      }
    }

    @media (min-width: $desktop-screen) {
      flex-direction: row;
      border: none;
      padding: 0 1rem;

      &:nth-of-type(1) {
        padding-left: 0;
      }
      &:last-of-type {
        padding-right: 0;
      }
    }

    &__circle {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: rgba($accent-color, 0.1);
      padding: 0.5rem;
      height: 2rem;
      min-height: 2rem;
      width: 2rem;
      min-width: 2rem;
      transition:
        background-color linear 0.3s,
        border-color linear 0.3s,
        color linear 0.3s;

      &__number {
        font-weight: $regular;
        font-size: 1rem;
        display: flex;
        color: $accent-color;
      }
    }

    &__label {
      font-size: 1rem;
      font-weight: $regular;
      white-space: nowrap;
      display: none;
    }
  }
}
</style>
