<script setup lang="ts">
import { reactive, watch } from "vue";

import { buildDocDefinition } from "@/utils/docDefinitions.ts/pre-etat-date";
import formDefinition from "@/utils/formDefinition/pre-etat-date.json";
import { processDocument } from "@/utils/textFromDocument";

import { TS_TYPE_ExtractionPVAG } from "@/utils/extractionModels/pv-ag";
import { TS_TYPE_FicheSynthétiqueCopropriété } from "@/utils/extractionModels/fiche-synthetique-copropriete";
import { TS_TYPE_AttestationDePropriété } from "@/utils/extractionModels/attestation-de-propriete";

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
];

const formData = reactive({} as PreEtatDate);

const showFirstAction = ref(true);
const showFinalAction = ref(false);

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

async function generatePdf() {
  if (!process.client || !$pdfMake?.createPdf) return;
  const logo = await loadLogo();
  const doc = buildDocDefinition(formData, logo);
  $pdfMake.createPdf(doc).download("pre-etat-date.pdf");
}

const TS_TYPES: Record<string, string> = {
  TS_TYPE_ExtractionPVAG,
  TS_TYPE_FicheSynthétiqueCopropriété,
  TS_TYPE_AttestationDePropriété,
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
      <div class="pre-etat-date__headlines">
        <h1 class="pre-etat-date__headlines__title titles">
          Générateur de Pré-état daté gratuit
        </h1>
        <span class="pre-etat-date__headlines__subtitle subtitles"
          >Remplissez le formulaire pour créer rapidement un Pré-état daté
          valide
        </span>
      </div>

      <Transition>
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
        </div></Transition
      ><Transition>
        <FormElementsDynamicForm
          v-if="!showFirstAction && !showFinalAction"
          :formDefinition="formDefinition as FormDefinition"
          :suggestions
          v-model="formData"
          @complete="showFinalAction = true"
      /></Transition>
      <Transition>
        <div class="action" v-if="showFinalAction">
          <img
            class="action__image"
            src="@/assets/images/achievement-45.svg"
            alt="Avant de commencer"
          />
          <ul class="action__list">
            <span class="action__list__title">C'est prêt !</span>
            <span class="action__list__subtitle">
              Votre Pré-état daté est prêt à être téléchargé.
            </span>
            <TrustPilot />
            <div class="action__list__buttons">
              <UISecondaryButton
                variant="accent-color"
                icon="arrow_left"
                :reverse="true"
                @click="showFinalAction = false"
                @keydown.enter="showFinalAction = false"
                @keydown.space="showFinalAction = false"
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
        </div> </Transition
      ><Transition>
        <div class="action" v-if="showFinalAction">
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
            <li
              class="action__list__item"
              v-for="annexe in annexes"
              :key="annexe"
            >
              {{ annexe }}
            </li>
          </ul>
        </div>
      </Transition>
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
    margin-top: 2rem;
    gap: 4rem;
    height: 100%;
    align-items: center;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      text-align: center;
      text-wrap: balance;
    }

    &__subtitle {
      text-align: center;
      text-wrap: balance;
    }
  }
}

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
  scroll-margin-top: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 1.5rem;
    gap: 3rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
      min-height: 18.87rem;
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
