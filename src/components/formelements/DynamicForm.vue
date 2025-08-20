<script setup lang="ts">
import { ref, computed, onBeforeMount, nextTick, watch } from "vue";
import { fr } from "@/utils/validators-fr";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength, maxLength } from "@vuelidate/validators";

import type { FormDefinition } from "@/utils/types/forms";

const props = defineProps<{ formDefinition: FormDefinition }>();
const emit = defineEmits<{
  (e: "complete"): void;
}>();

const formRef = ref<HTMLFormElement | null>(null);

const currentSection = ref(0);

const model = defineModel<any>({ default: {} });

function ensureArrayPaths(def?: FormDefinition) {
  if (!def) return;
  for (const s of def.sections) {
    for (const f of s.fields) {
      if (f.type !== "array") continue;
      const segs = f.path.split(".");
      let cur = model.value;
      for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]] ??= {};
      const key = segs.at(-1)!;
      if (!Array.isArray(cur[key])) cur[key] = []; // <-- garantit un []
    }
  }
}

ensureArrayPaths(props.formDefinition);

const setDeep = (obj: any, path: string[], val: any) => {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]] ??= {};
  cur[path[path.length - 1]] = Object.assign(
    cur[path[path.length - 1]] ?? {},
    val
  );
};

const regexFrom = (p?: string | RegExp) => {
  if (!p) return null;
  const re = typeof p === "string" ? new RegExp(p) : p;
  return helpers.withMessage(
    "Format invalide",
    (v) => v == null || v === "" || re.test(String(v))
  );
};

const stepValidator = (step?: number | null) =>
  step == null
    ? null
    : helpers.withMessage("Doit respecter le pas " + step, (v) => {
        if (v == null || v === "") return true;
        const n = Number(v);
        if (!Number.isFinite(n)) return false;
        const r = n / step;
        return Math.abs(r - Math.round(r)) < 1e-9;
      });

// function hasBadLeaf(obj: any): boolean {
//   const stack = [obj];
//   while (stack.length) {
//     const cur = stack.pop();
//     for (const k in cur) {
//       const v = cur[k];
//       if (
//         v &&
//         typeof v === "object" &&
//         !("$validator" in v) &&
//         !Array.isArray(v)
//       ) {
//         stack.push(v);
//         continue;
//       }
//       if (!(typeof v === "function" || typeof v?.$validator === "function"))
//         return true;
//     }
//   }
//   return false;
// }

function buildRules(def?: FormDefinition) {
  const rules: any = {};
  if (!def) return rules;

  const rulesForScalar = (f: any) => {
    const r: any = {};
    if (f.required) r.required = fr.required;
    if (f.type === "number") {
      r.numeric = fr.numeric;
      if (f.min != null) r.minValue = fr.minValue(f.min);
      if (f.max != null) r.maxValue = fr.maxValue(f.max);
      const st = stepValidator(f.step);
      if (st) r.step = st;
    }
    if (f.type === "select" && f.options) r.oneOf = fr.oneOf(f.options);
    if (f.type === "date") r.isDate = fr.isDate;
    if (f.type === "email") r.email = fr.email;
    if (f.pattern) {
      const rg = regexFrom(f.pattern);
      if (rg) r.pattern = rg;
    }
    return Object.keys(r).length ? r : null;
  };

  const addFieldRules = (field: any, basePath: string[] = []) => {
    const p = field.path.split(".");
    const full = [...basePath, ...p];

    if (field.type === "array") {
      const arrRules: any = {};
      if (field.required) arrRules.required = required;
      if (field.minItems != null)
        arrRules.minLength = fr.minLength(field.minItems);
      if (field.maxItems != null)
        arrRules.maxLength = fr.maxLength(field.maxItems);

      setDeep(rules, full, {
        ...(field.required ? { required } : {}),
        ...(field.minItems != null
          ? { minLength: minLength(field.minItems) }
          : {}),
        ...(field.maxItems != null
          ? { maxLength: maxLength(field.maxItems) }
          : {}),
      });

      return;
    }

    const leaf = rulesForScalar(field);
    if (leaf) setDeep(rules, full, leaf);
  };

  for (const s of def.sections) for (const f of s.fields) addFieldRules(f);

  return rules;
}

