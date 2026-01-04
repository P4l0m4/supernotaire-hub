<script setup lang="ts">
import { reactive, ref } from "vue";

import achievement from "/achievement-45.svg?url";

import { buildDocDefinition as buildIdentiteDocDefinition } from "@/utils/docDefinitions/checklist-identite-etat-civil";
import { buildDocDefinition as buildSituationDocDefinition } from "@/utils/docDefinitions/checklist-situation-matrimoniale";
import { buildDocDefinition as buildProFiscaleDocDefinition } from "@/utils/docDefinitions/checklist-situation-professionnelle-fiscale";
import identiteFormDefinition from "@/utils/formDefinition/checklist-identite-etat-civil.json";
import situationFormDefinition from "@/utils/formDefinition/checklist-situation-matrimoniale.json";
import proFiscaleFormDefinition from "@/utils/formDefinition/checklist-situation-professionnelle-fiscale.json";
import { loadLogo } from "@/utils/otherFunctions";

import type { ChecklistIdentiteEtatCivil } from "@/utils/types/checklist-identite-etat-civil";
import type { ChecklistSituationMatrimoniale } from "@/utils/types/checklist-situation-matrimoniale";
import type { ChecklistSituationProfessionnelleFiscale } from "@/utils/types/checklist-situation-professionnelle-fiscale";
import type { FormDefinition } from "@/utils/types/forms";

type ChecklistSection = "identite" | "situation" | "pro-fiscale";

const identiteFormData = reactive({} as ChecklistIdentiteEtatCivil);
const situationFormData = reactive({} as ChecklistSituationMatrimoniale);
const proFiscaleFormData = reactive({} as ChecklistSituationProfessionnelleFiscale);
const activeSection = ref<ChecklistSection | null>(null);
const showLastAction = ref(false);
const lastCompletedSection = ref<ChecklistSection | null>(null);

const { $pdfMake } = useNuxtApp();
const ready = useState<boolean>("pdfmake-ready");

function pdfFileName(prefix: string) {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.pdf`;
}

function onFormCompletion(section: ChecklistSection) {
  lastCompletedSection.value = section;
  showLastAction.value = true;
}

async function generatePdf() {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  const logo = await loadLogo();
  const doc =
    lastCompletedSection.value === "situation"
      ? buildSituationDocDefinition(situationFormData, logo)
      : lastCompletedSection.value === "pro-fiscale"
      ? buildProFiscaleDocDefinition(proFiscaleFormData, logo)
      : buildIdentiteDocDefinition(identiteFormData, logo);
  if (!doc) return;
  // @ts-ignore
  const name =
    lastCompletedSection.value === "situation"
      ? pdfFileName("situation-matrimoniale")
      : lastCompletedSection.value === "pro-fiscale"
      ? pdfFileName("situation-professionnelle-fiscale")
      : pdfFileName("identite-etat-civil");
  $pdfMake.createPdf(doc).download(name);
}
</script>

<template>
  <div v-if="!activeSection" class="checklist-sections">
    <div class="checklist-card">
      <h2 class="checklist-card__title">Identité & État civil</h2>
      <p class="checklist-card__subtitle">
        Cliquez sur "Commencer" pour générer une checklist personnalisée pour
        cette rubrique.
      </p>
      <UIPrimaryButton
        variant="accent-color"
        icon="arrow_right"
        @click="activeSection = 'identite'"
        style="margin-top: auto"
      >
        Commencer
      </UIPrimaryButton>
    </div>
    <div class="checklist-card">
      <h2 class="checklist-card__title">Situation matrimoniale</h2>
      <p class="checklist-card__subtitle">
        Cliquez sur "Commencer" pour générer une checklist personnalisée pour
        cette rubrique.
      </p>
      <UIPrimaryButton
        variant="accent-color"
        icon="arrow_right"
        @click="activeSection = 'situation'"
        style="margin-top: auto"
      >
        Commencer
      </UIPrimaryButton>
    </div>
    <div class="checklist-card">
      <h2 class="checklist-card__title">Situation professionnelle & Fiscale</h2>
      <p class="checklist-card__subtitle">
        Cliquez sur "Commencer" pour générer une checklist personnalisée pour
        cette rubrique.
      </p>
      <UIPrimaryButton
        variant="accent-color"
        icon="arrow_right"
        @click="activeSection = 'pro-fiscale'"
        style="margin-top: auto"
      >
        Commencer
      </UIPrimaryButton>
    </div>
  </div>
  <FormElementsDynamicForm
    v-else-if="!showLastAction && activeSection === 'identite'"
    :formDefinition="identiteFormDefinition as FormDefinition"
    v-model="identiteFormData"
    :suggestions="[]"
    @complete="onFormCompletion('identite')"
  />
  <FormElementsDynamicForm
    v-else-if="!showLastAction && activeSection === 'situation'"
    :formDefinition="situationFormDefinition as FormDefinition"
    v-model="situationFormData"
    :suggestions="[]"
    @complete="onFormCompletion('situation')"
  />
  <FormElementsDynamicForm
    v-else-if="!showLastAction && activeSection === 'pro-fiscale'"
    :formDefinition="proFiscaleFormDefinition as FormDefinition"
    v-model="proFiscaleFormData"
    :suggestions="[]"
    @complete="onFormCompletion('pro-fiscale')"
  />
  <div v-else class="action">
    <div class="action__illustration">
      <img
        class="action__illustration__image"
        :src="achievement"
        alt="Checklist prête"
      />
    </div>
    <ul class="action__list">
      <span class="action__list__title">Checklist prête</span>
      <span class="action__list__subtitle">
        Téléchargez votre checklist.
      </span>
      <div class="action__list__buttons">
        <UISecondaryButton
          variant="accent-color"
          icon="arrow_left"
          :reverse="true"
          @click="showLastAction = false"
          @keydown.enter="showLastAction = false"
          @keydown.space="showLastAction = false"
        >
          Revenir au formulaire
        </UISecondaryButton>
        <UISecondaryButton
          variant="accent-color"
          icon="arrow_left"
          :reverse="true"
          @click="() => { showLastAction = false; activeSection = null; }"
          @keydown.enter="() => { showLastAction = false; activeSection = null; }"
          @keydown.space="() => { showLastAction = false; activeSection = null; }"
        >
          Retour aux rubriques
        </UISecondaryButton>
        <ClientOnly>
          <UIPrimaryButton
            @click="generatePdf()"
            :disabled="!ready"
            variant="accent-color"
            icon="download"
            >Télécharger la checklist</UIPrimaryButton
          ></ClientOnly>
      </div>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/action.scss";

.checklist-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $desktop-screen) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.checklist-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border-radius: $radius;
  background-color: $primary-color;
  box-shadow: $shadow-black;
  min-height: 220px;

  &__title {
    font-size: 1.5rem;
    font-weight: $semi-bold;
  }

  &__subtitle {
    color: $text-color-faded;
  }
}
</style>


