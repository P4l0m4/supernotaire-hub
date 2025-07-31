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
}

withDefaults(defineProps<Props>(), {
  type: "text",
  required: true,
  autofocus: false,
  autocomplete: "on",
});

const model = defineModel<string | number>();
const inputRef = ref<HTMLInputElement | null>(null);

const showPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>
<template>
  <div class="input-field" :class="{ shake: error }">
    <label class="input-field__label sr-only" :for="id">
      {{ label }}
    </label>
    <IconComponent
      v-if="icon"
      :icon="icon"
      :color="colors['text-color-faded']"
      size="1.25rem"
    />

    <input
      v-model="model"
      ref="inputRef"
      :id="id"
      class="input-field__input"
      :type="type === 'password' && showPassword ? 'text' : type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :aria-label="label"
      :aria-labelledby="label"
      :title="label"
      :aria-placeholder="placeholder"
      :name="name"
      :value="model"
    />

    <IconComponent
      icon="eye"
      class="input-field__icon"
      style="cursor: pointer"
      v-if="type === 'password' && showPassword"
      @click="toggleShowPassword"
      @keydown.enter="toggleShowPassword"
      @keydown.space="toggleShowPassword"
    />
    <IconComponent
      icon="eye_off"
      class="input-field__icon"
      style="cursor: pointer"
      v-if="type === 'password' && !showPassword"
      @click="toggleShowPassword"
      @keydown.enter="toggleShowPassword"
      @keydown.space="toggleShowPassword"
    /><span class="input-field__error" v-if="error">{{ error }}</span>
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

  &__label {
    font-size: $small-text;
    font-weight: $regular;
    white-space: nowrap;
    width: fit-content;
    margin-left: 0.75rem;
  }

  &:focus-within {
    border: 1px solid $accent-color-faded;
    box-shadow: 0 0 2px 2px $accent-color-faded;
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
    position: absolute;
    color: $error-color;
    font-size: $small-text;
    bottom: -0.5rem;
    right: -0.1rem;
    background-color: $error-color-faded;
    backdrop-filter: blur(8px);
    padding: 0 0.2rem;
    border-radius: calc($radius/4);
  }
}
</style>
