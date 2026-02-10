<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref, computed, watch } from "vue";
import { stringToSlug } from "@/utils/slugify";
import { useIsMobile } from "@/utils/otherFunctions";
import { colors } from "@/utils/colors";

const isMobile = ref(false);

const tutorials = ref<any[]>([]);
// const carouselElements = ref<any[]>([]);
const selectedSubject = ref<string | null>(null);

onMounted(async () => {
  const mediaQuery = useIsMobile();
  watch(
    mediaQuery,
    (val) => {
      isMobile.value = !!val;
    },
    { immediate: true },
  );

  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });
  const tutorielsStory = data?.stories?.find(
    (story: any) => story.slug === "tutoriels",
  );
  tutorials.value = tutorielsStory?.content?.tutorials ?? [];

  // carouselElements.value = tutorials.value.map((tutorial: any) => ({
  //   link: `/tutoriels/${stringToSlug(tutorial.title)}`,
  //   image: tutorial.previewImage.filename,
  //   label: tutorial.title,
  // }));
});

const subjectsList = computed<string[]>(() => {
  if (tutorials.value?.length === 0) return [];

  const flatMap = tutorials.value?.flatMap((t: any) => t.subjects);

  const strings = flatMap
    .filter((s: any) => typeof s === "string")
    .map((s: string) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(strings));
});

const carouselElements = computed(() => {
  let filteredTutorials = tutorials.value;

  if (selectedSubject.value) {
    filteredTutorials = tutorials.value.filter((tutorial: any) =>
      tutorial.subjects.includes(selectedSubject.value),
    );
  }

  return filteredTutorials.map((tutorial: any) => ({
    link: `/tutoriels/${stringToSlug(tutorial.title)}`,
    image: tutorial.previewImage.filename,
    label: tutorial.title,
  }));
});

useHead({
  title:
    "Tutoriels faciles à suivre pour avancer rapidement dans vos démarches immobilières",
  meta: [
    {
      name: "description",
      content:
        "EasyCase vous guide pas à pas dans vos démarches immobilières. Suivez nos tutoriels simples et efficaces pour créer facilement votre dossier de vente.",
    },
  ],
});
</script>

<template>
  <Container>
    <div class="headlines">
      <h1 class="headlines__title">Tutoriels faciles</h1>
      <h2 class="headlines__subtitle paragraphs">
        EasyCase vous guide pas à pas dans vos démarches immobilières.
      </h2>
    </div>
    <div class="subjects-list">
      <UITagComponent
        v-for="subject in subjectsList"
        :key="subject"
        :color="
          selectedSubject === subject
            ? colors['success-color']
            : colors['accent-color']
        "
        @click="selectedSubject = subject"
        ><UITertiaryButton
          :variant="
            selectedSubject === subject ? 'success-color' : 'accent-color'
          "
          >{{ subject }}</UITertiaryButton
        ></UITagComponent
      >
    </div>
    <UICarouselComponent
      v-if="isMobile"
      :carousel-elements="carouselElements"
    />
    <ul v-else class="tutorials-grid">
      <li
        v-for="carouselElement in carouselElements"
        :key="carouselElement.label"
        class="tutorials-grid__item"
      >
        <UICarouselSlide
          :link="`/tutoriels/${stringToSlug(carouselElement.label)}`"
          :image="carouselElement.image"
          :label="carouselElement.label"
          width="100%"
        />
      </li>
    </ul>
  </Container>
</template>
<style scoped lang="scss">
.subjects-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tutorials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  list-style: none;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  &__item {
    display: flex;
    justify-content: center;
    width: fit-content;
    width: 100%;
  }
}
</style>
