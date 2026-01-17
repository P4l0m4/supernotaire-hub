<script setup lang="ts">
import logo from "/favicon-96x96.png";

import lightning from "@/assets/animated-icons/lightning-animated.svg?raw";
import clock from "@/assets/animated-icons/clock-animated.svg?raw";
import lock from "@/assets/animated-icons/lock-animated.svg?raw";

import interfaceMandats from "@/assets/images/interface-mandats.webp";
import interfaceDocuments from "@/assets/images/interface-documents.webp";
import interfaceFormulaires from "@/assets/images/interface-formulaires.webp";

import { colors } from "@/utils/colors";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const featureCards = [
  {
    icon: lightning,
    title: "Automatisations intelligentes",
    description:
      "Pré-remplissage des documents, analyse des fichiers, parcours ultra-optimisés et relances automatiques.",
  },
  {
    icon: clock,
    title: "Tableau de bord intuitif",
    description:
      "Suivez la progression de vos dossiers en temps réel, collaborez facilement avec vos clercs et soyez notifié lorsque votre intervention est nécessaire.",
  },
  {
    icon: lock,
    title: "Sécurité renforcée",
    description:
      "Vos documents et vos données sont protégés par des mesures de sécurité avancées, en conformité avec les plus hauts standards de sécurité informatique.",
  },
];

const steps = [
  {
    name: "Ouverture du dossier",
    beforeHours: 1.5,
    afterHours: 0.4,
    description: "Création du dossier, saisie des informations client et bien",
  },
  {
    name: "Collecte & vérifications",
    beforeHours: 6.0,
    afterHours: 1.9,
    description:
      "Collecte des pièces, vérifications juridiques et administratives",
  },
  {
    name: "Rédaction des documents",
    beforeHours: 3.5,
    afterHours: 1.5,
    description: "Avant-contrats, compromis, procurations, promesses, etc.",
  },
  {
    name: "Communication & relances",
    beforeHours: 2.5,
    afterHours: 1.0,
    description:
      "Échanges avec clients & agences, relances, planification, etc.",
  },
  {
    name: "Simulation & calculs notariés",
    beforeHours: 2.0,
    afterHours: 0.5,
    description: "Calculs, frais, plus-values, droits d’enregistrement, etc.",
  },
  {
    name: "Préparation de l’acte",
    beforeHours: 2.5,
    afterHours: 1.1,
    description: "Mise en forme, relecture, saisie.",
  },
  {
    name: "RDV & signatures",
    beforeHours: 3.0,
    afterHours: 2,
    description: "Organisation du rendez-vous, signature et explications.",
  },
  {
    name: "Formalités postérieures",
    beforeHours: 1.4,
    afterHours: 0.7,
    description: "Publication, enregistrement & clôture du dossier.",
  },
];

const questions = [
  {
    title: "Quand EasyCase sera-t-il officiellement lancé ?",
    answer:
      "Le lancement officiel de EasyCase est prévu pour le troisième trimestre 2026. En rejoignant l'accès anticipé, vous pourrez commencer à utiliser certaines fonctionnalités en avant-première.",
  },
  {
    title: "Quel sera le prix de EasyCase après la période d'accès anticipé ?",
    answer:
      "L'accès complet à EasyCase coûtera 280€ par mois et par notaire, ce qui inclut également deux sièges collaborateurs. En devenant Notaire Fondateur pendant l'accès anticipé, vous bénéficierez d'une réduction permanente de 70% sur ce tarif.",
  },
  {
    title: "EasyCase est-il gratuit pendant l'accès anticipé ?",
    answer:
      "Oui, EasyCase sera proposé gratuitement et exclusivement aux utilisateurs inscrits à l'accès anticipé. En devenant Notaire Fondateur, vous bénéficierez d'un tarif préférentiel même après le lancement officiel.",
  },
  {
    title: "EasyCase est-il gratuit pour les particuliers ?",
    answer:
      "Oui, EasyCase restera toujours gratuit pour les vendeurs et acheteurs de biens immobiliers.",
  },
];

const jsonLDFAQ = questions.map((question) => {
  return {
    "@type": "Question" as const,
    name: question.title,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: question.answer,
    },
  };
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage" as const,
  mainEntity: jsonLDFAQ,
}));

