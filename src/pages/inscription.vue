<script setup lang="ts">
useHead({
  title:
    "Supernotaire | Inscrivez-vous pour avancer rapidement sur votre dossier de vente immobilière",
  meta: [
    {
      name: "description",
      content:
        "Créez facilement votre dossier de vente immobilière et confiez-le rapidement à un notaire, où que vous soyez.",
    },
  ],
});
</script>
<template>
  <Container
    ><div class="inscription"><h1 class="titles">Créez votre compte</h1></div>

    <InscriptionComponent />
  </Container>
</template>
<style lang="scss" scoped>
.inscription {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 4rem 0;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    justify-content: center;
    align-items: center;
  }

  &__headlines {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    text-align: center;

    .titles,
    .subtitles {
      color: $text-color;
    }
  }
}
</style>
