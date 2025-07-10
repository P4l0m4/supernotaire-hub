<script setup lang="ts">
import { stringToSlug } from "@/utils/slugify";

const story = await useAsyncStoryblok("tutoriels", {
  version: "published",
});
</script>

<template>
  <Container>
    <JsonLDHowTo
      v-for="tutorial in story.content.tutorials"
      :tutorial-title="tutorial.title"
      :tutorial-description="tutorial.description"
      :tutorial-preview-image="tutorial.previewImage.filename"
      :tutorial-total-time="tutorial.totalTime"
      :tutorial-cost="tutorial.estimatedCost"
      :tutorial-prerequisites="tutorial.prerequisites"
      :tutorial-options="tutorial.options"
      :tutorial-references="tutorial.references"
      :tutorial-last-update="tutorial.lastUpdate"
      :key="stringToSlug(tutorial.title)"
    />
  </Container>
</template>
