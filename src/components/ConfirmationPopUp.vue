<script setup lang="ts">
import { ref } from "vue";
const target = ref<HTMLElement | null>(null);

const emit = defineEmits(["closeConfirmation"]);
</script>

<template>
  <section
    class="pop-up"
    @click="emit('closeConfirmation')"
    @keydown.esc="emit('closeConfirmation')"
    @keydown.enter="emit('closeConfirmation')"
    @keydown.space="emit('closeConfirmation')"
    tabindex="0"
    aria-label="fermer la pop up"
  >
    <div
      class="pop-up__content"
      ref="target"
      tabindex="0"
      @keydown.esc="emit('closeConfirmation')"
    >
      <h2 class="subtitles"><slot name="title" /></h2>
      <span class="paragraphs"><slot /></span>
      <slot name="button" />
    </div>
  </section>
</template>
<style lang="scss" scoped>
.pop-up {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100vw;
  background-color: rgba($accent-color, 0.1);
  backdrop-filter: blur(4px);
  padding: 1rem;
  z-index: 1;

  &__content {
    background-color: $primary-color;
    border-radius: $radius;
    padding: 1rem;
    width: 100%;
    max-width: 450px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    text-align: center;
    white-space: pre-wrap;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
    }

    .subtitles {
      color: $text-color;
    }

    & :deep(a) {
      color: $secondary-color !important;
    }
  }
}
</style>
