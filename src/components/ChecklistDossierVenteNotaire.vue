<script setup lang="ts">
import { reactive, ref, watch, onMounted, computed } from "vue";

import achievement from "/achievement-45.svg?url";

import { buildDocDefinition as buildIdentiteDocDefinition } from "@/utils/docDefinitions/checklist-identite-etat-civil";
import { buildDocDefinition as buildSituationDocDefinition } from "@/utils/docDefinitions/checklist-situation-matrimoniale";
import { buildDocDefinition as buildProFiscaleDocDefinition } from "@/utils/docDefinitions/checklist-situation-professionnelle-fiscale";
import { buildDocDefinition as buildUrbanismeDocDefinition } from "@/utils/docDefinitions/checklist-urbanisme-travaux-exterieurs";
import identiteFormDefinition from "@/utils/formDefinition/checklist-identite-etat-civil.json";
import situationFormDefinition from "@/utils/formDefinition/checklist-situation-matrimoniale.json";
import proFiscaleFormDefinition from "@/utils/formDefinition/checklist-situation-professionnelle-fiscale.json";
import urbanismeFormDefinition from "@/utils/formDefinition/checklist-urbanisme-travaux-exterieurs.json";
import { loadLogo } from "@/utils/otherFunctions";

import type { ChecklistIdentiteEtatCivil } from "@/types/checklist-identite-etat-civil";
import type { ChecklistSituationMatrimoniale } from "@/types/checklist-situation-matrimoniale";
import type { ChecklistSituationProfessionnelleFiscale } from "@/types/checklist-situation-professionnelle-fiscale";
import type { ChecklistUrbanismeTravauxExterieurs } from "@/types/checklist-urbanisme-travaux-exterieurs";
import type { FormDefinition } from "@/types/forms";

type ChecklistSection = "identite" | "situation" | "pro-fiscale" | "urbanisme";

const checklistCards: Array<{
  id: ChecklistSection;
  title: string;
  subtitle: string;
}> = [
  {
    id: "identite",
    title: "Identité & État civil",
    subtitle:
      "Infos d'identité, état civil, coordonnées et pièces justificatives de base.",
  },
  {
    id: "situation",
    title: "Situation matrimoniale",
    subtitle:
      "égime matrimonial, contrat de mariage ou PACS, séparations, enfants et attestations associées.",
  },
  {
    id: "pro-fiscale",
    title: "Situation professionnelle & Fiscale",
    subtitle:
      "Activité pro, revenus, imposition, patrimoine financier et justificatifs fiscaux attendus.",
  },
  {
    id: "urbanisme",
    title: "Urbanisme & Travaux extérieurs",
    subtitle:
      "Autorisations d'urbanisme, travaux réalisés et informations cadastrales.",
  },
];

const identiteFormData = reactive({} as ChecklistIdentiteEtatCivil);
const situationFormData = reactive({} as ChecklistSituationMatrimoniale);
const proFiscaleFormData = reactive(
  {} as ChecklistSituationProfessionnelleFiscale
);
const urbanismeFormData = reactive({} as ChecklistUrbanismeTravauxExterieurs);
const activeSection = ref<ChecklistSection | null>(null);
const showLastAction = ref(false);
const lastCompletedSection = ref<ChecklistSection | null>(null);

const { $pdfMake } = useNuxtApp();
const STORAGE_KEYS = {
  identite: "sn-checklist-identite",
  situation: "sn-checklist-situation",
  pro: "sn-checklist-pro-fiscale",
  urbanisme: "sn-checklist-urbanisme",
};

function hydrateFromStorage<T extends object>(key: string, target: T) {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem(key);
    if (raw) Object.assign(target, JSON.parse(raw));
  } catch (e) {
    console.warn("[Checklist] Failed to hydrate", key, e);
  }
}

function persistToStorage<T extends object>(key: string, target: T) {
  if (!process.client) return;
  watch(
    () => target,
    (val) => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        console.warn("[Checklist] Failed to persist", key, e);
      }
    },
    { deep: true }
  );
}

onMounted(() => {
  hydrateFromStorage(STORAGE_KEYS.identite, identiteFormData);
  hydrateFromStorage(STORAGE_KEYS.situation, situationFormData);
  hydrateFromStorage(STORAGE_KEYS.pro, proFiscaleFormData);
  hydrateFromStorage(STORAGE_KEYS.urbanisme, urbanismeFormData);

  persistToStorage(STORAGE_KEYS.identite, identiteFormData);
  persistToStorage(STORAGE_KEYS.situation, situationFormData);
  persistToStorage(STORAGE_KEYS.pro, proFiscaleFormData);
  persistToStorage(STORAGE_KEYS.urbanisme, urbanismeFormData);
});

