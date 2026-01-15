<script setup lang="ts">
import { onMounted, ref } from "vue";
import { colors } from "@/utils/colors";
import { useExportAccess } from "@/composables/useExportAccess";

type RubriqueId =
  | "prealables"
  | "identite"
  | "situation"
  | "charges-taxes"
  | "copro"
  | "occupation"
  | "origine"
  | "capacite"
  | "pro-fiscale"
  | "urbanisme"
  | "diagnostics-travaux-interieurs";

type RubriqueCard = {
  id: RubriqueId;
  title: string;
  subtitle: string;
  premium?: boolean;
};

const cards: RubriqueCard[] = [
  {
    id: "prealables",
    title: "Informations préalables",
    subtitle: "Type de bien, présence d'un terrain et titre d'occupation.",
  },
  {
    id: "identite",
    title: "Identité & État civil",
    subtitle: "Identité, état civil, coordonnées et justificatifs de base.",
  },
  {
    id: "situation",
    title: "Situation matrimoniale",
    subtitle:
      "Régime matrimonial, contrat de mariage ou PACS, séparations, enfants.",
  },
  {
    id: "charges-taxes",
    title: "Charges & Taxes",
    subtitle:
      "Chauffage, assainissement, situation fiscale (taxes foncière/habitation).",
  },
  {
    id: "pro-fiscale",
    title: "Situation professionnelle & Fiscale",
    subtitle: "Activité pro, revenus, imposition, patrimoine financier.",
  },
  {
    id: "copro",
    title: "Copropriété & Structures collectives",
    subtitle: "Syndic/ASL, compteurs individuels, documents de copropriété.",
    premium: true,
  },
  {
    id: "occupation",
    title: "Occupation actuelle",
    subtitle: "Occupation du bien, occupant, bail et jalons clés.",
    premium: true,
  },
  {
    id: "origine",
    title: "Origine de propriété",
    subtitle: "Mode d'acquisition et actes correspondants.",
    premium: true,
  },
  {
    id: "capacite",
    title: "Capacité & Représentation",
    subtitle: "Capacité juridique, protections et pouvoirs pour signer.",
    premium: true,
  },
  {
    id: "urbanisme",
    title: "Urbanisme & Travaux extérieurs",
    subtitle:
      "Autorisations d'urbanisme, travaux réalisés, informations cadastrales.",
    premium: true,
  },
  {
    id: "diagnostics-travaux-interieurs",
    title: "Diagnostics & Travaux intérieurs",
    subtitle: "Diagnostics obligatoires et travaux intérieurs réalisés.",
    premium: true,
  },
];

const storageKeys: Record<RubriqueId, string> = {
  prealables: "sn-checklist-prealables",
  identite: "sn-checklist-identite",
  situation: "sn-checklist-situation",
  "charges-taxes": "sn-checklist-charges-taxes",
  copro: "sn-checklist-copro",
  occupation: "sn-checklist-occupation",
  origine: "sn-checklist-origine",
  capacite: "sn-checklist-capacite",
  "pro-fiscale": "sn-checklist-pro-fiscale",
  urbanisme: "sn-checklist-urbanisme",
  "diagnostics-travaux-interieurs":
    "sn-checklist-diagnostics-travaux-interieurs",
};

const hasValue = (val: unknown): boolean => {
  if (val == null) return false;
  if (typeof val === "boolean") return val === true;
  if (typeof val === "number") return true;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "object")
    return Object.values(val).some((v) => hasValue(v));
  return false;
};

const initialProgress: Record<RubriqueId, number> = {
  prealables: 0,
  identite: 0,
  situation: 0,
  "charges-taxes": 0,
  copro: 0,
  occupation: 0,
  origine: 0,
  capacite: 0,
  "pro-fiscale": 0,
  urbanisme: 0,
  "diagnostics-travaux-interieurs": 0,
};

const progressByRubrique = ref<Record<RubriqueId, number>>({
  ...initialProgress,
});

