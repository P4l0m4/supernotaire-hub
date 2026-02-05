<script setup lang="ts">
import { reviews } from "@/utils/reviews";
import signature from "@/assets/animated-icons/Signature.svg?raw";
import globe from "@/assets/animated-icons/globe-animated.svg?raw";
import puzzle from "@/assets/animated-icons/PuzzlePiece.svg?raw";
import bannerImage from "@/assets/images/accompagnement-vente-immo-mobile.webp";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const featureCards = [
  {
    icon: signature,
    title: "Conforme aux exigences notariales",
    description:
      "Conçu en collaboration avec des notaires pour garantir que vous fournissez exactement ce dont ils ont besoin, au bon moment. ",
  },
  {
    icon: globe,
    title: "Adopté par plus de 1250 vendeurs",
    description:
      "Plus de 1250 vendeurs français ont gagné en moyenne 3 semaines sur leur vente en moins de 5 minutes grâce à notre outil ultra intuitif.",
  },
  {
    icon: puzzle,
    title: "Adapté à votre situation spécifique",
    description:
      "Obtenez la liste exacte des documents à fournir au notaire pour la vente de votre bien immobilier. Vous saurez exactement quoi récupérer, auprès de qui, et quand.",
  },
];

const questions = [
  {
    title: "À qui s’adresse cet outil ?",
    answer:
      "Aux vendeurs qui ont déjà un acheteur (compromis signé ou vente en cours) et qui doivent préparer les documents demandés par le notaire.",
  },
  {
    title: "Est-ce gratuit ?",
    answer:
      "Oui, vous pouvez préparer votre dossier immédiatement et sans inscription. Vous pouvez également débloquer des fonctionnalités supplémentaires en optant pour la version payante.",
  },
  {
    title: "Combien de temps ça prend ?",
    answer:
      "En général 2 à 5 minutes pour générer votre récapitulatif, puis vous avancez à votre rythme pour rassembler les pièces.",
  },
  {
    title: "Est-ce valable pour les maisons et les appartements ?",
    answer:
      "Oui. L'outil est conçu pour s'adapter à de très nombreuses situations concernant la vente de maisons et d'appartements. Nous prenons notamment en compte les situations de copropriété ou non, les biens avec ou sans garage, les ventes avec ou sans prêt immobilier, sous mandat ou non, sur des zones particulières, etc.",
  },
  {
    title:
      "L'outil est-il utilisable si je n'ai pas encore trouvé d'acheteur ?",
    answer:
      "Oui, vous pouvez commencer à préparer votre dossier de vente dès maintenant pour gagner du temps une fois que vous aurez trouvé un acheteur.",
  },
  {
    title: "L'outil est-il adapté pour les ventes de terrains ?",
    answer:
      "Non, l'outil est spécifiquement conçu pour les ventes de maisons et d'appartements.",
  },
  {
    title: "Est-ce que ça remplace le notaire ?",
    answer:
      "Non. Nous vous aidons à préparer les documents demandés pour éviter les retards chez le notaire qui ralentissent la vente de plusieurs mois.",
  },
];

const objections = [
  {
    title: "Je ne sais pas par où commencer.",
    answer:
      "Vous répondez à quelques questions simples, on vous donne la liste complète et structurée, adaptée à votre situation.",
  },
  {
    title: "Et si j’oublie un document important ?",
    answer:
      "Notre outils couvre les cas fréquents (copropriété, travaux, prêt, annexes…) aussi bien que les situations exceptionnelles (mandats, personnes morales, associations syndicales, urbanisme particulier, etc). En cas de doute, n'hésitez pas à nous contacter pour obtenir une aide personnalisée.",
  },
  {
    title:
      "Qu'est-ce que ça fait de plus que les listes de documents que je trouve sur internet / chez le notaire ?",
    answer:
      "Les listes génériques que l'on trouve sur internet ou chez le notaire sont toujours incomplètes, puisqu'elles ne couvent que le tronc commun des documents à fournir, sans tenir compte des spécificités de votre situation. Vous devrez ensuite multiplier les allers-retours avec le notaire pour comprendre ce qui manque, ce qui peut faire perdre plusieurs semaines voire mois sur la vente.",
  },
  {
    title: "Qu'est-ce que j'obtiens, concrètement ?",
    answer:
      "Un récapitulatif clair et structuré de tous les documents à fournir au notaire et adapté à votre situation spécifique, qui vous permettra d'éviter les retards sur la vente.",
  },
];

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Trouver les documents à fournir au notaire pour la vente de mon bien immobilier",
  description:
    "Découvrez comment préparer efficacement votre dossier de vente pour le notaire et éviter les retards à la signature. Notre outil vous guide étape par étape pour rassembler tous les documents nécessaires, même si vous ne savez pas par où commencer.",
  url: `${baseUrl}/vente-documents-notaire`,
}));