useHead({
  title: "EasyCase | Accès anticipé et pré-vente limitée",
  meta: [
    {
      name: "description",
      content:
        "Rejoignez l'accès anticipé de EasyCase et bénéficiez de tarifs avantageux ainsi qu'un accès privilégié aux fonctionnalités avant le lancement officiel.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "EasyCase | Finalisation rapide de vente immobilière",
    },
    {
      property: "og:url",
      content: "https://easycase.fr/",
    },
    {
      property: "og:image",
      content:
        "https://opengraph.b-cdn.net/production/images/a20c3e90-cc8a-4e2d-9841-b0e973037764.png?token=94GB_JSm5iZfopHGGLQTr5sxi1J4xl9L2EXPVPwg3hE&height=651&width=1200&expires=33287987916",
    },
    {
      property: "og:description",
      content:
        "Rejoignez l'accès anticipé de EasyCase et bénéficiez de tarifs avantageux ainsi qu'un accès privilégié aux fonctionnalités avant le lancement officiel.",
    },
  ],
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EasyCase | Finalisation rapide de vente immobilière",
  description:
    "La plateforme qui accélère la finalisation des ventes immobilières pour les notaires débordés et les vendeurs pressés.",
  url: `${baseUrl}/beta`,
}));

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EasyCase",
  operatingSystem: "Web",
  applicationCategory: "Legal, BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  url: "https://www.easycase.fr",
  logo: `https://www.easycase.fr/${logo}`,
  image:
    "https://opengraph.b-cdn.net/production/images/a20c3e90-cc8a-4e2d-9841-b0e973037764.png?token=94GB_JSm5iZfopHGGLQTr5sxi1J4xl9L2EXPVPwg3hE&height=651&width=1200&expires=33287987916",
  description:
    "EasyCase est une plateforme en ligne qui fait gagner du temps aux notaires, mais aussi aux vendeurs et acheteurs de biens immobiliers: constitution autonome des dossiers, formalités immobilières faciles, pré-rédaction des documents, RDV rapide en ligne, etc.",
  publisher: {
    "@type": "Organization",
    name: "EasyCase",
    url: `${baseUrl}`,
  },
}));
</script>
<template>
  <Container>
    <div class="centered-hero">
      <div class="centered-hero__text">
        <h1 class="centered-hero__text__title">
          Les jeunes notaires n’ont pas besoin de travailler plus. Ils ont
          besoin de meilleurs outils.
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
          EasyCase vous libère du temps sur les tâches qui n’ont pas besoin de
          vous.
        </p>
        <div class="centered-hero__text__link">
          <NuxtLink
            to="/inscription"
            aria-label="Réserver votre accès anticipé à EasyCase"
            style="width: 100%"
          >
            <UIPrimaryButton variant="accent-color" icon="hands_clapping_fill">
              Rejoindre l'accès anticipé
            </UIPrimaryButton></NuxtLink
          >
        </div>
      </div>
    </div>
  </Container>

  <Container>
    <Benefits
      title="Débordé, mais..."
      subtitle="...pas assez rentable pour recruter ?"
      text="Les études récemment créées croulent sous les dossiers, emails et relances clients.
Pourtant, le chiffre d’affaires ne suit pas, et recruter reste hors de portée."
    />
    <div class="feature-cards">
      <h3 class="feature-cards__title">
        Et si vous retrouviez le temps d’accompagner vos clients comme vous le
        souhaitez ?
      </h3>
      <UIFeatureCard
        v-for="featureCard in featureCards"
        :key="featureCard.title"
        :icon="featureCard.icon"
        :title="featureCard.title"
        :description="featureCard.description"
      />
      <NuxtLink to="/inscription" class="feature-cards__link">
        <UIPrimaryButton
          variant="accent-color"
          icon="arrow_right"
          style="max-width: none"
        >
          Rejoindre l'accès anticipé
        </UIPrimaryButton>
      </NuxtLink>
    </div>
  </Container>
  <Container>
    <UILandingShowcase
      title="Optimisez la gestion de vos dossiers, sans compromis sur l’accompagnement."
      highlightedTitle="sans compromis sur l’accompagnement."
      subtitle="EasyCase automatise les tâches répétitives à faible valeur ajoutée, pour vous laisser le temps de vous concentrer sur l’essentiel: vos clients."
      :imagePath="interfaceMandats"
  /></Container>
  <Container>
    <UILandingShowcase
      title="Gagnez en efficacité, ne renseignez plus jamais la même
      information deux fois."
      highlightedTitle="Gagnez en efficacité,"
      subtitle="Crééz vos propres modèles de documents, EasyCase se charge de les remplir à partir des informations du dossier."
      :imagePath="interfaceDocuments"
      reversed
    />
  </Container>
  <Container>
    <UILandingShowcase
      title="Collectez les pièces rapidement, sans stress pour vos clients."
      highlightedTitle="sans stress pour vos clients."
      subtitle="Laissez nous guider vos clients dans la collecte des éléments du dossier, même les plus complexes. Ils gagnent du temps, et vous aussi."
      :imagePath="interfaceFormulaires"
    />
  </Container>

  <Container>
    <h3 class="interface-title">Reprenez le contrôle de votre temps.</h3>
    <ComparativeTimeChart :steps="steps" />
  </Container>

  <Container><FounderPromo /></Container>

  <Container
    ><h3 class="feature-cards__title">Questions fréquentes</h3>
    <FAQComponent :questions />
  </Container>

  <Container><UILogosCarousel /></Container>
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

.interface-title {
  width: 100%;
  max-width: 80rem;
  text-align: center;
  font-size: 2rem;
  font-weight: $semi-bold;
  text-wrap: balance;
  margin-bottom: 1rem;

  @media (min-width: $big-tablet-screen) {
    font-size: 3rem;
    grid-column: span 3;
    margin-bottom: 2rem;
  }
}

.interface-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: $radius;
}

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

//accessibilité
@media (prefers-reduced-motion: reduce) {
  .float-slow,
  .float-fast {
    animation: none;
  }
}

.svg-underline {
  display: block;
  position: absolute;
  right: 2px;
  bottom: 0;
  height: 6px;
  width: calc(22% - 2px);
  fill: none;
  stroke: var(--underline-color, #ffbf00);
  stroke-width: 3px;
  stroke-linecap: round;
  overflow: visible;
  stroke-dasharray: 150; // longueur
  stroke-dashoffset: 150;
  transition: stroke-dashoffset 0.6s ease;
  transform: translateX(-65%);
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
    background: linear-gradient(
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
</style>
