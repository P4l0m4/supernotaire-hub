<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { loadLogo } from "@/utils/otherFunctions";
import type { FormDefinition } from "@/types/forms";

const props = defineProps<{
  sectionId: string;
  title: string;
  storageKey: string;
  pdfPrefix: string;
  formDefinition: FormDefinition;
  docBuilder: (data: any, logo: string) => any;
}>();

const { $pdfMake } = useNuxtApp();
const formData = reactive<Record<string, any>>({});
const showLastAction = ref(false);
const lastValidSnapshot = ref<Record<string, any> | null>(null);
const cloneData = (data: Record<string, any>) =>
  JSON.parse(JSON.stringify(data ?? {}));

const hydrateFromStorage = () => {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem(props.storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(formData, parsed);
      lastValidSnapshot.value = cloneData(parsed);
      if (parsed?.__completed) {
        showLastAction.value = true;
      }
    }
  } catch (e) {
    console.warn("[Rubrique] hydrate failed", props.storageKey, e);
  }
};

const persistSnapshot = (data: Record<string, any>) => {
  if (!process.client) return;
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn("[Rubrique] persist failed", props.storageKey, e);
  }
};

onMounted(() => {
  hydrateFromStorage();
});

const pdfFileName = (prefix: string) => {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.pdf`;
};

const onComplete = () => {
  formData.__completed = true;
  const snapshot = cloneData(formData);
  lastValidSnapshot.value = snapshot;
  persistSnapshot(snapshot);
  showLastAction.value = true;
};

const onValidState = (payload: { isValid: boolean; model: any }) => {
  if (!payload?.isValid) {
    formData.__completed = false;
    showLastAction.value = false;
    const base = lastValidSnapshot.value
      ? { ...lastValidSnapshot.value, __completed: false }
      : { __completed: false };
    persistSnapshot(base);
    return;
  }
  const snapshot = cloneData(payload.model || {});
  if (formData.__completed) snapshot.__completed = true;
  lastValidSnapshot.value = snapshot;
  persistSnapshot(snapshot);
};

const downloadPdf = async () => {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  const logo = await loadLogo();
  const doc = props.docBuilder(formData, logo);
  if (!doc) return;
  // @ts-ignore
  $pdfMake.createPdf(doc).download(pdfFileName(props.pdfPrefix));
};
</script>

<template>
  <div class="rubrique">
    <div class="rubrique__header">
      <h1 class="titles">{{ title }}</h1>
      <p class="subtitles">
        Remplissez les informations requises pour cette rubrique. Vos données
        sont conservées localement sur votre navigateur.
      </p>
    </div>

    <FormElementsDynamicForm
      :formDefinition="formDefinition"
      v-model="formData"
      :suggestions="[]"
      @complete="onComplete"
      @valid-state="onValidState"
    />

    <div class="rubrique__actions">
      <UITertiaryButton
        v-if="showLastAction"
        variant="accent-color"
        icon="download"
        @click="downloadPdf"
      >
        Télécharger le récapitulatif
      </UITertiaryButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rubrique {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
  }
}
</style>
