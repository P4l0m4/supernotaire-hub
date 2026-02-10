<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref } from "vue";

import { stringToSlug } from "@/utils/slugify";

import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import coproFormDefinition from "@/utils/formDefinition/checklist-copro-structures.json";
import { buildDocDefinition as buildCoproDocDefinition } from "@/utils/docDefinitions/checklist-copro-structures";

const carouselElements = ref<any[]>([]);
const currentSubjects = ["Copropriété"];
const tutorials = ref<any[]>([]);

onMounted(async () => {
  try {
    const storyblokApi = useStoryblokApi();
    const { data } = await storyblokApi.get("cdn/stories", {
      version: "published",
    });
    const tutorialsFromApi = data?.stories?.[0]?.content?.tutorials ?? [];
    tutorials.value = tutorialsFromApi;
    // tutorials sharing at least one subject with the subjects array
    carouselElements.value = tutorialsFromApi
      .filter((t: any) =>
        t.subjects?.some((s: string) => currentSubjects.includes(s)),
      )
      .map((t: any) => ({
        link: `/tutoriels/${stringToSlug(t.title)}`,
        image: t.previewImage?.filename ?? "",
        label: t.title ?? "",
      }));
  } catch (error) {
    tutorials.value = [];
    carouselElements.value = [];
  }
});
</script>

<template>
  <RubriqueBase
    sectionId="copro"
    title="Copropriété & Structures collectives"
    storageKey="sn-checklist-copro"
    pdfPrefix="copropriete-structures"
    :formDefinition="coproFormDefinition"
    :docBuilder="buildCoproDocDefinition"
    :requireAccess="true"
  /><template v-if="carouselElements.length > 0">
    <h3 class="titles" style="width: 100%">
      Tutoriels en lien avec cette rubrique
    </h3>
    <UICarouselComponent :carousel-elements="carouselElements"
  /></template>
</template>
