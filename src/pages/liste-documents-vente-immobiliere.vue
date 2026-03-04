<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { reviews } from "@/utils/reviews";

import { colors } from "@/utils/colors";

import type { ListSection } from "@/components/UI/ListPreview.vue";

import fileText from "@/assets/animated-icons/fileText.svg?raw";
import arrowsOut from "@/assets/animated-icons/arrowsOut.svg?raw";
import puzzlePiece from "@/assets/animated-icons/puzzlePiece.svg?raw";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const pushChecklistStart = (
  ctaLocation:
    | "hero"
    | "form"
    | "features"
    | "last_chance"
    | "preview"
    | "warning",
) => {
  if (!process.client) return;
  if (window.location.hostname === "localhost") return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({
    event: "checklist_start",
    page_type: "landing_vendeur_acheteur_trouve",
    cta_location: ctaLocation,
  });
};

const featureCards = [
  {
    icon: fileText,
    title: "Liste personnalisée",
    description: "Obtenez la liste exacte des documents pour votre situation.",
  },
  {
    icon: puzzlePiece,
    title: "Organisation du dossier",
    description:
      "Rassemblez toutes les informations nécessaires en un rien de temps.",
  },
  {
    icon: arrowsOut,
    title: "Export du récapitulatif",
    description: "Partagez facilement votre récapitulatif avec votre notaire.",
  },
];

const objections = [
  {
    title: "À quoi sert cet outil ?",
    answer:
      "Vous répondez à quelques questions simples, on vous donne la liste complète et structurée, adaptée à votre situation.",
  },
  {
    title: "Combien de temps faut-il pour générer la liste ?",
    answer:
      "Notre outils couvre les cas fréquents (copropriété, travaux, prêt, annexes…) aussi bien que les situations exceptionnelles (mandats, personnes morales, associations syndicales, urbanisme particulier, etc). En cas de doute, n'hésitez pas à nous contacter pour obtenir une aide personnalisée.",
  },
  {
    title: "Est-ce gratuit ?",
    answer:
      "Les listes génériques que l'on trouve sur internet ou chez le notaire sont toujours incomplètes, puisqu'elles ne couvent que le tronc commun des documents à fournir, sans tenir compte des spécificités de votre situation. Vous devrez ensuite multiplier les allers-retours avec le notaire pour comprendre ce qui manque, ce qui peut faire perdre plusieurs semaines voire mois sur la vente.",
  },
  {
    title: "Est-ce valable pour une maison et un appartement ?",
    answer:
      "Un récapitulatif clair et structuré de tous les documents à fournir au notaire et adapté à votre situation spécifique, qui vous permettra d'éviter les retards sur la vente.",
  },
  {
    title: "Est-ce que cela remplace le notaire ? ",
    answer:
      "Vous répondez à quelques questions simples, on vous donne la liste complète et structurée, adaptée à votre situation.",
  },
];

const selectedOption = ref("Appartement");

const radioOptions = [
  {
    id: "option1",
    name: "options",
    value: "Appartement",
    label: "Appartement",
    description: "Appartement situé dans un immeuble ou une copropriété.",
    icon: "buildings_fill",
  },
  {
    id: "option2",
    name: "options",
    value: "Maison",
    label: "Maison",
    description: "Maison individuelle, mitoyenne, avec ou sans terrain, etc.",
    icon: "house_line_fill",
  },
];

const rules = {
  option: { required },
};

const vContact$ = useVuelidate(rules, {
  option: selectedOption,
});

const SHARED_TYPE_KEY = "sn-shared-type-bien";
const PREALABLES_KEY = "sn-checklist-prealables";

const handleContinue = async () => {
  vContact$.value.option.$touch();
  if (vContact$.value.option.$invalid) return;
  if (process.client) {
    try {
      localStorage.setItem(SHARED_TYPE_KEY, selectedOption.value);
      const existing = localStorage.getItem(PREALABLES_KEY);
      const parsed =
        existing && existing.trim().length ? JSON.parse(existing) : {};
      if (parsed?.type_bien !== selectedOption.value) {
        localStorage.setItem(
          PREALABLES_KEY,
          JSON.stringify({
            ...parsed,
            type_bien: selectedOption.value,
          }),
        );
      }
    } catch (e) {
      console.warn("[liste-documents] failed to store type bien", e);
    }
  }
  await navigateTo("/outils/checklist-dossier-vente-notaire/prealables");
};

