<script setup lang="ts">
import { ref, watch } from "vue";
import { colors } from "@/utils/colors";

import achievement from "/achievement-45.svg?url";

import FormElementsLocationForm from "@/components/formElements/LocationForm.vue";

import { estimateFromForm, type ValuationResult } from "@/utils/calculateDVF";
import { buildDocDefinition } from "@/utils/docDefinitions/valeur-fonciere";

import formDefinition from "@/utils/formDefinition/valeur-fonciere.json";

import type { ValeurFonciere } from "@/utils/types/valeur-fonciere";

const formData = reactive({} as ValeurFonciere);

formData.configuration = formData.configuration ?? {
  rdc: false,
};

formData.etat = formData.etat ?? {
  travaux: "0",
};

const showFirstAction = ref(true);
const showLastAction = ref(false);

// ⬇️ état DVF/estimation
const valuation = ref<ValuationResult>({
  records: [],
  avgPricePerSqm: null,
  marketValue: null,
  factors: {
    renovation: 1,
    dpe: 1,
    downtown: 1,
    bonus: 1,
    malus: 1,
    groundFloor: 1,
  },
  estimatedValue: null,
  landValue: null,
  avgLandPricePerSqm: null,
  avgPricePerSqmWithoutLand: null,
});

const dvfLoading = ref(false);
const dvfError = ref<string | undefined>(undefined);

async function computeValuation() {
  dvfLoading.value = true;
  dvfError.value = undefined;
  try {
    valuation.value = await estimateFromForm(formData, {
      limit: 60,
      firstYear: 2014,
    });
  } catch (e: any) {
    dvfError.value = e?.message ?? "Erreur inconnue";
  } finally {
    dvfLoading.value = false;
  }
}

function onFormCompletion() {
  showLastAction.value = true;
  computeValuation();
}

async function findCityCenter() {
  const city = formData.adresse?.properties?.city;
  if (!city) return null;

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
      city
    )}&fields=centre&format=json`
  );

  const data = await res.json();
  if (!data?.[0]?.centre) return null;

  const { coordinates } = data[0].centre;
  return { lng: coordinates[0], lat: coordinates[1] };
}

async function checkDowntown() {
  if (!formData.adresse?.geometry?.coordinates) {
    formData.is_downtown = false;
    return;
  }
  const center = await findCityCenter();
  if (!center) {
    formData.is_downtown = false;
    return;
  }

  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(center.lat - formData.adresse.geometry.coordinates[1]);
  const dLng = toRad(center.lng - formData.adresse.geometry.coordinates[0]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(formData.adresse.geometry.coordinates[1])) *
      Math.cos(toRad(center.lat)) *
      Math.sin(dLng / 2) ** 2;
  const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // en mètres

  formData.is_downtown = distance <= 1500; // centre-ville si ≤ 1,5 km
}

function updateAddress(address: any) {
  formData.adresse = address;
}

const { $pdfMake } = useNuxtApp();
const ready = useState<boolean>("pdfmake-ready");

async function generatePdf() {
  // @ts-ignore
  if (!process.client || !$pdfMake?.createPdf) return;
  const logo = await loadLogo();
  const doc = buildDocDefinition(formData, valuation.value, logo);
  // @ts-ignore
  $pdfMake.createPdf(doc).download("estimation-valeur-fonciere.pdf");
}

watch(
  () => formData.adresse,
  async (val) => {
    if (val) await checkDowntown();
    showFirstAction.value = false;
  }
);
</script>
<template>
  <div class="action" v-if="showFirstAction">
    <div class="location">
      <label for="location-form-input" class="location-label"
        >Adresse du bien à estimer<UIIconComponent
          icon="asterisk"
          size="0.75rem"
          :color="colors['error-color']"
      /></label>
      <ClientOnly fallback="Chargement…">
        <FormElementsLocationForm @address="updateAddress"
      /></ClientOnly>
    </div>
  </div>

  <Transition>
    <FormElementsDynamicForm
      v-if="!showFirstAction && !showLastAction"
      :formDefinition="formDefinition"
      v-model="formData"
      :suggestions="[]"
      @complete="onFormCompletion"
  /></Transition>
  <div v-if="showLastAction" class="action">
    <StatusComponent
      v-if="dvfLoading"
      :status="dvfLoading ? 'processing' : dvfError ? 'failed' : 'completed'"
      :error="dvfError"
    />
    <template v-else-if="valuation">
      <div class="action__illustration">
        <img
          class="action__illustration__image"
          :src="achievement"
          alt="Avant de partir"
        />
      </div>
      <ul class="action__list">
        <span class="action__list__title">
          {{ valuation.estimatedValue?.toLocaleString("fr-FR") ?? "N/A" }}
          €</span
        >
        <span class="action__list__subtitle">Détails de l'estimation :</span>
        <li class="action__list__item">
          Valeur de base (hors décote/surcote):
          {{
            Math.round(valuation.marketValue ?? 0).toLocaleString("fr-FR") ??
            "N/A"
          }}
          €
        </li>
        <li class="action__list__item">
          Prix moyen/m²:
          {{
            Math.round(valuation.avgPricePerSqm ?? 0).toLocaleString("fr-FR") ??
            "N/A"
          }}
          €
        </li>

        <template v-if="valuation.landValue && valuation.landValue > 0">
          <li class="action__list__item">
            Valeur du terrain seul:
            {{ Math.round(valuation.landValue).toLocaleString("fr-FR") }}
            €
          </li>

          <li class="action__list__item">
            Valeur du bien + terrain:
            <strong>
              {{
                Math.round(
                  (valuation.estimatedValue ?? 0) + (valuation.landValue ?? 0)
                ).toLocaleString("fr-FR") ?? "N/A"
              }}
              €</strong
            >
          </li>
        </template>

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
              >Télécharger l'estimation complète</UIPrimaryButton
            ></ClientOnly
          >
        </div>
      </ul></template
    >
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/action.scss";

.location {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-size: $small-text;
    color: $text-color;
    font-weight: $regular;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
}
</style>
