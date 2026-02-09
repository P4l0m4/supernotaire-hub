<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { colors } from "@/utils/colors";
import { normalizeString } from "@/utils/normalize";
import { getByPath, clone, labelFor, genId, setDeep } from "@/utils/arrayField";
import { fr } from "@/utils/validators-fr";
import useVuelidate from "@vuelidate/core";
import { numeric, helpers } from "@vuelidate/validators";
import { evaluateShowIf } from "@/utils/showIf";

import type { ArrayField } from "@/types/forms";

type Primitive = string | number | boolean | undefined;
type ArrayItem = { __id: string } & Record<string, any>;

const props = defineProps<{
  field: ArrayField;
  suggestion?: any[];
  parentError?: string | null;
}>();

const model = defineModel<ArrayItem[]>({ default: [] });

const itemRefs = ref<HTMLElement[]>([]);

function setItemRef(el: HTMLElement | null, idx: number) {
  if (el) itemRefs.value[idx] = el;
}

const collapsed = ref<Set<string>>(new Set());
const isCollapsed = (id: string) => collapsed.value.has(id);
const toggle = (id: string) => {
  const s = new Set(collapsed.value);
  s.has(id) ? s.delete(id) : s.add(id);
  collapsed.value = s;
};

const oneOf = (opts?: readonly string[]) => {
  if (!opts?.length) return null;
  const allowed = new Set(opts.map(normalizeString));

  return helpers.withMessage("Valeur non autorisée", (v: unknown) => {
    if (v == null) return true;
    if (typeof v === "string" && v.trim() === "") return true;
    if (typeof v !== "string") return false;
    return allowed.has(normalizeString(v));
  });
};

const stepValidator = (step?: number | null) =>
  step == null
    ? null
    : helpers.withMessage(`Doit respecter le pas ${step}`, (v) => {
        if (v == null || v === "") return true;
        const n = Number(v);
        if (!Number.isFinite(n)) return false;
        const r = n / step;
        return Math.abs(r - Math.round(r)) < 1e-9;
      });

const rulesForScalar = (f: any, idx: number) => {
  const r: any = {};
  if (f.required) r.required = fr.required;
  if (f.requiredIf) {
    r.requiredIf = fr.requiredIf(() =>
      evaluateShowIf(f.requiredIf, model.value[idx]),
    );
  }
  if (f.type === "number") {
    r.numeric = numeric;
    if (f.min != null) r.minValue = fr.minValue(f.min);
    if (f.max != null) r.maxValue = fr.maxValue(f.max);
    const st = stepValidator(f.step);
    if (st) r.step = st;
  }
  if (f.type === "select" && f.options) {
    const o = oneOf(f.options);
    if (o) r.oneOf = o;
  }
  if (f.type === "checkbox-group" && f.required) {
    r.minLength = fr.minLength(1);
  }
  if (f.type === "email") r.email = fr.email;
  return Object.keys(r).length ? r : null;
};

const itemFields = computed<any[]>(() => props.field.itemSchema?.fields ?? []);

const arrayItemRules = computed(() => {
  const out: any = {};
  for (let i = 0; i < model.value.length; i++) {
    const shape: any = {};
    for (const f of itemFields.value) {
      const leaf = rulesForScalar(f, i);
      if (leaf) setDeep(shape, f.path.split("."), leaf);
    }
    out[i] = shape;
  }
  return out;
});

const vItems = useVuelidate(arrayItemRules, model, {
  $lazy: false,
  $autoDirty: true,
});

function setByPath(obj: any, path: string, value: any) {
  const segs = path.split(".");
  const last = segs.pop()!;
  const target = segs.reduce((o, k) => (o[k] ??= {}), obj);
  target[last] = value;
}

function itemNode(i: number) {
  return vItems.value?.[i] ?? null;
}

const fieldNode = (i: number, sub: string) =>
  sub.split(".").reduce((n, k) => (n as any)?.[k], itemNode(i)) ?? undefined;

const firstItemMsg = (i: number, sub: string): string | undefined => {
  const v: any = fieldNode(i, sub);
  if (!v?.$dirty || !v?.$invalid) return;
  const e = v.$errors?.[0];
  return (
    (typeof e?.$message === "object" ? e.$message?.value : e?.$message) ||
    e?.$validator ||
    undefined
  );
};

