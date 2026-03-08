<script setup lang="ts">
import { reviews } from "@/utils/reviews";
import { colors } from "@/utils/colors";

import one from "@/assets/animated-icons/NumberCircleOne.svg?raw";
import two from "@/assets/animated-icons/NumberCircleTwo.svg?raw";
import three from "@/assets/animated-icons/NumberCircleThree.svg?raw";

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
    icon: one,
    title: "Liste personnalisée",
    description: "Obtenez la liste exacte des documents pour votre situation.",
  },
  {
    icon: two,
    title: "Organisation du dossier",
    description:
      "Rassemblez toutes les informations nécessaires en un rien de temps.",
  },
  {
    icon: three,
    title: "Export du récapitulatif",
    description: "Partagez facilement votre récapitulatif avec votre notaire.",
  },
];

const objections = [
  {
    title: "À quoi sert cet outil ?",
    answer:
      "A créer une liste complète, personnalisée et structurée de tous les documents nécessaires pour vendre votre bien rapidement.",
  },
  {
    title:
      "En quoi est-ce différent des listes de documents que je trouve sur internet ?",
    answer:
      "Les listes génériques que l'on trouve sur internet sont toujours incomplètes, puisqu'elles ne couvent que le tronc commun des documents à fournir, sans tenir compte des spécificités de votre situation. Vous devrez ensuite multiplier les allers-retours avec le notaire pour comprendre ce qui manque, ce qui allonge la vente de plusieurs semaines. Notre outil s'adapte à votre situation spécifique, vous permettant de préparer un dossier complet rapidement et en évitant les retards et les allers-retours inutiles.",
  },
  {
    title: "Est-ce que je peux créer ma liste gratuitement ?",
    answer:
      "L'outil est disponible gratuitement dans une version limitée, qui couvre les thématiques juridiques de base. La version complète est proposée à un prix très abordable de 10 euros seulement et vous permettra d'inclure les thématiques les plus complexes à votre liste.",
  },
  {
    title:
      "En quoi cette liste est-elle différente d'une liste fournie par mon notaire ?",
    answer:
      "Lors du premier rendez-vous, le notaire fournit souvent une liste générique limitée, un tronc commun de documents et informations à fournir. Par la suite, il vous demandera de nombreux autres documents spécifiques à votre situation, ce qui allonge considérablement la procédure. Notre outil s'adapte à votre situation spécifique, bien au delà du tronc commun, vous permettant de préparer un dossier complet et personnalisé avant ce rendez-vous.",
  },
  {
    title: "Est-ce que ça remplace le notaire ?",
    answer:
      "Le notaire reste indispensable pour vérifier le dossier et réaliser l’acte de vente. L’outil vous permet simplement de préparer tous les documents nécessaire à votre dossier avant votre premier rendez-vous, de façon à éviter les oublis et gagner du temps sur la vente de votre bien. ",
  },
  {
    title: "Et si j’oublie un document important ?",
    answer:
      "Notre outils couvre les cas fréquents (copropriété, travaux, prêt, annexes…) aussi bien que les situations exceptionnelles (mandats, personnes morales, associations syndicales, urbanisme particulier, etc). En cas de doute, n'hésitez pas à nous contacter pour obtenir une aide personnalisée.",
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
              Créer ma liste personnalisée
            </UIPrimaryButton></NuxtLink
          >
        </div>
      </div>
    </div>
  </Container>

  <DossierProductPreview />

  <Container
    ><div class="feature-cards">
      <h3 class="feature-cards__title">
        Un outil
        <span
          :style="{
            color: colors['success-color'],
            fontFamily: 'Fitree-Italic',
            fontStyle: 'italic',
          }"
          >simple</span
        >
        pour préparer votre dossier
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
          Créer ma liste de documents
        </UIPrimaryButton>
      </NuxtLink>
    </div></Container
  >

  <DossierWarningSection />

  <AlreadyUsedBy :reviews="reviews" />
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
        @click.prevent="pushChecklistStart('last_chance')"
      >
        <UIPrimaryButton variant="accent-color" icon="file_text_fill">
          Créer ma liste en 5 minutes
        </UIPrimaryButton></NuxtLink
      ></template
    ></UILastChance
  >
  <UILogosCarousel />
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
    bottom: 0rem;
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

  @media (min-width: $super-big-screen) {
    max-width: 2064px;
    min-height: 60svh;

    &::before {
      height: 100%;
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
</style>
