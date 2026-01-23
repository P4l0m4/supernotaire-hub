<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { colors } from "@/utils/colors";
import PreEtatDateExportMenu from "@/components/Pre-etat-date/ExportMenu.vue";
import { useDriver } from "#imports";

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

type SectionCard = {
  id: SectionId;
  title: string;
  subtitle: string;
};

const STORAGE_KEY = "sn-pre-etat-date";
const TOUR_FLAG = "ped-tour-documents";
const TOUR_DONE_FLAG = "ped-tour-done";

const cards: SectionCard[] = [
  {
    id: "documents",
    title: "Justificatifs",
    subtitle: "Déposez vos documents clés pour activer les suggestions.",
  },
  {
    id: "bien",
    title: "Bien à vendre",
    subtitle: "Adresse et identification du lot.",
  },
  {
    id: "copropriete",
    title: "Copropriété",
    subtitle: "Données générales sur la copropriété.",
  },
  {
    id: "syndic",
    title: "Syndic",
    subtitle: "Coordonnées et références du syndic.",
  },
  {
    id: "financier_lot",
    title: "Situation financière du lot",
    subtitle: "Appels, soldes et échéances à venir.",
  },
  {
    id: "financier_lot_sommes_dues_cedant",
    title: "Sommes dues par le vendeur",
    subtitle: "Montants et avances à régulariser côté vendeur.",
  },
  {
    id: "financier_lot_sommes_debiteur_syndic",
    title: "Sommes dues par le Syndic",
    subtitle: "Avances et provisions à reverser.",
  },
  {
    id: "financier_lot_sommes_a_la_charge_acquereur_post_vente",
    title: "Sommes à la charge acquéreur",
    subtitle: "Provisions non exigibles et fonds travaux.",
  },
  {
    id: "financier_lot_autres",
    title: "Autres sommes",
    subtitle: "Charges N-1 / N-2 à déclarer.",
  },
];

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

const initialProgress: Record<SectionId, number> = {
  documents: 0,
  bien: 0,
  copropriete: 0,
  syndic: 0,
  financier_lot: 0,
  financier_lot_sommes_dues_cedant: 0,
  financier_lot_sommes_debiteur_syndic: 0,
  financier_lot_sommes_a_la_charge_acquereur_post_vente: 0,
  financier_lot_autres: 0,
};

const progressBySection = ref<Record<SectionId, number>>({
  ...initialProgress,
});

const completedCards = computed(() => {
  return Object.values(progressBySection.value).filter((p) => p === 100).length;
});

const overallProgress = ref(0);

const calculateOverallProgress = () => {
  const total = cards.length;
  const sum = Object.values(progressBySection.value).reduce(
    (acc, val) => acc + val,
    0,
  );
  overallProgress.value = Math.round(sum / total);
};

function calculateResult() {
  const newProgress: Record<SectionId, number> = { ...initialProgress };
  let parsed: Record<string, any> = {};
  if (process.client) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = {};
    }
  }
  for (const id of Object.keys(initialProgress) as SectionId[]) {
    const value = parsed?.[id];
    newProgress[id] = value?.__completed ? 100 : hasValue(value) ? 50 : 0;
  }
  progressBySection.value = newProgress;
}

const refreshProgress = () => {
  calculateResult();
  calculateOverallProgress();
};

const refreshProgressWithDelay = (() => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      refreshProgress();
      timer = null;
    }, 800);
  };
})();

const handleStorageChange = (event: StorageEvent) => {
  if (!event?.key || !event.key.startsWith(STORAGE_KEY)) return;
  refreshProgressWithDelay();
};

onMounted(() => {
  refreshProgressWithDelay();
  if (process.client) {
    window.addEventListener("storage", handleStorageChange);
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener("storage", handleStorageChange);
  }
});

const sortedCards = computed(() => {
  const completed: SectionCard[] = [];
  const others: SectionCard[] = [];
  cards.forEach((card) => {
    const progress = progressBySection.value[card.id] ?? 0;
    if (progress === 100) completed.push(card);
    else others.push(card);
  });
  return [...others, ...completed];
});

const startTour = () => {
  if (!process.client) return;
  localStorage.setItem(TOUR_FLAG, "documents");
  const tour = useDriver({
    overlayOpacity: 0.45,
    allowClose: true,
    showProgress: true,
    nextBtnText: "Suivant",
    prevBtnText: "Précédent",
    doneBtnText: "Terminer",
    steps: [
      {
        element: "#ped-tour-documents-card",
        popover: {
          title: "Commencez par les justificatifs",
          description:
            "Commencez par cette rubrique. Vous y déposerez vos documents de copropriété pour bénéficier de suggestions intelligentes qui vous aideront à compléter les autres rubriques.",
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
  maybeStartTourOnFirstVisit();
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
      <PreEtatDateExportMenu />

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
        :id="card.id === 'documents' ? 'ped-tour-documents-card' : undefined"
        :to="`/outils/pre-etat-date/${card.id}`"
        v-tooltip="card.subtitle"
      >
        <div class="liste-rubriques__card__header">
          <h2 class="liste-rubriques__card__header__title">{{ card.title }}</h2>
          <UITagComponent
            :color="colors['success-color']"
            icon="unlock"
            size="small"
          >
            Gratuit
          </UITagComponent>
        </div>
        <ChartsProgressBar
          :progress="progressBySection[card.id]"
          :state="
            progressBySection[card.id] === 100
              ? 'completed'
              : progressBySection[card.id] > 0
                ? 'progress'
                : 'default'
          "
          :label="
            progressBySection[card.id] === 100
              ? 'Terminé'
              : `${Math.round(
                  (100 - progressBySection[card.id]) * 0.6,
                )}s restantes`
          "
        />
      </NuxtLink>
    </TransitionGroup>
  </div>
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
</template>

<style lang="scss" scoped>
@import "@/styles/rubriques.scss";
</style>
