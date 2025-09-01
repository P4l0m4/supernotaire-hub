<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { useIsMobile } from "@/utils/otherFunctions";

import type { Adresse } from "@/utils/types/adresse";

const emit = defineEmits(["address"]);

const isMobile = ref(false);

const target = ref<HTMLElement | null>(null);

const query = ref("");
const suggestions = ref<any[]>([]);
const isOpen = ref(false);
const loading = ref(false);
const isAddressSelected = ref(false);
const addressSelected = ref();

let inputRef = ref<HTMLInputElement | null>(null);

const showError = ref(false);
const addressError = "Sélectionnez une adresse";

async function fetchSuggestions() {
  loading.value = true;
  const res = await fetch(
    `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(
      query.value
    )}&limit=3`
  );
  const data = await res.json();

  suggestions.value = (data.features ?? []).filter(
    (f: any) => f.properties.label !== query.value
  );
  if (isMobile.value) suggestions.value.reverse();

  loading.value = false;
  isOpen.value = !!suggestions.value.length;
}

const debouncedFetch = useDebounceFn(fetchSuggestions, 400);

function select(feature: Adresse) {
  query.value = feature.properties.label;
  suggestions.value = [];

  isOpen.value = false;
  nextTick(() => {
    isAddressSelected.value = true;
    addressSelected.value = feature;
  });
}

async function submit() {
  if (!isAddressSelected.value) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
    }, 1500);
    return;
  } else {
    emit("address", addressSelected.value);
  }
}

watch(query, (newVal) => {
  isAddressSelected.value = false;

  if (!newVal) {
    suggestions.value = [];
    isOpen.value = false;
    return;
  }
  debouncedFetch();
});

onClickOutside(target, () => (isOpen.value = false), {});

onMounted(async () => {
  await nextTick();
  inputRef.value?.focus();
  isMobile.value = useIsMobile().value;
});
</script>

<template>
  <form
    ref="target"
    class="location-form"
    @submit.prevent="submit"
    :class="{ open: isOpen, 'location-form--has-error': showError }"
  >
    <div class="location-form__input-field">
      <input
        ref="inputRef"
        id="location-form-input"
        class="location-form__input-field__input"
        type="text"
        placeholder="10 rue de la tranquillité, 75140, Paris..."
        v-model="query"
        @focus="isOpen = !!suggestions.length"
      />
    </div>

    <ul v-if="isOpen" class="autocomplete">
      <li
        class="autocomplete__suggestion"
        v-for="suggestion in suggestions"
        :key="suggestion.properties.id"
      >
        <button
          @click="select(suggestion)"
          @keydown.enter="select(suggestion)"
          @keydown.space="select(suggestion)"
        >
          {{ suggestion.properties.label }}
        </button>
      </li>
    </ul>

    <UIPrimaryButton
      type="submit"
      :variant="showError ? 'error-color' : 'accent-color'"
      class="button"
      :icon="loading ? 'circle_notch' : undefined"
      @click="submit"
      @keydown.enter="submit"
      @keydown.space="submit"
    >
      {{ showError ? addressError : "Confirmer" }}
    </UIPrimaryButton>
  </form>
</template>

<style lang="scss" scoped>
.location-form {
  display: flex;
  background-color: $primary-color;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius / 2);
  padding: 0.25rem;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  position: relative;
  transition: border-radius 0.2s linear;

  @media (min-width: $big-tablet-screen) {
    padding: 0.25rem;
    max-height: 68.4px;
    width: 500px;
    flex-direction: row;
    gap: 0;
  }

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

    &:focus-within {
      border: 1px solid $error-color-faded !important;
      box-shadow: 0 0px 6px 0px $error-color-faded !important;

      & .autocomplete {
        border-color: $error-color-faded !important;
        box-shadow: 0 0px 6px 0px $error-color-faded !important;
      }
    }
  }

  &:focus-within {
    border: 1px solid $accent-color-faded;
    box-shadow: 0 0px 6px 0px $accent-color-faded;

    & .autocomplete {
      border-color: $accent-color-faded;
      box-shadow: 0 0px 6px 0px $accent-color-faded;
    }
  }

  &__input-field {
    width: 100%;
    max-width: 100%;

    @media (min-width: $big-tablet-screen) {
      width: 300px;
      max-width: 300px;
    }

    @media (min-width: $desktop-screen) {
      width: 350px;
      max-width: 350px;
    }

    &__input {
      display: inline-block;
      text-overflow: ellipsis;
      height: 100%;
      min-height: 47px;
      width: 100%;
      color: $text-color;
      font-family: "Figtree", sans-serif;
      font-size: 1rem;
      padding: 0 1rem;
      caret-color: $text-color;
      border: none;

      &::placeholder {
        color: $text-color-faded;
      }
    }
  }

  .button {
    width: 100%;
    max-width: 100%;

    @media (min-width: $big-tablet-screen) {
      width: fit-content;
    }
  }

  .autocomplete {
    display: flex;
    flex-direction: column;
    color: $text-color;
    width: 100%;
    height: fit-content;
    bottom: 7.7rem;
    left: 0;
    list-style: none;
    background-color: $primary-color;
    border-radius: calc($radius / 2) calc($radius / 2) 0 0;
    border: 1px solid rgba($text-color, 0.1);
    position: absolute;
    overflow: hidden;

    @media (min-width: $big-tablet-screen) {
      flex-direction: column;
      top: 3.9rem;
      border-radius: 0 0 calc($radius / 2) calc($radius / 2);
    }

    &__suggestion {
      padding: 1rem;
      height: fit-content;
      transition: background-color 0.2s linear;

      & button {
        color: $text-color;
        width: 100%;
        height: 100%;
        text-align: left;
      }

      &:hover {
        background-color: rgba($accent-color, 0.1);
        cursor: pointer;
      }
    }
  }

  &.open {
    border-radius: 0 0 calc($radius/2) calc($radius/2);

    @media (min-width: $big-tablet-screen) {
      border-radius: calc($radius / 2) calc($radius / 2) 0 0;
    }
  }
}
</style>
