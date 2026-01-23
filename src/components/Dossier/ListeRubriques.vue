<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { colors } from "@/utils/colors";
import {
  calculateSectionProgress,
  computeOverallProgress,
  countCompleted,
  createDebouncedRefresh,
  sortCardsByCompletion,
} from "@/utils/rubriquesProgress";
import { useExportAccess } from "@/composables/useExportAccess";
import { useDriver } from "#imports";

type RubriqueId =
  | "prealables"
  | "identite"
  | "situation"
  | "charges-taxes"
  | "copro"
  | "occupation"
  | "origine"
  | "capacite"
  | "fiscale"
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
    id: "fiscale",
    title: "Situation Fiscale",
    subtitle: "Résidence fiscale, entité et régime d’imposition.",
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
  fiscale: "sn-checklist-fiscale",
  urbanisme: "sn-checklist-urbanisme",
  "diagnostics-travaux-interieurs":
    "sn-checklist-diagnostics-travaux-interieurs",
};

const completedCards = computed(() => {
  return countCompleted(progressByRubrique.value);
});

const initialProgress: Record<RubriqueId, number> = {
  prealables: 0,
  identite: 0,
  situation: 0,
  "charges-taxes": 0,
  copro: 0,
  occupation: 0,
  origine: 0,
  capacite: 0,
  fiscale: 0,
  urbanisme: 0,
  "diagnostics-travaux-interieurs": 0,
};

const progressByRubrique = ref<Record<RubriqueId, number>>({
  ...initialProgress,
});

const rubriqueIds = Object.keys(initialProgress) as RubriqueId[];

const sortedCards = computed(() => {
  return sortCardsByCompletion(cards, progressByRubrique.value);
});

const {
  access: exportUnlocked,
  checked: accessChecked,
  refresh: refreshAccess,
} = useExportAccess();

const TOUR_FLAG = "checklist-tour";
const TOUR_DONE_FLAG = "checklist-tour-done";

const overallProgress = ref(0);

const calculateOverallProgress = () => {
  overallProgress.value = computeOverallProgress(
    progressByRubrique.value,
    cards.length,
  );
};

function calculateResult() {
  progressByRubrique.value = calculateSectionProgress(rubriqueIds, (id) => {
    try {
      const raw = process.client ? localStorage.getItem(storageKeys[id]) : null;
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
}

const refreshProgress = () => {
  calculateResult();
  calculateOverallProgress();
};

const refreshProgressWithDelay = createDebouncedRefresh(refreshProgress, 1000);

const handleStorageChange = (event: StorageEvent) => {
  if (!event?.key || !event.key.startsWith("sn-checklist-")) return;
  refreshProgressWithDelay();
};

const startTour = () => {
  if (!process.client) return;
  localStorage.setItem(TOUR_FLAG, "identite");
  const tour = useDriver({
    overlayOpacity: 0.45,
    allowClose: true,
    showProgress: false,
    nextBtnText: "Suivant",
    prevBtnText: "Précédent",
    doneBtnText: "Terminer",
    steps: [
      {
        element: "#checklist-tour-identite",
        popover: {
          title: "Choisissez une rubrique pour commencer",
          description:
            "Vous pouvez commencer par n'importe quelle rubrique, dans l'ordre que vous souhaitez.",
          side: "bottom",
          align: "start",
        },
      },
    ],
  });
  tour.drive();
};

const maybeStartTourOnFirstVisit = () => {
  if (!process.client) return;
  const alreadyDone = localStorage.getItem(TOUR_DONE_FLAG);
  if (alreadyDone) return;
  localStorage.setItem(TOUR_DONE_FLAG, "1");
  startTour();
};

onMounted(() => {
  refreshProgressWithDelay();
  if (process.client) {
    window.addEventListener("storage", handleStorageChange);
  }
  if (!accessChecked.value) {
    refreshAccess();
  }
  maybeStartTourOnFirstVisit();
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener("storage", handleStorageChange);
  }
});
</script>

<template>
  <div class="liste-rubriques">
    <div class="liste-rubriques__header">
      <ChartsProgressBar
        label="Progression globale"
        :progress="overallProgress"
        :state="
          overallProgress === 100
            ? 'completed'
            : overallProgress > 0
              ? 'progress'
              : 'default'
        "
        :legend="`${completedCards} / ${cards.length} rubriques complétées`"
      />
      <DossierExportMenu />

      <AnimationsConfetti
        :active="overallProgress === 100"
        :count="20"
        :delay="800"
        size="20rem"
        style="position: absolute; inset: 0; margin: auto; z-index: -1"
      />
    </div>
    <TransitionGroup name="rubriques" tag="div" class="liste-rubriques__list">
      <NuxtLink
        v-for="card in sortedCards"
        :key="card.id"
        class="liste-rubriques__card"
        :id="card.id === 'identite' ? 'checklist-tour-identite' : undefined"
        :to="`/outils/checklist-dossier-vente-notaire/${card.id}`"
        v-tooltip="card.subtitle"
        ><div class="liste-rubriques__card__header">
          <h2 class="liste-rubriques__card__header__title">{{ card.title }}</h2>
          <UITagComponent
            v-if="card.premium"
            :color="
              exportUnlocked ? colors['success-color'] : colors['accent-color']
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
        <ChartsProgressBar
          :progress="progressByRubrique[card.id]"
          :state="
            progressByRubrique[card.id] === 100
              ? 'completed'
              : progressByRubrique[card.id] > 0
                ? 'progress'
                : 'default'
          "
          :label="
            progressByRubrique[card.id] === 100
              ? 'Terminé'
              : `${Math.round(
                  (100 - progressByRubrique[card.id]) * 0.6,
                )}s restantes`
          "
      /></NuxtLink>
    </TransitionGroup>
  </div>
  <aside class="side-menu">
    <UIActionToast
      :color="colors['purple-color']"
      icon="help_circle"
      direction="column"
      action-label="Lancer le tutoriel"
      style="margin-left: auto"
      :onAction="startTour"
      >Besoin d'aide pour démarrer ?
      <template #secondaryMessage>
        Cliquez ici pour lancer le tutoriel rapide.
      </template>
    </UIActionToast>
  </aside>
</template>

<style lang="scss" scoped>
@import "@/styles/rubriques.scss";
</style>
