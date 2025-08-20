<script setup lang="ts">
import { ref, nextTick, computed } from "vue";
import { colors } from "@/utils/colors";
import { normalizeString } from "@/utils/normalize";
import { getByPath, clone, labelFor, genId, setDeep } from "@/utils/arrayField";
import { fr } from "@/utils/validators-fr";
import useVuelidate from "@vuelidate/core";
import {
  required,
  numeric,
  minValue,
  maxValue,
  email,
  helpers,
} from "@vuelidate/validators";

import type { ArrayField } from "@/utils/types/forms";

type Primitive = string | number | boolean | undefined;
type ArrayItem = { __id: string } & Record<string, any>;

const props = defineProps<{
  field: ArrayField;
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

const rulesForScalar = (f: any) => {
  const r: any = {};
  if (f.required) r.required = fr.required;
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
  if (f.type === "email") r.email = fr.email;
  return Object.keys(r).length ? r : null;
};

const itemRuleShape = computed(() => {
  const r: any = {};
  for (const f of props.field.itemSchema?.fields ?? []) {
    const leaf = rulesForScalar(f);
    if (leaf) setDeep(r, f.path.split("."), leaf);
  }
  return r;
});

const arrayItemRules = computed(() => {
  const out: any = {};
  for (let i = 0; i < model.value.length; i++) out[i] = itemRuleShape.value;
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

async function updateItem(idx: number, path: string, value: Primitive) {
  const next = clone(model.value);
  setByPath(next[idx], path, value);
  model.value = next;
  await nextTick();
  const n: any = fieldNode(idx, path);
  n?.$touch?.();
  await n?.$validate?.();
}

function defaultForType(t: string) {
  if (t === "number" || t === "date") return null;
  return "";
}

function makeEmptyItem(): ArrayItem {
  const obj: ArrayItem = { __id: genId() };
  for (const f of props.field.itemSchema?.fields ?? [])
    setByPath(obj, f.path, defaultForType(f.type));
  return obj;
}

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
        <IconComponent
          v-if="field.required"
          icon="asterisk"
          size="0.75rem"
          :color="colors['error-color']"
        />
      </h4>
      <SecondaryButton
        variant="accent-color"
        icon="plus_circle"
        @click="addItem"
        @keydown.enter="addItem"
        @keydown.space="addItem"
        style="width: fit-content"
      >
        Ajouter
      </SecondaryButton>
    </div>

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

        <IconComponent
          :icon="
            isCollapsed(item.__id || String(idx))
              ? 'caret_down_bold'
              : 'caret_up_bold'
          "
          size="1rem"
          :color="colors['text-color-faded']"
          style="opacity: 0.8; margin-left: auto"
        />
      </div>

      <div
        class="array-item__grid"
        v-show="!isCollapsed(item.__id || String(idx))"
      >
        <template
          v-for="(f, index) in field.itemSchema?.fields ?? []"
          :key="index"
        >
          <label class="fi">
            <span class="fi__label"
              >{{ f.label
              }}<IconComponent
                v-if="f.required"
                icon="asterisk"
                size="0.75rem"
                :color="colors['error-color']"
            /></span>

            <InputField
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
            />

            <FormelementsSelectField
              v-if="f.type === 'select'"
              :options="f.options || []"
              :model-value="getByPath(item, f.path)"
              @option-selected="
                (val) => updateItem(idx, f.path, val || defaultForType(f.type))
              "
              :placeholder="f.placeholder || ''"
              :icon="f.icon || ''"
              :error="firstItemMsg(idx, f.path)"
            />
            <ClientOnly v-else-if="f.type === 'date'">
              <FormelementsDateField
                :id="f.label"
                :label="f.label"
                :model-value="getByPath(item, f.path)"
                @update:modelValue="(val) => updateItem(idx, f.path, val)"
                :placeholder="f.placeholder || ''"
                :error="firstItemMsg(idx, f.path)"
              />
            </ClientOnly>
          </label>
        </template>
      </div>
      <TertiaryButton
        variant="error-color"
        type="button"
        @click="removeItem(idx)"
        @keydown.enter="removeItem(idx)"
        @keydown.space="removeItem(idx)"
        style="margin-left: auto"
      >
        Supprimer
      </TertiaryButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.array-field {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius / 2);
  padding: 0.75rem;
  gap: 0.75rem;
  position: relative;

  &--has-error {
    border: 1px solid rgba($error-color, 0.1);
    background-color: rgba($error-color, 0.1);
  }

  &__error {
    position: absolute;
    color: $error-color;
    font-size: $small-text;
    bottom: -0.5rem;
    right: -0.1rem;
    background-color: $error-color-faded;
    backdrop-filter: blur(8px);
    padding: 0 0.2rem;
    border-radius: calc($radius/4);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__label {
    color: $text-color;
    font-weight: $regular;
  }
}

.array-item {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba($text-color, 0.1);
  border-radius: calc($radius / 2);
  padding: 0.75rem;
  gap: 1rem;
  scroll-margin-top: 8rem;

  &--children-have-errors {
    border: 1px solid rgba($error-color, 0.1);
    box-shadow: 0 0px 6px 0px $error-color-faded;

    & > .array-item__title {
      color: $error-color;
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
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
  }
}

.fi {
  display: flex;
  flex-direction: column;

  &__label {
    font-size: 12px;
    color: $text-color;
    margin-bottom: 4px;
  }
}
</style>
