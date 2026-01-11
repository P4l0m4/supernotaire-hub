<script setup lang="ts">
interface Props {
  id: string;
  name: string;
  label: string;
}

defineProps<Props>();

function toggle() {
  model.value = !model.value;
}

const model = defineModel<boolean>({
  type: Boolean,
  default: false,
});
</script>

<template>
  <label :for="id" class="checkbox">
    <input
      :id="id"
      :name="name"
      type="checkbox"
      v-model="model"
      class="checkbox__input"
    />
    <span
      class="checkbox__custom"
      tabindex="0"
      :aria-label="label"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    />
    <span class="checkbox__label">{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  &__input {
    display: none;

    &:checked + .checkbox__custom {
      background: $accent-color;
      border-color: $accent-color;
    }

    &:checked + .checkbox__custom::after {
      content: "✓";
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      inset: 0;
      font-size: 1.2rem;
      font-weight: $bold;
      color: $primary-color;
      background: $accent-color;
      border-radius: 2px;
    }
  }

  &__custom {
    width: 24px;
    min-width: 24px;
    height: 24px;
    border: 1px solid $text-color-faded;
    background: $base-color;
    border-radius: 4px;
    position: relative;
    transition: background 0.2s;
  }

  &__label {
    font-size: 1rem;
  }
}
</style>
