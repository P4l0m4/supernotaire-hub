<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { colors } from "@/utils/colors";
import { useIsMobile } from "@/utils/otherFunctions";

import {
  buildPartialDocDefinition,
  buildFullDocDefinition,
  wipeAllStorageData,
} from "@/utils/rubriquesDossier";
import { useExportAccess } from "@/composables/useExportAccess";

const isMobile = useIsMobile();

const { $pdfMake } = useNuxtApp();
const route = useRoute();

const showModal = ref(false);
const partialLoading = ref(false);
const partialError = ref<string | null>(null);
const fullLoading = ref(false);
const fullError = ref<string | null>(null);
const notifyVisible = ref(false);
const notifyMessage = ref<string | null>(null);
const notifyColor = ref(colors["error-color"]);
const wipeLoading = ref(false);
const wipeError = ref(false);
const wipeSuccess = ref(false);

const { access: exportUnlocked, refresh: refreshAccess } = useExportAccess();

const closeModal = () => {
  if (partialLoading.value || fullLoading.value) return;
  showModal.value = false;
};

const openModalOrDownload = () => {
  if (exportUnlocked.value) {
    downloadFullExport();
  } else {
    partialError.value = null;
    fullError.value = null;
    showModal.value = true;
  }
};

const downloadPartialExport = async () => {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  partialLoading.value = true;
  partialError.value = null;

  try {
    const docDefinition = await buildPartialDocDefinition();
    if (!docDefinition) {
      partialError.value =
        "Aucune rubrique gratuite complétée n'est disponible pour l'export.";
      return;
    }

    $pdfMake
      // @ts-ignore
      .createPdf(docDefinition)
      .download("checklist-rubriques-gratuites.pdf");
    closeModal();
  } catch (error) {
    console.error("[ExportMenu] partial export failed", error);
    partialError.value =
      "Une erreur est survenue pendant la génération du PDF. Veuillez réessayer.";
  } finally {
    partialLoading.value = false;
  }
};

const downloadFullExport = async () => {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  fullLoading.value = true;
  fullError.value = null;
  try {
    const docDefinition = await buildFullDocDefinition();
    if (!docDefinition) {
      fullError.value =
        "Aucune rubrique complétée n'est disponible pour l'export complet.";
      return;
    }
    $pdfMake
      // @ts-ignore
      .createPdf(docDefinition)
      .download("checklist-rubriques-completes.pdf");
    closeModal();
  } catch (error) {
    console.error("[ExportMenu] full export failed", error);
    fullError.value =
      "Une erreur est survenue pendant la génération du PDF. Veuillez réessayer.";
  } finally {
    fullLoading.value = false;
  }
};

const startCheckout = async () => {
  if (exportUnlocked.value) {
    await downloadFullExport();
    return;
  }
  fullLoading.value = true;
  fullError.value = null;
  try {
    const { url } = await $fetch<{ url?: string; error?: string }>(
      "/api/checkout/create-session",
      { method: "POST" }
    );
    if (!url) throw new Error("URL de paiement introuvable");
    window.location.href = url;
  } catch (error) {
    console.error("[ExportMenu] checkout failed", error);
    fullError.value =
      "Impossible d'ouvrir le paiement. Veuillez réessayer dans un instant.";
  } finally {
    fullLoading.value = false;
  }
};

async function wipeAll() {
  if (!process.client) return;
  wipeLoading.value = true;

  try {
    wipeAllStorageData();
    notifyColor.value = colors["success-color"];
    notifyMessage.value = "Toutes les données locales ont été supprimées.";
    notifyVisible.value = true;
    wipeSuccess.value = true;
    wipeLoading.value = false;
  } catch (error) {
    console.error("[ExportMenu] wipe all failed", error);
    notifyColor.value = colors["error-color"];
    notifyMessage.value =
      "Impossible de supprimer les données locales. Réessayez.";
    notifyVisible.value = true;
    wipeError.value = true;
    wipeLoading.value = false;
  } finally {
    setTimeout(() => {
      wipeLoading.value = false;
      wipeSuccess.value = false;
      wipeError.value = false;
    }, 2000);
  }
}

const wipeStatusIcon = computed(() => {
  if (wipeLoading.value) return "circle_notch";
  if (wipeError.value) return "x_circle";
  if (wipeSuccess.value) return "check_circle";
  return "trash";
});

const wipeStatusVariant = computed(() => {
  if (wipeSuccess.value) return "success-color";
  else if (wipeError.value) return "error-color";
  else return "text-color-faded";
});

onMounted(() => {
  const sessionId =
    typeof route.query.session_id === "string"
      ? route.query.session_id
      : undefined;
  refreshAccess(sessionId);
});
</script>

<template>
  <aside class="export-menu">
    <UISecondaryButton
      variant="accent-color"
      :icon="isMobile ? '' : 'download'"
      :disabled="fullLoading"
      @click="openModalOrDownload"
    >
      Exporter le récapitulatif complet
    </UISecondaryButton>
    <UITertiaryButton
      :variant="wipeStatusVariant"
      :icon="wipeStatusIcon"
      @click="wipeAll"
      style="margin-top: 0"
    >
      Supprimer les données
    </UITertiaryButton>

    <UIFullPageModal
      v-if="showModal"
      title="Exporter votre récapitulatif"
      subtitle="Débloquez l'export complet comprenant toutes les rubriques complétées ou téléchargez un export partiel gratuitement."
      @close="closeModal"
    >
      <div class="export-modal">
        <UIPrimaryButton
          variant="accent-color"
          icon="download"
          :disabled="fullLoading"
          @click="exportUnlocked ? downloadFullExport() : startCheckout()"
        >
          <template v-if="fullLoading">Redirection / génération...</template>
          <template v-else-if="exportUnlocked">
            Télécharger le récapitulatif complet
          </template>
          <template v-else>Débloquer l'export complet</template>
        </UIPrimaryButton>
        <UITertiaryButton
          variant="accent-color"
          icon="download"
          :disabled="partialLoading"
          @click="downloadPartialExport"
        >
          <template v-if="partialLoading">Export en cours...</template>
          <template v-else>Export partiel</template>
        </UITertiaryButton>

        <p v-if="partialError" class="export-modal__error">
          {{ partialError }}
        </p>
        <p v-if="fullError" class="export-modal__error">
          {{ fullError }}
        </p>
      </div>
    </UIFullPageModal>
    <UINotificationModal
      v-if="notifyVisible && notifyMessage"
      :progress-color="notifyColor"
      @close="notifyVisible = false"
      ><UIActionToast :color="notifyColor" icon="alert_circle" direction="row"
        >{{ notifyMessage }}
      </UIActionToast></UINotificationModal
    >
  </aside>
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

.export-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 100%;

  &__error {
    color: $error-color;
    font-size: $small-text;
  }
}
</style>
