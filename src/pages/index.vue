<script setup lang="ts">
import { ref, onMounted } from "vue";
import { stringToSlug } from "@/utils/slugify";
import { useStoryblokApi } from "@storyblok/vue";

import notary from "@/assets/images/accountant-54.svg";
import seller from "@/assets/images/real-estate-agent-76.svg";
import hero from "@/assets/images/super-hero.svg";
import dots from "@/assets/images/dots-big.svg";

import logo from "/favicon-96x96.png";

import type { Decoration } from "@/components/UI/profile.vue";

const tutorials = ref<any[]>([]);
const carouselElements = ref<any[]>([]);

const url = ref();

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
  title: "Supernotaire | Finalisation rapide de vente immobilière",
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
      content: "Supernotaire | Finalisation rapide de vente immobilière",
    },
    {
      property: "og:url",
      content: "https://supernotaire.fr/",
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
  name: "Supernotaire | Finalisation rapide de vente immobilière",
  description:
    "La plateforme qui accélère la finalisation des ventes immobilières pour les notaires débordés et les vendeurs pressés.",
  url: url.value,
}));

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Supernotaire",
  operatingSystem: "Web",
  applicationCategory: "Legal, BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  url: "https://www.supernotaire.fr",
  logo: `https://www.supernotaire.fr/${logo}`,
  image:
    "https://opengraph.b-cdn.net/production/images/a20c3e90-cc8a-4e2d-9841-b0e973037764.png?token=94GB_JSm5iZfopHGGLQTr5sxi1J4xl9L2EXPVPwg3hE&height=651&width=1200&expires=33287987916",
  description:
    "Supernotaire est une plateforme en ligne qui fait gagner du temps aux notaires, mais aussi aux vendeurs et acheteurs de biens immobiliers: constitution autonome des dossiers, formalités immobilières faciles, pré-rédaction des documents, RDV rapide en ligne, etc.",
  publisher: {
    "@type": "Organization",
    name: "Supernotaire",
    url: "https://www.supernotaire.fr",
  },
}));

onMounted(async () => {
  url.value = window.location.href;

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
    <div class="hero">
      <div class="hero__text">
        <h1 class="hero__text__title">
          La plateforme qui accélère la finalisation des ventes immobilières
        </h1>
        <p class="hero__text__subtitle">
          Digital, intuitif et sans-frontières. Pour les vendeurs pressés et les
          notaires débordés.
        </p>
        <div class="hero__text__link">
          <NuxtLink
            to="#profiles"
            aria-label="Découvrir notre offre"
            style="width: 100%"
          >
            <UIPrimaryButton variant="accent-color">
              Découvrir notre offre
            </UIPrimaryButton></NuxtLink
          >
          Sans frais, de la création du dossier à la signature de l’acte de
          vente.
        </div>
      </div>
      <div class="hero__image">
        <img
          :src="hero"
          alt="Supernotaire, la plateforme qui accélère la finalisation des ventes immobilières"
        />
        <img class="hero__image__dots" :src="dots" alt="dots" />
      </div>
    </div>
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
