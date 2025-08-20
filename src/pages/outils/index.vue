<script setup lang="ts">
const tools = [
  {
    name: "Extracteur de texte à partir d'un document",
    path: "/outils/text-from-document",
  },
  { name: "Générateur de Pré-état daté", path: "/outils/pre-etat-date" },
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
        >{{ tool.name }}</NuxtLink
      >
    </div>
  </Container>
</template>
<style lang="scss" scoped>
.tools {
  min-height: calc(100vh - 87px);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: $big-tablet-screen) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 4rem 0;
  }

  &__tool {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    font-size: 1.25rem;
    border-radius: calc($radius/2);
    border: 1px solid rgba($secondary-color, 0.1);
    width: 100%;
    height: 100%;
    transition: transform 0.2s linear, color 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      color: $success-color;
      background-color: rgba($success-color, 0.1);
      border: 1px solid transparent;
    }
  }
}
</style>
