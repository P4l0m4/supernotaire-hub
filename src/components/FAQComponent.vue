<script setup lang="ts">
interface FAQQuestion {
  title: string;
  answer: string;
}

const props = defineProps({
  questions: {
    type: Array as () => FAQQuestion[] | [],
    required: true,
  },
});

const questionOpened = ref();
function toggleQuestion(index: number) {
  if (questionOpened.value === index) {
    questionOpened.value = undefined;
  } else {
    questionOpened.value = index;
  }
}

const jsonLDFAQ = props.questions?.map((question) => {
  return {
    "@type": "Question" as const,
    name: question.title,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: question.answer,
    },
  };
});

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage" as const,
  mainEntity: jsonLDFAQ,
}));
</script>
<template>
  <div class="faq-component" v-if="questions && questions.length">
    <div
      class="faq-component__card"
      :class="{ 'faq-component__card--opened': questionOpened === index }"
      v-for="(question, index) in questions"
      :key="index"
      @click="toggleQuestion(index)"
    >
      <h5 class="faq-component__card__question">
        {{ question.title }}
        <UIIconComponent
          :icon="
            questionOpened === index ? 'caret_down_bold' : 'caret_right_bold'
          "
          size="1.5rem"
        />
      </h5>
      <p class="faq-component__card__answer" v-if="questionOpened === index">
        {{ question.answer }}
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.faq-component {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: fit-content;
  gap: 1rem;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 2rem;
  }

  @media (min-width: $desktop-screen) {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }

  &__card {
    border-radius: $radius;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    max-width: 800px;
    height: fit-content;
    gap: 1rem;
    padding: 1rem;
    cursor: pointer;
    background-color: $base-color;
    border: 1px solid darken($base-color, 5%);

    @media (min-width: $big-tablet-screen) {
      min-width: 500px;
      padding: 1.5rem;
      min-height: 6.5rem;
    }

    &--opened {
      background-color: darken($base-color, 2%);
      border: 1px solid transparent;
    }

    &__question {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      height: fit-content;
      font-size: 1rem;
      font-weight: $regular;
      color: $text-color;
      text-wrap: balance;

      @media (min-width: $big-tablet-screen) {
        font-size: $subtitles;
      }
    }

    &__answer {
      font-size: 1rem;
      font-weight: $regular;
      animation: fading 0.3s;
      width: 100%;
      line-height: $subtitles;
      color: $text-color;
    }

    &__link {
      animation: fading 0.4s;
      width: fit-content;
      color: $text-color;
    }
  }
}
</style>
