<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref, computed } from "vue";
import { stringToSlug } from "@/utils/slugify";

const tutorials = ref<any[]>([]);
const carouselElements = ref<any[]>([]);
const siteUrl = "https://easycase.fr";

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });
  tutorials.value = data.stories[0].content.tutorials;
  // filter to get only tutorials sharing at least one subject with the current tutorial
  const currentSubjects = tutorial.value.subjects;
  // remove current tutorial from the list
  carouselElements.value = tutorials.value
    .filter((t: any) =>
      t.subjects?.some((s: string) => currentSubjects.includes(s))
    )
    .filter((t: any) => stringToSlug(t.title) !== tutorialSlug)
    .map((t: any) => ({
      link: `/tutoriels/${stringToSlug(t.title)}`,
      image: t.previewImage.filename,
      label: t.title,
    }));
});

const route = useRoute();
const tutorialSlug = route.params.slug;
const tutorial = computed(() =>
  tutorials.value.find((f: any) => stringToSlug(f.title) === tutorialSlug)
);

useJsonld(() => {
  const t = tutorial.value;
  if (!t) return undefined;
  const url = `${siteUrl}/tutoriels/${tutorialSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t.title,
    description: t.description,
    image: t.previewImage?.filename,
    author: {
      "@type": "Organization",
      name: "EasyCase",
    },
    publisher: {
      "@type": "Organization",
      name: "EasyCase",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(t.lastUpdate && { datePublished: t.lastUpdate }),
    ...(t.lastUpdate && { dateModified: t.lastUpdate }),
    ...(t.subjects && { articleSection: t.subjects }),
    url,
  };
});

useHead(() => {
  if (!tutorial.value) return {};
  return {
    title: tutorial.value.title,
    meta: [
      {
        name: "description",
        content: tutorial.value.description,
      },
    ],
  };
});
</script>
<template>
  <Container>
    <JsonLDHowTo
      v-if="tutorial"
      :tutorial-title="tutorial.title"
      :tutorial-description="tutorial.description"
      :tutorial-preview-image="tutorial.previewImage.filename"
      :tutorial-total-time="tutorial.totalTime"
      :tutorial-cost="tutorial.estimatedCost"
      :tutorial-prerequisites="tutorial.prerequisites"
      :tutorial-clarification="tutorial.clarification"
      :tutorial-options="tutorial.options"
      :tutorial-references="tutorial.references"
      :tutorial-last-update="tutorial.lastUpdate"
      :tutorial-subjects="tutorial.subjects"
      :key="stringToSlug(tutorial.title)"
    />
  </Container>
  <Container v-if="carouselElements.length > 3">
    <h3 class="titles">Tutoriels en lien avec ce sujet</h3>

    <UICarouselComponent :carousel-elements="carouselElements"
  /></Container>
</template>

<style scoped lang="scss">
.titles {
  width: 100%;
}
</style>
