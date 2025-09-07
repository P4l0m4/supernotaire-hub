<script setup lang="ts">
import { stringToSlug } from "@/utils/slugify";

const story = await useAsyncStoryblok("tutoriels", {
  version: "published",
});

const route = useRoute();
const tutorialSlug = route.params.slug;
const tutorial = story.value.content.tutorials.find(
  (f: any) => stringToSlug(f.title) === tutorialSlug
);

useHead({
  title: `${tutorial.title}`,
  meta: [
    {
      name: "description",
      content: tutorial.description,
    },
  ],
});
</script>
<template>
  <Container>
    <JsonLDHowTo
      :tutorial-title="tutorial.title"
      :tutorial-description="tutorial.description"
      :tutorial-preview-image="tutorial.previewImage.filename"
      :tutorial-total-time="tutorial.totalTime"
      :tutorial-cost="tutorial.estimatedCost"
      :tutorial-prerequisites="tutorial.prerequisites"
      :tutorial-options="tutorial.options"
      :tutorial-references="tutorial.ref"
      :tutorial-last-update="tutorial.lastUpdate"
      :key="stringToSlug(tutorial.title)"
    />
  </Container>
</template>
