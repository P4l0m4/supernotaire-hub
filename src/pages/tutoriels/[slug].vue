<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted } from "vue";
import { stringToSlug } from "@/utils/slugify";

const tutorials = ref<any[]>([]);

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });
  tutorials.value = data.stories[0].content.tutorials;
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
      :key="stringToSlug(tutorial.title)"
    />
  </Container>
</template>
