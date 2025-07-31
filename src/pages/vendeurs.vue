<script setup lang="ts">
import { ref, onMounted } from "vue";

import annuaire from "@/assets/videos/annuaire.mp4";
import dossier from "@/assets/videos/dossier.mp4";
import progress from "@/assets/videos/progress.mp4";

import { colors } from "@/utils/colors";

const url = ref();

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

const features = ref([
  {
    title: "Démarches allégées",
    subtitle: "Trouvez et envoyez vos documents facilement",
    description:
      "Grâce à nos formulaires intelligents, vous êtes sûr(e) de déposer le bon document au bon endroit et ne fournissez jamais les mêmes informations deux fois.",
    video: dossier,
    color: colors["accent-color"],
  },
  {
    title: "Accès facilité aux notaires",
    subtitle: "N’attendez plus pour confier votre dossier à un notaire",
    description:
      "Pas de contraintes géographiques ! Confiez votre dossier à un notaire disponible n’importe où en France en quelques jours, pas en quelques semaines.",
    video: annuaire,
    color: colors["purple-color"],
    reverse: true,
  },
  {
    title: "Suivi en temps réel",
    subtitle: "Suivez la progression de votre dossier en temps réel",
    description:
      "Visualisez votre propre progression ainsi que celle de votre notaire et de votre acheteur. Dès que la collecte des informations avance, vous êtes prévenu de la prochaine action à réaliser.",
    video: progress,
    color: colors["success-color"],
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
          Accélérez la finalisation de vos ventes immobilières
        </h1>
        <p class="hero__text__subtitle">
          Créez facilement votre dossier de vente immobilière et confiez-le
          rapidement à un notaire, où que vous soyez.
        </p>
        <NuxtLink to="/inscription" class="hero__text__link">
          <PrimaryButton variant="accent-color" icon="arrow_right">
            Créer mon dossier
          </PrimaryButton>
          C'est totalement gratuit !
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
      title="Vendeurs de biens immobiliers"
      subtitle="+ 80% d’efficacité dans vos démarches"
      text="Trouvez vos documents et informations sans prise de tête, déposez vos
        papiers et laissez l’IA remplir les formalités à votre place."
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
