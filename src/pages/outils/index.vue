<script setup lang="ts">
import calculator from "@/assets/animated-icons/Calculator.svg?raw";
import fileDashed from "@/assets/animated-icons/FileDashed.svg?raw";
import signature from "@/assets/animated-icons/Signature.svg?raw";
import filePDF from "@/assets/animated-icons/FilePdf.svg?raw";
import fileText from "@/assets/animated-icons/FileText.svg?raw";
import filePlus from "@/assets/animated-icons/FilePlus.svg?raw";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "EasyCase | Outils gratuits pour vos démarches immobilières",
  description:
    "Outils gratuits pour la génération de pré-état daté, estimation de valeur foncière, signature électronique et plus encore.",
  url: `${baseUrl}/outils`,
}));

const tools = [
  {
    name: "Créer un Pré-état daté",
    path: "/outils/pre-etat-date",
    description:
      "Créer un pré-état daté conforme à la réglementation en quelques minutes.",
    icon: fileDashed,
  },
  {
    name: "Préparer votre dossier",
    path: "/outils/checklist-dossier-vente-notaire",
    description:
      "Ne perdez plus de temps sur la vente, vous saurez exactement quels documents fournir à votre notaire en quelques minutes.",
    icon: filePlus,
  },
  {
    name: "Estimer une valeur foncière",
    path: "/outils/valeur-fonciere",
    description:
      "Obtenez une estimation rapide et fiable de la valeur foncière de votre bien immobilier.",
    icon: calculator,
  },
  {
    name: "Signer des documents administratifs",
    path: "https://lex.community/",
    target: "_blank",
    description:
      "Signatures en ligne gratuites, sécurisées et illimitées (signatures simples, AES et QES).",
    icon: signature,
  },
  {
    name: "Fusionner des PDF",
    path: "https://www.ilovepdf.com/fr/fusionner_pdf",
    description:
      "Fusionner et combiner des fichiers PDF et les mettre dans l'ordre que vous voulez.",
    target: "_blank",
    icon: filePDF,
  },
  {
    name: "Extraire le texte d'un document",
    path: "/outils/text-from-document",
    description:
      "Extraitre le texte d'un document PDF (scanné ou à base de texte) ou d'une image.",
    icon: fileText,
  },
];

useHead({
  title: "EasyCase | Outils gratuits pour vos démarches immobilières",
  meta: [
    {
      name: "description",
      content:
        "Outils gratuits pour la génération de pré-état daté, estimation de valeur foncière, signature électronique et plus encore.",
    },
  ],
});
</script>
<template>
  <Container>
    <div class="headlines">
      <h1 class="headlines__title">Outils gratuits</h1>
      <h2 class="headlines__subtitle paragraphs">
        Pour faciliter vos démarches immobilières
      </h2>
    </div>
    <div class="tools">
      <NuxtLink
        class="tools__tool"
        v-for="tool in tools"
        :key="tool.name"
        :to="tool.path"
        :target="tool.target ? tool.target : '_self'"
        ><UIPerk
          :icon="tool.icon"
          :title="tool.name"
          :description="tool.description"
        />
      </NuxtLink>
    </div>
  </Container>
  <HotjarTracking />
</template>
<style lang="scss" scoped>
.tools {
  min-height: calc(100vh - 87px);
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $desktop-screen) {
    grid-template-columns: repeat(3, 1fr);
  }

  &__tool {
    display: flex;
    width: 100%;
    height: fit-content;
    transform: scale(1);
    transition: transform 1s cubic-bezier(0.47, 1.64, 0.41, 0.8);

    @starting-style {
      transform: scale(0);
    }

    &__description {
      font-weight: $regular;
      text-wrap: balance;
      color: $text-color-faded;
      transition: color 0.2s ease;
    }
  }
}
</style>
