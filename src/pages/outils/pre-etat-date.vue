<script setup lang="ts">
import { reactive, watch } from "vue";

import { buildDocDefinition } from "@/utils/docDefinitions.ts/pre-etat-date";
import formDefinition from "@/utils/formDefinition/pre-etat-date.json";
import { processDocument } from "@/utils/textFromDocument";

import { TS_TYPE_ExtractionPVAG } from "@/utils/extractionModels/pv-ag";
import { TS_TYPE_FicheSynthétiqueCopropriété } from "@/utils/extractionModels/fiche-synthetique-copropriete";

import { extractDataFromResults } from "@/utils/AIExtraction";

import type { PreEtatDate } from "@/utils/types/pre-etat-date-complet";
import type { FormDefinition } from "@/utils/types/forms";

const documentsList = [
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

const formData = reactive({} as PreEtatDate);

formData.bien = formData.bien ?? {
  adresse: "",
  identification: { batiment: "", escalier: "", niveau: "", complements: "" },
  lots: [],
};
formData.bien.lots = Array.isArray(formData.bien.lots)
  ? formData.bien.lots
  : [];

const { $pdfMake } = useNuxtApp();
const ready = useState<boolean>("pdfmake-ready");
const showFinalAction = ref(false);

async function generatePdf() {
  if (!process.client || !$pdfMake?.createPdf) return;
  const logo = await loadLogo();
  const doc = buildDocDefinition(formData, logo);
  $pdfMake.createPdf(doc).download("pre-etat-date.pdf");
}

const TS_TYPES: Record<string, string> = {
  TS_TYPE_ExtractionPVAG,
  TS_TYPE_FicheSynthétiqueCopropriété,
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
  <Container>
    <div class="pre-etat-date">
      <h1 class="pre-etat-date__title">Générateur de Pré-état daté en ligne</h1>
      <span class="pre-etat-date__subtitle"
        >Remplissez le formulaire suivant pour générer un Pré-état daté
        conforme</span
      >

      <FormElementsDynamicForm
        v-if="!showFinalAction"
        :formDefinition="formDefinition as FormDefinition"
        :suggestions
        v-model="formData"
        @complete="showFinalAction = true"
      />
      <div class="final-action" v-if="showFinalAction">
        <UIPrimaryButton
          @click="generatePdf()"
          :disabled="!ready"
          variant="success-color"
          icon="download"
          >Télécharger le Pré-état daté</UIPrimaryButton
        ><UITertiaryButton
          variant="text-color"
          @click="showFinalAction = false"
          @keydown.enter="showFinalAction = false"
          @keydown.space="showFinalAction = false"
        >
          Revenir au formulaire
        </UITertiaryButton>
        <div class="pre-etat-date__list">
          <h2 class="pre-etat-date__list__title">
            Documents à joindre à votre pré-état daté
          </h2>
          <ul>
            <li v-for="document in documentsList" :key="document">
              {{ document }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Container>
</template>
<style scoped lang="scss">
.pre-etat-date {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 0 2rem;
    margin-top: 2rem;
  }

  &__title {
    color: $text-color;
    font-size: 1.4rem;
    font-weight: $semi-bold;
    text-align: center;
    text-wrap: balance;
  }

  &__subtitle {
    text-align: center;
    text-wrap: balance;
    font-size: 1rem;
    font-weight: $regular;
    margin-top: -1rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 1rem;
    color: $text-color;
    font-weight: $regular;

    &__title {
      font-size: 1.2rem;
      font-weight: $regular;
    }

    & ul {
      list-style-position: inside;
      font-size: 1rem;
      color: $text-color;
      font-weight: $regular;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}

.final-action {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 2rem;
  border-radius: $radius;
  background-color: $primary-color;
  width: 100%;
  min-width: 280px;
  scroll-margin-top: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 3rem;
  }
}
</style>
