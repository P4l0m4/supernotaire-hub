<script setup lang="ts">
import { ref } from "vue";
import { buildPartialDocDefinition } from "@/utils/rubriquesDossier";

const { $pdfMake } = useNuxtApp();

const showModal = ref(false);
const partialLoading = ref(false);
const partialError = ref<string | null>(null);

const openModal = () => {
  partialError.value = null;
  showModal.value = true;
};

const closeModal = () => {
  if (partialLoading.value) return;
  showModal.value = false;
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
        "Aucune rubrique gratuite compl\u00e9t\u00e9e n'est disponible pour l'export.";
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
      "Une erreur est survenue pendant la g\u00e9n\u00e9ration du PDF. Veuillez r\u00e9essayer.";
  } finally {
    partialLoading.value = false;
  }
};
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
        @click="openModal"
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
          @click="closeModal"
        >
          Export complet
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
      </div>
    </UIFullPageModal>
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
