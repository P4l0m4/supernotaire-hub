<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

const props = defineProps<{
  title?: string;
  subtitle?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const modalRef = ref<HTMLElement | null>(null);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  modalRef.value?.focus();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});

onClickOutside(modalRef, () => {
  emit("close");
});
</script>

<template>
  <div class="full-page-modal" role="dialog" aria-modal="true">
    <div ref="modalRef" class="full-page-modal__content" tabindex="-1">
      <header
        v-if="props.title || props.subtitle"
        class="full-page-modal__content__header"
      >
        <h2 v-if="props.title" class="full-page-modal__content__title">
          {{ props.title }}
        </h2>
        <p v-if="props.subtitle" class="full-page-modal__content__subtitle">
          {{ props.subtitle }}
        </p>
      </header>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.full-page-modal {
  position: fixed;
  inset: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: color-mix(in srgb, $accent-color 10%, transparent);
  backdrop-filter: blur(6px);
  isolation: isolate;
  z-index: 3;
  padding: 1rem;
  cursor: pointer;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    height: fit-content;
    align-items: center;
    text-align: center;
    width: clamp(288px, 100%, 35rem);
    padding: 1rem;
    background-color: $primary-color;
    border-radius: calc($radius/2);

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
    }

    &__header {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 1.5rem;

      &__title {
        font-size: 1.5rem;
        font-weight: $semi-bold;
        color: $text-color;
      }

      &__subtitle {
        font-size: 1rem;
        color: rgba($text-color, 0.7);
        text-align: center;
      }
    }
  }
}
</style>
