<script setup lang="ts">
import { computed, ref } from "vue";
import { colors } from "@/utils/colors";

import type { Validation } from "@vuelidate/core";
import type { FormField } from "@/types/forms";

const props = defineProps<{
  formField: FormField;
  suggestion?: any;
  validation?: Validation<any> | null;
  highlightPaths?: string[];
}>();

const model = defineModel<Record<string, any>>({ default: {} });

function getByPath(obj: any, path: string) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}
function setByPath(obj: any, path: string, val: any) {
  const segs = path.split(".");
  const last = segs.pop()!;
  const tgt = segs.reduce((o, k) => (o[k] ??= {}), obj);
  tgt[last] = val;
}

const toDateValue = (value: unknown) => {
  if (value instanceof Date) return new Date(value);
  if (typeof value === "string") {
    if (value === "today") return new Date();
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return undefined;
};

const resolveMaxDate = (field: FormField) => {
  if (field.type !== "date") return undefined;
  const direct = toDateValue(field.maxDate);
  if (direct) return direct;
  const offset = field.maxDateOffsetYears;
  if (typeof offset !== "number") return undefined;
  const d = new Date();
  d.setFullYear(d.getFullYear() - offset);
  return d;
};

const resolveStartDate = (field: FormField) =>
  field.type === "date" ? toDateValue(field.startDate) : undefined;

const resolveMinDate = (field: FormField) =>
  field.type === "date" ? toDateValue(field.minDate) : undefined;

const hasSuggestionValue = (suggestion: unknown) => {
  if (suggestion == null) return false;
  if (typeof suggestion === "string") return suggestion.trim().length > 0;
  if (typeof suggestion === "number") return true;
  if (Array.isArray(suggestion)) return suggestion.length > 0;
  if (typeof suggestion === "object") return true;
  return false;
};

const formatSuggestionLabel = (suggestion: unknown) => {
  if (suggestion == null) return "";
  if (typeof suggestion === "string" || typeof suggestion === "number")
    return String(suggestion);
  if (Array.isArray(suggestion))
    return `${suggestion.length} valeur${suggestion.length > 1 ? "s" : ""} proposées`;
  if (typeof suggestion === "object") {
    const anyVal = suggestion as any;
    if (typeof anyVal?.properties?.label === "string")
      return anyVal.properties.label;
    if (typeof anyVal?.label === "string") return anyVal.label;
    if (typeof anyVal?.value === "string") return anyVal.value;
  }
  try {
    return JSON.stringify(suggestion);
  } catch {
    return "";
  }
};

const isSameSuggestion = (suggestion: unknown, current: unknown) => {
  if (suggestion === current) return true;
  if (
    suggestion &&
    current &&
    typeof suggestion === "object" &&
    typeof current === "object"
  ) {
    try {
      return JSON.stringify(suggestion) === JSON.stringify(current);
    } catch {
      return false;
    }
  }
  return false;
};

const valueRef = computed({
  get: () => getByPath(model.value, props.formField.path),
  set: (v) => setByPath(model.value, props.formField.path, v),
});

// const arrayRef = computed<any[]>({
//   get: () => {
//     const v = getByPath(model.value, props.formField.path);
//     if (Array.isArray(v)) return v;
//     setByPath(model.value, props.formField.path, []); // write-through
//     return [];
//   },
//   set: (v) =>
//     setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []),
// });

// const checkBoxGroupRef = computed<string[]>({
//   get: () => {
//     const v = getByPath(model.value, props.formField.path);
//     if (Array.isArray(v)) return v;
//     setByPath(model.value, props.formField.path, []); // write-through
//     return [];
//   },
//   set: (v) => {
//     setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []);
//   },
// });

const arrayRef = computed<any[]>({
  get: () => {
    const v = getByPath(model.value, props.formField.path);
    return Array.isArray(v) ? v : [];
  },
  set: (v) => {
    if (props.formField.type === "array") {
      setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []);
    }
  },
});

const checkBoxGroupRef = computed<string[]>({
  get: () => {
    const v = getByPath(model.value, props.formField.path);
    return Array.isArray(v) ? v : [];
  },
  set: (v) => {
    if (props.formField.type === "checkbox-group") {
      setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []);
    }
  },
});

function isChecked(val: string) {
  return checkBoxGroupRef.value.includes(val);
}
function setChecked(val: string, checked: boolean) {
  const s = new Set(checkBoxGroupRef.value);
  checked ? s.add(val) : s.delete(val);
  checkBoxGroupRef.value = Array.from(s);
}

const errorMessage = computed(() => {
  if (!props.validation || !props.validation.$dirty || !props.validation.$error)
    return undefined;
  const msg = props.validation?.$errors[0].$message;
  return msg && typeof msg === "object" && "value" in msg ? msg.value : msg;
});

const isHighlighted = computed(() =>
  props.highlightPaths?.includes(props.formField.path),
);

const manualHighlight = ref(false);
const MANUAL_HIGHLIGHT_DURATION = 1200;

const triggerManualHighlight = () => {
  manualHighlight.value = true;
  setTimeout(() => {
    manualHighlight.value = false;
  }, MANUAL_HIGHLIGHT_DURATION);
};