// Safely read a suggestion value for a given item index and sub-field
function suggestionFor(i: number, subField: any): string | number | undefined {
  const key = (subField?.suggestionRef as string | undefined) ?? undefined;
  if (!key) return undefined;
  const arr = props.suggestion;
  const row: any = Array.isArray(arr) ? arr[i] : undefined;
  const val = row?.[key];
  return typeof val === "string" || typeof val === "number" ? val : undefined;
}

function hasSuggestion(i: number, subField: any): boolean {
  return suggestionFor(i, subField) !== undefined;
}

async function updateItem(idx: number, path: string, value: Primitive) {
  const next = clone(model.value);
  setByPath(next[idx], path, value);
  model.value = next;
  await nextTick();
  const n: any = fieldNode(idx, path);
  n?.$touch?.();
  await n?.$validate?.();
}

function defaultForType(t?: string | null) {
  if (t === "number" || t === "date") return null;
  if (t === "checkbox") return false;
  if (t === "checkbox-group") return [];
  return "";
}

function makeEmptyItem(): ArrayItem {
  const obj: ArrayItem = { __id: genId() };
  for (const f of props.field.itemSchema?.fields ?? [])
    setByPath(obj, f.path, defaultForType(f.type));
  return obj;
}

const isSubFieldVisible = (item: any, f: any): boolean => {
  try {
    return evaluateShowIf(f?.showIf, item);
  } catch (e) {
    console.warn("[ArrayField] showIf evaluation failed for", f?.path, e);
    return true;
  }
};

const isSubFieldRequired = (item: any, f: any): boolean => {
  if (f.required) return true;
  if (!f.requiredIf) return false;
  try {
    return evaluateShowIf(f.requiredIf, item);
  } catch {
    return false;
  }
};

