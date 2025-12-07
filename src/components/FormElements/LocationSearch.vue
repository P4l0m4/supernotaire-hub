<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { onClickOutside, useDebounceFn } from "@vueuse/core";

import type { Adresse } from "@/utils/types/adresse";

const props = defineProps<{
  modelValue?: Adresse | null;
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Adresse | null): void;
  (e: "address", value: Adresse | null): void;
}>();

const target = ref<HTMLElement | null>(null);

const query = ref("");
const list = ref<any[]>([]);
const isOpen = ref(false);
const loading = ref(false);
const isAddressSelected = ref(false);

const selectedLabel = ref<string | null>(null);

const showError = ref(false);
const addressError = "Sélectionnez une adresse dans la liste";

function isValidAddress(val: unknown): val is Adresse {
  return (
    !!val &&
    typeof val === "object" &&
    "properties" in (val as any) &&
    typeof (val as any).properties?.label === "string"
  );
}

async function fetchLocationsList() {
  loading.value = true;
  const res = await fetch(
    `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(
      query.value
    )}&limit=3`
  );
  const data = await res.json();

  list.value = (data.features ?? []).filter(
    (f: any) => f.properties.label !== query.value
  );

  loading.value = false;
  isOpen.value = !!list.value.length;
}

const debouncedFetch = useDebounceFn(fetchLocationsList, 400);

function select(feature: Adresse) {
  query.value = feature.properties.label;
  list.value = [];
  selectedLabel.value = feature.properties.label;
  showError.value = false;
  isOpen.value = false;

  nextTick(() => {
    isAddressSelected.value = true;
    emit("update:modelValue", feature);
    emit("address", feature);
  });
}

watch(
  () => props.modelValue,
  (val) => {
    if (isValidAddress(val)) {
      selectedLabel.value = val.properties.label;
      query.value = val.properties.label;
      isAddressSelected.value = true;
      showError.value = false;
    } else {
      selectedLabel.value = null;
      isAddressSelected.value = false;
      showError.value = !!query.value;
    }
  },
  { immediate: true }
);

watch(query, (newVal) => {
  if (!newVal) {
    list.value = [];
    isOpen.value = false;
    isAddressSelected.value = false;
    selectedLabel.value = null;
    showError.value = false;
    emit("update:modelValue", null);
    emit("address", null);
    return;
  }

  const invalidTextChange =
    !!selectedLabel.value && newVal !== selectedLabel.value;
  const invalidModel = !isValidAddress(props.modelValue);

  showError.value = invalidTextChange || invalidModel;
  isAddressSelected.value = !showError.value;

  if (showError.value) {
    emit("update:modelValue", null);
    emit("address", null);
  }

  debouncedFetch();
});

onClickOutside(target, () => (isOpen.value = false), {});

onMounted(async () => {
  await nextTick();
});
</script>

<template>
  <div
    ref="target"
    class="location-search"
    :class="{
      open: isOpen,
    }"
  >
    <FormElementsSearchBar
      v-model="query"
      :id="props.id"
      :name="props.name"
      @focus="isOpen = !!list.length"
      :placeholder="
        props.placeholder || '10 rue de la tranquillité, 75140, Paris...'
      "
      autocomplete="off"
      :error="showError ? addressError : props.error || ''"
    />

    <ul v-if="isOpen" class="list">
      <li
        class="list__address"
        v-for="address in list"
        :key="address.properties.id"
      >
        <button
          @click="select(address)"
          @keydown.enter="select(address)"
          @keydown.space="select(address)"
        >
          {{ address.properties.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.location-search {
  width: 100%;
  position: relative;
  transition: border-radius 0.2s linear;

  @media (min-width: $big-tablet-screen) {
    max-height: 68.4px;
  }

  .list {
    display: flex;
    flex-direction: column;
    color: $text-color;
    width: 100%;
    height: fit-content;
    top: 3.6rem;
    left: 0;
    list-style: none;
    background-color: $primary-color;
    border: 1px solid color-mix(in srgb, $text-color) 10%, transparent;
    position: absolute;
    overflow: hidden;
    border-radius: calc($radius / 2);

    &__address {
      height: fit-content;
      transition: background-color 0.2s linear;

      & button {
        color: $text-color;
        width: clamp(100%, 100%, 100%);
        height: clamp(100%, 100%, 100%);
        padding: 1rem;
        text-align: left;
        background: none;
        cursor: pointer;
        border: none;
        font-family: "Figtree", sans-serif;
        font-size: 1rem;
      }

      &:hover {
        background-color: color-mix(in srgb, $accent-color 10%, transparent);
        cursor: pointer;
      }
    }
  }

  &.open {
    border-radius: 0 0 calc($radius / 2) calc($radius / 2);

    @media (min-width: $big-tablet-screen) {
      border-radius: calc($radius / 2) calc($radius / 2) 0 0;
    }
  }
}
</style>
