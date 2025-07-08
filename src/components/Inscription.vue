<script setup lang="ts">
import { ref } from "vue";
const selectedOption = ref("vendeur");

const radioOptions = [
  {
    id: "option1",
    name: "options",
    value: "vendeur",
    label: "J'ai un bien à vendre",
    description: "Je veux finaliser la vente rapidement, sans difficultés",
  },
  {
    id: "option2",
    name: "options",
    value: "notaire",
    label: "Je suis notaire",
    description:
      "Je veux gérer plus de mandats sans augmenter ma charge de travail",
  },
];
</script>
<template>
  <div class="inscription">
    <FormelementsRadioOption
      v-for="radioOption in radioOptions"
      :key="radioOption.id"
      :id="radioOption.id"
      :name="radioOption.name"
      :value="radioOption.value"
      :label="radioOption.label"
      :description="radioOption.description"
      :checked="radioOption.value === selectedOption"
      v-model="selectedOption"
    />
    <PrimaryButton
      variant="accent-color"
      icon="arrow_right"
      style="margin-top: 0.5rem"
      >Continuez</PrimaryButton
    >
    <ConfirmationPopUp>
      <template #title>Merci de votre intérêt pour Supernotaire !</template>
      Nous ne sommes pas encore ouverts au public, mais vous pouvez suivre le
      développement de la plateforme sur
      <template #button>
        <NuxtLink to="https://www.linkedin.com/in/aurore-sajot/" target="_blank"
          ><PrimaryButton variant="secondary-color"
            >LinkedIn</PrimaryButton
          ></NuxtLink
        ></template
      >
    </ConfirmationPopUp>
  </div>
</template>
<style lang="scss" scoped>
.inscription {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 0;
  align-items: end;
}
</style>
