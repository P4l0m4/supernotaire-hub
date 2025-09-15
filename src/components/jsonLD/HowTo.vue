<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount } from "vue";
import { stringToSlug } from "@/utils/slugify";
import { useResizeObserver } from "@vueuse/core";

import checklist from "/checklist-71-blue.svg?url";

import { colors } from "@/utils/colors";

interface TutorialStep {
  name: string;
  text: string;
  tip: string;
  image: {
    id: number;
    alt: string;
    name: string;
    focus: string;
    title: string;
    source: string;
    filename: string;
    copyright: string;
    metadata: Record<string, any>;
    is_external_url: boolean;
  } | null;
  legend: string;
  link: string;
}

export interface TutorialOption {
  name: string;
  steps: TutorialStep[];
}

interface TutorialPrerequisite {
  name: string;
  internalLink: string;
}

interface Props {
  tutorialTitle: string;
  tutorialDescription: string;
  tutorialPreviewImage: string;
  tutorialTotalTime: string;
  tutorialCost: string;
  tutorialPrerequisites: TutorialPrerequisite[];
  tutorialOptions: TutorialOption[];
  tutorialReferences: string[];
  tutorialLastUpdate: string;
}

const props = defineProps<Props>();

const jsonLDSteps = computed(() =>
  (props.tutorialOptions || []).map((opt, oi) => ({
    "@type": "HowToSection" as const,
    name: opt.name,
    position: oi + 1,
    itemListElement: (opt.steps || []).map((s, si) => {
      const hasTip = !!(s.tip && s.tip.trim());
      return {
        "@type": "HowToStep" as const,
        name: s.name,
        position: si + 1,
        url: s.link || undefined,
        image: s.image?.filename || undefined,
        ...(hasTip
          ? {
              itemListElement: [
                { "@type": "HowToDirection" as const, text: s.text },
                { "@type": "HowToTip" as const, text: s.tip! },
              ],
            }
          : { text: s.text }),
      };
    }),
  }))
);

const jsonLDSupplies = computed(() =>
  (props.tutorialPrerequisites || []).map((p) => ({
    "@type": "HowToSupply" as const,
    name: p.name,
    url: p.internalLink || undefined,
  }))
);

const estimatedCost = computed(() => {
  const n = Number(props.tutorialCost);
  return Number.isFinite(n)
    ? { "@type": "MonetaryAmount" as const, currency: "EUR", value: n }
    : props.tutorialCost; // texte libre si non numérique
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "HowTo" as const,
  name: props.tutorialTitle,
  description: props.tutorialDescription,
  image: props.tutorialPreviewImage,
  totalTime: props.tutorialTotalTime,
  estimatedCost: estimatedCost.value,
  supply: jsonLDSupplies.value.length ? jsonLDSupplies.value : undefined,
  step: jsonLDSteps.value,
  citation: props.tutorialReferences?.length
    ? props.tutorialReferences
    : undefined,
  dateModified: props.tutorialLastUpdate || undefined,
}));

const breadcrumbs = ref();

const tutorialHeight = ref(0);
const scrollPosition = ref(0);
const scrollPercentage = ref(0);

const el = ref<HTMLElement | null>(null);

useResizeObserver(el, (entries) => {
  for (const entry of entries) {
    if (entry.contentRect) {
      tutorialHeight.value = document.body.scrollHeight - window.innerHeight;
    }
  }
});

function handleScroll() {
  scrollPosition.value = window.scrollY;
  scrollPercentage.value = Math.min(
    (scrollPosition.value / tutorialHeight.value) * 100,
    100
  );
}

function seekTo(seek: number) {
  if (process.client && typeof document !== "undefined") {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    window.scrollTo({ top: (max * seek) / 100, behavior: "smooth" });
  }
}