const optionsErrors = computed(() => {
  const errors: string[] = [];
  if (!vContact$.value.option.$dirty) return errors;
  vContact$.value.option.required.$invalid &&
    errors.push("Sélectionnez une option");
  return errors;
});

const sections: ListSection[] = [
  {
    title: "Identité & État civil",
    items: [
      { label: "Pièce d'identité (CNI, titre de séjour ou passeport)" },
      { label: "Acte de naissance intégral < 3 mois" },
      { label: "Justificatif de domicile < 3 mois" },
    ],
  },
  {
    title: "Situation fiscale",
    items: [{ label: "Dernier avis d'impôt sur le revenu" }],
  },
  {
    title: "Diagnostics & Travaux intérieurs",
    items: [
      { label: "DPE - Diagnostic de performance énergétique" },
      { label: "Diagnostic amiante" },
      { label: "Diagnostic plomb (CREP)" },
    ],
  },
  {
    title: "Urbanisme & Travaux extérieurs",
    items: [
      {
        label:
          "Arrêté de permis de construire ou arrêté de non-opposition à déclaration préalable",
      },
      {
        label:
          "DAACT (déclaration attestant l'achèvement et la conformité des travaux)",
      },
      { label: "Extrait ou plan cadastral du bien" },
    ],
  },
  {
    title: "Capacité & Représentation",
    items: [
      { label: "Pièce d'identité du tuteur" },
      {
        label: "Jugement de mise sous tutelle",
      },
      { label: "Autorisation du juge des tutelles" },
    ],
  },
  {
    title: "Charges & Taxes",
    items: [
      { label: "Dernier avis de taxe foncière" },
      { label: "Dernière attestation d'entretien du chauffage" },
      { label: "RIB du bénéficiaire 1" },
    ],
  },
  {
    title: "Occupation du bien",
    items: [
      { label: "Copie du bail" },
      { label: "Dernier avis d'échéance ou quittance de loyer" },
      { label: "État des lieux d'entrée (si disponible)" },
    ],
  },
  {
    title: "Origine de la propriété",
    items: [
      { label: "Attestation immobilière de propriété" },
      { label: "Déclaration de succession (cerfa 2705)" },
      { label: "Copie authentique du testament" },
    ],
  },
  {
    title: "Situation matrimoniale",
    items: [
      { label: "Copie intégrale de l'acte de mariage < 3 mois" },
      { label: "Livret de famille" },
      { label: "Attestation d'enregistrement PACS" },
    ],
  },
  {
    title: "Copropriété & Structures collectives",
    items: [
      { label: "Règlement de copropriété" },
      { label: "Pré-état daté" },
      { label: "Dernier procès-verbal d'AG" },
    ],
  },
];
</script>
<template>
  <Container>
    <div class="centered-hero">
      <div class="centered-hero__text">
        <ReviewScore :reviews />
        <h1 class="centered-hero__text__title">
          Tous les documents nécessaires pour vendre votre bien immobilier.
          <svg
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
            class="svg-underline"
          >
            <path
              d="
      M 0,5
      Q 50,0
        100,5
    "
            ></path>
          </svg>
        </h1>

        <p class="centered-hero__text__subtitle">
          Générez en 5 minutes la liste exacte des documents à fournir à votre
          notaire.
        </p>

        <div class="centered-hero__text__link">
          <NuxtLink
            to="/outils/checklist-dossier-vente-notaire"
            aria-label="Obtenir ma liste de documents"
            style="width: 100%"
            @click="pushChecklistStart('hero')"
          >
            <UIPrimaryButton variant="accent-color" icon="hands_clapping_fill">
              Obtenir ma liste de documents
            </UIPrimaryButton></NuxtLink
          ><NuxtLink to="#list-preview-section"
            ><UITertiaryButton variant="text-color"
              >Voir un exemple</UITertiaryButton
            ></NuxtLink
          >
        </div>

        <div class="centered-hero__text__info">
          <span class="centered-hero__text__info__item"
            ><UIIconComponent icon="certificate" size="0.85rem" />Conforme aux
            exigences notariales</span
          >

          <span class="centered-hero__text__info__item"
            ><UIIconComponent icon="unlock" size="0.85rem" />Gratuit et sans
            inscription</span
          >
        </div>
      </div>
    </div>
  </Container>

  <div class="section-wrapper">
    <div class="secondary-headlines">
      <h2 class="secondary-headlines__title">Commencez en 10 secondes</h2>
      <span class="secondary-headlines__subtitle"
        >Quel type de bien vendez-vous ?</span
      >
    </div>
    <form class="form-start">
      <FormElementsRadioOption
        v-for="opt in radioOptions"
        :key="opt.id"
        :radioOption="opt"
        v-model="selectedOption"
        :error="optionsErrors[0]"
      />

      <NuxtLink
        to="/outils/checklist-dossier-vente-notaire/prealables"
        aria-label="Générer ma liste personnalisée"
        style="width: 100%; margin-top: 1rem"
        @click.prevent="
          pushChecklistStart('form');
          handleContinue();
        "
      >
        <UIPrimaryButton variant="accent-color" icon="arrow_right">
          Continuer
        </UIPrimaryButton></NuxtLink
      ><UITagComponent
        icon="info"
        size="big"
        :color="`${colors['success-color']}`"
        style="width: 100%"
        >La liste s’adapte automatiquement à votre situation.</UITagComponent
      >
    </form>
  </div>
  <Container
    ><div class="feature-cards">
      <h3 class="feature-cards__title">
        Un outil simple pour préparer votre dossier
      </h3>
      <UIFeatureCard
        v-for="featureCard in featureCards"
        :key="featureCard.title"
        :icon="featureCard.icon"
        :title="featureCard.title"
        :description="featureCard.description"
      />
      <NuxtLink
        to="/outils/checklist-dossier-vente-notaire"
        class="feature-cards__link"
      >
        <UIPrimaryButton
          variant="accent-color"
          icon="folder_simple_plus_fill"
          style="max-width: none"
        >
          Préparer mon dossier complet
        </UIPrimaryButton>
      </NuxtLink>
    </div></Container
  >

  <Container id="list-preview-section">
    <div class="secondary-headlines">
      <h2 class="secondary-headlines__title">Aperçu de la checklist</h2>
      <span class="secondary-headlines__subtitle"
        >La liste s’adapte selon votre type de bien et votre situation.</span
      >
    </div>
    <UIListPreview
      title="Documents à fournir à votre notaire"
      :sections="sections"
    />
    <NuxtLink
      to="/outils/checklist-dossier-vente-notaire"
      aria-label="Générer ma liste personnalisée"
      style="width: fit-content; margin: 0 auto"
      @click="pushChecklistStart('preview')"
    >
      <UIPrimaryButton
        variant="accent-color"
        icon="list_checks_fill"
        style="width: 100%"
      >
        Générer ma liste personnalisée
      </UIPrimaryButton></NuxtLink
    >
  </Container>
  <Container>
    <Benefits
      title="N'attendez pas que le notaire vous rappelle"
      subtitle="Un oubli peut retarder ou bloquer la vente 🚫"
      text="Nous vous guidons étape par étape pour rassembler tous les documents nécessaires, sans stress ni confusion."
    />
    <NuxtLink
      to="/outils/checklist-dossier-vente-notaire"
      aria-label="Générer ma liste personnalisée"
      style="width: fit-content; margin: 0 auto"
      @click="pushChecklistStart('warning')"
    >
      <UIPrimaryButton variant="accent-color" icon="clock_countdown_fill">
        Gagner du temps sur ma vente
      </UIPrimaryButton></NuxtLink
    >
  </Container>

  <!-- <Container>
    <div class="secondary-headlines">
      <h2 class="secondary-headlines__title">
        Déjà utilisé par de nombreux vendeurs
      </h2>
      <span class="secondary-headlines__subtitle"
        >"Très pratique pour savoir exactement quels documents préparer."
        vendeur appartement "J’ai découvert des documents que mon notaire allait
        me demander." vendeur maison</span
      >
    </div>
  </Container> -->
  <Container>
    <h3 class="feature-cards__title">Les questions que l'on se pose tous 🙋‍♀️</h3>
    <FAQComponent :questions="objections" />
  </Container>
  <UILastChance
    title="Obtenez la liste complète des documents pour vendre votre bien"
    subtitle="Répondez à quelques questions simples. Votre liste personnalisée sera prête en quelques minutes."
    ><template #links
      ><NuxtLink
        to="/outils/checklist-dossier-vente-notaire/prealables"
        aria-label="Générer ma liste personnalisée"
        style="width: 100%"
        @click.prevent="
          pushChecklistStart('hero');
          handleContinue();
        "
      >
        <UIPrimaryButton variant="accent-color" icon="list_plus">
          Créer ma liste en 5 minutes
        </UIPrimaryButton></NuxtLink
      ></template
    ></UILastChance
  >
