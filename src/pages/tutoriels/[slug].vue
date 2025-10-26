<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref, computed } from "vue";
import { stringToSlug } from "@/utils/slugify";

const tutorials = ref<any[]>([]);
const carouselElements = ref<any[]>([]);

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });
  tutorials.value = data.stories[0].content.tutorials;
  // filter to get only tutorials sharing at least one subject with the current tutorial
  const currentSubjects = tutorial.value.subjects;
  carouselElements.value = tutorials.value
    .filter((t: any) =>
      t.subjects?.some((s: string) => currentSubjects.includes(s))
    )
    .map((t: any) => ({
      link: `/tutoriels/${stringToSlug(t.title)}`,
      image: t.previewImage.filename,
      label: t.title,
    }));

  // carouselElements.value = tutorials.value.map((tutorial: any) => ({
  //   link: `/tutoriels/${stringToSlug(tutorial.title)}`,
  //   image: tutorial.previewImage.filename,
  //   label: tutorial.title,
  // }));
});

const route = useRoute();
const tutorialSlug = route.params.slug;
const tutorial = computed(() =>
  tutorials.value.find((f: any) => stringToSlug(f.title) === tutorialSlug)
);

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
