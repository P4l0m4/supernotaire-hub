<script setup lang="ts">
import { colors } from "@/utils/colors";

defineProps<{
  error?: string | null;
  placeholder?: string;
  id: string;
  label: string;
  icon?: string;
}>();

const model = defineModel<string | number | boolean>();
</script>
<template>
  <div
    class="date-field"
    :class="{ shake: error, 'date-field--has-error': error }"
  >
    <IconComponent
      v-if="icon"
      :icon="icon"
      :color="colors['text-color-faded']"
      size="1rem"
    />
    <VueDatePicker
      :id="id"
      :label="label"
      v-model="model"
      model-type="dd-MM-yyyy"
      locale="fr"
      cancelText="Annuler"
      selectText="Sélectionner"
      auto-apply
      time-picker-inline
      :enable-time-picker="false"
      :placeholder="placeholder || ''"
    ></VueDatePicker>
    <span class="date-field__error" v-if="error">{{ error }}</span>
  </div>
</template>
<style lang="scss" scoped>
.date-field {
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
  }

  &:focus-within {
    border: 1px solid $accent-color-faded;
    box-shadow: 0 0px 6px 0px $accent-color-faded;
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
