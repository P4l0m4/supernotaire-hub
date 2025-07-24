<script setup lang="ts">
useHead({
  title:
    "Avancez plus rapidement sur votre dossier de vente immobilière | Supernotaire",
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
      content:
        "Avancez plus rapidement sur votre dossier de vente immobilière | Supernotaire",
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

const perks = [
  {
    icon: "lightning",
    title: "Automatisation des tâches répétitives",
    description:
      "Gagnez du temps et réduisez les erreurs en automatisant les tâches redondantes. Pré-remplissage des documents, analyse des fichiers, parcours ultra-optimisés; nous nous vous guidons jusqu’au bout du processus pour une efficacité maximale.",
  },
  {
    icon: "sparkle",
    title: "Formulaires intelligents",
    description:
      "Ne renseignez jamais les mêmes informations deux fois grâce aux formulaires intelligents qui se pré-remplissent à partir des documents et informations que vous fournissez.",
  },
  {
    icon: "clock_countdown",
    title: "Suivi en temps réel",
    description:
      "Ne réclamez plus des informations. Suivez facilement la progression de vos dossiers de vente en temps réel et soyez notifié lorsque votre intervention est nécessaire. ",
  },
  {
    icon: "globe",
    title: "Digital & Sans frontières",
    description:
      "De la création du dossier à la signature de l’acte de vente, tout se fait en ligne. De quoi vous faire gagner du temps et vous libérer des contraintes géographiques.",
  },
  {
    icon: "lock_key",
    title: "Sécurité renforcée",
    description:
      "Vos documments et vos données sont protégés par des mesures de sécurité avancées. Supernotaire garantit la confidentialité de vos informations personnelles et administratives, conformément avec les plus hauts standards de sécurité informatique.",
  },
];
</script>
<template>
  <Container>
    <div class="hero">
      <h1 class="hero__title">Supernotaire.fr</h1>
      <p class="hero__subtitle paragraphs">
        Gagner du temps sans jamais compromettre la sécurité ni la déontologie
        notariale
      </p>
    </div>
    <div class="perks">
      <Perk
        v-for="perk in perks"
        :key="perk.title"
        :icon="perk.icon"
        :title="perk.title"
        :description="perk.description"
      />
      <NuxtLink to="/inscription" class="perks__link">
        <SecondaryButton
          variant="accent-color"
          icon="arrow_right"
          style="height: 100%; max-width: none"
        >
          Créer mon compte
        </SecondaryButton>
      </NuxtLink>
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  gap: 1rem;
  background-size: cover;
  background-position: center;
  color: $text-color;
  padding: 2rem 0;

  &__title {
    font-size: 2.5rem;
    font-weight: $bold;

    @media (min-width: $tablet-screen) {
      font-size: 3rem;
    }

    @media (min-width: $big-tablet-screen) {
      font-size: 4rem;
    }
  }

  &__subtitle {
    text-align: center;
    text-wrap: balance;
  }
}

.perks {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  height: fit-content;

  @media (min-width: $tablet-screen) {
    grid-template-columns: 1fr 1fr;
  }

  &__link {
    height: 100%;
  }
}
</style>
