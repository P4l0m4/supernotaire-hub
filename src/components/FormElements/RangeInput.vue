<script setup lang="ts">
import { computed } from "vue";

export interface RangeOption {
  label: string;
  value: string;
}

const props = defineProps<{
  options: RangeOption[];
  error?: string | undefined;
}>();

const model = defineModel<string>({ default: "0" });

const filledPct = computed(() => {
  const v = Number(model.value);
  if (!props.options) {
    return "0%";
  } else {
    const span =
      (Number(props.options.at(-1)?.value) ?? 0) -
        Number(props.options[0]?.value) || 1;
    return `${((v - Number(props.options[0]?.value)) / span) * 100}%`;
  }
});
</script>

<template>
  <div class="range-input">
    <input
      id="range-input-range"
      type="range"
      :min="options[0]?.value"
      :max="options[options.length - 1]?.value"
      :step="Number(options[1]?.value) - Number(options[0]?.value)"
      v-model="model"
      :style="{ '--filled': filledPct }"
    />

    <span class="range-input__legend">{{ options[model]?.label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.range-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;

  &__legend {
    font-size: $small-text;
  }
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 17px;
  border-radius: $radius;
  border: none !important;
  background: transparent;
  cursor: pointer;

  /* Chrome / Edge / Safari */
  &::-webkit-slider-runnable-track,
  &::-moz-range-track {
    background: transparent;
    height: 1rem;
    border-radius: $radius;
  }

  // gradient appliqué en inline (use fallback for browsers)
  background: linear-gradient(
    to right,
    $accent-color 0,
    $accent-color var(--filled),
    rgba($accent-color, 0.1) var(--filled),
    rgba($accent-color, 0.1) 100%
  );
}

/* IE / Edge Legacy */
input[type="range"]::-ms-track {
  height: 1rem;
  border-radius: $radius;
  background: rgba($accent-color, 0.1);
  border: none;
  color: transparent; /* sinon la piste est rayée sur IE */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1.5rem;
  height: 2rem;
  border-radius: $radius;
  background: $base-color;
  border: 2px solid $accent-color;
}
input[type="range"]::-moz-range-thumb {
  width: 1.5rem;
  height: 2rem;
  border-radius: 50%;
  background: $base-color;
  border: 2px solid $accent-color;
}
input[type="range"]::-ms-thumb {
  width: 1.5rem;
  height: 2rem;
  border-radius: 50%;
  background: $base-color;
  border: 2px solid $accent-color;
}

input[type="range"]:focus {
  outline: none;
}
input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba($secondary-color, 0.25);
}
input[type="range"]:focus::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba($secondary-color, 0.25);
}
</style>
