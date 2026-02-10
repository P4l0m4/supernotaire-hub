<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref, computed } from "vue";
import { stringToSlug } from "@/utils/slugify";
import { colors } from "@/utils/colors";

const articles = ref<any[]>([]);
const selectedSubject = ref<string | null>(null);

const subjectsList = computed<string[]>(() => {
  if (articles.value.length === 0) return [];

  const flatMap = articles.value.flatMap((t: any) => t.tags);

  const strings = flatMap
    .filter((s: any) => typeof s === "string")
    .map((s: string) => s.trim())
    .filter(Boolean);

  return Array.from(new Set(strings));
});

// create a hex color from the tags to use as background color for the article cards
const tagColor = (tags: string[]) => {
  if (tags.length === 0) return colors["accent-color"];

  const hash = tags.reduce((acc, tag) => {
    let tagHash = 0;
    for (let i = 0; i < tag.length; i++) {
      tagHash = tag.charCodeAt(i) + ((tagHash << 5) - tagHash);
    }
    return acc + tagHash;
  }, 0);

  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  return `rgba(${r}, ${g}, ${b}, 0.8)`;
};

const articlesElements = computed(() => {
  let filteredArticles = articles.value;

  if (selectedSubject.value) {
    filteredArticles = articles.value.filter((article: any) =>
      article.tags.includes(selectedSubject.value),
    );
  }

  return filteredArticles.map((article: any) => ({
    link: `/conseils-pratiques/${stringToSlug(article.title)}`,
    backgroundColor: tagColor(article.tags),
    title: article.title,
  }));
});

onMounted(async () => {
  const storyblokApi = useStoryblokApi();
  const { data } = await storyblokApi.get("cdn/stories", {
    version: "published",
  });

  const articlesStory = data?.stories?.find(
    (story: any) => story.slug === "articles",
  );

  articles.value = articlesStory?.content?.articles ?? [];
});

useHead({
  title:
    "Conseils pratiques pour éviter les pièges et les retards dans vos démarches immobilières",
  meta: [
    {
      name: "description",
      content:
        "Suivez nos conseils simples et efficaces sur l'exonération de la plus-value, les diagnostics immobiliers, les pièges à éviter, et bien plus encore.",
    },
  ],
});
</script>
<template>
  <Container
    ><div class="headlines">
      <h1 class="headlines__title">Conseils pratiques</h1>
      <h2 class="headlines__subtitle paragraphs">
        Pour vous aider à éviter les pièges, faire des économies, et avancer
        plus rapidement dans vos démarches immobilières.
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
    <div class="articles-grid">
      <NuxtLink
        v-for="article in articlesElements"
        :to="article.link"
        class="article-card fading"
        :style="{ backgroundColor: article.backgroundColor }"
        :aria-label="`Lire l'article : ${article.title}`"
      >
        <span class="article-card__arrow">
          <UIIconComponent icon="arrow_up_right" />
        </span>
        <span class="article-card__title">{{ article.title }}</span>
      </NuxtLink>
    </div></Container
  >
</template>
<style scoped lang="scss">
.subjects-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  list-style: none;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (min-width: $desktop-screen) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
}

.article-card {
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
  gap: 1rem;
  padding: 1rem;
  width: 100%;
  border-radius: $radius;
  position: relative;
  overflow: hidden;
  transition:
    filter 0.3s linear,
    box-shadow 0.3s ease;
  filter: grayscale(30%);

  &:hover {
    filter: grayscale(0%);
    box-shadow: 20px 40px 40px -30px rgba($text-color, 0.05);

    & .carousel-slide__arrow {
      transform: rotate(15deg);
    }
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(45deg, $text-color, transparent 60%);
    opacity: 0.8;
  }

  @media (min-width: $big-tablet-screen) {
    min-width: 360px;
    height: 280px;
    padding: 1.5rem;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: $medium;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: left;
    border-radius: calc($radius * 0.5);
    color: $text-color-alt;
    height: 100%;
    z-index: 1;
    line-height: 1.5;
    box-shadow: $shadow-black;
  }

  &__arrow {
    padding: 0.5rem;
    background-color: $base-color;
    border-radius: $radius;
    display: flex;
    justify-content: center;
    align-items: center;
    height: fit-content;
    z-index: 1;
    box-shadow: $shadow-black;
    width: fit-content;
    margin-bottom: auto;
    transition: transform 0.3s ease;
  }
}
</style>
