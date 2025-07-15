<script setup lang="ts">
import { ref, onMounted } from "vue";

import signature from "@/assets/images/signature.jpg";
import vespa from "@/assets/images/vespa.jpg";
import securite from "@/assets/images/securite.jpg";

import annuaire from "@/assets/videos/annuaire.mp4";
import documents from "@/assets/videos/documents.mp4";
import progress from "@/assets/videos/progress.mp4";
import form from "@/assets/videos/form.mp4";

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
    video: form,
    color: colors["accent-color"],
  },
  {
    title: "Accès facilité aux notaires",
    subtitle: "N’attendez plus pour confier votre dossier à un notaire",
    description:
      "Pas de contraintes géographiques ! Confiez rapidement votre dossier à un notaire disponible n’importe où en France.",
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

const features2 = ref([
  {
    title: "Collaboration maîtrisée",
    subtitle: "Collaborez facilement avec votre équipe",
    description:
      "Travaillez simultanément sur vos mandats tout en gardant le contrôle. Ajoutez facilement des membres à votre équipe et décidez de la visibilité des mandats pour chaque collaborateur.",
    video: signature,
    color: colors["warning-color"],
  },
  {
    title: "Suivi en temps réel",
    subtitle: "Suivez la progression de chaque mandat en temps réel",
    description:
      "Visualisez votre propre progression ainsi que celle des vendeurs et acheteurs. Dès que la collecte des informations avance, vous êtes prévenu de la prochaine action à réaliser.",
    video: progress,
    color: colors["purple-color"],
    reverse: true,
  },
  {
    title: "Déontologie respectée",
    subtitle: "Gagnez du temps sur les tâches sans valeur ajoutée",
    description:
      "Avec Supernotaire, vous pouvez vous débarasser des tâches répétitives et sans valeur ajoutée tout en préservant votre devoir de conseil. Vous gardez toujours le contrôle du temps que vous y consacrez.",
    video: securite,
    color: colors["accent-color"],
  },
  {
    title: "Sécurité et confidentialité",
    subtitle: "Transmettez vos documents en toute sécurité",
    description:
      "Vos documents et vos données sont protégés par des mesures de sécurité avancées. Supernotaire garantit la confidentialité des informations personnelles et des documents qui transitent sur la plateforme.",
    video: vespa,
    color: colors["success-color"],
    reverse: true,
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
    <div class="benefits">
      <h2 class="benefits__title">Vendeurs de biens immobilliers</h2>
      <span class="benefits__subtitle"
        >Jusqu’à 80% d’efficacité en plus grâce aux formulaires
        intelligents</span
      >
      <p class="benefits__text">
        Gagnez du temps, trouvez vos documents et informations sans prise de
        tête, déposez vos papiers et laissez l’IA remplir les formalités à votre
        place.
      </p>
    </div>
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
    <div class="benefits">
      <h2 class="benefits__title">
        Notaires spécialisés en ventes immobilieres
      </h2>
      <span class="benefits__subtitle"
        >Gagnez jusqu’à 60% de temps facturable</span
      >
      <p class="benefits__text">
        Récupérez les documents et informations des vendeurs et acheteurs sans
        avoir à leur courrir après. Nous les guidons tout au long du parcours.
      </p>
    </div>
    <div class="features">
      <FeatureComponent
        v-for="feature in features2"
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

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 0;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 0;
    gap: 2rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: $medium;
    color: $accent-color;
    text-transform: uppercase;

    @media (min-width: $big-tablet-screen) {
      font-size: 1.25rem;
    }
  }

  &__subtitle {
    font-size: 1.5rem;
    font-weight: $semi-bold;
    text-wrap: balance;

    @media (min-width: $big-tablet-screen) {
      font-size: 2.5rem;
    }
  }

  &__text {
    font-size: 1rem;
    color: $text-color-faded;
    text-wrap: balance;
    line-height: 1.35;

    @media (min-width: $big-tablet-screen) {
      font-size: 1.25rem;
    }
  }
}

.features {
  display: flex;
  gap: 2rem;
  height: fit-content;
  flex-direction: column;

  @media (min-width: $big-tablet-screen) {
    gap: 4rem;
  }

  @media (min-width: $desktop-screen) {
    gap: 8rem;
  }
}
</style>
