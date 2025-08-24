<script setup lang="ts">
interface TutorialStep {
  name: string;
  text: string;
  tip: string;
  image: string;
  link: string;
}

interface TutorialOption {
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
</script>
<template>
  <Container>
    <div class="how-to">
      <img
        class="how-to__preview-image"
        :src="tutorialPreviewImage"
        :alt="tutorialTitle"
      />
      <h1 class="how-to__title">{{ tutorialTitle }}</h1>
      <p class="how-to__description">{{ tutorialDescription }}</p>
      <span class="how-to__last-update">
        Last updated: {{ props.tutorialLastUpdate }}
      </span>

      <div class="how-to__details">
        <p class="how-to__details__time">Total Time: {{ tutorialTotalTime }}</p>
        <p class="how-to__details__cost">Cost: {{ tutorialCost }}</p>
      </div>

      <div class="how-to__prerequisites">
        <h2 class="how-to__prerequisites__title">Prerequisites</h2>
        <ul class="how-to__prerequisites__list">
          <li
            class="how-to__prerequisites__list__element"
            v-for="prerequisite in tutorialPrerequisites"
            :key="prerequisite.name"
          >
            {{ prerequisite.name }}
            <NuxtLink
              v-if="prerequisite.internalLink"
              class="how-to__prerequisites__list__element__link"
              :to="prerequisite.internalLink"
              aria-label="aide"
              ><UISecondaryButton variant="accent-color"
                >Aide</UISecondaryButton
              ></NuxtLink
            >
          </li>
        </ul>
      </div>

      <div class="how-to__options">
        <h2 class="how-to__options__title">Options</h2>
        <ul class="how-to__options__list">
          <li
            class="how-to__options__list__element"
            v-for="option in props.tutorialOptions"
            :key="option.name"
          >
            <h3 class="how-to__options__list__element__title">
              {{ option.name }}
            </h3>
            <ul class="how-to__options__list__element__steps">
              <li
                class="how-to__options__list__element__steps__step"
                v-for="step in option.steps"
                :key="step.name"
              >
                <p
                  class="how-to__options__list__element__steps__step__text"
                ></p>
                {{ step.text }} (Tip: {{ step.tip }})
                <NuxtLink :to="step.link">More info</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="how-to__references">
        <h2>References</h2>
        <ul>
          <li v-for="reference in tutorialReferences" :key="reference">
            <a :href="reference">{{ reference }}</a>
          </li>
        </ul>
      </div>
    </div></Container
  >
</template>
