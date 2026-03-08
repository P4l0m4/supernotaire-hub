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
    displayDropdown?: boolean;
  }>(),
  {
    title: "Aperçu de la checklist",
    ariaLabel: "Aperçu de la checklist générée",
    displayDropdown: false,
  },
);
</script>
<template>
  <UIHeaderCard
    :title="title"
    icon="file_text"
    :color="colors['accent-color']"
    height="100%"
  >
    <div class="list-preview">
      <div
        v-for="(section, i) in props.sections"
        :key="section.id ?? i"
        class="list-preview__section"
      >
        <h3 class="list-preview__section__title">
          {{ section.title }}
        </h3>

        <ul class="list-preview__section__items" role="list">
        
          <li
            v-for="(item, j) in section.items"
            :key="item.id ?? j"
            class="list-preview__section__items__item"
          >
            <FormElementsCheckboxField
              :id="`section-${i}-item-${j}`"
              :name="`section-${i}-item-${j}`"
              :label="item.label"
            />
          </li>
        </ul>
      </div>
    </div>
  </UIHeaderCard>
</template>

<style scoped lang="scss">
.list-preview {
  max-height: 20.625rem;
  overflow-y: scroll;
  padding-right: 0.75rem;
  position: relative;

  &__section {
    opacity: 1;
        transition: opacity 0.3s ease; 

        @starting-style{
         opacity: 0;
        }

    & + & {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba($text-color, 0.1);
    }

    &__title {
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

      &__item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 1;
        transition: opacity 0.3s ease; 

        @starting-style{
         opacity: 0;
        }
      }
    }
  }
}
</style>
