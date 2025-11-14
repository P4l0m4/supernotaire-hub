<script setup lang="ts">
import { ref } from "vue";
import { colors } from "@/utils/colors";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon?: string;
  required?: boolean;
  autofocus?: boolean;
  error?: string;
  name: string;
  autocomplete?: "on" | "off";
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  tooltipLink?: string;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  required: true,
  autofocus: false,
  autocomplete: "on",
});

defineEmits<{
  (e: "blur"): void;
}>();

const model = defineModel<string | number | boolean>();
const inputRef = ref<HTMLInputElement | null>(null);

const showPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>
<template>
  <div
    class="input-field"
    :class="{ shake: error, 'input-field--has-error': error }"
  >
    <UIIconComponent
      v-if="icon"
      :icon="icon"
      :color="colors['text-color-faded']"
      size="1rem"
    />

    <input
      v-if="type === 'text' || type === 'email' || type === 'password'"
      v-model="model"
      ref="inputRef"
      :id="id"
      class="input-field__input"
      :type="type === 'password' && showPassword ? 'text' : type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :aria-label="label"
      :aria-labelledby="id"
      :title="label"
      :aria-placeholder="placeholder"
      :name="name"
      :value="model"
    />

    <input
      v-else-if="type === 'number'"
      v-model="model"
      ref="inputRef"
      :id="id"
      class="input-field__input"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :aria-label="label"
      :aria-labelledby="id"
      :title="label"
      :aria-placeholder="placeholder"
      :name="name"
      :value="model"
      :min="min ? min : undefined"
      :max="max ? max : undefined"
      :step="step ? step : undefined"
      @blur="$emit('blur')"
    />

    <UIIconComponent
      icon="eye"
      class="input-field__icon"
      style="cursor: pointer"
      v-if="type === 'password' && showPassword"
      @click="toggleShowPassword"
      @keydown.enter="toggleShowPassword"
      @keydown.space="toggleShowPassword"
    />
    <UIIconComponent
      icon="eye_off"
      class="input-field__icon"
      style="cursor: pointer"
      v-if="type === 'password' && !showPassword"
      @click="toggleShowPassword"
      @keydown.enter="toggleShowPassword"
      @keydown.space="toggleShowPassword"
    />

    <UIIconComponent
      v-if="tooltip?.length && !tooltipLink?.length"
      icon="question"
      class="input-field__icon"
      style="cursor: pointer"
      :color="colors['text-color-faded']"
      size="1.5rem"
      v-tooltip="tooltip"
      tabindex="0"
    />

    <NuxtLink
      v-else-if="tooltip?.length && tooltipLink?.length"
      :to="tooltipLink"
      target="_blank"
      v-tooltip="tooltip"
      :aria-label="tooltip"
      ><UIIconComponent
        icon="question"
        class="input-field__icon"
        :color="colors['text-color-faded']"
        size="1.5rem"
    /></NuxtLink>

    <span class="input-field__error" v-if="error">{{ error }}</span>
  </div>
</template>
<style lang="scss" scoped>
.input-field {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: center;
  background-color: $primary-color;
  border-radius: calc($radius/2);
  border: 1px solid rgba($text-color, 0.1);
  padding: 0 0.75rem;
  box-shadow: $shadow-black;
  position: relative;
  height: 55px;

  &--has-error {
    border: 1px solid rgba($error-color, 0.1);
    background-color: rgba($error-color, 0.1);

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 20px #fae3e1 inset !important;
      //the color cannot have transparency, need to update this in case the error background color changes
    }
  }

  &__label {
    font-size: $small-text;
    font-weight: $regular;
    white-space: nowrap;
    width: fit-content;
    margin-left: 0.75rem;
  }

  &:focus-within {
    border: 1px solid $accent-color;
    box-shadow: 0 0px 6px 0px $accent-color-faded;
  }

  input {
    font-size: 1rem;
    padding: 0.65rem 0;
    border: none;
    color: $text-color;
    background-color: transparent !important;
    width: 100% !important;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    caret-color: $text-color;
    font-family: inherit;
    display: inline-block;

    &::placeholder {
      color: $text-color-faded;
      font-size: 1rem;
      font-weight: $regular;
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
