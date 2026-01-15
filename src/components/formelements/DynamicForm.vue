<script setup lang="ts">
import { ref, computed, onBeforeMount, nextTick, watch } from "vue";
import { fr } from "@/utils/validators-fr";
import useVuelidate from "@vuelidate/core";
import { helpers, required, minLength, maxLength } from "@vuelidate/validators";

import type { FormDefinition } from "@/types/forms";
import { evaluateShowIf } from "@/utils/showIf";

interface Suggestion {
  key: string;
  value: any;
}

const props = defineProps<{
  formDefinition: FormDefinition;
  suggestions?: Suggestion[] | null;
}>();
const emit = defineEmits<{
  (e: "complete"): void;
}>();

const formRef = ref<HTMLFormElement | null>(null);

const currentSection = ref(0);

const stopNextStep = ref(false);

const showErrorState = ref(false);

function triggerErrorState() {
  showErrorState.value = true;
  setTimeout(() => {
    showErrorState.value = false;
  }, 2000);
}

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

function getDeep(obj: any, path: string[]) {
  return path.reduce((o, k) => (o ? o[k] : undefined), obj);
}

const setDeep = (obj: any, path: string[], val: any) => {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]] ??= {};
  cur[path[path.length - 1]] = Object.assign(
    cur[path[path.length - 1]] ?? {},
    val
  );
};

function buildRules(def?: FormDefinition) {
  const rules: any = {};
  if (!def) return rules;

  const rulesForScalar = (f: any) => {
    const r: any = {};
    if (f.required) r.required = fr.required;
    if (f.requiredIf) {
      r.requiredIf = fr.requiredIf(() =>
        evaluateShowIf(f.requiredIf, model.value)
      );
    }
    if (f.type === "number") {
      r.numeric = fr.numeric;
      if (f.min != null) r.minValue = fr.minValue(f.min);
      if (f.max != null) r.maxValue = fr.maxValue(f.max);
      const st = stepValidator(f.step);
      if (st) r.step = st;
    }
    if ((f.type === "select" || f.type === "segmented-control") && f.options)
      r.oneOf = fr.oneOf(f.options);
    if (f.type === "range" && f.options)
      r.oneOf = fr.oneOf(f.options.map((o: any) => o.value));
    if (f.type === "checkbox-group" && f.options) {
      if (f.required) r.minLength = fr.minLength(1); // au moins 1 coche si requis
    }
    if (f.type === "date" && f.mode === "year-picker") {
      r.isYear = fr.isYear;
    } else if (f.type === "date" && f.mode === "month-picker") {
      r.isMonth = fr.isMonth;
    } else if (f.type === "date" && f.mode === "date-picker") {
      r.isDate = fr.isDate;
    }
    if (f.type === "email") r.email = fr.email;
    if (f.type === "location") r.location = fr.isAddress;
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
      // règles du conteneur
      setDeep(rules, full, {
        ...(field.required ? { required } : {}),
        ...(field.minItems != null
          ? { minLength: minLength(field.minItems) }
          : {}),
        ...(field.maxItems != null
          ? { maxLength: maxLength(field.maxItems) }
          : {}),
      });

      const itemShape: any = {};
      for (const sub of field.itemSchema?.fields ?? []) {
        const leaf = rulesForScalar(sub);
        if (leaf) setDeep(itemShape, sub.path.split("."), leaf);
      }

      const arrInModel = (getDeep(model.value, full) as any[]) || [];
      for (let i = 0; i < arrInModel.length; i++) {
        setDeep(rules, [...full, String(i)], itemShape);
      }
      return;
    }

    const leaf = rulesForScalar(field);
    if (leaf) setDeep(rules, full, leaf);

    if (field.type === "checkbox-group" && field.options) {
      const allowed = field.options.map((o: any) => o.value);
      const arr = (getDeep(model.value, full) as any[]) || [];
      for (let i = 0; i < arr.length; i++) {
        setDeep(rules, [...full, String(i)], { oneOf: fr.oneOf(allowed) });
      }
    }
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

const sections = computed(() => props.formDefinition?.sections ?? []);

function isFieldVisible(field: any): boolean {
  try {
    return evaluateShowIf(field?.showIf, model.value);
  } catch (e) {
    console.warn("[DynamicForm] showIf evaluation failed for", field?.path, e);
    return true;
  }
}

async function validateCurrentSection() {
  await nextTick();
  const s = sections.value[currentSection.value];
  if (!s) return true;

  const results = await Promise.all(
    s.fields.map(async (f) => {
      const node = nodeFor(f.path);
      return node ? node.$validate() : true;
    })
  );

  if (!results.every(Boolean) && v$.value.$errors.length > 0) {
    console.log("[DynamicForm] validation errors", v$.value.$errors);
  }

  return results.every(Boolean);
}

async function next() {
  try {
    // toujours valider la section courante
    if (!(await validateCurrentSection())) {
      triggerErrorState();
      return;
    }

    const nextIdx = currentSection.value + 1;

    // valider tout le formulaire si on est sur la dernière étape
    if (nextIdx >= sections.value.length) {
      await nextTick();
      await v$.value.$validate(); // valide toutes les sections
      if (v$.value.$errors.length > 0) {
        triggerErrorState();
        return;
      }
      emit("complete");
      return;
    }

    // sinon étape suivante
    currentSection.value = nextIdx;
    formRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (e) {
    console.error("[DynamicForm/next]", e);
  }
}

watch(sections, (list) => {
  if (!list.length) {
    currentSection.value = 0;
    return;
  }
  if (currentSection.value > list.length - 1) {
    currentSection.value = list.length - 1;
  }
});

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
  }

  const isValid = await validateCurrentSection();
  if (isValid) {
    currentSection.value = step;
  }
}

