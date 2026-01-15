<script setup lang="ts">
import { reactive, ref, onMounted, watch } from "vue";
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

const hydrateFromStorage = () => {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem(props.storageKey);
    if (raw) Object.assign(formData, JSON.parse(raw));
  } catch (e) {
    console.warn("[Rubrique] hydrate failed", props.storageKey, e);
  }
};

const persistToStorage = () => {
  if (!process.client) return;
  watch(
    () => formData,
    (val) => {
      try {
        localStorage.setItem(props.storageKey, JSON.stringify(val));
      } catch (e) {
        console.warn("[Rubrique] persist failed", props.storageKey, e);
      }
    },
    { deep: true }
  );
};

onMounted(() => {
  hydrateFromStorage();
  persistToStorage();
});

const pdfFileName = (prefix: string) => {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.pdf`;
};

const onComplete = () => {
  showLastAction.value = true;
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
    />

    <div class="rubrique__actions">
      <UITertiaryButton
        v-if="showLastAction"
        variant="accent-color"
        icon="download"
        @click="downloadPdf"
      >
        Télécharger le PDF de la rubrique
      </UITertiaryButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rubrique {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

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
