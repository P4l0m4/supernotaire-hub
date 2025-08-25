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

const questions = [
  {
    title: "Combient coûte le service de génération de Pré-état daté ?",
    answer:
      "Vous pouvez utiliser Supernotaire.fr pour créer un Pré-état daté gratuitement (pour le moment). Habituellement, un Pré-état daté coûte entre 150 et 300 euros lorsqu'il est réalisé par un professionnel.",
  },
  {
    title: "Le Pré-état daté généré est-il conforme aux exigences légales ?",
    answer:
      "Oui, le Pré-état daté généré sur Supernotaire est conforme aux exigences légales en vigueur. Nous nous assurons que toutes les informations nécessaires sont incluses, mais il est toujours recommandé de faire vérifier le document par un professionnel avant de l'utiliser.",
  },
  {
    title: "Quels documents dois-je fournir pour générer un Pré-état daté ?",
    answer:
      "Le Carnet d’entretien de l’immeuble, le dernier procès-verbal d’assemblée générale, l’état des impayés, et d’autres documents listés dans le formulaire sont nécessaires pour générer un Pré-état daté complet et précis.",
  },
  {
    title:
      "Puis-je modifier les informations avant de générer le Pré-état daté ?",
    answer:
      "Oui, vous pouvez revenir en arrière à tout moment pour modifier les informations saisies dans le formulaire avant de générer le Pré-état daté. Assurez-vous que toutes les informations sont correctes et à jour avant de finaliser le document.",
  },
  {
    title: "Le service de création de Pré-état daté est-il sécurisé ? ",
    answer:
      "Nous prenons la sécurité de vos données très au sérieux, c'est pourquoi aucune des informations et documents que vous fournissez ne sont stockés ni partagés à des tiers.",
  },
  {
    title: "Comment sont utilisés les documents que je télécharge ?",
    answer:
      "Les documents que vous téléchargez sont utilisés uniquement pour extraire les informations nécessaires pour vous guider lors de la création du Pré-état daté. Ils sont supprimés immédiatement après le traitement.",
  },
  {
    title: "À qui s'adresse ce service de génération de Pré-état daté ?",
    answer:
      "Ce service est destiné aux vendeurs de biens immobiliers, notaires, syndics de copropriété, et autres professionnels de l'immobilier qui ont besoin de générer rapidement et efficacement des Pré-états datés dans le cadre d'une vente immobilière.",
  },
  {
    title: "Puis-je utiliser ce service pour plusieurs biens immobiliers ?",
    answer:
      "Oui, vous pouvez utiliser Supernotaire pour générer des Pré-états datés pour plusieurs biens immobiliers. Il vous suffit de remplir un nouveau formulaire pour chaque bien.",
  },
  {
    title: "Combien de temps faut-il pour générer un Pré-état daté ?",
    answer:
      "Le processus de génération du Pré-état daté est généralement rapide et peut être complété en quelques minutes, en fonction de la rapidité avec laquelle vous fournissez les informations et documents nécessaires. Nous avons optimisé le processus pour vous faire gagner du temps grâce à un système de suggestions intelligentes à partir des informations trouvées dans vos documents.",
  },
  {
    title: "Quels documents joindre au Pré-état daté ?",
    answer:
      "Une fois le Pré-état daté généré, vous devez y joindre plusieurs annexes au document: le dernier procès-verbal d’assemblée générale, l’état daté des impayés, le montant du fonds travaux, le carnet d’entretien de l’immeuble, le diagnostic technique global (DTG) s’il existe, le budget prévisionnel voté et les comptes des deux derniers exercices, l’état des procédures en cours contre la copropriété, la copie du règlement de copropriété et état descriptif de division à jour, ainsi que l’attestation d’assurance de l’immeuble. ",
  },
  {
    title: "Pourquoi ai-je besoin d'un Pré-état daté ?",
    answer:
      "Le Pré-état daté est un document essentiel dans le cadre de la vente d'un bien en copropriété. Il informe l'acheteur et le notaire sur la situation financière et administrative de la copropriété, ce qui est crucial pour prendre une décision éclairée.",
  },
  {
    title: "Pourquoi utiliser Supernotaire pour générer un Pré-état daté ?",
    answer:
      "Supernotaire simplifie et accélère le processus de création du Pré-état daté grâce à son interface intuitive et ses fonctionnalités intelligentes. Nous vous guidons pour que vous puissiez créer votre document en toute simplicité.Vous gagnez du temps et réduisez les risques d'erreurs en utilisant notre service.",
  },
];

const jsonLDFAQ = questions.map((question) => {
  return {
    "@type": "Question" as const,
    name: question.title,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: question.answer,
    },
  };
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage" as const,
  mainEntity: jsonLDFAQ,
}));

useHead({
  title: "Supernotaire | Questions sur le Pré-état daté",
  meta: [
    {
      name: "description",
      content:
        "Retrouvez les réponses aux questions les plus fréquentes sur le Pré-état daté.",
    },
  ],
});
</script>

<template>
  <Container>
    <div class="pre-etat-date">
      <h1 class="pre-etat-date__title titles">
        Générateur de Pré-état daté gratuit
      </h1>
      <span class="pre-etat-date__subtitle paragraphs"
        >Remplissez le formulaire pour générer rapidement un Pré-état daté
        valide
      </span>

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

  <Container>
    <div class="faq">
      <div class="faq__headlines">
        <h2 class="titles">Questions fréquentes sur le Pré-état daté</h2>
        <h3 class="subtitles">
          Tarif, délais, validité, documents à fournir, etc.
        </h3>
      </div>

      <FAQComponent :questions />
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
    height: 100%;
    align-items: center;
  }

  &__title {
    text-align: center;
    text-wrap: balance;
  }

  &__subtitle {
    text-align: center;
    text-wrap: balance;
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
