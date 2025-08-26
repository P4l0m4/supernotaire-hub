<script setup lang="ts">
const tools = [
  {
    name: "Extraire le texte d'un document",
    path: "/outils/text-from-document",
    description:
      "Extraitre le texte d'un document PDF (scannés ou à base de texte) ou d'une image.",
  },
  {
    name: "Créer un Pré-état daté",
    path: "/outils/pre-etat-date",
    description:
      "Créer un pré-état daté conforme à la réglementation en quelques minutes.",
  },
  {
    name: "Signer des documents administratifs",
    path: "https://lex.community/",
    target: "_blank",
    description:
      "Signatures en ligne gratuites, sécurisées et illimitées (signatures simples, AES et QES).",
  },
  {
    name: "Fusionner des PDF",
    path: "https://www.ilovepdf.com/fr/fusionner_pdf",
    description:
      "Fusionner et combiner des fichiers PDF et les mettre dans l'ordre que vous voulez.",
    target: "_blank",
  },
];
</script>
<template>
  <Container>
    <div class="tools">
      <NuxtLink
        class="tools__tool"
        v-for="tool in tools"
        :key="tool.name"
        :to="tool.path"
        :target="tool.target ? tool.target : '_self'"
        >{{ tool.name }}
        <p class="tools__tool__description paragraphs">
          {{ tool.description }}
        </p>
      </NuxtLink>
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.tools {
  min-height: calc(100vh - 87px);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 4rem 0;
  }

  &__tool {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    font-size: 1.25rem;
    font-weight: $medium;
    border-radius: calc($radius/2);
    border: 1px solid rgba($secondary-color, 0.1);
    width: 100%;
    height: 100%;
    transition: transform 0.2s linear, color 0.2s ease,
      background-color 0.2s ease, border 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      color: $success-color;
      background-color: rgba($success-color, 0.1);
      border: 1px solid transparent;

      & .tools__tool__description {
        color: $text-color;
      }
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