onMounted(() => {
  breadcrumbs.value = [
    {
      name: "Accueil",
      url: "/",
    },
    {
      name: "Tutoriels",
      url: "/tutoriels",
    },
    {
      name: props.tutorialTitle,
      url: window.location.href,
    },
  ];

  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
<template>
  <TutorialsBanner
    :title="tutorialTitle"
    :description="tutorialDescription"
    :last-update="tutorialLastUpdate"
    :total-time="tutorialTotalTime"
    :cost="tutorialCost"
  /><Transition
    ><Teleport to="body"
      ><TutorialsStickyBanner
        v-if="scrollPercentage && scrollPercentage > 15"
        :title="tutorialTitle"
        :scroll-percentage="scrollPercentage"
        @scroll="seekTo" /></Teleport
  ></Transition>
  <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
  <TutorialsSummary
    v-if="props.tutorialOptions.length"
    :options="props.tutorialOptions"
  />
  <div ref="el" class="how-to">
    <div class="how-to__attention">
      <div class="how-to__attention__illustration">
        <img
          class="how-to__attention__illustration__image"
          :src="checklist"
          alt="Avant de commencer"
        />
      </div>
      <div class="how-to__attention__content">
        <span class="how-to__attention__content__title">Prérequis:</span>
        <ul class="how-to__attention__content__list">
          <li
            class="how-to__attention__content__list__element"
            v-for="prerequisite in tutorialPrerequisites"
            :key="prerequisite.name"
          >
            {{ prerequisite.name }}
            <NuxtLink
              v-if="prerequisite.internalLink"
              class="how-to__attention__content__list__element__link"
              :to="prerequisite.internalLink"
              aria-label="aide"
              ><UIIconComponent
                icon="help_circle"
                size="1.25rem"
                :color="colors['text-color-faded']"
            /></NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <ul class="how-to__options">
      <li
        class="how-to__options__element"
        v-for="(option, i) in props.tutorialOptions"
        :key="option.name"
        :id="stringToSlug(option.name)"
      >
        <h2 class="how-to__options__element__title">
          0{{ i + 1 }}. {{ option.name }}
        </h2>
        <ul class="how-to__options__element__steps">
          <li
            class="how-to__options__element__steps__step"
            v-for="step in option.steps"
            :key="step.name"
            :id="stringToSlug(step.name)"
          >
            <h3 class="how-to__options__element__steps__step__title">
              {{ step.name }}
            </h3>
            <div class="how-to__options__element__steps__step__content">
              <figure
                v-if="step.image?.filename"
                class="how-to__options__element__steps__step__content__image"
              >
                <img
                  :src="step.image.filename"
                  :alt="`image ${step.legend ? step.legend : step.name}`"
                />
                <figcaption v-if="step.legend">{{ step.legend }}</figcaption>
              </figure>

              <p
                class="how-to__options__element__steps__step__content__text paragraphs"
              >
                {{ step.text }}
                <NuxtLink
                  v-if="step.link"
                  :to="step.link"
                  target="_blank"
                  class="how-to__options__element__steps__step__content__text__link"
                >
                  <UISecondaryButton variant="accent-color"
                    >Voir l'élément</UISecondaryButton
                  >
                </NuxtLink>
              </p>
            </div>
            <div v-if="step.tip" class="disclaimer">
              <div class="disclaimer__icon">
                <UIIconComponent
                  icon="info"
                  size="2rem"
                  :color="colors['purple-color']"
                />
              </div>

              <span class="disclaimer__text paragraphs">{{ step.tip }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <div v-if="tutorialReferences?.length" class="how-to__references">
      <span class="how-to__references__title">Sources</span>

      <ul class="how-to__references__list">
        <li
          v-for="reference in tutorialReferences"
          :key="reference"
          class="how-to__references__list__element"
        >
          <a :href="reference.link" target="_blank">{{ reference.link }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.how-to {
  display: flex;
  flex-direction: column;
  gap: 4rem;

  &__attention {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 2rem;
    border-radius: $radius;
    background-color: $primary-color;
    width: 100%;
    min-width: 280px;
    height: fit-content;

    @media (min-width: $big-tablet-screen) {
      padding: 1.5rem;
      gap: 3rem;
      flex-direction: row;
      align-items: center;
    }

    &__illustration {
      display: flex;
      width: 100%;
      max-width: 12.5rem;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        background-color: rgba($accent-color, 0.1);
        width: 12rem;
        height: 12rem;
        border-radius:  /* horizontal */ 100% 30% 60% 70% / /* vertical */ 50%
          40% 70% 70%;
        top: 0;
        bottom: 0;
        left: 0;

        @media (min-width: $big-tablet-screen) {
          width: 13rem;
          height: 13rem;
          margin: auto;
        }
      }

      &__image {
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: fit-content;

      &__title {
        font-size: 2.5rem;
        font-weight: $semi-bold;
        text-wrap: balance;
        max-width: 600px;
      }

      &__subtitle {
        font-size: 1.25rem;
        font-weight: $regular;
        text-wrap: balance;
        margin-bottom: 1rem;
      }

      &__list {
        width: 100%;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 30rem;
        height: fit-content;

        @media (min-width: $laptop-screen) {
          max-width: 40rem;
          width: 100%;
        }

        &__element {
          display: flex;
          gap: 0.5rem;
          font-size: 1.05rem;
          text-wrap: balance;

          &::before {
            content: "";
            display: inline-block;
            height: 1rem;
            width: 1rem;
            min-width: 1rem;
            border: 1px solid $text-color;
          }
        }
      }
    }
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    list-style: none;

    &__element {
      scroll-margin-top: 5rem;
      display: flex;
      flex-direction: column;
      gap: 4rem;

      &__title {
        font-size: 2.5rem;
        font-weight: $semi-bold;
        color: $secondary-color;
      }

      &__steps {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 4rem;

        &__step {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          scroll-margin-top: 6rem;

          &__title {
            font-size: 1.5rem;
            font-weight: $medium;
            text-wrap: balance;
          }

          &__content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            text-wrap: balance;

            @media (min-width: $big-tablet-screen) {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              gap: 2rem;
            }

            &__text {
              text-wrap: balance;
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            &__image {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              background-color: rgba($accent-color, 0.1);
              width: 100%;
              height: fit-content;
              max-height: 30rem;
              max-width: 30rem;
              border-radius: calc($radius * 0.5);
              overflow: hidden;

              & img {
                width: 100%;
                height: auto;
              }

              & figcaption {
                display: inline-block;
                font-size: $small-text;
                color: $text-color;
                padding: 0 0.5rem 0.5rem 0.5rem;
                width: 100%;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }

  &__references {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      font-size: 1.5rem;
      font-weight: $medium;
      text-wrap: balance;
    }

    &__list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      &__element {
        display: inline-block;
        width: 100%;
        max-width: 100%;
        font-size: $small-text;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.disclaimer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: rgba($purple-color, 0.1);
  padding: 1rem;
  border-radius: calc($radius / 2);

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
    align-items: center;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 4rem;
    width: 4rem;
    min-height: 4rem;
    height: 4rem;
    padding: 0.5rem;
    border-radius: calc($radius / 2);
    background-color: rgba($purple-color, 0.1);
  }
}
</style>
