<script setup lang="ts">
import { useStoryblokApi } from "@storyblok/vue";
import { onMounted, ref } from "vue";

import { stringToSlug } from "@/utils/slugify";

import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import diagnosticsTravauxInterieursFormDefinition from "@/utils/formDefinition/checklist-diagnostics-travaux-interieurs.json";
import { buildDocDefinition as buildDiagnosticsTravauxInterieursDocDefinition } from "@/utils/docDefinitions/checklist-diagnostics-travaux-interieurs";

const carouselElements = ref<any[]>([]);
const currentSubjects = ["Diagnostics"];
const tutorials = ref<any[]>([]);

onMounted(async () => {
  try {
    const storyblokApi = useStoryblokApi();
    const { data } = await storyblokApi.get("cdn/stories", {
      version: "published",
    });

    const tutorielsStory = data?.stories?.find(
      (story: any) => story.slug === "tutoriels",
    );

    tutorials.value = tutorielsStory?.content?.tutorials ?? [];

    carouselElements.value = tutorials.value
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
    sectionId="diagnostics-travaux-interieurs"
    title="Diagnostics & Travaux intérieurs"
    storageKey="sn-checklist-diagnostics-travaux-interieurs"
    pdfPrefix="diagnostics-travaux-interieurs"
    :formDefinition="diagnosticsTravauxInterieursFormDefinition"
    :docBuilder="buildDiagnosticsTravauxInterieursDocDefinition"
    :requireAccess="true"
  />
  <template v-if="carouselElements.length > 0">
    <h3 class="titles" style="width: 100%">
      Tutoriels en lien avec cette rubrique
    </h3>
    <UICarouselComponent :carousel-elements="carouselElements"
  /></template>
</template>
