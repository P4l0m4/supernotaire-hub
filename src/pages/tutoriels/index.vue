<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref } from "vue";
import { stringToSlug } from "@/utils/slugify";

const tutorials = ref<any[]>([]);
const carouselElements = ref<any[]>([]);

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });
  tutorials.value = data.stories[0].content.tutorials;

  carouselElements.value = tutorials.value.map((tutorial: any) => ({
    link: `/tutoriels/${stringToSlug(tutorial.title)}`,
    image: tutorial.previewImage.filename,
    label: tutorial.title,
  }));
});
</script>

<template>
  <Container>
    <div class="headlines">
      <h1 class="headlines__title">Tutoriels faciles</h1>
      <h2 class="headlines__subtitle paragraphs">
        On vous guide pas à pas dans vos démarches immobilières
      </h2>
    </div>
    <UICarouselComponent :carousel-elements="carouselElements" />
  </Container>
</template>
