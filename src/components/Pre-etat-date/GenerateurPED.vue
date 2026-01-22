<script setup lang="ts">
import { reactive, watch, watchEffect, onMounted, computed, ref } from "vue";

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

import { TS_TYPE_ExtractionPVAG } from "@/utils/extractionModels/pv-ag";
import { TS_TYPE_FicheSynthétiqueCopropriété } from "@/utils/extractionModels/fiche-synthetique-copropriete";
import { TS_TYPE_AttestationDePropriété } from "@/utils/extractionModels/attestation-de-propriete";
import { TS_TYPE_EtatDesSoldesCopropriétaires } from "@/utils/extractionModels/etat-soldes-copro";
import { TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs } from "@/utils/extractionModels/liste-coproprietaires-debiteurs-crediteurs";

import { extractDataFromResults } from "@/utils/AIExtraction";

import type { PreEtatDate } from "@/types/pre-etat-date-complet";
import type { FormDefinition } from "@/types/forms";
import type { ISODate } from "@/types/pre-etat-date-complet";

const props = defineProps<{
  sectionId?: string;
}>();

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

const sectionGroups: Record<string, FormDefinition> = {
  documents: justificatifsDefinition as FormDefinition,
  bien: bienDefinition as FormDefinition,
  copropriete: coproprieteDefinition as FormDefinition,
  syndic: syndicDefinition as FormDefinition,
  financier_lot: situationFinanciereLotDefinition as FormDefinition,
  financier_lot_sommes_dues_cedant: sommesDuesCedantDefinition as FormDefinition,
  financier_lot_sommes_debiteur_syndic: sommesDuesSyndicDefinition as FormDefinition,
  financier_lot_sommes_a_la_charge_acquereur_post_vente:
    sommesChargeAcquereurDefinition as FormDefinition,
  financier_lot_autres: autresSommesDefinition as FormDefinition,
};

const fullFormDefinition: FormDefinition = {
  title: "Pré-état daté",
  sections: sectionDefinitions.flatMap((def) => def.sections || []),
};

const activeFormDefinition = computed<FormDefinition>(() => {
  if (!props.sectionId) return fullFormDefinition;
  const group = sectionGroups[props.sectionId];
  if (!group?.sections?.length) {
    console.error(
      "[GenerateurPED] unknown sectionId, no definition found:",
      props.sectionId,
    );
    return { title: "Section inconnue", sections: [] };
  }
  return { ...group, sections: group.sections };
});

const formData = reactive({} as PreEtatDate);

const LOCAL_STORAGE_KEY = "sn-pre-etat-date";
let persistTimer: ReturnType<typeof setTimeout> | null = null;

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

const TS_TYPES: Record<string, string> = {
  TS_TYPE_ExtractionPVAG,
  TS_TYPE_FicheSynthétiqueCopropriété,
  TS_TYPE_AttestationDePropriété,
  TS_TYPE_EtatDesSoldesCopropriétaires,
  TS_TYPE_Liste_Coproprietaires_Debiteurs_Crediteurs,
};

type AnyField = { path?: string; name?: string; TS_TYPE?: string };
const FIELD_BY_DOC_KEY: Record<string, AnyField> = {};
for (const sec of (fullFormDefinition as any).sections ?? []) {
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
          seen.set(key, sig); // nouvelle version â†’ traite
          handleDocumentInfoExtraction(key, val);
        }
      } else if (val == null) {
        seen.delete(key); // clé vidée â†’ oubli
      }
    }
  },
  { deep: true },
);

const hydrateFromStorage = () => {
  if (!process.client) return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(formData, parsed);
  } catch (e) {
    console.warn("[GenerateurPED] unable to hydrate from storage", e);
  }
};

const persistSnapshot = () => {
  if (!process.client) return;
  try {
    const payload = {
      ...formData,
      adresse_bien: formData.bien?.adresse || undefined,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("[GenerateurPED] unable to persist data", e);
  }
};

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
const onComplete = () => {
  navigateTo("/outils/pre-etat-date");
};
</script>
<template>
  <FormElementsDynamicForm
    :formDefinition="activeFormDefinition as FormDefinition"
    :suggestions="suggestions"
    v-model="formData"
    @complete="onComplete"
  />
</template>