async function addItem() {
  const next = [...model.value];
  next.push(makeEmptyItem());
  model.value = next;
  await nextTick();
  itemRefs.value.at(-1)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeItem(idx: number) {
  const min = props.field.minItems ?? 0;
  if ((model.value?.length ?? 0) < min) return;
  const next = clone(model.value);
  const id = next[idx]?.__id;
  if (id) {
    const s = new Set(collapsed.value);
    s.delete(id);
    collapsed.value = s;
  }
  next.splice(idx, 1);
  model.value = next;
}

function checkboxGroupValues(item: any, path: string): string[] {
  const v = getByPath(item, path);
  return Array.isArray(v) ? v : [];
}

async function toggleCheckboxGroup(
  idx: number,
  path: string,
  optionValue: string,
  checked: boolean,
) {
  const next = clone(model.value);
  const current = new Set(checkboxGroupValues(next[idx], path));
  checked ? current.add(optionValue) : current.delete(optionValue);
  setByPath(next[idx], path, Array.from(current));
  model.value = next;
  await nextTick();
  const n: any = fieldNode(idx, path);
  n?.$touch?.();
  await n?.$validate?.();
}

async function updateCheckbox(idx: number, path: string, value: boolean) {
  await updateItem(idx, path, value);
}

const childrenErrors = computed(() => {
  const indexOfChildrenWithErrors = [];
  for (let i = 0; i < model.value.length; i++) {
    const item = model.value[i];
    if (item.__id && itemNode(i)?.$invalid) {
      indexOfChildrenWithErrors.push(i);
    }
  }
  return indexOfChildrenWithErrors;
});

async function applyAllSuggestions() {
  const rows: any[] = Array.isArray(props.suggestion) ? props.suggestion : [];
  if (!rows.length) return;

  const next = [...model.value];
  // Ensure enough items exist
  while (next.length < rows.length) next.push(makeEmptyItem());

  // Map each suggestion row to the corresponding item fields
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || {};
    for (const f of props.field.itemSchema?.fields ?? []) {
      const key = (f as any)?.suggestionRef as string | undefined;
      if (!key) continue;
      const val = row?.[key];
      if (val === undefined) continue;
      setByPath(next[i], f.path, val);
    }
  }

  model.value = next;
  await nextTick();
  itemRefs.value.at(-1)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <div
    class="array-field"
    :class="{
      shake: parentError,
      'array-field--has-error': parentError,
    }"
  >
    <span v-if="parentError" class="array-field__error">{{ parentError }}</span>

    <div class="array-field__header">
      <h4 class="array-field__label">
        {{ field.label }}
        <UIIconComponent
          v-if="field.required || field.requiredIf"
          icon="asterisk"
          size="0.75rem"
          :color="colors['error-color']"
        />
      </h4>
      <UISmartSuggestion
        v-if="suggestion && suggestion.length"
        :suggestion="`${suggestion?.length} éléments trouvés`"
        @click="applyAllSuggestions"
        @keydown.enter="applyAllSuggestions"
        @keydown.space="applyAllSuggestions"
        style="margin-left: auto"
      />
    </div>
    <div class="array-field__items">
      <div
        v-for="(item, idx) in model"
        :key="item.__id || idx"
        :ref="(el) => setItemRef(el as HTMLElement, idx)"
        class="array-item"
        :class="{
          'array-item--children-have-errors': childrenErrors.includes(idx),
        }"
      >
        <div
          class="array-item__title"
          @click="toggle(item.__id || String(idx))"
          @keydown.enter="toggle(item.__id || String(idx))"
          @keydown.space="toggle(item.__id || String(idx))"
          role="button"
          tabindex="0"
          :aria-label="
            isCollapsed(item.__id || String(idx)) ? 'Déplier' : 'Replier'
          "
          :aria-expanded="!isCollapsed(item.__id || String(idx))"
        >
          <span>{{ labelFor(idx, field.itemLabel) }}</span>

          <UIIconComponent
            :icon="
              isCollapsed(item.__id || String(idx))
                ? 'caret_down_bold'
                : 'caret_up_bold'
            "
            size="1rem"
            :color="`${colors['text-color']}70`"
            style="opacity: 0.8; margin-left: auto"
          />
        </div>

        <div
          class="array-item__grid"
          v-show="!isCollapsed(item.__id || String(idx))"
        >
          <template v-for="(f, index) in itemFields" :key="index">
            <label class="fi" v-if="isSubFieldVisible(item, f)">
              <span
                v-if="f.type !== 'checkbox' && f.type !== 'checkbox-group'"
                class="fi__label"
                >{{ f.label
                }}<UIIconComponent
                  v-if="isSubFieldRequired(item, f)"
                  icon="asterisk"
                  size="0.75rem"
                  :color="colors['error-color']"
                />
              </span>

              <FormElementsInputField
                v-if="
                  f.type === 'text' || f.type === 'number' || f.type === 'email'
                "
                :id="f.label"
                :label="f.label"
                :placeholder="f.placeholder || ''"
                :type="f.type"
                :name="f.path"
                :model-value="getByPath(item, f.path)"
                @update:modelValue="
                  (val) => {
                    updateItem(idx, f.path, val);
                  }
                "
                :required="f.required"
                :icon="f.icon || ''"
                :error="firstItemMsg(idx, f.path)"
                :tooltip="f.tooltip"
                :tooltipLink="f.tooltipLink"
              />

              <FormElementsSelectField
                v-if="f.type === 'select'"
                :options="f.options || []"
                :model-value="getByPath(item, f.path)"
                @option-selected="
                  (val) =>
                    updateItem(idx, f.path, val || defaultForType(f.type))
                "
                :placeholder="f.placeholder || ''"
                :icon="f.icon || ''"
                :error="firstItemMsg(idx, f.path)"
              />
              <FormElementsCheckboxField
                v-else-if="f.type === 'checkbox'"
                :label="f.label"
                :id="`${f.id || f.path}-${idx}`"
                :name="f.name || f.path"
                :modelValue="Boolean(getByPath(item, f.path))"
                @update:modelValue="
                  (val) => updateCheckbox(idx, f.path, Boolean(val))
                "
                :error="firstItemMsg(idx, f.path)"
              />
              <FormElementsDropDown
                v-else-if="f.type === 'checkbox-group'"
                :label="f.placeholder || f.label"
                :icon="f.icon"
                :error="firstItemMsg(idx, f.path)"
                :required="Boolean(f.required)"
              >
                <FormElementsCheckboxField
                  v-for="(option, cIdx) in f.options"
                  :key="cIdx"
                  :id="`${f.id || f.path}-${idx}-${cIdx}`"
                  :name="f.name || f.path"
                  :label="option.label"
                  :modelValue="
                    checkboxGroupValues(item, f.path).includes(option.value)
                  "
                  @update:modelValue="
                    (val) =>
                      toggleCheckboxGroup(
                        idx,
                        f.path,
                        option.value,
                        Boolean(val),
                      )
                  "
                />
              </FormElementsDropDown>
              <ClientOnly v-else-if="f.type === 'date'">
                <FormElementsDateField
                  :id="f.label"
                  :label="f.label"
                  :model-value="getByPath(item, f.path)"
                  @update:modelValue="(val) => updateItem(idx, f.path, val)"
                  :placeholder="f.placeholder || ''"
                  :mode="f.mode"
                  :error="firstItemMsg(idx, f.path)"
                />
              </ClientOnly>
              <UISmartSuggestion
                v-if="
                  hasSuggestion(idx, f) &&
                  suggestionFor(idx, f) !== getByPath(item, f.path)
                "
                :suggestion="String(suggestionFor(idx, f))"
                @click="
                  () => updateItem(idx, f.path, suggestionFor(idx, f) as any)
                "
              />
            </label>
          </template>
        </div>
        <UITertiaryButton
          variant="error-color"
          type="button"
          @click="removeItem(idx)"
          @keydown.enter="removeItem(idx)"
          @keydown.space="removeItem(idx)"
          style="margin-left: auto"
        >
          Supprimer
        </UITertiaryButton>
      </div>
    </div>
    <span
      class="add-button"
      role="button"
      tabindex="0"
      @click="addItem"
      @keydown.enter="addItem"
      @keydown.space="addItem"
    >
      <UITertiaryButton
        variant="accent-color"
        icon="plus_circle"
        direction="row-reverse"
      >
        Ajouter un élément
      </UITertiaryButton></span
    >
  </div>
