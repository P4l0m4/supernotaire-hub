<script setup lang="ts">
import { ref, onMounted } from "vue";
import { stringToSlug } from "@/utils/slugify";

const story = await useAsyncStoryblok("tutoriels", {
  version: "published",
});

const carouselElements = ref([]);

onMounted(() => {
  carouselElements.value = story.value.content.tutorials.map(
    (tutorial: any) => ({
      link: `/tutoriels/${stringToSlug(tutorial.title)}`,
      image: tutorial.previewImage.filename,
      label: tutorial.title,
    })
  );
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