const { access: exportUnlocked, checked: accessChecked, refresh: refreshAccess } =
  useExportAccess();

onMounted(() => {
  const result: Record<RubriqueId, number> = { ...initialProgress };
  for (const id of Object.keys(storageKeys) as RubriqueId[]) {
    try {
      const raw = process.client ? localStorage.getItem(storageKeys[id]) : null;
      if (!raw) {
        result[id] = 0;
        continue;
      }
      const parsed = JSON.parse(raw);
      result[id] = hasValue(parsed) ? 50 : 0;
    } catch {
      result[id] = 0;
    }
  }
  progressByRubrique.value = result;

  if (!accessChecked.value) {
    refreshAccess();
  }
});
</script>

<template>
  <div class="liste-rubriques">
    <NuxtLink
      v-for="card in cards"
      :key="card.id"
      class="liste-rubriques__card"
      :to="`/outils/checklist-dossier-vente-notaire/${card.id}`"
    >
      <div class="liste-rubriques__card__title-row">
        <h2 class="liste-rubriques__card__title">{{ card.title }}</h2>
        <UITagComponent
          v-if="card.premium"
          :color="
            exportUnlocked
              ? colors['success-color']
              : colors['accent-color']
          "
          :icon="exportUnlocked ? 'unlock' : 'lock'"
          size="small"
          >{{ exportUnlocked ? "Débloqué" : "Premium" }}</UITagComponent
        >
        <UITagComponent
          v-else
          :color="colors['success-color']"
          icon="unlock"
          size="small"
          >Gratuit</UITagComponent
        >
      </div>
      <p class="liste-rubriques__card__subtitle">
        {{ card.subtitle }}
      </p>
      <div
        class="liste-rubriques__card__status"
        :class="{
          'liste-rubriques__card__status--done':
            progressByRubrique[card.id] === 100,
          'liste-rubriques__card__status--progress':
            progressByRubrique[card.id] > 0,
          'liste-rubriques__card__status--todo':
            progressByRubrique[card.id] === 0,
        }"
      >
        <UIIconComponent
          class="liste-rubriques__card__status__icon"
          :icon="
            progressByRubrique[card.id] === 100
              ? 'check_circle'
              : progressByRubrique[card.id] > 0
              ? 'clock'
              : 'circle'
          "
        />
        <span class="liste-rubriques__card__status__text">
          {{ progressByRubrique[card.id] || 0 }}%
        </span>
      </div>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.liste-rubriques {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  flex: 1;
  min-width: 70%;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(2, 1fr);
    padding-right: 1.5rem;
    overflow-y: scroll;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: calc($radius / 2);
    border: 1px solid color-mix(in srgb, $text-color 10%, transparent);
    min-height: 200px;
    transition: box-shadow 0.2s linear, background-color 0.2s linear,
      border 0.2s linear;
    text-decoration: none;
    color: inherit;

    &:hover {
      background-color: $primary-color;
      box-shadow: $shadow-black;
      border: 1px solid $primary-color;
      cursor: pointer;
    }

    &__title-row {
      display: flex;
      gap: 0.5rem;
      justify-content: space-between;
    }

    &__title {
      font-size: 1.25rem;
      font-weight: $semi-bold;
      text-wrap: balance;
      max-width: calc(100% - 5rem);
    }

    &__subtitle {
      color: $text-color-faded;
    }

    &__status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      font-weight: $semi-bold;
      font-size: 0.95rem;
      margin-top: auto;

      &__text {
        line-height: 1;
      }

      &__icon {
        font-size: 1.1rem;
        display: flex;
        align-items: center;
      }

      &--done {
        background: rgba($success-color, 0.15);
        color: $success-color;
      }

      &--progress {
        background: rgba($accent-color, 0.15);
        color: $accent-color;
      }

      &--todo {
        background: rgba($text-color, 0.08);
        color: $text-color;
      }
    }
  }
}
</style>
