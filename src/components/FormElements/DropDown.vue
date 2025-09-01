<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

interface Props {
  label: string;
  number?: number;
  icon?: string;
}

defineProps<Props>();

const isDropdownOpen = ref(false);

const target = useTemplateRef<HTMLElement>("target");
const contentEl = ref<HTMLElement | null>(null);

onClickOutside(target, () => (isDropdownOpen.value = false), {
  ignore: [contentEl],
});
</script>
<template>
  <div ref="target" class="dropdown">
    <span
      class="dropdown__header"
      @click="isDropdownOpen = !isDropdownOpen"
      @keydown.enter.prevent="isDropdownOpen = !isDropdownOpen"
      @keydown.space.prevent="isDropdownOpen = !isDropdownOpen"
      tabindex="0"
      role="button"
      :aria-label="label"
    >
      <UIIconComponent
        v-if="icon"
        :icon
        :color="colors['text-color-faded']" />{{ label }}
      <template v-if="number">({{ number }})</template
      ><UIIconComponent
        style="margin-left: auto"
        :icon="isDropdownOpen ? 'caret_down_bold' : 'caret_right_bold'"
        :color="colors['text-color-faded']"
    /></span>
    <div ref="contentEl" class="dropdown__content" v-if="isDropdownOpen">
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius/2);

  &__header {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    height: 40px;
    align-items: center;
    cursor: pointer;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
