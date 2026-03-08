<script lang="ts" setup>
import { computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { colors } from "@/utils/colors";

import type { ListSection } from "@/components/UI/ListPreview.vue";

const pushChecklistStart = (ctaLocation: "form") => {
  if (!process.client) return;
  if (window.location.hostname === "localhost") return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: "checklist_start",
    page_type: "landing_liste_documents_vente_immo",
    cta_location: ctaLocation,
  });
};

const selectedOption = ref("Appartement");

const radioOptions = [
  {
    id: "option1",
    name: "options",
    value: "Appartement",
    label: "Appartement",
    description: "Appartement situé dans un immeuble ou une copropriété.",
    icon: "buildings_fill",
  },
  {
    id: "option2",
    name: "options",
    value: "Maison",
    label: "Maison",
    description: "Maison individuelle, mitoyenne, avec ou sans terrain, etc.",
    icon: "house_line_fill",
  },
];

const rules = {
  option: { required },
};

const vContact$ = useVuelidate(rules, {
  option: selectedOption,
});

const SHARED_TYPE_KEY = "sn-shared-type-bien";
const PREALABLES_KEY = "sn-checklist-prealables";

const handleContinue = async () => {
  vContact$.value.option.$touch();
  if (vContact$.value.option.$invalid) return;
  if (process.client) {
    try {
      localStorage.setItem(SHARED_TYPE_KEY, selectedOption.value);
      const existing = localStorage.getItem(PREALABLES_KEY);
      const parsed =
        existing && existing.trim().length ? JSON.parse(existing) : {};
      if (parsed?.type_bien !== selectedOption.value) {
        localStorage.setItem(
          PREALABLES_KEY,
          JSON.stringify({
            ...parsed,
            type_bien: selectedOption.value,
          }),
        );
      }
    } catch (e) {
      console.warn("[liste-documents] failed to store type bien", e);
    }
  }
  await navigateTo("/outils/checklist-dossier-vente-notaire/prealables");
};

const optionsErrors = computed(() => {
  const errors: string[] = [];
  if (!vContact$.value.option.$dirty) return errors;
  vContact$.value.option.required.$invalid &&
    errors.push("Sélectionnez une option");
  return errors;
});

const sectionsAppartement: ListSection[] = [
  {
    title: "Copropriété & Structures collectives",
    items: [
      { label: "Règlement de copropriété" },
      { label: "Pré-état daté" },
      { label: "Dernier procès-verbal d'AG" },
    ],
  },
  {
    title: "Charges & Taxes",
    items: [
      { label: "Dernier avis de taxe foncière" },
      { label: "Dernière attestation d'entretien du chauffage" },
      { label: "RIB du bénéficiaire 1" },
    ],
  },
  {
    title: "Capacité & Représentation",
    items: [
      { label: "Pièce d'identité du tuteur" },
      {
        label: "Jugement de mise sous tutelle",
      },
      { label: "Autorisation du juge des tutelles" },
    ],
  },

  {
    title: "Occupation du bien",
    items: [
      { label: "Copie du bail" },
      { label: "Dernier avis d'échéance ou quittance de loyer" },
      { label: "État des lieux d'entrée (si disponible)" },
    ],
  },
  {
    title: "Identité & État civil",
    items: [
      { label: "Pièce d'identité (CNI, titre de séjour ou passeport)" },
      { label: "Acte de naissance intégral < 3 mois" },
      { label: "Justificatif de domicile < 3 mois" },
    ],
  },
  {
    title: "Situation fiscale",
    items: [{ label: "Dernier avis d'impôt sur le revenu" }],
  },
];

const sectionsMaison: ListSection[] = [
  {
    title: "Diagnostics & Travaux intérieurs",
    items: [
      { label: "DPE - Diagnostic de performance énergétique" },
      { label: "Diagnostic amiante" },
      { label: "Diagnostic plomb (CREP)" },
    ],
  },
  {
    title: "Urbanisme & Travaux extérieurs",
    items: [
      {
        label:
          "Arrêté de permis de construire ou arrêté de non-opposition à déclaration préalable",
      },
      {
        label:
          "DAACT (déclaration attestant l'achèvement et la conformité des travaux)",
      },
      { label: "Extrait ou plan cadastral du bien" },
    ],
  },
  {
    title: "Origine de la propriété",
    items: [
      { label: "Attestation immobilière de propriété" },
      { label: "Déclaration de succession (cerfa 2705)" },
      { label: "Copie authentique du testament" },
    ],
  },
  {
    title: "Situation matrimoniale",
    items: [
      { label: "Copie intégrale de l'acte de mariage < 3 mois" },
      { label: "Livret de famille" },
      { label: "Attestation d'enregistrement PACS" },
    ],
  },
];

const sections = computed(() => {
  return selectedOption.value === "Appartement"
    ? sectionsAppartement
    : sectionsMaison;
});
</script>
<template>
  <div id="product-preview" class="product-preview">
    <UIHeaderCard
      title="Quel type de bien vendez-vous ?"
      icon="tree_structure"
      :color="colors['accent-color']"
      class="first-card"
    >
      <form class="form-start">
        <FormElementsRadioOption
          v-for="opt in radioOptions"
          :key="opt.id"
          :radioOption="opt"
          v-model="selectedOption"
          :error="optionsErrors[0]"
        />

        <NuxtLink
          to="/outils/checklist-dossier-vente-notaire/prealables"
          aria-label="Générer ma liste personnalisée"
          style="width: 100%; margin-top: 1rem"
          @click.prevent="
            pushChecklistStart('form');
            handleContinue();
          "
        >
          <UIPrimaryButton variant="accent-color" icon="arrow_right_bold">
            Continuer
          </UIPrimaryButton></NuxtLink
        >
      </form></UIHeaderCard
    >

    <div class="product-preview__column">
      <UIListPreview
        title="Documents à fournir à votre notaire"
        :sections="sections"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.product-preview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  align-items: center;
  height: fit-content;
  width: 100%;
  background: linear-gradient(rgba($accent-color, 0.1), transparent);
  margin: 0 auto;

  & .first-card {
    margin-top: -4rem;
  }

  @media (min-width: $big-tablet-screen) {
    margin-top: -4.5rem;
    padding: 4.5rem 2rem;
  }

  @media (min-width: $desktop-screen) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4.5rem 4rem;
    gap: 4rem;
    max-width: 2064px;

    & .first-card {
      justify-self: end;
      margin-top: -20rem;
    }
  }

  .form-start {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__column {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: $desktop-screen) {
      height: 100%;
      width: fit-content;
      margin-top: 2rem;
    }
  }
}
</style>
