<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { colors } from "@/utils/colors";
import { loadLogo } from "@/utils/otherFunctions";
import { buildDocDefinition } from "@/utils/docDefinitions/pre-etat-date";
import type { PreEtatDate } from "@/types/pre-etat-date-complet";

const STORAGE_KEY = "sn-pre-etat-date";
const SECTION_IDS = [
  "documents",
  "bien",
  "copropriete",
  "syndic",
  "financier_lot",
  "financier_lot_sommes_dues_cedant",
  "financier_lot_sommes_debiteur_syndic",
  "financier_lot_sommes_a_la_charge_acquereur_post_vente",
  "financier_lot_autres",
] as const;

type SectionId = (typeof SECTION_IDS)[number];
const { $pdfMake } = useNuxtApp();
const ready = useState<boolean>("pdfmake-ready");

const loading = ref(false);
const error = ref<string | null>(null);
const notifyVisible = ref(false);
const notifyMessage = ref<string | null>(null);
const notifyColor = ref(colors["warning-color"]);
const hydrated = ref(false);
const wipeLoading = ref(false);
const wipeError = ref(false);
const wipeSuccess = ref(false);

const icon = computed(() => (loading.value ? "circle_notch" : "download"));
const downloadDisabled = computed(
  () => !hydrated.value || loading.value || !ready.value,
);
const wipeStatusIcon = computed(() => {
  if (wipeLoading.value) return "circle_notch";
  if (wipeError.value) return "x_circle";
  if (wipeSuccess.value) return "check_circle";
  return "trash";
});

const wipeStatusVariant = computed(() => {
  if (wipeSuccess.value) return "success-color";
  if (wipeError.value) return "error-color";
  return "text-color-faded";
});

onMounted(() => {
  hydrated.value = true;
});

const readData = (): PreEtatDate | null => {
  if (!process.client) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PreEtatDate) : null;
  } catch {
    return null;
  }
};

const isSectionCompleted = (data: PreEtatDate, sectionId: SectionId) => {
  const value = (data as any)?.[sectionId];
  return value?.__completed === true;
};

const hasIncompleteSections = (data: PreEtatDate) =>
  SECTION_IDS.some((id) => !isSectionCompleted(data, id));

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
  if (hasIncompleteSections(data)) {
    notifyMessage.value =
      "Certaines rubriques ne sont pas complétées; le PDF sera incomplet.";
    notifyVisible.value = true;
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

const wipeAll = async () => {
  if (!process.client) return;
  wipeLoading.value = true;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        storageArea: localStorage,
      }),
    );
    notifyColor.value = colors["success-color"];
    notifyMessage.value = "Toutes les données locales ont été supprimées.";
    notifyVisible.value = true;
    wipeSuccess.value = true;
  } catch (e) {
    console.error("[PED ExportMenu] wipe all failed", e);
    notifyColor.value = colors["error-color"];
    notifyMessage.value =
      "Impossible de supprimer les données locales. Réessayez.";
    notifyVisible.value = true;
    wipeError.value = true;
  } finally {
    wipeLoading.value = false;
    setTimeout(() => {
      wipeLoading.value = false;
      wipeSuccess.value = false;
      wipeError.value = false;
    }, 2000);
  }
};
</script>

<template>
  <div class="export-menu">
    <UISecondaryButton
      :icon="icon"
      :loading="loading"
      :disabled="downloadDisabled"
      variant="accent-color"
      @click="download"
      @keydown.enter="download"
      @keydown.space="download"
    >
      Télécharger le Pré-état daté
    </UISecondaryButton>
    <UITertiaryButton
      :variant="wipeStatusVariant"
      :icon="wipeStatusIcon"
      @click="wipeAll"
      style="margin: 0"
    >
      Supprimer les données
    </UITertiaryButton>

    <UINotificationModal
      v-if="notifyVisible && notifyMessage"
      :progress-color="notifyColor"
      @close="notifyVisible = false"
    >
      <UIActionToast :color="notifyColor" icon="alert_circle" direction="row">
        {{ notifyMessage }}
      </UIActionToast>
    </UINotificationModal>
  </div>
</template>

<style scoped lang="scss">
.export-menu {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
  width: 100%;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  @media (min-width: $laptop-screen) {
    flex-direction: row;
    align-items: center;
    width: fit-content;
  }
}
</style>