</template>
<style lang="scss" scoped>
.scene * {
  transform-box: fill-box; /* origine = bbox de l’élément */
  transform-origin: center;
}

@keyframes floatY {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-4px);
  }
}

.float-slow {
  animation: floatY 3.5s ease-in-out infinite alternate;
}
.float-fast {
  animation: floatY 2.2s ease-in-out infinite alternate;
  animation-delay: 0.3s;
}

// Accessibilité
@media (prefers-reduced-motion: reduce) {
  .float-slow,
  .float-fast {
    animation: none;
  }
}

.svg-underline {
  display: block;
  position: absolute;
  right: 30%;
  bottom: -6px;
  margin: auto;
  height: 6px;
  width: calc(25% - 2px);
  fill: none;
  stroke: var(--underline-color, #ffbf00);
  stroke-width: 3px;
  stroke-linecap: round;
  overflow: visible;
  stroke-dasharray: 120; // longueur
  stroke-dashoffset: 120;
  transition: stroke-dashoffset 0.6s ease;
}

.centered-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 12rem);
  gap: 2rem;
  color: $text-color;
  width: 100%;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 100vw;
    bottom: -6rem;
    height: calc(100vh - 6rem);
    background-image: url("@/assets/images/buildings.svg");
    opacity: 0.8;
    background-position: center;
    background-size: cover;
    z-index: -1;
    pointer-events: none;
    transition: opacity 0.5s ease-in-out;

    @starting-style {
      opacity: 0;
    }
  }

  &::after {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: auto;
    background:
      linear-gradient(
          90deg,
          color-mix(in hsl, canvasText, transparent 80%) 1px,
          transparent 1px 45px
        )
        calc(45px * 0.36) 50% / 45px 45px,
      linear-gradient(
          color-mix(in hsl, canvasText, transparent 80%) 1px,
          transparent 1px 45px
        )
        0% calc(45px * 0.32) / 45px 45px;
    -webkit-mask: linear-gradient(-20deg, transparent 50%, white);
    mask: linear-gradient(-20deg, transparent 50%, white);
    transform-style: flat;
    opacity: 0.4;
    z-index: -1;
    pointer-events: none;
    transition: opacity 0.5s ease-in-out;

    @starting-style {
      opacity: 0;
    }
  }

  @media (min-width: $laptop-screen) {
    min-height: calc(100vh - 4.5rem);
    padding: 4rem 0;
    flex-direction: row;
    align-items: center;

    &::before {
      height: calc(100vh - 4.5rem);
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 600px;
    text-align: center;
    align-items: center;

    @media (min-width: $big-tablet-screen) {
      gap: 3rem;
      max-width: none;
    }

    @media (min-width: $laptop-screen) {
      &:hover .svg-underline {
        stroke-dashoffset: 0;
      }
    }

    &__title {
      font-size: 1.85rem;
      font-weight: $bold;
      text-wrap: balance;
      opacity: 1;
      position: relative;
      text-shadow: 0 0 10px rgba($text-color, 0.2);
      transition: opacity 1s ease-in-out;

      @starting-style {
        opacity: 0;
      }

      @media (min-width: $big-tablet-screen) {
        font-size: 3rem;
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $medium;
      margin-top: -1rem;
      opacity: 1;
      transition: opacity 1s ease-in-out;

      @starting-style {
        opacity: 0;
      }

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
        max-width: 40rem;
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      @media (min-width: $big-tablet-screen) {
        font-size: 1rem;
        flex-direction: row;
      }

      &__item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: rgba($text-color, 0.7);
        font-size: 0.85rem;
        font-weight: $regular;

        @media (min-width: $big-tablet-screen) {
          font-size: 1rem;
        }
      }
    }

    &__link {
      color: $text-color;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      max-width: 400px;
      transform: scale(1);
      transition: transform 1s cubic-bezier(0.47, 1.64, 0.41, 0.8);

      @starting-style {
        transform: scale(0);
      }

      @media (min-width: $tablet-screen) {
        max-width: 350px;
      }
    }
  }
}

.feature-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  &__title {
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    font-weight: $semi-bold;
    text-wrap: balance;
    margin-bottom: 1rem;

    @media (min-width: $big-tablet-screen) {
      font-size: 2.5rem;
      grid-column: span 3;
      margin-bottom: 2rem;
    }
  }

  &__link {
    height: 100%;

    @media (min-width: $big-tablet-screen) {
      grid-column: 2/3;
    }
  }
}

.section-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 1rem;
  align-items: center;
  height: fit-content;
  width: 100%;
  background-color: $primary-color;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
  }
}

.form-start {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 30rem;
}
</style>
