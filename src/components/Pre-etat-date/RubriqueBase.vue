<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import justificatifsDefinition from "@/utils/formDefinition/pre-etat-date/justificatifs.json";
import bienDefinition from "@/utils/formDefinition/pre-etat-date/bien.json";
import coproprieteDefinition from "@/utils/formDefinition/pre-etat-date/copropriete.json";
import syndicDefinition from "@/utils/formDefinition/pre-etat-date/syndic.json";
import situationFinanciereLotDefinition from "@/utils/formDefinition/pre-etat-date/situation-financiere-lot.json";
import sommesDuesCedantDefinition from "@/utils/formDefinition/pre-etat-date/sommes-dues-cedant.json";
import sommesDuesSyndicDefinition from "@/utils/formDefinition/pre-etat-date/sommes-dues-syndic.json";
import sommesChargeAcquereurDefinition from "@/utils/formDefinition/pre-etat-date/sommes-charge-acquereur.json";
import autresSommesDefinition from "@/utils/formDefinition/pre-etat-date/autres-sommes.json";
import { processDocument } from "@/utils/textFromDocument";
import { extractDataFromResults } from "@/utils/AIExtraction";

import { TS_TYPE_ExtractionPVAG } from "@/utils/extractionModels/pv-ag";
import { TS_TYPE_FicheSynthétiqueCopropriété } from "@/utils/extractionModels/fiche-synthetique-copropriete";
import { TS_TYPE_AttestationDePropriété } from "@/utils/extractionModels/attestation-de-propriete";
import { TS_TYPE_EtatDesSoldesCopropriétaires } from "@/utils/extractionModels/etat-soldes-copro";
import { TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs } from "@/utils/extractionModels/liste-coproprietaires-debiteurs-crediteurs";

import type { PreEtatDate } from "@/types/pre-etat-date-complet";
import type { FormDefinition } from "@/types/forms";
import type { ISODate } from "@/types/pre-etat-date-complet";

type SectionId =
  | "documents"
  | "bien"
  | "copropriete"
  | "syndic"
  | "financier_lot"
  | "financier_lot_sommes_dues_cedant"
  | "financier_lot_sommes_debiteur_syndic"
  | "financier_lot_sommes_a_la_charge_acquereur_post_vente"
  | "financier_lot_autres";

const props = defineProps<{
  sectionId: SectionId;
  title: string;
  subtitle?: string;
  formDefinition: FormDefinition;
}>();

const subtitle = computed(
  () =>
    props.subtitle ||
    "Complétez les informations de cette rubrique. Vos données restent stockées localement.",
);

const STORAGE_KEY = "sn-pre-etat-date";
const formData = reactive({} as PreEtatDate);
const lastValidSnapshot = ref<PreEtatDate | null>(null);
const isHydrated = ref(false);
const suggestions = ref<Array<{ key: string; value: unknown }>>([]);

const TS_TYPES: Record<string, string> = {
  TS_TYPE_ExtractionPVAG,
  TS_TYPE_FicheSynthétiqueCopropriété,
  TS_TYPE_AttestationDePropriété,
  TS_TYPE_EtatDesSoldesCopropriétaires,
  TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs,
};

const sectionDefinitions: FormDefinition[] = [
  justificatifsDefinition as FormDefinition,
  bienDefinition as FormDefinition,
  coproprieteDefinition as FormDefinition,
  syndicDefinition as FormDefinition,
  situationFinanciereLotDefinition as FormDefinition,
  sommesDuesCedantDefinition as FormDefinition,
  sommesDuesSyndicDefinition as FormDefinition,
  sommesChargeAcquereurDefinition as FormDefinition,
  autresSommesDefinition as FormDefinition,
];

const fullFormDefinition: FormDefinition = {
  title: "Pré-état daté",
  sections: sectionDefinitions.flatMap((def) => def.sections || []),
};

type AnyField = { path?: string; name?: string; TS_TYPE?: string };
const FIELD_BY_DOC_KEY: Record<string, AnyField> = {};
for (const sec of (fullFormDefinition as any).sections ?? []) {
  for (const f of (sec.fields ?? []) as AnyField[]) {
    if (typeof f.path === "string" && f.path.startsWith("documents.")) {
      const k = f.path.split(".")[1];
      FIELD_BY_DOC_KEY[k] = f;
    }
  }
}

const seen = new Map<string, string>();
const fileSig = (f: File) => `${f.name}|${f.size}|${f.lastModified}`;

const cloneData = <T = any,>(data: T): T =>
  JSON.parse(JSON.stringify(data ?? {}));

const ensureSectionContainer = () => {
  const target = (formData as any)[props.sectionId] ?? {};
  (formData as any)[props.sectionId] = target;
  return target as Record<string, any>;
};

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

