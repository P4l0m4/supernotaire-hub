<script setup lang="ts">
import { ref, onMounted } from "vue";

import annuaire from "@/assets/images/time-39.svg";
import dossier from "@/assets/images/files-and-folder-78.svg";
import progress from "@/assets/images/checklist-71.svg";
import hero from "@/assets/images/pool.svg";
import dots from "@/assets/images/dots-big.svg";

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
    image: dossier,
    color: colors["accent-color"],
  },
  {
    title: "Accès facilité aux notaires",
    subtitle: "N’attendez plus pour confier votre dossier à un notaire",
    description:
      "Pas de contraintes géographiques ! Confiez votre dossier à un notaire disponible n’importe où en France en quelques jours, pas en quelques semaines.",
    image: annuaire,
    color: colors["purple-color"],
    reverse: true,
  },
  {
    title: "Suivi en temps réel",
    subtitle: "Suivez la progression de votre dossier en temps réel",
    description:
      "Visualisez votre propre progression ainsi que celle de votre notaire et de votre acheteur. Dès que la collecte des informations avance, vous êtes prévenu de la prochaine action à réaliser.",
    image: progress,
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
      <div class="hero__image">
        <img
          :src="hero"
          alt="Supernotaire, la plateforme qui accélère la finalisation des ventes immobilières"
        />
        <img class="hero__image__dots" :src="dots" alt="dots" />
      </div>
    </div>
    <Benefits
      title="Vendeurs de biens immobiliers"
      subtitle="+ 80% d’efficacité dans vos démarches"
      text="Trouvez vos documents et informations sans prise de tête, déposez vos
        papiers et laissez l’IA remplir les formalités à votre place."
    />
    <div id="features" class="features">
      <FeatureComponent
        v-for="feature in features"
        :key="feature.title"
        :title="feature.title"
        :subtitle="feature.subtitle"
        :description="feature.description"
        :image="feature.image"
        :color="feature.color"
        :reverse="feature.reverse"
      />
    </div>
  </Container>
  <HotjarTracking />
</template>
