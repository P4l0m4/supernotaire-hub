<script setup lang="ts">
import { computed, ref } from "vue";
import { colors } from "@/utils/colors";
import { loadLogo } from "@/utils/otherFunctions";
import { buildDocDefinition } from "@/utils/docDefinitions/pre-etat-date";
import type { PreEtatDate } from "@/types/pre-etat-date-complet";

const STORAGE_KEY = "sn-pre-etat-date";
const { $pdfMake } = useNuxtApp();
const ready = useState<boolean>("pdfmake-ready");

const loading = ref(false);
const error = ref<string | null>(null);

const icon = computed(() => (loading.value ? "circle_notch" : "download"));

const readData = (): PreEtatDate | null => {
  if (!process.client) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PreEtatDate) : null;
  } catch {
    return null;
  }
};

const download = async () => {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  error.value = null;
  const data = readData();
  if (!data) {
    error.value =
      "Aucune donnée enregistrée. Complétez au moins une rubrique avant d'exporter.";
    return;
  }
  loading.value = true;
  try {
    const logo = await loadLogo();
    const doc = buildDocDefinition(data, logo);
    // @ts-ignore
    $pdfMake.createPdf(doc).download("pre-etat-date.pdf");
  } catch (e) {
    console.error("[PED ExportMenu] export failed", e);
    error.value =
      "Une erreur est survenue pendant la génération du PDF. Réessayez.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="export-menu">
    <UISecondaryButton
      :icon="icon"
      :loading="loading"
      :disabled="!ready"
      variant="accent-color"
      @click="download"
      @keydown.enter="download"
      @keydown.space="download"
    >
      Télécharger le Pré-état daté
    </UISecondaryButton>
    <p v-if="error" class="export-menu__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.export-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
  justify-content: center;
  min-width: fit-content;

  &__error {
    color: $error-color;
    font-size: 0.9rem;
    max-width: 22rem;
    text-align: right;
  }
}
</style>