const rules = computed(() => buildRules(props.formDefinition));

const v$ = useVuelidate(rules, model, { $autoDirty: false, $lazy: true });

function nodeFor(path: string) {
  const segs = path.split(".");
  let n: any = v$.value;
  for (const k of segs) {
    if (!n?.[k]) return null;
    n = n[k];
  }
  return n;
}

function inSectionPath(errPath: string, sectionPaths: string[]) {
  const norm = (s: string) => s.replace(/\[(\d+)\]/g, ".$1");
  const p = norm(errPath);
  return sectionPaths.some((sp) => p.startsWith(norm(sp)));
}

async function validateCurrentSection() {
  await nextTick();
  await v$.value.$validate(); // déclenche aussi les validations imbriquées des enfants

  const section = props.formDefinition.sections[currentSection.value];
  const paths = section.fields.map((f) => f.path);

  const sectionErrors = v$.value.$errors.filter((e) =>
    inSectionPath(e.$propertyPath ?? e.$property ?? "", paths)
  );

  return sectionErrors.length === 0;
}

async function next() {
  try {
    if (await validateCurrentSection()) {
      currentSection.value++;

      if (formRef.value) {
        formRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
        console.log("Scrolled to top of form");
      }

      if (currentSection.value >= props.formDefinition.sections.length) {
        emit("complete");
      }
    }
  } catch (e) {
    console.error("[DynamicForm/next]", e);
  }
}

function prev() {
  currentSection.value--;

  if (formRef.value) {
    formRef.value.scrollIntoView({ behavior: "smooth", block: "start" });
    console.log("Scrolled to top of form");
  }
}

async function changeStep(step: number) {
  if (step < 0 || step >= props.formDefinition.sections.length) return;

  if (step === currentSection.value) return;

  if (step < currentSection.value) {
    currentSection.value = step;
    return;
  } else if (step > currentSection.value) {
    if (await validateCurrentSection()) {
      currentSection.value = step;
    }
    return;
  }
}

if (import.meta.client) {
  onBeforeMount(() => {
    ensureArrayPaths(props.formDefinition);
  });
  watch(
    () => props.formDefinition,
    (d) => ensureArrayPaths(d),
    { immediate: true }
  );
}
</script>

<template>
  <form
    ref="formRef"
    class="dynamic-form"
    @submit.prevent
    v-if="formDefinition"
  >
    <span class="dynamic-form__title sr-only">{{ formDefinition?.title }}</span>
    <FormelementsFormSteps
      v-if="formDefinition?.sections.length > 1"
      :steps-labels="formDefinition.sections.map((s) => s.label)"
      :currentStep="currentSection + 1"
      @changeStep="changeStep"
    />
    <div
      v-for="(section, index) in formDefinition?.sections || []"
      :key="section.id"
      :id="section.id"
      class="dynamic-form__section"
      v-show="currentSection === index"
    >
      <div class="dynamic-form__section__fields">
        <FormelementsFormField
          v-for="field in section.fields"
          :key="field.path"
          :formField="field"
          v-model="model"
          :validation="nodeFor(field.path)"
        />
      </div>
    </div>
    <div class="dynamic-form__buttons">
      <PrimaryButton
        variant="accent-color"
        icon="arrow_right"
        @click="next"
        @keydown.enter="next"
        @keydown.space="next"
      >
        Suivant
      </PrimaryButton>
      <SecondaryButton
        v-if="currentSection > 0"
        variant="accent-color"
        icon="arrow_left"
        :reverse="true"
        @click="prev"
        @keydown.enter="prev"
        @keydown.space="prev"
      >
        Précédent
      </SecondaryButton>
    </div>
  </form>
</template>
<style scoped lang="scss">
.dynamic-form {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;
  border-radius: $radius;
  background-color: $primary-color;
  width: 100%;
  min-width: 280px;
  scroll-margin-top: 0rem;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 3rem;
  }

  &__title {
    color: $text-color;
    font-size: 1.5rem;
    font-weight: $semi-bold;
    text-align: center;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    &__fields {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;

      @media (min-width: $big-tablet-screen) {
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
    }
  }
  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: $tablet-screen) {
      flex-direction: row-reverse;
      gap: 2rem;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
</style>
