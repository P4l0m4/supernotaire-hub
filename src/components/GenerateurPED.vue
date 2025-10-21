<script setup lang="ts">
import { reactive, watch, watchEffect } from "vue";

import achievement from "/achievement-45.svg?url";
import checklist from "/checklist-71-blue.svg?url";
import filesAndFolder from "/files-and-folder-78.svg?url";

import { buildDocDefinition } from "~/utils/docDefinitions/pre-etat-date";
import formDefinition from "@/utils/formDefinition/pre-etat-date.json";
import { processDocument } from "@/utils/textFromDocument";

import { TS_TYPE_ExtractionPVAG } from "@/utils/extractionModels/pv-ag";
import { TS_TYPE_FicheSynthétiqueCopropriété } from "@/utils/extractionModels/fiche-synthetique-copropriete";
import { TS_TYPE_AttestationDePropriété } from "@/utils/extractionModels/attestation-de-propriete";
import { TS_TYPE_EtatDesSoldesCopropriétaires } from "@/utils/extractionModels/etat-soldes-copro";
import { TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs } from "@/utils/extractionModels/liste-coproprietaires-debiteurs-crediteurs";

import { extractDataFromResults } from "@/utils/AIExtraction";

import type { PreEtatDate } from "@/utils/types/pre-etat-date-complet";
import type { FormDefinition } from "@/utils/types/forms";
import type { ISODate } from "@/utils/types/pre-etat-date-complet";

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
  "Dernier procès-verbal d’assemblée générale",
  "Fiche synthétique de la copropriété",
  "Attestation de propriété",
  "État des soldes des copropriétaires",
  "Grand Livre des comptes",
  "Avant dernier et avant-avant dernier compte de gestion pour travaux et opérations exceptionnelles",
  "Dernier et avant dernier compte de gestion pour opérations courantes et budget prévisionnel",
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
  TS_TYPE_EtatDesSoldesCopropriétaires,
  TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs,
};

type AnyField = { path?: string; name?: string; TS_TYPE?: string };
const FIELD_BY_DOC_KEY: Record<string, AnyField> = {};
for (const sec of (formDefinition as any).sections ?? []) {
  for (const f of (sec.fields ?? []) as AnyField[]) {
    if (typeof f.path === "string" && f.path.startsWith("documents.")) {
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

  // clues to help the AI focus on relevant info inside a document

  const nomVendeur = formData.documents?.vendeur_nom || "";

  const clues = [`Le nom du vendeur est : ${nomVendeur}.`].filter(
    (c) => c.trim().length > 0
  );

  const filledModel = await extractDataFromResults(
    [],
    results,
    key,
    TS_TYPE,
    clues
  );

  upsertSuggestions(toRows(filledModel || {}));
}

const seen = new Map<string, string>();
const fileSig = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;

watch(
  () => (formData as any).documents,
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

function getSuggestion<T = any>(k: string): T | undefined {
  const row = suggestions.value.find((r) => r.key === k);
  return row?.value as T | undefined;
}

function recomputeEcheances() {
  const bpVote = getSuggestion<number>("montant_dernier_bp_vote");
  const dates = getSuggestion<ISODate[]>("dates_echeances_a_venir");

  const tantiemesVendeur = formData.bien?.total_tantiemes_vendeur;
  const totalTantiemes = formData.bien?.total_tantiemes_copropriete;

  if (!bpVote) return;
  if (!Array.isArray(dates) || dates.length === 0) return;
  if (!tantiemesVendeur || !totalTantiemes) return;

  const annuelLot = bpVote * (tantiemesVendeur / totalTantiemes);
  const parEcheance = annuelLot / 4; // trimestriel

  const echeances = dates.map((d) => ({
    date: d, // "jj-mm-aaaa"
    montant: Number(parEcheance.toFixed(2)),
  }));

  upsertSuggestions([{ key: "echeances_a_venir", value: echeances }]);

  formData.financier_lot = formData.financier_lot || ({} as any);
  formData.financier_lot.echeances_a_venir = echeances;
}

// recalcul automatique dès que suggestions OU formData (tantièmes...) change
watchEffect(() => {
  void suggestions.value.length;

  recomputeEcheances();
});
</script>
<template>
  <div class="action" v-if="showFirstAction">
    <div class="action__illustration">
      <img
        class="action__illustration__image"
        :src="checklist"
        alt="Avant de commencer"
      />
    </div>

    <ol class="action__list">
      <span class="action__list__title">Avant de commencer...</span>
      <span class="action__list__subtitle"
        >Munissez-vous des documents (digitalisés) suivants:
      </span>
      <li
        v-for="(document, i) in documents"
        :key="document"
        class="action__list__item"
      >
        <span class="action__list__item__number">{{ i + 1 }}</span>
        {{ document }}
      </li>
      <div class="action__list__buttons">
        <UIPrimaryButton
          icon="arrow_right"
          variant="accent-color"
          @click="showFirstAction = false"
          >Commencer</UIPrimaryButton
        >
      </div>
    </ol>
  </div>

  <FormElementsDynamicForm
    v-if="!showFirstAction && !showLastAction"
    :formDefinition="formDefinition as FormDefinition"
    :suggestions="suggestions"
    v-model="formData"
    @complete="showLastAction = true"
  />
  <div class="action" v-if="showLastAction">
    <div class="action__illustration">
      <img
        class="action__illustration__image"
        :src="achievement"
        alt="Avant de partir"
      />
    </div>
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
        <ClientOnly>
          <UIPrimaryButton
            @click="generatePdf()"
            :disabled="!ready"
            variant="accent-color"
            icon="download"
            >Télécharger le Pré-état daté</UIPrimaryButton
          ></ClientOnly
        >
      </div>
    </ul>
  </div>
  <div class="action" v-if="showLastAction">
    <div class="action__illustration">
      <img
        class="action__illustration__image"
        :src="filesAndFolder"
        alt="Avant de commencer"
      />
    </div>
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
@import "@/styles/action.scss";
</style>
