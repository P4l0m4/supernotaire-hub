<script setup lang="ts">
import { ref, onMounted } from "vue";

import coins from "@/assets/images/money-jar-71.svg";
import relation from "@/assets/images/marketing-1-30.svg";
import contact from "@/assets/images/note-taking-100.svg";
import hero from "@/assets/images/fly.svg";
import dots from "@/assets/images/dots-big.svg";

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
    title: "Solution gratuite",
    subtitle:
      "Sans frais, de l’ouverture du dossier à la signature de l’acte de vente",
    description:
      "Ouverture et constitution autonomes des dossiers, pré-rédaction des actes et signatures qualifiées gratuites, sans quitter votre navigateur.",
    image: coins,
    color: colors["success-color"],
  },
  {
    title: "Apport d’Affaires",
    subtitle: "Etendez votre visibilité à l’échelle nationale",
    description:
      "Notre annuaire en ligne facilite la mise en relation avec vos prospects. Recevez des demandes d’ouverture de dossiers sans effort commercial supplémentaire.",
    image: relation,
    color: colors["purple-color"],
    reverse: true,
  },
  {
    title: "Déontologie respectée",
    subtitle: "Gagnez du temps sur les tâches à faible valeur ajoutée",
    description:
      "Avec Supernotaire, vous vous débarassez des tâches répétitives à faible valeur ajoutée tout en préservant votre devoir de conseil. Vous gardez toujours le contrôle du temps que vous y consacrez.",
    image: contact,
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
          <UIPrimaryButton variant="accent-color" icon="arrow_right">
            Créer un dossier
          </UIPrimaryButton>
          Sans frais, de l'ouverture à la signature.
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
      title="Notaires débordés"
      subtitle="+ 60% de temps facturable"
      text="Constituez les dossiers sans avoir courrir après les parties prenantes.
        et automatisez les tâches répétitives à faible valeur ajoutée."
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
    <Tarifs />
  </Container>
  <HotjarTracking />
</template>
