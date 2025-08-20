<script setup lang="ts">
import { computed } from "vue";
import { colors } from "@/utils/colors";

import type { Validation } from "@vuelidate/core";
import type { FormField } from "@/utils/types/forms";

const props = defineProps<{
  formField: FormField;
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

const arrayRef = computed<any[]>({
  get: () => {
    const v = getByPath(model.value, props.formField.path);
    if (Array.isArray(v)) return v;
    setByPath(model.value, props.formField.path, []); // write-through
    return [];
  },
  set: (v) =>
    setByPath(model.value, props.formField.path, Array.isArray(v) ? v : []),
});

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
      v-if="!formField.itemLabel"
      :for="formField.id"
      class="form-field__label"
      >{{ formField.label }}
      <IconComponent
        v-if="formField.required"
        icon="asterisk"
        size="0.75rem"
        :color="colors['error-color']"
    /></label>
    <InputField
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
      :required="formField.required"
      :icon="formField.icon || ''"
      :error="errorMessage"
    />
    <ClientOnly v-else-if="formField.type === 'date'">
      <FormelementsDateField
        :id="formField.id"
        :label="formField.label"
        v-model="valueRef"
        :placeholder="formField.placeholder || ''"
        :icon="formField.icon"
        :error="errorMessage"
      />
    </ClientOnly>

    <FormelementsArrayFieldRenderer
      v-if="formField.type === 'array'"
      v-model="arrayRef"
      :field="formField"
      :parentError="errorMessage"
    />
    <FormelementsSelectField
      v-else-if="formField.type === 'select'"
      :options="formField.options || []"
      v-model="valueRef"
      :placeholder="formField.placeholder || ''"
      :icon="formField.icon || ''"
      :error="errorMessage"
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
    font-size: $small-text;
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
