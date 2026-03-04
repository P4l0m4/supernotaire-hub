<script setup lang="ts">
import { colors } from "@/utils/colors";

export type ListItem = {
  id?: string | number;
  label: string;
};

export type ListSection = {
  id?: string | number;
  title: string;
  items: ListItem[];
};

const props = withDefaults(
  defineProps<{
    title?: string;
    sections: ListSection[];
    ariaLabel?: string;
  }>(),
  {
    title: "Aperçu de la checklist",
    ariaLabel: "Aperçu de la checklist générée",
  },
);

const { title, sections, ariaLabel } = props;

const FULL_VISIBLE_SECTIONS = 2;
const PARTIAL_SECTION_ITEMS = 1;
const isExpanded = ref(false);

const hasExtraSections = computed(
  () => sections.length > FULL_VISIBLE_SECTIONS,
);

const visibleSections = computed(() => {
  if (isExpanded.value) return sections;

  const baseSections = sections.slice(0, FULL_VISIBLE_SECTIONS);
  const partialSection = sections[FULL_VISIBLE_SECTIONS];

  if (!partialSection) return baseSections;

  return [
    ...baseSections,
    {
      ...partialSection,
      items: partialSection.items.slice(0, PARTIAL_SECTION_ITEMS),
    },
  ];
});

const showPreviewFade = computed(
  () => !isExpanded.value && sections.length > FULL_VISIBLE_SECTIONS,
);

const toggleSections = () => {
  if (!hasExtraSections.value) return;
  isExpanded.value = !isExpanded.value;
};
</script>
<template>
  <section id="list-preview" class="list-preview" :aria-label="ariaLabel">
    <header class="list-preview__header">
      <UIWrappedIcon
        :color="colors['accent-color']"
        size="big"
        icon="file_text_fill"
      />
      <h2 class="list-preview__title">
        {{ title }}
      </h2>
    </header>

    <div
      class="list-preview__body"
      :class="{ 'list-preview__body--faded': showPreviewFade }"
    >
      <div
        v-for="(section, sIdx) in visibleSections"
        :key="section.id ?? sIdx"
        class="list-preview__section"
      >
        <h3 class="list-preview__section-title">
          {{ section.title }}
        </h3>

        <ul class="list-preview__items" role="list">
          <li
            v-for="(item, iIdx) in section.items"
            :key="item.id ?? iIdx"
            class="list-preview__item"
          >
            <FormElementsCheckboxField
              :id="`section-${sIdx}-item-${iIdx}`"
              :name="`section-${sIdx}-item-${iIdx}`"
              :label="item.label"
            />
          </li>
        </ul>
      </div>
    </div>

    <footer class="list-preview__footer">
      <button
        v-if="hasExtraSections"
        class="list-preview__toggle"
        type="button"
        :aria-expanded="isExpanded"
        @click="toggleSections"
      >
        <span class="list-preview__note list-preview__note--interactive">
          {{ isExpanded ? "Réduire la liste" : "Voir la liste complète" }}
          <UIIconComponent
            :icon="isExpanded ? 'caret_up_bold' : 'caret_down_bold'"
            size="0.85rem"
          />
        </span>
      </button>
      <span v-else class="list-preview__note"
        >Pas d'autres éléments à afficher</span
      >
    </footer>
  </section>
</template>

<style scoped lang="scss">
.list-preview {
  width: 100%;
  max-width: 30rem;
  border-radius: calc($radius/2);
  background: $primary-color;
  position: relative;

  &::after {
    content: "";
    background-color: rgba($accent-color, 0.1);
    border-radius: calc($radius / 2);
    bottom: -0.75rem;
    right: -0.75rem;
    top: 0.75rem;
    left: 0.75rem;
    position: absolute;
    width: 100%;
    z-index: -1;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba($accent-color, 0.1);
    border-bottom: 1px solid rgba($text-color, 0.1);
    border-radius: calc($radius/2) calc($radius/2) 0 0;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
      gap: 1rem;
    }
  }

  &__title {
    font-size: 1.25rem;
    line-height: 1.2;
    font-weight: $semi-bold;
    color: $text-color;
  }

  &__body {
    padding: 1rem;
    position: relative;
    overflow: hidden;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
    }
  }

  &__section {
    & + & {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba($text-color, 0.1);
    }
  }

  &__section-title {
    margin: 0 0 1rem 0;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: $semi-bold;
    color: $accent-color;
  }

  &__items {
    list-style: none;
    display: grid;
    gap: 0.75rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__body--faded::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3.5rem;
    background: linear-gradient(180deg, transparent, rgba($primary-color, 1));
    pointer-events: none;
  }

  &__footer {
    padding: 1rem;
    border-top: 1px solid rgba($text-color, 0.1);
    background: rgba($text-color, 0.05);
    border-radius: 0 0 calc($radius/2) calc($radius/2);

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
    }
  }

  &__toggle {
    width: 100%;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 2rem;
    transition: color 0.2s ease;

    &:focus-visible {
      outline: 2px solid rgba($accent-color, 0.35);
      outline-offset: 4px;
      border-radius: 6px;
    }
  }

  &__note--interactive {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  &__note {
    text-align: center;
    font-size: 0.75rem;
    font-style: italic;
    color: rgba($text-color, 0.6);
  }
}
</style>