useHead({
  title:
    "Évitez les retards à la signature, préparez votre dossier de vente immobilière",
  meta: [
    {
      name: "description",
      content:
        "Répondez à quelques questions rapides et gagnez des semaines sur votre vente immobilière, même si vous ne savez pas par où commencer.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content:
        "Évitez les retards à la signature, préparez votre dossier de vente immobilière",
    },
    {
      property: "og:url",
      content: `${baseUrl}/vente-documents-notaire`,
    },
    {
      property: "og:description",
      content:
        "Répondez à quelques questions rapides et gagnez des semaines sur votre vente immobilière, même si vous ne savez pas par où commencer.",
    },
  ],
});
</script>
<template>
  <Container>
    <div class="centered-hero">
      <div class="centered-hero__text">
        <ReviewScore :reviews />
        <h1 class="centered-hero__text__title">
          Acheteur déjà trouvé ?
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
          Évitez les retards à la signature, préparez tous vos documents pour le
          notaire même si vous ne savez pas par où commencer.
        </p>
        <div class="centered-hero__text__link">
          <NuxtLink
            to="/outils/checklist-dossier-vente-notaire"
            aria-label="Gagner des semaines sur ma vente"
            style="width: 100%"
          >
            <UIPrimaryButton variant="accent-color" icon="hands_clapping_fill">
              Gagner des semaines sur ma vente
            </UIPrimaryButton></NuxtLink
          >
        </div>
      </div>
    </div>
  </Container>
  <Container
    ><Benefits
      title="N'attendez pas que le notaire vous rappelle"
      subtitle="Un oubli peut retarder ou bloquer la vente 🚫"
      text="Nous vous guidons étape par étape pour rassembler tous les documents nécessaires, sans stress ni confusion."
    />
    <div class="feature-cards">
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
          icon="hands_clapping_fill"
          style="max-width: none"
        >
          Commencer gratuitement
        </UIPrimaryButton>
      </NuxtLink>
    </div></Container
  >

  <Container>
    <h3 class="feature-cards__title">Les questions que l'on se pose tous 🙋‍♀️</h3>
    <FAQComponent :questions="objections" />
  </Container>
  <Container
    ><ImageBanner
      title="Besoin de vendre rapidement ?"
      subtitle="Évitez les retards, les erreurs, et les allers retours qui font trainer la vente."
      link-path="/outils/checklist-dossier-vente-notaire"
      link-label="Je prépare mon dossier en quelques clics"
      :image-path="bannerImage"
      :perks="[
        {
          title: 'Rapide et facile à utiliser',
          icon: 'sparkle',
        },
        {
          title: 'Dossier complet et organisé',
          icon: 'list_checks',
        },
        {
          title: 'Gain de temps immédiat',
          icon: 'clock_countdown',
        },
      ]"
  /></Container>
  <Container>
    <div class="headlines">
      <h2 class="headlines__title">Témoignages</h2>
      <h3 class="headlines__subtitle paragraphs">
        Leurs avis valent mieux que tous nos arguments
      </h3>
    </div>
    <ReviewsCarousel :reviews />
    <div id="last-chance" class="last-chance">
      <div class="last-chance__text">
        <h2 class="last-chance__text__title">
          Si vous êtes arrivé jusque-là, c'est qu'il est temps d'essayer.
        </h2>
        <p class="last-chance__text__subtitle">
          Évitez les retards et les erreurs qui coutent cher.<br />
          Rejoinez les milliers de vendeurs qui ont déjà gagné des semaines sur
          leur vente.
        </p>
      </div>
      <div class="last-chance__links">
        <NuxtLink
          to="/outils/checklist-dossier-vente-notaire"
          class="last-chance__links__link"
        >
          <UIPrimaryButton variant="accent-color" icon="hands_clapping_fill">
            Obtenir mon récapitulatif en 5 minutes
          </UIPrimaryButton>
        </NuxtLink>
        <NuxtLink to="#faq" class="last-chance__links__link">
          <UISecondaryButton variant="accent-color" icon="question">
            J'ai encore des questions
          </UISecondaryButton>
        </NuxtLink>
      </div>
    </div>
  </Container>

  <Container
    ><h3 id="faq" class="feature-cards__title">Questions fréquentes 🤔</h3>
    <FAQComponent :questions />
    <UILogosCarousel />
  </Container>

  <HotjarTracking />
</template>
<style lang="scss" scoped>
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

.svg-underline {
  display: block;
  position: absolute;
  right: 2px;
  bottom: -4px;
  height: 6px;
  width: calc(45% - 2px);
  fill: none;
  stroke: var(--underline-color, #ffbf00);
  stroke-width: 3px;
  stroke-linecap: round;
  overflow: visible;
  stroke-dasharray: 150; // longueur
  stroke-dashoffset: 150;
  transition: stroke-dashoffset 0.6s ease;
  transform: translateX(-20%);
}

.centered-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 8rem);
  gap: 2rem;
  color: $text-color;
  width: 100%;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 100vw;
    height: calc(100vh - 6rem);
    background-image: url("@/assets/images/buildings.svg");
    opacity: 0.8;
    background-position: center;
    background-size: cover;
    z-index: -1;
    pointer-events: none;
    transition: opacity 0.5s ease-in-out;
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
        max-width: 44rem;
      }
    }

    &__link {
      color: $text-color;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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

.last-chance {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  color: $text-color;
  width: 100%;
  background-color: $primary-color;
  border-radius: calc($radius/2);
  padding: 2rem;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 2rem;
    gap: 3rem;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 49rem;
    text-align: center;
    align-items: center;

    @media (min-width: $big-tablet-screen) {
      gap: 1.5rem;
    }

    &__title {
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      font-weight: $semi-bold;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 2.5rem;
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $regular;
      color: $text-color-faded;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      gap: 2rem;
    }

    &__link {
      width: 100%;
      max-width: 24rem;
    }
  }
}
</style>
