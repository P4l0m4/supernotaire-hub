<script setup lang="ts">
import { ref, onMounted } from "vue";
import { stringToSlug } from "@/utils/slugify";
import { useStoryblokApi } from "@storyblok/vue";

import notary from "@/assets/images/accountant-54.svg";
import seller from "@/assets/images/real-estate-agent-76.svg";

import logo from "/favicon-96x96.png";

import type { Decoration } from "~/components/UI/Profile.vue";

const tutorials = ref<any[]>([]);
const carouselElements = ref<any[]>([]);

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const profiles = ref([
  {
    image: notary,
    title: "Notaires débordés",
    subtitle: "Gagnez du temps facturable et élargissez votre clientèle.",
    link: "/notaires#features",
    linkText: "Montrez-moi comment",
    decoration: "left" as Decoration,
  },
  {
    image: seller,
    title: "Vendeurs pressés",
    subtitle:
      "Facilitez vos démarches et accédez plus rapidement à un notaire.",
    link: "/vendeurs#features",
    linkText: "Montrez-moi comment",
    decoration: "right" as Decoration,
  },
]);

useHead({
  title: "EasyCase | Finalisation rapide de vente immobilière",
  meta: [
    {
      name: "description",
      content:
        "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
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
      content: `${baseUrl}/`,
    },
    {
      property: "og:image",
      content:
        "https://opengraph.b-cdn.net/production/images/a20c3e90-cc8a-4e2d-9841-b0e973037764.png?token=94GB_JSm5iZfopHGGLQTr5sxi1J4xl9L2EXPVPwg3hE&height=651&width=1200&expires=33287987916",
    },
    {
      property: "og:description",
      content:
        "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
    },
  ],
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EasyCase | Ne perdez plus de temps sur vos ventes immobilières",
  description:
    "La plateforme qui facilite et accélère la finalisation des ventes immobilières pour les notaires débordés et les vendeurs pressés.",
  url: `${baseUrl}/`,
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
  url: `${baseUrl}/`,
  logo: `https://www.easycase.fr/${logo}`,
  image:
    "https://opengraph.b-cdn.net/production/images/a20c3e90-cc8a-4e2d-9841-b0e973037764.png?token=94GB_JSm5iZfopHGGLQTr5sxi1J4xl9L2EXPVPwg3hE&height=651&width=1200&expires=33287987916",
  description:
    "EasyCase est une plateforme en ligne qui fait gagner du temps aux notaires, mais aussi aux vendeurs et acheteurs de biens immobiliers: constitution autonome des dossiers, formalités immobilières faciles, pré-rédaction des documents, RDV rapide en ligne, etc.",
  publisher: {
    "@type": "Organization",
    name: "EasyCase",
    url: `${baseUrl}/`,
  },
}));

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });
  tutorials.value = data.stories[0].content.tutorials;

  carouselElements.value = tutorials.value.map((tutorial: any) => ({
    link: `/tutoriels/${stringToSlug(tutorial.title)}`,
    image: tutorial.previewImage.filename,
    label: tutorial.title,
  }));
});
</script>
<template>
  <Container>
    <div class="centered-hero">
      <div class="centered-hero__text">
        <h1 class="centered-hero__text__title">
          Gagnez des semaines sur vos ventes immobilières
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
          EasyCase fait avancer la paperasse des vendeurs pressés et des
          notaires débordés.
        </p>
        <div class="centered-hero__text__link">
          <NuxtLink
            to="/inscription"
            aria-label="Découvrir notre offre"
            style="width: 100%"
          >
            <UIPrimaryButton variant="accent-color" icon="arrow_right">
              Créer gratuitement mon dossier
            </UIPrimaryButton></NuxtLink
          >
        </div>
      </div>
    </div>
    <UILogosCarousel />
  </Container>
  <Container>
    <div id="profiles" class="profiles">
      <UIProfile
        v-for="profile in profiles"
        :key="profile.title"
        :image="profile.image"
        :title="profile.title"
        :subtitle="profile.subtitle"
        :link="profile.link"
        :linkText="profile.linkText"
        :decoration="profile.decoration"
      />
    </div>
  </Container>
  <Container><UIRoadmap /></Container>
  <Container>
    <UIDidYouKnow title="Des outils gratuits sont disponibles pour vous aider.">
      <template #text>
        Nous avons conçu des outils intuitifs et en accès libre pour vous aider
        à avancer dans vos démarches immobilières: création de pré-état daté,
        estimation de valeur foncière, etc. Aucune inscription n'est requise.
      </template>
      <template #cta>
        <NuxtLink to="/outils" aria-label="Découvrir nos outils">
          <UIPrimaryButton variant="accent-color"
            >Découvrir nos outils</UIPrimaryButton
          >
        </NuxtLink>
      </template>
    </UIDidYouKnow>
  </Container>
  <Container>
    <div class="headlines">
      <h2 class="headlines__title">Tutoriels faciles</h2>
      <h3 class="headlines__subtitle paragraphs">
        Pour vous guider pas à pas dans vos démarches immobilières.
      </h3>
    </div>
    <UICarouselComponent :carousel-elements="carouselElements" />
  </Container>

  <HotjarTracking />
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
  left: 16px;
  bottom: -6px;
  height: 6px;
  width: calc(40% - 2px);
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

.profiles {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  min-height: 400px;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    justify-content: space-between;
    height: fit-content;
  }

  @media (min-width: $desktop-screen) {
    gap: 4rem;
  }
}
</style>
