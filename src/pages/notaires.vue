<script setup lang="ts">
import { ref, onMounted } from "vue";

import securite from "@/assets/images/securite.jpg";

import relation from "@/assets/videos/relation.mp4";
import contact from "@/assets/videos/contact.mp4";

import { colors } from "@/utils/colors";

const url = ref();

useHead({
  title: "Supernotaire | Finalisation rapide de mandats de vente immobilière",
  meta: [
    {
      name: "description",
      content:
        "Digitalisez la gestion de vos mandats de vente immobilière, soyez visible à l’échelle nationale et gagnez du temps facturable.",
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

const features = ref([
  {
    title: "Digitalisation complète",
    subtitle:
      "Sans frais, de l’ouverture du dossier à la signature de l’acte de vente",
    description:
      "Ouverture et constitution autonomes des dossiers, pré-rédaction des actes et signatures qualifiées gratuites, sans quitter votre navigateur.",
    video: relation,
    color: colors["success-color"],
    reverse: true,
  },
  {
    title: "Apport d’Affaires",
    subtitle: "Etendez votre visibilité à l’échelle nationale",
    description:
      "Notre annuaire en ligne facilite la mise en relation avec vos prospects. Recevez des demandes d’ouverture de dossiers sans effort commercial supplémentaire.",
    video: contact,
    color: colors["purple-color"],
    reverse: true,
  },
  {
    title: "Déontologie respectée",
    subtitle: "Gagnez du temps sur les tâches à faible valeur ajoutée",
    description:
      "Avec Supernotaire, vous vous débarassez des tâches répétitives à faible valeur ajoutée tout en préservant votre devoir de conseil. Vous gardez toujours le contrôle du temps que vous y consacrez.",
    video: relation,
    color: colors["accent-color"],
  },
]);

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Supernotaire | Finalisation rapide de vente immobilière",
  description:
    "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
  url: url.value,
}));

onMounted(() => {
  url.value = window.location.href;
});
</script>
<template>
  <Container>
    <div class="hero">
      <div class="hero__text">
        <h1 class="hero__text__title">
          Gagnez du temps sur vos mandats de vente immobilière
        </h1>
        <p class="hero__text__subtitle">
          Facilitez la collecte des éléments du dossier, débarassez-vous des
          tâches répétitives et entrez en relation avec des clients partout en
          France.
        </p>
        <NuxtLink to="/inscription" class="hero__text__link">
          <PrimaryButton variant="accent-color" icon="arrow_right">
            Créer un dossier
          </PrimaryButton>
          Sans frais, de l'ouverture à la signature.
        </NuxtLink>
      </div>
      <div class="hero__pictures">
        <img
          class="hero__pictures__image"
          src="@/assets/images/signature.jpg"
          alt="finalisation vente immobilière"
        />
        <img
          class="hero__pictures__image"
          src="@/assets/images/securite.jpg"
          alt="vente immobilière rapide"
        />
        <img
          class="hero__pictures__image"
          src="@/assets/images/vente.webp"
          alt="mandat immobilier rapide"
        />
      </div>
    </div>

    <Benefits
      title="Notaires débordés"
      subtitle="+ 60% de temps facturable"
      text="Constituez les dossiers sans avoir courrir après les parties prenantes.
        et automatisez les tâches répétitives à faible valeur ajoutée."
    />
    <div class="features">
      <FeatureComponent
        v-for="feature in features"
        :key="feature.title"
        :title="feature.title"
        :subtitle="feature.subtitle"
        :description="feature.description"
        :video="feature.video"
        :color="feature.color"
        :reverse="feature.reverse"
      />
    </div>
  </Container>
  <HotjarTracking />
</template>
<style lang="scss" scoped>
.hero {
  display: flex;
  flex-direction: column;
  min-height: calc(70vh);
  gap: 2rem;
  color: $text-color;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 0;
    flex-direction: row;
    align-items: center;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    &__title {
      font-size: 1.85rem;
      font-weight: $bold;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: 3rem;
      }
    }

    &__subtitle {
      font-size: 1rem;
      line-height: 1.35;
      font-weight: $regular;
      text-wrap: balance;
      max-width: 600px;

      @media (min-width: $big-tablet-screen) {
        font-size: 1.25rem;
      }
    }

    &__link {
      color: $text-color;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      @media (min-width: $tablet-screen) {
        width: fit-content;
      }
    }
  }

  &__pictures {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    max-height: 460px;
    width: 100%;

    @media (min-width: $big-tablet-screen) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      max-width: 40vw;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: $radius;

      &:nth-of-type(1) {
        display: none;

        @media (min-width: $big-tablet-screen) {
          display: block;
          grid-column: span 2;
        }
      }
      &:nth-of-type(2) {
        display: none;

        @media (min-width: $big-tablet-screen) {
          display: block;
          grid-column: span 1;
        }
      }
      &:nth-of-type(3) {
        grid-column: span 3;
      }
    }
  }
}
</style>
