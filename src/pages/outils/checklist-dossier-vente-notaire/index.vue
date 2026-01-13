<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://supernotaire.fr";

const breadcrumbs = ref([
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Outils",
    url: "/outils",
  },
  {
    name: "Checklists par rubrique",
    url: `${baseUrl}/outils/checklist-dossier-vente-notaire`,
  },
]);

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
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div id="checklist-dossier-vente-notaire" class="checklist-tool">
      <div class="checklist-tool__headlines">
        <h1 class="checklist-tool__headlines__title titles">
          Constituez votre dossier de vente immobilière
        </h1>
        <span class="checklist-tool__headlines__subtitle subtitles">
          Générez une liste personnalisée des informations et documents à
          fournir à votre notaire pour la vente de votre bien.
        </span>
      </div>
      <div class="checklist-tool__content">
        <DossierListeRubriques />
        <DossierExportMenu />
      </div>
    </div>
  </Container>
</template>

<style scoped lang="scss">
.checklist-tool {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: $big-tablet-screen) {
    gap: 3rem;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      max-height: calc(100vh - 17rem);
      overflow-y: hidden;
    }
  }
}
</style>
