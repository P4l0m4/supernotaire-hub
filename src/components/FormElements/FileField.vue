<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  id: string;
  name: string;
  label: string;
  icon?: string;
  required?: boolean;
  error?: string;
  accept?: string[];
  multiple?: boolean;
}

withDefaults(defineProps<Props>(), {
  required: true,
  multiple: false,
  accept: () => [".pdf", ".png", ".jpg", ".jpeg"],
});

const model = defineModel<File | File[] | null>();

const fileInputRef = ref<HTMLInputElement | null>(null);

const simulateClick = () => {
  fileInputRef.value?.click();
};
</script>
<template>
  <div
    class="file-field"
    :class="{ shake: error, 'file-field--has-error': error }"
    @click="simulateClick"
  >
    <UIIconComponent
      v-if="icon"
      :icon="icon"
      :color="colors['text-color']"
      size="1.5rem"
    />
    <input
      type="file"
      :id="id"
      :name="name"
      :multiple="multiple"
      :required="required"
      :accept="accept?.join(',')"
      ref="fileInputRef"
      class="file-field__input"
      @click="(e) => e.stopPropagation()"
      @change="(e) => model = (e.target as HTMLInputElement).files ? (multiple ? Array.from((e.target as HTMLInputElement).files!) : (e.target as HTMLInputElement).files![0]) : null"
    />
    <!-- if a file has been chosen -->
    <UIIconComponent
      v-if="model"
      icon="check_circle"
      :color="colors['success-color']"
      size="1.5rem"
    />
  </div>
</template>
<style scoped lang="scss">
.file-field {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  background-color: $base-color;
  border-radius: calc($radius/2);
  border: none;
  padding: 0 0.75rem;
  box-shadow: $shadow-black;
  position: relative;
  height: 55px;
  cursor: pointer;

  &--has-error {
    background-color: rgba($error-color, 0.1);

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 20px #fae3e1 inset !important;
      //the color cannot have transparency, need to update this in case the error background color changes
    }
  }

  &:focus-within {
    border: 1px solid $accent-color-faded;
    box-shadow: 0 0px 6px 0px $accent-color-faded;
  }

  input[type="file"] {
    font-size: 1rem;
    padding: 0.65rem 0;
    border: none;
    color: $text-color-faded;
    background-color: transparent !important;
    width: 100% !important;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    caret-color: $text-color;
    font-family: inherit;
    display: inline-block;
    cursor: pointer;
  }

  input[type="file"]:focus {
    outline: none;
    outline-offset: 0px;
  }

  input[type="file"]::file-selector-button {
    border: none;
    background: transparent;
    color: $text-color;
    font-family: inherit;
    cursor: pointer;
    display: none;

    @media (min-width: $big-tablet-screen) {
      display: inline-block;
      margin-right: 4rem;
    }
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
