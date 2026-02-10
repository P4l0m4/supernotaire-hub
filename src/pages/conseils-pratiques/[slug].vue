<script setup lang="ts">
import { renderRichText, useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref, computed } from "vue";
import { stringToSlug } from "@/utils/slugify";

const articles = ref<any[]>([]);

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

const route = useRoute();
const articleSlug = route.params.slug;
const article = computed(() =>
  articles.value.find((f: any) => stringToSlug(f.title) === articleSlug),
);

const articleBodyHtml = computed(() => {
  const body = article.value?.body;
  if (!body) return "";

  if (typeof body === "string") {
    return body.replace(/\n/g, "<br>");
  }

  if (typeof body === "object" && "type" in body) {
    try {
      return renderRichText(body);
    } catch {
      return "";
    }
  }

  return "";
});

const articleDescription = computed(() => {
  const body = article.value?.body;
  if (!body) return "";

  const toPlainText = (value: string) =>
    value
      // keep explicit line breaks
      .replace(/<br\s*\/?>/gi, "\n")
      // add spacing before removing common block tags
      .replace(/<\/?(p|div|li|ul|ol|section|article|h[1-6])[^>]*>/gi, "\n")
      // decode non-breaking spaces
      .replace(/&nbsp;/gi, " ")
      // strip remaining tags
      .replace(/<[^>]+>/g, "");

  if (typeof body === "string") {
    return body.substring(0, 160);
  }

  if (typeof body === "object" && "type" in body) {
    try {
      const html = renderRichText(body);
      return toPlainText(html || "").substring(0, 160);
    } catch {
      return "";
    }
  }

  return "";
});

useJsonld(() => {
  if (!article.value) return {};
  const url = `https://easycase.fr/conseils-pratiques/${articleSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.value.title,
    description: articleDescription.value,
  };
});

useHead(() => {
  if (!article.value) return {};
  return {
    title: article.value.title,
    meta: [
      {
        name: "description",
        content: articleDescription.value,
      },
    ],
  };
});

const breadcrumbs = ref([
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Conseils pratiques",
    url: "/conseils-pratiques",
  },
  {
    name: `${article.value?.title.substring(0, 40) || "Article"}`,
    url: `/conseils-pratiques/${articleSlug}`,
  },
]);
</script>
<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs?.length" :links="breadcrumbs" />
    <div class="article">
      <h1 class="article__title">{{ article?.title }}</h1>
      <div class="article__body" v-html="articleBodyHtml"></div>
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.article {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  &__title {
    font-size: 1.5rem;
    font-weight: $medium;
    max-width: 40rem;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    line-height: 1.6;
  }
}
</style>
