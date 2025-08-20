<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";
import { onClickOutside } from "@vueuse/core";

const target = ref();

onClickOutside(target, () => {
  isSelectOpen.value = false;
});

const emit = defineEmits(["optionSelected"]);
defineProps({
  options: {
    type: Array<string>,
  },
  placeholder: String,
  icon: String,
  error: String,
});

const optionSelected = ref("");
const isSelectOpen = ref(false);

const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value;
};

function selectOption(option: string) {
  if (optionSelected.value === option) {
    optionSelected.value = "";
    emit("optionSelected", "");
  } else {
    optionSelected.value = option;
    emit("optionSelected", option);
  }
  isSelectOpen.value = false;
}
</script>
<template>
  <div class="select-field" ref="target">
    <span
      class="select-field__selected"
      @click="toggleSelect"
      @keydown.enter="toggleSelect"
      @keydown.space="toggleSelect"
      role="button"
      tabindex="0"
      :class="{
        'select-field__selected--open': isSelectOpen,
        shake: error,
        'select-field__selected--has-error': error,
      }"
    >
      <IconComponent
        v-if="icon?.length"
        :icon="icon"
        size="1rem"
        :color="colors['text-color-faded']" />

      <span class="select-field__selected__placeholder">{{
        optionSelected.length > 0 ? optionSelected : placeholder
      }}</span>
      <span style="opacity: 0.8; margin-left: auto">
        <IconComponent
          :icon="isSelectOpen ? 'caret_up_bold' : 'caret_down_bold'"
          size="1rem"
          :color="colors['text-color-faded']" /></span
    ></span>
    <div class="select-field__content" v-if="isSelectOpen">
      <span
        class="select-field__content__option"
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        @keydown.enter="selectOption(option)"
        @keydown.space="selectOption(option)"
        role="option"
        tabindex="0"
        :style="{
          opacity: optionSelected === option ? 0.6 : 1,
          backgroundColor:
            optionSelected === option ? colors['accent-color-faded'] : '',
        }"
        >{{ option }}</span
      >
    </div>
  </div>
</template>
<style lang="scss" scoped>
.select-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  &__selected {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    width: 100%;
    background-color: $primary-color;
    border-radius: calc($radius/2);
    border: 1px solid rgba($text-color, 0.1);
    cursor: pointer;
    height: 55px;
    max-height: 55px;

    &--open {
      border: 1px solid $accent-color-faded;
      box-shadow: 0 0px 6px 0px $accent-color-faded;
      border-radius: calc($radius/2) calc($radius/2) 0 0;
    }

    &__placeholder {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--has-error {
      border: 1px solid rgba($error-color, 0.1);
      background-color: rgba($error-color, 0.1);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 3.4rem;
    background-color: $primary-color;
    border-radius: 0 0 calc($radius/2) calc($radius/2);
    width: 100%;
    overflow-y: scroll;
    max-height: 240px;
    border: 1px solid $accent-color-faded;
    box-shadow: 0 2px 10px -2px $accent-color-faded;
    z-index: 2;

    @media (min-width: $big-tablet-screen) {
      height: fit-content;
      max-height: 300px;
      overflow: hidden;
    }

    &__option {
      padding: 0.75rem 1rem;
      width: 100%;
      height: fit-content;
      min-height: 40px;
      cursor: pointer;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-block;

      &:hover {
        background-color: rgba($accent-color, 0.1);
      }
    }
  }
}
</style>
