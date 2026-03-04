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
    isPopupOpen.value = true;
    wasSent.value = false;
  }, 3000);
}

const rules = {
  email: {
    required,
    email,
  },
  option: { required },
};

const vContact$ = useVuelidate(rules, {
  email: emailAdress,
  option: selectedOption,
});
// const form = ref(null);

const emailErrors = computed(() => {
  const errors: string[] = [];
  if (!vContact$.value.email.$dirty) return errors;
  vContact$.value.email.required.$invalid &&
    errors.push("Ajoutez une adresse mail");
  vContact$.value.email.email.$invalid && errors.push("Adresse mail invalide");
  return errors;
});

const optionsErrors = computed(() => {
  const errors: string[] = [];
  if (!vContact$.value.option.$dirty) return errors;
  vContact$.value.option.required.$invalid &&
    errors.push("Sélectionnez une option");
  return errors;
});

async function submitForm() {
  isSubmitting.value = true;
  await emailjs.send(
    "service_am6r8vv",
    "template_v8vtsgd",
    templateParams.value,
    "ZGkiwrxxdhrgjjnRC",
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
    <form class="form-beta" @submit.prevent="submit">
      <FormElementsRadioOption
        v-for="opt in radioOptions"
        :key="opt.id"
        :id="opt.id"
        :name="opt.name"
        :value="opt.value"
        :label="opt.label"
        :description="opt.description"
        v-model="selectedOption"
        :error="optionsErrors[0]"
      />
      <div class="wrapper">
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
          :variant="wasSent ? 'success-color' : 'accent-color'"
          :icon="isSubmitting ? 'circle_notch_bold' : 'hands_clapping_fill'"
          @click="validContactState"
          @keydown.enter="validContactState"
          @keydown.space="validContactState"
          >Rejoindre l'aventure</UIPrimaryButton
        >
      </div>
    </form>
    <ConfirmationPopUp
      v-if="isPopupOpen && selectedOption === 'notaire'"
      @close-confirmation="isPopupOpen = false"
    >
      <template #title>Vous faites partie de l'aventure 🎉</template>
      Envie de soutenir EasyCase dès maintenant ? Bénéficiez de notre offre
      exclusive limitée aux 100 premiers adoptants.
      <template #button>
        <NuxtLink
          to="https://buy.stripe.com/dRm00k7vu51N6jBgKobV600"
          target="_blank"
          style="width: 100%"
          ><UIPrimaryButton variant="accent-color" icon="hand_heart_fill"
            >Devenir Notaire Fondateur</UIPrimaryButton
          ></NuxtLink
        >
      </template>
    </ConfirmationPopUp>
    <ConfirmationPopUp
      v-else-if="isPopupOpen && selectedOption === 'vendeur'"
      @close-confirmation="isPopupOpen = false"
    >
      <template #title>Vous faites partie de l'aventure 🎉</template>
      Envie de gagner du temps dès maintenant ? Préparez votre dossier en
      quelques clics et gagnez des semaines sur votre vente.
      <template #button>
        <NuxtLink
          to="/outils/checklist-dossier-vente-notaire"
          style="width: 100%"
          ><UIPrimaryButton variant="accent-color" icon="hand_heart_fill"
            >Préparer gratuitement mon dossier</UIPrimaryButton
          ></NuxtLink
        >
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

.form-beta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    align-items: center;

    @media (min-width: $tablet-screen) {
      flex-direction: row;
    }
  }
}
</style>
