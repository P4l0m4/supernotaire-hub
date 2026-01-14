<script setup lang="ts">
import { onMounted, ref } from "vue";
import { colors } from "@/utils/colors";
import {
  buildPartialDocDefinition,
  buildFullDocDefinition,
} from "@/utils/rubriquesDossier";
import { useExportAccess } from "@/composables/useExportAccess";

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
    <div class="export-menu__block">
      <h3 class="export-menu__title">
        Téléchargez votre récapitulatif personnalisé
      </h3>
      <p class="export-menu__hint">
        Obtenez un récapitulatif structuré des informations et documents
        nécessaires pour votre dossier de vente immobilière.
      </p>
      <p class="export-menu__hint">
        Joignez-y les documents qui y sont listés, et remettez-le à votre
        notaire.
      </p>
      <p class="export-menu__hint">
        Il saura immédiatement si votre dossier est complet, et vous gagnerez un
        temps précieux sur la vente de votre bien.
      </p>
      <UISecondaryButton
        variant="accent-color"
        icon="download"
        :disabled="fullLoading"
        @click="openModalOrDownload"
      >
        Exporter le récapitulatif complet
      </UISecondaryButton>
    </div>

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
      </div> </UIFullPageModal
    ><UINotificationModal
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
  gap: 1rem;
  width: 100%;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in srgb, $text-color 10%, transparent);

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
  }

  @media (min-width: $desktop-screen) {
    flex-direction: column;
    max-width: 22rem;
    padding-left: 1.5rem;
    border-left: 1px solid color-mix(in srgb, $text-color 10%, transparent);
    border-top: none;
    padding-top: 0;
  }

  &__block {
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 0.5rem;
    padding: 1rem;
    height: 100%;
    width: 100%;
    min-height: 160px;
    border-radius: calc($radius / 2);
    border: 1px solid color-mix(in srgb, $text-color 8%, transparent);
  }

  &__title {
    font-size: 1.1rem;
    font-weight: $semi-bold;
    width: 100%;
  }

  &__hint {
    color: $text-color-faded;
    font-size: 0.95rem;
    width: 100%;
    margin-bottom: auto;
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
