<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { stringToSlug } from "@/utils/slugify";
import { useStoryblokApi } from "@storyblok/vue";
import { notariesPages } from "@/utils/notariesPages";
import { colors } from "@/utils/colors";

const carouselElements = ref<any[]>([]);
const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const breadcrumbs = computed(() => [
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Annuaire",
    url: `${baseUrl}/annuaire`,
  },
  {
    name: "Notaires par département",
    url: `${baseUrl}/annuaire/departement`,
  },
]);

const departementLinks = computed(() =>
  notariesPages.map((page) => ({
    title: `Classement des meilleurs notaires ${page.departementLabel} (${page.departementCode})`,
    subtitle: `${page.totalResults} notaires référencés pour ce département`,
    code: page.departementCode,
    to: `/annuaire/departement${page.slug}`,
  }))
);

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });

  carouselElements.value = data.stories[0].content.tutorials.map(
    (tutorial: any) => ({
      link: `/tutoriels/${stringToSlug(tutorial.title)}`,
      image: tutorial.previewImage.filename,
      label: tutorial.title,
    })
  );
});

useHead(() => ({
  title: `Meilleurs notaires par département`,
  meta: [
    {
      name: "description",
      content:
        "Classement des meilleurs notaires par département selon leurs notes et avis clients.",
    },
    { property: "og:title", content: "Meilleurs notaires par département" },
    {
      property: "og:description",
      content:
        "Classement des meilleurs notaires par département selon leurs notes et avis clients.",
    },
  ],
}));
</script>
<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div class="headlines">
      <h1 class="headlines__title">Meilleurs notaires par département</h1>
      <h2 class="headlines__subtitle paragraphs">
        Découvrez notre classement des meilleurs notaires français par
        département, basé sur les avis et notes de leurs clients.
      </h2>
    </div>
    <ul v-if="departementLinks.length" class="departements-list">
      <li v-for="dep in departementLinks" :key="dep.to">
        <NuxtLink :to="dep.to" :aria-label="`Voir ${dep.title}`">
          <SearchResultCard :title="dep.title">
            <UITagComponent
              icon="users_three_fill"
              :color="colors['accent-color']"
              >{{ dep.subtitle }}</UITagComponent
            >
          </SearchResultCard>
        </NuxtLink>
      </li>
    </ul>
  </Container>
  <Container>
    <div class="headlines">
      <h2 class="headlines__title">Besoin d'aide dans vos démarches ?</h2>
      <h3 class="headlines__subtitle paragraphs">
        Consultez nos tutoriels faciles pour vous guider pas à pas dans vos
        démarches immobilières.
      </h3>
    </div>

    <UICarouselComponent :carousel-elements="carouselElements" />
  </Container>
</template>

<style scoped lang="scss">
.departements-list {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  width: 100%;
}
</style>
