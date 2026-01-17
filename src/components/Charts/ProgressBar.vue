<script lang="ts" setup>
import { computed } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  progress: number;
  legend?: string;
  label: string;
  showHeader?: boolean;
  showPercentageText?: boolean;
  showLabel?: boolean;
  state?: "default" | "progress" | "completed" | "warning" | "error";
}
const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showLabel: true,
  showPercentageText: true,
  state: "default",
});

interface State {
  name: string;
  color: string;
  icon: string;
}

const states: State[] = [
  {
    name: "default",
    color: colors["secondary-color-faded"],
    icon: "circle",
  },
  {
    name: "progress",
    color: colors["accent-color"],
    icon: "spinner",
  },
  {
    name: "completed",
    color: colors["success-color"],
    icon: "check_circle",
  },
  {
    name: "warning",
    color: colors["warning-color"],
    icon: "alert_circle",
  },
  {
    name: "error",
    color: colors["error-color"],
    icon: "x_circle",
  },
];

const currentState = computed(() => {
  return states.find((state) => state.name === props.state);
});
</script>

<template>
  <div class="progress-bar" v-tooltip="props.showLabel ? '' : props.label">
    <div v-if="props.showHeader" class="progress-bar__header">
      <span v-if="props.showLabel" class="progress-bar__header__label">{{
        props.label
      }}</span>
      <div class="progress-bar__header__percentage">
        <span v-if="props.showPercentageText">{{ props.progress }}%</span>
        <UIIconComponent
          v-if="currentState"
          :icon="currentState.icon"
          :color="currentState.color"
        />
      </div>
    </div>
    <div class="progress-bar__track">
      <span
        class="progress-bar__track__fill"
        :style="{
          width: props.progress + '%',
          background: `${currentState?.color}60`,
        }"
      ></span>
    </div>
    <span v-if="props.legend" class="progress-bar__legend">{{
      props.legend
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: fit-content;

  &__track {
    display: flex;
    height: clamp(0.5rem, 0.5rem, 0.5rem);
    width: 100%;
    background-color: rgba($text-color, 0.05);
    border-radius: calc($radius/2);

    &__fill {
      height: clamp(0.5rem, 0.5rem, 0.5rem);
      border-radius: calc($radius/2);
      position: relative;

      &::after {
        content: "";
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        border-radius: calc($radius/2);
        background-color: $primary-color;
        z-index: -1;
      }
    }
  }

  &__header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: end;
    color: $text-color;

    &__label {
      font-size: 1rem;
      font-weight: $semi-bold;
      width: 100%;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__percentage {
      font-size: 1rem;
      font-weight: $medium;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      width: fit-content;
    }
  }

  &__legend {
    font-size: 1rem;
    color: $text-color-faded;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
