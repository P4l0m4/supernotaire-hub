<script setup lang="ts">
import signature from "@/assets/images/signature.jpg";
import vespa from "@/assets/images/vespa.jpg";
import securite from "@/assets/images/securite.jpg";

useHead({
  title: "Finalisation rapide de vente immobilière | Supernotaire",
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
      content: "Finalisation rapide de vente immobilière | Supernotaire",
    },
    {
      property: "og:url",
      content:
        "https://opengraph.b-cdn.net/production/images/0d54207b-5b60-4086-9160-a5b7df6bf2c6.jpg?token=iHNWoqdZlZfJaFO_MRtDAX6VyogK9vW0tj-ShcS9QsQ&height=982&width=968&expires=33284606311",
    },
    {
      property: "og:image",
      content: "https://martinimmo.n/og-image.jpg",
    },
    {
      property: "og:description",
      content:
        "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
    },
  ],
});

const articles = [
  {
    image: signature,
    title: "Accès facilité aux notaires",
    description:
      "Découvrez comment créer un dossier de vente immobilière en quelques étapes simples.",
    link: "/comment-ca-marche",
  },
  {
    image: vespa,
    title: "Démarches allégées",
    description:
      "Apprenez les avantages de la digitalisation dans le processus de vente immobilière.",
    link: "/comment-ca-marche",
  },
  {
    image: securite,
    title: "Sécurité et confidentialité",
    description:
      "Vos documents et vos données sont protégés par des mesures de sécurité avancées. Supernotaire garantit la confidentialité de vos informations personnelles et administratives.",
    link: "/comment-ca-marche",
  },
];
</script>
<template>
  <Container>
    <div class="hero">
      <h1 class="hero__title">
        Finalisez vos ventes immobilières à la vitesse de l’éclair
      </h1>
      <p class="paragraphs">
        Créez facilement votre dossier de vente immobilière et confiez-le
        rapidement à un notaire, où que vous soyez.<br />Suivez en direct la
        progression de votre dossier et ne fournissez jamais les mêmes
        informations deux fois.
      </p>
      <NuxtLink to="/" class="hero__link">
        <PrimaryButton variant="accent-color" icon="arrow_right">
          Créer mon dossier
        </PrimaryButton>
        C'est totalement gratuit !
      </NuxtLink>
    </div>
    <div class="perks">
      <ArticlePreview
        v-for="article in articles"
        :key="article.title"
        :image="article.image"
        :title="article.title"
        :description="article.description"
        :link="article.link"
      />
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(70vh);
  gap: 2rem;
  padding: 1rem;
  background-image: linear-gradient(
      45deg,
      rgba($text-color, 0),
      rgba($text-color, 0.6)
    ),
    url("@/assets/images/vente.webp");
  border-radius: $radius;
  background-size: cover;
  background-position: center;
  color: $text-color-alt;

  @media (min-width: $big-tablet-screen) {
    padding: 2rem;
  }

  &__title {
    font-size: 2.5rem;
    font-weight: $bold;
    text-wrap: balance;

    @media (min-width: $big-tablet-screen) {
      font-size: 4rem;
      max-width: 80%;
    }
  }

  &__link {
    color: $text-color-alt;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: fit-content;
  }
}

.perks {
  display: flex;
  gap: 2rem;
  height: fit-content;
  flex-direction: column;

  @media (min-width: $tablet-screen) {
    flex-direction: row;
  }
}
</style>
