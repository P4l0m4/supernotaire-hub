<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { colors } from "@/utils/colors";
import PreEtatDateExportMenu from "@/components/Pre-etat-date/ExportMenu.vue";

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
    title: "Sommes dues par le cédant",
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
  if (typeof val === "object") return Object.values(val).some((v) => hasValue(v));
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

const questions = [
  {
    title: "Combien coûte le service de génération de Pré-état daté ?",
    answer:
      "Vous pouvez utiliser easycase.fr pour créer un Pré-état daté gratuitement (pour le moment). Habituellement, un Pré-état daté coûte entre 150 et 300 euros lorsqu'il est réalisé par un professionnel.",
  },
  {
    title: "Le Pré-état daté généré est-il conforme aux exigences légales ?",
    answer:
      "Oui, le Pré-état daté généré sur EasyCase est conforme aux exigences légales en vigueur. Nous nous assurons que toutes les informations nécessaires sont incluses, mais il est toujours recommandé de faire vérifier le document par un professionnel avant de l'utiliser.",
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
    title: "Le service de création de Pré-état daté est-il sécurisé ?",
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
      "Oui, vous pouvez utiliser EasyCase pour générer des Pré-états datés pour plusieurs biens immobiliers. Il vous suffit de remplir un nouveau formulaire pour chaque bien.",
  },
  {
    title: "Combien de temps faut-il pour générer un Pré-état daté ?",
    answer:
      "Le processus de génération du Pré-état daté est généralement rapide et peut être complété en quelques minutes, en fonction de la rapidité avec laquelle vous fournissez les informations et documents nécessaires. Nous avons optimisé le processus pour vous faire gagner du temps grâce à un système de suggestions intelligentes à partir des informations trouvées dans vos documents.",
  },
  {
    title: "Quels documents joindre au Pré-état daté ?",
    answer:
      "Une fois le Pré-état daté généré, vous devez y joindre plusieurs annexes au document : le dernier procès-verbal d’assemblée générale, l’état daté des impayés, le montant du fonds travaux, le carnet d’entretien de l’immeuble, le diagnostic technique global (DTG) s’il existe, le budget prévisionnel voté et les comptes des deux derniers exercices, l’état des procédures en cours contre la copropriété, la copie du règlement de copropriété et état descriptif de division à jour, ainsi que l’attestation d’assurance de l’immeuble.",
  },
  {
    title: "Pourquoi ai-je besoin d'un Pré-état daté ?",
    answer:
      "Le Pré-état daté est un document essentiel dans le cadre de la vente d'un bien en copropriété. Il informe l'acheteur et le notaire sur la situation financière et administrative de la copropriété, ce qui est crucial pour prendre une décision éclairée.",
  },
  {
    title: "Pourquoi utiliser EasyCase pour générer un Pré-état daté ?",
    answer:
      "EasyCase simplifie et accélère le processus de création du Pré-état daté grâce à son interface intuitive et ses fonctionnalités intelligentes. Vous gagnez du temps et réduisez les risques d'erreurs en utilisant notre service.",
  },
];

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EasyCase | Générateur de Pré-état daté gratuit",
  description:
    "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
  url: `${baseUrl}/outils/pre-etat-date`,
}));

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Créateur de Pré-état daté immobilier gratuit",
  description:
    "Créer un Pré-état daté conforme à la réglementation pour la vente d'un bien en copropriété.",
  applicationCategory: "Tool",
  operatingSystem: "Web",
  url: `${baseUrl}/outils/pre-etat-date`,
}));

useHead({
  title: "EasyCase | Générateur de Pré-état daté gratuit",
  meta: [
    {
      name: "description",
      content:
        "Créez un Pré-état daté conforme à la réglementation en quelques minutes grâce à notre générateur gratuit en ligne.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "Générateur de Pré-état daté gratuit",
    },
    {
      property: "og:url",
      content: `${baseUrl}/outils/pre-etat-date`,
    },
    {
      property: "og:description",
      content:
        "Créez facilement un Pré-état daté conforme, prêt à être transmis à votre notaire.",
    },
  ],
});
</script>

<template>
  <Container>
    <div class="page-headlines">
      <h1 class="titles">Générateur de Pré-état daté gratuit</h1>
      <p class="subtitles">
        Remplissez chaque rubrique pour créer rapidement un Pré-état daté
        conforme, prêt à partager.
      </p>
    </div>

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
      <TransitionGroup
        name="rubriques"
        tag="div"
        class="liste-rubriques__list"
      >
        <NuxtLink
          v-for="card in sortedCards"
          :key="card.id"
          class="liste-rubriques__card"
          :to="`/outils/pre-etat-date/${card.id}`"
          v-tooltip="card.subtitle"
        >
          <div class="liste-rubriques__card__header">
            <h2 class="liste-rubriques__card__header__title">
              {{ card.title }}
            </h2>
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

  <Container>
    <UIDidYouKnow title="Pas besoin du syndic, faites-le vous-même !">
      <template #text>
        Depuis le 1er janvier 2015, les syndics sont tenus de proposer aux
        copropriétaires un accès en ligne sécurisé aux documents dématérialisés
        relatifs à la gestion de l'immeuble. Vous pouvez ainsi obtenir les
        informations requises pour établir le pré-état daté sans passer par le
        syndic et le créer vous-même.
      </template>
      <template #cta>
        <NuxtLink
          to="/outils/pre-etat-date"
          aria-label="Créer mon pré-état daté"
        >
          <UIPrimaryButton variant="accent-color">
            Créer mon pré-état daté
          </UIPrimaryButton>
        </NuxtLink>
      </template>
    </UIDidYouKnow>
  </Container>
  <HotjarTracking />
</template>

<style scoped lang="scss">
.page-headlines {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1rem;
  text-wrap: balance;

  @media (min-width: $laptop-screen) {
    margin-bottom: 1.5rem;
  }
}

.liste-rubriques {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  gap: 1.5rem;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
    position: relative;

    @media (min-width: $laptop-screen) {
      flex-direction: row;
      align-items: stretch;
      gap: 2rem;
      justify-content: space-between;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    @media (min-width: $big-tablet-screen) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
      padding-right: 1.5rem;
      overflow-y: scroll;
      min-width: 70%;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    padding: 1rem;
    border-radius: calc($radius / 2);
    border: 1px solid color-mix(in srgb, $text-color 10%, transparent);
    height: fit-content;
    align-items: end;
    transition:
      box-shadow 0.2s linear,
      background-color 0.2s linear,
      border 0.2s linear;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
      gap: 1.5rem;

      &:hover {
        background-color: $primary-color;
        box-shadow: $shadow-black;
        border: 1px solid $primary-color;
        cursor: pointer;
      }
    }

    &__header {
      width: 100%;
      display: flex;
      gap: 1rem;
      justify-content: space-between;

      &__title {
        width: calc(100% - 6rem);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 1.25rem;
        font-weight: $semi-bold;
      }
    }
  }
}

.rubriques-enter-active,
.rubriques-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.rubriques-enter-from,
.rubriques-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.rubriques-move {
  transition: transform 1s ease;
}

.faq {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;
  margin-top: 2rem;

  @media (min-width: $laptop-screen) {
    grid-template-columns: 1fr;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-wrap: balance;
  }
}
</style>
