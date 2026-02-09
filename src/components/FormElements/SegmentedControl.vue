<script setup lang="ts">
import { computed, onMounted, nextTick } from "vue";

const props = defineProps<{
  options: string[];
  error?: string | undefined;
}>();

const model = defineModel<string>({
  type: String,
});

const selectedIndex = computed(() => {
  if (!model.value) return;
  return props.options.indexOf(model.value);
});

const indicatorStyle = computed(() => ({
  width: `${100 / props.options.length}%`,
  transform: `translateX(${
    selectedIndex.value ? selectedIndex.value * 100 : 0
  }%)`,
}));

onMounted(() => {
  if (!model.value && props.options.length > 0) {
    model.value = props.options[0];
  }
});

function select(label: string) {
  model.value = label;
  nextTick(() => {
    const active = document.querySelector<HTMLInputElement>(
      `input[value="${label}"]`,
    );
    active?.focus();
  });
}
</script>

<template>
  <fieldset class="segmented-control" role="radiogroup">
    <template v-for="(opt, i) in props.options" :key="i">
      <input
        class="segmented-control__input"
        type="radio"
        :id="`seg-${i}`"
        :value="opt"
        v-model="model"
      />
      <label
        class="segmented-control__btn"
        :for="`seg-${i}`"
        tabindex="0"
        :aria-label="opt"
        role="button"
        @keydown.enter.prevent="select(opt)"
        @keydown.space.prevent="select(opt)"
      >
        <span>{{ opt }}</span>
      </label>
    </template>
    <span class="segmented-control__indicator" :style="indicatorStyle" />
  </fieldset>
</template>
<style lang="scss" scoped>
.segmented-control {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba($accent-color, 0.1);
  border-radius: calc($radius/2);
  overflow: hidden;
  height: 44px;
  border: 2px solid transparent;

  &__input {
    display: none;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    z-index: 1;
    color: $text-color-alt;
    transition: color 0.3s;
    font-size: 0.85rem;

    @media (min-width: $big-tablet-screen) {
      padding: 1rem;
      font-size: 1rem;
    }
  }

  &__input:checked + &__btn {
    color: $base-color;
  }

  &__indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: $accent-color;
    transition: transform 0.3s;
    border-radius: inherit;
    height: 42px;
  }
}
</style>
