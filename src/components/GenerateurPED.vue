<script setup lang="ts">
import { reactive, watch } from "vue";

import { buildDocDefinition } from "~/utils/docDefinitions/pre-etat-date";
import formDefinition from "@/utils/formDefinition/pre-etat-date.json";
import { processDocument } from "@/utils/textFromDocument";

import { TS_TYPE_ExtractionPVAG } from "@/utils/extractionModels/pv-ag";
import { TS_TYPE_FicheSynthétiqueCopropriété } from "@/utils/extractionModels/fiche-synthetique-copropriete";
import { TS_TYPE_AttestationDePropriété } from "@/utils/extractionModels/attestation-de-propriete";
import { TS_TYPE_ExtractionRIC } from "@/utils/extractionModels/releve-individuel-compte";
import { TS_TYPE_ExtractionEtatDettesCreances } from "@/utils/extractionModels/etat-dettes-creances";
import { TS_TYPE_ExtractionCAAA } from "@/utils/extractionModels/comptes-annuels-aprouves-annexes";
import { TS_TYPE_ExtractionTableauTravauxFinancements } from "@/utils/extractionModels/tableau-travaux-financement";

import { extractDataFromResults } from "@/utils/AIExtraction";

import type { PreEtatDate } from "@/utils/types/pre-etat-date-complet";
import type { FormDefinition } from "@/utils/types/forms";
import PrimaryButton from "~/components/UI/PrimaryButton.vue";

const annexes = [
  "Dernier procès-verbal d’assemblée générale approuvé.",
  "État daté des impayés du copropriétaire vendeur et des dettes envers le syndicat.",
  "Montant du fonds travaux (ALUR) et arrêté correspondant.",
  "Carnet d’entretien de l’immeuble.",
  "Diagnostic technique global (DTG) s’il existe.",
  "Budget prévisionnel voté et les comptes des deux derniers exercices.",
  "État des procédures en cours contre la copropriété.",
  "Copie du règlement de copropriété et état descriptif de division, à jour.",
  "Attestation d’assurance de l’immeuble.",
];

const documents = [
  "Dernier procès-verbal d’assemblée générale approuvé.",
  "Fiche synthétique de la copropriété.",
  "Attestation de propriété.",
  "Relevé individuel de compte.",
  "État des dettes et créances.",
  "Comptes annuels approuvés et annexes.",
  "Tableau des travaux et financements votés en AG.",
];

const formData = reactive({} as PreEtatDate);

const showFirstAction = ref(true);
const showLastAction = ref(false);

// prevent undefined during render/validation

formData.bien = formData.bien ?? {
  adresse: "",
  identification: { batiment: "", escalier: "", niveau: "", complements: "" },
  lots: [],
};
formData.bien.lots = Array.isArray(formData.bien.lots)
  ? formData.bien.lots
  : [];

formData.financier_lot ?? {
  arrete_au: "",
  solde_compte: 0,
  solde_crediteur_exercice_anterieur: 0,
  appels_echus_non_payes: 0,
  echeances_a_venir: [],
  sommes_dues_cedant: {
    generale: 0,
    travaux: 0,
    modalites_remboursement: "",
  },
  avances_provisions: {
    generale: 0,
    travaux: 0,
    modalites_remboursement: "",
  },
  charges: {
    N_1: {
      bp_appelee: 0,
      bp_reelle: 0,
      hb_appelee: 0,
      hb_reelle: 0,
    },
    N_2: {
      bp_appelee: 0,
      bp_reelle: 0,
      hb_appelee: 0,
      hb_reelle: 0,
    },
  },
  sommes_a_la_charge_acquereur_post_vente: {
    reconstitution_avances: {
      reserve: 0,
      provisions_speciales: 0,
      avances_emprunts: 0,
    },
    provisions_non_encore_exigibles: {
      budget_previsionnel: [],
      hors_budget: [],
    },
  },
};

const { $pdfMake } = useNuxtApp();
const ready = useState<boolean>("pdfmake-ready");

async function generatePdf() {
  //@ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  const logo = await loadLogo();
  const doc = buildDocDefinition(formData, logo);
  //@ts-ignore
  $pdfMake.createPdf(doc).download("pre-etat-date.pdf");
}

const TS_TYPES: Record<string, string> = {
  TS_TYPE_ExtractionPVAG,
  TS_TYPE_FicheSynthétiqueCopropriété,
  TS_TYPE_AttestationDePropriété,
  TS_TYPE_ExtractionRIC,
  TS_TYPE_ExtractionEtatDettesCreances,
  TS_TYPE_ExtractionCAAA,
  TS_TYPE_ExtractionTableauTravauxFinancements,
};

type AnyField = { path?: string; name?: string; TS_TYPE?: string };
const FIELD_BY_DOC_KEY: Record<string, AnyField> = {};
for (const sec of (formDefinition as any).sections ?? []) {
  for (const f of (sec.fields ?? []) as AnyField[]) {
    if (typeof f.path === "string" && f.path.startsWith("document.")) {
      const k = f.path.split(".")[1]; // ex: "dernier_pv_ag"
      FIELD_BY_DOC_KEY[k] = f;
    }
  }
}

