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

const icon = computed(() => (loading.value ? "circle_notch" : "download"));
const downloadDisabled = computed(
  () => !hydrated.value || loading.value || !ready.value,
);

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
    <p v-if="error" class="export-menu__error">{{ error }}</p>
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
