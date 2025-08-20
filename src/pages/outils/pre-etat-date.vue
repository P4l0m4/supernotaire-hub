<script setup lang="ts">
import { reactive } from "vue";

import { buildDocDefinition } from "@/utils/docDefinitions.ts/pre-etat-date";
import formDefinition from "@/utils/formDefinition/pre-etat-date.json";

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
</script>

<template>
  <Container>
    <div class="pre-etat-date">
      <h1 class="pre-etat-date__title">Générateur de Pré-état daté en ligne</h1>
      <span class="pre-etat-date__subtitle"
        >Remplissez le formulaire suivant pour générer un Pré-état daté
        conforme</span
      >

      <FormelementsDynamicForm
        v-if="!showFinalAction"
        :formDefinition="formDefinition as FormDefinition"
        v-model="formData"
        @complete="showFinalAction = true"
      />
      <div class="final-action" v-if="showFinalAction">
        <PrimaryButton
          @click="generatePdf()"
          :disabled="!ready"
          variant="success-color"
          icon="download"
          >Télécharger le Pré-état daté</PrimaryButton
        ><TertiaryButton
          variant="text-color"
          @click="showFinalAction = false"
          @keydown.enter="showFinalAction = false"
          @keydown.space="showFinalAction = false"
        >
          Revenir au formulaire
        </TertiaryButton>
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
    margin-top: 4rem;
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