function resolveTsTypeFor(key: string): string | null {
  const f = FIELD_BY_DOC_KEY[key];
  if (!f || !f.TS_TYPE) return null;
  return (
    TS_TYPES[f.TS_TYPE] ?? (typeof f.TS_TYPE === "string" ? f.TS_TYPE : null)
  );
}

type Row = { key: string; value: unknown };
const suggestions = ref<Row[]>([]);

function toRows(o: Record<string, any>): Row[] {
  return Object.entries(o).map(([key, value]) => ({ key, value }));
}

function upsertSuggestions(rows: Row[]) {
  const map = new Map(suggestions.value.map((r) => [r.key, r.value]));
  for (const r of rows) map.set(r.key, r.value); // remplace par clé
  suggestions.value = Array.from(map, ([key, value]) => ({ key, value }));
}

async function handleDocumentInfoExtraction(key: string, file: File) {
  const { results } = await processDocument(file);
  const TS_TYPE = resolveTsTypeFor(key);
  if (!TS_TYPE) return;

  const filledModel = await extractDataFromResults([], results, key, TS_TYPE);
  upsertSuggestions(toRows(filledModel || {}));
}

const seen = new Map<string, string>();
const fileSig = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;

watch(
  () => (formData as any).document,
  (docs) => {
    if (!docs) return;
    for (const [key, val] of Object.entries(docs as Record<string, unknown>)) {
      if (val instanceof File) {
        const sig = fileSig(val);
        if (seen.get(key) !== sig) {
          seen.set(key, sig); // nouvelle version → traite
          handleDocumentInfoExtraction(key, val);
        }
      } else if (val == null) {
        seen.delete(key); // clé vidée → oubli
      }
    }
  },
  { deep: true }
);
</script>
<template>
  <div class="action" v-if="showFirstAction">
    <img
      class="action__image"
      src="@/assets/images/checklist-71-blue.svg"
      alt="Avant de commencer"
    />

    <ul class="action__list">
      <span class="action__list__title">Avant de commencer...</span>
      <span class="action__list__subtitle"
        >Munissez-vous des documents (digitalisés) suivants:
      </span>
      <li
        v-for="document in documents"
        :key="document"
        class="action__list__item"
      >
        {{ document }}
      </li>
      <div class="action__list__buttons">
        <PrimaryButton
          icon="arrow_right"
          variant="accent-color"
          @click="showFirstAction = false"
          style="margin-top: 1rem"
          >Commencer</PrimaryButton
        >
      </div>
    </ul>
  </div>
  <FormElementsDynamicForm
    v-if="!showFirstAction && !showLastAction"
    :formDefinition="formDefinition as FormDefinition"
    :suggestions
    v-model="formData"
    @complete="showLastAction = true"
  />
  <div class="action" v-if="showLastAction">
    <img
      class="action__image"
      src="@/assets/images/achievement-45.svg"
      alt="Avant de partir"
    />
    <ul class="action__list">
      <span class="action__list__title">C'est prêt !</span>
      <span class="action__list__subtitle">
        Votre Pré-état daté est prêt à être téléchargé.
      </span>
      <TrustPilot style="margin-top: auto" />
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
        <UIPrimaryButton
          @click="generatePdf()"
          :disabled="!ready"
          variant="accent-color"
          icon="download"
          >Télécharger le Pré-état daté</UIPrimaryButton
        >
      </div>
    </ul>
  </div>
  <div class="action" v-if="showLastAction">
    <img
      class="action__image"
      src="@/assets/images/files-and-folder-78.svg"
      alt="Avant de commencer"
    />
    <ul class="action__list">
      <span class="action__list__title"> Avant de partir...</span>
      <span class="action__list__subtitle">
        Documents à joindre en annexe de votre pré-état daté
      </span>
      <li class="action__list__item" v-for="annexe in annexes" :key="annexe">
        {{ annexe }}
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.action {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;
  border-radius: $radius;
  background-color: $primary-color;
  width: 100%;
  min-width: 280px;
  min-height: 21.87rem;
  scroll-margin-top: 4rem;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 3rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: 32rem;
  }

  &__image {
    width: 100%;
    max-width: 300px;
    height: 100%;
  }

  &__list {
    width: 100%;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
    min-height: 100%;
    max-width: 25rem;

    @media (min-width: $laptop-screen) {
      min-height: 27rem;
      max-width: 50rem;
    }

    &__title {
      font-size: 2.5rem;
      font-weight: $semi-bold;
      text-wrap: balance;
      max-width: 600px;
    }

    &__subtitle {
      font-size: 1.25rem;
      font-weight: $regular;
      text-wrap: balance;
      margin-bottom: 1rem;
    }

    &__item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 1.05rem;
      text-wrap: balance;

      &::before {
        content: "";
        display: inline-block;
        height: 1rem;
        width: 1rem;
        min-width: 1rem;
        border: 1px solid $text-color;
      }
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: auto;

      @media (min-width: $laptop-screen) {
        flex-direction: row;
      }
    }
  }
}
</style>