const stepsState = computed(() => {
  return sections.value.map((section, idx) => {
    const paths = section.fields.map((f) => f.path);

    const hasError = v$.value.$errors.some((e) =>
      inSectionPath(e.$propertyPath ?? e.$property ?? "", paths)
    );

    return {
      index: idx + 1,
      label: section.label,
      isCurrentStep: idx === currentSection.value,
      isValid: !hasError,
      isVisited: idx <= currentSection.value,
    };
  });
});

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

const getSuggestion = (k?: string) => {
  if (!k || !Array.isArray(props.suggestions)) return undefined as any;
  for (const entry of props.suggestions) {
    if (entry?.key === k) return entry.value; // direct match
    const nested = (entry?.value as any)?.[k];
    if (nested != null) return nested; // nested object match
  }
  return undefined as any;
};

const visibleFields = computed(() => {
  const s = sections.value[currentSection.value];
  if (!s) return [];
  return s.fields.filter((f) => isFieldVisible(f));
});
</script>

<template>
  <form
    ref="formRef"
    class="dynamic-form"
    @submit.prevent
    v-if="formDefinition"
  >
    <span class="dynamic-form__title sr-only">{{ formDefinition?.title }}</span>
    <FormElementsFormSteps
      v-if="formDefinition?.sections.length > 1"
      :steps-state="stepsState"
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
        <FormElementsFormField
          v-for="field in visibleFields"
          :key="field.path"
          :formField="field"
          :suggestion="getSuggestion(field.suggestionRef)"
          v-model="model"
          :validation="nodeFor(field.path)"
          @hasErrors="stopNextStep = $event.hasErrors"
        />
      </div>
    </div>
    <div class="dynamic-form__buttons">
      <UIPrimaryButton
        :variant="showErrorState ? 'error-color' : 'accent-color'"
        :icon="showErrorState ? 'x_circle' : 'arrow_right'"
        :class="{ shake: showErrorState }"
        @click="next"
        @keydown.enter="next"
        @keydown.space="next"
      >
        {{ showErrorState ? "Corrigez les erreurs" : "Suivant" }}
      </UIPrimaryButton>
      <UISecondaryButton
        v-if="currentSection > 0"
        variant="accent-color"
        icon="arrow_left"
        :reverse="true"
        @click="prev"
        @keydown.enter="prev"
        @keydown.space="prev"
      >
        Précédent
      </UISecondaryButton>
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
  scroll-margin-top: 4rem;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
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
      grid-template-columns: 1fr;
      gap: 1rem;

      @media (min-width: $big-tablet-screen) {
        gap: 1.5rem;
        grid-template-columns: 1fr 1fr;
        align-items: center;
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