const isAnyHighlight = computed(
  () => isHighlighted.value || manualHighlight.value,
);
</script>
<template>
  <div
    class="form-field"
    :class="{ 'form-field--prefill': isAnyHighlight }"
    :style="{ gridColumn: formField.type === 'array' ? '1 / -1' : '' }"
  >
    <label
      v-if="
        !formField.itemLabel &&
        formField.type !== 'checkbox' &&
        formField.type !== 'checkbox-group'
      "
      :for="formField.id"
      class="form-field__label"
      >{{ formField.label }}
      <UIIconComponent
        v-if="formField.required || formField.requiredIf"
        icon="asterisk"
        size="0.75rem"
        :color="colors['error-color']"
    /></label>
    <FormElementsInputField
      v-if="
        formField.type === 'text' ||
        formField.type === 'number' ||
        formField.type === 'email'
      "
      :id="formField.id"
      :label="formField.label"
      :placeholder="formField.placeholder || ''"
      :name="formField.name"
      v-model="valueRef"
      :required="
        formField.required
          ? formField.required
          : formField.requiredIf
            ? false
            : undefined
      "
      :icon="formField.icon || ''"
      :error="errorMessage"
      :tooltip="formField.tooltip || ''"
      :tooltipLink="formField.tooltipLink || ''"
    />
    <ClientOnly v-else-if="formField.type === 'date'">
      <FormElementsDateField
        :id="formField.id"
        :label="formField.label"
        v-model="valueRef"
        :placeholder="formField.placeholder || ''"
        :mode="formField.mode"
        :icon="formField.icon"
        :error="errorMessage"
        :startDate="resolveStartDate(formField)"
        :minDate="resolveMinDate(formField)"
        :maxDate="resolveMaxDate(formField)"
      />
    </ClientOnly>

    <FormElementsArrayFieldRenderer
      v-if="formField.type === 'array'"
      v-model="arrayRef"
      :field="formField"
      :suggestion="typeof suggestion === 'object' ? suggestion : undefined"
      :parentError="errorMessage"
    />
    <FormElementsSelectField
      v-else-if="formField.type === 'select'"
      :options="formField.options || []"
      v-model="valueRef"
      :placeholder="formField.placeholder || ''"
      :icon="formField.icon || ''"
      :error="errorMessage"
    />
    <FormElementsSegmentedControl
      v-else-if="formField.type === 'segmented-control'"
      v-model="valueRef"
      :options="formField.options || []"
      :error="errorMessage"
    />
    <FormElementsFileField
      v-else-if="formField.type === 'file'"
      :id="formField.id"
      :name="formField.name"
      :label="formField.label"
      v-model="valueRef"
      :required="formField.required"
      :error="errorMessage"
      :icon="formField.icon || ''"
      :accept="formField.accept"
      :multiple="formField.multiple || false"
      :TS_TYPE="formField.TS_TYPE || ''"
    />
    <FormElementsRangeInput
      v-else-if="formField.type === 'range'"
      v-model="valueRef"
      :options="formField.options"
      :error="errorMessage"
    />

    <FormElementsDropDown
      v-if="formField.type === 'checkbox-group'"
      :label="formField.placeholder || formField.label"
      :icon="formField.icon"
      :error="errorMessage"
      :required="Boolean(formField.required || formField.requiredIf)"
      :tooltip="formField.tooltip || ''"
      :tooltipLink="formField.tooltipLink || ''"
    >
      <FormElementsCheckboxField
        v-for="(option, index) in formField.options"
        :key="index"
        :id="`${formField.id}-${index}`"
        :name="formField.name"
        :label="option.label"
        :modelValue="isChecked(option.value)"
        @update:modelValue="(val) => setChecked(option.value, val)"
      />
    </FormElementsDropDown>

    <FormElementsCheckboxField
      v-if="formField.type === 'checkbox'"
      :label="formField.label"
      :id="formField.id"
      :name="formField.name"
      :tooltip="formField.tooltip || ''"
      :tooltipLink="formField.tooltipLink || ''"
      v-model="valueRef"
    />
    <ClientOnly>
      <FormElementsLocationSearch
        v-if="formField.type === 'location'"
        :id="formField.id"
        :label="formField.label"
        v-model="valueRef"
        :placeholder="formField.placeholder || ''"
        :required="
          formField.required
            ? formField.required
            : formField.requiredIf
              ? false
              : undefined
        "
        :error="errorMessage"
    /></ClientOnly>

    <Transition name="form-field-fade">
      <UISmartSuggestion
        v-if="
          hasSuggestionValue(suggestion) &&
          !isSameSuggestion(suggestion, valueRef)
        "
        :suggestion="formatSuggestionLabel(suggestion)"
        @click="
          () => {
            valueRef = suggestion;
            triggerManualHighlight();
          }
        "
      />
    </Transition>
  </div>
</template>
<style scoped lang="scss">
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  min-width: 256px;

  &__label {
    font-size: 1rem;
    color: $text-color;
    font-weight: $regular;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  &--prefill {
    animation: prefillPulse 1s ease-in-out 0s 1;
    box-shadow: 0 0 0 0 rgba($purple-color, 0.25);
    border-radius: calc($radius / 2);
  }
}

@keyframes prefillPulse {
  0% {
    box-shadow: 0 0 0 0 rgba($purple-color, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba($purple-color, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba($purple-color, 0);
  }
}
</style>
