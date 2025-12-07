<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

import type { Validation } from "@vuelidate/core";
import type { FormField } from "@/utils/types/forms";

const props = defineProps<{
  formField: FormField;
  suggestion?: any;
  validation?: Validation<any> | null;
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
</script>
<template>
  <div
    class="form-field"
    :style="{ gridColumn: formField.type === 'array' ? '1 / -1' : '' }"
  >
    <label
      v-if="!formField.itemLabel && formField.type !== 'checkbox'"
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

    <UISmartSuggestion
      v-if="
        suggestion !== undefined &&
        suggestion !== null &&
        suggestion !== '' &&
        (typeof suggestion === 'string' || typeof suggestion === 'number') &&
        valueRef !== suggestion
      "
      :suggestion="suggestion.toString()"
      @click="
        () => {
          valueRef = suggestion;
        }
      "
    />
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
}
</style>
