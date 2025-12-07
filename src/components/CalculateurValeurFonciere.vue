<script setup lang="ts">
import { ref, watch } from "vue";

import achievement from "/achievement-45.svg?url";

import { estimateFromForm, type ValuationResult } from "@/utils/calculateDVF";
import { buildDocDefinition } from "@/utils/docDefinitions/valeur-fonciere";

import formDefinition from "@/utils/formDefinition/valeur-fonciere.json";

import type { ValeurFonciere } from "@/utils/types/valeur-fonciere";
import type { FormDefinition } from "~/utils/types/forms";

const formData = reactive({} as ValeurFonciere);

formData.localisation = formData.localisation ?? {
  adresse: null,
};

formData.configuration = formData.configuration ?? {
  rdc: false,
};

formData.etat = formData.etat ?? {
  travaux: "0",
};

const showLastAction = ref(false);

// ⬇️ état DVF/estimation
const valuation = ref<ValuationResult>({
  records: [],
  avgPricePerSqmCarrez: null,
  avgPricePerSqmBatie: null,
  marketValue: null,
  factors: {
    renovation: 1,
    dpe: 1,
    downtown: 1,
    bonus: 1,
    malus: 1,
    groundFloor: 1,
  },
  inhabitantsNb: null,
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
  const city = formData.localisation?.adresse?.properties?.city;
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
  if (!formData.localisation?.adresse?.geometry?.coordinates) {
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
  const dLat = toRad(
    center.lat - formData.localisation.adresse.geometry.coordinates[1]
  );
  const dLng = toRad(
    center.lng - formData.localisation.adresse.geometry.coordinates[0]
  );
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(formData.localisation.adresse.geometry.coordinates[1])) *
      Math.cos(toRad(center.lat)) *
      Math.sin(dLng / 2) ** 2;
  const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // en mètres

  formData.is_downtown = distance <= 1500; // centre-ville si ≤ 1,5 km
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
  () => formData.localisation?.adresse,
  async (val) => {
    if (val) await checkDowntown();

    const ok = !!val?.properties?.label;
    if (ok) {
      await checkDowntown();
    }
  }
);
</script>
<template>
  <Transition>
    <FormElementsDynamicForm
      v-if="!showLastAction"
      :formDefinition="formDefinition as FormDefinition"
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
          v-if="valuation.estimatedValue"
          class="action__illustration__image"
          :src="achievement"
          alt="Avant de partir"
        />
      </div>
      <ul class="action__list">
        <template v-if="valuation.estimatedValue">
          <span class="action__list__title">
            {{ valuation.estimatedValue?.toLocaleString("fr-FR") }}
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
        </template>
        <template v-else>
          <span class="action__list__title">Estimation impossible</span>
          <span class="action__list__subtitle"
            >Les données renseignées ne permettent pas d'effectuer une
            estimation.</span
          >
          <span class="paragraphs"
            >Rééssayez éventuellement avec d'autres critères.</span
          ></template
        >

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
              v-if="valuation.estimatedValue"
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
    font-size: 1rem;
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
