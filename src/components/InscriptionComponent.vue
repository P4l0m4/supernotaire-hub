<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import emailjs from "@emailjs/browser";
import { required, email } from "@vuelidate/validators";
import { ref } from "vue";

const isPopupOpen = ref(false);

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

const emailAdress = ref("");

const isSubmitting = ref(false);
const wasSent = ref(false);

const templateParams = computed(() => ({
  email: emailAdress.value,
  option: selectedOption.value,
}));

function confirmSubmission() {
  isSubmitting.value = false;
  wasSent.value = true;
  vContact$.value.$reset();
  emailAdress.value = "";

  setTimeout(() => {
    wasSent.value = false;
  }, 3000);
}

const rules = {
  email: {
    required,
    email,
  },
};

const vContact$ = useVuelidate(rules, { email: emailAdress });
const form = ref(null);

const emailErrors = computed(() => {
  const errors: string[] = [];
  if (!vContact$.value.email.$dirty) return errors;
  vContact$.value.email.required.$invalid &&
    errors.push("Ajoutez une adresse mail");
  vContact$.value.email.email.$invalid && errors.push("Adresse mail invalide");
  return errors;
});

async function submitForm() {
  isSubmitting.value = true;
  await emailjs.send(
    "service_am6r8vv",
    "template_v8vtsgd",
    templateParams.value,
    "ZGkiwrxxdhrgjjnRC"
  );

  confirmSubmission();
}

async function validContactState() {
  const valid = await vContact$.value.$validate();

  if (valid) {
    submitForm();
  }
}
</script>
<template>
  <div class="inscription-component">
    <FormElementsRadioOption
      v-for="opt in radioOptions"
      :key="opt.id"
      :id="opt.id"
      :name="opt.name"
      :value="opt.value"
      :label="opt.label"
      :description="opt.description"
      v-model="selectedOption"
    />
    <UIPrimaryButton
      variant="accent-color"
      icon="arrow_right"
      style="margin-top: 0.5rem"
      @click="isPopupOpen = true"
      @keydown.enter="isPopupOpen = true"
      @keydown.space="isPopupOpen = true"
      tabindex="0"
      >Continuer</UIPrimaryButton
    >
    <ConfirmationPopUp
      v-if="isPopupOpen"
      @close-confirmation="isPopupOpen = false"
    >
      <template #title>Merci de votre intérêt pour Supernotaire !</template>
      La plateforme est encore en développement, mais vous pouvez rejoindre la
      bêta et nous suivre sur les réseaux sociaux ⚡
      <template #button>
        <div class="buttons">
          <form
            class="form-beta"
            ref="form"
            @submit.prevent="submit"
            @click="$event.stopPropagation()"
          >
            <FormElementsInputField
              v-if="!wasSent"
              id="beta-email"
              name="beta-email"
              v-model="emailAdress"
              type="email"
              autocomplete="on"
              :autofocus="true"
              label="Votre adresse mail"
              placeholder="Votre adresse mail"
              icon="mail"
              :error="emailErrors[0]"
              style="width: 100%"
            />

            <UIPrimaryButton
              v-if="!wasSent"
              variant="accent-color"
              :icon="isSubmitting ? 'circle_notch_bold' : 'hands_clapping_fill'"
              style="width: fit-content"
              @click="validContactState"
              @keydown.enter="validContactState"
              @keydown.space="validContactState"
              >Rejoindre</UIPrimaryButton
            >
            <span v-if="wasSent" class="form-beta__success-message"
              >Demande bien reçue 👌</span
            >
          </form>
          <NuxtLink
            to="https://www.linkedin.com/in/aurore-sajot/"
            target="_blank"
            style="width: 100%"
            ><UISecondaryButton variant="secondary-color" icon="linkedin_logo"
              >Suivre le projet</UISecondaryButton
            ></NuxtLink
          >
        </div>
      </template>
    </ConfirmationPopUp>
  </div>
</template>
<style lang="scss" scoped>
.inscription-component {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 700px;
  height: fit-content;
  margin: 0 auto;
  padding: 0 !important;
  align-items: end;
}

.buttons {
  display: flex;
  gap: 1rem;
  width: 100%;
  flex-direction: column;
}

.form-beta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    flex-direction: row;
  }

  &__success-message {
    display: flex;
    height: 55px;
    align-items: center;
    justify-content: center;
    color: $success-color;
    font-size: 1rem;
    font-weight: $medium;
    width: 100%;
  }
}
</style>
