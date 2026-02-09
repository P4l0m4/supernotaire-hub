<script setup lang="ts">
import { colors } from "@/utils/colors";

const props = defineProps({
  links: {
    type: Array as PropType<{ name: string; url: string }[]>,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: `${colors["text-color"]}70`,
  },
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: props.links.map((item: any, index: any) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
}));
</script>

<template>
  <section class="breadcrumbs">
    <NuxtLink
      :to="link.url"
      class="breadcrumbs__breadcrumb"
      v-for="(link, i) in links"
      :key="link.name"
      :style="{
        color: color,
        pointerEvents: i === links.length - 1 ? 'none' : 'auto',
      }"
      ><span class="breadcrumbs__breadcrumb__name">{{ link.name }}</span>
      <UIIconComponent
        v-if="i !== links.length - 1"
        icon="caret_right_bold"
        :color
        size="0.75rem"
    /></NuxtLink>
  </section>
</template>
<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  flex-wrap: wrap;

  @media (min-width: $big-tablet-screen) {
    flex-wrap: nowrap;
  }

  &__breadcrumb {
    display: flex;
    width: fit-content;
    max-width: 100%;
    font-weight: $regular;
    font-size: 1rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition:
      filter 0.3s linear,
      font-weight 0.3s linear;

    &:hover {
      filter: contrast(4);
      font-weight: $medium;
    }

    &__name {
      display: inline-block;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
