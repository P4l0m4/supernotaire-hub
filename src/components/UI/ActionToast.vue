<script setup lang="ts">
interface Props {
  icon: string;
  color: string;
  direction?: "row" | "column";
  actionLabel?: string;
  onAction?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "row",
  onAction: () => {},
});
</script>
<template>
  <button
    class="action-toast"
    :style="{
      backgroundColor: `${props.color}10`,
      flexDirection: props.direction,
    }"
  >
    <UIWrappedIcon :icon="icon" :color="color" size="big" />
    <div class="action-text" :class="direction">
      <span class="primary-message"><slot /></span>

      <span class="secondary-message"><slot name="secondaryMessage" /></span>
    </div>
    <span
      v-if="actionLabel && actionLabel.length"
      class="action-label"
      :class="direction"
      @click.stop="props.onAction()"
      >{{ actionLabel }}</span
    >
  </button>
</template>
<style lang="scss" scoped>
.action-toast {
  display: flex;
  border-radius: calc($radius / 2);
  padding: 1rem;
  gap: 1rem;
  height: fit-content;
  width: 100%;
  max-width: 400px;
  border: none;
  outline: none;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: calc($radius / 2);
    z-index: -1;
    background-color: $primary-color;
  }

  .action-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: start;
    text-align: left;

    .primary-message {
      font-size: 1rem;
      font-weight: $regular;
      color: $text-color;
      font-weight: $regular;
    }

    .secondary-message {
      font-size: 0.875rem;
      font-weight: $regular;
      color: $text-color-faded;
      font-weight: $regular;
    }
  }

  .action-text.row {
    min-height: 4rem;
    justify-content: center;
  }

  .action-label {
    text-decoration: underline;
    font-size: 0.875rem;
    font-weight: $regular;
    color: $text-color-faded;
    width: fit-content;
    height: fit-content;
    margin-top: -0.5rem;
  }

  .action-label.row {
    margin: initial;
    margin-left: -0.5rem;
  }
}
</style>