function resolveTsTypeFor(key: string): string | null {
  const f = FIELD_BY_DOC_KEY[key];
  if (!f || !f.TS_TYPE) return null;
  return (
    TS_TYPES[f.TS_TYPE] ?? (typeof f.TS_TYPE === "string" ? f.TS_TYPE : null)
  );
}

function toRows(o: Record<string, any>) {
  return Object.entries(o).map(([key, value]) => ({ key, value }));
}

function upsertSuggestions(rows: Array<{ key: string; value: unknown }>) {
  const map = new Map(suggestions.value.map((r) => [r.key, r.value]));
  for (const r of rows) map.set(r.key, r.value);
  suggestions.value = Array.from(map, ([key, value]) => ({ key, value }));
}

async function handleDocumentInfoExtraction(key: string, file: File) {
  const { results } = await processDocument(file);
  const TS_TYPE = resolveTsTypeFor(key);
  if (!TS_TYPE) return;

  const nomVendeur = formData.documents?.vendeur_nom || "";
  const clues = [`Le nom du vendeur est : ${nomVendeur}.`].filter(
    (c) => c.trim().length > 0,
  );

  const filledModel = await extractDataFromResults(
    [],
    results,
    key,
    TS_TYPE,
    clues,
  );

  upsertSuggestions(toRows(filledModel || {}));
}

watch(
  () => (formData as any).documents,
  (docs) => {
    if (!docs) return;
    for (const [key, val] of Object.entries(docs as Record<string, unknown>)) {
      if (val instanceof File) {
        const sig = fileSig(val);
        if (seen.get(key) !== sig) {
          seen.set(key, sig);
          handleDocumentInfoExtraction(key, val);
        }
      } else if (val == null) {
        seen.delete(key);
      }
    }
  },
  { deep: true },
);

const hydrateFromStorage = () => {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      Object.assign(formData, parsed);
      lastValidSnapshot.value = cloneData(parsed);
    }
  } catch (e) {
    console.warn("[RubriqueBase] unable to hydrate from storage", e);
  } finally {
    isHydrated.value = true;
  }
};

const persistSnapshot = (data: PreEtatDate = formData) => {
  if (!process.client) return;
  try {
    const payload = {
      ...data,
      adresse_bien: data.bien?.adresse || undefined,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("[RubriqueBase] unable to persist data", e);
  }
};

let persistTimer: ReturnType<typeof setTimeout> | null = null;
const schedulePersist = () => {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persistSnapshot();
    persistTimer = null;
  }, 300);
};

onMounted(() => {
  hydrateFromStorage();
});

watch(
  formData,
  () => {
    schedulePersist();
  },
  { deep: true },
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
  const parEcheance = annuelLot / 4;

  const echeances = dates.map((d) => ({
    date: d,
    montant: Number(parEcheance.toFixed(2)),
  }));

  upsertSuggestions([{ key: "echeances_a_venir", value: echeances }]);

  formData.financier_lot = formData.financier_lot || ({} as any);
  formData.financier_lot.echeances_a_venir = echeances;
}

watchEffect(() => {
  void suggestions.value.length;
  recomputeEcheances();
});

const onComplete = () => {
  const target = ensureSectionContainer();
  target.__completed = true;
  const snapshot = cloneData(formData);
  lastValidSnapshot.value = snapshot;
  persistSnapshot(snapshot);
  navigateTo("/outils/pre-etat-date");
};

const onValidState = (payload: { isValid: boolean; model: any }) => {
  if (!isHydrated.value) return;
  const target = ensureSectionContainer();
  if (!payload?.isValid) {
    if (target.__completed) {
      target.__completed = false;
    }
    persistSnapshot(cloneData(formData));
    return;
  }
  const currentCompleted = target.__completed === true;
  const snapshot = cloneData(payload.model || {});
  if (currentCompleted) {
    const nextTarget = props.sectionId
      ? ((snapshot as any)[props.sectionId] ??= {})
      : (snapshot as any);
    nextTarget.__completed = true;
  }
  lastValidSnapshot.value = snapshot;
  persistSnapshot(snapshot);
};
</script>

<template>
  <div class="rubrique">
    <div class="rubrique__header">
      <h1 class="titles">{{ title }}</h1>
      <p class="subtitles">{{ subtitle }}</p>
    </div>

    <div class="rubrique__actions">
      <NuxtLink to="/outils/pre-etat-date" aria-label="Retour aux rubriques">
        <UITertiaryButton icon="arrow_left" direction="row-reverse">
          Retour aux rubriques
        </UITertiaryButton>
      </NuxtLink>
    </div>
    <div class="rubrique__form">
      <FormElementsDynamicForm
        :formDefinition="formDefinition"
        :suggestions="suggestions"
        v-model="formData"
        @complete="onComplete"
        @valid-state="onValidState"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/rubriques.scss";
</style>
