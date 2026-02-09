<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

const props = defineProps<{
  error?: string | null;
  placeholder?: string;
  id: string;
  label: string;
  icon?: string;
  mode: "year-picker" | "month-picker" | "date-picker";
  maxDate?: Date | null;
  minDate?: Date | null;
  startDate?: Date | null;
}>();

const model = defineModel<string>();

// pont année: number/Date -> string "AAAA"
const yearBridge = computed<number | null>({
  get() {
    const y = Number(model.value);
    return Number.isFinite(y) ? y : null;
  },
  set(v) {
    if (v == null) model.value = "";
    else if (typeof v === "number") model.value = String(v);
    else if (v instanceof Date) model.value = String(v.getFullYear());
    else model.value = String(v as any);
  },
});

// pont mois: Date/number/objet -> string "MM"
const monthBridge = computed<Date | number | null>({
  get() {
    const m = Number(model.value);
    return Number.isFinite(m) && m >= 1 && m <= 12
      ? new Date(new Date().getFullYear(), m - 1, 1)
      : null;
  },
  set(v) {
    if (!v) {
      model.value = "";
      return;
    }
    if (v instanceof Date) {
      model.value = String(v.getMonth() + 1).padStart(2, "0");
      return;
    }
    if (typeof v === "number") {
      model.value = String(v).padStart(2, "0");
      return;
    }
    if (typeof v === "object" && "month" in (v as any)) {
      model.value = String((v as any).month).padStart(2, "0");
      return;
    }
    model.value = String(v as any);
  },
});
</script>
<template>
  <div
    class="date-field"
    :class="{ shake: error, 'date-field--has-error': error }"
  >
    <UIIconComponent
      v-if="icon"
      :icon="icon"
      :color="`${colors['text-color']}70`"
      size="1rem"
    />
    <VueDatePicker
      v-if="mode === 'year-picker'"
      :key="'year-' + id"
      :id="id"
      :label="label"
      v-model="yearBridge"
      locale="fr"
      cancelText="Annuler"
      selectText="Selectionner"
      auto-apply
      year-picker
      :start-date="startDate || new Date('2000-01-01')"
      :max-date="maxDate || undefined"
      :min-date="minDate || undefined"
      :year-range="[1700, new Date().getFullYear()]"
      :placeholder="placeholder || ''"
      time-picker-inline
      :enable-time-picker="false"
    ></VueDatePicker>
    <VueDatePicker
      v-else-if="mode === 'month-picker'"
      :key="'month-' + id"
      :id="id"
      :label="label"
      v-model="monthBridge"
      locale="fr"
      cancelText="Annuler"
      selectText="Selectionner"
      auto-apply
      month-picker
      :start-date="startDate || undefined"
      :min-date="minDate || undefined"
      :max-date="maxDate || undefined"
      time-picker-inline
      :enable-time-picker="false"
      :placeholder="placeholder || ''"
    ></VueDatePicker>

    <VueDatePicker
      v-else-if="mode === 'date-picker'"
      :key="'date-' + id"
      :id="id"
      :label="label"
      v-model="model"
      model-type="dd-MM-yyyy"
      format="dd-MM-yyyy"
      locale="fr"
      cancelText="Annuler"
      selectText="Selectionner"
      auto-apply
      time-picker-inline
      :enable-time-picker="false"
      :start-date="startDate || undefined"
      :min-date="minDate || undefined"
      :max-date="maxDate || undefined"
      :placeholder="placeholder || ''"
    ></VueDatePicker>
    <Transition name="form-field-fade">
      <span class="date-field__error" v-if="error">{{ error }}</span>
    </Transition>
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
    border: 1px solid rgba($accent-color, 0.1);
    box-shadow: 0 0px 6px 0px rgba($accent-color, 0.1);
  }

  &__error {
    display: inline-block;
    position: absolute;
    color: rgba($error-color, 0.7);
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
