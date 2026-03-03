<script setup lang="ts">
useHead({
  title:
    "EasyCase | Inscrivez-vous pour avancer rapidement sur votre dossier de vente immobilière",
  meta: [
    {
      name: "description",
      content:
        "Facilitez vos formalités immobilières. Créez facilement votre dossier en ligne et confiez-le rapidement à un notaire, où que vous soyez.",
    },
  ],
});
</script>
<template>
  <Container
    ><div class="inscription">
      <div class="inscription__headlines">
        <h1 class="titles">Rejoignez l'accès anticipé</h1>
        <h2 class="subtitles">
          Profitez en avant-première des fonctionnalités d'EasyCase 🚀
        </h2>
      </div>

      <InscriptionComponent />
    </div>
  </Container>
  <HotjarTracking />
</template>
<style lang="scss" scoped>
.inscription {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: fit-content;

  @media (min-width: $big-tablet-screen) {
    padding: 4rem 0;
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