</template>

<style scoped lang="scss">
.array-field {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;

  &--has-error {
    border: 1px solid rgba($error-color, 0.1);
    background-color: rgba($error-color, 0.1);
    border-radius: calc($radius/2);
  }

  &__error {
    position: absolute;
    color: $error-color;
    font-size: $small-text;
    bottom: -0.5rem;
    right: -0.1rem;
    background-color: rgba($error-color, 0.1);
    backdrop-filter: blur(8px);
    padding: 0 0.2rem;
    border-radius: calc($radius/4);
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__label {
    color: $text-color;
    font-weight: $regular;
    display: flex;
    width: 100%;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid rgba($text-color, 0.1);
    border-radius: calc($radius/2);
    padding: 1rem;
  }
}

.array-item {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius / 2);
  padding: 0.75rem;
  gap: 1.75rem;
  scroll-margin-top: 8rem;
  background-color: $primary-color;

  @media (min-width: $big-tablet-screen) {
    scroll-margin-top: 12rem;
  }

  &--children-have-errors {
    border: 1px solid rgba($error-color, 0.2);
    box-shadow: 0 0px 6px 0px rgba($error-color, 0.1);

    & > .array-item__title {
      color: $error-color;
      background-color: rgba($error-color, 0.1);
    }
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $text-color;
    font-weight: $regular;
    font-style: italic;
    cursor: pointer;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: $big-tablet-screen) {
      grid-template-columns: 1fr;
      align-items: center;
    }
  }
}

.fi {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: 12px;
    color: $text-color;
    margin-bottom: 4px;
  }
}

.add-button {
  display: flex;
  justify-content: center;
  border: 2px dashed rgba($text-color, 0.2);
  border-radius: calc($radius/2);
  padding: 1.5rem 0.75rem;
  transition: 0.3s border-color;

  &:hover {
    border-color: rgba($accent-color, 1);
    cursor: pointer;
  }
}
</style>
