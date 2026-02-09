<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

interface Props {
  label: string;
  number?: number;
  icon?: string;
  error?: string;
  required?: boolean;
  tooltip?: string;
  tooltipLink?: string;
}

const props = defineProps<Props>();

const isDropdownOpen = ref(false);

const target = useTemplateRef<HTMLElement>("target");
const contentEl = ref<HTMLElement | null>(null);

onClickOutside(target, () => (isDropdownOpen.value = false), {
  ignore: [contentEl],
});
</script>
<template>
  <div
    ref="target"
    class="dropdown"
    :class="{ 'dropdown--has-error': !!props.error }"
  >
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
        :color="`${colors['text-color']}70`" />{{ label }}
      <template v-if="number">({{ number }})</template
      ><UIIconComponent
        v-if="required"
        icon="asterisk"
        size="0.75rem"
        :color="`${colors['error-color']}70`"
        style="margin-left: 0.2rem" />
      <UIIconComponent
        v-if="tooltip?.length && !tooltipLink?.length"
        icon="question"
        class="dropdown__tooltip"
        :color="`${colors['text-color']}70`"
        size="1.15rem"
        data-tour="tooltip-icon"
        v-tooltip="tooltip"
        tabindex="0" />
      <NuxtLink
        v-else-if="tooltip?.length && tooltipLink?.length"
        :to="tooltipLink"
        target="_blank"
        rel="noreferrer"
        v-tooltip="tooltip"
        :aria-label="tooltip"
        class="dropdown__tooltip"
      >
        <UIIconComponent
          icon="question"
          :color="`${colors['text-color']}70`"
          size="1.15rem"
          data-tour="tooltip-icon"
        />
      </NuxtLink>
      <UIIconComponent
        style="margin-left: auto"
        :icon="isDropdownOpen ? 'caret_down_bold' : 'caret_right_bold'"
        :color="`${colors['text-color']}70`"
    /></span>
    <div ref="contentEl" class="dropdown__content" v-if="isDropdownOpen">
      <slot />
    </div>
    <span v-if="props.error" class="dropdown__error">{{ props.error }}</span>
  </div>
</template>
<style lang="scss" scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius/2);
  position: relative;

  &--has-error {
    border-color: $error-color;
    background-color: rgba($error-color, 0.08);
  }

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

  &__tooltip {
    display: inline-flex;
    align-items: center;
  }

  &__error {
    display: inline-block;
    position: absolute;
    color: $error-color;
    font-size: $small-text;
    bottom: 0rem;
    right: 0;
    padding: 0.1rem 0.25rem;
    border: 1px solid rgba($error-color, 0.1);
    background-color: rgba($error-color, 0.1);
    border-radius: calc($radius/2.2);
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
