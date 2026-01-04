<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://supernotaire.fr";

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Supernotaire | Checklist dossier de vente",
  description:
    "Créez une checklist personnalisée des informations et documents à fournir au notaire pour votre dossier de vente.",
  url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
}));

useHead({
  title: "Supernotaire | Checklist dossier de vente",
  meta: [
    {
      name: "description",
      content:
        "Créez une checklist personnalisée des informations et documents à fournir au notaire pour votre dossier de vente.",
    },
  ],
});
</script>

<template>
  <Container>
    <div id="checklist-dossier-vente-notaire" class="checklist-tool">
      <div class="checklist-tool__headlines">
        <h1 class="checklist-tool__headlines__title titles">
          Checklist dossier de vente immobilière
        </h1>
        <span class="checklist-tool__headlines__subtitle subtitles">
          Générez une liste personnalisée des informations et documents à
          fournir à votre notaire pour la vente de votre bien immobilier.
        </span>
      </div>
    </div>
    <ChecklistDossierVenteNotaire />
  </Container>
</template>

<style scoped lang="scss">
.checklist-tool {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    margin-top: 2rem;
    gap: 4rem;
    height: 100%;
    align-items: center;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      text-align: center;
      text-wrap: balance;
    }

    &__subtitle {
      text-align: center;
      text-wrap: balance;
    }
  }
}
</style>