function pdfFileName(prefix: string) {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.pdf`;
}

function onFormCompletion(section: ChecklistSection) {
  lastCompletedSection.value = section;
  showLastAction.value = true;
}

const hasValue = (val: unknown): boolean => {
  if (val == null) return false;
  if (typeof val === "boolean") return val === true;
  if (typeof val === "number") return true;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object")
    return Object.values(val).some((v) => hasValue(v));
  return false;
};

const progressFor = (section: ChecklistSection, data: any) => {
  if (lastCompletedSection.value === section) return 100;
  if (activeSection.value === section || hasValue(data)) return 50;
  return 0;
};

const sectionsProgress = computed(() => ({
  identite: progressFor("identite", identiteFormData),
  situation: progressFor("situation", situationFormData),
  "pro-fiscale": progressFor("pro-fiscale", proFiscaleFormData),
  urbanisme: progressFor("urbanisme", urbanismeFormData),
}));

const sectionProgress = (section: ChecklistSection) =>
  sectionsProgress.value[section];

const statusClass = (p: number) => {
  if (p === 100) return "checklist-card__status--done";
  if (p > 0) return "checklist-card__status--progress";
  return "checklist-card__status--todo";
};

const statusIcon = (p: number) => {
  if (p === 100) return "check_circle";
  if (p > 0) return "clock";
  return "circle";
};

async function generatePdf() {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;

  const logo = await loadLogo();
  const doc =
    lastCompletedSection.value === "situation"
      ? buildSituationDocDefinition(situationFormData, logo)
      : lastCompletedSection.value === "pro-fiscale"
      ? buildProFiscaleDocDefinition(proFiscaleFormData, logo)
      : lastCompletedSection.value === "urbanisme"
      ? buildUrbanismeDocDefinition(urbanismeFormData, logo)
      : buildIdentiteDocDefinition(identiteFormData, logo);
  if (!doc) return;
  // @ts-ignore
  const name =
    lastCompletedSection.value === "situation"
      ? pdfFileName("situation-matrimoniale")
      : lastCompletedSection.value === "pro-fiscale"
      ? pdfFileName("situation-professionnelle-fiscale")
      : lastCompletedSection.value === "urbanisme"
      ? pdfFileName("urbanisme-travaux-exterieurs")
      : pdfFileName("identite-etat-civil");
  // @ts-ignore
  $pdfMake.createPdf(doc).download(name);
}
</script>

<template>
  <div v-if="!activeSection" class="checklist-sections">
    <div
      class="checklist-card"
      v-for="checklistCard in checklistCards"
      :key="checklistCard.id"
      @click="activeSection = checklistCard.id"
    >
      <h2 class="checklist-card__title">{{ checklistCard.title }}</h2>
      <p class="checklist-card__subtitle">
        {{ checklistCard.subtitle }}
      </p>
      <div
        class="checklist-card__status"
        :class="statusClass(sectionProgress(checklistCard.id))"
      >
        <UIIconComponent
          class="checklist-card__status__icon"
          :icon="statusIcon(sectionProgress(checklistCard.id))"
        />
        <span class="checklist-card__status__text">
          {{ sectionProgress(checklistCard.id) }}%
        </span>
      </div>
    </div>
  </div>
  <template v-else-if="!showLastAction">
    <FormElementsDynamicForm
      v-if="activeSection === 'identite'"
      :formDefinition="identiteFormDefinition as FormDefinition"
      v-model="identiteFormData"
      :suggestions="[]"
      @complete="onFormCompletion('identite')"
    />

    <FormElementsDynamicForm
      v-if="activeSection === 'situation'"
      :formDefinition="situationFormDefinition as FormDefinition"
      v-model="situationFormData"
      :suggestions="[]"
      @complete="onFormCompletion('situation')"
    />

    <FormElementsDynamicForm
      v-if="activeSection === 'pro-fiscale'"
      :formDefinition="proFiscaleFormDefinition as FormDefinition"
      v-model="proFiscaleFormData"
      :suggestions="[]"
      @complete="onFormCompletion('pro-fiscale')"
    />

    <FormElementsDynamicForm
      v-if="activeSection === 'urbanisme'"
      :formDefinition="urbanismeFormDefinition as FormDefinition"
      v-model="urbanismeFormData"
      :suggestions="[]"
      @complete="onFormCompletion('urbanisme')"
    />

    <UITertiaryButton
      variant="accent-color"
      icon="arrow_left"
      direction="row-reverse"
      @click="
        () => {
          activeSection = null;
          showLastAction = false;
        }
      "
      style="margin-top: 1rem"
    >
      Retour aux rubriques
    </UITertiaryButton>
  </template>
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
      <span class="action__list__subtitle"> Téléchargez votre checklist. </span>
      <div class="action__list__buttons">
        <UISecondaryButton
          variant="accent-color"
          icon="arrow_left"
          @click="showLastAction = false"
          @keydown.enter="showLastAction = false"
          @keydown.space="showLastAction = false"
        >
          Revenir au formulaire
        </UISecondaryButton>
        <UITertiaryButton
          variant="accent-color"
          icon="arrow_left"
          direction="row-reverse"
          @click="
            () => {
              showLastAction = false;
              activeSection = null;
            }
          "
          @keydown.enter="
            () => {
              showLastAction = false;
              activeSection = null;
            }
          "
          @keydown.space="
            () => {
              showLastAction = false;
              activeSection = null;
            }
          "
        >
          Retour aux rubriques
        </UITertiaryButton>
        <ClientOnly>
          <UIPrimaryButton
            @click="generatePdf()"
            :disabled="!ready"
            variant="accent-color"
            icon="download"
            >Télécharger la checklist</UIPrimaryButton
          ></ClientOnly
        >
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
  border-radius: calc($radius / 2);
  border: 1px solid color-mix(in srgb, $text-color 10%, transparent);
  min-height: 220px;
  transition: box-shadow 0.2s linear, background-color 0.2s linear,
    border 0.2s linear;

  &:hover {
    background-color: $primary-color;
    box-shadow: $shadow-black;
    border: 1px solid $primary-color;
    cursor: pointer;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: $semi-bold;
  }

  &__subtitle {
    color: $text-color-faded;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-weight: $semi-bold;
    font-size: 0.95rem;
    margin-top: auto;

    &__text {
      line-height: 1;
    }

    &__icon {
      font-size: 1.1rem;
      display: flex;
      align-items: center;
    }

    &--done {
      background: rgba($success-color, 0.15);
      color: $success-color;
    }

    &--progress {
      background: rgba($accent-color, 0.15);
      color: $accent-color;
    }

    &--todo {
      background: rgba($text-color, 0.08);
      color: $text-color;
    }
  }
}
</style>
